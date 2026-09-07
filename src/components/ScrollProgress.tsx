import { useEffect, useState } from 'react'

/**
 * Thin accent bar across the top showing how far through the page you are.
 *
 * Reads scroll position on a rAF-throttled listener and writes to state only
 * when the rounded percentage changes, so a full page scroll costs a handful
 * of renders rather than one per frame.
 */
export default function ScrollProgress() {
  const [percent, setPercent] = useState(0)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const next =
        max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0
      setPercent((current) =>
        Math.round(current) === Math.round(next) ? current : next,
      )
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
  }, [])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[80] h-1 bg-transparent"
    >
      <div
        style={{ width: `${percent}%` }}
        className="h-full bg-accent transition-[width] duration-150 ease-out"
      />
    </div>
  )
}
