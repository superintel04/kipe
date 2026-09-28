import { createContext, useContext } from 'react'
import { ar } from './ar'
import { en } from './en'
import type { Content, Language } from './types'

export const bundles: Record<Language, Content> = { en, ar }

export const STORAGE_KEY = 'kipe:lang'

/**
 * The one switch for the Arabic side. `false` hides the language toggle and
 * pins the site to English; everything else — the `ar` bundle, the RTL
 * layout rules, the logical CSS properties — stays in place, so turning this
 * back on is the only change needed to restore it.
 *
 * It also overrides a remembered `ar` choice: without that, anyone who had
 * switched to Arabic before would come back to an Arabic page with no way
 * out, since the toggle is gone.
 */
export const LANGUAGE_SWITCH_ENABLED = false

export type LanguageValue = {
  language: Language
  isRtl: boolean
  content: Content
  toggleLanguage: () => void
}

export const LanguageContext = createContext<LanguageValue | null>(null)

export function useLanguage(): LanguageValue {
  const value = useContext(LanguageContext)
  if (!value) {
    throw new Error('useLanguage must be used inside a LanguageProvider')
  }
  return value
}

/** Shorthand for the common case of only needing the copy. */
export function useContent(): Content {
  return useLanguage().content
}
