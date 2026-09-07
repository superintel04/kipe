import { Fragment } from 'react'
import type { Segment } from '@/content'

/**
 * Renders a `Segment[]` — the content layer's way of emphasising a phrase
 * without putting markup in the copy. Keeping it in one component means
 * `accent` looks the same wherever it appears.
 */
export default function RichText({ segments }: { segments: Segment[] }) {
  return (
    <>
      {segments.map((segment, index) => {
        if (typeof segment === 'string') {
          return <Fragment key={index}>{segment}</Fragment>
        }

        if ('accent' in segment) {
          return (
            <span key={index} className="font-bold text-accent-fg">
              {segment.accent}
            </span>
          )
        }

        if ('strong' in segment) {
          return (
            <strong key={index} className="font-bold text-fg">
              {segment.strong}
            </strong>
          )
        }

        // A wash of accent sitting behind the text, rather than over it, so
        // the words keep full contrast.
        return (
          <span
            key={index}
            className="font-bold text-fg shadow-[inset_0_-0.42em_0_var(--color-accent-subtle)]"
          >
            {segment.highlight}
          </span>
        )
      })}
    </>
  )
}
