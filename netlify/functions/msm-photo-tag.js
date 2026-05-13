/**
 * BurnsBuilt — MSM Photo Tagger (Gemini Vision)
 * ==================================================================
 * Reads a tournament photo and extracts:
 *   - jersey numbers visible
 *   - dominant uniform colors
 *   - team name if printed on jersey
 *   - action keywords (batter, pitcher, fielder, dugout, etc.)
 *   - 1-line caption
 *
 * Usage modes:
 *
 *   POST { "url": "https://burnsbuilt.co/msm-summer-2026-dfw/gallery/foo.jpg" }
 *     → tags a single image by URL (preferred — no upload).
 *
 *   POST { "image": "<base64>", "mimeType": "image/jpeg" }
 *     → tags an inline base64 image.
 *
 * Auth: requires X-Admin-Key header matching ADMIN_KEY env var
 *       (this is an admin tool, not parent-facing).
 *
 * Response: { ok, tags: { jerseys:[], colors:[], teams:[], action:[], caption:"" } }
 *
 * Required env: GEMINI_API_KEY, ADMIN_KEY
 *
 * Cost: ~$0.001 per photo with gemini-2.5-flash (vision).
 * ==================================================================
 */

const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `You are an image tagger for a youth baseball tournament photo gallery. You analyze a single tournament photo and return structured tags.

Return ONLY valid JSON in this exact shape:
{
  "jerseys": [<integer numbers visible on player jerseys, e.g. 7, 12>],
  "colors": [<dominant uniform color names, lowercase: "navy", "red", "white", "gray", "gold", etc.>],
  "teams": [<team or club names visible on jerseys/banners, lowercase, no punctuation. empty array if none readable.>],
  "action": [<short keywords: "batter", "pitcher", "fielder", "runner", "catcher", "umpire", "dugout", "celebration", "swing", "throw", "catch", "slide", "team-photo">],
  "caption": "<one short factual sentence describing the moment. No names. Under 100 chars.>"
}

Rules:
- Only include jersey numbers you can clearly read.
- Never include personal names — only what's printed on the uniform.
- Caption is a description like "Batter mid-swing on a fastball" not "John hits a home run."
- If unsure about a color, leave it out rather than guess.
- No markdown, no prose, no code fences. Just the JSON object.`;

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const fetchAsBase64 = async (url) => {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Image fetch ${r.status}`);
  const buf = Buffer.from(await r.arrayBuffer());
  const mime = r.headers.get("content-type") || "image/jpeg";
  return { base64: buf.toString("base64"), mimeType: mime };
};

const callGeminiVision = async ({ base64, mimeType }) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{
        role: "user",
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: "Tag this tournament photo. Return only the JSON described in your instructions." },
        ],
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 600,
        responseMimeType: "application/json",
      },
    }),
  });
  if (!r.ok) {
    const errText = await r.text();
    throw new Error(`Gemini API ${r.status}: ${errText.slice(0, 200)}`);
  }
  const data = await r.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!text) throw new Error("Gemini returned empty response");
  return JSON.parse(text);
};

export const handler = async (event) => {
  // Auth gate — admin tool, not parent-facing.
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

  let payload;
  try {
    if (body?.url) {
      payload = await fetchAsBase64(body.url);
    } else if (body?.image) {
      payload = { base64: body.image, mimeType: body.mimeType || "image/jpeg" };
    } else {
      return json(400, { error: "Provide either url or image (base64)" });
    }
  } catch (err) {
    return json(400, { error: `Could not load image: ${err.message}` });
  }

  try {
    const tags = await callGeminiVision(payload);
    // Defensive normalization
    const norm = {
      jerseys: Array.isArray(tags.jerseys) ? tags.jerseys.filter(n => Number.isInteger(n)) : [],
      colors: Array.isArray(tags.colors) ? tags.colors.map(c => String(c).toLowerCase()) : [],
      teams: Array.isArray(tags.teams) ? tags.teams.map(t => String(t).toLowerCase()) : [],
      action: Array.isArray(tags.action) ? tags.action.map(a => String(a).toLowerCase()) : [],
      caption: typeof tags.caption === "string" ? tags.caption.slice(0, 200) : "",
    };
    return json(200, { ok: true, tags: norm });
  } catch (err) {
    console.error("msm-photo-tag error:", err);
    return json(500, { ok: false, error: err.message });
  }
};
