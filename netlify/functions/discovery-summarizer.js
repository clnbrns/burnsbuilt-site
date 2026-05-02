/**
 * BurnsBuilt — AI Discovery Summarizer
 * ==================================================================
 * Takes a discovery call transcript + intake form data + (optional)
 * existing-site URL and generates structured client onboarding docs:
 *   - intake.md — business context, goals, pain points
 *   - discovery.md — call summary, key signals, decisions made
 *   - scope.md — first-draft SOW with deliverables, timeline, exclusions
 *   - content-brief.md — what the client needs to provide and by when
 *
 * Designed to compress 3–4 hours of post-call writing into ~30 minutes
 * of editing the AI's first draft. Becomes the wedge that 10x's client
 * onboarding throughput.
 *
 * USAGE — call this function via HTTP POST from a private admin tool
 * or curl from your laptop:
 *
 *   POST https://burnsbuilt.co/.netlify/functions/discovery-summarizer
 *   Content-Type: application/json
 *   X-Admin-Key: <ADMIN_KEY env var>
 *
 *   {
 *     "client_name": "Aledo Coffee Co",
 *     "client_slug": "aledo-coffee-x9k2",
 *     "package_tier": "Standard Website",
 *     "intake_form": { ... full intake payload ... },
 *     "call_transcript": "<raw text of the discovery call>",
 *     "existing_site_url": "https://aledocoffee.example"  (optional)
 *   }
 *
 * Returns:
 *   { ok: true, docs: { intake_md, discovery_md, scope_md, content_brief_md } }
 *
 * Also emails Colin via Resend (if configured) with the four docs
 * formatted for copy/paste into the internal client folder.
 *
 * Required env vars:
 *   ANTHROPIC_API_KEY
 *   ADMIN_KEY            — shared secret to gate this endpoint
 *
 * Optional env vars (richer email):
 *   RESEND_API_KEY
 *   RESEND_FROM_EMAIL
 *   RESEND_TO_EMAIL
 * ==================================================================
 */

import Anthropic from "@anthropic-ai/sdk";

const getAnthropic = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ---- Master prompt ----
const SYSTEM_PROMPT = `You are a senior project manager at BurnsBuilt — a father-son web design and business automation studio in Aledo, TX. Colin (sales / ops) just finished a discovery call with a new client. Your job is to take the call transcript + intake form + (optionally) the client's existing site URL and produce four structured onboarding documents Colin can drop into the internal client folder with minimal editing.

CONTEXT YOU SHOULD ALWAYS APPLY:
- BurnsBuilt's pricing tiers:
  - Website Basic: $500 + $25/mo (5–8 pages)
  - Website Standard: $750 + $35/mo (10–15 pages, custom design)
  - Website Custom: $1,000+ + $50/mo (50+ pages, hyper-local SEO, integrations)
  - Automation Starter: $250 + $25/mo (one workflow)
  - Automation Growth: $500–$1,000 + $75/mo (multi-workflow)
  - Automation Custom: $3,000+ + $200/mo (custom CRMs, AI tools)
- Standard timelines: Marketing site 5–7 business days; Custom CRM 2–4 weeks; AI tools 3–6 weeks
- T&C: content due 7 days from kickoff or project pauses; one revision round per project; 50% deposit + 50% on final draft for $500+ projects

WRITING STYLE:
- Tight, scannable, plain English — not corporate
- Bulleted lists where possible
- Specific names, dates, dollar amounts, page counts wherever the source provides them
- Honest about uncertainty: "TBD — confirm with client" when info is missing
- Markdown formatting (headings, lists, tables, fenced sections)
- No fluff, no "we are excited to" phrases, no marketing-speak

OUTPUT FORMAT — respond with ONLY valid JSON in this exact shape (no prose outside the JSON, no markdown fences):

{
  "intake_md": "<full markdown content for intake.md>",
  "discovery_md": "<full markdown content for discovery.md>",
  "scope_md": "<full markdown content for scope.md>",
  "content_brief_md": "<full markdown content for content-brief.md>",
  "executive_summary": "<3–5 sentence summary of who this client is, what they need, and the recommended path>",
  "red_flags": ["<any concerns Colin should know about — empty array if none>"],
  "next_actions": ["<2–4 concrete next steps for Colin in the next 48 hours>"]
}`;

