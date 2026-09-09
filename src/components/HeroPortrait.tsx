import type { CSSProperties } from 'react'
import heroPortrait from '@/assets/hero-portrait.webp'
import thumb1 from '@/assets/hero-thumb-1.webp'
import thumb2 from '@/assets/hero-thumb-2.webp'
import thumb3 from '@/assets/hero-thumb-3.webp'
import thumb4 from '@/assets/hero-thumb-4.webp'

/**
 * The four candids fan out from behind the portrait on hover. Each one is
 * parked at a corner of the panel and drifts a little further out as it
 * appears, so the set reads as a scatter rather than a grid — the positions
 * keep clear of the face, which sits upper-centre after the square crop.
 *
 * `x`/`y` are the outward drift in px, `rot` the resting tilt; both flip in
 * Arabic via `--thumb-dir` (see index.css). `delay` staggers the reveal.
 */
const THUMBS = [
  {
    src: thumb1,
    position: 'top-[5%] start-[4%]',
    x: -18,
    y: -12,
    rot: -8,
    delay: 0,
  },
  {
    src: thumb2,
    position: 'bottom-[6%] start-[9%]',
    x: -12,
    y: 16,
    rot: 6,
    delay: 70,
  },
  {
    src: thumb3,
    position: 'top-[7%] end-[5%]',
    x: 16,
    y: -14,
    rot: 9,
    delay: 140,
  },
  {
    src: thumb4,
    position: 'bottom-[5%] end-[10%]',
    x: 12,
    y: 14,
    rot: -7,
    delay: 210,
  },
]

type HeroPortraitProps = {
  alt: string
  className?: string
  /** Only the desktop panel carries the hover scatter. */
  withThumbnails?: boolean
  priority?: boolean
  imageClassName: string
}

/**
 * The hero photograph, optionally wrapped in the hover scatter. Decorative in
 * the desktop panel (the copy already names the person), so the thumbnails are
 * hidden from assistive technology either way.
 */
export default function HeroPortrait({
  alt,
  className = '',
  withThumbnails = false,
  priority = false,
  imageClassName,
}: HeroPortraitProps) {
  return (
    <div className={`hero-portrait relative ${className}`}>
      <img
        src={heroPortrait}
        alt={alt}
        width={1254}
        height={1254}
        fetchPriority={priority ? 'high' : undefined}
        className={imageClassName}
      />

      {withThumbnails &&
        THUMBS.map((thumb) => (
          <img
            key={thumb.src}
            src={thumb.src}
            alt=""
            aria-hidden="true"
            width={320}
            height={446}
            loading="lazy"
            decoding="async"
            style={
              {
                '--thumb-x': `${thumb.x}px`,
                '--thumb-y': `${thumb.y}px`,
                '--thumb-rot': `${thumb.rot}deg`,
                '--thumb-delay': `${thumb.delay}ms`,
              } as CSSProperties
            }
            className={`hero-thumb absolute w-[clamp(84px,8vw,132px)] drop-shadow-[0_18px_40px_rgb(0_0_0/0.28)] ${thumb.position}`}
          />
        ))}
    </div>
  )
}
