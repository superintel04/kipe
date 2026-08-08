import MetaGrid from './MetaGrid'
import { DESIGN_PAGE_WIDTH, type CaseStudy as CaseStudyType } from '@/data/profile'

type CaseStudyProps = {
  study: CaseStudyType
}

/**
 * Exact geometry of the curved divider, exported from the Figma vector
 * (node 1:48, 597×14). Stretched to the container width with
 * preserveAspectRatio="none", exactly as it scales in the design.
 */
const CURVE_PATH = 'M0 14C78.8994 3.43527 308.759 -11.3554 597 14H0Z'

/**
 * A single project write-up (Figma node 1:40).
 *
 * The gradient band bleeds past the sheet's horizontal padding to span its full
 * width and is capped by the curved divider. The device mockup deliberately
 * overhangs the band's bottom edge, as in the design.
 */
export default function CaseStudy({ study }: CaseStudyProps) {
  /** The mockup's share of the page width in the design, preserved at any size. */
  const imageWidth = `${(study.imageWidth / DESIGN_PAGE_WIDTH) * 100}%`

  return (
    <article className="mt-16 md:mt-24">
      <div className="relative -mx-6 md:-mx-10">
        {/* Gradient backdrop, stopping short of the mockup's bottom edge so the
            image overhangs it. */}
        <div
          aria-hidden="true"
          style={{ height: `${study.bandRatio * 100}%` }}
          className="absolute inset-x-0 top-0 bg-gradient-to-b from-paper to-[#dfe2ff]"
        >
          <svg
            viewBox="0 0 597 14"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-[14px] w-full md:h-[21px]"
            aria-hidden="true"
          >
            <path d={CURVE_PATH} fill="var(--color-paper)" />
          </svg>
        </div>

        <div className="relative px-6 pt-6 md:px-10 md:pt-8">
          <header>
            <p className="text-lg leading-snug font-light md:text-xl">
              {study.eyebrow}
            </p>
            <h2 className="text-lg leading-snug font-light md:text-xl">
              <span className="font-normal text-accent">{study.name}</span>
              <span>{study.client}</span>
            </h2>
          </header>

          <img
            src={study.image}
            alt={study.imageAlt}
            width={study.imageWidth}
            height={study.imageHeight}
            loading="lazy"
            style={{ '--mockup-width': imageWidth } as React.CSSProperties}
            className="mx-auto mt-6 block h-auto w-[88%] max-w-[700px] sm:w-[var(--mockup-width)] md:mt-8"
          />
        </div>
      </div>

      <p className="mt-10 max-w-3xl text-[15px] leading-relaxed font-light text-ink md:mt-12 md:text-base">
        {study.summary}
      </p>

      <MetaGrid
        items={study.meta}
        label={`${study.name} project details`}
        className="mt-10 md:mt-12"
      />
    </article>
  )
}
