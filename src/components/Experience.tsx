import { experience } from '@/data/profile'

/**
 * Work history, using the Skillset section's type rhythm: accent heading,
 * green role titles, and a muted company / period line in the meta-grid
 * label style.
 */
export default function Experience() {
  return (
    <section aria-labelledby="experience-heading" className="pt-16 md:pt-24">
      <h2
        id="experience-heading"
        className="text-3xl font-light text-accent md:text-4xl"
      >
        Experience
      </h2>

      <div className="mt-8 flex flex-col gap-6 md:mt-10 md:gap-8">
        {experience.map((role) => (
          <article
            key={`${role.company}-${role.title}-${role.period}`}
            className="flex flex-col gap-1"
          >
            <h3 className="text-xl font-light text-skill md:text-2xl">
              {role.title}
            </h3>

            <p className="text-xs font-normal text-muted md:text-sm">
              {role.company} · {role.period}
              {role.location ? ` · ${role.location}` : ''}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