const buildUserPrompt = (input) => `New client just signed. Generate the four onboarding documents.

CLIENT: ${input.client_name}
SLUG: ${input.client_slug || "(not assigned)"}
PACKAGE: ${input.package_tier || "(not specified — recommend based on call)"}

EXISTING SITE: ${input.existing_site_url || "(none — new business or no current site)"}

INTAKE FORM SUBMISSION:
${typeof input.intake_form === "object" ? JSON.stringify(input.intake_form, null, 2) : input.intake_form || "(no intake form data provided)"}

DISCOVERY CALL TRANSCRIPT:
"""
${input.call_transcript || "(no transcript provided — work from intake form only)"}
"""

DOCUMENT TEMPLATES TO PRODUCE (each as a markdown string in the JSON response):

1. **intake_md** — match this structure:
   # Client Intake — [Client Name]

   ## Business basics
   - What they do, where, who they serve, how long they've been at it

   ## What we're building
   - Package tier
   - Why they came to us (pain point, trigger event)
   - What they're trying to achieve (specific outcomes if mentioned)

   ## Stakeholders
   - Decision maker(s), point of contact, anyone else with sign-off authority

   ## Tech & access
   - Existing tools (CRM, email, hosting, domain registrar)
   - What we'll need access to and when

   ## Brand & content
   - What exists (logos, photos, copy, brand guidelines)
   - What's missing
   - Photography/copywriting needs

   ## Concerns / red flags noted
   - Anything raised on the call worth tracking

2. **discovery_md** — match this structure:
   # Discovery Call — [Date]

   ## Attendees
   ## Key signals
   - 4–8 bullet points capturing the most important things heard
   ## Questions answered
   ## Open questions / follow-ups needed
   ## Decisions made
   ## Tone read
   - One paragraph: how engaged are they, how technical, how decisive

3. **scope_md** — match this structure:
   # Scope of Work — [Client Name]

   ## Project summary
   ## Deliverables (what we're building)
   ## Out of scope (what we are NOT building)
   ## Timeline
   ## Investment
   - Setup fee (one-time)
   - Monthly maintenance
   - Payment schedule per T&C
   ## Revisions included
   ## Acceptance criteria
   ## Risks & dependencies

4. **content_brief_md** — match this structure:
   # Content Brief — [Client Name]

   Per T&C, content is due within 7 calendar days of kickoff.
   This document lists everything we need from you, with examples.

   ## What we need by [Date]
   - Page-by-page copy needs (one section per page)
   - Brand assets (logos in SVG/PNG, colors, fonts)
   - Photography (specific shots needed)
   - Login credentials (which tools, who to share with, how)
   ## Templates / starter copy
   - Where it makes sense, draft a starting paragraph for each section so the client just edits

Now generate the four documents. Be specific. Use the actual client name, actual numbers, actual page counts. If something's unclear from the transcript, use "TBD — confirm with [client name]" rather than making it up.`;

