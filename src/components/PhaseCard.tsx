import { useRef, type ReactNode } from 'react'

type PhaseCardProps = {
  active: boolean
  onSelect: () => void
  children: ReactNode
}

/**
 * A phase card. Inactive cards sit back at 60% and lift on hover; the active
 * one comes forward with the design system's hard 8px shadow.
 *
 * While active, a faint accent glow tracks the pointer across the card. The
 * position is written to CSS custom properties on the element, so following
 * the cursor never re-renders React.
 */
export default function PhaseCard({
  active,
  onSelect,
  children,
}: PhaseCardProps) {
  const ref = useRef<HTMLElement>(null)

  const trackPointer = (event: React.PointerEvent<HTMLElement>) => {
    const el = ref.current
    if (!el || !active || event.pointerType !== 'mouse') return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <article
      ref={ref}
      onClick={onSelect}
      onPointerMove={trackPointer}
      className={`phase-card relative overflow-hidden rounded-md border bg-bg p-7 transition-all duration-300 md:p-12 ${
        active
          ? 'is-active -translate-x-[3px] -translate-y-[3px] border-2 border-border-strong opacity-100 shadow-[8px_8px_0_var(--color-border-strong)]'
          : 'cursor-pointer border-border opacity-60 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-fg-muted hover:opacity-90'
      }`}
    >
      {children}
    </article>
  )
}
