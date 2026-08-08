import { Award, BadgeCheck, GraduationCap, Medal, ScrollText } from 'lucide-react'
import { credentials, type Credential } from '@/data/profile'

/** Maps the data's icon key to a lucide glyph. */
const icons = {
  badge: BadgeCheck,
  award: Award,
  medal: Medal,
  scroll: ScrollText,
  graduation: GraduationCap,
} satisfies Record<Credential['icon'], typeof Award>

/**
 * Education & certification, following the Skillset section's type rhythm:
 * accent heading and green item titles. Each item shows a brand logo when one
 * is supplied, otherwise a lucide glyph in an accent-tinted disc.
 */
export default function Credentials() {
  return (
    <section aria-labelledby="credentials-heading" className="pt-16 md:pt-24">
      <h2
        id="credentials-heading"
        className="text-3xl font-light text-accent md:text-4xl"
      >
        Education &amp; Certification
      </h2>

      <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 sm:grid-cols-2 md:mt-10">
        {credentials.map((item) => {
          const Icon = icons[item.icon]

          return (
            <li key={item.label} className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent/10">
                {item.logo ? (
                  <img
                    src={item.logo}
                    alt={item.logoAlt ?? ''}
                    className="size-full object-contain"
                  />
                ) : (
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-accent"
                    aria-hidden="true"
                  />
                )}
              </span>

              <span className="text-base font-light text-skill md:text-lg">
                {item.label}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
