import resumeUrl from '@/assets/RameshPanti-UXUI-Designer.pdf'
import { useContent } from '@/content'

const LINKEDIN_URL = 'https://www.linkedin.com/in/ramesh-ux-designer/'

/**
 * Tray-and-arrow download glyph. Drawn at 16px on a 16px grid so the strokes
 * land on whole pixels, and inherits `currentColor` so it follows the link's
 * hover state rather than needing its own.
 */
function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5"
    >
      <path d="M8 2v7.5" />
      <path d="m4.75 6.75 3.25 3.25 3.25-3.25" />
      <path d="M2.5 11.5v1.25a1.25 1.25 0 0 0 1.25 1.25h8.5a1.25 1.25 0 0 0 1.25-1.25V11.5" />
    </svg>
  )
}

/**
 * Outbound arrow, mirrored in Arabic so it still points away from the text.
 */
function OutboundIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
    >
      <path d="M4.75 11.25 11.25 4.75" />
      <path d="M6 4.75h5.25V10" />
    </svg>
  )
}

/**
 * Hero navigation. Three in-page jumps, a resume download and an outbound
 * link, set as one ruled row above the name and aligned to the copy column's
 * leading edge.
 *
 * Plain anchors rather than router links: every target is on this page, so the
 * browser's own hash handling (with `scroll-behavior: smooth` from index.css)
 * does the work. The rules between items are borders on the list items, so
 * they mirror with the text direction rather than needing their own markup.
 *
 * The two icons are decorative — each sits beside a label that already says
 * what the link does — so they carry `aria-hidden` and no alternative text.
 */
export default function Nav() {
  const { ui } = useContent()
  const { nav } = ui

  // 16px rather than the reference's larger setting: the bar shares the copy
  // column's width cap, and at 19px it wraps to two lines around 1024px.
  const linkClass =
    'text-body text-fg-muted transition-colors hover:text-fg focus-visible:text-fg'
  const iconLinkClass = `group inline-flex items-center gap-2 ${linkClass}`

  return (
    <nav aria-label={nav.label}>
      <ul className="flex flex-wrap items-center gap-y-2">
        <li className="pe-4 md:pe-6">
          <a href="#skills" className={linkClass}>
            {nav.skills}
          </a>
        </li>
        <li className="border-s border-border ps-4 pe-4 md:ps-6 md:pe-6">
          <a href="#projects" className={linkClass}>
            {nav.projects}
          </a>
        </li>
        <li className="border-s border-border ps-4 pe-4 md:ps-6 md:pe-6">
          <a href="#experience" className={linkClass}>
            {nav.certifications}
          </a>
        </li>
        <li className="border-s border-border ps-4 pe-4 md:ps-6 md:pe-6">
          {/* `download` names the saved file; the asset itself is fingerprinted
              by Vite, so its URL is not a readable filename. */}
          <a
            href={resumeUrl}
            download="RameshPanti-UXUI-Designer.pdf"
            className={iconLinkClass}
          >
            <DownloadIcon />
            {nav.resume}
          </a>
        </li>
        <li className="border-s border-border ps-4 md:ps-6">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${nav.linkedin} (${nav.newTab})`}
            className={iconLinkClass}
          >
            {nav.linkedin}
            <OutboundIcon />
          </a>
        </li>
      </ul>
    </nav>
  )
}
