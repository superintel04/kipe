import { useEffect, useRef, useState } from 'react'

type CounterProps = {
  /** The number to count up to. */
  value: number
  /** Rendered before/after the number, e.g. "+" or "٪". */
  prefix?: string
  suffix?: string
  className?: string
}

/**
 * Counts up to `value` the first time it scrolls into view.
 *
 * The final value is rendered immediately for `prefers-reduced-motion` and
 * when IntersectionObserver is unavailable, so the number is never missing —
 * the animation is decoration on top of static text.
 */
export default function Counter({
  value,
  prefix = '',
  suffix = '',
  className = '',
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || done) return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    if (reduced || typeof IntersectionObserver === 'undefined') {
      setShown(value)
      setDone(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        observer.disconnect()
        setDone(true)

        const duration = 1400
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          // Ease-out cubic: quick to start, settling on the final figure.
          const eased = 1 - Math.pow(1 - progress, 3)
          setShown(Math.round(value * eased))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [value, done])

  return (
    <span ref={ref} className={className}>
      {/* Announce the final figure, not the ticking one. */}
      <span aria-hidden="true">
        {prefix}
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {prefix}
        {value}
        {suffix}
      </span>
    </span>
  )
}
