# NCS Command — Brand & Design System

> Athletic-tech BI dashboard for National Championship Sports.
> This document is the source of truth for visual, motion, and component language.
> Drop this file into `docs/STYLE_GUIDE.md` or use as project `CLAUDE.md` context.

---

## 1. Brand Voice & Aesthetic

**Personality:** Athletic · Authoritative · Energetic · Data-dense
**Reference moodboard:** sports broadcast lower-thirds, ESPN BottomLine ticker, Bloomberg Terminal, Linear, modern stadium scoreboards.

**Do:**
- Lean into scoreboard typography (tall condensed numerals, ALL-CAPS eyebrows).
- Use red accents sparingly as **action / alert / live** signals, never as decoration.
- Treat numbers as the hero — type scale tops out on tabular numerics, not headlines.
- Use field-stripe and dot-grid textures at very low opacity (~3%) to evoke surface texture.

**Don't:**
- Don't use saturated brand colors as backgrounds (no red panels, no blue washes).
- Don't use rounded "friendly" cards — keep radii sharp (6px max).
- Don't use emoji or stock iconography. Lucide line icons only.
- Don't use gradient blobs, glassmorphism, or 3D shadows.

---

## 2. Color Tokens

All colors are defined in the Tailwind config under `theme.extend.colors`.

### 2.1 Surface scale (`ink.*`) — the foundation
The dashboard lives almost entirely on this neutral cool-navy ramp. Higher number = darker.

| Token       | Hex       | Use                                     |
|-------------|-----------|-----------------------------------------|
| `ink-900`   | `#070B1A` | App background (root canvas)            |
| `ink-800`   | `#0A1024` | Header, sidebar, table headers          |
| `ink-700`   | `#0F1730` | Elevated panels, cards                  |
| `ink-600`   | `#141C36` | Inner cards, badges, hover surfaces     |
| `ink-500`   | `#1B2444` | Default border                          |
| `ink-400`   | `#252F54` | Strong border, scrollbar thumb          |
| `ink-300`   | `#3A4571` | Muted text (timestamps, helper copy)    |
| `ink-200`   | `#8893BD` | Secondary text                          |
| `ink-100`   | `#C7CFEA` | Body text on dark                       |
| `ink-50`    | `#EEF1FA` | Primary text, hero numerics             |

### 2.2 Brand & accent
- **Crimson** — primary brand & action color. Only used for: action buttons, "Launch Campaign" CTAs, critical risk alerts, live indicators, the brand mark.
  - `crimson-500` `#E63946` (default)
  - `crimson-600` `#C12A36` (hover / pressed)
  - `crimson-400` `#F26B76` (text on dark surface)
  - `crimson-900` `#3A0E13` (tinted background for chips)

- **Sky-2** — analytics accent (charts, secondary info).
  - `sky2-500` `#3B82F6` · `sky2-400` `#60A5FA` · `sky2-900` `#0F2547`

### 2.3 Semantic state
| Purpose                   | Token       | Hex       |
|---------------------------|-------------|-----------|
| Success / filled bracket  | `win-500`   | `#22C55E` |
| Success tinted bg         | `win-900`   | `#0E2E1B` |
| Warning / registration gap| `warn-500`  | `#F59E0B` |
| Warning tinted bg         | `warn-900`  | `#3A2207` |
| Critical / risk           | `crimson-500` | `#E63946` |

**Risk tone mapping** (used in Registration Gap cards & Insights):
- `high` → crimson — needs immediate action
- `med`  → warn (amber) — monitor weekly
- `low`  → win (green) — healthy / locked

---

## 3. Typography

Three families, each with a distinct role.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Archivo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

### 3.1 Families & roles
| Family          | Tailwind class | Role                                           |
|-----------------|----------------|------------------------------------------------|
| **Inter**       | `font-sans`    | Default UI text, body copy, form controls      |
| **Archivo**     | `font-display` | Section titles, panel headers, **hero numerics** |
| **Archivo 900** | `font-score`   | Scoreboard digits (use via `.scorenum` helper) |
| **JetBrains Mono** | `font-mono` | Tabular data, timestamps, codes, helper labels |

### 3.2 Type scale
Numerics use `font-variant-numeric: tabular-nums` so columns align.

