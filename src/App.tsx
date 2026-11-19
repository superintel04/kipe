import { lazy, Suspense, useEffect } from 'react'
import BackToTop from '@/components/BackToTop'
import Home from '@/pages/Home'
import CaseStudyPage from '@/pages/CaseStudyPage'
import { useContent } from '@/content'
import { BRANDING_PATH, JOURNEY_PATH, usePath } from '@/router'
import { initAnalytics, trackPageView } from '@/analytics'

/**
 * The journey page carries three.js, several times the size of the rest of the
 * site together, so it is split out and only fetched when someone goes there.
 */
const JourneyPage = lazy(() => import('@/pages/JourneyPage'))

/**
 * The branding studio is a separate business with its own palette and its own
 * sections — nothing on the profile imports it, so it is split out too and
 * only fetched by someone who asks for `/branding`.
 */
const BrandingPage = lazy(() => import('@/pages/BrandingPage'))

/**
 * Route shell. `/journey` is the 3D career flight; each entry in
 * `caseStudyPages` claims `/{slug}`; anything else falls through to the
 * profile, so an unknown URL shows the site rather than a dead end.
 */
export default function App() {
  const { caseStudyPages, documentTitle, branding } = useContent()
  const path = usePath()

  /**
   * The branding studio is its own business with its own title, and this
   * effect runs before the early return that renders it — so without this the
   * whole of `/branding` would report under the profile's title and the two
   * would be indistinguishable in GA4's title-keyed reports.
   */
  const title =
    path === BRANDING_PATH ? branding.documentTitle : documentTitle

  /**
   * GA4's automatic pageview fires once per document load, which on a
   * single-page app means a case study opened from the grid is never counted.
   * The tag is configured with `send_page_view: false` and every view —
   * including the landing one — is sent from here instead, keyed on the path
   * so a back/forward step counts too.
   *
   * The title comes from the content bundle rather than `document.title`,
   * which this effect would otherwise read before the page that owns the
   * route has set it.
   */
  useEffect(() => {
    initAnalytics()
    trackPageView(path, title)
  }, [path, title])

  if (path === BRANDING_PATH) {
    return (
      <Suspense fallback={<div className="h-svh bg-bg" />}>
        <BrandingPage />
      </Suspense>
    )
  }

  if (path === JOURNEY_PATH) {
    // No BackToTop here: the route rail does that job, and the floating
    // button would sit on top of the city cards on a phone.
    return (
      <Suspense fallback={<div className="h-svh bg-bg-inverse" />}>
        <JourneyPage />
      </Suspense>
    )
  }

  const page = caseStudyPages.find((candidate) => `/${candidate.slug}` === path)

  return (
    <>
      {page ? <CaseStudyPage page={page} /> : <Home />}
      {/* Mounted here rather than per page, so it is present on every route
          except the journey (above). */}
      <BackToTop />
    </>
  )
}
