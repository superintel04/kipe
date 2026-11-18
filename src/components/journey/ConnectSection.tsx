import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import Link from '@/components/Link'
import { useContent } from '@/content'
import { createGlobe, loadLandMask, type LatLon } from '@/journey/globe'
import { trackContactClick, trackOutboundClick, trackResumeOpen } from '@/analytics'
import landMaskUrl from '@/assets/land-mask.png'

const LINKEDIN_URL = 'https://www.linkedin.com/in/ramesh-ux-designer/'
const RESUME_FILE_NAME = 'Ramesh-Panti-Lead-Product-Designer-Resume.pdf'

/**
 * The page's close: the dotted Earth again, the whole route lit, turning
 * slowly behind "Let's connect" and the three ways to get in touch.
 *
 * Its own small renderer with a transparent canvas, started only while the
 * section is on screen. Under reduced motion the globe is drawn once and
 * left still. If WebGL is unavailable the canvas simply stays empty.
 */
export default function ConnectSection({ route }: { route: LatLon[] }) {
  const { journey, closing, ui } = useContent()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    if (!section || !canvas) return

    let disposed = false
    let cleanup = () => {}

    loadLandMask(landMaskUrl)
      .then((land) => {
        if (disposed) return
        let renderer: THREE.WebGLRenderer
        try {
          renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
        } catch {
          return
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
        renderer.setClearColor(0x000000, 0)

        const scene = new THREE.Scene()
        const globe = createGlobe(land, route, { dots: 14000, dotSize: 0.02 })
        globe.group.rotation.x = 0.35
        scene.add(globe.group)
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 50)
        camera.position.set(0, 0, 4.6)

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        const born = performance.now()
        let frame = 0
        let visible = false

        const draw = () => {
          const time = reduced ? 0 : (performance.now() - born) / 1000
          globe.group.rotation.y = -0.6 + time * 0.08
          globe.update(time)
          renderer.render(scene, camera)
        }
        const loop = () => {
          if (!visible) return
          draw()
          frame = requestAnimationFrame(loop)
        }
        const resize = () => {
          const { clientWidth, clientHeight } = canvas
          renderer.setSize(clientWidth, clientHeight, false)
          camera.aspect = clientWidth / Math.max(clientHeight, 1)
          // Keep the whole globe in frame when the canvas is narrower than tall.
          camera.position.z = 4.6 / Math.min(1, camera.aspect * 1.25)
          camera.updateProjectionMatrix()
          draw()
        }

        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting
          cancelAnimationFrame(frame)
          if (visible && !reduced) frame = requestAnimationFrame(loop)
        })
        observer.observe(section)
        resize()
        window.addEventListener('resize', resize)

        cleanup = () => {
          observer.disconnect()
          cancelAnimationFrame(frame)
          window.removeEventListener('resize', resize)
          globe.dispose()
          renderer.dispose()
        }
      })
      .catch(() => {
        // No globe is fine; the copy and links carry the section.
      })

    return () => {
      disposed = true
      cleanup()
    }
  }, [route])

  const email = closing.email

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-svh flex-col overflow-hidden bg-bg-inverse text-fg-inverse"
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-x-0 top-[6svh] h-[62svh] w-full"
      />
      {/* A low horizon glow for the copy to sit on. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55svh] bg-[radial-gradient(ellipse_at_50%_120%,rgba(42,101,254,0.45),rgba(42,101,254,0)_65%)]"
      />

      <div className="relative mt-auto px-6 pb-16 text-center md:px-12 md:pb-24">
        <h2 className="text-h1 font-bold">{journey.connect.title}</h2>
        <p className="mx-auto mt-4 max-w-[34rem] text-body-lg text-fg-inverse/70">
          {journey.connect.body}
        </p>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <li>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackOutboundClick(LINKEDIN_URL, journey.connect.linkedin)}
              className="inline-flex items-center rounded-pill bg-accent px-6 py-3 text-body font-medium text-fg-on-accent transition-colors hover:bg-accent-hover"
            >
              {journey.connect.linkedin}
            </a>
          </li>
          <li>
            <a
              href={`mailto:${email}`}
              onClick={() => trackContactClick('email')}
              className="inline-flex items-center rounded-pill border border-fg-inverse/30 px-6 py-3 text-body font-medium transition-colors hover:border-fg-inverse"
            >
              {journey.connect.email}
            </a>
          </li>
          <li>
            <a
              href={`/${RESUME_FILE_NAME}`}
              target="_blank"
              rel="noreferrer noopener"
              onClick={() => trackResumeOpen(RESUME_FILE_NAME)}
              className="inline-flex items-center rounded-pill border border-fg-inverse/30 px-6 py-3 text-body font-medium transition-colors hover:border-fg-inverse"
            >
              {journey.connect.resume}
            </a>
          </li>
        </ul>

        <p className="mt-12">
          <Link
            to="/"
            className="text-body-sm text-fg-inverse/60 underline-offset-4 transition-colors hover:text-fg-inverse hover:underline"
          >
            {ui.backToProfile}
          </Link>
        </p>
      </div>
    </section>
  )
}
