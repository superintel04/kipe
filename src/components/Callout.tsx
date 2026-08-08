import { callout } from '@/data/profile'

/**
 * Accent banner closing the page (Figma node 1:38).
 */
export default function Callout() {
  return (
    <aside className="mt-14 rounded-[10px] bg-accent px-6 py-4 md:mt-20 md:px-8 md:py-5">
      <p className="text-[13px] leading-[20px] font-normal text-paper md:text-sm md:leading-[22px]">
        {callout}
      </p>
    </aside>
  )
}
