import Counter from './Counter'
import Reveal from './Reveal'
import Section from './Section'
import { useContent } from '@/content'

/**
 * Inverted band of headline figures, each counting up on first sight.
 * Every number restates one already given elsewhere on the page.
 */
export default function Stats() {
  const { stats } = useContent()

  return (
    <Section
      className="bg-bg-inverse text-fg-inverse"
      innerClassName="py-20 md:py-28"
    >
      <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Reveal key={stat.label} delay={index * 90}>
            <dd className="text-h1 font-extrabold text-accent">
              <Counter value={stat.value} suffix={stat.suffix} />
            </dd>
            <dt className="mt-3 text-body-lg font-medium text-neutral-400">
              {stat.label}
            </dt>
          </Reveal>
        ))}
      </dl>
    </Section>
  )
}
