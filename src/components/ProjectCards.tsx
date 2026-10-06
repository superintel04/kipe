import type { ReactNode } from 'react'
import Link from './Link'
import Reveal from './Reveal'
import Section from './Section'
import {
  iconArrow,
  iconDga,
  iconDocument,
  iconMoney,
  iconMonitor,
  iconPhone,
} from '@/content/assets'
import {
  useContent,
  type ProjectCard,
  type ProjectMetric,
  type ProjectMetricIcon,
} from '@/content'

/**
 * Marks a metric can carry in place of a figure, at the dimensions they were
 * exported at (Figma 869:4068). `devices` is the overlapping phone-and-monitor
 * pair, so it is composed rather than looked up.
 */
const METRIC_ICON: Record<
  Exclude<ProjectMetricIcon, 'devices'>,
  { src: string; width: number; height: number }
> = {
  document: { src: iconDocument, width: 29, height: 29 },
  money: { src: iconMoney, width: 36, height: 36 },
  dga: { src: iconDga, width: 22, height: 32 },
}

function MetricMark({ icon }: { icon: ProjectMetricIcon }) {
  if (icon === 'devices') {
    return (
      <span aria-hidden="true" className="flex h-10 items-center -space-x-1.5">
        <img src={iconPhone} alt="" width={27} height={27} />
        <img src={iconMonitor} alt="" width={27} height={27} />
      </span>
    )
  }

  const mark = METRIC_ICON[icon]
  return (
    <span aria-hidden="true" className="flex h-10 items-center">
      <img src={mark.src} alt="" width={mark.width} height={mark.height} />
    </span>
  )
}

/**
 * One outcome: a figure and a caption, or a mark and a caption. The caption
 * carries the meaning either way, which is why the marks are decorative.
 */
function Metric({ metric }: { metric: ProjectMetric }) {
  return (
    <div className="flex flex-col gap-2">
      {metric.value ? (
        <p className="flex h-10 items-center text-h4 leading-[1.14] font-bold tracking-[-0.312px]">
          {metric.value}
        </p>
      ) : (
        metric.icon && <MetricMark icon={metric.icon} />
      )}
      <p className="text-body leading-[1.6] tracking-[-0.192px]">
        {metric.label}
      </p>
    </div>
  )
}

/**
 * Three corners take the design's 40px radius and the fourth is cut square.
 * Which one is square is positional rather than editorial — it points at the
 * middle of the grid, so the four cards form a pinwheel. Deriving it from the
 * index keeps that true when a project is added, and the logical corner
 * utilities mirror the whole arrangement in Arabic.
 */
function cornerFor(index: number) {
  const trailingColumn = index % 2 === 1
  const firstRow = Math.floor(index / 2) === 0

  if (trailingColumn) {
    return firstRow ? 'rounded-es-none' : 'rounded-ss-none'
  }
  return firstRow ? 'rounded-ee-none' : 'rounded-se-none'
}

function CardShell({
  card,
  className,
  children,
}: {
  card: ProjectCard
  className: string
  children: ReactNode
}) {
  if (!card.slug) {
    return <article className={className}>{children}</article>
  }
  return (
    <Link to={`/${card.slug}`} className={className}>
      {children}
    </Link>
  )
}

/** One project card (Figma node 869:4068). */
function Card({ card, index }: { card: ProjectCard; index: number }) {
  const { ui } = useContent()

  return (
    <CardShell
      card={card}
      className={`project-card group relative flex h-full flex-col overflow-hidden rounded-[40px] bg-bg-muted ${cornerFor(index)}`}
    >
      <div className="relative z-10 flex flex-col gap-6 px-8 pt-8">
        <div className="flex flex-col gap-4">
          <img
            src={card.logo}
            alt={card.logoAlt}
            width={card.logoWidth}
            height={card.logoHeight}
            className="block h-[60px] w-auto object-contain object-left rtl:object-right"
          />
          <h3 className="text-h4 leading-[1.14] font-bold tracking-[-0.312px]">
            {card.name}
          </h3>
        </div>

        <ul className="flex flex-wrap gap-4">
          {card.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-[10px] border border-border bg-bg px-4 py-2.5 text-h6 font-bold tracking-[-0.18px] text-accent-fg"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {/* The design's white-to-translucent panel. It sits above the preview
          image, which is what makes the image read as rising behind it. */}
      <div className="relative z-10 mx-6 mt-6 rounded-[40px] bg-gradient-to-b from-bg to-bg/80 p-6 md:mx-8">
        <p className="text-[20px] leading-[1.02] font-bold tracking-[-1.04px] text-fg-subtle">
          {ui.challenge}
        </p>
        <p className="mt-6 text-body leading-[1.6] tracking-[-0.192px]">
          {card.challenge}
        </p>

        <p className="mt-10 text-[20px] leading-[1.02] font-bold tracking-[-1.04px] text-fg-subtle">
          {ui.outcomeLabel}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {card.metrics.map((metric) => (
            <Metric key={metric.label} metric={metric} />
          ))}
        </div>
      </div>

      <img
        src={card.image}
        alt={card.imageAlt}
        width={588}
        height={235}
        loading="lazy"
        decoding="async"
        className="project-card-image mt-auto block w-full object-cover pt-6"
      />

      {/* Decorative: the whole card is already the link, so announcing this
          would name the same destination twice. It is a hover affordance. */}
      {card.slug && (
        <span
          aria-hidden="true"
          className="project-card-cta pointer-events-none absolute bottom-8 left-1/2 z-20 inline-flex h-[56px] -translate-x-1/2 items-center gap-3 rounded-pill bg-bg px-6 whitespace-nowrap text-body font-bold text-accent-fg shadow-[0_10px_30px_rgb(0_0_0/0.12)]"
        >
          {ui.fullCaseStudy}
          <img src={iconArrow} alt="" width={20} height={20} />
        </span>
      )}
    </CardShell>
  )
}

/**
 * The project grid. Two columns from `lg`, one below it. `Reveal` sits inside
 * each `<li>` rather than around it, so the list stays a list.
 */
export default function ProjectCards() {
  const { projectCards, ui } = useContent()

  return (
    <Section
      id="projects"
      labelledBy="projects-heading"
      className="scroll-mt-16"
      innerClassName="py-24 md:py-36"
    >
      <Reveal>
        <h2 id="projects-heading" className="text-h2 font-extrabold">
          {ui.projects}
        </h2>
      </Reveal>

      <ul className="mt-14 grid grid-cols-1 gap-6 md:mt-20 lg:grid-cols-2 lg:gap-8">
        {projectCards.map((card, index) => (
          <li key={card.name} className="flex">
            <Reveal delay={(index % 2) * 120} className="flex w-full">
              <Card card={card} index={index} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
