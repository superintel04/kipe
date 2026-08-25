/**
 * Content entry point. Components read copy through `useContent()` and never
 * import a locale bundle directly, so adding a language means adding one file
 * that satisfies `Content` and listing it in `context.ts`.
 *
 * `LanguageProvider` is imported from its own module (main.tsx) to keep this
 * barrel free of components — React Fast Refresh needs that separation.
 */

export { useContent, useLanguage } from './context'
export { DESIGN_PAGE_WIDTH } from './types'
export type * from './types'
