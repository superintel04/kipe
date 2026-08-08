import { Fragment } from 'react'
import { skills, type Segment } from '@/data/profile'

function renderSegment(segment: Segment, index: number) {
  if (typeof segment === 'string') {
    return <Fragment key={index}>{segment}</Fragment>
  }
  return (
    <span key={index} className="font-normal text-accent">
      {segment.accent}
    </span>
  )
}

export default function Skillset() {
  return (
    <section aria-labelledby="skillset-heading" className="pt-16 md:pt-24">
      <h2
        id="skillset-heading"
        className="text-3xl font-light text-accent md:text-4xl"
      >
        Skillset
      </h2>

      <div className="mt-8 flex flex-col gap-8 md:mt-10 md:gap-10">
        {skills.map((skill) => (
          <article key={skill.title} className="flex flex-col gap-2">
            <h3 className="text-xl font-light text-skill md:text-2xl">
              {skill.title}
            </h3>
            <p className="max-w-3xl text-[15px] leading-relaxed font-light text-ink md:text-base">
              {skill.body.map(renderSegment)}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
