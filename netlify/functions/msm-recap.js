/**
 * BurnsBuilt — MSM Auto Recap Writer
 * ==================================================================
 * Drafts a 2-sentence game recap in friendly local-paper voice.
 *
 * TWO INPUT MODES:
 *
 * Structured (legacy):
 *   POST {
 *     "team1": "Aledo Bearcats", "team2": "DFW Stallions",
 *     "score1": 6, "score2": 4,
 *     "division": "6th Grade", "round": "pool play",
 *     "notes": "Optional 1-3 line note"
 *   }
 *
 * Paste-from-GameChanger (new):
 *   POST {
 *     "rawText": "<copy/paste from GameChanger recap or box score>",
 *     "division": "6th Grade",  // optional override
 *     "round": "pool play"      // optional override
 *   }
 *
 * Optional persistence:
 *   "post": true          → also saves the drafted recap to Netlify
 *                          Blobs (store "msm-recaps"). The msm-recaps-list
 *                          function reads from there.
 *
 * Auth: X-Admin-Key header.
 *
 * Response:
 *   { ok: true,
 *     title, recap,
 *     meta: { winner, score, division, round },
 *     posted: true|false }
 *
 * Required env: GEMINI_API_KEY, ADMIN_KEY
 * ==================================================================
 */

import { getStore } from "@netlify/blobs";

const GEMINI_MODEL = "gemini-2.5-flash";
const BLOB_STORE = "msm-recaps";

const SYSTEM_PROMPT_STRUCTURED = `You write short, friendly recaps for a youth baseball tournament — Middle School Matchup, DFW West.

Voice: warm, neighborly, like a local paper or a parent at the diamond. NOT sports-broadcast hype. NOT corporate. We use #happybaseball — think Banana Ball, not travel ball.

Rules:
- 2 sentences total. Under 60 words.
- Mention the score and the winning team. Mention division and round if provided.
- If notes mention specific jersey numbers or generic player descriptors, you can include them. Do NOT invent player names. Do NOT use any names not present in the input notes.
- Write a punchy 5-8 word title that names the winner and the score (e.g. "Bearcats edge Stallions 6–4").
- Return ONLY valid JSON. No markdown, no code fences.

Output shape:
{ "title": "<5-8 words>", "recap": "<2 sentences, under 60 words>" }`;

const SYSTEM_PROMPT_RAW = `You parse and rewrite youth-baseball game content for Middle School Matchup (MSM), DFW West.

You may receive raw text pasted from GameChanger, a screenshot of a GameChanger box score, or both. When given an image, read all visible text carefully: team names, final score, inning-by-inning grid, hitting leaders (look at H, R, RBI columns), pitching lines (IP, H, R, ER, BB, SO), and the 2B/HR/SB/HBP/E summary rows. Use jersey numbers ("#10") when they're shown.

Your job: extract what matters and write a 2-sentence MSM-voice recap.

Voice: warm, neighborly, like a local paper or a parent at the diamond. NOT sports-broadcast hype. NOT corporate. We're #happybaseball — think Banana Ball, not travel ball.

Extraction rules:
- Pull the two team names exactly as written in the input. If GameChanger uses club + age format, keep it natural ("Bearcats" rather than "Aledo Bearcats Baseball 12U").
- Pull the final score. Format as "winner–loser" (e.g., "6–4"). Use en-dash.
- If a standout play is obvious (walk-off, big inning, dominant pitching, comeback), mention it briefly. Do NOT invent details.
- Do NOT use any player names that aren't in the input. Jersey numbers ("#12") are fine if mentioned.
- Discard inning-by-inning play-by-play padding. Two sentences, not a recap of every at-bat.

Output rules:
- 2 sentences total. Under 60 words.
- Title is 5-8 words, names the winner and the score (e.g., "Bearcats edge Stallions 6–4").
- Return ONLY valid JSON. No markdown, no code fences.

Output shape:
{
  "title": "<5-8 words>",
  "recap": "<2 sentences, under 60 words>",
  "winner": "<winning team name as you'd display it>",
  "loser":  "<losing team name>",
  "score":  "<like 6–4, winner first>"
}`;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const callGemini = async ({ system, user, imageBase64, imageMime }) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const parts = [{ text: user }];
  if (imageBase64) {
    parts.push({ inlineData: { mimeType: imageMime || "image/png", data: imageBase64 } });
  }
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.6,
        // 2.5 Flash with multimodal needs more headroom; thinking tokens count against this too
        maxOutputTokens: 1200,
        responseMimeType: "application/json",
        // Disable extended "thinking" so token budget goes to the actual JSON output
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  });
  if (!r.ok) throw new Error(`Gemini API ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const data = await r.json();

  // Surface finish reason for diagnostics — common values: STOP, MAX_TOKENS, SAFETY, RECITATION
  const cand = data?.candidates?.[0];
  const finish = cand?.finishReason;
  const text = cand?.content?.parts?.[0]?.text || "";

  if (!text) {
    throw new Error(`Gemini returned empty response (finishReason=${finish || "?"})`);
  }
  try {
    return JSON.parse(text);
  } catch (parseErr) {
    // Last-ditch: try to repair common LLM JSON mistakes (trailing comma, fences)
    const cleaned = text
      .replace(/^\s*```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/, "")
      .trim();
    try {
      return JSON.parse(cleaned);
    } catch {
      // Still broken — throw a useful error so the client can see what Gemini returned
      throw new Error(
        `Gemini JSON parse failed (finishReason=${finish || "?"}): ${parseErr.message}. Raw output (first 400 chars): ${text.slice(0, 400)}`
      );
    }
  }
};

