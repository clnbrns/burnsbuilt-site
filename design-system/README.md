# BurnsBuilt — Claude Code Handoff Package

Drop this whole `handoff/` folder into your project root. Then in Claude Code:

```
cd your-project
# tell Claude: "Read CLAUDE.md and use it for every UI you build."
```

## What's inside

- **CLAUDE.md** — the brief Claude Code reads on every session. Voice, naming, components, imagery rules.
- **design-system.html** — full visual reference. Open in a browser when you want to see what you're building toward.
- **tokens.css** — CSS custom properties (`--bb-navy`, `--bb-tan`, etc.). Import on every page.
- **tokens.json** — same tokens, machine-readable. For Style Dictionary, Storybook, design tools.
- **tailwind.config.js** — Tailwind theme extension. Merge with your existing config.
- **assets/logo/** — SVG logo files (mark, reversed, horizontal lockup).
- **assets/fonts.html** — Google Fonts <link> snippet.

## Recommended setup

1. Move `CLAUDE.md` to your project root (Claude Code reads it from there).
2. Import `tokens.css` in your global stylesheet, OR merge `tailwind.config.js` if you use Tailwind.
3. Copy `assets/logo/*.svg` into your public/static folder.
4. Paste `assets/fonts.html` into your <head>.
5. Keep `design-system.html` checked into your repo as visual reference (`/docs/design-system.html`).

## Quick prompt for Claude Code

> "Build a [page or component] for BurnsBuilt. Reference CLAUDE.md for voice and component rules. Use the tokens in tokens.css. Match the visual patterns in design-system.html § [number]."
