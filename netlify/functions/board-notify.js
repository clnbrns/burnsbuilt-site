/**
 * BurnsBuilt — Board Assignment Notifier
 * ==================================================================
 * Sends an email when a task is assigned to someone else on the /board/.
 *
 * Uses Gmail SMTP via nodemailer — no domain verification required, no
 * monthly quota worth worrying about (500/day limit on Gmail is 100× our
 * worst-case usage).
 *
 * POST /.netlify/functions/board-notify
 *   body: { toEmail, toName, fromName, cardTitle, cardId }
 *
 * Auth: X-Board-Key header. Without it, the function 401s.
 *
 * Required env vars:
 *   GMAIL_USER          — sender Gmail address (e.g. colinmburns@gmail.com)
 *   GMAIL_APP_PASSWORD  — 16-char app password from
 *                         https://myaccount.google.com/apppasswords
 *   BOARD_KEY or ADMIN_KEY — shared secret matching /board-sync gate
 *
 * Optional:
 *   GMAIL_FROM_NAME     — display name on outgoing emails (defaults to "BurnsBuilt Board")
 * ==================================================================
 */

import nodemailer from "nodemailer";

const BOARD_URL = "https://burnsbuilt.co/board/";

const json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify(body),
});

const getAuthKey = () => process.env.BOARD_KEY || process.env.ADMIN_KEY || "";

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

const buildHtml = ({ toName, fromName, cardTitle }) => `
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

const buildText = ({ toName, fromName, cardTitle }) =>
  `${fromName} assigned you a task on The Board.\n\n${cardTitle}\n\nOpen: ${BOARD_URL}\n`;

let _transporter = null;
function getTransporter() {
  if (_transporter) return _transporter;
  _transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  return _transporter;
}

export const handler = async (event) => {
  // Auth
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

  const { toEmail, toName, fromName, cardTitle } = body || {};
  if (!toEmail || !cardTitle) {
    return json(400, { error: "Missing toEmail or cardTitle" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(toEmail)) {
    return json(400, { error: "toEmail is not a valid email" });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return json(500, { error: "Server is missing GMAIL_USER / GMAIL_APP_PASSWORD env vars" });
  }

  const displayName = process.env.GMAIL_FROM_NAME || "BurnsBuilt Board";
  const subject = `${fromName || "Someone"} assigned you: ${cardTitle.slice(0, 80)}`;

  try {
    const info = await getTransporter().sendMail({
      from: `"${displayName}" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      subject,
      text: buildText({
        toName: toName || "there",
        fromName: fromName || "Someone",
        cardTitle: cardTitle.slice(0, 200),
      }),
      html: buildHtml({
        toName: toName || "there",
        fromName: fromName || "Someone",
        cardTitle: cardTitle.slice(0, 200),
      }),
    });
    return json(200, { ok: true, messageId: info.messageId });
  } catch (err) {
    console.error("board-notify error:", err);
    return json(500, { error: err.message });
  }
};
