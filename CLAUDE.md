# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Vite dev server on :5173
npm run build    # tsc -b (typecheck) then vite build -> dist/
npm run lint     # oxlint
npm run preview  # serve the built dist/
```

**There is no test suite** — no runner is installed and `npm run test` does not exist. The only automated verification is `npm run lint` plus the `tsc -b` typecheck inside `npm run build`. Neither catches render-time errors, so check changes in the browser.

Vite 8 builds with rolldown. If the dev server dies with `Cannot find native binding`, the platform binding under `node_modules/@rolldown/` was created as an empty directory by npm's optional-dependency bug — `rmdir` that directory and re-run `npm install` rather than wiping `node_modules`.

## Architecture

Routes are resolved in `App.tsx` against `src/router.ts` — a ~30-line History-API hook rather than a router library, since there is currently one extra page. `/` renders `pages/Home.tsx`; each entry in `content.caseStudyPages` claims `/{slug}` and renders `pages/CaseStudyPage.tsx`. Unknown paths fall through to the profile. `vercel.json` already rewrites every path to index.html, so deep links work in production.

There is no state management library and no data fetching — each page renders one fixed sequence of sections, and the "View Projects" link is an in-page `#projects` anchor.

The one interactive surface is the case study dialog: a project with an optional `detail` entry gets a "View Case study" button that opens `CaseStudyDialog` — a native `<dialog>` opened via `showModal()`, so focus trapping, background inerting and Esc-to-close come from the platform rather than hand-rolled JavaScript. Its `onCancel` intercepts Esc so a nested `Lightbox` closes first.

**All content lives in `src/content/`, and the site is bilingual.** `types.ts` defines the `Content` shape; `en.ts` and `ar.ts` each satisfy it in full. Components never import a locale — they call `useContent()` (from `@/content`) and hold no copy of their own, including section headings, which live under `content.ui`. Adding a language means adding one bundle and listing it in `context.ts`.

`caseStudies` is the array that drives repetition — appending an entry renders another full case-study section, and a `detail` field is what gives a project its "View Case study" button. **Any copy change must be made in both `en.ts` and `ar.ts`**, or the two languages drift apart. Images are shared via `assets.ts`; only `alt` text is translated.

**The Arabic side is currently switched off** by `LANGUAGE_SWITCH_ENABLED` in `context.ts`. While it is `false` the toggle is not rendered and the site is pinned to English, overriding any remembered choice — otherwise a returning visitor would be stuck in Arabic with no way back. Nothing else is removed: `ar.ts`, the RTL rules and the logical utilities all stay, so flipping that one constant restores the feature. **Keep maintaining `ar.ts` alongside `en.ts` while it is off**, or turning it back on will surface months of drift.