| Token          | Size  | Weight | Family   | Use                                  |
|----------------|-------|--------|----------|--------------------------------------|
| `scorenum-xl`  | 42px  | 900    | Archivo  | Hero KPI value                       |
| `scorenum-lg`  | 32px  | 900    | Archivo  | Section hero stats                   |
| `scorenum-md`  | 26px  | 900    | Archivo  | Card big numbers                     |
| `scorenum-sm`  | 22px  | 900    | Archivo  | Funnel stage counts, footer stats    |
| `display-lg`   | 18px  | 700    | Archivo  | Panel titles                         |
| `display-md`   | 14px  | 700    | Archivo  | Card titles, sidebar logo            |
| `body`         | 13px  | 500    | Inter    | Default body                         |
| `body-sm`      | 12.5px| 500    | Inter    | Inline UI text, table cells          |
| `meta`         | 11px  | 500    | Inter    | Helper / subline text                |
| `eyebrow`      | 10.5px| 700    | Archivo  | ALL-CAPS section eyebrows (.14em LS) |
| `mono-data`    | 11px  | 500    | JetBrains| Numbers in tables, deltas, codes     |

### 3.3 Helper classes (already in stylesheet)
```css
.scorenum    { font-family: Archivo; font-weight: 900; letter-spacing: -0.02em; font-variant-numeric: tabular-nums; }
.tabnum      { font-variant-numeric: tabular-nums; }
.label-eyebrow {
  font-family: Archivo; font-weight: 700; font-size: 11px;
  letter-spacing: 0.14em; text-transform: uppercase; color: #8893BD;
}
```

**Section eyebrow pattern** (the red rule + caps label that precedes every section title):
```jsx
<div className="flex items-center gap-2 mb-1.5">
  <span className="h-[3px] w-7 bg-crimson-500"></span>
  <span className="label-eyebrow">Action Center</span>
</div>
<h2 className="font-display font-bold text-[17px] tracking-tight">Registration Gap Queue</h2>
```

---

## 4. Spacing, Radius, Borders

- **Base unit:** 4px. Standard rhythm: `gap-3` (12px), `gap-5` (20px). Hero rows use 20px gaps.
- **Card padding:** 16–20px. Use `p-4` for compact tiles, `p-5` for hero panels.
- **Radius:** `6px` everywhere. Tailwind `rounded` is configured to `6px`. Buttons & badges also 6px. Pills use `4px`. Avoid `rounded-full` except on dots/progress fills.
- **Borders:** 1px `#1B2444` (`border-ink-500`). Hover states bump to crimson or sky tint at 30–50% alpha.

### Card shadow tokens
```css
shadow-tile       /* default: subtle inset + hairline */
shadow-tile-hover /* crimson-tinted on hover for actionable cards */
```

---

## 5. Iconography

**Library:** Lucide (v0.469.0). Loaded via UMD `lucide.min.js`.
**Stroke width:** `1.75` default, `2`–`2.4` for buttons and pills (where smaller icon needs to feel solid).
**Sizes:** `11px` (chip), `13px` (input affordance), `14px` (button), `16px` (panel header).

Allowed icon vocabulary (the ones currently in use — extend with intent):
`LayoutDashboard, DollarSign, ClipboardList, Megaphone, Trophy, UserPlus, Sparkles, Users, TrendingUp, Target, Activity, Calendar, MapPin, FileBarChart, Settings2, Search, Bell, Download, Plus, Filter, Zap, ChevronDown, ChevronRight, ChevronUp, ArrowRight, ArrowUpRight, ArrowDownRight, Check, CheckCircle2, Repeat, Sparkle, Globe, Map, Flag, Bookmark, CloudRain, AlertTriangle, X`

**Never:**
- Mix multiple icon libraries
- Use emoji as icons
- Use filled icons (we are strictly outline)
- Decorate dashboard tiles with iconography that doesn't communicate state

---

## 6. Core Components

All components live under `widgets.jsx`, `charts.jsx`, `primitives.jsx`. Re-implement these contracts when porting.

### 6.1 KpiTile
```jsx
<KpiTile kpi={{ id, label, value, delta, dir, sub, icon, accent }} sparkline={[...]} />
```
- `accent`: `'crimson' | 'sky' | 'win' | 'warn'` — top-left rule + icon tint.
- `delta` formatted with leading sign and unit, e.g. `+18.4%`, `−3.1%`, `+0.8x`.
- Sparkline is decorative — bottom-right at 50% opacity, fades to 90% on hover.

### 6.2 RegistrationGapCard
The "Registration Gap" widget — one card per under-filled bracket.

**Header row** must be a horizontal flex row, NOT stacked:
```jsx
<div className="flex items-start justify-between gap-3 mb-3">
  <Pill tone={tone.pill}>{tone.label}</Pill>
  <div className="flex flex-col items-end text-right">
    <span className="text-[11px] text-ink-300 font-mono">{date} · {region}</span>
    <span className="scorenum text-[26px] leading-none mt-1 text-ink-50">
      {need > 0 ? need : <Icon name="Check" size={20} className="text-win-500" />}
    </span>
    <span className="text-[10.5px] text-ink-200 font-mono mt-0.5">
      {need > 0 ? "need" : ""}
    </span>
    <span className="text-[10.5px] text-ink-300 font-mono mt-0.5">
      {filled}/{total} teams
    </span>
  </div>
</div>
```

