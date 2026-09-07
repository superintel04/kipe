import Home from '@/pages/Home'
import CaseStudyPage from '@/pages/CaseStudyPage'
import { useContent } from '@/content'
import { usePath } from '@/router'

/**
 * Route shell. Each entry in `caseStudyPages` claims `/{slug}`; anything else
 * falls through to the profile, so an unknown URL shows the site rather than a
 * dead end.
 */
export default function App() {
  const { caseStudyPages } = useContent()
  const path = usePath()

  const page = caseStudyPages.find((candidate) => `/${candidate.slug}` === path)
  if (page) return <CaseStudyPage page={page} />

  return <Home />
}
