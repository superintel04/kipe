import type { ReactNode } from 'react'
import iconCheck from '@/assets/branding/icon-check.svg'

/**
 * The small, repeated pieces of the branding studio page (Figma 23:1238).
 * They live together because none is big enough to own a file and every one
 * is used by two or more sections.
 */

/**
 * The studio wordmark. The trailing full stop takes the accent, which is the
 * only place the raw accent fill appears as type — at 20px extra-bold it is
 * large text, and a single punctuation mark carries no meaning on its own.
 */
export function Wordmark({
  text,
  stop,
  className = '',
}: {
  text: string
  stop: string
  className?: string
}) {
  return (
    <span className={`text-[20px] font-extrabold tracking-[-0.03em] ${className}`}>
      {text}
      <span className="text-accent">{stop}</span>
    </span>
  )
}

/**
 * A section's eyebrow: 11px bold uppercase in the accent, tracked out to the
 * design's 14% (Figma's `Label/Overline`).
 */
export function Overline({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p
      className={`text-overline font-bold tracking-[0.14em] text-accent-fg uppercase ${className}`}
    >
      {children}
    </p>
  )
}

/**
 * The numbered caption marking a deliverable in the hero (Figma 10:487): the
 * number in the accent, a 16px rule, then the label. The rule is decorative,
 * so it is hidden from assistive technology and the pair reads as one line.
 */
export function DeliverableTag({
  number,
  label,
}: {
  number: string
  label: string
}) {
  return (
    <p className="flex items-center gap-2 text-overline font-bold tracking-[0.14em] uppercase">
      <span className="text-accent-fg">{number}</span>
      <span aria-hidden="true" className="h-[2px] w-4 shrink-0 bg-accent" />
      <span className="text-fg-muted">{label}</span>
    </p>
  )
}

type ButtonProps = {
  children: ReactNode
  href: string
  /** `solid` is the filled black button; `outline` is the hairline one. */
  variant?: 'solid' | 'outline' | 'inverse'
  size?: 'sm' | 'lg'
  className?: string
}

/**
 * The page's one action control (Figma 3:94). Every button here is a real
 * anchor — each one goes somewhere, either to an in-page section or out to
 * mail/WhatsApp — so none of them is a `<button>` pretending to navigate.
 */
export function BrandingButton({
  children,
  href,
  variant = 'solid',
  size = 'lg',
  className = '',
}: ButtonProps) {
  const variants = {
    solid: 'bg-fg text-bg border-fg',
    outline: 'border-border-strong text-fg hover:bg-fg hover:text-bg',
    inverse: 'bg-bg text-fg border-bg',
  }
  const sizes = {
    sm: 'h-9 px-4 text-caption',
    lg: 'h-14 px-8 text-body',
  }
  // Only real web destinations open a tab. `mailto:` and `tel:` hand off to
  // another app, where a blank tab would be left behind.
  const external = href.startsWith('http')

  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className={`inline-flex items-center justify-center gap-2 rounded-[5px] border-[1.5px] font-bold whitespace-nowrap transition-colors ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </a>
  )
}

/**
 * The check mark beside a tier feature and on the guarantee band. Decorative:
 * the feature text beside it already says what it says, and a list of ticks
 * announced one by one is noise.
 *
 * Loaded through `<img>`, so the SVG's `currentColor` resolves inside its own
 * document and lands on black — which is what the design binds it to
 * (`Icon/check` is `color/fg`). A text colour on this element would do
 * nothing, so none is set.
 */
export function CheckIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <img
      src={iconCheck}
      alt=""
      aria-hidden="true"
      width={24}
      height={24}
      className={`${className} shrink-0`}
    />
  )
}
