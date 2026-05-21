/**
 * BurnsBuilt — MSM Recaps List (public)
 * ==================================================================
 * Returns all recaps stored in the "msm-recaps" Netlify Blob store.
 * The MSM page reads this in addition to /recaps/manifest.json so
 * recaps posted from /admin/recap/ show up live without a redeploy.
 *
 * GET → { recaps: [...] }  (newest first)
 *
 * Public, no auth — these are user-facing recaps.
 *
 * Per-recap shape:
 *   { id, title, recap, score, division, round, winner, loser, posted_at }
 *
 * Optional admin tools:
 *   DELETE { id, adminKey }   — remove a single recap (gated by ADMIN_KEY)
 * ==================================================================
 */

import { getStore } from "@netlify/blobs";

const BLOB_STORE = "msm-recaps";

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=15, stale-while-revalidate=60",
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  const store = getStore(BLOB_STORE);

  if (event.httpMethod === "GET") {
    try {
      const { blobs } = await store.list();
      const all = await Promise.all(
        blobs.map(b => store.get(b.key, { type: "json" }).catch(() => null))
      );
      const recaps = all
        .filter(Boolean)
        .sort((a, b) => (b.posted_at || "").localeCompare(a.posted_at || ""));
      return json(200, { recaps, count: recaps.length });
    } catch (err) {
      console.error("msm-recaps-list GET error:", err);
      return json(500, { error: err.message, recaps: [] });
    }
  }

  if (event.httpMethod === "DELETE") {
    const adminKey = event.headers["x-admin-key"] || event.headers["X-Admin-Key"];
    const expected = process.env.ADMIN_KEY || process.env.admin_key;
    if (!adminKey || adminKey !== expected) {
      return json(401, { error: "Unauthorized" });
    }
    let body;
    try { body = JSON.parse(event.body || "{}"); }
    catch { return json(400, { error: "Invalid JSON" }); }
    if (!body.id) return json(400, { error: "Missing id" });
    try {
      await store.delete(body.id);
      return json(200, { ok: true, deleted: body.id });
    } catch (err) {
      return json(500, { error: err.message });
    }
  }

  return json(405, { error: "Method not allowed" });
};
