import Reveal from './Reveal'
import Section from './Section'
import { useContent } from '@/content'

/**
 * Work history as a list of ruled rows. Each row highlights on hover, with the
 * accent bar growing in from the leading edge — a cheap, pointer-only cue that
 * costs nothing on touch.
 */
export default function Experience() {
  const { experience, ui } = useContent()

  return (
    <Section
      labelledBy="experience-heading"
      className="bg-bg-subtle"
      innerClassName="py-24 md:py-36"
    >
      <Reveal>
        <h2 id="experience-heading" className="text-h2 font-extrabold">
          {ui.experience}
        </h2>
      </Reveal>

      <ul className="mt-14 md:mt-20">
        {experience.map((role) => (
          <li key={`${role.company}-${role.title}-${role.period}`}>
            <Reveal className="group relative border-t border-border-subtle py-8 md:py-10">
              <span
                aria-hidden="true"
                className="absolute inset-y-0 start-0 w-0.5 bg-accent transition-transform duration-500 [transform-origin:top] scale-y-0 group-hover:scale-y-100"
              />
              <div className="flex flex-col gap-2 transition-transform duration-500 group-hover:translate-x-2 md:flex-row md:items-baseline md:justify-between rtl:group-hover:-translate-x-2">
                <h3 className="text-h4 font-bold">{role.title}</h3>
                <p className="text-body font-medium text-fg-muted md:text-end">
                  {role.company}
                  <span className="block text-body-sm text-fg-subtle">
                    {role.period}
                    {role.location ? ` · ${role.location}` : ''}
                  </span>
                </p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
