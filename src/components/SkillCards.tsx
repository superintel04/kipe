import { useRef, useState } from 'react'
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

/** Reverse-face colours. Indigo and coral are literals from Figma 710:1309. */
const TONE: Record<SkillTone, string> = {
  indigo: 'text-skill-indigo',
  accent: 'text-accent-fg',
  coral: 'text-skill-coral',
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
      className={`flex flex-col ${set === 'ai' ? 'items-center gap-4' : 'mt-5 gap-5'}`}
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
 * The × only appears below `md`. On a desktop the pointer closes the card by
 * moving away, so a permanent close affordance is clutter; the portrait
 * button doubles as the toggle for anyone on a keyboard there.
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
            // A toggle, not just an opener: above `md` the × is hidden, so
            // this is the only way a keyboard user can turn the card back.
            onClick={open ? onClose : onOpen}
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
            <button
              type="button"
              onClick={(event) => {
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
              className="absolute end-2 top-2 flex size-9 items-center justify-center rounded-full border border-border text-body leading-none text-fg-muted transition-colors hover:bg-bg-inverse hover:text-fg-inverse md:hidden"
            >
              <span aria-hidden="true">×</span>
            </button>

            {card.back.length > 0 && (
              <p className="text-[24px] leading-[1.375] font-bold tracking-[-0.43px]">
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
 * "Meet my skillset" (Figma node 710:1309) — the cards drift past in a
 * continuous marquee, pausing whenever one is hovered or focused so the flip
 * can be read.
 *
 * All eight cards are distinct. The strip still runs them twice — that second
 * pass is what makes the loop seamless, since the track slides exactly half
 * its width and lands back where it started — but it is hidden from assistive
 * technology and out of the tab order, so nothing is announced twice. Each
 * pass carries its own trailing gap (`pe-6`) to keep that halfway point exact.
 * The direction flips in Arabic, where a strip travelling leftwards would run
 * against the reading direction.
 *
 * Below `md`, and under `prefers-reduced-motion`, the animation stops and the
 * strip becomes an ordinary swipeable scroller with the duplicate pass removed
 * — a marquee that drifts out from under a thumb is no use on a phone.
 * Pausing on hover, on focus, and while a card is held open is what keeps this
 * clear of WCAG 2.2.2, which wants a stop mechanism for anything that moves
 * for more than five seconds.
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
        onPointerLeave={() => setDismissed(null)}
        className={`skill-marquee -mx-6 mt-12 py-2 md:-mx-12 md:mt-16 ${
          openCard ? 'is-paused' : ''
        } ${dismissed ? 'is-resumed' : ''}`}
      >
        <div className="skill-track flex w-max">
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
