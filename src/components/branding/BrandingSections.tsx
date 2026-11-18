import { useId, useState } from 'react'
import Reveal from '@/components/Reveal'
import Section from '@/components/Section'
import { useContent } from '@/content'
import {
  BrandingButton,
  CheckIcon,
  Overline,
  Wordmark,
} from '@/components/branding/BrandingPrimitives'
import chevronDown from '@/assets/branding/icon-chevron-down.svg'

/** Overline, heading and lead — the head every band below the hero opens with. */
function SectionHead({
  overline,
  heading,
  lead,
  id,
}: {
  overline: string
  heading: string
  lead: string
  id: string
}) {
  return (
    <div className="flex flex-col gap-4">
      <Reveal>
        <Overline>{overline}</Overline>
      </Reveal>
      <Reveal delay={60}>
        <h2 id={id} className="max-w-[900px] text-h2 font-bold">
          {heading}
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <p className="max-w-[720px] text-body-lg leading-[1.6] text-fg-muted">
          {lead}
        </p>
      </Reveal>
    </div>
  )
}

/** "What you get" — six cards in a 3 × 2 grid (Figma 23:1393). */
export function BrandingDeliverables() {
  const { branding } = useContent()
  const { deliverables } = branding

  return (
    <Section
      labelledBy="branding-deliverables-heading"
      className="bg-bg-subtle"
      innerClassName="py-20 md:py-32"
    >
      <SectionHead
        id="branding-deliverables-heading"
        overline={deliverables.overline}
        heading={deliverables.heading}
        lead={deliverables.lead}
      />

      <ul className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
        {deliverables.cards.map((card, index) => (
          <li key={card.title} className="flex">
            <Reveal delay={(index % 3) * 80} className="flex w-full">
              <article className="flex w-full flex-col gap-3 rounded-[8px] border border-border bg-bg p-6">
                <h3 className="text-h4 font-bold tracking-[-0.012em]">
                  {card.title}
                </h3>
                <p className="text-body-sm leading-[1.6] text-fg-muted">
                  {card.body}
                </p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Pricing (Figma 23:1432). The recommended tier is the only accented card. */
export function BrandingPackages() {
  const { branding } = useContent()
  const { packages } = branding

  return (
    <Section
      id="packages"
      labelledBy="branding-packages-heading"
      className="scroll-mt-20 bg-bg-subtle"
      innerClassName="pt-20 pb-20 md:pt-32 md:pb-32"
    >
      <SectionHead
        id="branding-packages-heading"
        overline={packages.overline}
        heading={packages.heading}
        lead={packages.lead}
      />

      <ul className="mt-12 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-2">
        {packages.tiers.map((tier, index) => (
          <li key={tier.name} className="flex">
            <Reveal delay={index * 100} className="flex w-full">
              <article
                className={`flex w-full flex-col gap-5 rounded-[12px] bg-bg p-8 ${
                  tier.badge
                    ? 'border-2 border-accent'
                    : 'border border-border'
                }`}
              >
                {tier.badge && (
                  <p className="inline-flex w-fit items-center rounded-[3px] bg-accent-solid px-2 py-1 text-overline font-bold tracking-[0.04em] text-fg-on-accent uppercase">
                    {tier.badge}
                  </p>
                )}

                <div className="flex flex-col gap-2">
                  <h3 className="text-h5 font-bold text-fg-muted">
                    {tier.name}
                  </h3>
                  <p className="text-h2 font-bold">{tier.price}</p>
                  <p className="text-body-sm leading-[1.6] text-fg-subtle">
                    {tier.bestFor}
                  </p>
                </div>

                <div aria-hidden="true" className="h-px w-full bg-border-subtle" />

                <ul className="flex flex-col gap-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckIcon className="mt-1 size-4" />
                      <span className="min-w-px flex-1 text-body-sm leading-[1.6] text-fg-muted">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <BrandingButton
                  href={branding.bookingUrl}
                  variant={tier.badge ? 'solid' : 'outline'}
                  className="mt-auto w-full"
                >
                  {tier.cta}
                </BrandingButton>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal>
        <div className="mt-12 flex flex-col gap-6 text-body-sm leading-[1.6] md:flex-row md:items-center md:justify-between">
          <p className="max-w-[560px] text-fg-muted">{packages.anchor}</p>
          <p className="max-w-[400px] text-fg-subtle">{packages.availability}</p>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <p className="mt-10 flex items-center gap-4 rounded-[12px] border border-accent-border bg-accent-subtle px-6 py-6 text-body leading-[1.6] md:px-8">
          <CheckIcon className="size-5" />
          <span className="min-w-px flex-1">{packages.guarantee}</span>
        </p>
      </Reveal>
    </Section>
  )
}

/**
 * One FAQ row. A real `<button>` with `aria-expanded` controlling the answer,
 * rather than a `<details>`: the design animates the panel open and styles the
 * chevron, both of which fight `<details>`' built-in toggling.
 */
function FaqRow({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <div data-open={open} className="faq-row border-b border-border-subtle">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-4 py-5 text-start text-h5 font-bold"
        >
          <span className="min-w-px flex-1">{question}</span>
          <img
            src={chevronDown}
            alt=""
            aria-hidden="true"
            width={24}
            height={24}
            className="faq-chevron size-5 shrink-0"
          />
        </button>
      </h3>
      {/* `inert` rather than `hidden`: the panel animates on grid-template-rows,
          which needs the element to stay displayed. `inert` takes it out of the
          accessibility tree and the tab order while it is closed, so a screen
          reader does not read six answers that are not on screen. */}
      <div id={panelId} className="faq-answer" inert={!open}>
        <div>
          <p className="max-w-[560px] pb-5 text-body leading-[1.6] text-fg-muted">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

/** FAQ (Figma 23:1466): the intro on the left, the accordion on the right. */
export function BrandingFaq() {
  const { branding } = useContent()
  const { faq } = branding

  return (
    <Section
      id="faq"
      labelledBy="branding-faq-heading"
      className="scroll-mt-20"
      innerClassName="py-20 md:py-32"
    >
      <div className="flex flex-col gap-12 lg:flex-row lg:gap-20">
        <div className="flex flex-col gap-4 lg:w-[400px] lg:shrink-0">
          <Reveal>
            <Overline>{faq.overline}</Overline>
          </Reveal>
          <Reveal delay={60}>
            <h2 id="branding-faq-heading" className="text-h2 font-bold">
              {faq.heading}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="text-body leading-[1.6] text-fg-muted">{faq.lead}</p>
          </Reveal>
        </div>

        <div className="min-w-px flex-1">
          {faq.items.map((item) => (
            <FaqRow
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}

/** The closing band (Figma 23:1485), pinned to the dark mode as designed. */
export function BrandingFinalCta() {
  const { branding } = useContent()
  const { finalCta } = branding

  return (
    <Section innerClassName="pb-20 md:pb-32">
      <Reveal>
        <div className="flex flex-col items-center justify-center gap-8 rounded-[12px] bg-bg-inverse px-8 py-16 text-center md:px-16 md:py-20">
          <h2 className="text-h1 font-extrabold text-fg-inverse">
            {finalCta.heading}
          </h2>
          <p className="max-w-[640px] text-body leading-[1.6] text-neutral-400">
            {finalCta.body}
          </p>
          <BrandingButton href={branding.bookingUrl} variant="inverse">
            {finalCta.cta}
          </BrandingButton>
        </div>
      </Reveal>
    </Section>
  )
}

/** The footer (Figma 23:1486). */
export function BrandingFooter() {
  const { branding } = useContent()
  const { footer } = branding

  return (
    <Section className="border-t border-border-subtle" innerClassName="pt-16 pb-16">
      <div className="flex flex-col gap-12 md:flex-row md:justify-between md:gap-20">
        <div className="flex flex-col gap-3 md:w-[400px]">
          <Wordmark {...footer.wordmark} />
          <p className="text-body-sm leading-[1.6] text-fg-muted">
            {footer.blurb}
          </p>
        </div>

        <div className="flex flex-wrap gap-12 md:gap-20">
          {footer.columns.map((column) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              className="flex flex-col gap-3 md:w-[180px]"
            >
              <p className="text-overline font-bold tracking-[0.14em] text-fg-subtle uppercase">
                {column.heading}
              </p>
              {column.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  {...(link.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer noopener' }
                    : {})}
                  className="text-body font-medium text-fg-muted transition-colors hover:text-fg"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          ))}
        </div>
      </div>

      <div aria-hidden="true" className="mt-16 h-px w-full bg-border-subtle" />

      <div className="mt-8 flex flex-col gap-2 text-caption leading-[1.35] text-fg-subtle md:flex-row md:items-center md:justify-between">
        <p>{footer.copyright}</p>
        <p>{footer.note}</p>
      </div>
    </Section>
  )
}
