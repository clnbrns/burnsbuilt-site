/**
 * BurnsBuilt — AI Lead Qualifier
 * ==================================================================
 * Netlify Function triggered by Netlify Forms outgoing webhook.
 *
 * Flow:
 *   1. Contact form submission lands → Netlify Forms captures
 *   2. Netlify fires this function via Outgoing Webhook
 *   3. Gemini scores the lead, picks a tier, drafts a reply
 *   4. Twilio sends Colin an SMS with score + summary
 *   5. (Optional) Resend emails Colin the full analysis + drafted reply
 *
 * Required env vars (set in Netlify dashboard → Site config → Env vars):
 *   GEMINI_API_KEY       — from aistudio.google.com (Get API key)
 *   TWILIO_ACCOUNT_SID
 *   TWILIO_AUTH_TOKEN
 *   TWILIO_FROM_NUMBER   — e.g. "+12055551234" (Twilio-issued SMS number)
 *   COLIN_MOBILE         — e.g. "+16829999240" (where the alert SMS goes)
 *
 * Optional env vars (richer email channel):
 *   RESEND_API_KEY       — from resend.com (free tier: 3000/mo)
 *   RESEND_FROM_EMAIL    — e.g. "leads@burnsbuilt.co" (verified Resend sender)
 *   RESEND_TO_EMAIL      — Colin's inbox, e.g. "colinmburns@gmail.com"
 *
 * Webhook setup:
 *   Netlify dashboard → Site → Forms → Form notifications → Add notification
 *   → "Outgoing webhook" → Event: "New form submission" → Form: "contact"
 *   → URL: https://burnsbuilt.co/.netlify/functions/lead-qualifier
 * ==================================================================
 */

import twilio from "twilio";
import { getStore } from "@netlify/blobs";

// ---- Lazy clients (only init when needed; allows function to load if env is partial) ----
const getTwilio = () => twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const getLeadsStore = () => getStore("leads");

// ---- Gemini REST helper (no SDK; single fetch keeps the dep tree slim) ----
const GEMINI_MODEL = "gemini-2.5-flash";
const callGemini = async ({ system, user, maxOutputTokens = 1500 }) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: [{ role: "user", parts: [{ text: user }] }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens,
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
  return text;
};

// ---- Gemini prompt ----
const SYSTEM_PROMPT = `You are a sales analyst at BurnsBuilt — a father-son web design and business automation shop in Aledo, TX, serving the DFW metroplex. Colin runs sales and ops. Carson does most of the building. They sell three things: custom websites, business automation (lead follow-up, missed-call text-back, custom CRMs, AI tools), and combinations of both.

Pricing tiers:
- Website Basic: $500 setup + $25/mo (5–8 pages)
- Website Standard: $750 + $35/mo (10–15 pages, custom design, expanded SEO)
- Website Custom: $1,000+ + $50/mo (50+ pages, hyper-local SEO, integrations)
- Automation Starter: $250 + $25/mo (one workflow)
- Automation Growth: $500–$1,000 + $75/mo (3–5 connected workflows)
- Automation Custom: $3,000+ + $200/mo (custom CRMs, AI-powered tools)

Your job: when a contact form submission lands, score the lead, suggest the right tier, flag urgency, and draft a personalized reply email Colin can review and send within minutes.

Scoring rubric (1–100):
- 90–100: Real budget mentioned, specific scope, urgency signal, named business
- 70–89: Clear need, reasonable description, professional tone
- 50–69: Generic inquiry, vague scope, but still a real business
- 30–49: Tire-kicker signals, "just looking," no specifics
- 1–29: Likely spam, suspicious wording, free-tier shopper

Respond with ONLY valid JSON. No markdown, no prose outside the JSON, no code fences.`;

const buildUserPrompt = (lead) => `New lead via contact form:

Name: ${lead.name || "(not provided)"}
Email: ${lead.email || "(not provided)"}
Phone: ${lead.phone || "(not provided)"}
Service interest: ${lead.service || "(not specified)"}
Message:
"""
${lead.message || "(no message)"}
"""

Score this lead and draft Colin's reply. Return JSON in this exact shape:

{
  "score": <integer 1-100>,
  "score_reasoning": "<one sentence explaining the score>",
  "suggested_tier": "<exact tier name from the list above>",
  "urgency": "<low|medium|high>",
  "key_signals": ["<signal 1>", "<signal 2>", "<up to 4 signals total>"],
  "drafted_email_subject": "<concise subject line, < 60 chars>",
  "drafted_email": "<full email body, 4–8 sentences, signed -Colin. Reference specifics from their message. Suggest the tier with one-line rationale. End with a clear next step (call, calendar link, or specific question).>"
}`;

