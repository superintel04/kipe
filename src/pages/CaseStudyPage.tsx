import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import CaseStudyHero from '@/components/CaseStudyHero'
import Link from '@/components/Link'
import Magnetic from '@/components/Magnetic'
import PhaseCard from '@/components/PhaseCard'
import Reveal from '@/components/Reveal'
import RichText from '@/components/RichText'
import ScrollProgress from '@/components/ScrollProgress'
import Section from '@/components/Section'
import { useContent, type CaseStudyPage as CaseStudyPageType } from '@/content'
import { navigate } from '@/router'

type CaseStudyPageProps = {
  page: CaseStudyPageType
}

/**
 * Standalone project page (Figma node 432:116). Hero, meta band, the brief,
 * then the process as a timeline whose rail fills as you read.
 *
 * The active phase follows the scroll — whichever card sits nearest the middle
 * of the viewport becomes active — and can also be chosen directly. Phases are
 * a radio group, so arrow keys move between them, which is what a keyboard
 * user expects from a single-choice control.
 */
export default function CaseStudyPage({ page }: CaseStudyPageProps) {
  const { ui } = useContent()
  const [phase, setPhase] = useState(0)

  const dotsRef = useRef<(HTMLButtonElement | null)[]>([])
  const rowsRef = useRef<(HTMLDivElement | null)[]>([])
  const [railHeight, setRailHeight] = useState(0)

  // Measure between the first and last dot rather than guessing the height.
  useLayoutEffect(() => {
    const measure = () => {
      const first = dotsRef.current[0]
      const last = dotsRef.current[page.phases.length - 1]
      if (first && last)
        setRailHeight(Math.max(0, last.offsetTop - first.offsetTop))
    }
    measure()
    window.addEventListener('resize', measure)
    const timer = setTimeout(measure, 400)
    return () => {
      window.removeEventListener('resize', measure)
      clearTimeout(timer)
    }
  }, [page.phases.length])

  // Whichever card is crossing the middle band of the viewport is the active
  // one, so the rail fills as you read rather than only on click.
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length === 0) return
        const index = Number(
          (visible[0].target as HTMLElement).dataset.phaseIndex,
        )
        if (!Number.isNaN(index)) setPhase(index)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )

    rowsRef.current.forEach((row) => row && observer.observe(row))
    return () => observer.disconnect()
  }, [page.phases.length])

  // Esc leaves the case study, matching the dialog the other projects open.
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onEscape)
    return () => window.removeEventListener('keydown', onEscape)
  }, [])

  const select = (index: number) => {
    setPhase(index)
    rowsRef.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    const forward = event.key === 'ArrowDown' || event.key === 'ArrowRight'
    const back = event.key === 'ArrowUp' || event.key === 'ArrowLeft'
    if (!forward && !back) return
    event.preventDefault()
    const next =
      (phase + (forward ? 1 : -1) + page.phases.length) % page.phases.length
    select(next)
    dotsRef.current[next]?.focus()
  }

  const fill =
    page.phases.length > 1 ? (phase / (page.phases.length - 1)) * 100 : 0

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <ScrollProgress />

      {/* Stays put over both the dark hero and the white sections below, so
          the way out is always one click away. A link, not a button — it can
          be opened in a new tab and shows where it goes. */}
      <Link
        to="/"
        aria-label={ui.closeCaseStudy}
        title={ui.closeCaseStudy}
        className="fixed top-5 end-5 z-[90] flex size-12 items-center justify-center rounded-full border border-white/25 bg-fg/60 text-2xl leading-none text-fg-inverse backdrop-blur transition-all duration-200 hover:scale-105 hover:border-accent hover:bg-accent hover:text-white md:top-7 md:end-7"
      >
        <span aria-hidden="true" className="-mt-0.5">
          ×
        </span>
      </Link>

      <CaseStudyHero page={page} />

      {/* ---- Meta band ---- */}
      <section
        aria-label={ui.projectDetails(page.name)}
        className="border-t-2 border-b border-border-strong border-b-border"
      >
        <div className="mx-auto grid max-w-[92rem] grid-cols-1 px-6 md:px-12 lg:grid-cols-3">
          {page.meta.map((item, index) => (
            <div
              key={item.label}
              className={`group border-border py-11 transition-colors duration-200 hover:bg-bg-muted lg:px-8 ${
                index === 0
                  ? 'lg:ps-0'
                  : 'border-t lg:border-t-0 lg:border-s lg:border-border'
              }`}
            >
              <p className="text-overline font-bold tracking-[0.14em] text-fg-muted uppercase transition-colors group-hover:text-accent-fg">
                {item.label}
              </p>
              <p className="mt-3.5 text-h3 leading-[1.14] font-bold tracking-[-0.025em] transition-transform duration-300 group-hover:translate-x-1.5 rtl:group-hover:-translate-x-1.5">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- 01 The brief ---- */}
      <Section innerClassName="py-24 md:py-36">
        <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <Reveal>
            <p className="font-mono text-caption tracking-[0.18em] text-accent-fg uppercase lg:pt-6">
              {page.briefLabel}
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="text-h1 font-bold">{ui.challenge}</h2>
            <p className="mt-11 max-w-[1000px] text-lead leading-[1.5] tracking-[-0.012em] text-fg-muted text-pretty">
              <RichText segments={page.challenge} />
            </p>
          </Reveal>
        </div>
      </Section>

      {/* ---- 02 Process ---- */}
      <Section innerClassName="pb-24 md:pb-36">
        <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <Reveal>
            <p className="font-mono text-caption tracking-[0.18em] text-accent-fg uppercase lg:pt-6">
              {page.processLabel}
            </p>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="text-h1 font-bold">{ui.approach}</h2>
            <p className="mt-7 max-w-[720px] text-body-lg leading-[1.6] text-fg-muted">
              {page.approachIntro}
            </p>
          </Reveal>
        </div>

        <div
          className="relative mt-16 md:mt-24"
          role="radiogroup"
          aria-label={ui.approach}
          onKeyDown={onKeyDown}
        >
          {/* Rail, measured dot-centre to dot-centre. */}
          <div
            aria-hidden="true"
            style={{ height: railHeight }}
            className="absolute top-6 start-[15px] w-0.5 bg-border md:start-[23px]"
          >
            <div
              style={{ height: `${fill}%` }}
              className="w-full bg-accent transition-[height] duration-[620ms] ease-[cubic-bezier(.2,.8,.2,1)]"
            />
          </div>

          {page.phases.map((item, index) => {
            const active = index === phase
            return (
              <div
                key={item.title}
                data-phase-index={index}
                ref={(el) => {
                  rowsRef.current[index] = el
                }}
                className="grid grid-cols-[64px_minmax(0,1fr)] items-start pb-12 last:pb-0 md:grid-cols-[120px_minmax(0,1fr)] md:pb-18"
              >
                <button
                  ref={(el) => {
                    dotsRef.current[index] = el
                  }}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => select(index)}
                  aria-label={item.chip}
                  className={`relative z-10 grid size-8 place-items-center rounded-full border-[3px] font-mono text-caption transition-all duration-300 md:size-12 ${
                    active
                      ? 'scale-[1.14] border-accent bg-accent text-white'
                      : 'border-border bg-bg text-fg-muted hover:scale-110 hover:border-accent'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </button>

                <PhaseCard active={active} onSelect={() => select(index)}>
                  <div className="mb-9 flex flex-col items-start justify-between gap-6 md:flex-row">
                    <h3 className="text-h3 leading-[1.08] font-bold tracking-[-0.035em] text-balance">
                      {item.title}
                    </h3>
                    <span
                      className={`shrink-0 rounded-pill border px-3 py-1.5 text-overline font-bold tracking-[0.16em] uppercase transition-colors duration-200 ${
                        active
                          ? 'border-accent text-accent-fg'
                          : 'border-border text-fg-muted'
                      }`}
                    >
                      {item.chip}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-9 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
                    <ul>
                      {item.bullets.map((bullet, i) => (
                        <li
                          key={bullet}
                          className="group grid grid-cols-[30px_minmax(0,1fr)] items-baseline gap-4 border-t border-border py-3.5 text-[21px] leading-[1.32] tracking-[-0.015em] transition-transform duration-200 last:border-b last:border-border hover:translate-x-2 md:grid-cols-[42px_minmax(0,1fr)] rtl:hover:-translate-x-2"
                        >
                          <span className="font-mono text-caption tracking-[0.06em] text-fg-muted transition-colors group-hover:text-accent-fg">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="border-s-4 border-accent py-1 ps-7">
                      <p className="text-overline font-bold tracking-[0.14em] text-accent-fg uppercase">
                        {ui.outcome}
                      </p>
                      <p
                        className={`mt-3 text-[21px] leading-[1.55] tracking-[-0.012em] transition-colors duration-300 text-pretty ${
                          active ? 'text-fg' : 'text-fg-muted'
                        }`}
                      >
                        {item.outcome}
                      </p>
                    </div>
                  </div>
                </PhaseCard>
              </div>
            )
          })}
        </div>
      </Section>

      {/* ---- Overall outcome ---- */}
      <Section
        className="border-t-2 border-border-strong bg-accent-subtle"
        innerClassName="py-24 md:py-36"
      >
        <div className="grid grid-cols-1 gap-6 md:gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
          <Reveal>
            <p className="font-mono text-caption tracking-[0.18em] text-accent-fg uppercase lg:pt-6">
              {page.resultLabel}
            </p>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="text-h1 font-bold">{page.overallOutcome.label}</h2>
            </Reveal>
            <ul className="mt-12 grid grid-cols-1 gap-x-14 md:mt-16 lg:grid-cols-2">
              {page.overallOutcome.items.map((item, index) => (
                <li key={item}>
                  <Reveal
                    delay={(index % 2) * 80}
                    className="group flex items-start gap-5 border-t border-accent-border py-6 text-[21px] leading-[1.4] tracking-[-0.015em] transition-transform duration-200 hover:translate-x-2 rtl:hover:-translate-x-2"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2.5 block size-2.5 shrink-0 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125"
                    />
                    {item}
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ---- Footer ---- */}
      <Section
        className="mt-auto bg-bg-inverse text-fg-inverse"
        innerClassName="pt-24 pb-18"
      >
        <div className="flex flex-wrap items-end justify-between gap-10">
          <div>
            <p className="flex items-baseline gap-[3px] text-h2 font-extrabold tracking-[-0.045em]">
              Kipe
              <span
                aria-hidden="true"
                className="block size-3 -translate-y-px rounded-full bg-accent"
              />
              ai
            </p>
            <p className="mt-4 text-overline font-bold tracking-[0.14em] text-white/50 uppercase">
              {page.footerTagline}
            </p>
          </div>

          <Magnetic strength={10}>
            <Link
              to="/#projects"
              className="group inline-flex h-[68px] items-center gap-3 rounded-md border-2 border-fg-inverse bg-bg-inverse px-8 text-body-lg font-bold text-fg-inverse shadow-[4px_4px_0_var(--color-fg-inverse)] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:border-accent hover:bg-accent hover:text-white hover:shadow-[6px_6px_0_var(--color-fg-inverse)] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {page.nextLabel}
              <span
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:translate-x-1.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-1.5"
              >
                →
              </span>
            </Link>
          </Magnetic>
        </div>

        <div className="mt-18 flex flex-wrap items-center gap-7 border-t border-white/15 pt-7">
          <Link
            to="/"
            className="text-body-sm text-white/60 transition-colors hover:text-accent"
          >
            {ui.backToProfile}
          </Link>
          <span className="ms-auto text-body-sm text-white/40">
            © 2026 Kipe.ai
          </span>
        </div>
      </Section>
    </div>
  )
}
