import { useEffect, useRef } from 'react'

/**
 * The light-speed beat after the last city: streaks rushing out of the centre
 * while three phrases take turns in the middle — the craft, in order.
 *
 * A plain 2D canvas, not WebGL; it is only lines. Scroll sets the speed and
 * which phrase is showing; the canvas runs only while the section is on
 * screen, and under reduced motion it draws one still frame.
 */

const COLOURS = ['#2a65fe', '#717dff', '#ffffff', '#8fb0ff', '#6fd3ff']
const STREAKS = 420

type Streak = { x: number; y: number; z: number; pz: number; colour: string; width: number }

export default function CraftWarp({ lines }: { lines: string[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!section || !canvas || !context) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let progress = 0
    let frame = 0
    let visible = false

    const spawn = (streak: Streak, far: boolean) => {
      streak.x = (Math.random() - 0.5) * 2
      streak.y = (Math.random() - 0.5) * 2
      streak.z = far ? 1 : Math.random()
      streak.pz = streak.z
      streak.colour = COLOURS[Math.floor(Math.random() * COLOURS.length)]
      streak.width = 0.6 + Math.random() * 1.6
    }
    const streaks: Streak[] = Array.from({ length: STREAKS }, () => {
      const streak = { x: 0, y: 0, z: 0, pz: 0, colour: '', width: 1 }
      spawn(streak, false)
      return streak
    })

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = (step: number) => {
      context.fillStyle = 'rgba(0,0,0,0.38)'
      context.fillRect(0, 0, width, height)
      const scale = Math.max(width, height) * 0.5
      const cx = width / 2
      const cy = height / 2
      context.lineCap = 'round'
      for (const streak of streaks) {
        streak.pz = streak.z
        streak.z -= step
        if (streak.z <= 0.02) {
          spawn(streak, true)
          continue
        }
        const sx = cx + (streak.x / streak.z) * scale * 0.35
        const sy = cy + (streak.y / streak.z) * scale * 0.35
        const px = cx + (streak.x / streak.pz) * scale * 0.35
        const py = cy + (streak.y / streak.pz) * scale * 0.35
        const near = 1 - streak.z
        context.strokeStyle = streak.colour
        context.globalAlpha = Math.min(1, near * 1.4)
        context.lineWidth = streak.width * (0.4 + near * 1.8)
        context.beginPath()
        context.moveTo(px, py)
        context.lineTo(sx, sy)
        context.stroke()
        // A bright head on the nearer streaks.
        if (near > 0.6) {
          context.fillStyle = '#ffffff'
          context.beginPath()
          context.arc(sx, sy, context.lineWidth * 0.9, 0, Math.PI * 2)
          context.fill()
        }
      }
      context.globalAlpha = 1
    }

    const onScroll = () => {
      const rect = section.getBoundingClientRect()
      const scrollable = section.offsetHeight - window.innerHeight
      progress = Math.min(1, Math.max(0, -rect.top / Math.max(scrollable, 1)))
      // One phrase at a time; the last one stays.
      const count = lines.length
      lineRefs.current.forEach((element, index) => {
        if (!element) return
        const start = index / count
        const end = (index + 1) / count
        const fadeIn = Math.min(1, Math.max(0, (progress - start) / 0.08))
        const fadeOut =
          index === count - 1 ? 1 : Math.min(1, Math.max(0, (end - progress) / 0.08))
        const opacity = Math.min(fadeIn, fadeOut)
        element.style.opacity = String(opacity)
        element.style.transform = `scale(${0.94 + opacity * 0.06})`
      })
      if (reduced) {
        // Scrolling still advances the still frame, so the section is alive
        // without anything moving on its own.
        context.fillStyle = '#000'
        context.fillRect(0, 0, width, height)
        draw(0)
      }
    }

    const loop = () => {
      if (!visible) return
      draw(0.006 + progress * 0.02)
      frame = requestAnimationFrame(loop)
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      cancelAnimationFrame(frame)
      if (visible && !reduced) frame = requestAnimationFrame(loop)
    })
    observer.observe(section)

    resize()
    // Warm the field so the first frame already has streaks in flight.
    for (let i = 0; i < 40; i++) draw(0.01)
    onScroll()

    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [lines])

  return (
    <section ref={sectionRef} className="relative h-[300svh] bg-bg-inverse">
      <div className="sticky top-0 h-svh overflow-hidden">
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 size-full" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <h2 className="sr-only">{lines.join(' ')}</h2>
          {lines.map((line, index) => (
            <p
              key={line}
              ref={(element) => {
                lineRefs.current[index] = element
              }}
              aria-hidden="true"
              className="absolute text-center text-h2 font-bold text-fg-inverse opacity-0 [text-shadow:0_0_30px_rgba(0,0,0,0.9)]"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
