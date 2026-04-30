# BurnsBuilt — Client Onboarding Runbook

> Step-by-step from sale to launch. Use this with **every** client. As you discover what's repeatable, this doc gets sharper. As you discover what's NOT repeatable, this doc grows.

**Last updated:** 2026-04-30
**Owner:** Colin
**Status:** Draft — refine after each client through #5

---

## Stage 0 — Sale closes

**Trigger:** Client clicks Stripe Payment Link from `/pay/` or a custom quote and pays the deposit.

**Within 1 hour:**

1. Stripe email lands. Forward to your Notion inbox.
2. Add row to the **Clients** Notion database with:
   - Slug (last name + token, e.g. `smith-pq8w`)
   - Tier
   - Setup paid date
   - Monthly fee start date (= future launch date)
   - Stage = "Sold"
3. Reply to the client (manual for now — auto later via Stripe webhook):
   - "Got the deposit, thanks. Booking your kickoff call now — 3 time slots: [Calendly link or pasted times]."
   - Attach a copy of the T&C PDF (downloaded from `burnsbuilt.co/terms/`)
4. **Spin up their internal folder:**
   ```bash
   cd ~/Documents/Projects/burnsbuilt-site
   cp -r docs/client-template docs/clients/[slug]
   ```
5. **Spin up their portal page** (in the main site repo, public URL but unguessable):
   ```bash
   cp -r clients/example-client-x9k2 clients/[slug]-[random4chars]
   # Edit index.html — swap [Client Name], status to "Sold · kickoff scheduled"
   git add clients/[slug]-[random4chars]
   git commit -m "Spin up client portal: [Client Name]"
   git push
   ```
6. Send client the portal URL via email. They bookmark it.

---

## Stage 1 — Intake (Day 0–1)

**Trigger:** Client confirms kickoff time.

1. Send them the **intake form** link (Tally / Google Forms / portal page).
2. Block 90 minutes on your calendar:
   - 30 min before kickoff: review their intake submissions, scan their existing site
   - 30 min kickoff call
   - 30 min after kickoff: write up `01-discovery.md`
3. **Pre-call homework** (Colin, 30 min):
   - Open existing site in two tabs: phone width + desktop
   - Run Lighthouse audit on existing site → screenshot
   - `site:theirdomain.com` in Google → count indexed pages
   - Check their GBP, top 3 reviews, latest 3 reviews
   - Identify their top 3 local-pack competitors
   - Fill in `00-intake.md` with everything you found

---

## Stage 2 — Discovery (Day 1–3)

**Trigger:** Kickoff call happens.

1. **Record the call.** Granola / Otter / Fathom / Zoom Cloud — whatever's easiest.
2. **During the call:**
   - Don't take notes — listen. The recording handles capture.
   - Goal: identify the ONE business outcome they care about most. Everything else is supporting cast.
   - End with: "Here's what I'll send by tomorrow EOD: an SOW with deliverables, timeline, and the Stripe link for the balance. Sound good?"
3. **Within 24 hours:**
   - Run the recording through Claude (or an AI summarizer Netlify Function — see Phase 2 builds)
   - Fill in `01-discovery.md`
   - Draft `02-scope.md` — pull deliverables from intake + call
   - Draft `03-seo-audit.md` — baseline metrics for measuring impact
4. **Send SOW to client:**
   - Email: "Here's the scope I heard. Read through, reply 'looks good' if so. Once approved, here's the Stripe link for the balance."
   - Once balance is paid → move to Build.

---

## Stage 3 — Build (Day 3–7 for Standard, longer for Custom)

**Trigger:** Balance paid OR (per T&C 3.1) deposit paid for projects under $500.

1. **Carson takes over.** Colin is no longer in the loop except for client comms.
2. **Repo strategy:**
   - **Basic / Standard tier:** clone a "starter template" repo (TODO: build this — see Phase 2)
   - **Custom tier:** new dedicated repo per client
3. **Hosting strategy** (see "Hosting & sub-tenant model" below)
4. **Daily build log entries** in `05-build-log.md`. Take 2 minutes at end of each work block.
5. **Push to staging frequently.** Client sees real progress on the staging URL — reduces "are you actually working on this" anxiety.
6. **Update the client portal** when major milestones hit:
   - "Discovery done — moving to design"
   - "First draft live on staging — review here: [link]"
   - "Revisions in progress — back to you Tuesday"

---

## Stage 4 — Review (Day 7–9)

**Trigger:** Staging URL ready for client review.

1. **Email + text the client:**
   - "Staging is live: [URL]. Take a look, send any feedback by [date]. One revision round is included."
2. **Their feedback comes in.** Triage:
   - In-scope tweaks → do them
   - Out-of-scope additions → "great idea — separate quote, here's what it'd cost"
   - Subjective preferences → push back gently if needed: "I hear you, but for SEO reasons we want to keep X. Compromise: do Y instead?"
