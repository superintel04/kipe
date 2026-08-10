import { useState } from 'react'

type AvatarProps = {
  /** Resolved URL for the portrait — pass a Vite asset import. */
  src: string
  alt: string
  /** Rendered inside the circle when the image is missing or fails to load. */
  initials: string
  className?: string
}

/**
 * Portrait card — a rounded rectangle, matching the 114 × 137.8 frame with a
 * 20px radius in the design (Figma node 11:216). Falls back to initials rather
 * than showing a broken image.
 */
export default function Avatar({
  src,
  alt,
  initials,
  className = '',
}: AvatarProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-2xl bg-canvas md:rounded-[20px] ${className}`}
    >
      {failed ? (
        <span
          aria-hidden="true"
          className="flex size-full items-center justify-center text-lg font-medium tracking-wide text-muted md:text-xl"
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
