import { useLanguage } from '@/content/context'

/**
 * Language switch, sitting flush into the sheet's top trailing corner. Its
 * outer corner is rounded to match the sheet, the inner one to soften where it
 * meets the page — logical radii, so both mirror in Arabic.
 *
 * Icon only: the tile carries "ع" or "En", naming the language it switches to.
 * The accessible name and tooltip carry the full sentence, since a lone glyph
 * would otherwise announce as a bare letter.
 */
export default function LanguageToggle({
  className = '',
}: {
  className?: string
}) {
  const { content, isRtl, toggleLanguage } = useLanguage()

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-pressed={isRtl}
      aria-label={content.ui.languageToggleAria}
      title={content.ui.languageToggleAria}
      className={`flex items-center justify-center rounded-ss-none rounded-se-[17px] rounded-ee-none rounded-es-[17px] bg-[#e8e8e8] px-4 py-2.5 transition-colors hover:bg-[#dcdcdc] ${className}`}
    >
      <span
        aria-hidden="true"
        lang={isRtl ? 'en' : 'ar'}
        className="flex size-6 shrink-0 items-center justify-center rounded-md bg-paper text-sm leading-none font-normal text-ink"
      >
        {content.ui.languageToggleGlyph}
      </span>
    </button>
  )
}
