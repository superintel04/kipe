import { useEffect, useRef } from 'react'
import type { CaseStudyPage } from '@/content'

/**
 * Full-bleed hero: the building photograph under a scrim, the client mark,
 * the project name at display scale, and a scroll cue.
 *
 * The pointer parallax writes CSS custom properties straight onto the DOM
 * rather than through React state, so moving the mouse never re-renders the
 * page. Layers move by different amounts — image least, title most — which is
 * what sells the depth.
 */
export default function CaseStudyHero({ page }: { page: CaseStudyPage }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const hero = ref.current
    if (!hero) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return
      const rect = hero.getBoundingClientRect()
      if (rect.bottom < 0 || rect.top > window.innerHeight) return
      hero.style.setProperty(
        '--px',
        ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3),
      )
      hero.style.setProperty(
        '--py',
        (
          ((event.clientY - rect.top) / Math.max(1, rect.height)) * 2 -
          1
        ).toFixed(3),
      )
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section
      ref={ref}
      className="relative isolate h-[560px] overflow-hidden bg-[#05070a] md:h-[810px]"
    >
      <img
        src={page.heroImage}
        alt={page.heroAlt}
        className="hero-img absolute -inset-[3%] h-[106%] w-[106%] object-cover"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.72)_0%,rgba(0,0,0,.15)_32%,rgba(0,0,0,.55)_68%,rgba(0,0,0,.93)_100%)]" />

      <div className="relative mx-auto flex h-full max-w-[92rem] flex-col justify-between px-6 pt-14 pb-16 text-white md:px-12">
        {page.heroLogo ? (
          <img
            src={page.heroLogo}
            alt={page.logoAlt ?? ''}
            className="hero-layer-1 rise rise-1 block h-auto w-[150px] md:w-[190px]"
          />
        ) : (
          <span />
        )}

        <div className="hero-layer-2">
          <p className="rise rise-2 text-overline font-medium tracking-[0.14em] text-white/70 uppercase">
            {page.heroEyebrow}
          </p>

          <h1 className="rise rise-3 mt-6 flex items-end gap-3.5">
            <span className="text-[clamp(72px,11.7vw,168px)] leading-[0.86] font-extrabold tracking-[-0.045em]">
              {page.name}
            </span>
            <span
              aria-hidden="true"
              className="mb-[clamp(4px,1vw,14px)] block size-[clamp(16px,2.8vw,40px)] shrink-0 rounded-full bg-accent"
            />
          </h1>

          <p className="rise rise-4 mt-6 max-w-[780px] text-h3 leading-[1.14] font-bold tracking-[-0.025em] text-white/85">
            {page.heroSubtitle}
          </p>

          <div className="rise rise-4 mt-10 flex items-center gap-3">
            <span className="scroll-sweep relative block h-px w-14 overflow-hidden bg-white/45" />
            <span className="text-overline tracking-[0.22em] text-white/70">
              {page.scrollCue}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
