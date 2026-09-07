import { useEffect, useState } from 'react'

/**
 * The smallest router that does the job: two routes, no dependency.
 *
 * `vercel.json` already rewrites every path to index.html, so a deep link like
 * /project1 loads the app and this hook reads the path on mount. A router
 * library would add ~20 kB for what is currently one extra page.
 */
export function usePath(): string {
  const [path, setPath] = useState(() =>
    typeof window === 'undefined' ? '/' : window.location.pathname,
  )

  useEffect(() => {
    const sync = () => setPath(window.location.pathname)
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  return normalisePath(path)
}

/** Trailing slashes and casing shouldn't produce a 404. */
export function normalisePath(path: string): string {
  const trimmed = path.replace(/\/+$/, '').toLowerCase()
  return trimmed === '' ? '/' : trimmed
}

/** Client-side navigation; `popstate` is dispatched so `usePath` re-reads. */
export function navigate(to: string) {
  if (normalisePath(window.location.pathname) === normalisePath(to)) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}
