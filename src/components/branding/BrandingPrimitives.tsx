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

/**
 * Builds a `wa.me` link. The message is encoded rather than interpolated raw
 * because the openers carry an em dash and an apostrophe, and the Arabic ones
 * are entirely non-ASCII — all of which must be percent-encoded to survive the
 * query string.
 */
export function whatsappHref(
  number: string,
  message: string | undefined,
): string {
  const base = `https://wa.me/${number}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/**
 * The WhatsApp glyph, drawn in `currentColor` so it takes the button's own
 * text colour rather than WhatsApp's green — the page already spends its one
 * accent on the Signature tier, and a second green beside it would compete.
 *
 * Decorative: every button it sits in already says what it does, and the
 * destination is announced by the link itself.
 */
export function WhatsAppIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={`${className} shrink-0`}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  )
}

type ButtonProps = {
  children: ReactNode
  href: string
  /** `solid` is the filled black button; `outline` is the hairline one. */
  variant?: 'solid' | 'outline' | 'inverse'
  size?: 'sm' | 'lg'
  /** Puts the WhatsApp glyph before the label — set on every CTA that opens a chat. */
  whatsapp?: boolean
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
  whatsapp = false,
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
      {whatsapp && <WhatsAppIcon className={size === 'sm' ? 'size-4' : 'size-5'} />}
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
