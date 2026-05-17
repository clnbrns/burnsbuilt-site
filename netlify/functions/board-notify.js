/**
 * BurnsBuilt — Board Assignment Notifier
 * ==================================================================
 * Sends an email when a task is assigned to someone else on the /board/.
 *
 * Triggered by client-side code in board/index.html when a save changes
 * the assignee to a user that isn't the current user.
 *
 * Auth: X-Board-Key header (same as /board-sync). Without it, the
 * function will silently 401 — that protects from open-relay abuse.
 *
 * POST /.netlify/functions/board-notify
 *   body: { toEmail, toName, fromName, cardTitle, cardId }
 *
 * Required env vars:
 *   RESEND_API_KEY      — from resend.com
 *   RESEND_FROM_EMAIL   — verified sender (e.g. "board@burnsbuilt.co")
 *   BOARD_KEY or ADMIN_KEY — shared secret (matches /board-sync gate)
 *
 * Free tier on Resend covers 3000 emails/month — plenty for two people.
 * ==================================================================
 */

const BOARD_URL = "https://burnsbuilt.co/board/";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const getAuthKey = () => process.env.BOARD_KEY || process.env.ADMIN_KEY || "";

const buildHtml = ({ toName, fromName, cardTitle, cardId }) => `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f6fa;margin:0;padding:24px;">
  <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e0e3e9;">
    <div style="padding:20px 24px;background:#0E1A2E;color:#fff;">
      <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#c49a62;margin-bottom:6px;">The Board</div>
      <div style="font-size:18px;font-weight:700;">${escapeHtml(fromName)} assigned you a task</div>
    </div>
    <div style="padding:22px 24px;">
      <p style="margin:0 0 8px;color:#566577;font-size:13px;">Hey ${escapeHtml(toName)},</p>
      <p style="margin:0 0 16px;font-size:16px;color:#0E1A2E;font-weight:600;line-height:1.4;">
        ${escapeHtml(cardTitle)}
      </p>
      <a href="${BOARD_URL}" style="display:inline-block;background:#c49a62;color:#0E1A2E;padding:11px 20px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px;">
        Open The Board →
      </a>
      <p style="margin:18px 0 0;font-size:12px;color:#8a94a8;">
        Assigned by ${escapeHtml(fromName)} · <a href="${BOARD_URL}" style="color:#8a94a8;">${BOARD_URL}</a>
      </p>
    </div>
  </div>
</body></html>
`.trim();

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

export const handler = async (event) => {
  // Auth — same gate as /board-sync
  const userKey = event.headers["x-board-key"] || event.headers["X-Board-Key"];
  const expected = getAuthKey();
  if (!expected) return json(500, { error: "Server is missing BOARD_KEY / ADMIN_KEY env var" });
  if (!userKey || userKey !== expected) return json(401, { error: "Invalid board key" });

  if (event.httpMethod !== "POST") return json(405, { error: "POST only" });

  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return json(400, { error: "Invalid JSON" });
  }

  const { toEmail, toName, fromName, cardTitle, cardId } = body || {};
  if (!toEmail || !cardTitle) {
    return json(400, { error: "Missing toEmail or cardTitle" });
  }

  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    return json(500, { error: "Server is missing RESEND_API_KEY / RESEND_FROM_EMAIL" });
  }

  // Basic email sanitization
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    return json(400, { error: "toEmail is not a valid email" });
  }

  const subject = `${fromName || "Someone"} assigned you: ${cardTitle.slice(0, 80)}`;
  const html = buildHtml({
    toName: toName || "there",
    fromName: fromName || "Someone",
    cardTitle: cardTitle.slice(0, 200),
    cardId: cardId || "",
  });

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL,
        to: [toEmail],
        subject,
        html,
      }),
    });
    if (!r.ok) {
      const errText = await r.text();
      console.error("Resend error:", r.status, errText);
      return json(502, { error: "Resend rejected the email", detail: errText.slice(0, 300) });
    }
    return json(200, { ok: true });
  } catch (err) {
    console.error("board-notify error:", err);
    return json(500, { error: err.message });
  }
};
