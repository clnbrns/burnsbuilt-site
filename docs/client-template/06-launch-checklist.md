# 06 · Launch Checklist — [Client Name]

> The "nothing falls through the cracks" doc. Carson runs this top-to-bottom before flipping DNS. Anything red here = no launch.

**Launch target:** [YYYY-MM-DD HH:MM CT]
**Old site URL:** [client URL]
**New staging URL:** `[slug].burnsbuilt.co` or [staging URL]
**Production URL:** [client URL]

---

## Pre-launch (T-3 days)

### Content

- [ ] Every page has unique `<title>` (50–60 chars)
- [ ] Every page has unique `<meta description>` (150–160 chars)
- [ ] Every page has exactly one `<h1>`
- [ ] All images have descriptive `alt` text
- [ ] No `Lorem ipsum` anywhere
- [ ] No placeholder phone numbers, addresses, or emails
- [ ] Spell-check passed
- [ ] Client name, address, phone consistent across every page

### SEO

- [ ] `sitemap.xml` lists every public URL with correct `<loc>` and reasonable priorities
- [ ] `robots.txt` allows crawling and references sitemap
- [ ] `<link rel="canonical">` on every page pointing to its own URL
- [ ] LocalBusiness or ProfessionalService JSON-LD on homepage
- [ ] Open Graph tags + Twitter card tags on every page
- [ ] No `<meta name="robots" content="noindex">` on public pages
- [ ] Structured data validates at [search.google.com/test/rich-results](https://search.google.com/test/rich-results)

### Performance

- [ ] Lighthouse Mobile Performance ≥ 80
- [ ] Lighthouse Accessibility ≥ 90
- [ ] Lighthouse Best Practices ≥ 90
- [ ] Lighthouse SEO ≥ 95
- [ ] No console errors in browser dev tools
- [ ] All images < 500KB (or have responsive `srcset` for larger ones)
- [ ] Web fonts preconnected
- [ ] No render-blocking resources flagged

### Functionality

- [ ] Every internal link resolves (no 404s) — run `wget --spider --recursive`
- [ ] Contact form submits successfully (test from incognito)
- [ ] Form notification email arrives in client's inbox within 1 minute
- [ ] Thanks page loads after form submit
- [ ] GA4 fires `generate_lead` event on form submit (verify in GA4 DebugView)
- [ ] All `tel:` and `mailto:` links work
- [ ] All external links open in new tabs (target="_blank" rel="noopener")

### Mobile

- [ ] Tested on iPhone Safari (real device, not just emulator)
- [ ] Tested on Android Chrome (real device)
- [ ] Tap targets ≥ 44×44 pixels
- [ ] No horizontal scroll on any page
- [ ] Forms usable on mobile keyboard

## Launch day (T-0)

### DNS

- [ ] Lower TTL on existing client DNS records to 60 seconds (do this 24h prior)
- [ ] Confirm new SSL cert is provisioned on Netlify/Vercel
- [ ] Update A record (or CNAME) to point to new host
- [ ] Verify DNS propagation: `dig clientdomain.com` shows new IP
- [ ] Verify https:// resolves with valid cert (no warnings)

### Redirects

- [ ] Every URL from `04-existing-site.md` redirects table has a 301 in place
- [ ] Test 5 random old URLs → confirm they redirect to new equivalents
- [ ] No redirect loops
- [ ] No 404s on previously-indexed paths

### Search Console

- [ ] Add new property in Google Search Console (URL prefix or domain)
- [ ] Verify ownership (Cloudflare DNS or HTML tag)
- [ ] Submit `sitemap.xml`
- [ ] Use URL Inspection → Request Indexing on homepage
- [ ] Use URL Inspection → Request Indexing on top 5 service pages

### Analytics

- [ ] GA4 property set up
- [ ] GA4 verified receiving traffic in real-time view
- [ ] `generate_lead` event marked as conversion in GA4
- [ ] (If applicable) Google Ads conversion linked
- [ ] (If applicable) Meta Pixel + CAPI verified

### Backups

- [ ] Snapshot of new site files committed to git
- [ ] Hosting set up with auto-deploy from main branch
- [ ] Domain registrar credentials documented in `99-comms.md`
- [ ] DNS settings screenshot saved
- [ ] All third-party logins documented in shared password manager

### Client handoff

- [ ] Send launch confirmation email to client
- [ ] Update client portal `/clients/[slug]/` page status to "Launched"
- [ ] Schedule 30-day check-in call
- [ ] Trigger first monthly subscription charge in Stripe (per T&C 3.2)

## Post-launch (T+1 to T+30)

### T+1 day

- [ ] Search GSC for crawl errors
- [ ] Run Lighthouse on production URL (should match staging)
- [ ] Submit a test form fill from a friend's phone — verify everything works in production
- [ ] Confirm first Stripe subscription charge processed

### T+7 days

- [ ] Check GSC for any URLs returning 404 — fix or redirect
- [ ] Check GA4 for unexpected drop in indexed pages or impressions
- [ ] Confirm GBP citation matches new site (NAP consistency)

### T+30 days

- [ ] Comparison report vs. baseline in `03-seo-audit.md`
- [ ] Send "30-day" report email to client with metrics
- [ ] Schedule monthly review call (if Standard or Custom tier)
