import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

type RevealProps = {
  children: ReactNode
  /** Stagger, in ms, applied once the element enters the viewport. */
  delay?: number
  className?: string
}

/**
 * Fades and lifts its children into place the first time they scroll into
 * view, then stops observing — the content stays put on the way back up.
 *
 * The hidden state is scoped to `.js` on <html> (set in main.tsx before React
 * renders), so without JavaScript everything renders visible rather than
 * blank. `prefers-reduced-motion` disables the effect entirely — see index.css.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      // Trigger a touch before the element is fully on screen.
      { threshold: 0.05, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={
        delay
          ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties)
          : undefined
      }
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
    >
      {children}
    </div>
  )
}
