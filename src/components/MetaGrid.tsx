import Reveal from './Reveal'
import type { MetaItem } from '@/data/profile'

type MetaGridProps = {
  items: MetaItem[]
  /** Accessible name for the group. */
  label: string
  className?: string
}

/**
 * Label/value pairs in a three-column grid (as designed), collapsing to two
 * then one. Set in Helvetica Regular per the design. Shared by the profile
 * header details and each case study's role/users/platform row.
 */
export default function MetaGrid({
  items,
  label,
  className = '',
}: MetaGridProps) {
  return (
    <section
      aria-label={label}
      className={`grid grid-cols-1 gap-x-10 gap-y-6 font-normal sm:grid-cols-2 md:grid-cols-3 ${className}`}
    >
      {items.map((item, index) => (
        <Reveal key={item.label} delay={Math.min(index, 5) * 60}>
          <p className="text-xs text-muted md:text-sm">{item.label}</p>
          {item.href ? (
            <a
              href={item.href}
              className="text-[15px] break-words text-ink transition-colors hover:text-accent md:text-base"
            >
              {item.value}
            </a>
          ) : (
            <p className="text-[15px] break-words text-ink md:text-base">
              {item.value}
            </p>
          )}
        </Reveal>
      ))}
    </section>
  )
}