Language state lives in `LanguageProvider.tsx`, which sets `<html lang>` and `<html dir>` and persists the choice to `localStorage`. Because `dir` drives the layout, **use logical Tailwind utilities everywhere** — `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `rounded-s-`, `border-s-` — never `ml-`, `pr-`, `left-`, `rounded-l-`. Physical utilities will not mirror in Arabic. Latin-script runs inside Arabic (phone, email) carry `dir="ltr"` so they don't reorder.

`src/index.css` is the whole style layer, and **every token in it is transcribed from the Kipe design system** ([Figma file DSK](https://www.figma.com/design/9DassLSrZMqAfvnUwJZ5vJ/DSK)) — resolved from its Primitives / Color / Scale / Typography variable collections. Tailwind v4 is configured CSS-first via `@theme`, **there is no `tailwind.config.js`**, so tokens are CSS custom properties that become utilities (`--color-accent` → `bg-accent`, `--text-h1` → `text-h1`).

Use the semantic colour tokens (`bg`, `bg-subtle`, `bg-muted`, `bg-inverse`, `fg`, `fg-muted`, `fg-subtle`, `fg-inverse`, `fg-on-accent`, `border`, `border-subtle`, `border-strong`, `accent`, `accent-fg`, `accent-subtle`) rather than raw hex or the neutral ramp — the ramp exists to define the semantics, not to be used directly. Type comes from the DS scale (`text-display-1` … `text-overline`); the large steps are `clamp()`ed so one scale serves mobile and desktop. Each colour's Dark-mode value is noted in a comment beside it, so the second mode can be switched on without reopening Figma.

Imports use the `@/` alias for `src/`, declared in **both** `vite.config.ts` (resolve.alias) and `tsconfig.app.json` (paths) — changing one requires changing the other.

### Journey page (`/journey`)

`JOURNEY_PATH` in `router.ts`; `pages/JourneyPage.tsx`, lazy-loaded from `App.tsx` because it carries three.js (~165 kB gzipped) — the build's "chunk larger than 500 kB" warning is that chunk and is expected. It is a scroll-driven flight: a dotted globe dives into Hyderabad, then a plane flies runway to runway through New York, Doha and Riyadh, each city raising a `StopCard`; then `CraftWarp` (2D canvas) and `ConnectSection` (a second, small globe).

- **One clock.** `src/journey/timeline.ts` turns scroll through the flight section into segments (`globe`, `dive`, `reveal`, `hold`, `fly`, `outro`). Both `JourneyScene` (camera, plane) and the DOM overlays (`overlays()`: hero, flash, rail, active card) read it, so they cannot drift. Retune pacing by changing segment weights there, not by adding scroll handlers.
- **Content** is `content.journey` in both bundles. A stop with `projectSlug` takes its logo, figures and case-study link from that project card; Hyderabad currently carries `placeholder: true` copy and its own `metrics` until its case study exists. City geography (`GEO` in `JourneyPage.tsx`) and the 3D models are structure, not copy.
- **Cities** are generated in `src/journey/cities.ts` from one street grid plus per-city styles and primitive landmarks; layout is seeded, so it is stable between visits. Flags and the ground grid are canvas textures (`textures.ts`). The only image asset is `src/assets/land-mask.png`, rasterised from Natural Earth's public-domain 110m land.
- **Motion contract** holds: under `prefers-reduced-motion` there is no intro, the scene clock stays at zero (no cars, spin or pulses), and the camera moves only with scroll. The intro plays once per session (`kipe:journey-intro` in sessionStorage). No WebGL → the stops render as a plain list.
- `BackToTop` is not mounted on this route — the route rail does that job, and on a phone the button would sit on the cards.
- Headless Chrome screenshots of the WebGL canvas can come back black or partial; check this page in a real browser.

### Branding studio (`/branding`)

`BRANDING_PATH` in `router.ts`; `pages/BrandingPage.tsx`, lazy-loaded from `App.tsx`. A single landing page for the personal brand studio, built from [Figma `R-Branding` 23:1238](https://www.figma.com/design/OvJfssUMGTXIhfZWU3Z4T1/R-Branding?node-id=23-1238). It is a **separate business from the profile**, so it owns its whole chrome — its own sticky header, nav and footer — and does not mount `BackToTop`.

- **It rebinds the accent rather than adding a palette.** Every other token in the Figma file (type scale, radii, spacing, neutrals) already matches the DS one for one; only the accent differs, green instead of blue. `.branding` in `index.css` overrides the `--color-accent-*` family plus `--color-bg-muted`, so the ordinary `bg-accent` / `text-accent-fg` utilities keep working and simply resolve green inside the page. **Don't introduce `branding-` colour utilities** — change those variables instead.
- **The raw Figma accent `#02b262` is never used as body text** — it measures 2.78:1 on white. `--color-accent-fg` is a step darker (`#016b3b`, 6.63:1) and is what every accented word uses. The only exception is the wordmark's trailing full stop, which is decorative.
- **Content** is `content.branding` in both bundles, same rule as everywhere else. `bookingUrl` is the single destination for all five "book a call" controls — swap in a Calendly link there and the whole page follows.
- **Section components** live in `components/branding/`. `BrandingPrimitives.tsx` holds the wordmark, overline, numbered deliverable tag, button and check icon; `BrandingHero.tsx` and `BrandingSections.tsx` hold the bands.
- **The device mockups are drawn, not exported** — the monitor, laptop and tablet chrome is markup at the design's geometry (Figma 23:1363), so only the screen art is a raster. Those two rasters live in `public/branding/` as placeholders; replacing them is a drop-in by filename.
- **The visiting card's QR is real**, generated for `https://kipe.ai` at the design's own 25-module / 84px grid. The Figma layer is explicitly a non-scannable placeholder.

### Analytics

GA4 lives in `src/analytics.ts`, behind `VITE_GA_MEASUREMENT_ID` (set in Vercel, never committed; see `.env.example`). **Every function no-ops unless the variable is set *and* the bundle is a production build**, so dev servers never report — which also means `npm run dev` is useless for verifying a tag change. Use `npm run build && npm run preview` with the variable in `.env.local`, and confirm in GA4's Realtime report. Vite inlines `VITE_*` at build time, so changing the value in Vercel requires a redeploy.

