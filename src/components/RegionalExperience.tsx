import Parallax from './Parallax'
import Reveal from './Reveal'
import Section from './Section'
import { saudiSkyline } from '@/content/assets'
import { useContent } from '@/content'

/**
 * Saudi-experience band (Figma node 563:1918). Three claims sit on a green
 * card while the Riyadh skyline — Al Faisaliah, the Kingdom Centre and the PIF
 * tower behind the mud-brick walls of At-Turaif — breaks out over its top edge.
 *
 * Transcribed from the design: the card is 401px tall and the skyline 518px,
 * bottom-aligned to it, so the towers overhang the card's top by 117px. The
 * copy starts at 45% of the card's width, which is what leaves room for them,
 * and the rows are spaced 112px centre to centre. The skyline is set to 41.5%
 * of the container rather than the design's 40% because the design squeezes
 * the source 3% horizontally; at its true aspect that width reproduces the
 * designed 518px height, and so the designed overhang. Above `lg` that overlap is
 * reproduced with an absolutely positioned image; below it the skyline drops
 * into the flow above the card, since a 40%-wide skyline on a phone is
 * unreadable.
 *
 * The motion is layered so any one piece can be dropped on its own: the
 * skyline rises as the band enters view (`Reveal`), then keeps drifting
 * against the scroll (`Parallax`), and the rows stagger in behind it. All of
 * it honours `prefers-reduced-motion`, and the card's sheen is disabled there
 * too — see index.css.
 */
export default function RegionalExperience() {
  const { regional } = useContent()

  return (
    <Section innerClassName="pt-16 pb-24 md:pb-36 lg:pt-32">
      <div className="relative">
        {/* In flow on small screens; lifted out of it at `lg`, where its
            bottom edge meets the card's and the towers overhang the top. */}
        <Parallax
          distance={-28}
          className="mx-auto mb-[-1px] block w-[62%] max-w-[320px] lg:absolute lg:bottom-0 lg:start-0 lg:z-10 lg:mx-0 lg:mb-0 lg:w-[41.5%] lg:max-w-none"
        >
          <Reveal>
            <img
              src={saudiSkyline}
              alt={regional.skylineAlt}
              width={558}
              height={518}
              loading="lazy"
              decoding="async"
              className="block w-full"
            />
          </Reveal>
        </Parallax>

        <div className="regional-card relative overflow-hidden rounded-[15px] px-8 py-12 md:px-12 lg:py-14 lg:ps-[45%] lg:pe-16">
          <ul className="relative flex flex-col gap-10 lg:gap-12">
            {regional.points.map((point, index) => (
              <li key={point.label}>
                <Reveal delay={index * 120}>
                  <div className="regional-row flex items-center gap-6 md:gap-10">
                    <span
                      aria-hidden="true"
                      className="regional-mark flex size-[72px] shrink-0 items-center justify-center"
                    >
                      {/* Each mark keeps its own designed dimensions inside the
                          shared box, as the credential marks do. */}
                      <img
                        src={point.icon}
                        alt=""
                        width={point.iconWidth}
                        height={point.iconHeight}
                        style={{
                          width: `${point.iconWidth}px`,
                          height: `${point.iconHeight}px`,
                        }}
                        className="block"
                      />
                    </span>
                    <p className="text-h4 leading-[1.14] font-bold tracking-[-0.31px] text-fg-on-accent text-balance">
                      {point.label}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
