type LightboxProps = {
  src: string
  alt: string
  onClose: () => void
}

/**
 * Full-bleed overlay for enlarging a screenshot. Rendered inside the case
 * study dialog; Esc is handled there so it closes the lightbox before the
 * dialog itself.
 */
export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/85 p-4 md:p-10"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-white/10 text-xl leading-none text-white transition-colors hover:bg-white/20 md:top-6 md:right-6"
      >
        <span aria-hidden="true">×</span>
      </button>

      <img
        src={src}
        alt={alt}
        onClick={(event) => event.stopPropagation()}
        className="max-h-full max-w-full cursor-default object-contain"
      />
    </div>
  )
}
