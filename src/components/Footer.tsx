import Magnetic from './Magnetic'
import Reveal from './Reveal'
import Section from './Section'
import { useContent } from '@/content'

/**
 * Closing band, inverted so the page ends on a full stop: the message at
 * display scale, then the contact details as large magnetic links.
 */
export default function Footer() {
  const { closing, profile } = useContent()

  return (
    <Section
      className="bg-bg-inverse text-fg-inverse"
      innerClassName="py-24 md:py-36"
    >
      <footer>
        <Reveal>
          <p className="max-w-4xl text-h3 leading-snug font-medium text-balance">
            {closing.message}
          </p>
        </Reveal>

        <div className="mt-14 flex flex-col gap-6 md:mt-20 md:flex-row md:items-center md:gap-14">
          <Reveal delay={120}>
            <Magnetic strength={8}>
              <a
                href={closing.phoneHref}
                dir="ltr"
                className="inline-block text-h4 font-bold transition-colors hover:text-accent"
              >
                {closing.phone}
              </a>
            </Magnetic>
          </Reveal>

          <Reveal delay={220}>
            <Magnetic strength={8}>
              <a
                href={`mailto:${closing.email}`}
                dir="ltr"
                className="inline-block text-h4 font-bold transition-colors hover:text-accent"
              >
                {closing.email}
              </a>
            </Magnetic>
          </Reveal>
        </div>

        <p className="mt-16 text-body text-neutral-400 md:mt-24">
          {closing.signOff}
          <span className="ms-2 font-medium text-fg-inverse">
            {profile.name}
          </span>
        </p>
      </footer>
    </Section>
  )
}
