import Reveal from './Reveal'
import RichText from './RichText'
import Section from './Section'
import { useContent } from '@/content'

/**
 * Skills as a two-column list of large headings with supporting copy. Each
 * entry sits on a hairline rule, so the section reads as an index rather than
 * a wall of paragraphs.
 */
export default function Skillset() {
  const { skills, ui } = useContent()

  return (
    <Section labelledBy="skillset-heading" innerClassName="py-24 md:py-36">
      <Reveal>
        <h2 id="skillset-heading" className="text-h2 font-extrabold">
          {ui.skillset}
        </h2>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-x-16 md:mt-20 lg:grid-cols-2">
        {skills.map((skill, index) => (
          <Reveal
            key={skill.title}
            delay={(index % 2) * 90}
            className="border-t border-border-subtle py-8 md:py-10"
          >
            <h3 className="text-h4 font-bold">{skill.title}</h3>
            <p className="mt-4 max-w-2xl text-body-lg leading-relaxed text-fg-muted">
              <RichText segments={skill.body} />
            </p>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
