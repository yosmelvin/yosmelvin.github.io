# YMT Solution — Portfolio

Official portfolio website for **YMT Solution, Inc.**, a software house based in
Jakarta Barat, Indonesia. Single-page static site built with HTML5, CSS3, and
vanilla JavaScript on top of the Bootstrap 3 "Agency" theme.

Live at: https://yosmelvin.github.io

## Features

- **Bilingual** — English / Bahasa Indonesia toggle (persisted in `localStorage`,
  `?lang=en|id` deep links, `hreflang` + `x-default` tags, fully translated
  `js/i18n.js` dictionary)
- **Portfolio showcase** — 9 projects rendered from a single reusable modal
  (`js/projects.js` data-driven). Deep links (`#project-0`…`#project-8`,
  `?project=N`, hashchange-synced), prev/next + jump-dot navigation
  (buttons + ←/→ keys), share (X / LinkedIn / WhatsApp / native Web Share /
  copy-link / copy-brief) buttons, tech-stack chips, live/VIP badges,
  "start a similar project" CTA that prefills the contact form, optional
  screenshot gallery + lightbox, recently-viewed quick-jump chips
- **Portfolio search + filter** — live text search across titles/tech and
  segmented category filter (All, AI, Web, Mobile, Fintech, Trading) with
  per-chip counts, a visible result count, an empty-state reset, `/` shortcut
  to focus search, and `aria-live` announcements; skills cards cross-filter
  the portfolio and support arrow-key navigation
- **Sections** — Services, engagement models (Project-Based / Dedicated Team /
  Monthly Retainer, each deep-linking a prefilled WhatsApp message), How We
  Work process (Discover → Design → Develop → Test → Deploy & Support), Tech
  Stack, Portfolio, Stats counters, About timeline, Team, FAQ (with JSON-LD
  FAQPage schema), Contact, footer with tech tag cloud
- **Contact** — Formspree form with honeypot spam field + client validation,
  UTM/referrer attribution, WhatsApp deep links + floating WhatsApp button,
  LINE badge, lazy-loaded Google Maps embed, and a 3-question project
  estimator that prefills the inquiry and shows an indicative budget range
- **Theme** — dark / light / auto modes; auto follows `prefers-color-scheme`
  and forces dark 18:00–06:00 local; manual choice persisted and always wins
- **Command palette** — `Ctrl/Cmd+K` or `?` to jump to sections/projects
  (searches titles + tech), keyboard-shortcut cheatsheet, focus trap
- **PWA** — `manifest.json` with app shortcuts + `share_target` (shared text
  prefills the contact form), icons (incl. maskable), network-first service
  worker (`sw.js`, cache `ymt-v6`), install prompt, iOS install hint
- **Mobile UX** — sticky "Start a project" CTA under 640px (auto-hides at the
  contact section and while the cookie banner is visible)
- **Blog scaffold** — `posts/` listing page + `_template.html` article
  (Article + BreadcrumbList JSON-LD, auto reading time, EN/ID chrome toggle),
  `rss.xml` feed
- **Privacy page** — standalone bilingual `privacy.html` covering cookies,
  forms, live chat and analytics; linked from footer + cookie banner
- **SEO** — `sitemap.xml`, `robots.txt`, canonical, OG/Twitter cards, RSS
  autodiscovery, JSON-LD (`ProfessionalService` + founder `Person` + `FAQPage`)
- **Privacy & consent** — cookie-consent banner; Tawk.to chat and analytics
  load only after consent and only via `requestIdleCallback`
- **Accessibility** — skip link, labelled controls, `aria-live` regions,
  focus management, `prefers-reduced-motion` support, `role="status"` filter
  announcements
- **Performance** — self-hosted variable fonts (Sora + Inter, `display=swap`),
  responsive `srcset`/`sizes` images, `<picture>` WebP, LCP image preload,
  `loading="lazy"`/`decoding="async"` below the fold, `preconnect`/`dns-prefetch`
  for CDNs, SRI hashes on all CDN assets
