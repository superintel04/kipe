# Kipe — Ramesh Panti, Lead UX Designer

Single-page portfolio built from the Figma design
[`Kipe / Content`](https://www.figma.com/design/I1nCoRD5vABRiKUgiTo46o/Kipe?node-id=1-7).

React 19 + TypeScript + Vite + Tailwind CSS v4.

## Getting started

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run lint     # oxlint
```

## The portrait

The header photo is **`src/assets/portrait.jpg`**, imported by
`ProfileHeader.tsx` so Vite fingerprints and optimises it at build time. The
filename is deliberately generic: to swap the photo, overwrite that file and
nothing else needs to change. Crop to the design's 114 × 138 portrait ratio —
it's rendered as a rounded card, not a circle. If the image ever fails to load,
`Avatar` falls back to the initials `RP` rather than showing a broken image.

## Case study mockups

Device mockups live in `src/assets` and are imported in the content bundles, so Vite
fingerprints them at build time. Export them at **2x** for retina — the
`imageWidth`/`imageHeight` fields record the 1x design size, which sets the
aspect ratio and the mockup's proportion of the page.

The band behind each mockup is a CSS gradient (white → `#dfe2ff`), not an image,
so it needs no export.

## Editing content — two languages

All copy lives in [`src/content/`](src/content). `types.ts` defines the shape,
and **`en.ts` and `ar.ts` must both satisfy it** — a change to one belongs in
the other, or the languages drift apart. Components read copy through
`useContent()` and never import a locale directly.

Each bundle holds:

- `profile` — name, role line, portfolio link, initials fallback
- `meta` — the label/value grid (experience, location, contact, ...)
- `skills` — the Skillset section. Each `body` is an array of segments; wrap a
  phrase as `{ accent: 'Figma' }` to render it in the accent colour
- `callout` — the accent banner closing the Skillset section
- `experience` — work history
- `credentials` — education & certification
- `caseStudies` — project write-ups; adding a `detail` block gives that project
  a "View Case study" button and its full-window dialog
- `ui` — section headings and button labels

Images are shared across languages in `assets.ts`; only `alt` text is
translated.

## Arabic and RTL

`LanguageProvider` sets `<html lang>` and `<html dir>`, so the whole layout
mirrors from one attribute. That only works because the components use
**logical** Tailwind utilities — `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`,
`rounded-s-`, `border-s-`. Using `ml-`, `pr-`, `left-` or `rounded-l-` will
break the Arabic layout, so reach for the logical form by default.

Arabic sets in IBM Plex Sans Arabic (the face used across Saudi government
digital services), loaded in `index.html` and applied via `html[dir='rtl']` in
`index.css`, with slightly looser leading than the Latin side. Phone numbers and
email addresses carry `dir="ltr"` so they don't reorder inside Arabic text.

## Design tokens

Defined once in [`src/index.css`](src/index.css) under `@theme`, mapped from the
Figma file:

| Token             | Value     | Used for                    |
| ----------------- | --------- | --------------------------- |
| `--color-accent`  | `#717dff` | Portfolio pill, headings    |
| `--color-skill`   | `#015e0a` | Skill titles                |
| `--color-muted`   | `#848484` | Meta grid labels            |
| `--color-ink`     | `#000000` | Body text                   |
| `--color-paper`   | `#ffffff` | Page background             |

The design is set in Helvetica; `--font-sans` falls back through Helvetica Neue
→ Helvetica → Arial → Liberation Sans.

## Structure

```
src/
  App.tsx                  page composition
  index.css                Tailwind + design tokens
  content/
    types.ts               the Content shape every locale fills
    en.ts / ar.ts          all copy, one file per language
    assets.ts              images shared across locales
    context.ts             useContent() / useLanguage()
    LanguageProvider.tsx   language state, html lang + dir
  components/
    ProfileHeader.tsx      portrait, name, portfolio pill
    MetaGrid.tsx           reusable 3-column label/value grid
    Skillset.tsx           skill list
    Callout.tsx            accent banner
    Experience.tsx         work history
    Credentials.tsx        education & certification, logo/icon list
    CaseStudy.tsx          project section with gradient band + mockup
    Avatar.tsx             portrait card with initials fallback
    LanguageToggle.tsx     English / Arabic switch
    Reveal.tsx             scroll-triggered fade-in
```
