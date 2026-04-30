# 04 · Existing Site Inventory — [Client Name]

> What's there today. Critical for migration: which URLs need 301 redirects, what content do we keep, what gets scrapped.

**Audited URL:** [client URL]
**Audit date:** [YYYY-MM-DD]
**Platform:** (WordPress / Wix / Squarespace / GoDaddy / custom)
**Hosting:** (where DNS points + actual server)

---

## Inventory of all pages

> Run a sitemap crawl (Screaming Frog free for < 500 URLs, or `wget --spider`). Capture every URL.

| URL | Title | Page type | Keep / Migrate / Scrap | Notes |
|---|---|---|---|---|
| / | | Home | | |
| /about | | About | | |
| /services | | Services | | |
| /contact | | Contact | | |

## Content we keep (verbatim or near-verbatim)

> Their words that resonate. Don't rewrite what's already good.

-
-

## Content we rewrite

> Sections where the message is right but the writing is off.

-
-

## Content we scrap entirely

> Pages or sections that aren't worth migrating.

-
-

## Redirects required at launch

> Any URL that has Google rankings or backlinks needs a 301 to its new home. Otherwise we lose the SEO equity.

```
old URL                              →   new URL                              status
/services/lawn-care.html             →   /services/lawn-care/                 301
/old-blog-post-2018-03-12            →   /                                    301
```

## Visual inventory

> Screenshots saved at `images/clients/[slug]/existing-site/`. Captures what they look like today so we can show the before/after.

- Home: ![home](existing-site/home.png)
- Services: ![services](existing-site/services.png)
- Contact: ![contact](existing-site/contact.png)

## Asset extraction

What we pull off the existing site:

- [ ] Logo (high-res or vector)
- [ ] Brand colors (hex codes)
- [ ] Fonts in use (current site)
- [ ] Photos worth keeping
- [ ] Customer testimonials
- [ ] Existing case studies / project galleries
- [ ] Service descriptions
- [ ] Team / about photos
- [ ] FAQ content

## Tech debt to leave behind

> Stuff their old site is doing that we're NOT replicating. Worth listing so client doesn't ask later.

-
-

## Cutover plan (DNS day)

1. **T-7 days:** stage new site at `[slug].burnsbuilt.co` or similar staging URL
2. **T-3 days:** client written approval
3. **T-1 day:** schedule DNS change for next morning
4. **T-0 (launch day):**
   - [ ] Lower DNS TTL on existing records to 60 seconds 24h before cutover
   - [ ] Point A / CNAME to Netlify/Vercel new site
   - [ ] Verify SSL provisions on new host
   - [ ] Hit every URL on the new site to verify no 404s
   - [ ] Submit new sitemap to Google Search Console
   - [ ] Verify 301 redirects from old URLs work
   - [ ] Test contact form submission
   - [ ] Check GA4 fires on first visit
5. **T+1 day:** monitor — any unexpected 404s in GSC, any drop in indexed pages
6. **T+30 days:** comparison report (rankings, GSC clicks, impressions vs. baseline)
