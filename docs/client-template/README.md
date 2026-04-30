# Client Template

> Template folder for every new BurnsBuilt client. Copy this entire directory to `docs/clients/[slug]/` when a sale closes, then fill in.

## How to use

```bash
# When a new client signs:
cp -r docs/client-template docs/clients/aledo-coffee-co
cd docs/clients/aledo-coffee-co
# Open each .md and fill in
```

## File map

| File | When you fill it in | Owner |
|---|---|---|
| `00-intake.md` | Before kickoff (from intake form) | Colin |
| `01-discovery.md` | During / right after discovery call | Colin |
| `02-scope.md` | After discovery, before deposit | Colin |
| `03-seo-audit.md` | Day 1–3 in parallel with discovery | Colin or Carson |
| `04-existing-site.md` | Before build kicks off | Carson |
| `05-build-log.md` | Daily during build | Carson |
| `06-launch-checklist.md` | T-3 days before launch | Carson, Colin reviews |
| `07-comms.md` | Updated continuously, every touchpoint | Whoever's on the touchpoint |

## What's NOT in this folder

- **Source code for the client's site** — separate repo or branch
- **Recordings & raw assets** — Drive / Box / wherever
- **Passwords** — 1Password Teams (link in `07-comms.md`)
- **Public-facing client portal** — that lives at `/clients/[slug]/index.html` in the main site repo

## Stage tags (for the project tracker / Notion)

Each client moves through stages in this order. Put the current stage in the front-matter of every file when it changes:

1. **Lead** — form submitted, not yet sold
2. **Sold** — deposit paid, kickoff scheduled
3. **Discovery** — kickoff done, intake refined, SOW being written
4. **Scoped** — SOW signed, content collection in progress
5. **Build** — Carson is shipping
6. **Review** — staging URL with client for feedback
7. **Approved** — client written approval received
8. **Launched** — DNS flipped, monitoring on
9. **Active** — monthly subscription billing, ongoing maintenance
10. **Churned / Completed** — relationship ended (paid out or canceled)
