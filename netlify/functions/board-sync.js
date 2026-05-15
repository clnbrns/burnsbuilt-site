/**
 * BurnsBuilt — Board Sync
 * ==================================================================
 * Cross-device sync for the personal Kanban board at /board/.
 *
 * Storage: Netlify Blobs (store "board", key "main"). Single document.
 *
 * GET  /.netlify/functions/board-sync   → { ok, data, updatedAt }
 * POST /.netlify/functions/board-sync   body: { version, categories, cards, lastModifiedAt }
 *                                       → { ok, updatedAt }
 *
 * Auth: X-Board-Key header. Reads from env BOARD_KEY, falls back to ADMIN_KEY.
 *
 * Concurrency model: last-write-wins at document level. Personal use, single
 * user, multiple devices — collisions are rare. Each save stamps serverUpdatedAt
 * so the client can detect "server is newer than my local."
 * ==================================================================
 */

import { getStore } from "@netlify/blobs";

const STORE_NAME = "board";
const DOC_KEY = "main";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const getKey = () => process.env.BOARD_KEY || process.env.ADMIN_KEY || "";

export const handler = async (event) => {
  // Auth
  const userKey = event.headers["x-board-key"] || event.headers["X-Board-Key"];
  const expected = getKey();
  if (!expected) {
    return json(500, { error: "Server is missing BOARD_KEY / ADMIN_KEY env var" });
  }
  if (!userKey || userKey !== expected) {
    return json(401, { error: "Invalid sync key" });
  }

  const store = getStore(STORE_NAME);

  // ── GET: return current board ──
  if (event.httpMethod === "GET") {
    try {
      const data = await store.get(DOC_KEY, { type: "json" });
      return json(200, {
        ok: true,
        data: data || null,
        updatedAt: data?.serverUpdatedAt || null,
      });
    } catch (err) {
      console.error("board-sync GET error:", err);
      return json(500, { error: "Could not read board" });
    }
  }

  // ── POST: replace board ──
  if (event.httpMethod === "POST") {
    let body;
    try {
      body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch {
      return json(400, { error: "Invalid JSON" });
    }
    if (!body || typeof body !== "object") {
      return json(400, { error: "Body must be an object" });
    }
    // Light validation — must have at least cards or categories
    if (!Array.isArray(body.cards) || !Array.isArray(body.categories)) {
      return json(400, { error: "Body must include cards[] and categories[]" });
    }
    // Cap document size to ~512KB to avoid runaway uploads
    const size = Buffer.byteLength(JSON.stringify(body), "utf8");
    if (size > 512 * 1024) {
      return json(413, { error: `Board too large (${size} bytes). Max 512KB.` });
    }

    body.serverUpdatedAt = new Date().toISOString();

    try {
      await store.setJSON(DOC_KEY, body);
      return json(200, { ok: true, updatedAt: body.serverUpdatedAt });
    } catch (err) {
      console.error("board-sync POST error:", err);
      return json(500, { error: "Could not save board" });
    }
  }

  return json(405, { error: "Method not allowed" });
};
