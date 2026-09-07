import Reveal from './Reveal'
import Section from './Section'
import { useContent } from '@/content'

/**
 * Regional-experience statement, set large on the accent-subtle tint with a
 * heavy accent rule on its leading edge.
 */
export default function Callout() {
  const { callout } = useContent()

  return (
    <Section innerClassName="pb-24 md:pb-36">
      <Reveal>
        <aside className="rounded-2xl border-s-4 border-accent bg-accent-subtle px-8 py-10 md:px-14 md:py-16">
          <p className="max-w-5xl text-h3 leading-snug font-medium text-balance">
            {callout}
          </p>
        </aside>
      </Reveal>
    </Section>
  )
}
