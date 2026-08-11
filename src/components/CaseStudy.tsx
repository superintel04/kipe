import { useState } from 'react'
import CaseStudyDialog from './CaseStudyDialog'
import Curve from './Curve'
import MetaGrid from './MetaGrid'
import Reveal from './Reveal'
import {
  DESIGN_PAGE_WIDTH,
  type CaseStudy as CaseStudyType,
} from '@/data/profile'

type CaseStudyProps = {
  study: CaseStudyType
}

/** 16px glyph on the CTA, exported from Figma (node 41:341). */
function ExternalLinkIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path
        d="M9 4H3.5C3.10218 4 2.72064 4.15804 2.43934 4.43934C2.15804 4.72064 2 5.10218 2 5.5V12.5C2 12.8978 2.15804 13.2794 2.43934 13.5607C2.72064 13.842 3.10218 14 3.5 14H10.5C10.8978 14 11.2794 13.842 11.5607 13.5607C11.842 13.2794 12 12.8978 12 12.5V7M5 11L14 2M14 5.5V2H10.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

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
  const [dialogOpen, setDialogOpen] = useState(false)

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
          <Curve />
        </div>

        <div className="relative px-6 pt-6 md:px-10 md:pt-8">
          <Reveal>
            <div className="flex items-start justify-between gap-4">
              <header>
                <p className="text-lg leading-snug font-light md:text-xl">
                  {study.eyebrow}
                </p>
                <h2 className="text-lg leading-snug font-light md:text-xl">
                  <span className="font-normal text-accent">{study.name}</span>
                  <span>{study.client}</span>
                </h2>
              </header>

              {study.detail && (
                <button
                  type="button"
                  onClick={() => setDialogOpen(true)}
                  className="-mr-6 flex shrink-0 items-center gap-2.5 rounded-l-full bg-[#5c5c5c] py-3 pr-6 pl-7 text-xs font-bold whitespace-nowrap text-paper transition-opacity hover:opacity-90 md:-mr-10 md:py-4 md:pr-10 md:pl-9 md:text-sm"
                >
                  View Case study
                  <ExternalLinkIcon />
                </button>
              )}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <img
              src={study.image}
              alt={study.imageAlt}
              width={study.imageWidth}
              height={study.imageHeight}
              loading="lazy"
              decoding="async"
              style={{ '--mockup-width': imageWidth } as React.CSSProperties}
              className="mx-auto mt-6 block h-auto w-[88%] max-w-[700px] sm:w-[var(--mockup-width)] md:mt-8"
            />
          </Reveal>
        </div>
      </div>

      <Reveal>
        <p className="mt-10 max-w-3xl text-[15px] leading-relaxed font-light text-ink md:mt-12 md:text-base">
          {study.summary}
        </p>
      </Reveal>

      <MetaGrid
        items={study.meta}
        label={`${study.name} project details`}
        className="mt-10 md:mt-12"
      />

      {study.detail && (
        <CaseStudyDialog
          study={study}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </article>
  )
}
