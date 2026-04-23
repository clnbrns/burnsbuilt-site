# Case Study Screenshots

Drop screen grabs into the matching subfolder. Once files are named per the
convention below, I can wire them into the listing cards and case study pages
in a single commit.

## Folder → Case Study

| Folder | Case study | URL |
|---|---|---|
| `bearcat-turf/`      | Bearcat Turf marketing site | `/case-studies/bearcat-turf.html` |
| `bearcat-hq/`        | Bearcat HQ — custom CRM      | `/case-studies/bearcat-hq.html` |
| `bearcat-estimator/` | Bearcat Estimator — AI bids  | `/case-studies/bearcat-estimator.html` |
| `lndmrk-drone/`      | LNDMRK Drone marketing site  | `/case-studies/lndmrk-drone.html` |
| `dugoutdata/`        | DugoutData analytics         | `/case-studies/dugoutdata.html` |

## Naming convention (per folder)

**Required:**
- `hero.png` — primary cover image. Used as:
  - the preview image on the listing card at `/case-studies/`
  - the preview image on the "Recent work" cards on the homepage
  - the hero image at the top of the case study page
  - the Open Graph card when the case study gets shared on social
  - Recommended size: **1600 × 900** (16:9). PNG or JPG. Under 500 KB if possible.

**Optional (but recommended for impact):**
- `gallery-01.png` — first in-page screenshot (e.g. a dashboard view)
- `gallery-02.png` — second screenshot (e.g. a feature close-up)
- `gallery-03.png` — third screenshot
- `gallery-04.png` — fourth screenshot
  - Any size — will be displayed at the page's container width. 1600–2400 px wide ideal.
  - PNG for UI screenshots (crispest), JPG if it's heavy photography.

**Optional (fancy):**
- `hero-mobile.png` — mobile-specific variant of hero if the 16:9 crop doesn't flatter the subject on phones.
- `logo.svg` — if the case study subject has its own logo we should display alongside it.

## Tips

- **Take screenshots at 2× (Retina).** macOS: `Cmd + Shift + 4`, hold `Space` to snap a window. They'll land on your Desktop as `Screenshot ….png` — rename to `hero.png` and drop in the right folder.
- **Crop carefully.** Avoid browser chrome (tabs, URL bar) unless it adds context. For product shots, trim to just the app UI.
- **Keep file sizes sensible.** Anything over 500 KB per image — I'll run it through a compressor before shipping.
- **Alt text:** I'll auto-generate descriptive alt text per image (useful for SEO + accessibility). You don't need to worry about it.

## When you're done

Just say "wire up the screenshots" and I'll:
1. Replace the color-gradient preview tiles with `hero.png` on listing cards and homepage
2. Add a gallery section to each case study page that shows the `gallery-*.png` files
3. Set the `og:image` meta tag per case study so social previews are on-brand
4. Run each image through compression if needed

## Folder tree
```
images/case-studies/
├── bearcat-turf/
│   ├── hero.png         ← drop here
│   ├── gallery-01.png
│   ├── gallery-02.png
│   └── …
├── bearcat-hq/
├── bearcat-estimator/
├── lndmrk-drone/
└── dugoutdata/
```