**Body:** tournament name (`truncate` or `line-clamp-2` max), division mono code, progress bar (tone matches risk).

**CTAs (need > 0):** `Launch` (crimson) + `Invite Teams` (neutral).
- Row uses `flex gap-2 min-w-0`.
- Each button: `flex-1 min-w-0 whitespace-nowrap`.
- **Do NOT** use longer labels like "Launch Campaign" or "Invite Top Teams" — they overflow the card on standard 1280px viewports (3-col grid = ~327px cards, button row content area ≤290px). Overflow gets visually clipped by adjacent cards' backgrounds and looks broken (trailing letters cut off).

**CTAs (filled):** Green "Bracket full — locked in" confirmation row replaces both buttons.

**Card width:** minimum **280px**. Below that, content collapses. See §6.2.1 for the parent grid contract.

### 6.2.1 Registration Gap parent grid
Never more than 3 cards per row. The parent grid must be:
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
  {gaps.map(g => <RegistrationGapCard key={g.id} {...g} />)}
</div>
```
**Do not** use `grid-cols-5` or any column count > 3 — even if there are 5 brackets to show. With 5 cards in 1 row, each card becomes ~200px wide and content collapses (truncated tournament names, stacked headers, multi-line buttons). If there are more than 3 brackets, they wrap to the next row.

### 6.3 Pill
```jsx
<Pill tone="crimson" icon="Zap">CRITICAL</Pill>
```
Tones: `ink | crimson | sky | win | warn | ghost`. Always ALL-CAPS, ~10.5px, 0.05em tracking, 6px radius.

### 6.4 Bar
Progress bar with 6px height and 4 tones. Animates width on prop change (500ms ease).

### 6.5 InsightsBriefing
The AI executive briefing panel. Each insight has `tone: 'opportunity' | 'risk' | 'win'`, an icon, title (semibold ~13.5px), and 2-sentence body. Always include the **pulse-dot + "Live AI"** indicator in the header. Footer of each row: `Take action / Drill down / Save` buttons that appear at 70% opacity and fade to 100% on row hover.

### 6.6 LiveTicker
ESPN-style marquee under the topbar. 32px tall. `NCS Live` block on the left with a pulsing dot. Tagged chips: `LIVE` (crimson), `REG` (sky), `ALERT` (warn), `WIN` (green), `WX` (sky-900), `OPS / P&L` (neutral).

### 6.7 Funnel
5-stage CRM funnel as a 5-column grid of bordered tiles. Color borders match stage:
`Leads → Contacted → Qualified → Proposal → Registered` (`ink → sky → sky → warn → win`).

### 6.8 TopTeamsTable
12-column grid: `Rank (1) · Team (4) · Div (1) · Record (2) · Rating (2) · Status (2)`.
Rank 1 in crimson, ranks 2–3 in `ink-50`, the rest muted to `ink-200`.

---

## 7. Charts

All charts are hand-rolled SVG (no chart libs). Conventions:

- **Viewports** scale via `viewBox` — pass a fixed virtual `W x H` and let CSS handle responsive sizing.
- **Gridlines:** dashed `stroke-dasharray="2 4"`, color `#1B2444`. Baseline is solid.
- **Axis labels:** 9.5px JetBrains Mono in `#3A4571` / `#8893BD`.
- **Last data point in a time series** highlights crimson when "now/today" is meaningful.

### Color usage in charts
| Element                       | Color                       |
|-------------------------------|-----------------------------|
| Revenue bar (P&L)             | `crimson-500` w/ gradient   |
| Cost overlay                  | `ink-400` w/ gradient       |
| Margin line + area            | `win-500` with 18% area fill|
| Velocity bars (steady state)  | `sky2-500` w/ gradient      |
| Velocity bars (last 3 days)   | `crimson-500` (highlight)   |
| Sparklines (in KPI tiles)     | inherit accent color        |

---

## 8. Motion

Subtle, structural. No bouncing, no overshoot.

| Token          | Duration | Easing                                | Use                                  |
|----------------|----------|---------------------------------------|--------------------------------------|
| `tier-fade`    | 280ms    | `cubic-bezier(0.2, 0.8, 0.2, 1)`      | Tier switch / panel mount            |
| `num-in`       | 320ms    | `cubic-bezier(0.2, 0.8, 0.2, 1)`      | KPI numeric change                   |
| `pulse-dot`    | 1.6s ∞   | ease-in-out                           | "Live" indicator dots                |
| `ticker`       | 60s ∞    | linear                                | Marquee strip                        |
| Hover         | 200–300ms| ease-out                              | Buttons, table rows, cards           |

