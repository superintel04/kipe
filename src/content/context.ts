import { createContext, useContext } from 'react'
import { ar } from './ar'
import { en } from './en'
import type { Content, Language } from './types'

export const bundles: Record<Language, Content> = { en, ar }

export const STORAGE_KEY = 'kipe:lang'

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