The tag is configured `send_page_view: false` and `App.tsx` sends every `page_view` itself, keyed on the router path. This is not optional: GA4's automatic pageview fires once per document load, so on this SPA a case study opened from the grid would otherwise never be counted. `page_title` is passed from the content bundle rather than read from `document.title`, because React runs child effects before parent ones and `LanguageProvider` has not written the title yet when the first pageview fires.

Interaction events are sent from the component that owns the control — `trackResumeOpen` and `trackOutboundClick` in `Nav.tsx`, `trackCaseStudyOpen` in `ProjectCards.tsx`, `trackContactClick` in `MetaGrid.tsx`. Prefer adding a named wrapper in `analytics.ts` over calling `trackEvent` with a bare string at the call site, so the event vocabulary stays in one file.

**The resume event collides with Enhanced measurement.** `file_download` is GA4's own recommended event *and* fires automatically for any link ending in `.pdf`, so "File downloads" must stay **off** under Admin → Data streams → Enhanced measurement or every click double-counts.

**The resume PDF lives in `/public`, not `src/assets`** — the one deliberate exception to importing every asset so Vite fingerprints it. The nav link opens the PDF in a new tab for reading rather than forcing a download, so the URL is visible to the visitor and is what the viewer's "Save as" names the file; a hashed `…-a1b2c3d4.pdf` would end up in their downloads folder. The cost is that replacing the resume no longer changes its URL, so propagation depends on cache headers rather than a new filename — fine on Vercel, which revalidates unfingerprinted static files by default.

### Figma is the source of record

The design is [`Kipe / Content`](https://www.figma.com/design/I1nCoRD5vABRiKUgiTo46o/Kipe?node-id=1-7), and several values are transcribed from it rather than authored. Component doc comments cite their Figma node IDs; preserve those references. Concretely:

- `DESIGN_PAGE_WIDTH` (595) is the Figma frame width. Case-study mockups size themselves as `imageWidth / DESIGN_PAGE_WIDTH`, so an image keeps its designed proportion of the page at any viewport. `imageWidth`/`imageHeight` are the **1x design dimensions** even though the PNGs are exported at 2x.
- `bandRatio` is the gradient band's height as a fraction of the block, taken from Figma as band height ÷ mockup bottom edge. The mockup is meant to overhang the band.
- `CURVE_PATH` in `Curve.tsx` is a literal Figma vector export (597×14), stretched with `preserveAspectRatio="none"`. `Curve` caps both the project card's band and the dialog hero.

Treat these as measurements, not tunables — adjust them only against the design.

### Recurring patterns

- **Every band is a `Section`.** It carries the full-width background and puts its children in the one shared container (`max-w-[92rem]`, `px-6 md:px-12`). The site is edge-to-edge: there is no centred sheet, so don't reintroduce per-section max widths — change `Section` instead.
- **Motion primitives are opt-out by default.** `Magnetic` (cursor pull) and `Parallax` (scroll drift) each check `prefers-reduced-motion` and no-op; `Magnetic` additionally ignores non-mouse pointers. Keep that contract when adding effects.
- **Accented phrases** inside body copy are data, not markup: a `Segment` is either a string or `{ accent: string }`, and `Skillset.tsx` renders the latter in the accent colour. Use this instead of embedding spans in content.
- **Credential marks carry their own dimensions.** Each entry supplies `logo` (a Vite asset import) plus `logoWidth`/`logoHeight`, its size as designed inside the shared 44px disc — the logos are deliberately not normalised to one icon size.
- **Images are ES imports** from `src/assets`, never `/public` paths, so Vite fingerprints them. `Avatar` degrades to initials via `onError` rather than showing a broken image.
- **Scroll reveals go through `Reveal`**, which renders a `div` and toggles an `is-visible` class on first intersection. The hidden state lives in `index.css` scoped to `.js` on `<html>` (added in `main.tsx` before React renders) so content is visible without JavaScript, and `prefers-reduced-motion` disables it. Because it emits a plain `div`, wrap it *inside* semantic elements — e.g. inside `<li>`, not around it — and pass stagger via `delay`.
- Components are default exports taking a props object, with a doc comment explaining the design intent.

## Deployment

Vercel, with `vercel.json` rewriting all routes to `/index.html`.
