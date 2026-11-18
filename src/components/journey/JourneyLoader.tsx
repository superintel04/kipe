import { useEffect, useRef, useState } from 'react'

/**
 * Full-screen intro over the journey page while the scene builds: the R mark
 * drawing itself in, and a count to 100%.
 *
 * The count is honest at the end and theatrical before it — it eases toward
 * 90% on its own and only reaches 100% once `ready` says the scene exists,
 * with a short floor so a fast load still reads as an intro rather than a
 * flicker. Skippable at any point; the page decides whether to show it at all
 * (once per session, never under reduced motion).
 */
export default function JourneyLoader({
  ready,
  label,
  skipLabel,
  onDone,
}: {
  ready: boolean
  label: string
  skipLabel: string
  onDone: () => void
}) {
  const [percent, setPercent] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const readyRef = useRef(ready)
  const doneRef = useRef(onDone)

  useEffect(() => {
    readyRef.current = ready
  }, [ready])

  useEffect(() => {
    doneRef.current = onDone
  }, [onDone])

  useEffect(() => {
    const started = performance.now()
    let value = 0
    let frame = 0
    let exitTimer = 0

    const tick = (now: number) => {
      const elapsed = now - started
      const ceiling = readyRef.current && elapsed > 1500 ? 100 : 90
      value += (ceiling - value) * (ceiling === 100 ? 0.12 : 0.035)
      if (ceiling === 100 && value > 99.5) value = 100
      setPercent(Math.round(value))

      if (value >= 100) {
        setLeaving(true)
        exitTimer = window.setTimeout(() => doneRef.current(), 650)
        return
      }
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(exitTimer)
    }
  }, [])

  return (
    <div
      className={`journey-loader fixed inset-0 z-[60] flex flex-col bg-bg-inverse text-fg-inverse ${
        leaving ? 'is-leaving' : ''
      }`}
    >
      <div className="flex justify-end px-6 pt-6 md:px-12">
        <button
          type="button"
          onClick={() => doneRef.current()}
          className="rounded-pill border border-fg-inverse/30 px-4 py-2 text-body-sm text-fg-inverse/80 transition-colors hover:border-fg-inverse hover:text-fg-inverse"
        >
          {skipLabel}
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <svg
          viewBox="-4 -4 108 108"
          aria-hidden="true"
          className="journey-loader-mark size-28 text-accent md:size-36"
        >
          <path
            pathLength={1}
            d="M75.001 0C88.8076 0.000395819 100.001 11.1933 100.001 25C100.001 38.8068 88.8077 49.9996 75.001 50H60.8281L88.9873 78.1592C89.7677 78.9402 89.7679 80.2064 88.9873 80.9873C88.2064 81.7682 86.9403 81.7678 86.1592 80.9873L54.6309 49.459C53.8498 48.6779 53.8498 47.4119 54.6309 46.6309C55.0209 46.2409 55.5319 46.0454 56.043 46.0449V46H75.001C86.4174 45.9996 95.7065 36.8891 95.9941 25.542L96.001 25C96.0007 13.5838 86.8901 4.29469 75.543 4.00684L75.001 4H4V75C4.00013 86.5976 13.4031 95.9998 25.001 96C36.4174 95.9996 45.7065 86.8891 45.9941 75.542L46.001 75V56.9756L35.8193 46.7949C35.0383 46.0139 35.0383 44.7469 35.8193 43.9658C36.6004 43.1848 37.8674 43.1848 38.6484 43.9658L49.3828 54.7012C49.6034 54.9217 49.7595 55.1819 49.8555 55.458C49.9347 55.6581 49.9854 55.8729 49.9961 56.0986H50.001V75C50.0008 88.8068 38.8077 99.9996 25.001 100C11.1941 99.9998 0.000131947 88.8069 0 75V0H75.001Z"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </div>

      <div
        role="status"
        aria-label={`${label} ${percent}%`}
        className="mx-auto mb-12 w-[min(22rem,80vw)]"
      >
        <div className="flex justify-between text-caption text-fg-inverse/70" aria-hidden="true">
          <span>{label}</span>
          <span className="tabular-nums">{percent}%</span>
        </div>
        <div className="mt-2 h-px bg-fg-inverse/15" aria-hidden="true">
          <div
            className="h-px bg-fg-inverse"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}
