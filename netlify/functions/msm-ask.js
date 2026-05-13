/**
 * BurnsBuilt — MSM "Ask the Tournament" assistant
 * ==================================================================
 * Floating chat widget on /msm-summer-2026-dfw/ posts questions here.
 * Loads tournament context (teams, FAQ, venue, dates) and asks Gemini
 * to answer in 2–4 friendly sentences.
 *
 * POST /.netlify/functions/msm-ask  { q: "What field is my kid on at 2pm?" }
 *
 * Required env: GEMINI_API_KEY
 *
 * Cost: ~$0.0005 per question with gemini-2.5-flash.
 * ==================================================================
 */

const GEMINI_MODEL = "gemini-2.5-flash";

// ---- Tournament context (kept inline so we don't need filesystem reads) ----
const TOURNAMENT_CONTEXT = `
TOURNAMENT: Middle School Matchup — DFW West, Summer 2026
DATES: Tuesday & Wednesday, June 9–10, 2026
SPORT: Baseball
VENUE: Parks at Texas Star, 1501 S Pipeline Rd, Euless, TX 76040
DIVISIONS: 12U, 13U, 14U
SCHEDULE: Live brackets and game times are at https://baseball.exposureevents.com/268807/msm-dfw-west — embedded on the tournament page.
PHOTOS: Free action photos in the gallery on the tournament page (no login). Geis Photography offers paid posed sessions on-site both days at https://www.geisphoto.com/.
ALERTS: Weather/field changes show in a banner at the top of the tournament page; SMS opt-in available.
COOLERS: Outside food and coolers are typically allowed at Parks at Texas Star.
PARKING: On-site at the venue. Use Apple Maps / Google Maps / Waze links on the page for live traffic.
DIRECTOR CONTACT: SMS only (no calls). Tap the red "Help" button on the tournament page.
NEARBY: Coffee, lunch, gas, and urgent care all within ~10 minutes — links on the page.
SPONSORS: Bearcat Turf, BurnsBuilt.
`.trim();

const SYSTEM_PROMPT = `You are the friendly assistant for the Middle School Matchup baseball tournament. You answer parent questions about logistics, schedule, photos, conduct, and venue.

Voice: conversational, warm, neighborly — like talking to another parent in the bleachers. Short, useful answers (2–4 sentences max). No marketing fluff.

Rules:
- Only answer questions about THIS tournament. For unrelated questions, kindly redirect: "That's outside what I can help with — for tournament stuff I'm your guy."
- For specific game times, fields, or matchups: tell them to check the live schedule on the page (it pulls from Exposure Events in real-time). Don't make up game times.
- For weather: be honest you don't have a live feed — point them to the alert banner at the top of the page.
- When you reference a section of the page, say so: "scroll down to the Photo Gallery" or "tap the red Help button."
- If you don't know something, say so and suggest they text the tournament director via the Help button.
- Never share PII about minors. Never invent player or team names.

Use the TOURNAMENT CONTEXT below as your only source of truth.`;

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
      generationConfig: { temperature: 0.5, maxOutputTokens: 400 },
    }),
  });
  if (!r.ok) {
    const errText = await r.text();
    throw new Error(`Gemini API ${r.status}: ${errText.slice(0, 200)}`);
  }
  const data = await r.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

export const handler = async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });
  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return json(400, { error: "Invalid JSON" });
  }
  const q = (body?.q || "").toString().trim().slice(0, 600);
  if (!q) return json(400, { error: "Missing q" });

  try {
    const userPrompt = `TOURNAMENT CONTEXT:\n${TOURNAMENT_CONTEXT}\n\nPARENT QUESTION:\n${q}`;
    const answer = await callGemini({ system: SYSTEM_PROMPT, user: userPrompt });
    return json(200, { ok: true, answer: answer.trim(), question: q });
  } catch (err) {
    console.error("msm-ask error:", err);
    return json(500, { ok: false, error: "Couldn't reach the assistant right now. Try the FAQ section or text the director." });
  }
};
