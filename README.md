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

The header photo is **`src/assets/Ramesh-New-dp.jpg`**, imported by
`ProfileHeader.tsx` so Vite fingerprints and optimises it at build time. To swap
it, drop a replacement at that path and update the import (crop to the design's
114 × 138 portrait ratio — it's rendered as a rounded card, not a circle). If
the image ever fails to load, `Avatar` falls back to the initials `RP` rather
than showing a broken image.

## Case study mockups

Device mockups live in `src/assets` and are imported in `profile.ts`, so Vite
fingerprints them at build time. Export them at **2x** for retina — the
`imageWidth`/`imageHeight` fields record the 1x design size, which sets the
aspect ratio and the mockup's proportion of the page.

The band behind each mockup is a CSS gradient (white → `#dfe2ff`), not an image,
so it needs no export.

## Editing content

All copy lives in [`src/data/profile.ts`](src/data/profile.ts):

- `profile` — name, title, portfolio link, initials fallback
- `meta` — the label/value grid (experience, location, contact, …)
- `skills` — the Skillset section. Each `body` is an array of segments; wrap a
  phrase as `{ accent: 'Figma' }` to render it in the accent colour.
- `callout` — the accent banner closing the Skillset section
- `experience` — work history; each role has a company, period, optional
  location
- `credentials` — education & certification. `icon` picks a lucide glyph; set
  `logo` to a Vite asset import (plus `logoAlt`) to show a real brand mark
  instead
- `caseStudies` — project write-ups; add an entry to render another section

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
  data/profile.ts          all content
  components/
    ProfileHeader.tsx      portrait, name, portfolio pill
    MetaGrid.tsx           reusable 3-column label/value grid
    Skillset.tsx           skill list
    Callout.tsx            accent banner
    Experience.tsx         work history
    Credentials.tsx        education & certification, logo/icon list
    CaseStudy.tsx          project section with gradient band + mockup
    Avatar.tsx             circular image with initials fallback
```
