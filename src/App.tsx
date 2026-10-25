import { useEffect } from 'react'
import BackToTop from '@/components/BackToTop'
import Home from '@/pages/Home'
import CaseStudyPage from '@/pages/CaseStudyPage'
import { useContent } from '@/content'
import { usePath } from '@/router'
import { initAnalytics, trackPageView } from '@/analytics'

/**
 * Route shell. Each entry in `caseStudyPages` claims `/{slug}`; anything else
 * falls through to the profile, so an unknown URL shows the site rather than a
 * dead end.
 */
export default function App() {
  const { caseStudyPages, documentTitle } = useContent()
  const path = usePath()

  /**
   * GA4's automatic pageview fires once per document load, which on a
   * single-page app means a case study opened from the grid is never counted.
   * The tag is configured with `send_page_view: false` and every view —
   * including the landing one — is sent from here instead, keyed on the path
   * so a back/forward step counts too.
   *
   * The title comes from the content bundle rather than `document.title`,
   * which this effect would otherwise read before LanguageProvider has set it.
   */
  useEffect(() => {
    initAnalytics()
    trackPageView(path, documentTitle)
  }, [path, documentTitle])

  const page = caseStudyPages.find((candidate) => `/${candidate.slug}` === path)

  return (
    <>
      {page ? <CaseStudyPage page={page} /> : <Home />}
      {/* Mounted here rather than per page, so it is present on every route. */}
      <BackToTop />
    </>
  )
}
