import { useEffect, useState } from 'react'

/**
 * The smallest router that does the job: a handful of routes, no dependency.
 *
 * `vercel.json` already rewrites every path to index.html, so a deep link like
 * /project1 loads the app and this hook reads the path on mount. A router
 * library would add ~20 kB for what is currently a few pages.
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

/** Turns a project name into the anchor id its section carries on the home page. */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Client-side navigation. `popstate` is dispatched so `usePath` re-reads, and
 * the entry is marked as ours so `goBack` can tell an in-app visit from a
 * direct landing.
 */
export function navigate(to: string) {
  const [path, hash] = to.split('#')
  const samePage =
    normalisePath(path || window.location.pathname) ===
    normalisePath(window.location.pathname)

  if (samePage && !hash) return

  window.history.pushState({ fromApp: true }, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))

  if (hash) {
    // Wait for the destination to render before looking for the target.
    requestAnimationFrame(() => {
      document.getElementById(hash)?.scrollIntoView({ block: 'start' })
    })
  } else {
    window.scrollTo(0, 0)
  }
}

/**
 * Steps back through history when the visitor arrived from within the site, so
 * the browser restores their scroll position. Someone who opened the page
 * directly has nothing to go back to, so they get the fallback instead.
 */
export function goBack(fallback: string) {
  if (window.history.state?.fromApp) {
    window.history.back()
    return
  }
  navigate(fallback)
}
