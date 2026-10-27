/**
 * Google Analytics 4.
 *
 * The property id is read from `VITE_GA_MEASUREMENT_ID` rather than committed,
 * and Vite inlines it at build time — so it has to be set in Vercel's project
 * settings *before* the build that should carry it. When the variable is
 * missing, or the bundle is a dev build, every function here no-ops and gtag.js
 * is never requested: local work and preview deployments without the variable
 * stay out of the reports, and the site keeps working with no analytics at all.
 *
 * Nothing in here throws. Analytics is a side-channel; a blocked script or an
 * ad blocker removing `window.gtag` must never take the page down with it.
 */

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as
  | string
  | undefined

/** Dev builds are excluded so your own browsing doesn't land in the reports. */
const ENABLED = Boolean(MEASUREMENT_ID) && import.meta.env.PROD

type GtagParams = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Loads gtag.js and configures the property.
 *
 * `send_page_view: false` turns off the automatic first pageview. The site is
 * a single-page app, so that one event is the *only* one GA4 would ever send
 * by itself — every later route change is invisible to it. `trackPageView`
 * takes over for all of them, including the first, which keeps one code path
 * instead of a special case for the landing page.
 */
export function initAnalytics() {
  if (!ENABLED || typeof window === 'undefined') return
  // React StrictMode mounts effects twice in development, and a remount must
  // not append a second copy of the script.
  if (window.gtag) return

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  // `arguments`, not a rest parameter: gtag.js tells a tag command from a
  // plain data push by checking whether the pushed value is an `arguments`
  // object, so pushing a real array silently stops the commands registering.
  window.gtag = function gtag() {
    window.dataLayer!.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false })
}

/**
 * One pageview. Called for the initial load and again on every client-side
 * navigation.
 *
 * Both the path and the title are passed in rather than read off the document.
 * The path, because the caller holds the normalised one and reading
 * `location` here would race the History update. The title, because React runs
 * child effects before parent ones — so on first mount this fires *before*
 * LanguageProvider has written `document.title`, and the landing pageview
 * would be filed under index.html's static title while every later one used
 * the real title, splitting one page across two rows in the reports.
 */
export function trackPageView(path: string, title: string) {
  if (!ENABLED) return
  window.gtag?.('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: title,
  })
}

/** Any other event. Unknown parameters are dropped by GA4, not rejected. */
export function trackEvent(name: string, params: GtagParams = {}) {
  if (!ENABLED) return
  window.gtag?.('event', name, params)
}

/**
 * The resume being opened. It opens in the browser's PDF viewer rather than
 * downloading, so this counts intent to read it — whether it is then saved
 * happens inside the viewer, where no page can observe it.
 *
 * Still `file_download`, which GA4 defines as a click on a link leading to a
 * file and does not condition on the `download` attribute, so the event stays
 * accurate and keeps its place in the standard reports. But GA4's own Enhanced
 * measurement sends the same event for any link ending in `.pdf`: **turn "File
 * downloads" off** under Admin → Data streams → Enhanced measurement, or every
 * click is counted twice.
 */
export function trackResumeOpen(fileName: string) {
  trackEvent('file_download', {
    file_name: fileName,
    file_extension: 'pdf',
    link_text: 'Download Resume',
  })
}

/**
 * A case study being opened, and from where — the pill and the card body go to
 * the same page, so `source` is what distinguishes a deliberate click on the
 * CTA from a click anywhere on the card.
 */
export function trackCaseStudyOpen(name: string, source: 'card' | 'cta') {
  trackEvent('case_study_open', { project_name: name, source })
}

/**
 * Outbound click. Named `outbound_click` rather than GA4's automatic `click`,
 * so it sits alongside Enhanced measurement's version instead of colliding
 * with it — no toggle to remember, and `link_domain` is reportable on its own.
 */
export function trackOutboundClick(url: string, label: string) {
  trackEvent('outbound_click', {
    link_url: url,
    link_domain: safeHostname(url),
    link_text: label,
    outbound: true,
  })
}

/** A tap on the phone number or the email address in the profile details. */
export function trackContactClick(method: 'phone' | 'email') {
  trackEvent('contact_click', { method })
}

/**
 * `tel:` and `mailto:` are the two contact schemes the meta grid carries.
 * Takes `undefined` so callers can pass an optional href straight through
 * rather than asserting it — most entries in that grid have no link at all.
 */
export function contactMethodFor(
  href: string | undefined,
): 'phone' | 'email' | null {
  if (href?.startsWith('tel:')) return 'phone'
  if (href?.startsWith('mailto:')) return 'email'
  return null
}

/** A malformed href should cost an event parameter, not throw mid-click. */
function safeHostname(url: string): string | undefined {
  try {
    return new URL(url, window.location.href).hostname
  } catch {
    return undefined
  }
}
