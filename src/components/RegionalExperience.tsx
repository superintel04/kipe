import Parallax from './Parallax'
import Reveal from './Reveal'
import Section from './Section'
import { saudiSkyline } from '@/content/assets'
import { useContent } from '@/content'

/**
 * Saudi-experience band (Figma node 563:1918). Three claims sit in a row on a
 * green card while the Riyadh skyline — Al Faisaliah, the Kingdom Centre and
 * the PIF tower behind the mud-brick walls of At-Turaif — breaks out over its
 * top edge.
 *
 * Transcribed from the design: the card is 306px tall and the skyline 383.5px,
 * bottom-aligned to it, so the towers overhang the card's top by 77.5px. The
 * skyline is 30.7% of the card's width rather than the design's 29.8% because
 * the design squeezes the source 3% horizontally; at its true aspect that
 * width reproduces the designed height, and so the designed overhang. The copy
 * begins at 32% of the card, clear of the towers, and each claim centres its
 * mark above two lines of 26px bold.
 *
 * Above `lg` that overlap is reproduced with an absolutely positioned image;
 * below it the skyline drops into the flow above the card and the claims
 * stack, since neither survives a phone's width in a row.
 *
 * The skyline's box is bottom-aligned to the card, clipped, and padded at the
 * top by the drift distance: the towers can rise clear of the card but the
 * base can never slide past its bottom edge, which would otherwise break the
 * card's rounded bottom corner as the band scrolls in.
 *
 * The motion is layered so any one piece can be dropped on its own: the
 * skyline rises as the band enters view (`Reveal`), then keeps drifting
 * against the scroll (`Parallax`), and the claims stagger in behind it. All of
 * it honours `prefers-reduced-motion`, and the card's sheen is disabled there
 * too — see index.css.
 */
export default function RegionalExperience() {
  const { regional } = useContent()

  return (
    <Section innerClassName="pt-16 pb-24 md:pb-36 lg:pt-28">
      <div className="relative">
        {/* In flow on small screens; lifted out of it at `lg`, where its
            bottom edge meets the card's and the towers overhang the top. */}
        <div className="mx-auto mb-[-1px] block w-[62%] max-w-[320px] lg:absolute lg:bottom-0 lg:start-0 lg:z-10 lg:mx-0 lg:mb-0 lg:w-[30.7%] lg:max-w-none lg:overflow-hidden lg:pt-12">
          <Parallax distance={-24}>
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
        </div>

        <div className="regional-card relative overflow-hidden rounded-[15px] px-8 py-12 md:px-12 lg:py-20 lg:ps-[32%] lg:pe-12">
          <ul className="relative flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
            {regional.points.map((point, index) => (
              <li key={point.label} className="lg:flex-1">
                <Reveal delay={index * 120}>
                  <div className="regional-row flex items-center gap-6 md:gap-10 lg:flex-col lg:gap-4 lg:text-center">
                    <span
                      aria-hidden="true"
                      className="regional-mark flex size-[60px] shrink-0 items-center justify-center"
                    >
                      {/* Each mark keeps its own aspect, capped to the box on
                          both axes — which is how the design sizes them: the
                          flag fits as drawn, the Arabic/English pair is capped
                          by its width and the DGA mark by its height. */}
                      <img
                        src={point.icon}
                        alt=""
                        width={point.iconWidth}
                        height={point.iconHeight}
                        className="block size-auto max-h-[60px] max-w-[60px]"
                      />
                    </span>
                    <p className="text-h4 leading-[1.2] font-bold tracking-[-0.31px] text-fg-on-accent text-balance lg:text-[20px]">
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