3. **Per T&C 2.3:** revision requests are due within 14 days. After that, treated as new work.
4. **Make the revisions.** Push to staging. Re-notify client.
5. **Get written approval** (per T&C 2.4). Email reply is fine. Save the email.

---

## Stage 5 — Launch (Day 9–10)

**Trigger:** Written approval received.

Run **`06-launch-checklist.md` top to bottom.** Don't skip steps. Every line item exists because it bit somebody once.

After launch:
1. Trigger first monthly Stripe subscription (per T&C 3.2)
2. Update Notion stage to "Active"
3. Schedule 30-day check-in call
4. Add to the maintenance kanban
5. **Ask for the testimonial / case study permission.** Right now, while they're glowing. T&C 5.4 says we have portfolio rights by default — but a quote is way better than just a screenshot.

---

## Hosting & sub-tenant model

### The decision tree

```
Tier?
├── Basic ($500 setup)
│   ├── Domain: client owns, registered in their Cloudflare
│   ├── DNS: their Cloudflare, BurnsBuilt added as user
│   └── Hosting: BurnsBuilt's Netlify org (one site per client)
│
├── Standard ($750 setup)
│   ├── Domain: client owns, their Cloudflare
│   ├── DNS: their Cloudflare, BurnsBuilt added as user
│   └── Hosting: BurnsBuilt's Netlify org (one site per client)
│
└── Custom ($1,000+ setup)
    ├── Domain: client owns, their Cloudflare
    ├── DNS: their Cloudflare, BurnsBuilt added as user
    ├── Hosting: client's own Netlify or Vercel team, BurnsBuilt as member
    └── Apps (Stripe / Twilio / Anthropic): always client-owned
```

### Why this split

- **Basic/Standard on BurnsBuilt's hosting:** volume tier, low margin per client, operational simplicity matters. Concentration risk is acceptable because the cost-to-rebuild is also low.
- **Custom on client's hosting:** these are bigger projects with bigger ownership stakes. T&C says they own the code — actually have it live in their account.

### Per-client setup commands (Basic / Standard tier)

```bash
# 1. Create a new Netlify site under BurnsBuilt org
netlify sites:create --name client-slug-burnsbuilt

# 2. Link to a new branch in the starter template repo
git checkout -b client/aledo-coffee-co
git push origin client/aledo-coffee-co

# 3. Connect Netlify to that branch
netlify link

# 4. Set up custom domain (after DNS propagates)
netlify domains:add aledo-coffee.com

# 5. Add client as a viewer on Netlify so they can see deploys
# (manual via dashboard — Netlify doesn't auto-create users)
```

### Cloudflare sub-tenant (when to use)

If you DO end up putting many client domains under one Cloudflare account (cheaper than each having their own paid Cloudflare):

- Use **Cloudflare for SaaS** (different product than basic Cloudflare) — designed exactly for this pattern
- Each client domain = a "Custom Hostname" attached to your fallback origin
- They keep DNS at their existing registrar; just CNAME a record to your Cloudflare
- Pricing: $0 for first 100 custom hostnames, then $2/month each

For < 10 clients this is overkill. Revisit at 20+.

---

## Communication cadence (per tier)

| Tier | During build | Active (post-launch) |
|---|---|---|
| Basic | 1 update per phase | Monthly email summary |
| Standard | 2x/week status | Monthly call + report |
| Custom | Daily standup if requested | Bi-weekly call + monthly report |

---

## When to fire a client

Per T&C 4.2 we can cancel for:
- Failure to provide content / access (Section 2.2)
- Failure to make timely payments (Section 3.4)
- Abusive / threatening behavior toward Colin or Carson
- Requesting work we can't deliver with quality

**Don't be afraid to use this.** Bad clients consume disproportionate hours and tank morale. The $500 you give back to fire them is the cheapest decision you'll make.

Trigger words / situations that should make you reach for T&C 4.2:
- Multiple late payments after first reminder
- Aggressive language in any channel
- Demanding work that isn't in the SOW and refusing to pay for additions
- Refusing to provide content for > 30 days
- Asking us to do anything ethically/legally questionable

---

## What this runbook will become (Phase 2 builds)

After client #5, the manual steps in this runbook should become:

1. **Stripe webhook handler** — auto-creates Notion row + portal page on payment
2. **AI Discovery Summarizer** — ingests call recording → fills `01-discovery.md` automatically
3. **AI SOW drafter** — ingests intake + discovery → drafts `02-scope.md`
4. **AI SEO auditor** — ingests existing site URL → drafts `03-seo-audit.md`
5. **Starter template repo** — `cookiecutter`-style scaffold for new client sites
6. **Hosting playbook script** — single command spins up Netlify + Cloudflare + Stripe customer

Don't build any of these until the manual version has shipped at least 3 clients. **Build the system around the work, not the other way around.**
