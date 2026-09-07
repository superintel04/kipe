import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import MetaGrid from '@/components/MetaGrid'
import Section from '@/components/Section'
import Skillset from '@/components/Skillset'
import Callout from '@/components/Callout'
import CaseStudy from '@/components/CaseStudy'
import Experience from '@/components/Experience'
import Credentials from '@/components/Credentials'
import Footer from '@/components/Footer'
import LanguageToggle from '@/components/LanguageToggle'
import Reveal from '@/components/Reveal'
import { useContent } from '@/content'

export default function Home() {
  const content = useContent()

  return (
    <>
      {/* Floating over the hero rather than in flow, so the page opens on the
          name; `end-0` follows the text direction. */}
      <LanguageToggle className="fixed end-6 top-6 z-50 md:end-12" />

      <Hero />
      <Stats />

      <Section innerClassName="py-24 md:py-36">
        <MetaGrid items={content.meta} label={content.ui.profileDetails} />
      </Section>

      <Skillset />
      <Callout />

      <div id="projects" className="scroll-mt-16">
        <Section innerClassName="pt-8 md:pt-16">
          <Reveal>
            <h2 className="text-h2 font-extrabold">{content.ui.caseStudy}</h2>
          </Reveal>
        </Section>

        {content.caseStudies.map((study, index) => (
          <CaseStudy key={study.name} study={study} index={index} />
        ))}
      </div>

      <Experience />
      <Credentials />
      <Footer />
    </>
  )
}