- Custom 404 page, `humans.txt`, `.well-known/security.txt`, print stylesheet
- **CI** — Lighthouse CI workflow (`.github/workflows/lighthouse.yml`) audits
  production + posts weekly and on every push/PR against
  `lighthouse-budget.json` (FCP 1.8 s, TTI 2.5 s, per-resource budgets)

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript — jQuery 3.7.1 + Bootstrap 3.3.7
  (CDN with SRI) + Font Awesome 4.6.3 (CDN with SRI), agency theme
- Fonts: Sora + Inter, self-hosted WOFF2 in `fonts/` via `fonts/fonts.css`
  (used by `privacy.html`, `posts/`, `404.html`; `index.html` currently relies
  on system fallbacks — see note below)
- Backend services: Formspree (contact), Google Maps embed (lazy-loaded),
  Tawk.to chat (consent-gated, idle-loaded)
- Hosting: GitHub Pages (static); `_headers` honored by Netlify / Cloudflare
  Pages / Firebase

## Project Structure

```
/
├── index.html          # Main page — all sections, JSON-LD, PWA registration
├── 404.html            # Custom 404 page
├── privacy.html        # Standalone bilingual privacy policy
├── css/style.css       # Design system + component styles (CSS vars, dark theme)
├── css/agency(.min).css# Base Bootstrap "Agency" theme
├── scss/ less/         # Source stylesheets for the theme (not compiled here)
├── js/
│   ├── i18n.js         # EN/ID translation dictionary + ?lang= + apply helpers
│   ├── projects.js     # Project data (title, img, tech, cat, meta, badges)
│   ├── project-modal.js# Dynamic project modal + lightbox + share buttons
│   ├── contact_me.js   # Contact form → Formspree (FORMSPREE_ENDPOINT)
│   ├── consent.js      # Cookie banner, Tawk/analytics gating, PWA install
│   ├── theme.js        # Dark/light/auto theme controller (runs pre-paint)
│   ├── palette.js      # Ctrl+K command palette
│   ├── site.js         # Scroll FX, filters, search, counters, reveal, a11y
│   └── ...             # agency.min.js, jqBootstrapValidation.js (legacy)
├── posts/              # Blog listing + _template.html article scaffold
├── img/                # Assets — responsive portfolio/about/team images,
│                       #   logos (webp), PWA icons, og-image, line badge
├── fonts/              # Self-hosted Sora + Inter WOFF2 + fonts.css
├── files/              # files/cv-yosmelvin.pdf — CV download
├── manifest.json       # PWA manifest (+ shortcuts, maskable icon)
├── sw.js               # Service worker (network-first pages, cache-first assets)
├── rss.xml             # Blog RSS feed
├── sitemap.xml         # SEO sitemap
├── robots.txt
├── lighthouse-budget.json      # Lighthouse CI performance budgets
├── _headers            # Security headers + CSP (Netlify/CF Pages only)
└── humans.txt
```

## Getting Started

```bash
git clone https://github.com/yosmelvin/yosmelvin.github.io
cd yosmelvin.github.io
python3 -m http.server 8000
# open http://localhost:8000
```

No build step required — it's a plain static site. `package.json` only lists
the theme's legacy devDependencies; nothing is compiled or bundled.

## Configuration

