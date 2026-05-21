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
const SITE_ID_FALLBACK = "21231ebf-f00f-466d-a7f7-47311646da0a"; // burnsbuilt.co — public site UUID

// Robust store accessor: tries Netlify auto-context first, falls back to
// explicit siteID + token from env. Auto-context (NETLIFY_BLOBS_CONTEXT)
// is supposed to be injected by Netlify at runtime but isn't always set,
// depending on bundler config and function format. Explicit config always
// works as long as NETLIFY_AUTH_TOKEN is a valid Personal Access Token.
function getRecapStore() {
  try {
    return getStore(BLOB_STORE);
  } catch (err) {
    const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || SITE_ID_FALLBACK;
    const token = process.env.NETLIFY_AUTH_TOKEN || process.env.NETLIFY_BLOBS_TOKEN;
    if (!token) {
      throw new Error(
        "Netlify Blobs unavailable. Auto-context failed and no NETLIFY_AUTH_TOKEN env var is set. " +
        "Create a Netlify PAT at app.netlify.com/user/applications and set NETLIFY_AUTH_TOKEN. " +
        `(Underlying error: ${err.message})`
      );
    }
    return getStore({ name: BLOB_STORE, siteID, token });
  }
}

// Shared standout-performance guidance used by both prompts
const STANDOUT_RULES = `
Highlight individual performances. Every recap should name at least one standout from the winning team — ideally two — when the input contains stat lines. Use jersey numbers ("#10") when shown; use last names only when they appear in the input. Never invent names.

What counts as a standout, in priority order:
1. Home runs — always mention by name/jersey
2. Pitcher with 5+ strikeouts, a no-hitter, a complete game, or a scoreless outing of 3+ innings (give IP + K, e.g. "3.2 IP, 6 K, one-run ball")
3. Multi-hit AND multi-RBI hitter (e.g. "#8 went 2-for-3 with 3 RBI")
4. Extra-base hits (doubles, triples) — mention the player
5. Big stolen-base game (3+ SBs from one player)
6. Hitter with 3+ RBIs even if only 1 hit

When two players had big games, you can mention both in the second sentence. Use commas or "while" / "alongside" — don't make it a list.

Format individual stat lines naturally:
- "#8 Granato went 2-for-3 with 3 RBI and three steals"
- "Britain dealt 3.2 innings of one-run ball with 6 K"
- "#10 Elliott went deep with three driven in"

CRITICAL — stat accuracy rules (read these slowly):
- Hit format is ALWAYS "H-for-AB" (hits-for-at-bats). H must be ≤ AB. NEVER write "3-for-2" — that is mathematically impossible. If a player has 2 H and 3 AB, write "2-for-3", not "3-for-2".
- Look at the box-score columns in order: AB, R, H, RBI, BB, SO. Match each column carefully.
- Only mention extra-base hits (2B / HR / 3B) if the player's name appears in the 2B / HR / 3B summary rows. Don't infer doubles from a hit count.
- Only mention RBIs if the RBI column shows a number > 0 for that player.
- If you can't read a stat clearly from the input, OMIT it. Better to leave a player out than to invent numbers.

Do NOT mention pedestrian lines (1-for-3, 1 RBI, etc.). Only call out genuine highlights.`;

const SYSTEM_PROMPT_STRUCTURED = `You write short, friendly recaps for a youth baseball tournament — Middle School Matchup, DFW West.

Voice: warm, neighborly, like a local paper or a parent at the diamond. NOT sports-broadcast hype. NOT corporate. We use #happybaseball — think Banana Ball, not travel ball.
${STANDOUT_RULES}

Rules:
- 2-3 sentences. Under 80 words.
- First sentence: who won and the score (and how it flowed if obvious — fast start, comeback, late rally, etc.). Mention division and round if provided.
- Second/third sentence: the individual standouts.
- Do NOT invent player names. Use only names/numbers present in the input notes.
- Write a punchy 5-8 word title that names the winner and the score (e.g. "Bearcats edge Stallions 6–4").
- Return ONLY valid JSON. No markdown, no code fences.

Output shape:
{ "title": "<5-8 words>", "recap": "<2-3 sentences, under 80 words>" }`;

const SYSTEM_PROMPT_RAW = `You parse and rewrite youth-baseball game content for Middle School Matchup (MSM), DFW West.

You may receive raw text pasted from GameChanger, a screenshot of a GameChanger box score, or both. When given an image, read all visible text carefully: team names, final score, inning-by-inning grid, hitting leaders (H, R, RBI columns), pitching lines (IP, H, R, ER, BB, SO), and the 2B/HR/SB/HBP/E summary rows. Read jersey numbers ("#10") from the lineup column when shown.

Your job: extract what matters and write a 2-3 sentence MSM-voice recap that highlights individual standouts.

Voice: warm, neighborly, like a local paper or a parent at the diamond. NOT sports-broadcast hype. NOT corporate. We're #happybaseball — think Banana Ball, not travel ball.
${STANDOUT_RULES}

Extraction rules:
- Pull the two team names exactly as written in the input. If GameChanger uses club + age format, keep it natural ("Bearcats" rather than "Aledo Bearcats Baseball 12U").
- Pull the final score. Format as "winner–loser" (e.g., "13–1"). Use en-dash.
- Note the flow of the game if obvious — fast start, comeback, late rally, blowout, complete-game shutout.
- Identify the 1-2 best individual performances from the winning team using the standout rules above.
- Discard inning-by-inning play-by-play padding. The recap is the score + flow + standouts, not a recap of every at-bat.

Output rules:
- 2-3 sentences. Under 80 words.
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
    const finalRecap = String(recap || "").slice(0, 600);
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
      const store = getRecapStore();
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
