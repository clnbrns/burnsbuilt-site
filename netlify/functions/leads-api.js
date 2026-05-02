/**
 * BurnsBuilt — Leads API
 * ==================================================================
 * Read + update lead records from Netlify Blobs. Powers the
 * /admin/leads/ dashboard.
 *
 * GET  /.netlify/functions/leads-api          → list all leads (newest first)
 * GET  /.netlify/functions/leads-api?id=X     → get one lead by id
 * PATCH /.netlify/functions/leads-api?id=X    → update status / notes
 *
 * Auth: requires X-Admin-Key header matching ADMIN_KEY env var.
 *
 * Required env var:
 *   ADMIN_KEY — shared secret (same one used by discovery-summarizer)
 * ==================================================================
 */

import { getStore } from "@netlify/blobs";

const getLeadsStore = () => getStore("leads");

const ALLOWED_STATUSES = ["new", "replied", "won", "lost", "spam"];

const json = (statusCode, body) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  // Auth gate
  const adminKey = event.headers["x-admin-key"] || event.headers["X-Admin-Key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return json(401, { error: "Unauthorized — missing or invalid X-Admin-Key" });
  }

  const store = getLeadsStore();
  const id = event.queryStringParameters?.id;

  // ---- GET single lead ----
  if (event.httpMethod === "GET" && id) {
    const lead = await store.get(id, { type: "json" });
    if (!lead) return json(404, { error: "Lead not found" });
    return json(200, { ok: true, lead });
  }

  // ---- GET list of leads ----
  if (event.httpMethod === "GET") {
    const { blobs } = await store.list();
    // Fetch all in parallel
    const leads = await Promise.all(
      blobs.map(async (b) => {
        try {
          return await store.get(b.key, { type: "json" });
        } catch {
          return null;
        }
      })
    );
    // Filter nulls, sort newest first
    const valid = leads
      .filter((l) => l && l.received_at)
      .sort((a, b) => (b.received_at < a.received_at ? -1 : 1));

    // Compute summary counts for the dashboard header
    const counts = valid.reduce(
      (acc, l) => {
        acc.total++;
        acc[l.status] = (acc[l.status] || 0) + 1;
        return acc;
      },
      { total: 0 }
    );

    return json(200, { ok: true, leads: valid, counts });
  }

  // ---- PATCH update lead status / notes ----
  if (event.httpMethod === "PATCH" && id) {
    let body;
    try {
      body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    } catch {
      return json(400, { error: "Invalid JSON body" });
    }

    const lead = await store.get(id, { type: "json" });
    if (!lead) return json(404, { error: "Lead not found" });

    if (body.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(body.status)) {
        return json(400, { error: `Status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
      }
      lead.status = body.status;
      lead.status_updated_at = new Date().toISOString();
    }
    if (body.notes !== undefined) {
      lead.notes = String(body.notes).slice(0, 5000); // cap at 5k chars
    }

    await store.setJSON(id, lead);
    return json(200, { ok: true, lead });
  }

  // ---- DELETE single lead (rarely used — for spam cleanup) ----
  if (event.httpMethod === "DELETE" && id) {
    await store.delete(id);
    return json(200, { ok: true, deleted: id });
  }

  return json(405, { error: "Method not allowed" });
};
