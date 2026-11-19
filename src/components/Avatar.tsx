import { useState } from 'react'

type AvatarProps = {
  /** Resolved URL for the portrait — pass a Vite asset import. */
  src: string
  alt: string
  /** Rendered inside the circle when the image is missing or fails to load. */
  initials: string
  /**
   * `card` is the profile's rounded rectangle; `circle` is the branding
   * studio's LinkedIn-style disc. A prop rather than a `className` override
   * because two radius utilities on one element resolve by stylesheet order,
   * not by the order they are written in.
   */
  shape?: 'card' | 'circle'
  /** Sized by the caller; `initialsClassName` scales the fallback to match. */
  className?: string
  initialsClassName?: string
}

/**
 * Portrait — a rounded rectangle, matching the 114 × 137.8 frame with a 20px
 * radius in the design (Figma node 11:216), or a disc. Falls back to initials
 * rather than showing a broken image.
 */
export default function Avatar({
  src,
  alt,
  initials,
  shape = 'card',
  className = '',
  initialsClassName = 'text-lg md:text-xl',
}: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const radius = shape === 'circle' ? 'rounded-full' : 'rounded-2xl md:rounded-[20px]'

  return (
    <div
      className={`relative shrink-0 overflow-hidden bg-bg-muted ${radius} ${className}`}
    >
      {failed ? (
        <span
          aria-hidden="true"
          className={`flex size-full items-center justify-center font-medium tracking-wide text-fg-subtle ${initialsClassName}`}
        >
          {initials}
        </span>
      ) : (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      )}
    </div>
  )
}
