import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Lightbox from './Lightbox'
import { DRAG_THRESHOLD, useDriftingScroller } from './useDriftingScroller'
import {
  useContent,
  type CaseStudyCard,
  type CaseStudySlide,
  type CaseStudyStat,
  type CaseStudyVisual as Visual,
} from '@/content'

/**
 * The designed block beneath a phase's copy (Figma 1206:1419 for Dewane,
 * 46:1332 for Beyond Business).
 *
 * Five kinds, chosen by the phase rather than inferred from the data. Each is
 * separated from the copy above by a hairline, so the card still reads as one
 * card rather than two stacked panels.
 */
export default function CaseStudyVisual({ visual }: { visual: Visual }) {
  return (
    <div className="mt-10 border-t border-border-subtle pt-10 md:mt-12 md:pt-12">
      {visual.kind === 'stats' && <Stats visual={visual} />}
      {visual.kind === 'stack' && <Stack visual={visual} />}
      {visual.kind === 'carousel' && <Carousel slides={visual.slides} />}
      {visual.kind === 'figure' && <Figure visual={visual} />}
      {visual.kind === 'cards' && <Cards visual={visual} />}
    </div>
  )
}

/** What the lightbox is showing, if anything. */
type Enlarged = { src: string; alt: string } | null

/**
 * The enlarge overlay, shared by the carousel and the single figure.
 *
 * It is portalled to the body rather than rendered in place: the phase card
 * around these blocks is translated a few pixels and clips its overflow, and
 * a transformed ancestor is what `position: fixed` resolves against — left
 * here the overlay would be cropped to the card instead of covering the page.
 *
 * Esc and the scroll lock live here too. The case-study dialog does both for
 * its own lightbox, but these blocks also run on the standalone case-study
 * page, where there is no dialog above them.
 */
function useEnlarge() {
  const { ui } = useContent()
  const [enlarged, setEnlarged] = useState<Enlarged>(null)

  useEffect(() => {
    if (!enlarged) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setEnlarged(null)
    }
    document.addEventListener('keydown', onKeyDown)

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previous
    }
  }, [enlarged])

  const overlay =
    enlarged &&
    createPortal(
      <Lightbox
        src={enlarged.src}
        alt={enlarged.alt}
        closeLabel={ui.closeImage}
        onClose={() => setEnlarged(null)}
      />,
      document.body,
    )

  return { enlarged, setEnlarged, overlay }
}

/**
 * One wide image worth looking at closely — the Beyond Business sitemap runs
 * 1054px across in the design and is unreadable at a column's width, so the
 * whole thing is a zoom control.
 */
function Figure({ visual }: { visual: Extract<Visual, { kind: 'figure' }> }) {
  const { ui } = useContent()
  const { setEnlarged, overlay } = useEnlarge()

  return (
    <figure className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() =>
          setEnlarged({ src: visual.image, alt: visual.imageAlt })
        }
        aria-label={ui.enlargeScreen(visual.imageAlt)}
        className="block cursor-zoom-in overflow-hidden rounded-md border border-border-subtle bg-bg-subtle transition-colors hover:border-fg-muted"
      >
        <img
          src={visual.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="block w-full"
        />
      </button>
      {visual.caption && (
        <figcaption className="text-body-sm leading-[1.6] text-fg-muted">
          {visual.caption}
        </figcaption>
      )}
      {overlay}
    </figure>
  )
}

/**
 * A grid of findings. Illustrated cards go three up, because the drawing
 * needs the width; written ones go two up, because a column of prose that
 * narrow is harder to read than it is compact.
 */
function Cards({ visual }: { visual: Extract<Visual, { kind: 'cards' }> }) {
  const illustrated = visual.cards.some((card) => card.image)

  return (
    <div className="flex flex-col gap-8">
      {visual.intro && (
        <p className="max-w-[60ch] text-body leading-[1.7] text-fg-muted">
          {visual.intro}
        </p>
      )}
      <ul
        className={`grid gap-6 md:grid-cols-2 ${
          illustrated ? 'xl:grid-cols-3' : ''
        }`}
      >
        {visual.cards.map((card) => (
          <Card key={card.title} card={card} />
        ))}
      </ul>
    </div>
  )
}