// ---- Resend email of the four docs ----
const buildResendEmail = (input, output) => ({
  from: process.env.RESEND_FROM_EMAIL,
  to: [process.env.RESEND_TO_EMAIL],
  subject: `[Discovery] ${input.client_name} — onboarding docs ready`,
  html: `
<div style="font-family:-apple-system,system-ui,sans-serif;max-width:760px;color:#142640;">
  <h2 style="color:#142640;border-bottom:2px solid #c49a62;padding-bottom:8px;">
    Discovery summary — ${input.client_name}
  </h2>

  <p style="font-size:14px;line-height:1.6;">${output.executive_summary || "(no summary)"}</p>

  ${output.red_flags && output.red_flags.length > 0 ? `
  <h3 style="color:#c0392b;margin-top:20px;">⚠ Red flags</h3>
  <ul style="font-size:14px;line-height:1.6;">
    ${output.red_flags.map((f) => `<li>${f}</li>`).join("")}
  </ul>
  ` : ""}

  <h3 style="color:#142640;margin-top:20px;">✅ Next actions (next 48 hours)</h3>
  <ol style="font-size:14px;line-height:1.7;">
    ${(output.next_actions || []).map((a) => `<li>${a}</li>`).join("")}
  </ol>

  <hr style="border:0;border-top:1px solid #e5d8c0;margin:24px 0;">

  <h3 style="color:#142640;">📄 The four docs (copy into clients/${input.client_slug || "your-slug"}/)</h3>
  <p style="font-size:13px;color:#5a6a82;">Each block below is the content for one markdown file. Open the email source to copy raw markdown without HTML formatting.</p>

  ${["intake_md", "discovery_md", "scope_md", "content_brief_md"].map((key) => {
    const filename = key.replace("_md", ".md").replace("_", "-");
    return `
    <details style="margin:16px 0;border:1px solid #e5d8c0;border-radius:8px;padding:12px 16px;background:#fbf7f0;">
      <summary style="font-weight:700;cursor:pointer;color:#142640;">${filename}</summary>
      <pre style="white-space:pre-wrap;font-family:Menlo,Monaco,monospace;font-size:12px;line-height:1.5;background:#fff;padding:12px;border-radius:4px;margin-top:12px;">${(output[key] || "").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
    </details>`;
  }).join("")}

  <p style="font-size:12px;color:#5a6a82;margin-top:32px;">Generated by BurnsBuilt Discovery Summarizer · Claude Sonnet 4.5 · burnsbuilt.co</p>
</div>
`.trim(),
});

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
    return { ok: false, error: await r.text() };
  }
  return { ok: true, body: await r.json() };
};

// ==================================================================
// Handler
// ==================================================================
export const handler = async (event) => {
  // Only POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  // Auth gate (shared secret)
  const adminKey = event.headers["x-admin-key"] || event.headers["X-Admin-Key"];
  if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
    return { statusCode: 401, body: "Unauthorized — missing or invalid X-Admin-Key" };
  }

  // Parse input
  let input;
  try {
    input = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return { statusCode: 400, body: "Invalid JSON payload" };
  }

  // Validate
  if (!input.client_name || (!input.call_transcript && !input.intake_form)) {
    return {
      statusCode: 400,
      body: "Missing required fields. At minimum need: client_name + (call_transcript OR intake_form)",
    };
  }

  // ---- Step 1: Generate the four docs with Claude ----
  let output;
  try {
    const resp = await getAnthropic().messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 8000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildUserPrompt(input) }],
    });
    const text = resp.content?.[0]?.text || "";
    const cleaned = text.replace(/^```json\s*|\s*```$/g, "").trim();
    output = JSON.parse(cleaned);
  } catch (err) {
    console.error("Claude generation failed:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: "AI generation failed",
        detail: err.message?.slice(0, 200),
      }),
    };
  }

  // Defensive shape validation
  output.red_flags = Array.isArray(output.red_flags) ? output.red_flags : [];
  output.next_actions = Array.isArray(output.next_actions) ? output.next_actions : [];

  // ---- Step 2: Email Colin (optional, if Resend configured) ----
  const emailResult = await sendResendEmail(buildResendEmail(input, output));

  // ---- Log + respond ----
  console.log("Discovery summarized:", {
    client: input.client_name,
    slug: input.client_slug,
    docs_generated: ["intake_md", "discovery_md", "scope_md", "content_brief_md"]
      .filter((k) => output[k] && output[k].length > 0),
    red_flag_count: output.red_flags.length,
    email: emailResult.skipped ? "skipped" : emailResult.ok ? "sent" : "failed",
  });

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ok: true,
      client_name: input.client_name,
      executive_summary: output.executive_summary,
      red_flags: output.red_flags,
      next_actions: output.next_actions,
      docs: {
        intake_md: output.intake_md,
        discovery_md: output.discovery_md,
        scope_md: output.scope_md,
        content_brief_md: output.content_brief_md,
      },
      email: emailResult.skipped ? "skipped (Resend not configured)" : emailResult.ok ? "sent" : "failed",
    }),
  };
};
