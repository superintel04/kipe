import { useEffect, useRef, useState } from 'react'
import Curve from './Curve'
import Lightbox from './Lightbox'
import MetaGrid from './MetaGrid'
import type { CaseStudy } from '@/data/profile'

type CaseStudyDialogProps = {
  study: CaseStudy
  open: boolean
  onClose: () => void
}

type Enlarged = { src: string; alt: string } | null

/**
 * Full-window case study (Figma node 41:59): hero, project title, details,
 * then Challenge / Approach / Outcome.
 *
 * Built on the native <dialog> element, so focus trapping, background inerting
 * and Esc-to-close come from the platform rather than hand-rolled JavaScript.
 */
export default function CaseStudyDialog({
  study,
  open,
  onClose,
}: CaseStudyDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [enlarged, setEnlarged] = useState<Enlarged>(null)
  const detail = study.detail

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      dialog.showModal()
      dialog.scrollTo(0, 0)
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  // Keep the page behind from scrolling while the dialog is up.
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [open])

  useEffect(() => {
    if (!open) setEnlarged(null)
  }, [open])

  if (!detail) return null

  const titleId = `case-study-${study.name.replace(/\s+/g, '-').toLowerCase()}`

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(event) => {
        // Esc closes the lightbox first, leaving the case study open.
        if (enlarged) {
          event.preventDefault()
          setEnlarged(null)
        }
      }}
      className="m-0 h-dvh max-h-dvh w-screen max-w-none overflow-y-auto overscroll-contain bg-paper text-ink backdrop:bg-black/50"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close case study"
        className="fixed top-4 right-4 z-40 flex size-10 items-center justify-center rounded-full bg-ink/70 text-xl leading-none text-paper backdrop-blur transition-colors hover:bg-ink md:top-6 md:right-6"
      >
        <span aria-hidden="true">×</span>
      </button>

      {/* Hero, capped by the same curve as the project cards. */}
      <div className="relative bg-gradient-to-b from-paper to-[#dfe2ff]">
        <img
          src={study.image}
          alt={study.imageAlt}
          onClick={() => setEnlarged({ src: study.image, alt: study.imageAlt })}
          className="mx-auto block h-auto w-[78%] max-w-[760px] cursor-zoom-in py-10 md:py-14"
        />
        <Curve />
      </div>

      <article className="mx-auto max-w-3xl px-6 pt-10 pb-24 md:px-10 md:pt-14">
        <header>
          <p className="text-lg leading-snug font-light md:text-xl">
            {study.eyebrow}
          </p>
          <h2
            id={titleId}
            className="text-lg leading-snug font-light md:text-xl"
          >
            <span className="font-normal text-accent">{study.name}</span>
            <span>{study.client}</span>
          </h2>
        </header>

        <MetaGrid
          items={study.meta}
          label={`${study.name} project details`}
          className="mt-8 md:mt-10"
        />

        <section className="mt-12 md:mt-16">
          <h3 className="text-lg font-normal md:text-xl">Challenge</h3>
          <p className="mt-3 text-[15px] leading-relaxed font-light md:text-base">
            {detail.challenge}
          </p>
        </section>

        <section className="mt-12 md:mt-16">
          <h3 className="text-lg font-normal md:text-xl">Approach</h3>
          <p className="mt-3 text-[15px] leading-relaxed font-light md:text-base">
            {detail.approach.intro}
          </p>
          <ol className="mt-6 flex flex-col gap-4">
            {detail.approach.steps.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-disc text-xs font-normal text-accent"
                >
                  {index + 1}
                </span>
                <p className="text-[15px] leading-relaxed font-light md:text-base">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12 md:mt-16">
          <h3 className="text-lg font-normal md:text-xl">Outcome</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {detail.outcomes.map((outcome) => (
              <li
                key={outcome}
                className="border-l-2 border-accent/30 pl-4 text-[15px] leading-relaxed font-light md:text-base"
              >
                {outcome}
              </li>
            ))}
          </ul>
        </section>

        {detail.gallery && detail.gallery.length > 0 && (
          <section className="mt-12 md:mt-16">
            <h3 className="text-lg font-normal md:text-xl">Screens</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {detail.gallery.map((shot) => (
                <button
                  key={shot.src}
                  type="button"
                  onClick={() => setEnlarged(shot)}
                  className="cursor-zoom-in overflow-hidden rounded-lg bg-canvas"
                >
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </button>
              ))}
            </div>
          </section>
        )}
      </article>

      {enlarged && (
        <Lightbox
          src={enlarged.src}
          alt={enlarged.alt}
          onClose={() => setEnlarged(null)}
        />
      )}
    </dialog>
  )
}