// ---- Twilio SMS body builder ----
const buildSmsBody = (lead, analysis) => {
  const urgencyEmoji = { low: "🟢", medium: "🟡", high: "🔥" }[analysis.urgency] || "📩";
  const signals = analysis.key_signals.slice(0, 2).join(" · ");
  return `${urgencyEmoji} NEW LEAD ${analysis.score}/100
${lead.name || "(no name)"} · ${lead.service || "(no service)"}
${analysis.score_reasoning}
Tier: ${analysis.suggested_tier}
Signals: ${signals}
Reply drafted — check email/Netlify Forms`;
};

// ---- Resend email body (optional channel) ----
const buildResendEmail = (lead, analysis) => ({
  from: process.env.RESEND_FROM_EMAIL,
  to: [process.env.RESEND_TO_EMAIL],
  subject: `[Lead ${analysis.score}/100] ${lead.name || "New lead"} · ${analysis.suggested_tier}`,
  html: `
<div style="font-family:-apple-system,system-ui,sans-serif;max-width:680px;color:#142640;">
  <h2 style="color:#142640;border-bottom:2px solid #c49a62;padding-bottom:8px;">
    New Lead · ${analysis.score}/100 · ${analysis.urgency.toUpperCase()} urgency
  </h2>
  <table style="border-collapse:collapse;width:100%;font-size:14px;margin:16px 0;">
    <tr><td style="padding:6px 12px 6px 0;color:#5a6a82;">Name</td><td><strong>${lead.name || "—"}</strong></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#5a6a82;">Email</td><td><a href="mailto:${lead.email}" style="color:#142640;">${lead.email || "—"}</a></td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#5a6a82;">Phone</td><td>${lead.phone ? `<a href="tel:${lead.phone}" style="color:#142640;">${lead.phone}</a>` : "—"}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#5a6a82;">Service</td><td>${lead.service || "—"}</td></tr>
    <tr><td style="padding:6px 12px 6px 0;color:#5a6a82;">Suggested tier</td><td><strong>${analysis.suggested_tier}</strong></td></tr>
  </table>

  <h3 style="color:#142640;margin-top:24px;">Their message</h3>
  <blockquote style="border-left:3px solid #c49a62;padding:8px 16px;margin:8px 0;background:#fbf7f0;font-size:14px;line-height:1.6;">
    ${(lead.message || "(no message)").replace(/\n/g, "<br>")}
  </blockquote>

  <h3 style="color:#142640;margin-top:24px;">AI analysis</h3>
  <p style="font-size:14px;line-height:1.6;"><strong>Score:</strong> ${analysis.score}/100 — ${analysis.score_reasoning}</p>
  <p style="font-size:14px;line-height:1.6;"><strong>Key signals:</strong></p>
  <ul style="font-size:14px;line-height:1.7;">
    ${analysis.key_signals.map((s) => `<li>${s}</li>`).join("")}
  </ul>

  <h3 style="color:#142640;margin-top:24px;">Drafted reply (copy &amp; send)</h3>
  <div style="border:1px solid #e5d8c0;background:#fff;padding:16px;border-radius:8px;font-size:14px;line-height:1.7;">
    <p style="margin:0 0 8px;color:#5a6a82;font-size:13px;"><strong>Subject:</strong> ${analysis.drafted_email_subject}</p>
    <hr style="border:0;border-top:1px solid #e5d8c0;margin:12px 0;">
    <div style="white-space:pre-wrap;">${analysis.drafted_email.replace(/\n/g, "<br>")}</div>
  </div>

  <p style="font-size:12px;color:#5a6a82;margin-top:32px;">Generated by BurnsBuilt Lead Qualifier · Gemini 2.5 Flash · burnsbuilt.co</p>
</div>
`.trim(),
});

// ---- Resend HTTP call (no SDK needed — single fetch) ----
const sendResendEmail = async (payload) => {
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL || !process.env.RESEND_TO_EMAIL) {
    return { skipped: true, reason: "Resend not configured" };
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.text();
    return { ok: false, error: err };
  }
  return { ok: true, body: await r.json() };
};

