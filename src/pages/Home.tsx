import Hero from '@/components/Hero'
import MetaGrid from '@/components/MetaGrid'
import Section from '@/components/Section'
import Skillset from '@/components/Skillset'
import RegionalExperience from '@/components/RegionalExperience'
import ProjectCards from '@/components/ProjectCards'
import Experience from '@/components/Experience'
import Credentials from '@/components/Credentials'
import SkillCards from '@/components/SkillCards'
import Footer from '@/components/Footer'
import LanguageToggle from '@/components/LanguageToggle'
import { useContent } from '@/content'
import { LANGUAGE_SWITCH_ENABLED } from '@/content/context'

/**
 * The one switch for "Meet my skillset" — the marquee of portraits below the
 * credentials. `false` keeps it off the page; the component, its `skillCards`
 * content in both bundles, its assets and its `.skill-*` styles all stay put,
 * so flipping this back to `true` is the only change needed to restore it.
 *
 * Note that the portraits are still emitted into the build: `en.ts` imports
 * them at module scope for `content.skillCards`, so they remain fetchable at
 * their asset URLs even while nothing renders them.
 */
const SKILL_CARDS_ENABLED = false

export default function Home() {
  const content = useContent()

  return (
    <>
      {/* Floating over the hero rather than in flow, so the page opens on the
          name; `end-0` follows the text direction. Hidden while the Arabic
          side is switched off — see LANGUAGE_SWITCH_ENABLED. */}
      {LANGUAGE_SWITCH_ENABLED && (
        <LanguageToggle className="fixed end-6 top-6 z-50 md:end-12" />
      )}

      <Hero />

      <Section innerClassName="py-24 md:py-36">
        <MetaGrid items={content.meta} label={content.ui.profileDetails} />
      </Section>

      <Skillset />
      <RegionalExperience />

      <ProjectCards />

      <Experience />
      <Credentials />
      {SKILL_CARDS_ENABLED && <SkillCards />}
      <Footer />
    </>
  )
}
