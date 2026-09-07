import { useState, type ReactNode } from 'react'
import CaseStudyDialog from './CaseStudyDialog'
import Link from './Link'
import Magnetic from './Magnetic'
import MetaGrid from './MetaGrid'
import Parallax from './Parallax'
import Reveal from './Reveal'
import Section from './Section'
import { useContent, type CaseStudy as CaseStudyType } from '@/content'

type CaseStudyProps = {
  study: CaseStudyType
  index: number
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
      className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100"
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
 * Wraps the mockup in a link when the project has a page of its own, and in a
 * plain div when it doesn't — so the frame's styling lives in one place and
 * `group-hover:` keeps working either way.
 */
function ImageFrame({
  to,
  label,
  children,
}: {
  to?: string | false
  label: string
  children: ReactNode
}) {
  const className =
    'group relative mt-12 block overflow-hidden rounded-2xl bg-bg-muted md:mt-16'

  if (!to) return <div className={className}>{children}</div>

  return (
    <Link to={to} aria-label={label} className={className}>
      {children}
      {/* Appears on hover so the image reads as clickable; hidden from
          assistive tech, which already has the link's own label. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-6 end-6 inline-flex h-[44px] items-center gap-2 rounded-pill bg-bg-inverse px-6 text-body-sm font-bold text-fg-inverse opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:bottom-10 md:end-10 md:translate-y-2"
      >
        {label}
        <ExternalLinkIcon />
      </span>
    </Link>
  )
}

/**
 * One project. The number and title sit above a full-width mockup that drifts
 * against the scroll and scales fractionally on hover; the summary and details
 * follow beneath.
 */
export default function CaseStudy({ study, index }: CaseStudyProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const { ui, caseStudyPages } = useContent()

  /**
   * A project with a full page of its own links there; the rest fall back to
   * the in-place dialog, so every project keeps a "View Case study" action.
   */
  const page = caseStudyPages.find((candidate) => candidate.name === study.name)
  const ctaClassName =
    'group inline-flex h-[56px] items-center gap-3 rounded-pill border border-border-strong px-8 text-body font-bold transition-colors hover:bg-bg-inverse hover:text-fg-inverse'

  return (
    <Section innerClassName="py-16 md:py-24">
      <article>
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-border-strong pt-8">
            <header className="flex items-baseline gap-5 md:gap-8">
              <span
                aria-hidden="true"
                className="text-h4 font-bold text-fg-subtle tabular-nums"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="text-overline font-bold tracking-[0.14em] text-fg-subtle uppercase">
                  {study.eyebrow}
                </p>
                <h2 className="mt-2 text-h2 font-extrabold">
                  {study.name}
                  <span className="font-medium text-fg-muted">
                    {study.client}
                  </span>
                </h2>
              </div>
            </header>

            {page ? (
              <Magnetic strength={10}>
                <Link to={`/${page.slug}`} className={ctaClassName}>
                  {ui.viewCaseStudy}
                  <ExternalLinkIcon />
                </Link>
              </Magnetic>
            ) : (
              study.detail && (
                <Magnetic strength={10}>
                  <button
                    type="button"
                    onClick={() => setDialogOpen(true)}
                    className={ctaClassName}
                  >
                    {ui.viewCaseStudy}
                    <ExternalLinkIcon />
                  </button>
                </Magnetic>
              )
            )}
          </div>
        </Reveal>

        <Reveal delay={120}>
          {/* The mockup is a second route into the case study, so the whole
              image is the target rather than the button alone. Wrapped only
              when there is somewhere to go. */}
          <ImageFrame to={page && `/${page.slug}`} label={ui.viewCaseStudy}>
            <Parallax distance={-28}>
              <img
                src={study.image}
                alt={study.imageAlt}
                width={study.imageWidth}
                height={study.imageHeight}
                loading="lazy"
                decoding="async"
                className="mx-auto block h-auto w-full max-w-[1100px] px-6 py-14 transition-transform duration-700 ease-out group-hover:scale-[1.03] md:px-16 md:py-20"
              />
            </Parallax>
          </ImageFrame>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-12 md:mt-20 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="text-h4 leading-snug font-medium text-balance">
              {study.summary}
            </p>
          </Reveal>

          <MetaGrid
            items={study.meta}
            label={ui.projectDetails(study.name)}
            className="lg:grid-cols-1 lg:gap-y-8"
          />
        </div>
      </article>

      {!page && study.detail && (
        <CaseStudyDialog
          study={study}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </Section>
  )
}