export const handler = async (event) => {
  const adminKey = event.headers["x-admin-key"] || event.headers["X-Admin-Key"];
  const expected = process.env.ADMIN_KEY || process.env.admin_key;
  if (!expected) {
    return json(500, { error: "Server is missing ADMIN_KEY / admin_key env var" });
  }
  if (!adminKey || adminKey !== expected) {
    return json(401, { error: "Unauthorized — missing or invalid X-Admin-Key" });
  }
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const { rawText, imageBase64, imageMime, team1, team2, score1, score2, division, round, notes, post } = body || {};

  let title, recap, winner, loserName, scoreStr;

  try {
    const hasImage = imageBase64 && String(imageBase64).length > 100;
    const hasText = rawText && String(rawText).trim().length > 10;

    if (hasImage || hasText) {
      // ─── Mode B: paste / upload from GameChanger ───
      const trimmed = hasText ? String(rawText).slice(0, 6000) : "";
      const sourceDesc = hasImage && hasText
        ? "Pasted text PLUS an attached screenshot — use both. The screenshot is usually the box score."
        : hasImage
          ? "Attached screenshot of a GameChanger box score / recap. Read all visible text — team names, final score, inning-by-inning grid, hitting/pitching leaders, jersey numbers, positions."
          : "Pasted GameChanger content.";

      const userPrompt = `${sourceDesc}

${hasText ? `Pasted content:\n"""\n${trimmed}\n"""\n\n` : ""}Division override: ${division || "(infer from content)"}
Round override: ${round || "(infer from content; default pool play)"}

Parse it and write the recap. Return JSON only.`;

      const out = await callGemini({
        system: SYSTEM_PROMPT_RAW,
        user: userPrompt,
        imageBase64: hasImage ? imageBase64 : null,
        imageMime: imageMime || "image/png",
      });
      title = out.title;
      recap = out.recap;
      winner = out.winner;
      loserName = out.loser;
      scoreStr = out.score;
    } else if (team1 && team2 && score1 != null && score2 != null) {
      // ─── Mode A: structured fields ───
      const w = score1 >= score2 ? team1 : team2;
      const l = score1 >= score2 ? team2 : team1;
      const winS = Math.max(score1, score2);
      const losS = Math.min(score1, score2);
      const userPrompt = `Game result:
- Winner: ${w} (${winS})
- Loser:  ${l} (${losS})
- Division: ${division || "(not specified)"}
- Round: ${round || "pool play"}
- Notes: ${notes ? notes : "(none)"}

Draft a 2-sentence recap and a short title. Return JSON only.`;
      const out = await callGemini({ system: SYSTEM_PROMPT_STRUCTURED, user: userPrompt });
      title = out.title;
      recap = out.recap;
      winner = w;
      loserName = l;
      scoreStr = `${winS}–${losS}`;
    } else {
      return json(400, {
        error: "Provide rawText (paste), imageBase64 (screenshot), or structured fields (team1, team2, score1, score2).",
      });
    }

    const finalTitle = String(title || "").slice(0, 80);
    const finalRecap = String(recap || "").slice(0, 500);
    const meta = {
      winner: winner || null,
      loser: loserName || null,
      score: scoreStr || null,
      division: division || null,
      round: round || null,
    };

    let posted = false;
    if (post === true) {
      // Save to Netlify Blobs so the public page can pull it without a redeploy
      const store = getStore(BLOB_STORE);
      const now = new Date().toISOString();
      const id = `${now}_${Math.random().toString(36).slice(2, 8)}`;
      const entry = {
        id,
        title: finalTitle,
        recap: finalRecap,
        score: meta.score,
        division: meta.division,
        round: meta.round,
        winner: meta.winner,
        loser: meta.loser,
        posted_at: now,
      };
      await store.setJSON(id, entry);
      posted = true;
    }

    return json(200, { ok: true, title: finalTitle, recap: finalRecap, meta, posted });
  } catch (err) {
    console.error("msm-recap error:", err);
    return json(500, { ok: false, error: err.message });
  }
};
