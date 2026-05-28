/**
 * BurnsBuilt — MSM Photo Tagger (Gemini Vision)
 * ==================================================================
 * Reads a tournament photo and identifies which MSM team the player(s)
 * belong to — based on jersey text, hat logo, and color cues.
 *
 * Output shape:
 *   {
 *     "team_id":         "7th-brock" | "unknown",
 *     "team_label":      "7th-Brock" | null,
 *     "team_confidence": "high" | "medium" | "low" | "none",
 *     "team_signals":    ["jersey text: BROCK", "hat: red B logo"],
 *     "colors":          ["red", "white"],
 *     "action":          ["batter", "swing"],
 *     "caption":         "Player mid-swing on a fastball"
 *   }
 *
 * Output is constrained to the canonical team IDs from
 *   /msm-summer-2026-dfw/teams/teams.json
 * so the AI can't hallucinate teams that aren't in the tournament.
 *
 * Usage:
 *   POST { "url": "https://.../some-photo.jpg" }
 *   POST { "image": "<base64>", "mimeType": "image/jpeg" }
 *
 * Auth: X-Admin-Key header.
 *
 * Required env: GEMINI_API_KEY, ADMIN_KEY
 *
 * Cost: ~$0.001 per photo with gemini-2.5-flash (vision).
 * ==================================================================
 */

const GEMINI_MODEL = "gemini-2.5-flash";
const TEAMS_URL = process.env.TEAMS_JSON_URL
  || "https://msm.burnsbuilt.co/teams/teams.json";

// Lazy-cache the team list across warm function invocations.
let _teamsCache = null;
let _teamsCacheAt = 0;
const TEAMS_TTL_MS = 5 * 60 * 1000; // 5 minutes

async function loadTeamList() {
  const now = Date.now();
  if (_teamsCache && now - _teamsCacheAt < TEAMS_TTL_MS) return _teamsCache;
  const r = await fetch(TEAMS_URL, { cache: "no-store" });
  if (!r.ok) throw new Error(`Could not load team list (${r.status})`);
  const data = await r.json();
  // Flatten to [{ id, label, division }]. ID is "<grade>-<slug>" so duplicates
  // across divisions stay distinct.
  const teams = [];
  for (const div of data.divisions || []) {
    const gradePrefix = (div.name || "").split(" ")[0].toLowerCase(); // "6th"
    for (const t of div.teams || []) {
      const slug = String(t.name)
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s/]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      teams.push({
        id: `${gradePrefix}-${slug}`,
        label: `${gradePrefix}-${t.name}`,
        division: div.name,
        name: t.name,
      });
    }
  }
  _teamsCache = teams;
  _teamsCacheAt = now;
  return teams;
}

function buildSystemPrompt(teams) {
  const byDivision = teams.reduce((acc, t) => {
    (acc[t.division] = acc[t.division] || []).push(`  - ${t.id}  (${t.name})`);
    return acc;
  }, {});
  const teamList = Object.entries(byDivision)
    .map(([div, lines]) => `${div}:\n${lines.join("\n")}`)
    .join("\n\n");

  return `You are tagging photos from the Middle School Matchup (MSM) Summer 2026 DFW West youth baseball tournament. Each photo shows one or more players from one of the teams below. Your job: identify which team the most prominent player belongs to, and extract a few other useful tags.

IDENTIFICATION CUES (in priority order):
1. Hat logo — the most reliable signal. Every school has a distinctive hat logo or letter (Aledo "A", Brock has its own logo, etc.). Hats are almost always visible even when the jersey is obscured.
2. Jersey text — many school jerseys have the school name printed across the chest (e.g. "ALEDO", "BROCK").
3. Uniform colors — secondary signal. Combine with #1 or #2 when team text isn't readable.
4. School logos on jersey — e.g. mascot or school crest.

DON'T identify by jersey NUMBERS — MSM jerseys don't have numbers on the front, and back-of-jersey shots are rare.

TEAM LIST (you MUST pick exactly one of these IDs, or "unknown"):

${teamList}

For combo teams, players wear their original school uniforms (mixed). If you see e.g. a Medlin jersey and the photo is clearly a 6th-grade game, the player could be on "6th-northwest-medlin" (pure team) OR "6th-northwest-combo" (combo). When ambiguous, pick the pure team if the jersey is clearly one school. Pick the combo team only if you see multiple schools represented in the same photo or know it's from a combo game.

OUTPUT — return ONLY valid JSON in this exact shape:

{
  "team_id": "<one ID from the list above, or 'unknown'>",
  "team_label": "<the human label like '7th-Brock', or null if unknown>",
  "team_confidence": "<one of: high | medium | low | none>",
  "team_signals": [<short strings describing what cues you used, e.g. "jersey text: ALEDO", "hat: red B logo", "jersey color: navy">],
  "colors": [<dominant uniform colors, lowercase: "navy", "red", "white", "gray", "gold", etc.>],
  "action": [<short keywords: "batter", "pitcher", "fielder", "runner", "catcher", "umpire", "dugout", "celebration", "swing", "throw", "catch", "slide", "team-photo">],
  "caption": "<one short factual sentence about the moment, no names, under 100 chars>"
}

CONFIDENCE GUIDE:
- "high": jersey text or hat logo is clearly readable and unambiguous
- "medium": one strong cue (just hat OR just jersey color match)
- "low": guessing from colors alone, or partial obstruction
- "none": can't see any team identifier — return team_id "unknown"

Rules:
- NEVER invent player names — the caption describes the moment, not the person.
- If you can't tell which team, set team_id to "unknown" and team_confidence to "none". Better to leave it unknown than guess wrong.
- No markdown, no prose, no code fences. Just the JSON.`;
}

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

const callGeminiVision = async ({ base64, mimeType, systemPrompt }) => {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{
        role: "user",
        parts: [
          { inlineData: { mimeType, data: base64 } },
          { text: "Identify the team in this photo. Return only the JSON described in your instructions." },
        ],
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 800,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 0 },
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
  const adminKey = event.headers["x-admin-key"] || event.headers["X-Admin-Key"];
  const expected = process.env.ADMIN_KEY || process.env.admin_key;
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
    const teams = await loadTeamList();
    const validIds = new Set(teams.map(t => t.id));
    const systemPrompt = buildSystemPrompt(teams);
    const raw = await callGeminiVision({ ...payload, systemPrompt });

    // Validate the team_id — coerce anything off-list to "unknown" so bad data
    // doesn't pollute the manifest.
    const teamId = typeof raw.team_id === "string" ? raw.team_id.toLowerCase().trim() : "unknown";
    const valid = teamId === "unknown" || validIds.has(teamId);
    const team = teams.find(t => t.id === teamId);

    const norm = {
      team_id: valid ? teamId : "unknown",
      team_label: team?.label || (valid ? null : null),
      team_confidence: ["high", "medium", "low", "none"].includes(raw.team_confidence)
        ? raw.team_confidence : "none",
      team_signals: Array.isArray(raw.team_signals)
        ? raw.team_signals.slice(0, 6).map(s => String(s).slice(0, 80)) : [],
      colors: Array.isArray(raw.colors)
        ? raw.colors.map(c => String(c).toLowerCase()).slice(0, 6) : [],
      action: Array.isArray(raw.action)
        ? raw.action.map(a => String(a).toLowerCase()).slice(0, 6) : [],
      caption: typeof raw.caption === "string" ? raw.caption.slice(0, 150) : "",
    };
    return json(200, { ok: true, tags: norm });
  } catch (err) {
    console.error("msm-photo-tag error:", err);
    return json(500, { ok: false, error: err.message });
  }
};
