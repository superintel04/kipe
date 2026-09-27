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
 * One card. The portrait panel flips on hover or focus to reveal the claim —
 * the panel only, not the whole card, so the skill title stays put beneath it
 * and the card never changes size.
 *
 * The card is focusable because the flip is otherwise mouse-only. Both faces
 * stay in the accessibility tree, so a screen reader reads the portrait's
 * description and the claim together and never needs the flip at all.
 *
 * `duplicate` marks the second pass of the marquee: hidden from assistive
 * technology and out of the tab order, since it is the same card again.
 */
function Card({
  card,
  duplicate = false,
}: {
  card: SkillCard
  duplicate?: boolean
}) {
  return (
    <li
      tabIndex={duplicate ? -1 : 0}
      className="skill-card flex w-[298px] shrink-0 flex-col rounded-2xl bg-bg-inverse px-6 py-[18px]"
    >
      <div className="skill-flip h-[300px] w-[250px]">
        <div className="skill-flip-inner relative size-full">
          <img
            src={card.image}
            alt={card.imageAlt}
            width={250}
            height={300}
            loading="lazy"
            decoding="async"
            className="skill-face absolute inset-0 size-full rounded-[15px] object-cover"
          />

          <div className="skill-face skill-face-back absolute inset-0 flex flex-col justify-center overflow-hidden rounded-[15px] bg-bg p-4">
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
 * Under `prefers-reduced-motion` the animation stops and the strip becomes an
 * ordinary horizontal scroller, so every card is still reachable. Pausing on
 * hover *and* focus is what keeps this clear of WCAG 2.2.2, which wants a stop
 * mechanism for anything that moves for more than five seconds.
 */
export default function SkillCards() {
  const { skillCards, ui } = useContent()

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
      <div className="skill-marquee -mx-6 mt-12 overflow-hidden py-2 md:-mx-12 md:mt-16">
        <div className="skill-track flex w-max">
          <ul className="flex gap-6 pe-6">
            {skillCards.map((card) => (
              <Card key={card.image} card={card} />
            ))}
          </ul>
          <ul aria-hidden="true" className="flex gap-6 pe-6">
            {skillCards.map((card) => (
              <Card key={`${card.image}-copy`} card={card} duplicate />
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
