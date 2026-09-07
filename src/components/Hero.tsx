import Avatar from './Avatar'
import Magnetic from './Magnetic'
import Parallax from './Parallax'
import Reveal from './Reveal'
import Section from './Section'
import portrait from '@/assets/portrait.jpg'
import { useContent } from '@/content'

/**
 * Opening band: the name at display scale, the role line broken onto its own
 * lines, and the portrait drifting gently against the scroll.
 */
export default function Hero() {
  const { profile } = useContent()

  /** Split the role line so each title can sit on its own row. */
  const roles = profile.title
    .split(/\s*[|&]\s*/)
    .map((role) => role.trim())
    .filter(Boolean)

  return (
    <Section className="pt-28 pb-20 md:pt-40 md:pb-32" innerClassName="">
      <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <Reveal>
            <h1 className="text-h1 font-extrabold">{profile.name}</h1>
          </Reveal>

          <ul className="mt-8 flex flex-col gap-1 md:mt-10">
            {roles.map((role, index) => (
              <Reveal key={role} delay={120 + index * 80}>
                <li className="text-h4 font-medium text-fg-muted">{role}</li>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={400}>
            <Magnetic className="mt-10 md:mt-14">
              <a
                href={profile.portfolioUrl}
                className="inline-flex h-[56px] items-center rounded-pill bg-accent px-10 text-body font-bold text-fg-on-accent transition-colors hover:bg-accent-hover"
              >
                {profile.portfolioLabel}
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <Reveal delay={200}>
          <Parallax distance={-40}>
            <Avatar
              src={portrait}
              alt={profile.name}
              initials={profile.initials}
              className="aspect-[114/138] w-48 rounded-2xl md:w-64 lg:w-72"
            />
          </Parallax>
        </Reveal>
      </div>
    </Section>
  )
}
