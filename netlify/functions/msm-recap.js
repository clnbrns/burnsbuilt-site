/**
 * BurnsBuilt — MSM Auto Recap Writer
 * ==================================================================
 * Drafts a 2-sentence game recap in friendly local-paper voice.
 *
 * POST {
 *   "team1": "Aledo Bearcats 12U",
 *   "team2": "DFW Stallions 12U",
 *   "score1": 6,
 *   "score2": 4,
 *   "division": "12U",
 *   "round": "pool play",  // optional: "pool play" | "quarterfinal" | "semifinal" | "final"
 *   "notes": "Optional 1-3 line note: standout plays, who pitched, etc."
 * }
 *
 * Auth: X-Admin-Key header. (Recaps are user-facing but writing is admin.)
 *
 * Response: { ok, recap: "...", title: "Aledo Bearcats 12U edge Stallions 6–4" }
 *
 * Required env: GEMINI_API_KEY, ADMIN_KEY
 *
 * Cost: ~$0.0005 per recap with gemini-2.5-flash.
 * ==================================================================
 */

const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You write short, friendly recaps for a youth baseball tournament — Middle School Matchup, DFW West.

Voice: warm, neighborly, like a local paper or a parent at the diamond. NOT sports-broadcast hype. NOT corporate.

Rules:
- 2 sentences total. Under 60 words.
- Mention the score and the winning team. Mention division and round if provided.
- If notes mention specific jersey numbers or generic player descriptors, you can include them. Do NOT invent player names. Do NOT use any names not present in the input notes.
- Write a punchy 5-8 word title that names the winner and the score (e.g. "Bearcats edge Stallions 6–4").
- Return ONLY valid JSON. No markdown, no code fences.

Output shape:
{ "title": "<5-8 words>", "recap": "<2 sentences, under 60 words>" }`;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const callGemini = async ({ system, user }) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 300,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!r.ok) throw new Error(`Gemini API ${r.status}: ${(await r.text()).slice(0, 200)}`);
  const data = await r.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  return JSON.parse(text);
};

export const handler = async (event) => {
  const adminKey = event.headers["x-admin-key"] || event.headers["X-Admin-Key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return json(401, { error: "Unauthorized — missing or invalid X-Admin-Key" });
  }
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const { team1, team2, score1, score2, division, round, notes } = body || {};
  if (!team1 || !team2 || score1 == null || score2 == null) {
    return json(400, { error: "Missing required fields: team1, team2, score1, score2" });
  }

  const winner = score1 >= score2 ? team1 : team2;
  const loser  = score1 >= score2 ? team2 : team1;
  const winS   = Math.max(score1, score2);
  const losS   = Math.min(score1, score2);

  const prompt = `Game result:
- Winner: ${winner} (${winS})
- Loser:  ${loser} (${losS})
- Division: ${division || "(not specified)"}
- Round: ${round || "pool play"}
- Notes: ${notes ? notes : "(none)"}

Draft a 2-sentence recap and a short title. Return JSON only.`;

  try {
    const out = await callGemini({ system: SYSTEM_PROMPT, user: prompt });
    return json(200, {
      ok: true,
      title: String(out.title || "").slice(0, 80),
      recap: String(out.recap || "").slice(0, 500),
      meta: { winner, score: `${winS}–${losS}`, division: division || null, round: round || null },
    });
  } catch (err) {
    console.error("msm-recap error:", err);
    return json(500, { ok: false, error: err.message });
  }
};