| What | Where |
|---|---|
| Formspree form | `js/contact_me.js` → `FORMSPREE_ENDPOINT` (currently `mppdpodr`) |
| Google Maps API key | `js/maps-loader.js` — **must stay referrer-restricted (`yosmelvin.github.io/*`) in Google Cloud Console**; also allowlisted in the CSP |
| Tawk.to widget | `js/consent.js` → `loadTawk()` (loads after cookie accept, on idle) |
| Analytics (optional) | `js/consent.js` → `ANALYTICS_PROVIDER` (`goatcounter`/`plausible`) + `ANALYTICS_ID` — ships disabled (`null`) |
| CV download | `files/cv-yosmelvin.pdf` — already present, "Download CV" buttons link here |
| Translations | `js/i18n.js` — add keys to both `en` and `id` blocks; use `data-i18n` / `data-i18n-ph` / `data-i18n-html` in HTML |
| Project data | `js/projects.js` — `cat` drives modal grouping; the grid `data-cat` + `i18n` `mN_*` keys drive cards/filters. `gallery: []` disables the lightbox; `exclusive: true`/`badges` control labels |
| Filter categories | `.filter-chip[data-filter]` + `.portfolio-item[data-cat]` in `index.html` |
| Blog posts | `posts/` — copy `_template.html` to `posts/<slug>.html`, add a card in `posts/index.html`, an `<item>` in `rss.xml` |
| Performance budgets | `lighthouse-budget.json` — enforced by `.github/workflows/lighthouse.yml` |
| Security headers | `_headers` (real headers on Netlify/CF Pages) + meta equivalents + CSP in `index.html` for GitHub Pages |

## Performance & CI

- Lighthouse CI runs on push to `main`, every PR, weekly (Mon 02:00 UTC), and
  manually. It audits `https://yosmelvin.github.io/` and `/posts/` against
  `lighthouse-budget.json`: FCP ≤ 1.8 s, TTI ≤ 2.5 s, scripts ≤ 500 KB,
  stylesheets ≤ 300 KB, images ≤ 1.2 MB, fonts ≤ 150 KB, ≤ 15 third-party
  requests.
- Reports are uploaded as workflow artifacts and to temporary public storage.
- Local check: `npx @lhci/cli autorun` (requires the site served or use `--collect.url`).

## Security notes

- All front-end libraries are **self-hosted** under `vendor/` (jQuery 3.7.1,
  Bootstrap 3.4.1, jQuery Easing 1.3, Font Awesome 4.6.3 + fonts) — no third-party
  script/style CDN dependencies remain; only Maps, Tawk.to and Formspree are remote.
  Bootstrap 3.x and Font Awesome 4.x are EOL — plan a Bootstrap 5 / FA 6 migration.
- Full CSP shipped via `_headers` for hosts that support it, with meta-tag
  equivalents (`nosniff`, `referrer`, `Permissions-Policy`) for GitHub Pages.
  `script-src` allows no `'unsafe-inline'` — all JS is external files
  (`js/sw-register.js`, `js/maps-loader.js`, `js/privacy-lang.js`).
  `img-src` is restricted to `'self' data:` (no arbitrary remote images).
  `_headers` also sets `Cross-Origin-Opener-Policy`/`Cross-Origin-Resource-Policy`.
- User input is HTML-escaped before DOM injection (contact-form messages) and
  CRLF-stripped from Formspree header fields (`_subject`, `_replyto`).
- Contact form uses a honeypot field (`hp_website`, `tabindex="-1"`,
  `autocomplete="off"`) in addition to Formspree-side spam filtering.
- Third-party scripts (Tawk.to, analytics, Maps) are consent-gated and
  lazy/idle-loaded; Maps JS is only injected when the footer scrolls into view.
- `.well-known/security.txt` published for vulnerability reports
  (expires 2027-12-31 — renew before then).

## Known gaps / TODO

- `rss.xml` has no published items yet; blog is scaffold-only.

## Contact

- Email: ymtsolution@gmail.com
- WhatsApp / phone: +62 897-4142-883
- LINE: https://line.me/ti/p/@mhc8196k
- Company: https://www.linkedin.com/in/ymtsolution ·
  https://www.facebook.com/ymtsolution · https://x.com/ymtsolutionid
- Founder: https://www.linkedin.com/in/yosmelvin ·
  https://www.twitter.com/yosmelvin_ · https://www.facebook.com/yosmelvin
- GitHub: https://github.com/yosmelvin

## License

MIT License — see the LICENSE file for details.
