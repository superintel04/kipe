import { useLanguage } from '@/content/context'

/**
 * Language switch, styled as the design system's outline icon button at the
 * 44px medium size — which is also the DS minimum tap target.
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
      lang={isRtl ? 'en' : 'ar'}
      className={`flex size-11 items-center justify-center rounded-pill border border-border-strong bg-bg text-h5 leading-none font-bold transition-colors hover:bg-bg-inverse hover:text-fg-inverse ${className}`}
    >
      <span aria-hidden="true">{content.ui.languageToggleGlyph}</span>
    </button>
  )
}
