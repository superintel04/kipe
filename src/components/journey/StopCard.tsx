import { useEffect, useId, useState } from 'react'
import Link from '@/components/Link'
import ProjectMetrics from '@/components/ProjectMetrics'
import { useContent, type JourneyStop } from '@/content'
import { trackCaseStudyOpen } from '@/analytics'

/**
 * The card that rises when the plane lands in a city: where, the one-line
 * story, the role, and — behind "Show impact" — the case-study summary, its
 * figures and the link through.
 *
 * Only the active card is interactive. The others stay mounted for their
 * transition but are `inert`, so they take neither focus nor clicks while
 * they are faded out. A card collapses again when its city is left behind.
 *
 * `static` renders it in flow, always open to interaction — the no-WebGL list.
 */
export default function StopCard({
  stop,
  active,
  isStatic = false,
}: {
  stop: JourneyStop
  active: boolean
  isStatic?: boolean
}) {
  const { journey, projectCards, ui } = useContent()
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const headingId = useId()

  const project = stop.projectSlug
    ? projectCards.find((card) => card.slug === stop.projectSlug)
    : undefined
  const metrics = project?.metrics ?? stop.metrics ?? []

  // Leaving a city folds its card back up for the next visit.
  const [wasActive, setWasActive] = useState(active)
  if (wasActive !== active) {
    setWasActive(active)
    if (!active) setOpen(false)
  }

  // Esc folds an open card without leaving the page.
  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <article
      aria-labelledby={headingId}
      inert={!isStatic && !active}
      className={
        isStatic
          ? 'rounded-xl border border-border-subtle bg-bg-overlay p-6 shadow-sm md:p-8'
          : `journey-card pointer-events-auto absolute inset-x-3 bottom-3 max-h-[calc(100svh-7.5rem)] overflow-y-auto overscroll-contain rounded-xl border border-border-subtle bg-bg-overlay p-6 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.35)] md:inset-x-auto md:start-12 md:bottom-10 md:w-[31rem] md:p-8 ${
              active ? 'is-active' : ''
            }`
      }
    >
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-overline tracking-[0.12em] text-fg-subtle uppercase">
            <span dir="ltr">{stop.code}</span> · {stop.country}
          </p>
          <h2 id={headingId} className="mt-1 text-h3 leading-tight font-bold">
            {stop.city}
          </h2>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2">
          {project && (
            <img
              src={project.logo}
              alt={project.logoAlt}
              width={project.logoWidth * 0.7}
              height={project.logoHeight * 0.7}
              className="object-contain"
            />
          )}
          {stop.placeholder && (
            <span className="rounded-pill bg-accent-subtle px-2.5 py-0.5 text-caption font-medium text-accent-fg">
              {journey.draft}
            </span>
          )}
        </div>
      </header>

      <p className="mt-2 text-body text-fg-muted">{stop.story}</p>

      <hr className="my-5 border-border-subtle" />

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="text-body font-semibold">{stop.company}</p>
        {stop.period && (
          <p className="font-mono text-caption tracking-[0.06em] text-fg-subtle uppercase">
            {stop.period}
          </p>
        )}
      </div>
      <p className="mt-1 text-body-sm text-accent-fg">{stop.role}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {stop.tags.map((tag) => (
          <li
            key={tag}
            className="rounded-pill border border-border-subtle bg-bg-subtle px-3 py-1 text-caption text-fg-muted"
          >
            {tag}
          </li>
        ))}
      </ul>

      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-pill border border-border py-3 text-body-sm font-medium transition-colors hover:border-border-strong"
      >
        {open ? journey.hideImpact : journey.showImpact}
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`size-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      <div id={panelId} hidden={!open} className="pt-5">
        <p className="text-body leading-[1.6] text-fg-muted">{stop.summary}</p>
        {metrics.length > 0 && <ProjectMetrics metrics={metrics} className="mt-6 sm:grid-cols-2!" />}
        <div className="mt-6">
          {project?.slug ? (
            <Link
              to={`/${project.slug}`}
              onClick={() => trackCaseStudyOpen(project.name, 'cta')}
              className="inline-flex items-center gap-2 rounded-pill bg-accent px-5 py-2.5 text-body-sm font-medium text-fg-on-accent transition-colors hover:bg-accent-hover"
            >
              {ui.viewCaseStudy}
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 rtl:-scale-x-100"
              >
                <path d="M3 8h10" />
                <path d="m9 4 4 4-4 4" />
              </svg>
            </Link>
          ) : (
            <p className="text-body-sm text-fg-subtle">{journey.comingSoon}</p>
          )}
        </div>
      </div>
    </article>
  )
}
