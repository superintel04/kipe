import Reveal from './Reveal'
import type { MetaItem } from '@/content'

type MetaGridProps = {
  items: MetaItem[]
  /** Accessible name for the group. */
  label: string
  className?: string
}

/**
 * Label/value pairs. Shared by the profile details band and each case study's
 * role/users/platform row.
 *
 * Phone numbers and email addresses carry `dir="ltr"` so they stay readable
 * when the page mirrors into Arabic.
 */
export default function MetaGrid({
  items,
  label,
  className = '',
}: MetaGridProps) {
  return (
    <section
      aria-label={label}
      className={`grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 ${className}`}
    >
      {items.map((item, index) => (
        <Reveal key={item.label} delay={Math.min(index, 5) * 70}>
          <p className="text-overline font-bold tracking-[0.14em] text-fg-subtle uppercase">
            {item.label}
          </p>
          {item.href ? (
            <a
              href={item.href}
              dir="ltr"
              className="mt-2 block text-h5 font-medium break-words transition-colors hover:text-accent-fg rtl:text-right"
            >
              {item.value}
            </a>
          ) : (
            <p className="mt-2 text-h5 font-medium break-words">{item.value}</p>
          )}
        </Reveal>
      ))}
    </section>
  )
}
