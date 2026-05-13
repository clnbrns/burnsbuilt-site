# BurnsBuilt — Brand & Code Brief

> Read this file first. Every UI you build for BurnsBuilt should follow these rules.
> The full visual system lives in `design-system.html` (open in a browser to reference).

## What we are
BurnsBuilt is a father-and-son shop in **Aledo, TX** that builds fast modern websites and smart automations for local small businesses. Five days from kickoff to live site. Flat rate. No retainers. Claude Code accelerates the build; the father-son team owns the relationship and the craft.

## Voice (always)
- Plain-spoken. Slightly stubborn. Like a tradesperson who reads.
- Specific numbers, not adjectives. "4 days" not "fast." "+38% orders" not "growth."
- Short sentences. Real claims. No empty marketing language.
- Never write: "leverage," "synergy," "unlock value," "digital transformation partner," "empowering," "cutting-edge," "best-in-class," "journey."

## Naming
- Always one word, two caps: **BurnsBuilt**
- Never "Burns Built", "Burns-Built", "burnsbuilt" (except in URLs/handles)
- Domain: `burnsbuilt.co`

## The middle dot ( · )
Use in stamps, captions, labels: `Father · Son`, `Aledo · TX`, `Est. 2026`.
Never in body copy.

---

## Logo — The Twin Block

Two squares paired horizontally:
- **Left square (Father):** Harbor Navy background, Paper Cream "B"
- **Right square (Son):** Workshop Tan background, Harbor Navy "B"
- Gap between blocks = block width / 14 (about 1u on a 12u grid)
- Block height equals cap height of the letter

The mark is always paired with the wordmark "BurnsBuilt" except when used as an avatar/favicon.

### Logo do's & don'ts
✓ Use approved color pairs only (see palette below)
✓ Maintain clear space of one block-width on all sides
✓ Use SVG files in `assets/logo/` — never re-create the mark in code

✗ Don't stretch, skew, or rotate
✗ Don't recolor with non-brand colors
✗ Don't add drop shadow, outer glow, or other effects
✗ Don't put the mark on busy photographic backgrounds

---

## Color tokens

| Token | Hex | Use |
|---|---|---|
| `--navy` | #142640 | Primary anchor. Backgrounds, primary buttons, Father block |
| `--tan-2` | #C49A62 | Primary highlight. Son block, accents, CTAs on dark |
| `--tan-soft` | #EAD9BE | Quiet panels, badges, inline highlights |
| `--cream` | #F5ECE0 | Reverse-out type, large surfaces, signage |
| `--paper` | #FBF7F0 | **Default page background** |
| `--navy-deep` | #0D1A2D | Pressed states, deep gradients |
| `--steel` | #3D5A80 | Captions, blueprint detailing, secondary metadata |
| `--tan-3` | #B88850 | Hover states for tan, deeper accents |
| `--ink` | #0E1A2E | Default body text on light surfaces |
| `--bone` | #F0EEE9 | Doc/style-guide background |

Approved pairs (WCAG AA+):
- Navy on Cream / Cream on Navy (12.4:1 — AAA)
- Tan-2 on Navy (6.8:1 — AA)
- Navy on Paper (13.1:1 — AAA)

Tokens are exported in `tokens.css`, `tokens.json`, and `tailwind.config.js`. Import the one your stack uses.

---

## Typography

Three Google Fonts. Load all three on every page.

| Family | Use | Weights |
|---|---|---|
| **Archivo** | Display, headlines, wordmark | 400, 700, 800, 900 |
| **Inter** | Body, UI, long-form reading | 400, 500, 600, 700 |
| **JetBrains Mono** | Spec, labels, captions, stamps | 400, 500, 600 |

```html
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;700;800;900&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Type rules
- Headlines: Archivo 800, letter-spacing −2.5% to −2%
- Body: Inter 400, line-height 1.55
- Labels & stamps: JetBrains Mono uppercase, letter-spacing 0.18em–0.22em
- Use the highlight color (`--tan-3`) on the second word of a wordmark or in italics in headlines: `Built by hand. <em>Shipped in days.</em>`

### Type scale
| Tag | Size / Line | Family |
|---|---|---|
| Display | 84/88, −2.5% | Archivo 800 |
| H1 | 56/60, −2.2% | Archivo 800 |
| H2 | 36/42, −2% | Archivo 800 |
| H3 | 24/30, −1.5% | Archivo 800 |
| Body L | 18/27 | Inter 400 |
| Body | 15/23 | Inter 400 |
| Caption | 12, 0.18em uppercase | Mono 500 |
| Stamp | 10, 0.22em uppercase | Mono 500 |

---

## Components

### Buttons
- All buttons use 6px border-radius, 12px×20px padding, Archivo 700 14px uppercase with 0.04em tracking
- **Primary:** Navy bg / Cream text (hover: navy-2)
- **Tan:** Tan-2 bg / Navy text (hover: tan-3)
- **Ghost:** transparent / Navy text / 1.5px navy border (hover: navy bg, cream text)
- **Link:** no bg / Navy text / 2px tan-2 underline / not uppercase

### Badges
- Mono 10px, 0.2em uppercase tracking, 5×10px padding, 4px radius
- Live (green dot), Gold (tan dot), Dark (on navy), Ghost (bordered)

### Cards
- Background: Paper Cream (`--paper`) on Bone page
- 12px border-radius, 1px solid border using `rgba(20,38,64,0.12)`
- Always opens with a label (Mono 10px, 0.2em uppercase, in tan-3) above the title

### Inputs
- White bg, 1.5px border using `--rule`, 6px radius, 12×14 padding, Inter 14px
- Focus: border-color → `--navy`
- Label: Mono 10px, 0.2em uppercase, in steel

### Page surfaces
- Page bg: `--paper` for marketing, `--bone` for the design system itself
- Hero panels: navy radial gradient (`radial-gradient(120% 90% at 20% 20%, #1e3555 0%, #142640 40%, #0d1a2d 100%)`)

---

## Imagery system

Every hero panel speaks one of three vocabularies. Pick **one direction per page** — never mix.

1. **Flow** — three icon nodes (Attract → Automate → Convert) with dashed connector lines, navy gradient ground, the middle node highlighted in tan
2. **Device Collage** — a real client browser/site at left + tilted phone at right showing notifications. Use only with a real case study and real numbers.
3. **Ecosystem** — Twin Block at the center, dashed orbital rings, satellite chips ("Lead Captured," "Invoice Sent," etc.). For top-of-page brand moments.

All three live as reference compositions in `design-system.html` § 06.

---

## Files in this directory

- `design-system.html` — full visual reference. Open in browser when designing.
- `tokens.css` — CSS custom properties for the full palette
- `tokens.json` — JSON tokens (for Style Dictionary, Storybook, etc.)
- `tailwind.config.js` — Tailwind theme extension
- `assets/logo/` — SVG logo files
  - `twin-block.svg` — mark only
  - `twin-block-reversed.svg` — for dark surfaces
  - `lockup-horizontal.svg` — mark + wordmark
- `assets/fonts.html` — Google Fonts <link> snippet

---

## Quick prompts for Claude Code

When asking Claude Code to build a BurnsBuilt page:

> "Build a [component] for BurnsBuilt. Use the tokens in tokens.css. Voice should match the principles in CLAUDE.md — short, specific, no marketing speak. Reference design-system.html § [number] for the visual pattern."
