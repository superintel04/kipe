import ProfileHeader from '@/components/ProfileHeader'
import MetaGrid from '@/components/MetaGrid'
import Skillset from '@/components/Skillset'
import Callout from '@/components/Callout'
import CaseStudy from '@/components/CaseStudy'
import Experience from '@/components/Experience'
import Credentials from '@/components/Credentials'
import Footer from '@/components/Footer'
import { meta, caseStudies } from '@/data/profile'

export default function App() {
  return (
    <div className="min-h-screen bg-canvas py-0 md:py-14">
      {/* The white sheet, mirroring the Figma page frame. */}
      <div className="mx-auto max-w-4xl overflow-hidden bg-paper px-6 pt-10 pb-16 md:rounded-2xl md:px-10 md:pt-14 md:pb-24 md:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_12px_40px_rgba(0,0,0,0.06)]">
        <ProfileHeader />
        <main>
          <MetaGrid
            items={meta}
            label="Profile details"
            className="pt-12 md:pt-16"
          />
          <Skillset />
          <Callout />
          {/* Target for the header's "View Projects" link. */}
          <div id="projects" className="scroll-mt-6">
            {caseStudies.map((study) => (
              <CaseStudy key={study.name} study={study} />
            ))}
          </div>
          <Experience />
          <Credentials />
        </main>
        <Footer />
      </div>
    </div>
  )
}