// ---- Lead extraction (handles multiple Netlify Forms payload shapes) ----
const extractLead = (rawBody) => {
  let payload;
  try {
    payload = typeof rawBody === "string" ? JSON.parse(rawBody) : rawBody;
  } catch {
    return null;
  }
  // Netlify Forms outgoing webhook payload: { ..., data: { name, email, ... }, ... }
  // Or possibly nested: payload.data
  const data = payload.data || payload.payload?.data || payload;
  return {
    name: (data.name || "").trim(),
    email: (data.email || "").trim(),
    phone: (data.phone || "").trim(),
    service: (data.service || "").trim(),
    message: (data.message || "").trim(),
    bot_field: (data["bot-field"] || "").trim(),
    terms_accepted: data.terms_accepted,
  };
};

// ==================================================================
// Handler
// ==================================================================
export const handler = async (event) => {
  // Only POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Parse incoming Netlify Forms webhook payload
  const lead = extractLead(event.body);
  if (!lead) {
    console.error("Could not parse webhook body:", event.body);
    return { statusCode: 400, body: "Invalid payload" };
  }

  // Spam: honeypot field filled
  if (lead.bot_field) {
    console.log("Honeypot triggered — silently dropped:", lead.email);
    return { statusCode: 200, body: "OK (spam filtered)" };
  }

  // Spam: missing required fields (defensive — Netlify already validates)
  if (!lead.email || !lead.message) {
    console.log("Incomplete lead — skipping AI analysis:", lead);
    return { statusCode: 200, body: "OK (incomplete)" };
  }

  // ---- Step 1: Score with Gemini ----
  let analysis;
  try {
    const text = await callGemini({
      system: SYSTEM_PROMPT,
      user: buildUserPrompt(lead),
      maxOutputTokens: 1500,
    });
    // responseMimeType=application/json should give us clean JSON, but strip
    // any accidental markdown code fences just in case.
    const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
    analysis = JSON.parse(cleaned);
  } catch (err) {
    console.error("Gemini scoring failed:", err);
    // Fail loudly to Twilio so Colin still gets notified — even without AI insight
    analysis = {
      score: 50,
      score_reasoning: "AI scoring unavailable — manual review needed.",
      suggested_tier: "Unknown — review manually",
      urgency: "medium",
      key_signals: [`Gemini error: ${err.message?.slice(0, 80) || "unknown"}`],
      drafted_email_subject: "Thanks for reaching out",
      drafted_email: "(AI draft unavailable — please reply manually.)",
    };
  }

  // Validate analysis shape (defensive)
  analysis.score = Math.max(1, Math.min(100, parseInt(analysis.score) || 50));
  analysis.urgency = ["low", "medium", "high"].includes(analysis.urgency) ? analysis.urgency : "medium";
  analysis.key_signals = Array.isArray(analysis.key_signals) ? analysis.key_signals.slice(0, 4) : [];

  // ---- Step 2: SMS to Colin (always fires) ----
  let smsResult = { ok: false };
  try {
    const sms = await getTwilio().messages.create({
      body: buildSmsBody(lead, analysis),
      from: process.env.TWILIO_FROM_NUMBER,
      to: process.env.COLIN_MOBILE,
    });
    smsResult = { ok: true, sid: sms.sid };
  } catch (err) {
    console.error("Twilio SMS failed:", err);
    smsResult = { ok: false, error: err.message };
  }

  // ---- Step 3: Resend email (optional, richer payload) ----
  const emailResult = await sendResendEmail(buildResendEmail(lead, analysis));

  // ---- Step 4: Persist to Netlify Blobs for the admin dashboard ----
  // Key format: lead-<timestamp>-<random> — gives natural reverse-chrono sort
  // and uniqueness even if two submissions arrive in the same millisecond.
  let storedKey = null;
  try {
    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    storedKey = `lead-${ts}-${rand}`;
    const record = {
      id: storedKey,
      received_at: new Date(ts).toISOString(),
      lead: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone || null,
        service: lead.service,
        message: lead.message,
      },
      analysis,
      status: "new",
      status_updated_at: null,
      notes: "",
      sms_sent: smsResult.ok,
      email_sent: emailResult.ok === true,
    };
    await getLeadsStore().setJSON(storedKey, record);
  } catch (err) {
    console.error("Failed to persist lead to Blobs:", err);
    // Non-fatal — the SMS + email still went out; we just lose the dashboard entry
  }

  // ---- Log full analysis to Netlify Function logs (visible in dashboard) ----
  console.log("Lead processed:", {
    id: storedKey,
    lead: { name: lead.name, email: lead.email, service: lead.service },
    analysis,
    sms: smsResult,
    email: emailResult,
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ok: true,
      id: storedKey,
      score: analysis.score,
      tier: analysis.suggested_tier,
      sms: smsResult.ok ? "sent" : "failed",
      email: emailResult.skipped ? "skipped" : emailResult.ok ? "sent" : "failed",
    }),
  };
};
