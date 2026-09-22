import { useEffect, useState } from 'react'
import { useContent } from '@/content'

/** Roughly one viewport down — far enough that the header is out of reach. */
const THRESHOLD = 600

/**
 * Floating return-to-top control, pinned to the trailing bottom corner on
 * every route.
 *
 * Hidden until the page has scrolled past `THRESHOLD`, so it never covers
 * content the reader can still see the top of. Styled as the design system's
 * outline icon button at the 44px medium size — the same tile as the language
 * toggle, which is the site's other floating control.
 *
 * Scroll reads are rAF-throttled, as in `ScrollProgress`, and the jump itself
 * is instant rather than smooth under `prefers-reduced-motion`.
 *
 * Every transition on this button — including the hover colours — lives in
 * `.back-to-top` in index.css rather than in a `transition-colors` utility:
 * Tailwind's utility layer wins over the component layer, so a utility here
 * would replace the fade's transition property instead of adding to it.
 */
export default function BackToTop() {
  const { ui } = useContent()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      setVisible(window.scrollY > THRESHOLD)
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const toTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={ui.backToTop}
      title={ui.backToTop}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`back-to-top fixed end-6 bottom-6 z-50 flex size-11 items-center justify-center rounded-pill border border-border-strong bg-bg text-fg hover:bg-bg-inverse hover:text-fg-inverse md:end-12 md:bottom-10 ${
        visible ? 'is-visible' : ''
      }`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-5"
      >
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </svg>
    </button>
  )
}
