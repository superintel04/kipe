import type { ReactNode } from 'react'

type SectionProps = {
  children: ReactNode
  /** Full-bleed background; content stays in the shared container. */
  className?: string
  innerClassName?: string
  id?: string
  labelledBy?: string
}

/**
 * One full-width band. The band itself carries the background so colour runs
 * edge to edge, while the content sits in a single shared container — the one
 * place the site's max width and gutters are defined.
 */
export default function Section({
  children,
  className = '',
  innerClassName = '',
  id,
  labelledBy,
}: SectionProps) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={className}>
      <div className={`mx-auto max-w-[92rem] px-6 md:px-12 ${innerClassName}`}>
        {children}
      </div>
    </section>
  )
}
