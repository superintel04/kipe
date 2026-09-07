import { useRef, type ReactNode } from 'react'

type MagneticProps = {
  children: ReactNode
  /** How far the element may drift toward the cursor, in px. */
  strength?: number
  className?: string
}

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Pulls its child toward the cursor while hovered, easing back on exit.
 *
 * Deliberately pointer-only: the transform is applied on `pointermove` from a
 * mouse, so touch and keyboard users get an ordinary, unmoved control. Honours
 * `prefers-reduced-motion` by doing nothing at all.
 */
export default function Magnetic({
  children,
  strength = 12,
  className = '',
}: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null)

  const move = (event: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current
    if (!el || event.pointerType !== 'mouse' || reducedMotion()) return

    const rect = el.getBoundingClientRect()
    const x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)

    el.style.transition = 'transform 120ms ease-out'
    el.style.transform = `translate(${x * strength}px, ${y * strength}px)`
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    // Slower, springier return than the follow, so it settles rather than snaps.
    el.style.transition = 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.transform = 'translate(0, 0)'
  }

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className={`inline-block ${className}`}
    >
      {children}
    </span>
  )
}
