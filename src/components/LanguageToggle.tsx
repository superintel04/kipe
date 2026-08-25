import { useLanguage } from '@/content/context'

/**
 * Language switch, sitting flush into the sheet's top trailing corner. Its
 * outer corner is rounded to match the sheet, the inner one to soften where it
 * meets the page — logical radii, so both mirror in Arabic.
 *
 * Grey while the site is in English, green once Arabic is on — the two states
 * in the design. The glyph tile carries "ع" or "En", so the control reads at a
 * glance without relying on the label.
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
      className={`flex items-center gap-2 rounded-ss-none rounded-se-[17px] rounded-ee-none rounded-es-[17px] px-5 py-2.5 text-[0.7rem] font-bold whitespace-nowrap transition-colors ${
        isRtl
          ? 'bg-[#66b166] text-paper hover:bg-[#5aa25a]'
          : 'bg-[#e8e8e8] text-ink hover:bg-[#dcdcdc]'
      } ${className}`}
    >
      <span
        aria-hidden="true"
        lang={isRtl ? 'en' : 'ar'}
        className="flex size-6 shrink-0 items-center justify-center rounded-md bg-paper text-sm leading-none font-normal text-ink"
      >
        {content.ui.languageToggleGlyph}
      </span>
      {content.ui.languageToggle}
    </button>
  )
}