function Card({ card }: { card: CaseStudyCard }) {
  return (
    <li className="flex flex-col gap-4 rounded-md border border-border-subtle bg-bg-subtle p-6 md:p-7">
      {card.image && (
        <img
          src={card.image}
          alt={card.imageAlt ?? ''}
          loading="lazy"
          decoding="async"
          className="h-[140px] w-full object-contain object-left rtl:object-right"
        />
      )}
      <div className="flex flex-col gap-2">
        <h4 className="text-h5 font-bold">{card.title}</h4>
        <p className="text-body-sm leading-[1.7] text-fg-muted">{card.body}</p>
      </div>
    </li>
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

/**
 * One slide: the art, then its category, name and variant line.
 *
 * The art is a button, because the rail shows every screen shrunk into a
 * 220px box — too small to read — and activating it opens the full image.
 * The second, duplicated pass is still clickable (it is the same picture, on
 * screen, and a visitor cannot tell which pass they are looking at) but stays
 * out of the tab order and hidden from assistive technology.
 */
function Slide({
  slide,
  onOpen,
  duplicate = false,
}: {
  slide: CaseStudySlide
  onOpen: () => void
  duplicate?: boolean
}) {
  const { ui } = useContent()

  /**
   * Drag-versus-click, as on the skill cards: the rail is a scroll container
   * being pulled sideways, which the browser does not suppress the trailing
   * click for. Anything that travelled more than a few pixels was a scroll.
   */
  const pressedAt = useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = (event: React.PointerEvent) => {
    pressedAt.current = { x: event.clientX, y: event.clientY }
  }

  const wasDrag = (event: React.MouseEvent) => {
    const start = pressedAt.current
    pressedAt.current = null
    // `detail` is 0 for keyboard activation, which has no travel to measure.
    if (!start || event.detail === 0) return false
    return (
      Math.hypot(event.clientX - start.x, event.clientY - start.y) >
      DRAG_THRESHOLD
    )
  }

  return (
    <li
      {...(duplicate ? { 'aria-hidden': true } : {})}
      className="flex w-[260px] shrink-0 flex-col gap-4 md:w-[320px]"
    >
      <button
        type="button"
        onPointerDown={onPointerDown}
        onClick={(event) => {
          if (wasDrag(event)) return
          onOpen()
        }}
        aria-label={ui.enlargeScreen(slide.name)}
        tabIndex={duplicate ? -1 : 0}
        className="flex h-[200px] cursor-zoom-in items-center justify-center overflow-hidden rounded-md border border-border-subtle bg-bg-subtle p-5 transition-colors hover:border-fg-muted md:h-[220px]"
      >
        <img
          src={slide.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="max-h-full max-w-full object-contain"
        />
      </button>
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
  const { enlarged, setEnlarged, overlay } = useEnlarge()
  // The drift would otherwise carry on behind the overlay, so the rail would
  // be somewhere else when it closes.
  const {
    viewportRef,
    trackRef,
    dragging,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
  } = useDriftingScroller(enlarged !== null)

  const open = (slide: CaseStudySlide) =>
    setEnlarged({ src: slide.image, alt: slide.imageAlt })

  return (
    <>
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
              <Slide key={slide.name} slide={slide} onOpen={() => open(slide)} />
            ))}
          </ul>
          <ul aria-hidden="true" className="flex gap-6 pe-6">
            {slides.map((slide) => (
              <Slide
                key={`${slide.name}-copy`}
                slide={slide}
                onOpen={() => open(slide)}
                duplicate
              />
            ))}
          </ul>
        </div>
      </div>

      {overlay}
    </>
  )
}
