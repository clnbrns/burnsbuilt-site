# BurnsBuilt — Netlify Functions

## `lead-qualifier.js` — AI Lead Qualifier

Runs every time the contact form on burnsbuilt.co receives a submission.
Scores the lead with Claude Sonnet 4.5, sends Colin an SMS via Twilio,
and (optionally) emails Colin a full analysis + drafted reply via Resend.

---

## Setup checklist

### 1. Install dependencies (one time)

From the repo root:

```bash
npm install
```

This installs `@anthropic-ai/sdk` and `twilio` into `node_modules/` (gitignored).
Netlify will install them automatically on each deploy via `package.json`.

### 2. Set environment variables in Netlify

Go to **Netlify dashboard → Site → Site configuration → Environment variables**
and add:

| Variable                | Required | Value                                                           |
| ----------------------- | -------- | --------------------------------------------------------------- |
| `ANTHROPIC_API_KEY`     | Required | From [console.anthropic.com](https://console.anthropic.com)     |
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
- Claude Sonnet 4.5 API call: ~$0.005 (1500 tokens out, ~500 tokens in)
- Twilio SMS (1 segment, US): $0.008
- Resend email: free under 3000/mo
- Netlify Function execution: free under 125k invocations/mo

**Total: ~$0.013 per lead.** A 100-lead month costs about $1.30.

---

## Troubleshooting

| Symptom                          | Likely cause                                                  | Fix                                                                                  |
| -------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| No SMS arrives                   | Missing or wrong Twilio env vars                              | Check Site config → Env vars; redeploy after editing                                |
| SMS arrives but says "score 50, AI scoring unavailable" | Anthropic API key invalid or rate-limited                     | Check Netlify Function logs for the actual Claude error                              |
| Email channel never fires        | Resend env vars not set, or sender not verified               | Optional channel — function still works without it. To enable, set all 3 RESEND_* vars |
| Webhook fires but nothing happens| Webhook URL wrong, or Netlify Forms isn't pointing at this form | Forms → Notifications → confirm URL = `https://burnsbuilt.co/.netlify/functions/lead-qualifier` |
| Spam getting scored              | Honeypot bypassed                                             | Check function logs — `bot_field` value should be empty for real submissions         |
