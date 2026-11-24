import { useDriftingScroller } from './useDriftingScroller'
import type {
  CaseStudySlide,
  CaseStudyStat,
  CaseStudyVisual as Visual,
} from '@/content'

/**
 * The designed block beneath a phase's copy (Figma 1206:1419).
 *
 * Three kinds, chosen by the phase rather than inferred: a stats row, a
 * technology stack over a device mockup, or an auto-scrolling carousel. Each
 * is separated from the copy above by a hairline, so the card still reads as
 * one card rather than two stacked panels.
 */
export default function CaseStudyVisual({ visual }: { visual: Visual }) {
  return (
    <div className="mt-10 border-t border-border-subtle pt-10 md:mt-12 md:pt-12">
      {visual.kind === 'stats' && <Stats visual={visual} />}
      {visual.kind === 'stack' && <Stack visual={visual} />}
      {visual.kind === 'carousel' && <Carousel slides={visual.slides} />}
    </div>
  )
}

/** One figure and its caption. The figure is the point, so it leads. */
function Stat({ stat }: { stat: CaseStudyStat }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-h2 leading-none font-bold tracking-[-0.025em]">
        {stat.figure}
      </p>
      {/* The caption may carry an authored line break, as "Devise platform /
          Web & Mobile app" does in the design. */}
      <p className="text-h5 font-bold whitespace-pre-line">{stat.caption}</p>
    </div>
  )
}

function Stats({ visual }: { visual: Extract<Visual, { kind: 'stats' }> }) {
  return (
    <div className="flex flex-wrap items-start gap-x-14 gap-y-10 md:gap-x-20">
      {visual.mark && (
        <div className="flex flex-col gap-2">
          <img
            src={visual.mark.src}
            alt={visual.mark.alt}
            className="h-[52px] w-auto object-contain object-left rtl:object-right"
          />
          <p className="text-h5 font-bold">{visual.mark.caption}</p>
        </div>
      )}
      {visual.stats.map((stat) => (
        <Stat key={stat.caption} stat={stat} />
      ))}
    </div>
  )
}

/**
 * The technology marks over the device mockup. The marks are decorative —
 * the phase's bullets already name SharePoint and the front-end stack — so
 * the mockup carries the only alternative text in the block.
 */
function Stack({ visual }: { visual: Extract<Visual, { kind: 'stack' }> }) {
  return (
    <div className="flex flex-col gap-10">
      {visual.marks.length > 0 && (
        <ul className="flex flex-wrap items-center gap-8">
          {visual.marks.map((mark) => (
            <li key={mark.src}>
              <img
                src={mark.src}
                alt=""
                aria-hidden="true"
                className="h-12 w-auto object-contain"
              />
            </li>
          ))}
        </ul>
      )}
      <img
        src={visual.image}
        alt={visual.imageAlt}
        loading="lazy"
        decoding="async"
        className="block w-full"
      />
    </div>
  )
}

/** One slide: the art, then its category, name and variant line. */
function Slide({
  slide,
  duplicate = false,
}: {
  slide: CaseStudySlide
  duplicate?: boolean
}) {
  return (
    <li
      {...(duplicate ? { 'aria-hidden': true } : {})}
      className="flex w-[260px] shrink-0 flex-col gap-4 md:w-[320px]"
    >
      <div className="flex h-[200px] items-center justify-center overflow-hidden rounded-md border border-border-subtle bg-bg-subtle p-5 md:h-[220px]">
        <img
          src={slide.image}
          alt={duplicate ? '' : slide.imageAlt}
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        {slide.category && (
          <p className="text-overline font-bold tracking-[0.14em] text-fg-subtle uppercase">
            {slide.category}
          </p>
        )}
        <p className="text-h5 font-bold">{slide.name}</p>
        {slide.meta && (
          <p className="text-body-sm leading-[1.6] text-fg-muted">
            {slide.meta}
          </p>
        )}
      </div>
    </li>
  )
}

/**
 * An auto-scrolling rail, on the same mechanism as the skillset marquee:
 * `scrollLeft` driven by a frame loop on a real scroll container, so the
 * trackpad, a drag and the keyboard all reach it. The slides run twice and
 * the position wraps after one pass, which is what makes the loop seamless —
 * the second pass is hidden from assistive technology.
 */
function Carousel({ slides }: { slides: CaseStudySlide[] }) {
  const { viewportRef, trackRef, dragging, onPointerDown, onPointerEnter, onPointerLeave } =
    useDriftingScroller(false)

  return (
    <div
      ref={viewportRef}
      onPointerDown={onPointerDown}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className={`skill-marquee -mx-7 px-7 md:-mx-12 md:px-12 ${
        dragging ? 'is-dragging' : ''
      }`}
    >
      <div ref={trackRef} className="skill-track flex w-max">
        <ul className="flex gap-6 pe-6">
          {slides.map((slide) => (
            <Slide key={slide.name} slide={slide} />
          ))}
        </ul>
        <ul aria-hidden="true" className="flex gap-6 pe-6">
          {slides.map((slide) => (
            <Slide key={`${slide.name}-copy`} slide={slide} duplicate />
          ))}
        </ul>
      </div>
    </div>
  )
}
