# YMT Solution Portfolio — Improvement Plan

Research date: 2026-11-18. Scope: static portfolio + blog (GitHub Pages), vanilla JS, no build step today.

## Current state (what's already strong)

- PWA with manual service worker (`sw.js`, network-first + precache), offline page, manifest, icons.
- Bilingual EN/ID i18n via `data-i18n*` attributes, persisted in localStorage.
- Security posture: CSP meta + `_headers`, nosniff, referrer policy, permissions policy, consent-gated analytics/Tawk.to.
- Performance basics: font + hero preloads, `fetchpriority`, purged vendor CSS, `loading="lazy"` + `srcset`/`sizes` on images, critical inline CSS, reduced-motion guards, Lighthouse CI budget.
- UX features: command palette (Ctrl+K), portfolio search/filter/sort, recent-projects chips, shortlist bar, project estimator, scroll-spy nav, theme toggle, scroll-reveal, back-to-top, deep-linkable project modals, skip link.

The site is already well past "basic" — the items below are the next tier: correctness/consistency issues and structural debt that will compound as content grows.

---

## UI/UX improvements (10)

### P0 — high impact, low effort

1. **Single source of truth for the i18n `lang` attribute + URL state.** `js/i18n.js` persists choice in localStorage and `?lang=` exists for SEO, but switching should also update `<html lang>`, push `history.replaceState` so the visible URL always reflects the language, and listen for `storage` events so other tabs stay in sync. Today `posts.js`, `404-lang.js`, `privacy-lang.js`, `offline-lang.js` each re-implement mini-dictionaries — unify them behind the same `window.YMTI18n` API (see refactor #1).

2. **Portfolio grid feedback loop.** When filters/search/sort change `#portfolioGrid`, announce the result count to screen readers (`aria-live="polite"` status region) and move focus to the first result (or the grid) on keyboard-initiated changes. Add an explicit empty state with a "clear filters" action instead of a blank grid.

3. **Contact form UX polish.** `contact_me.js` validates on submit; add blur-time inline validation, an error summary that receives focus on failed submit (`role="alert"`), per-field `aria-describedby` wiring, and a success state that keeps the form values visible until dismissed (currently check whether success clears/resets abruptly).

4. **Theme toggle clarity.** `#themeToggle` currently shows a `fa-laptop` glyph with a text label — verify it communicates the *current* mode vs. *next* action unambiguously across light/dark/system states, and that `theme.js` (render-blocking in `<head>`) can't flash wrong theme on `prefers-color-scheme` changes while the page is open (listen to `matchMedia` change events).

### P1 — meaningful UX upgrades

5. **Project modal navigation.** `project-modal.js` opens one project at a time; add prev/next arrows (and ←/→ keys, already supported by Bootstrap modal patterns), a "copy link" button that writes `#project-N` to the clipboard (deep-link support already exists in `site.js`), and gallery keyboard navigation for `gallery[]` entries.

6. **Search/filter persistence + shareability.** Encode active category, query, and sort in the URL (`?cat=mobile&q=screener&sort=az`) so filtered views are shareable and survive reload — same pattern as `?project=N` already implemented.

7. **Fuzzy/instant search.** The portfolio search is likely substring-only; upgrade to tokenized matching across title, tech stack, and description keys (EN+ID), with a debounced input and a `⌘K`-style shortcut hint (`/` already listed in the palette cheatsheet — wire it).

8. **Image performance for JS-rendered cards.** `project-modal.js`/`site.js` build portfolio cards client-side; ensure generated `<img>` tags carry `loading="lazy"`, `decoding="async"`, `srcset`/`sizes` with `-sm` variants (the convention already exists for `inklo-1-sm.webp`, team/about images), and explicit `width`/`height` or `aspect-ratio` CSS to eliminate CLS when the grid populates.

### P2 — polish

9. **Micro-interactions + toast system.** Replace ad-hoc feedback (e.g., palette "Copied" states) with a small shared toast/announce helper (`YMTUtils.announce` exists — extend it visually), stagger card reveals with a cap (respect `prefers-reduced-motion`, already guarded in CSS — keep JS consistent).

10. **Print stylesheet + prefers-contrast audit.** Add `@media print` rules (hide nav/palette/consent/scroll-top, expand project cards) and verify `prefers-contrast: more` / `forced-colors` rendering for focus rings, badges, and the dark hero overlay.

---

## Code refactoring (10)

### P0 — structural debt, highest leverage

1. **Consolidate i18n into a real module.** `js/i18n.js` is 796 lines of inline EN/ID dictionaries; `posts/posts.js` (~40 lines of its own dict), `404-lang.js`, `privacy-lang.js`, `offline-lang.js` duplicate the pattern. Split dictionaries into `i18n/en.js` + `i18n/id.js` (or JSON fetched once), and make every page consume `YMTI18n.t()` — eliminates drift where a key exists in one dict but not another.

2. **Kill the less/scss/css three-way split.** The repo carries the 2017 Start Bootstrap "Agency" theme sources (`less/`, `scss/`) *and* a hand-written `css/style.css` (3,300 lines) that actually ships. Pick one source of truth: either (a) retire less/scss entirely, or (b) move `style.css` into SCSS partials and add a minimal build step (`sass` + `purgecss`, extending `tools/purge-css.sh`). Right now changes can be made in the wrong file with zero feedback.

3. **Convert globals to ES modules.** `window.YMTProjects`, `window.YMTI18n`, `window.YMTModal`, `window.YMTUtils`, `window.YMTSay` are implicit contracts between `projects.js → project-modal.js → site.js → palette.js`. Convert to `type="module"` imports with a thin `window.YMT*` shim only where needed — removes load-order bugs (e.g., `site.js` defensively checks `YMTModal && YMTModal.open`) and enables tree-shaking.

4. **Slim `index.html`.** 1,208 lines / ~80 KB with four inline JSON-LD blocks, repeated modal/footer markup, and dead placeholder comments ("Floating WhatsApp chat", "Sticky mobile CTA" — both empty). Extract the JSON-LD into a generated or single-block file, dedupe repeated structures, and delete dead markup; every KB here is render-blocking parse time on the LCP page.

### P1 — maintainability & automation

5. **Generate `sw.js` precache from reality.** `PRECACHE` is a hand-maintained ~50-entry list that already shows drift risk (duplicated `inklo` entries, manual `CACHE = 'ymt-v39'` bumps). Add a small build script that scans referenced assets + `package.json` version and emits `sw.js` — version bumps become automatic.

6. **Pin and script the vendor pipeline.** `tools/purge-css.sh` runs `npx -y purgecss` (unpinned, network-dependent). Add `purgecss`/`sass` as devDependencies with a `package.json` script (`build:css`, `build:sw`, `build:all`) so the pipeline is reproducible offline and in CI.

7. **Single config module.** Version (`3.3.7+1` in `package.json`, disconnected from anything at runtime), `CACHE` name, Formspree endpoint, Tawk.to ID, and Plausible domain are scattered across files. Centralize into `js/config.js` (or generated at build time) so a release touches one place.

8. **Third-party consent gate abstraction.** `consent.js` gates analytics + Tawk.to; `maps-loader.js` separately lazy-loads Google Maps. Unify into one `loadThirdParty(name)` registry so adding/removing a vendor is a one-line change and consent state is enforced in exactly one place.

### P2 — quality gates

9. **Lint/format + basic checks.** No ESLint/Prettier/HTMLHint config exists. Add a minimal config set and a `check` script (`eslint js/`, `htmlhint *.html posts/*.html`); optionally a tiny DOM smoke test that loads `index.html` and asserts `YMTProjects` renders N cards — catches i18n key typos and selector drift that today fail silently.

10. **Wire Lighthouse budget into CI properly.** `.github/workflows/lighthouse.yml` + `lighthouse-budget.json` exist — verify the budget actually fails the build on regression (check `assertions` config), add `budgets` for JS/CSS asset count given the no-build-step constraint, and document the release checklist (bump `sw.js` CACHE → run `purge-css.sh` if markup changed → update `rss.xml`/`sitemap.xml` dates).

---

## Suggested sequencing

| Sprint | Focus |
|---|---|
| 1 | Refactors 7, 5, 6 (config + generated SW + pinned build) — low risk, immediate DX win |
| 2 | Refactors 1, 2, 4 (i18n module, CSS source of truth, HTML slim) — biggest structural payoff |
| 3 | Refactors 3, 8 (ES modules, consent registry) — do after 1–2 land |
| 4 | UI/UX P0 items (1–4) alongside refactor 1 since they share the i18n code |
| 5 | UI/UX P1/P2 (5–10) + quality gates (9, 10) |

---

## Implementation status (2026-11-18)

All 20 items addressed. Several were already implemented in the codebase and
verified rather than rebuilt:

**UI/UX**
1. ✅ `?lang=` URL sync + cross-tab storage sync added (`i18n.js`, `posts.js`, `404-lang.js`)
2. ✅ Already present: `aria-live` result count (`pf-count`) + empty state + reset
3. ✅ Error summary (`role=alert`, first-invalid focus, `aria-invalid`) added to contact form
4. ✅ Already present: auto/light/dark cycle with live OS + clock tracking
5. ✅ Already present: prev/next, arrow keys, dots, swipe, copy-link, share sheet
6. ✅ Filter state now syncs to `?cat=&q=&sort=` (replaces sessionStorage)
7. ✅ Tokenized AND search across title/tech/category (EN+ID via dict)
8. ✅ Already present: `srcset`/`sizes`/`-sm` variants + lazy/async in card renderer
9. ✅ `YMTUtils.toast` visual toast added (paired with SR `announce`)
10. ✅ `@media print` + `prefers-contrast`/`forced-colors` rules added

**Refactoring**
1. ✅ `js/i18n-dict.js` — single namespaced dict (site/blog/p404); all consumers unified
2. ✅ `less/` + `scss/` deleted (dead Agency-theme sources); `css/style.css` is the only CSS source
3. ✅ ES modules: utils, config, i18n, i18n-dict, projects, project-modal, site, palette, contact_me, consent, third-party, maps-loader, posts.js, 404-lang.js. Classic kept only where required: theme.js (pre-paint), sw-register.js, offline-lang.js, privacy-lang.js
4. ✅ index.html: dead markup/comments removed; module entries only (deps via imports)
5. ✅ `tools/build-sw.mjs` generates CACHE (from package.json version) + PRECACHE (asset graph scan)
6. ✅ `purgecss` pinned as devDependency; `tools/purge-css.sh` uses local binary
7. ✅ `js/config.js` centralizes version, Formspree, Tawk.to, Maps key, analytics, storage keys
8. ✅ `js/third-party.js` consent-gated vendor registry (tawk + analytics)
9. ✅ `tools/check.mjs` (`npm run check`): syntax, asset refs, i18n parity, config/SW freshness
10. ✅ Lighthouse budget already enforced by `budgetPath` in lighthouse.yml; release checklist documented in README
