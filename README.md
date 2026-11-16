# YMT Solution — Portfolio

Official portfolio website for **YMT Solution**, a software house based in Jakarta, Indonesia.
Single-page static site built with HTML5, CSS3, and vanilla JavaScript (Bootstrap 3 theme).

## Features

- **Bilingual** — English / Bahasa Indonesia toggle (persisted in localStorage)
- **Portfolio showcase** — 8 projects with a single reusable modal (`js/projects.js` data-driven), deep links (`#project-0`…`#project-7`), prev/next navigation, share buttons, tech-stack chips
- **Project filter** — filter chips by category (Web, Mobile, Fintech, Trading)
- **Services & AI Services** section
- **Tech stack grid**, **stats counters** (animated), **timeline**, **team**, **FAQ accordion**
- **Contact form** via Formspree — set your form ID in `js/contact_me.js` (`FORMSPREE_ENDPOINT`)
- **Dark/light theme toggle**, cookie consent banner (gates Tawk.to chat), scroll progress bar
- **SEO** — sitemap.xml, robots.txt, Open Graph, Twitter Card, canonical, JSON-LD structured data
- **PWA** — `manifest.json`, icons, minimal service worker (`sw.js`)
- **Accessibility** — skip link, labels, aria attributes, `prefers-reduced-motion` support
- Custom 404 page, `humans.txt`, `.well-known/security.txt`

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript (jQuery 1.12 + Bootstrap 3.3 theme, Font Awesome 4)
- Fonts: Sora + Inter (Google Fonts)
- Backend services: Formspree (contact), Google Maps embed, Tawk.to chat (consent-gated)
- Hosting: GitHub Pages (static)

## Project Structure

```
/
├── index.html          # Main page (all sections)
├── 404.html            # Custom 404 page
├── css/style.css       # Custom theme overrides
├── css/agency.min.css  # Base Bootstrap theme
├── js/
│   ├── i18n.js         # EN/ID translations
│   ├── projects.js     # Portfolio project data
│   ├── project-modal.js# Dynamic project modal
│   ├── contact_me.js   # Contact form (Formspree)
│   └── ...
├── img/                # Assets (portfolio, team, about, pwa icons)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── sitemap.xml         # SEO sitemap
├── robots.txt
├── _headers            # Security headers (Netlify/CF Pages only)
└── humans.txt
```

## Getting Started

```bash
git clone https://github.com/yosmelvin/yosmelvin.github.io
cd yosmelvin.github.io
python3 -m http.server 8000
# open http://localhost:8000
```

No build step required — it's a plain static site.

## Configuration

| What | Where |
|---|---|
| Formspree form ID | `js/contact_me.js` → `FORMSPREE_ENDPOINT` |
| Google Maps API key | `index.html` (inline script) — **restrict by HTTP referrer in Google Cloud Console** |
| Tawk.to widget ID | `index.html` (bottom script) |
| Translations | `js/i18n.js` |
| Project data | `js/projects.js` |

## Contact

- Email: ymtsolution@gmail.com
- LinkedIn: https://www.linkedin.com/in/yosmelvin
- GitHub: https://github.com/yosmelvin
- Twitter: @yosmelvin_

## License

MIT License — see the LICENSE file for details.
