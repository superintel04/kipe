import Magnetic from './Magnetic'
import Logo from './Logo'
import Nav from './Nav'
import Reveal from './Reveal'
import RichText from './RichText'
import Section from './Section'
import heroPortrait from '@/assets/hero-portrait.webp'
import { useContent } from '@/content'

/**
 * Opening band (Figma node 520:1494). The section navigation opens the copy
 * column, the name and tagline follow at the design's vertical rhythm, and the
 * portrait fills the trailing half as a rounded panel.
 *
 * The portrait is absolutely positioned above `lg`, starting 92px down so it
 * clears the fixed language toggle (24px inset + its 44px tile + a 24px gap)
 * and ending 64px above the band's foot. Square but for an 80px curve on the
 * bottom-leading corner — logical, so it mirrors in Arabic. Below `lg` it
 * drops into the flow beneath the CTA, since a half-width portrait has
 * nowhere to go on a phone.
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
          className="size-full rounded-none rounded-es-[80px] object-cover"
        />
      </div>

      {/* The copy paints above the portrait, so between `lg` and `2xl` it is
          capped short of the panel's leading edge rather than running under
          it; only past `2xl` is there room for the design's 772px measure. */}
      <div className="relative max-w-[772px] pt-16 pb-16 md:pt-24 md:pb-32 lg:max-w-[56%] lg:pt-[92px] 2xl:max-w-[772px]">
        {/* Above `lg` the 92px top matches the portrait's, so the bar and the
            photograph start on the same line; the name then lands at the
            design's 160px. */}
        <Reveal>
          <Nav />
        </Reveal>

        {/* The lockup is the heading (Figma 960:1324 + 960:1335): the mark,
            then the name set as real text on two lines rather than baked into
            the artwork, so it is still read and still indexed. The split is
            on the name's own words, so Arabic breaks in the right place and
            `uppercase` is simply a no-op there. */}
        <Reveal delay={60}>
          <h1 className="mt-10 flex items-center gap-4 text-brand-mark">
            <Logo className="size-[76px] shrink-0" />
            <span className="text-[38px] leading-[48px] font-bold uppercase">
              {profile.name.split(' ').map((word) => (
                <span key={word} className="block">
                  {word}
                </span>
              ))}
            </span>
          </h1>
        </Reveal>

        {/* The same portrait, in flow, for viewports too narrow to sit it
            alongside the copy. It follows the name here rather than closing
            the band, so a phone opens on the lockup and the face together. */}
        <Reveal delay={120} className="lg:hidden">
          <img
            src={heroPortrait}
            alt={profile.name}
            width={1254}
            height={1254}
            className="mt-10 aspect-[707/654] w-full rounded-none rounded-es-[80px] object-cover"
          />
        </Reveal>

        <Reveal delay={180}>
          <p className="mt-10 text-[20px] leading-8 font-normal text-pretty">
            <RichText segments={profile.tagline} />
          </p>
        </Reveal>

        <Reveal delay={280}>
          <Magnetic className="mt-14">
            <a
              href={profile.portfolioUrl}
              // 100px on three corners, square on the trailing bottom one.
              // Logical corners, so the square one mirrors in Arabic.
              className="inline-flex h-[56px] items-center rounded-[100px] rounded-ee-none bg-accent px-10 text-body font-bold text-fg-on-accent transition-colors hover:bg-accent-hover"
            >
              {profile.portfolioLabel}
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </Section>
  )
}
