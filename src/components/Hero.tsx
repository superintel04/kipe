import Avatar from './Avatar'
import Magnetic from './Magnetic'
import Parallax from './Parallax'
import Reveal from './Reveal'
import RichText from './RichText'
import Section from './Section'
import portrait from '@/assets/portrait.jpg'
import { useContent } from '@/content'

/**
 * Opening band: the name at display scale, the positioning statement beneath
 * it, and the portrait drifting gently against the scroll.
 */
export default function Hero() {
  const { profile } = useContent()

  return (
    <Section className="pt-28 pb-20 md:pt-40 md:pb-32" innerClassName="">
      <div className="grid grid-cols-1 items-end gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <Reveal>
            <h1 className="text-h1 font-extrabold">{profile.name}</h1>
          </Reveal>

          {/* Capped near 46 characters a line — the width prose stays
              comfortable to read at this size. */}
          <Reveal delay={140}>
            <p className="mt-8 max-w-[46ch] text-h4 leading-[1.35] font-medium text-fg-muted text-pretty md:mt-10">
              <RichText segments={profile.tagline} />
            </p>
          </Reveal>

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
