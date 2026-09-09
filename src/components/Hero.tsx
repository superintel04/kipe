import Magnetic from './Magnetic'
import Reveal from './Reveal'
import RichText from './RichText'
import Section from './Section'
import portrait from '@/assets/portrait.jpg'
import { useContent } from '@/content'

/**
 * Opening band (Figma node 520:1494). The copy sits in the leading half at the
 * design's 160/128 vertical rhythm, and the portrait fills the trailing half
 * as a 60px-radius panel running the full height of the band.
 *
 * The portrait is absolutely positioned above `lg` and bleeds out by the
 * container gutter to reach the viewport edge; below `lg` it drops into the
 * flow beneath the CTA, since a half-width portrait has nowhere to go on a
 * phone.
 */
export default function Hero() {
  const { profile } = useContent()

  return (
    <Section innerClassName="relative lg:min-h-[654px]">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 -end-6 hidden w-[46%] lg:block md:-end-12"
      >
        <img
          src={portrait}
          alt=""
          className="size-full rounded-[60px] object-cover"
        />
      </div>

      <div className="relative max-w-[772px] pt-20 pb-16 md:pt-40 md:pb-32">
        <Reveal>
          <h1 className="text-h1 font-extrabold">{profile.name}</h1>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-10 text-h4 leading-[1.35] font-medium text-pretty">
            <RichText segments={profile.tagline} />
          </p>
        </Reveal>

        <Reveal delay={280}>
          <Magnetic className="mt-14">
            <a
              href={profile.portfolioUrl}
              className="inline-flex h-[56px] items-center rounded-pill bg-accent px-10 text-body font-bold text-fg-on-accent transition-colors hover:bg-accent-hover"
            >
              {profile.portfolioLabel}
            </a>
          </Magnetic>
        </Reveal>

        {/* The same portrait, in flow, for viewports too narrow to sit it
            alongside the copy. */}
        <Reveal delay={200} className="lg:hidden">
          <img
            src={portrait}
            alt={profile.name}
            className="mt-14 aspect-[707/654] w-full rounded-3xl object-cover"
          />
        </Reveal>
      </div>
    </Section>
  )
}
