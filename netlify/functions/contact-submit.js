/**
 * contact-submit — Handles /contact form submissions.
 *
 * Receives the form POST (application/x-www-form-urlencoded), sends an
 * email via Gmail SMTP to both Colin and Carson, and redirects the
 * browser to /thanks.html.
 *
 * Required env vars:
 *   GMAIL_USER          — Gmail account that sends the mail
 *   GMAIL_APP_PASSWORD  — Gmail app password (16 chars)
 *
 * Optional:
 *   GMAIL_FROM_NAME     — defaults to "BurnsBuilt Contact"
 *   CONTACT_TO          — comma-separated override; defaults to Colin + Carson
 */
import nodemailer from "nodemailer";
import { rateLimit, rateLimitResponse } from "./_rate-limit.js";

const DEFAULT_TO = "colinmburns@gmail.com,carsonharlowburns@gmail.com";

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

const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const redirect = (location) => ({
  statusCode: 303,
  headers: { Location: location },
  body: "",
});

const json = (status, body) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "POST only" });
  }

  // Rate limit: 3 submissions / 5 minutes / IP. Humans don't legitimately
  // submit a quote form three times in five minutes.
  const rl = await rateLimit(event, { key: "contact-submit", limit: 3, windowSec: 300 });
  if (!rl.ok) return rateLimitResponse(rl);

  // Parse form-encoded body
  let fields = {};
  try {
    const ct = (event.headers["content-type"] || event.headers["Content-Type"] || "").toLowerCase();
    if (ct.includes("application/json")) {
      fields = JSON.parse(event.body || "{}");
    } else {
      // x-www-form-urlencoded — works for both Netlify-rendered and AJAX submits
      const params = new URLSearchParams(event.body || "");
      for (const [k, v] of params.entries()) fields[k] = v;
    }
  } catch (err) {
    return json(400, { error: "Invalid body: " + err.message });
  }

  // Honeypot — bots fill this, humans don't see it
  if (fields["bot-field"]) {
    return redirect("/thanks.html");
  }

  const name = (fields.name || "").trim();
  const email = (fields.email || "").trim();
  const phone = (fields.phone || "").trim();
  const service = (fields.service || "").trim();
  const message = (fields.message || "").trim();

  if (!name || !email || !message) {
    return json(400, { error: "Missing required fields: name, email, message" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: "Invalid email address" });
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("contact-submit: missing GMAIL_USER / GMAIL_APP_PASSWORD env vars");
    return json(500, { error: "Server is missing email credentials" });
  }

  const to = (process.env.CONTACT_TO || DEFAULT_TO)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const displayName = process.env.GMAIL_FROM_NAME || "BurnsBuilt Contact";
  const subject = `New contact: ${name}${service ? ` · ${service}` : ""}`;

  const text = [
    `New message from the BurnsBuilt contact form.`,
    ``,
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Phone:   ${phone || "(not provided)"}`,
    `Service: ${service || "(not specified)"}`,
    ``,
    `Message:`,
    message,
    ``,
    `--`,
    `Sent: ${new Date().toISOString()}`,
  ].join("\n");

  const html = `
<!doctype html>
<html><body style="margin:0;background:#f6f7fb;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a2236;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#fff;border:1px solid #e2e6f1;border-radius:8px;overflow:hidden;">
      <div style="background:#384765;color:#fff;padding:16px 20px;">
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.7;">BurnsBuilt · Contact form</div>
        <div style="font-size:18px;font-weight:700;margin-top:4px;">New message from ${escapeHtml(name)}</div>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:10px 20px;width:100px;color:#6b7390;border-bottom:1px solid #f1f3f9;">Name</td><td style="padding:10px 20px;border-bottom:1px solid #f1f3f9;font-weight:600;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding:10px 20px;color:#6b7390;border-bottom:1px solid #f1f3f9;">Email</td><td style="padding:10px 20px;border-bottom:1px solid #f1f3f9;"><a href="mailto:${escapeHtml(email)}" style="color:#1f6feb;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding:10px 20px;color:#6b7390;border-bottom:1px solid #f1f3f9;">Phone</td><td style="padding:10px 20px;border-bottom:1px solid #f1f3f9;">${phone ? `<a href="tel:${escapeHtml(phone)}" style="color:#1f6feb;">${escapeHtml(phone)}</a>` : '<span style="color:#9aa1b8;">not provided</span>'}</td></tr>
        <tr><td style="padding:10px 20px;color:#6b7390;border-bottom:1px solid #f1f3f9;">Service</td><td style="padding:10px 20px;border-bottom:1px solid #f1f3f9;">${escapeHtml(service) || '<span style="color:#9aa1b8;">not specified</span>'}</td></tr>
      </table>
      <div style="padding:16px 20px;">
        <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7390;margin-bottom:8px;">Message</div>
        <div style="font-size:14px;line-height:1.55;white-space:pre-wrap;background:#fafbfd;border:1px solid #eef0f7;border-radius:6px;padding:14px;">${escapeHtml(message)}</div>
      </div>
      <div style="padding:12px 20px;background:#fafbfd;border-top:1px solid #eef0f7;font-size:11px;color:#8a94a8;">
        Reply directly to this email to respond to ${escapeHtml(name)}.
      </div>
    </div>
  </div>
</body></html>
`.trim();

  try {
    await getTransporter().sendMail({
      from: `"${displayName}" <${process.env.GMAIL_USER}>`,
      to: to.join(", "),
      replyTo: `"${name}" <${email}>`,
      subject,
      text,
      html,
    });
  } catch (err) {
    console.error("contact-submit sendMail error:", err);
    return json(500, { error: "Failed to send email" });
  }

  return redirect("/thanks.html");
};
