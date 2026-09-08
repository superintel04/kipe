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

Two routes, resolved in `App.tsx` against `src/router.ts` — a ~30-line History-API hook rather than a router library, since there is currently one extra page. `/` renders `pages/Home.tsx`; each entry in `content.caseStudyPages` claims `/{slug}` and renders `pages/CaseStudyPage.tsx`. Unknown paths fall through to the profile. `vercel.json` already rewrites every path to index.html, so deep links work in production.

There is no state management library and no data fetching — each page renders one fixed sequence of sections, and the "View Projects" link is an in-page `#projects` anchor.

The one interactive surface is the case study dialog: a project with an optional `detail` entry gets a "View Case study" button that opens `CaseStudyDialog` — a native `<dialog>` opened via `showModal()`, so focus trapping, background inerting and Esc-to-close come from the platform rather than hand-rolled JavaScript. Its `onCancel` intercepts Esc so a nested `Lightbox` closes first.

**All content lives in `src/content/`, and the site is bilingual.** `types.ts` defines the `Content` shape; `en.ts` and `ar.ts` each satisfy it in full. Components never import a locale — they call `useContent()` (from `@/content`) and hold no copy of their own, including section headings, which live under `content.ui`. Adding a language means adding one bundle and listing it in `context.ts`.

`caseStudies` is the array that drives repetition — appending an entry renders another full case-study section, and a `detail` field is what gives a project its "View Case study" button. **Any copy change must be made in both `en.ts` and `ar.ts`**, or the two languages drift apart. Images are shared via `assets.ts`; only `alt` text is translated.

Language state lives in `LanguageProvider.tsx`, which sets `<html lang>` and `<html dir>` and persists the choice to `localStorage`. Because `dir` drives the layout, **use logical Tailwind utilities everywhere** — `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `rounded-s-`, `border-s-` — never `ml-`, `pr-`, `left-`, `rounded-l-`. Physical utilities will not mirror in Arabic. Latin-script runs inside Arabic (phone, email) carry `dir="ltr"` so they don't reorder.

`src/index.css` is the whole style layer, and **every token in it is transcribed from the Kipe design system** ([Figma file DSK](https://www.figma.com/design/9DassLSrZMqAfvnUwJZ5vJ/DSK)) — resolved from its Primitives / Color / Scale / Typography variable collections. Tailwind v4 is configured CSS-first via `@theme`, **there is no `tailwind.config.js`**, so tokens are CSS custom properties that become utilities (`--color-accent` → `bg-accent`, `--text-h1` → `text-h1`).

Use the semantic colour tokens (`bg`, `bg-subtle`, `bg-muted`, `bg-inverse`, `fg`, `fg-muted`, `fg-subtle`, `fg-inverse`, `fg-on-accent`, `border`, `border-subtle`, `border-strong`, `accent`, `accent-fg`, `accent-subtle`) rather than raw hex or the neutral ramp — the ramp exists to define the semantics, not to be used directly. Type comes from the DS scale (`text-display-1` … `text-overline`); the large steps are `clamp()`ed so one scale serves mobile and desktop. Each colour's Dark-mode value is noted in a comment beside it, so the second mode can be switched on without reopening Figma.

Imports use the `@/` alias for `src/`, declared in **both** `vite.config.ts` (resolve.alias) and `tsconfig.app.json` (paths) — changing one requires changing the other.

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
