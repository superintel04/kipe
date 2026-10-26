import { useCallback, useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import Section from './Section'
import {
  canvaMark,
  claudeMark,
  figmaMark,
  figmaMcpMark,
  illustratorMark,
  lovableMark,
  openaiMark,
  reactMark,
  tailwindMark,
  vercelMark,
} from '@/content/assets'
import {
  useContent,
  type SkillCard,
  type SkillTone,
  type SkillToolSet,
} from '@/content'

/**
 * 64px/s — the pace the CSS keyframe marquee ran at (one 8-card pass in 40s),
 * kept so the section's rhythm is unchanged by the rewrite.
 */
const DRIFT_SPEED = 64

/** How long the strip stays still after a drag before it picks up again. */
const RESUME_DELAY = 1800

/** Pointer travel past which a press was a drag, not a click on a card. */
const DRAG_THRESHOLD = 10

/** Positive modulo — `-5 % 100` is `-5` in JS, and we want `95`. */
function wrap(value: number, span: number) {
  return ((value % span) + span) % span
}

/**
 * Drives the strip.
 *
 * The cards used to move by animating `transform: translateX` on the track
 * inside an `overflow: hidden` box, which cannot be scrolled — a transform is
 * not a scroll position, so there was nothing for a visitor to grab. This runs
 * the same motion by writing `scrollLeft` on a real scroll container instead,
 * which costs a frame loop but means the trackpad, a drag, the scrollbar and
 * the keyboard all reach it for free.
 *
 * Looping works the same way it did: the track holds two identical passes and
 * the position wraps at half the scroll width, which is exactly one pass, so
 * the seam is invisible. The wrap runs in both directions, so dragging
 * backwards past the start continues rather than hitting a wall.
 *
 * Positions are held as a "logical" offset counting up from zero whichever way
 * the page reads — in RTL `scrollLeft` runs from `-max` to `0`, and a sign
 * flip at the boundary keeps the rest of the arithmetic identical.
 *
 * The loop runs only above `md` and only with motion allowed, matching where
 * the duplicate pass is rendered — below that the strip is left as an ordinary
 * native scroller, so a phone neither burns a frame loop nor wraps against a
 * track that is half the width the maths assumes.
 */
function useDriftingScroller(held: boolean) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  // Read inside the frame loop, so changing one never restarts the loop.
  const heldRef = useRef(held)
  const hoveredRef = useRef(false)
  const draggingRef = useRef(false)
  const resumeAtRef = useRef(0)
  const halfRef = useRef(0)
  const dragRef = useRef<{ startX: number; startAt: number } | null>(null)

  useEffect(() => {
    heldRef.current = held
  }, [held])

  // One pass is the wrap point. Remeasured on resize because the cards are a
  // fixed width but the gap and the container are not.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const measure = () => {
      halfRef.current = track.scrollWidth / 2
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const wide = window.matchMedia('(min-width: 768px)')
    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let last = 0

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick)

      const elapsed = last ? Math.min((now - last) / 1000, 0.05) : 0
      last = now

      const half = halfRef.current
      if (!half) return

      /**
       * Leave the position alone while something inside holds focus. The
       * browser scrolls a focused card into view, and wrapping underneath it
       * would scroll it straight back out.
       */
      if (viewport.contains(document.activeElement)) return

      const sign = document.documentElement.dir === 'rtl' ? -1 : 1
      let position = sign * viewport.scrollLeft

      const drifting =
        !heldRef.current &&
        !hoveredRef.current &&
        !draggingRef.current &&
        now >= resumeAtRef.current
      if (drifting) position += DRIFT_SPEED * elapsed

      if (position >= half) position -= half
      /**
       * `<= 0` rather than `< 0`: the browser clamps a native backwards scroll
       * at zero before this ever sees a negative value, so resting *at* zero is
       * what has to move. It lands a pass along, where the content is
       * identical, which hides the hop and leaves room to keep scrolling back.
       *
       * One pixel short of the pass, and a second `if` rather than an `else`,
       * so that landing exactly on the wrap point cannot bounce straight back
       * to zero — the two rules would then trade the position every frame.
       */
      if (position <= 0) position = half - 1

      const next = sign * position
      // Only write when the value actually changes — an unconditional write
      // every frame would cancel the momentum of a trackpad fling.
      if (Math.abs(next - viewport.scrollLeft) > 0.01) viewport.scrollLeft = next
    }

    const sync = () => {
      const active = wide.matches && !still.matches
      if (active && !frame) {
        last = 0
        frame = requestAnimationFrame(tick)
      } else if (!active && frame) {
        cancelAnimationFrame(frame)
        frame = 0
      }
    }

    sync()
    wide.addEventListener('change', sync)
    still.addEventListener('change', sync)
    return () => {
      wide.removeEventListener('change', sync)
      still.removeEventListener('change', sync)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  /**
   * Mouse drag. Touch is left to the browser, which already pans a scroll
   * container and does it with momentum; driving it from here as well would
   * move the strip twice per gesture.
   */
  const onPointerDown = useCallback((event: React.PointerEvent) => {
    const viewport = viewportRef.current
    if (!viewport || event.pointerType !== 'mouse' || event.button !== 0) return
    const sign = document.documentElement.dir === 'rtl' ? -1 : 1
    dragRef.current = {
      startX: event.clientX,
      startAt: sign * viewport.scrollLeft,
    }
    draggingRef.current = true
    setDragging(true)
  }, [])

  useEffect(() => {
    if (!dragging) return
    const viewport = viewportRef.current
    if (!viewport) return

    const onMove = (event: PointerEvent) => {
      const drag = dragRef.current
      const half = halfRef.current
      if (!drag || !half) return
      const sign = document.documentElement.dir === 'rtl' ? -1 : 1
      // Dragging right always reveals earlier content, whichever way the page
      // reads, so the offset is subtracted in both directions.
      const position = wrap(drag.startAt - (event.clientX - drag.startX), half)
      // Wrapped before it is assigned, so the browser is never handed a value
      // outside the scroll range and never clamps the drag to a stop.
      viewport.scrollLeft = sign * position
    }

    const onUp = () => {
      dragRef.current = null
      draggingRef.current = false
      setDragging(false)
      resumeAtRef.current = performance.now() + RESUME_DELAY
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [dragging])

  const onPointerEnter = useCallback(() => {
    hoveredRef.current = true
  }, [])

  const onPointerLeave = useCallback(() => {
    hoveredRef.current = false
  }, [])

  return {
    viewportRef,
    trackRef,
    dragging,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
  }
}

/** Reverse-face colours. Indigo and coral are literals from Figma 710:1309. */
const TONE: Record<SkillTone, string> = {
  indigo: 'text-brand-indigo',
  accent: 'text-accent-fg',
  coral: 'text-brand-coral',
  muted: 'text-fg-muted',
}

/**
 * Tool marks, at the dimensions they were exported at. Decorative: each card's
 * copy already names what the marks stand for, and the AI card is titled "AI
 * UX Engineering" on its front, so nothing here is the only route to the
 * meaning.
 */
const TOOL_SETS: Record<
  SkillToolSet,
  { src: string; width: number; height: number }[][]
> = {
  design: [
    [
      { src: figmaMark, width: 25, height: 37 },
      { src: illustratorMark, width: 36, height: 36 },
      { src: canvaMark, width: 80, height: 26 },
    ],
  ],
  ai: [
    [{ src: figmaMcpMark, width: 102, height: 102 }],
    [{ src: claudeMark, width: 131, height: 29 }],
    [{ src: openaiMark, width: 55, height: 55 }],
    [{ src: vercelMark, width: 115, height: 24 }],
    [{ src: lovableMark, width: 28, height: 28 }],
  ],
  frontend: [
    [{ src: reactMark, width: 45, height: 40 }],
    [{ src: tailwindMark, width: 120, height: 18 }],
    [{ src: lovableMark, width: 28, height: 28 }],
  ],
}

function ToolMarks({ set }: { set: SkillToolSet }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative flex flex-col md:pointer-events-auto ${set === 'ai' ? 'items-center gap-4' : 'mt-5 gap-5'}`}
    >
      {TOOL_SETS[set].map((row, index) => (
        <div key={index} className="flex items-center gap-5">
          {row.map((mark) => (
            <img
              key={mark.src}
              src={mark.src}
              alt=""
              width={mark.width}
              height={mark.height}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      ))}
    </div>
  )
}

/**
 * One card. The portrait panel flips to reveal the claim — the panel only, not
 * the whole card, so the skill title stays put beneath it and the card never
 * changes size.
 *
 * Two ways in, because hover does not exist on a phone: pointing at the card
 * flips it for as long as the pointer stays (CSS), and activating the portrait
 * holds it open (`open`). The open state is what a touch visitor gets, and it
 * is also what keeps the marquee paused.
 *
 * The × only appears below `md`, where the whole reverse is also tappable to
 * turn the card back. On a desktop the pointer closes the card by moving
 * away, so a permanent close affordance is clutter; the portrait button
 * doubles as the toggle for anyone on a keyboard there.
 *
 * Each face is a real control rather than the card being one big button: the
 * portrait opens, the × closes, and neither ends up nested inside the other.
 * Faces turned away from the viewer drop their pointer events so a click never
 * lands on the side you cannot see.
 *
 * `duplicate` marks the second pass of the marquee: hidden from assistive
 * technology and out of the tab order, since it is the same card again.
 */
function Card({
  card,
  open,
  dismissed,
  onOpen,
  onClose,
  duplicate = false,
}: {
  card: SkillCard
  open: boolean
  /** Closed by its own × and still under the pointer — see `SkillCards`. */
  dismissed: boolean
  onOpen: () => void
  onClose: () => void
  duplicate?: boolean
}) {
  const { ui } = useContent()
  const frontRef = useRef<HTMLButtonElement>(null)
  const title = card.title.join(' ')

  /**
   * Drag-versus-click. The cards sit in a horizontal scroller, so a drag that
   * starts on a card still ends in a click — the browser only suppresses that
   * reliably for vertical page scrolling, not for a scroll container being
   * pulled sideways. Anything that travelled more than a few pixels was the
   * visitor scrolling, not choosing, so it is ignored. This covers the mouse
   * now that the strip can be dragged on a desktop too, not just the thumb.
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
      className={`skill-card flex w-[298px] shrink-0 snap-start flex-col rounded-2xl bg-bg-inverse px-6 py-[18px] ${
        open ? 'is-open' : ''
      } ${dismissed ? 'is-dismissed' : ''}`}
    >
      <div className="skill-flip h-[300px] w-[250px]">
        <div className="skill-flip-inner relative size-full">
          <button
            ref={frontRef}
            type="button"
            onPointerDown={onPointerDown}
            // A toggle, not just an opener: above `md` the × is hidden, so
            // this is the only way a keyboard user can turn the card back.
            onClick={(event) => {
              if (wasDrag(event)) return
              if (open) onClose()
              else onOpen()
            }}
            aria-expanded={open}
            aria-label={ui.skillDetails(title)}
            tabIndex={duplicate ? -1 : 0}
            className="skill-face skill-face-front absolute inset-0 block size-full overflow-hidden rounded-[15px]"
          >
            <img
              src={card.image}
              alt={card.imageAlt}
              width={250}
              height={300}
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </button>

          <div className="skill-face skill-face-back absolute inset-0 flex flex-col justify-center overflow-hidden rounded-[15px] bg-bg p-4">
            {/* Below `md` the whole panel turns the card back, not just the ×.
                It sits under the copy — which drops its pointer events there
                so taps fall through — and is hidden from assistive tech,
                since the × already exposes this action. */}
            <button
              type="button"
              aria-hidden="true"
              tabIndex={-1}
              onPointerDown={onPointerDown}
              onClick={(event) => {
                if (wasDrag(event)) return
                onClose()
              }}
              className="absolute inset-0 md:hidden"
            />

            <button
              type="button"
              onPointerDown={onPointerDown}
              onClick={(event) => {
                if (wasDrag(event)) return
                onClose()
                // `detail` is 0 only when the click came from the keyboard.
                // A pointer click would otherwise leave focus sitting on this
                // button, and the strip pauses on `:focus-within`, so closing
                // with the mouse would leave the marquee stopped. From the
                // keyboard, focus moves to the portrait rather than being
                // dropped — the reverse it was on is about to turn away.
                if (event.detail > 0) event.currentTarget.blur()
                else frontRef.current?.focus()
              }}
              aria-label={ui.closeSkillDetails}
              tabIndex={duplicate || !open ? -1 : 0}
              className="absolute end-2 top-2 z-10 flex size-9 items-center justify-center rounded-full border border-border text-body leading-none text-fg-muted transition-colors hover:bg-bg-inverse hover:text-fg-inverse md:hidden"
            >
              <span aria-hidden="true">×</span>
            </button>

            {card.back.length > 0 && (
              <p className="pointer-events-none relative text-[24px] leading-[1.375] font-bold tracking-[-0.43px] md:pointer-events-auto">
                {card.back.map((line) => (
                  <span key={line.text} className={`block ${TONE[line.tone]}`}>
                    {line.spaced && (
                      <span aria-hidden="true" className="block h-[1.375em]" />
                    )}
                    {line.text}
                  </span>
                ))}
              </p>
            )}
            {card.tools && <ToolMarks set={card.tools} />}
          </div>
        </div>
      </div>

      <p className="mt-5 text-[30px] leading-[1.375] font-bold tracking-[-0.43px] text-fg-inverse">
        {card.title.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </li>
  )
}

/**
 * "Meet my skillset" (Figma node 710:1309) — the cards drift past, and can be
 * dragged or scrolled either way at any point, on a desktop as much as on a
 * phone. The drift pauses whenever a card is hovered, focused or held open so
 * the flip can be read, and picks up again a beat after a drag ends.
 *
 * All eight cards are distinct. The strip runs them twice — that second pass
 * is what makes the loop seamless, since the position wraps after exactly one
 * pass and lands on identical content — but it is hidden from assistive
 * technology and out of the tab order, so nothing is announced twice. Each
 * pass carries its own trailing gap (`pe-6`) to keep that wrap point exact.
 * `useDriftingScroller` holds the rest of the mechanics.
 *
 * Below `md`, and under `prefers-reduced-motion`, the drift stops and the
 * strip is left as an ordinary native scroller with the duplicate pass removed
 * — a row that moves out from under a thumb is no use on a phone, and the
 * wrap would be measuring against half a track.
 *
 * Pausing on hover, on focus, and while a card is held open is what keeps this
 * clear of WCAG 2.2.2, which wants a stop mechanism for anything that moves
 * for more than five seconds; being able to drag it is now a second one.
 */
export default function SkillCards() {
  const { skillCards, ui } = useContent()
  const [openCard, setOpenCard] = useState<string | null>(null)

  /**
   * The card just closed by its own ×, while the pointer is still resting on
   * it. Hover alone would immediately flip it back open and hold the marquee
   * paused, so closing would appear to do nothing. This suppresses both until
   * the pointer leaves the strip.
   */
  const [dismissed, setDismissed] = useState<string | null>(null)

  const open = (id: string) => {
    setOpenCard(id)
    // Clearing this matters: `is-dismissed` overrides the flip, so a card
    // reopened without a pointer ever leaving would stay face-up.
    setDismissed(null)
  }

  const close = (id: string) => {
    setOpenCard(null)
    setDismissed(id)
  }

  const {
    viewportRef,
    trackRef,
    dragging,
    onPointerDown,
    onPointerEnter,
    onPointerLeave,
  } = useDriftingScroller(openCard !== null)

  return (
    <Section
      labelledBy="meet-skillset-heading"
      innerClassName="pt-8 pb-24 md:pb-36"
    >
      <Reveal>
        <h2 id="meet-skillset-heading" className="text-h2 font-extrabold">
          {ui.meetSkillset}
        </h2>
      </Reveal>

      {/* Bleeds into the container's gutters so the cards run to its edges,
          rather than stopping short and looking like a stalled carousel. */}
      {/* `py-2` is headroom for the focus ring, which `overflow-hidden` would
          otherwise clip off the top and bottom of a focused card. */}
      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerEnter={onPointerEnter}
        onPointerLeave={() => {
          onPointerLeave()
          setDismissed(null)
        }}
        className={`skill-marquee -mx-6 mt-12 py-2 md:-mx-12 md:mt-16 ${
          dragging ? 'is-dragging' : ''
        }`}
      >
        <div ref={trackRef} className="skill-track flex w-max">
          <ul className="flex gap-6 pe-6">
            {skillCards.map((card) => (
              <Card
                key={card.image}
                card={card}
                open={openCard === card.image}
                dismissed={dismissed === card.image}
                onOpen={() => open(card.image)}
                onClose={() => close(card.image)}
              />
            ))}
          </ul>
          <ul aria-hidden="true" className="flex gap-6 pe-6">
            {skillCards.map((card) => (
              <Card
                key={`${card.image}-copy`}
                card={card}
                open={false}
                dismissed={false}
                onOpen={() => {}}
                onClose={() => {}}
                duplicate
              />
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