**Important:** Intro animations must use `transform` only (never `opacity: 0` as the from-state). Hidden-tab pause leaves elements stuck on frame 0 — anything keyed to opacity will be invisible until focus returns.

---

## 9. Layout

- **Grid:** 12-column max. Hero KPI row is 4 col on `lg`, 2 col on `sm`. Main body: 8 / 4 split (left = work, right = context).
- **Sidebar:** fixed 220px. Sticky, full-viewport.
- **Header:** sticky, 56px, with backdrop blur over `ink-800/80`.
- **Live ticker:** 32px directly under the header.
- **Content padding:** 24px horizontal, 20px vertical.
- **Section gap:** 20px between major panel rows.
- **Min content width:** 1280px (designed at 1440px).

---

## 10. Tier Adaptation

The single most important system behavior: **every metric, chart, table, and insight must adapt to the active tier** without changing layout.

| Tier         | Scope                           | Lens                                                  |
|--------------|---------------------------------|-------------------------------------------------------|
| **National** | All US regions · 412 events     | YoY trends, top-line P&L, region health, country ROAS |
| **Regional** | 1 region · ~64 events           | Cross-event optimization, regional campaigns, retention |
| **TO**       | 1 operator · 20–25 events/yr · Spring + Fall seasons | Tournament-by-tournament fill, age-group health, season P&L, local outreach |

**TO scope note:** A Tournament Organizer runs ~20–25 tournaments per year across a Spring season (Feb–Jul) and a Fall season (Aug–early Dec). The TO dashboard is **season-scoped, not single-event-scoped**. Each tournament has 5–7 age groups (9U–14U typical), and the Action Center surfaces under-filled tournaments first with a per-age-group breakdown.

**Implementation rule:** the React tree stays identical between tiers — only the `tier` object's data changes (`kpis`, `pnl`, `velocity`, `gaps`, `teams`, `pipeline`, `marketing`, `insights`, `ticker`). The TO tier additionally provides `tournaments[]` (array of `{ id, name, city, dates, daysOut, status, filled, capacity, revenue, ageGroups[] }`), and `RegistrationGapCenter` switches to `SeasonRegistrationCenter` rendering `TournamentRegistrationCard` widgets when `tier.id === 'to'`.

---

## 11. Copy & Voice

- Eyebrows: short, ALL-CAPS, no punctuation. ("Action Center", "Marketing Engine")
- Titles: imperative or noun-phrase, no period. ("Registration Gap Queue")
- KPI labels: 2–3 words, parenthetical time qualifier OK. ("Gross Revenue (YTD)")
- Insight bodies: 2 sentences max, last line proposes an action.
- Numbers: 
  - Money under $1M → `$248K`. Over $1M → `$48.2M`.
  - Percentages with 1 decimal when delta < 10%, no decimal when ≥ 10%.
  - Multipliers: `6.4x` (lowercase x, no space).

---

## 12. Don'ts (the must-not list)

1. **No** filled-color cards — backgrounds stay neutral, color lives in borders/text/accents.
2. **No** drop shadows beyond the two tokens above.
3. **No** more than two accent colors on a single panel.
4. **No** opacity-based intro animations (see §8).
5. **No** placeholder lorem ipsum — use the seeded mock data in `data.jsx`.
6. **No** chart legends with circular swatches — use 10px squares (or 4px lines for line series).
7. **No** invented icons. Stick to the Lucide vocabulary in §5.

---

## 13. File Architecture (current build)

```
index.html            # Tailwind config + global CSS + script tags
data.jsx              # window.__NCS = { TIERS, NAV } — all mock data
primitives.jsx        # Icon, Pill, SectionTitle, Delta, Bar
charts.jsx            # PnLChart, VelocityChart, Sparkline, MarketingAttribution, Funnel
widgets.jsx           # KpiTile, RegistrationGapCard, TopTeamsTable, InsightsBriefing, LiveTicker
app.jsx               # Sidebar, Header, TierSwitcher, Dashboard composition, Toast
tweaks-panel.jsx      # In-prototype tweak controls
```

When porting to a production stack: each `*.jsx` becomes a folder of named-export components, the `window.__P/__C/__W/__NCS` globals become proper imports, and Tailwind moves from CDN to a configured PostCSS pipeline (preserve the same `theme.extend` block verbatim).
