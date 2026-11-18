import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from '@/components/Link'
import Logo from '@/components/Logo'
import JourneyLoader from '@/components/journey/JourneyLoader'
import StopCard from '@/components/journey/StopCard'
import CraftWarp from '@/components/journey/CraftWarp'
import ConnectSection from '@/components/journey/ConnectSection'
import { useContent, type JourneyCity } from '@/content'
import { loadLandMask, type LatLon } from '@/journey/globe'
import { JourneyScene } from '@/journey/JourneyScene'
import { overlays, segmentStart, TOTAL_UNITS } from '@/journey/timeline'
import { trackResumeOpen } from '@/analytics'
import landMaskUrl from '@/assets/land-mask.png'

/** Where each scene sits on the globe. Geography, so not in the locale bundles. */
const GEO: Record<JourneyCity, LatLon> = {
  hyderabad: { lat: 17.385, lon: 78.4867 },
  'new-york': { lat: 40.7128, lon: -74.006 },
  doha: { lat: 25.2854, lon: 51.531 },
  riyadh: { lat: 24.7136, lon: 46.6753 },
}

/** Scroll per timeline unit, as a fraction of the viewport height. */
const UNIT_SVH = 72
const INTRO_KEY = 'kipe:journey-intro'
const RESUME_FILE_NAME = 'Ramesh-Panti-Lead-Product-Designer-Resume.pdf'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** The intro plays once per session, and never under reduced motion. */
function shouldShowIntro() {
  if (prefersReducedMotion()) return false
  try {
    return sessionStorage.getItem(INTRO_KEY) !== 'seen'
  } catch {
    return true
  }
}

/**
 * `/journey` — the career as a flight. A dotted globe with the route drawn
 * across it; the camera dives into Hyderabad, and from there a plane flies
 * runway to runway — New York, Doha, Riyadh — with each city's card rising
 * as it lands. Then a light-speed run through the craft, and a way to get in
 * touch.
 *
 * The flight section is one tall block with a sticky viewport inside it.
 * Scroll through the block is a single progress value, handed to the WebGL
 * scene and to `overlays()` for the DOM layered over it; see
 * `journey/timeline.ts` for the beats. Overlay styles are written straight to
 * their elements from the scroll handler, so React only re-renders when the
 * active city changes.
 */
