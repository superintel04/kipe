import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { navigate } from '@/router'

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  to: string
  children: ReactNode
}

/**
 * Internal link. Stays a real `<a>` so it can be opened in a new tab, copied,
 * and crawled — the click handler just avoids a full page reload.
 *
 * Anything else an anchor takes (`aria-label`, `title`, `target`, …) passes
 * straight through.
 */
export default function Link({
  to,
  children,
  className = '',
  onClick,
  ...rest
}: LinkProps) {
  return (
    <a
      {...rest}
      href={to}
      className={className}
      onClick={(event) => {
        // A caller's handler runs first and can take over by calling
        // preventDefault — used by the case study's close control, which
        // steps back through history instead of navigating forward.
        onClick?.(event)

        // Let the browser handle modified clicks (new tab, download, etc.).
        if (
          event.defaultPrevented ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          event.button !== 0
        ) {
          return
        }
        event.preventDefault()
        navigate(to)
      }}
    >
      {children}
    </a>
  )
}
