# MSM Brand Files

Drop MSM brand assets here. The page at `/msm-summer-2026-dfw/index.html` references them by these exact filenames — name your files to match and they'll appear automatically.

## Required (page works without these but uses placeholders)

| Filename | Used where | Recommended size/format |
|---|---|---|
| `logo.svg` | Hero, footer | SVG preferred. PNG fallback OK at 600px wide. |
| `logo-white.svg` | On dark backgrounds (hero overlay) | Same logo, white fill. |
| `wordmark.svg` | Sticky utility bar | Horizontal lockup, ~200px wide. |
| `favicon.svg` | Browser tab | 32×32 SVG or `.png`. |
| `og-image.jpg` | Social shares (Facebook, iMessage, etc.) | 1200×630 JPG, < 300KB |

## Optional brand color overrides

Edit the `:root` CSS variables in `index.html` to match MSM's exact hex codes:

```css
--msm-primary: #C8102E;     /* MSM red — replace with your hex */
--msm-secondary: #0A1F44;   /* deep navy — replace */
--msm-accent: #FFB81C;      /* gold/yellow accent — replace */
--msm-ink: #0E1014;
--msm-paper: #FFFFFF;
```

If you have a brand guide PDF, drop it here too as `msm-brand-guide.pdf` for future reference.