export default function JourneyPage() {
  const { journey, profile } = useContent()
  const stops = journey.stops

  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const darkRef = useRef<HTMLDivElement>(null)
  const railRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<JourneyScene | null>(null)

  const [showIntro, setShowIntro] = useState(shouldShowIntro)
  const [ready, setReady] = useState(false)
  const [webgl, setWebgl] = useState(true)
  const [activeStop, setActiveStop] = useState(-1)

  const route = useMemo(() => stops.map((stop) => GEO[stop.scene]), [stops])

  // ---- Scroll → progress → scene and overlays ---------------------------------
  const sync = useCallback(() => {
    const section = sectionRef.current
    if (!section) return
    const rect = section.getBoundingClientRect()
    const scrollable = section.offsetHeight - window.innerHeight
    const p = Math.min(1, Math.max(0, -rect.top / Math.max(scrollable, 1)))

    sceneRef.current?.setProgress(p)
    const o = overlays(p)
    if (heroRef.current) {
      heroRef.current.style.opacity = String(o.hero)
      heroRef.current.style.transform = `translateY(${(1 - o.hero) * -24}px)`
      heroRef.current.style.visibility = o.hero > 0.01 ? 'visible' : 'hidden'
    }
    if (flashRef.current) flashRef.current.style.opacity = String(o.flash)
    if (darkRef.current) darkRef.current.style.opacity = String(o.dark)
    if (railRef.current) {
      railRef.current.dataset.visible = String(o.showRoute)
      railRef.current.style.setProperty('--route', String(o.route / (stops.length - 1)))
    }
    setActiveStop((current) => (current === o.activeStop ? current : o.activeStop))
  }, [stops.length])

  // ---- Build the scene ----------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let disposed = false
    let scene: JourneyScene | null = null
    let observer: IntersectionObserver | null = null

    const resize = () => {
      scene?.resize(canvas.clientWidth, canvas.clientHeight)
      sync()
    }

    loadLandMask(landMaskUrl)
      .then((land) => {
        if (disposed) return
        try {
          scene = new JourneyScene(
            canvas,
            stops.map((stop) => ({ ...GEO[stop.scene], city: stop.scene })),
            land,
            { animate: !prefersReducedMotion() },
          )
        } catch {
          setWebgl(false)
          setReady(true)
          return
        }
        sceneRef.current = scene
        resize()
        // Only spend frames while the flight is on screen.
        observer = new IntersectionObserver(([entry]) => {
          if (entry.isIntersecting) scene?.start()
          else scene?.stop()
        })
        if (sectionRef.current) observer.observe(sectionRef.current)
        setReady(true)
      })
      .catch(() => {
        setWebgl(false)
        setReady(true)
      })

    window.addEventListener('resize', resize)
    return () => {
      disposed = true
      window.removeEventListener('resize', resize)
      observer?.disconnect()
      scene?.dispose()
      sceneRef.current = null
    }
  }, [stops, sync])

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        sync()
      })
    }
    sync()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [sync])

  // Hold the page still under the intro.
  useEffect(() => {
    if (!showIntro) return
    const root = document.documentElement
    const previous = root.style.overflow
    root.style.overflow = 'hidden'
    return () => {
      root.style.overflow = previous
    }
  }, [showIntro])

  // A fresh visit starts at the top, with the globe.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_KEY, 'seen')
    } catch {
      // Not remembering is fine — it will just play again.
    }
    setShowIntro(false)
    sceneRef.current?.playIntro()
  }, [])

  /** Rail buttons jump to the moment the plane is parked in that city. */
  const flyTo = (index: number) => {
    const section = sectionRef.current
    if (!section) return
    const start = segmentStart((s) => s.kind === 'hold' && s.stop === index)
    const scrollable = section.offsetHeight - window.innerHeight
    const top = section.offsetTop + (start + 0.35 / TOTAL_UNITS) * scrollable
    window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }

  // ---- Without WebGL: the same stops as a plain list -----------------------------
  if (!webgl) {
    return (
      <>
        <JourneyHeader name={profile.name} />
        <main className="bg-bg-subtle px-6 pt-28 pb-24 md:px-12">
          <div className="mx-auto max-w-[40rem]">
            <p className="text-body-sm text-fg-subtle">{journey.fallbackNote}</p>
            <h1 className="mt-6 text-h2 font-bold">{journey.heroTitle.join(' ')}</h1>
            <ol className="mt-10 flex flex-col gap-6">
              {stops.map((stop) => (
                <li key={stop.scene}>
                  <StopCard stop={stop} active isStatic />
                </li>
              ))}
            </ol>
          </div>
        </main>
        <ConnectSection route={route} />
      </>
    )
  }

  return (
    <>
      {showIntro && (
        <JourneyLoader
          ready={ready}
          label={journey.loading}
          skipLabel={journey.skipIntro}
          onDone={finishIntro}
        />
      )}

      <JourneyHeader name={profile.name} />

      <main>
        <section
          ref={sectionRef}
          className="relative bg-bg-inverse"
          style={{ height: `${TOTAL_UNITS * UNIT_SVH}svh` }}
        >
          <div className="sticky top-0 h-svh overflow-hidden">
            <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />

            <div ref={flashRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-bg opacity-0" />
            <div ref={darkRef} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-bg-inverse opacity-0" />

            {/* Hero copy over the globe. */}
            <div
              ref={heroRef}
              className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-12 text-fg-inverse md:inset-y-0 md:end-auto md:flex md:w-[46%] md:flex-col md:justify-center md:ps-12 md:pb-0"
            >
              <p className="font-mono text-overline tracking-[0.14em] text-fg-inverse/60 uppercase">
                {journey.heroEyebrow}
              </p>
              <h1 className="mt-4 text-display-2 font-bold">
                {journey.heroTitle.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </h1>
              <p className="mt-6 max-w-[28rem] text-body-lg text-fg-inverse/75">{journey.heroBody}</p>
              <p className="journey-cue mt-10 flex items-center gap-3 text-body-sm text-fg-inverse/60">
                <span aria-hidden="true" className="journey-cue-line block h-8 w-px bg-fg-inverse/40" />
                {journey.scrollCue}
              </p>
            </div>

            {/* Route rail: where the plane is, and a way to jump between cities. */}
            <nav
              ref={railRef}
              aria-label={journey.routeLabel}
              data-visible="false"
              className="journey-rail absolute inset-x-0 top-20 flex justify-center px-6 md:top-6"
            >
              <div className="relative w-full max-w-[26rem]">
                <div aria-hidden="true" className="absolute inset-x-4 top-[0.6rem] h-px bg-fg/15">
                  <div className="journey-rail-fill h-px bg-accent" />
                  <svg
                    viewBox="0 0 24 24"
                    className="journey-rail-plane absolute top-1/2 size-5 text-accent"
                    fill="currentColor"
                  >
                    <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
                  </svg>
                </div>
                <ol className="relative flex justify-between">
                  {stops.map((stop, index) => (
                    <li key={stop.scene}>
                      <button
                        type="button"
                        onClick={() => flyTo(index)}
                        aria-label={journey.flyTo(stop.city)}
                        aria-current={activeStop === index ? 'location' : undefined}
                        className={`flex flex-col items-center gap-1.5 font-mono text-overline tracking-[0.12em] transition-colors ${
                          activeStop === index ? 'text-fg' : 'text-fg-subtle hover:text-fg'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-2.5 rounded-pill border-2 bg-bg ${
                            activeStop === index ? 'border-accent bg-accent' : 'border-fg-subtle'
                          }`}
                        />
                        <span dir="ltr">{stop.code}</span>
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            {stops.map((stop, index) => (
              <StopCard key={stop.scene} stop={stop} active={activeStop === index} />
            ))}
          </div>
        </section>

        <CraftWarp lines={journey.craft} />
        <ConnectSection route={route} />
      </main>
    </>
  )
}

/**
 * Name home on the leading side, resume on the trailing one. Set in white with
 * `mix-blend-difference`, so it reads over the dark globe and the daylight
 * cities alike without having to track which one is behind it.
 */
function JourneyHeader({ name }: { name: string }) {
  const { ui } = useContent()
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 text-fg-inverse mix-blend-difference md:px-12">
      <Link to="/" className="pointer-events-auto flex items-center gap-2.5 text-body font-semibold">
        <Logo className="size-5" />
        {name}
      </Link>
      <a
        href={`/${RESUME_FILE_NAME}`}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => trackResumeOpen(RESUME_FILE_NAME)}
        className="pointer-events-auto text-body-sm opacity-80 transition-opacity hover:opacity-100"
      >
        {ui.nav.resume}
      </a>
    </header>
  )
}
