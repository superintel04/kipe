import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  bundles,
  LANGUAGE_SWITCH_ENABLED,
  LanguageContext,
  STORAGE_KEY,
  type LanguageValue,
} from './context'
import type { Language } from './types'

/** Remembered choice, falling back to English. Storage can throw in private mode. */
function readStoredLanguage(): Language {
  // While the switch is off the site is English regardless of what was
  // remembered — see LANGUAGE_SWITCH_ENABLED.
  if (!LANGUAGE_SWITCH_ENABLED) return 'en'

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'ar' || stored === 'en') return stored
  } catch {
    // Ignore — an unreadable store just means we start in English.
  }
  return 'en'
}

export default function LanguageProvider({
  children,
}: {
  children: ReactNode
}) {
  const [language, setLanguage] = useState<Language>(readStoredLanguage)

  // Keep the document in step: `dir` drives every logical CSS property, and
  // `lang` tells screen readers which voice to use.
  useEffect(() => {
    const root = document.documentElement
    root.lang = language
    root.dir = language === 'ar' ? 'rtl' : 'ltr'
    document.title = bundles[language].documentTitle

    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Persistence is a convenience, not a requirement.
    }
  }, [language])

  const toggleLanguage = useCallback(() => {
    if (!LANGUAGE_SWITCH_ENABLED) return
    setLanguage((current) => (current === 'en' ? 'ar' : 'en'))
  }, [])

  const value = useMemo<LanguageValue>(
    () => ({
      language,
      isRtl: language === 'ar',
      content: bundles[language],
      toggleLanguage,
    }),
    [language, toggleLanguage],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
