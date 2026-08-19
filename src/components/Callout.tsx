import Reveal from './Reveal'
import { callout } from '@/data/profile'

/**
 * Accent banner closing the page (Figma node 1:38).
 */
export default function Callout() {
  return (
    <Reveal className="mt-14 md:mt-20">
      <aside className="rounded-[10px] bg-accent px-6 py-4 md:px-8 md:py-5">
        <p className="text-[1.4rem] leading-[32px] font-normal text-paper">
          {callout}
        </p>
      </aside>
    </Reveal>
  )
}
