# BurnsBuilt.co

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/clnbrns/burnsbuilt-site)

Marketing site for **BurnsBuilt** — a father-son web development and business
automation company based in Aledo, Texas.

Static HTML, CSS, and vanilla JavaScript. No build step.

## Structure

```
index.html        Homepage
about.html        About Colin & Carson
services.html     Services and pricing
contact.html      Contact form (wired to Netlify Forms)
thanks.html       Post-submit confirmation page
css/styles.css    All styles (CSS custom properties for theming)
js/main.js        Mobile nav + form validation
favicon.svg       "BB" mark
netlify.toml      Netlify config (headers, caching)
```

## Local preview

Any static server works. Example:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying to Netlify

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project → GitHub** and pick
   the repo. Build command: *(none)*. Publish directory: `.`
3. After the first deploy, go to **Forms** in the Netlify dashboard. The
   `contact` form will appear automatically.
4. Under **Forms → Settings & usage → Form notifications**, add an email
   notification so submissions hit your inbox.

The form uses Netlify's built-in spam filtering plus a honeypot field.

## Pending TODOs (grep for `TODO`)

- Replace `CB` photo placeholders in `about.html` with real Colin/Carson photos
- Replace phone number `(000) 000-0000` in `contact.html` and the JSON-LD in
  `index.html` with the real number
- Replace the three placeholder testimonials in `index.html` with real client
  quotes once we have them
