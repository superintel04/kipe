import { useEffect, useRef, type ReactNode } from 'react'

type ParallaxProps = {
  children: ReactNode
  /**
   * How far the element drifts across a full pass through the viewport, in px.
   * Negative values move it against the scroll.
   */
  distance?: number
  className?: string
}

/**
 * Shifts its children slightly as the page scrolls past.
 *
 * Driven by rAF-throttled scroll reads rather than a listener per frame, and
 * skipped entirely under `prefers-reduced-motion` — parallax is one of the
 * effects most likely to cause discomfort.
 */
export default function Parallax({
  children,
  distance = 60,
  className = '',
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0

    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const viewport = window.innerHeight
      if (rect.bottom < 0 || rect.top > viewport) return

      // -1 when the element is entering, +1 when it is leaving.
      const progress =
        (rect.top + rect.height / 2 - viewport / 2) /
        (viewport / 2 + rect.height / 2)
      el.style.transform = `translate3d(0, ${progress * distance}px, 0)`
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [distance])

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  )
}
