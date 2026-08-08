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
 * Circular portrait. Falls back to initials rather than a broken image so the
 * header stays intact before a photo has been dropped into /public.
 */
export default function Avatar({ src, alt, initials, className = '' }: AvatarProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-canvas ${className}`}
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
