import resumeUrl from '@/assets/RameshPanti-UXUI-Designer.pdf'
import { useContent } from '@/content'

const LINKEDIN_URL = 'https://www.linkedin.com/in/ramesh-ux-designer/'

/**
 * Hero navigation. Three in-page jumps, a resume download and an outbound
 * link, set as one ruled row above the name and aligned to the copy column's
 * leading edge.
 *
 * Plain anchors rather than router links: every target is on this page, so the
 * browser's own hash handling (with `scroll-behavior: smooth` from index.css)
 * does the work. The rules between items are borders on the list items, so
 * they mirror with the text direction rather than needing their own markup.
 */
export default function Nav() {
  const { ui } = useContent()
  const { nav } = ui

  // 16px rather than the reference's larger setting: the bar shares the copy
  // column's width cap, and at 19px it wraps to two lines around 1024px.
  const linkClass =
    'text-body text-fg-muted transition-colors hover:text-fg focus-visible:text-fg'

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
            className={linkClass}
          >
            {nav.resume}
          </a>
        </li>
        <li className="border-s border-border ps-4 md:ps-6">
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${nav.linkedin} (${nav.newTab})`}
            className={linkClass}
          >
            {nav.linkedin}
          </a>
        </li>
      </ul>
    </nav>
  )
}
