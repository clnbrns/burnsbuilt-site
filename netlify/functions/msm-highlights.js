/**
 * BurnsBuilt — MSM Highlight Reel
 * ==================================================================
 * Returns the top photos featuring a given jersey number (and optionally
 * team), ranked by an "action score." Photos must already be tagged via
 * msm-photo-tag (tags live in /msm-summer-2026-dfw/gallery/manifest.json
 * under each photo's "tags" key).
 *
 * GET /.netlify/functions/msm-highlights?jersey=7&team=bearcats&limit=8
 *
 * No auth — parent-facing endpoint.
 *
 * This function does NOT call Gemini. It reads the tagged manifest and
 * does a fast filter + score. Tagging is a one-time admin step done
 * via msm-photo-tag.
 * ==================================================================
 */

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=60" },
  body: JSON.stringify(body),
});

// Fetch the manifest from the live site (works in dev + prod via process.env.URL)
const fetchManifest = async (origin) => {
  const base = origin || process.env.URL || "https://burnsbuilt.co";
  const url = `${base}/msm-summer-2026-dfw/gallery/manifest.json`;
  const r = await fetch(url, { headers: { "cache-control": "no-store" } });
  if (!r.ok) throw new Error(`Manifest fetch ${r.status}`);
  return r.json();
};

const scorePhoto = (tags) => {
  // Higher action = higher score. Posed/dugout get bumped down so action wins.
  const action = (tags?.action || []).map(a => String(a).toLowerCase());
  let score = 1;
  const hot = ["swing", "throw", "catch", "slide", "celebration", "pitcher", "batter"];
  const meh = ["dugout", "team-photo", "umpire"];
  hot.forEach(k => { if (action.includes(k)) score += 3; });
  meh.forEach(k => { if (action.includes(k)) score -= 1; });
  // Caption signal: if the AI flagged a vivid moment ("mid-swing", "diving"), boost.
  const cap = (tags?.caption || "").toLowerCase();
  if (/mid[-\s]?swing|diving|sliding|leaping|stretching|fastball|home run|crushed|smash/.test(cap)) score += 2;
  return score;
};

export const handler = async (event) => {
  const params = event.queryStringParameters || {};
  const jersey = parseInt(params.jersey, 10);
  const team = params.team ? String(params.team).toLowerCase().trim() : null;
  const limit = Math.min(parseInt(params.limit, 10) || 8, 24);
  if (!Number.isInteger(jersey) || jersey < 0 || jersey > 99) {
    return json(400, { error: "Provide jersey as integer 0-99" });
  }

  let manifest;
  try {
    const origin = event.headers["x-forwarded-host"]
      ? `https://${event.headers["x-forwarded-host"]}`
      : null;
    manifest = await fetchManifest(origin);
  } catch (err) {
    return json(500, { ok: false, error: `Could not load gallery manifest: ${err.message}` });
  }

  const photos = manifest.photos || [];
  const matches = photos
    .filter(p => {
      const t = p.tags || {};
      const jerseys = (t.jerseys || []).map(n => parseInt(n, 10));
      if (!jerseys.includes(jersey)) return false;
      if (team) {
        const teams = (t.teams || []).map(s => String(s).toLowerCase());
        // Substring match — "bearcats" matches "aledo bearcats 12u"
        if (!teams.some(x => x.includes(team) || team.includes(x))) return false;
      }
      return true;
    })
    .map(p => ({ ...p, _score: scorePhoto(p.tags) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit)
    .map(({ _score, ...p }) => p); // strip score from output

  return json(200, {
    ok: true,
    jersey,
    team: team || null,
    count: matches.length,
    photos: matches,
    note: matches.length === 0
      ? "No tagged photos match yet. Photos are tagged after upload — check back later."
      : null,
  });
};
