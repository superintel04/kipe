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

A single-page, statically-composed portfolio. There is no router, no state management, and no data fetching — `App.tsx` renders one fixed sequence of sections, and the "View Projects" link is an in-page `#projects` anchor.

The one interactive surface is the case study dialog: a project with an optional `detail` entry gets a "View Case study" button that opens `CaseStudyDialog` — a native `<dialog>` opened via `showModal()`, so focus trapping, background inerting and Esc-to-close come from the platform rather than hand-rolled JavaScript. Its `onCancel` intercepts Esc so a nested `Lightbox` closes first.

**All content lives in `src/data/profile.ts`.** Components import named exports from it (`profile`, `meta`, `skills`, `callout`, `experience`, `credentials`, `closing`, `caseStudies`) and hold no copy of their own. Copy and content-shape changes belong in that file; components change only when the *rendering* changes. `caseStudies` is the one array that drives repetition — appending an entry renders another full case-study section. See README.md for the field-by-field content guide.

`src/index.css` is the whole style layer. Tailwind v4 is configured CSS-first via `@theme` — **there is no `tailwind.config.js`**, so add design tokens as CSS custom properties there and they become utilities (`--color-accent` → `bg-accent`/`text-accent`). Base `font-weight: 300` is set on `body`, which is why components spell out `font-light`/`font-normal`/`font-bold` explicitly.

Imports use the `@/` alias for `src/`, declared in **both** `vite.config.ts` (resolve.alias) and `tsconfig.app.json` (paths) — changing one requires changing the other.

### Figma is the source of record

The design is [`Kipe / Content`](https://www.figma.com/design/I1nCoRD5vABRiKUgiTo46o/Kipe?node-id=1-7), and several values are transcribed from it rather than authored. Component doc comments cite their Figma node IDs; preserve those references. Concretely:

- `DESIGN_PAGE_WIDTH` (595) is the Figma frame width. Case-study mockups size themselves as `imageWidth / DESIGN_PAGE_WIDTH`, so an image keeps its designed proportion of the page at any viewport. `imageWidth`/`imageHeight` are the **1x design dimensions** even though the PNGs are exported at 2x.
- `bandRatio` is the gradient band's height as a fraction of the block, taken from Figma as band height ÷ mockup bottom edge. The mockup is meant to overhang the band.
- `CURVE_PATH` in `Curve.tsx` is a literal Figma vector export (597×14), stretched with `preserveAspectRatio="none"`. `Curve` caps both the project card's band and the dialog hero.

Treat these as measurements, not tunables — adjust them only against the design.

### Recurring patterns

- **Full-bleed sections** escape the sheet's padding with negative margins matching it (`-mx-6 md:-mx-10` against `px-6 md:px-10`). The header's portfolio pill uses the same trick asymmetrically (`-mr-6 md:-mr-10`). Changing the sheet padding means updating these in step.
- **Accented phrases** inside body copy are data, not markup: a `Segment` is either a string or `{ accent: string }`, and `Skillset.tsx` renders the latter in the accent colour. Use this instead of embedding spans in content.
- **Credential marks carry their own dimensions.** Each entry supplies `logo` (a Vite asset import) plus `logoWidth`/`logoHeight`, its size as designed inside the shared 44px disc — the logos are deliberately not normalised to one icon size.
- **Images are ES imports** from `src/assets`, never `/public` paths, so Vite fingerprints them. `Avatar` degrades to initials via `onError` rather than showing a broken image.
- **Scroll reveals go through `Reveal`**, which renders a `div` and toggles an `is-visible` class on first intersection. The hidden state lives in `index.css` scoped to `.js` on `<html>` (added in `main.tsx` before React renders) so content is visible without JavaScript, and `prefers-reduced-motion` disables it. Because it emits a plain `div`, wrap it *inside* semantic elements — e.g. inside `<li>`, not around it — and pass stagger via `delay`.
- Components are default exports taking a props object, with a doc comment explaining the design intent.

## Deployment

Vercel, with `vercel.json` rewriting all routes to `/index.html`.
