import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * A horizontal rail that drifts on its own and can be grabbed at any point.
 *
 * Shared by the skillset marquee and the case-study carousels: both want the
 * same behaviour, and the wrap arithmetic is fiddly enough that a second copy
 * would drift out of step with this one.
 */

/**
 * 64px/s — the pace the CSS keyframe marquee ran at (one 8-card pass in 40s),
 * kept so the section's rhythm is unchanged by the rewrite.
 */
export const DRIFT_SPEED = 64

/** How long the strip stays still after a drag before it picks up again. */
export const RESUME_DELAY = 1800

/** Pointer travel past which a press was a drag, not a click on a card. */
export const DRAG_THRESHOLD = 10

/** Positive modulo — `-5 % 100` is `-5` in JS, and we want `95`. */
export function wrap(value: number, span: number) {
  return ((value % span) + span) % span
}

/**
 * Drives the strip.
 *
 * The cards used to move by animating `transform: translateX` on the track
 * inside an `overflow: hidden` box, which cannot be scrolled — a transform is
 * not a scroll position, so there was nothing for a visitor to grab. This runs
 * the same motion by writing `scrollLeft` on a real scroll container instead,
 * which costs a frame loop but means the trackpad, a drag, the scrollbar and
 * the keyboard all reach it for free.
 *
 * Looping works the same way it did: the track holds two identical passes and
 * the position wraps at half the scroll width, which is exactly one pass, so
 * the seam is invisible. The wrap runs in both directions, so dragging
 * backwards past the start continues rather than hitting a wall.
 *
 * Positions are held as a "logical" offset counting up from zero whichever way
 * the page reads — in RTL `scrollLeft` runs from `-max` to `0`, and a sign
 * flip at the boundary keeps the rest of the arithmetic identical.
 *
 * The loop runs only above `md` and only with motion allowed, matching where
 * the duplicate pass is rendered — below that the strip is left as an ordinary
 * native scroller, so a phone neither burns a frame loop nor wraps against a
 * track that is half the width the maths assumes.
 */
export function useDriftingScroller(held: boolean) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  // Read inside the frame loop, so changing one never restarts the loop.
  const heldRef = useRef(held)
  const hoveredRef = useRef(false)
  const draggingRef = useRef(false)
  const resumeAtRef = useRef(0)
  const halfRef = useRef(0)
  const dragRef = useRef<{ startX: number; startAt: number } | null>(null)

  useEffect(() => {
    heldRef.current = held
  }, [held])

  // One pass is the wrap point. Remeasured on resize because the cards are a
  // fixed width but the gap and the container are not.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => {
      halfRef.current = track.scrollWidth / 2
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const wide = window.matchMedia('(min-width: 768px)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let last = 0

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)

      const elapsed = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now

      const half = halfRef.current
      if (!half) return

      /**
       * Leave the position alone while something inside holds focus. The
       * browser scrolls a focused card into view, and wrapping underneath it
       * would scroll it straight back out.
       */
      if (viewport.contains(document.activeElement)) return

      const sign = document.documentElement.dir === 'rtl' ? -1 : 1
      let position = sign * viewport.scrollLeft

      const drifting =
        !heldRef.current &&
        !hoveredRef.current &&
        !draggingRef.current &&
        now >= resumeAtRef.current
      if (drifting) position += DRIFT_SPEED * elapsed

      if (position >= half) position -= half
      /**
       * `<= 0` rather than `< 0`: the browser clamps a native backwards scroll
       * at zero before this ever sees a negative value, so resting *at* zero is
       * what has to move. It lands a pass along, where the content is
       * identical, which hides the hop and leaves room to keep scrolling back.
       *
       * One pixel short of the pass, and a second `if` rather than an `else`,
       * so that landing exactly on the wrap point cannot bounce straight back
       * to zero — the two rules would then trade the position every frame.
       */
      if (position <= 0) position = half - 1

      const next = sign * position
      // Only write when the value actually changes — an unconditional write
      // every frame would cancel the momentum of a trackpad fling.
      if (Math.abs(next - viewport.scrollLeft) > 0.01) viewport.scrollLeft = next
    }

    const sync = () => {
      const active = wide.matches && !still.matches
      if (active && !frame) {
        last = 0
        frame = requestAnimationFrame(tick)
      } else if (!active && frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    sync()
    wide.addEventListener('change', sync)
    still.addEventListener('change', sync)
    return () => {
      wide.removeEventListener('change', sync)
      still.removeEventListener('change', sync)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  /**
   * Mouse drag. Touch is left to the browser, which already pans a scroll
   * container and does it with momentum; driving it from here as well would
   * move the strip twice per gesture.
   */
  const onPointerDown = useCallback((event: React.PointerEvent) => {
    const viewport = viewportRef.current
    if (!viewport || event.pointerType !== 'mouse' || event.button !== 0) return
    const sign = document.documentElement.dir === 'rtl' ? -1 : 1
    dragRef.current = {
      startX: event.clientX,
      startAt: sign * viewport.scrollLeft,
    }
    draggingRef.current = true
    setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return
    const viewport = viewportRef.current
    if (!viewport) return

    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current
      const half = halfRef.current
      if (!drag || !half) return
      const sign = document.documentElement.dir === 'rtl' ? -1 : 1
      // Dragging right always reveals earlier content, whichever way the page
      // reads, so the offset is subtracted in both directions.
      const position = wrap(drag.startAt - (event.clientX - drag.startX), half)
      // Wrapped before it is assigned, so the browser is never handed a value
      // outside the scroll range and never clamps the drag to a stop.
      viewport.scrollLeft = sign * position
    }

    const onUp = () => {
      dragRef.current = null
      draggingRef.current = false
      setDragging(false)
      resumeAtRef.current = performance.now() + RESUME_DELAY
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging])

  const onPointerEnter = useCallback(() => {
    hoveredRef.current = true
  }, [])

  const onPointerLeave = useCallback(() => {
    hoveredRef.current = false
  }, [])

  return {
    viewportRef,
    trackRef,
    dragging,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
  }
}
