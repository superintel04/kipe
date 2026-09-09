import Magnetic from './Magnetic'
import Reveal from './Reveal'
import RichText from './RichText'
import Section from './Section'
import heroPortrait from '@/assets/hero-portrait.webp'
import { useContent } from '@/content'

/**
 * Opening band (Figma node 520:1494). The copy sits in the leading half at the
 * design's 160/128 vertical rhythm, and the portrait fills the trailing half
 * as a 60px-radius panel running the full height of the band.
 *
 * The portrait is absolutely positioned above `lg`, starting 92px down so it
 * clears the fixed language toggle (24px inset + its 44px tile + a 24px gap)
 * and ending 64px above the band's foot. Below `lg` it drops into the flow
 * beneath the CTA, since a half-width portrait has nowhere to go on a phone.
 */
export default function Hero() {
  const { profile } = useContent()

  return (
    <Section innerClassName="relative lg:min-h-[654px]">
      <div
        aria-hidden="true"
        className="absolute end-0 top-[92px] bottom-16 hidden w-[40%] lg:block"
      >
        <img
          src={heroPortrait}
          alt=""
          width={1254}
          height={1254}
          fetchPriority="high"
          className="size-full rounded-[48px] object-cover"
        />
      </div>

      {/* The copy paints above the portrait, so between `lg` and `2xl` it is
          capped short of the panel's leading edge rather than running under
          it; only past `2xl` is there room for the design's 772px measure. */}
      <div className="relative max-w-[772px] pt-20 pb-16 md:pt-40 md:pb-32 lg:max-w-[56%] 2xl:max-w-[772px]">
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
            src={heroPortrait}
            alt={profile.name}
            width={1254}
            height={1254}
            className="mt-14 aspect-[707/654] w-full rounded-3xl object-cover"
          />
        </Reveal>
      </div>
    </Section>
  )
}
