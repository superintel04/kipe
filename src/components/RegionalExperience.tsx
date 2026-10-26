import Reveal from './Reveal'
import Section from './Section'
import { useContent } from '@/content'

/**
 * Saudi-experience band (Figma node 563:1918). Three claims sit in a row on a
 * green card.
 *
 * The design has the Riyadh skyline overhanging the card's top edge; without
 * it the copy no longer has to leave room, so the claims run the full width
 * rather than starting at the design's 32%. Each claim centres its mark above
 * its line, and they stack below `lg`, which a row of three cannot survive.
 *
 * The claims stagger in through `Reveal`, and the card's sheen honours
 * `prefers-reduced-motion` — see index.css.
 */
export default function RegionalExperience() {
  const { regional } = useContent()

  return (
    <Section innerClassName="pt-16 pb-24 md:pb-36 lg:pt-28">
      {/* 100px on one diagonal, square on the other. Logical corners, so the
          diagonal flips with the reading direction in Arabic. */}
      <div className="regional-card relative overflow-hidden rounded-ss-[100px] rounded-ee-[100px] px-8 py-12 md:px-12 lg:px-16 lg:py-20">
        <ul className="relative flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
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
    </Section>
  )
}
