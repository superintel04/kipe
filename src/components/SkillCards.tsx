import Reveal from './Reveal'
import Section from './Section'
import {
  canvaMark,
  figmaMark,
  illustratorMark,
  skillShapes,
} from '@/content/assets'
import { useContent, type SkillCard, type SkillTone } from '@/content'

/** Reverse-face colours. Indigo and coral are literals from Figma 710:1309. */
const TONE: Record<SkillTone, string> = {
  indigo: 'text-skill-indigo',
  accent: 'text-accent-fg',
  coral: 'text-skill-coral',
  muted: 'text-fg-muted',
}

/** Figma / Illustrator / Canva, at the dimensions they were exported at. */
function ToolMarks() {
  return (
    <div aria-hidden="true">
      <div className="mt-5 flex items-center gap-5">
        <img src={figmaMark} alt="" width={25} height={37} />
        <img src={illustratorMark} alt="" width={36} height={36} />
        <img src={canvaMark} alt="" width={80} height={26} />
      </div>
      <img
        src={skillShapes}
        alt=""
        width={97}
        height={113}
        className="mt-5 block"
      />
    </div>
  )
}

/**
 * One card. The portrait panel flips on hover or focus to reveal the claim —
 * the panel only, not the whole card, so the person's name and the skill title
 * stay put beneath it and the card never changes size.
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
            {card.showTools && <ToolMarks />}
          </div>
        </div>
      </div>

      {/* Latin names stay left-to-right when the page mirrors. */}
      <p className="mt-4 text-body-sm font-medium text-neutral-400" dir="ltr">
        {card.person}
      </p>

      <p className="mt-3 text-[30px] leading-[1.375] font-bold tracking-[-0.43px] text-fg-inverse">
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
 * The strip holds the cards twice and slides exactly half its width, so the
 * loop is seamless; each pass carries its own trailing gap (`pe-6`) to keep
 * that halfway point exact. The direction flips in Arabic, where a strip
 * travelling leftwards would run against the reading direction.
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
              <Card key={card.person} card={card} />
            ))}
          </ul>
          <ul aria-hidden="true" className="flex gap-6 pe-6">
            {skillCards.map((card) => (
              <Card key={`${card.person}-copy`} card={card} duplicate />
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}
