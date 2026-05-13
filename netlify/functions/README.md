# BurnsBuilt — Netlify Functions

Two AI-powered functions support the BurnsBuilt operations stack:

- **`lead-qualifier.js`** — fires on every contact form submission, scores leads, drafts replies, texts Colin
- **`discovery-summarizer.js`** — turns a discovery call transcript + intake form into the four onboarding docs (intake / discovery / scope / content-brief)

---

## `lead-qualifier.js` — AI Lead Qualifier

Runs every time the contact form on burnsbuilt.co receives a submission.
Scores the lead with Gemini 2.5 Flash, sends Colin an SMS via Twilio,
and (optionally) emails Colin a full analysis + drafted reply via Resend.

---

## Setup checklist

### 1. Install dependencies (one time)

From the repo root:

```bash
npm install
```

This installs `twilio` and `@netlify/blobs` into `node_modules/` (gitignored).
Netlify will install them automatically on each deploy via `package.json`.
Gemini is called over plain `fetch` — no SDK dependency.

### 2. Set environment variables in Netlify

Go to **Netlify dashboard → Site → Site configuration → Environment variables**
and add:

| Variable                | Required | Value                                                           |
| ----------------------- | -------- | --------------------------------------------------------------- |
| `GEMINI_API_KEY`        | Required | From [aistudio.google.com](https://aistudio.google.com/app/apikey) |
| `TWILIO_ACCOUNT_SID`    | Required | Twilio dashboard → Account Info                                 |
| `TWILIO_AUTH_TOKEN`     | Required | Twilio dashboard → Account Info                                 |
| `TWILIO_FROM_NUMBER`    | Required | Twilio-issued SMS number, e.g. `+12055551234`                   |
| `COLIN_MOBILE`          | Required | Where the SMS alert goes, e.g. `+16829999240`                   |
| `RESEND_API_KEY`        | Optional | From [resend.com](https://resend.com) (free tier: 3000/mo)      |
| `RESEND_FROM_EMAIL`     | Optional | Verified Resend sender, e.g. `leads@burnsbuilt.co`              |
| `RESEND_TO_EMAIL`       | Optional | Where the email goes, e.g. `colinmburns@gmail.com`              |

Without `RESEND_*` vars, the function still runs — just SMS-only (no email channel).

### 3. Wire the Netlify Forms webhook

Go to **Netlify dashboard → Site → Forms → Form notifications → Add notification**:

- Event: `New form submission`
- Form: `contact`
- Type: `Outgoing webhook`
- URL to notify: `https://burnsbuilt.co/.netlify/functions/lead-qualifier`

Save. Done.

### 4. Test it

Submit the contact form on burnsbuilt.co with a test message. Within ~10
seconds Colin should receive:

- **SMS** with score, tier, and key signals
- **Email** with full analysis + drafted reply (if Resend is configured)

Check Netlify dashboard → Functions → `lead-qualifier` → Logs for the full JSON
analysis if anything looks off.

---

## What the SMS looks like

```
🔥 NEW LEAD 87/100
Sarah Smith · Website
Strong fit — explicit budget, real business name, urgency signal
Tier: Website Standard
Signals: $750 mentioned · Aledo plumber · 2-week timeline
Reply drafted — check email/Netlify Forms
```

## What the email looks like

A clean, branded HTML email with:
- Lead name / email / phone / service / suggested tier
- Their original message in a quote block
- AI score + reasoning + key signals as a bulleted list
- Drafted subject line + email body in a copy-friendly box, signed `-Colin`

Colin can copy/paste/tweak the drafted reply and send within minutes of the lead landing.

---

## Cost estimate

Per lead processed:
- Gemini 2.5 Flash API call: ~$0.0005 (1500 tokens out, ~500 tokens in)
- Twilio SMS (1 segment, US): $0.008
- Resend email: free under 3000/mo
- Netlify Function execution: free under 125k invocations/mo

**Total: ~$0.0085 per lead.** A 100-lead month costs about $0.85. Gemini also has a generous free tier — early on this is effectively SMS cost only.

---

## Troubleshooting

| Symptom                          | Likely cause                                                  | Fix                                                                                  |
| -------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| No SMS arrives                   | Missing or wrong Twilio env vars                              | Check Site config → Env vars; redeploy after editing                                |
| SMS arrives but says "score 50, AI scoring unavailable" | Gemini API key invalid or rate-limited                        | Check Netlify Function logs for the actual Gemini error                              |
| Email channel never fires        | Resend env vars not set, or sender not verified               | Optional channel — function still works without it. To enable, set all 3 RESEND_* vars |
| Webhook fires but nothing happens| Webhook URL wrong, or Netlify Forms isn't pointing at this form | Forms → Notifications → confirm URL = `https://burnsbuilt.co/.netlify/functions/lead-qualifier` |
| Spam getting scored              | Honeypot bypassed                                             | Check function logs — `bot_field` value should be empty for real submissions         |

---

## `discovery-summarizer.js` — AI Discovery Summarizer

Turns a discovery call transcript + intake form into four onboarding docs (`intake.md`, `discovery.md`, `scope.md`, `content-brief.md`) you can drop into the internal client folder. Compresses 3–4 hours of post-call writing into ~30 minutes of editing the AI's first draft.

### Setup

Requires the `ADMIN_KEY` env var (any random string you choose) — used as a shared secret to gate this endpoint, since it isn't form-driven.

```
GEMINI_API_KEY       — already set (shared with lead-qualifier)
ADMIN_KEY            — pick any random string, e.g. `openssl rand -hex 32`
RESEND_API_KEY       — optional, same as lead-qualifier
RESEND_FROM_EMAIL    — optional
RESEND_TO_EMAIL      — optional
```

### Usage — call from your laptop after a discovery call

The included CLI helper at `tools/summarize-discovery.sh` prompts for the inputs and POSTs to the function.

```bash
# From repo root
bash tools/summarize-discovery.sh
```

Or curl directly:

```bash
curl -X POST https://burnsbuilt.co/.netlify/functions/discovery-summarizer \
  -H "Content-Type: application/json" \
  -H "X-Admin-Key: $ADMIN_KEY" \
  -d '{
    "client_name": "Aledo Coffee Co",
    "client_slug": "aledo-coffee-x9k2",
    "package_tier": "Standard Website",
    "intake_form": { "business_name": "Aledo Coffee Co", "...": "..." },
    "call_transcript": "<paste the raw call transcript here>",
    "existing_site_url": "https://aledocoffee.example"
  }'
```

### What you get back

JSON response with:
- `executive_summary` — 3–5 sentence read on the client
- `red_flags` — anything Colin should worry about (empty array if clean)
- `next_actions` — 2–4 concrete next steps
- `docs.intake_md` / `discovery_md` / `scope_md` / `content_brief_md` — full markdown, copy/paste into the internal client folder

If Resend is configured, you also get an email with the same content rendered as collapsible `<details>` blocks (one per doc) so you can preview each one before copying.

### Cost

Per discovery summarization:
- Gemini 2.5 Pro: ~$0.04 (≈8K output tokens, 2–4K input tokens with full transcript)
- Resend email: free under 3000/mo

**~$0.04 per discovery call summarized.** A 50-client year costs $2 in API fees, saves ~150 hours of post-call writing.
