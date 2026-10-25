/// <reference types="vite/client" />

/**
 * Vite's own `ImportMetaEnv` carries an index signature, so an unknown
 * `VITE_*` name would type as `any` and a typo would survive the typecheck.
 * Declaring the ones this app reads turns that into a compile error.
 */
interface ImportMetaEnv {
  /** GA4 property, e.g. `G-XXXXXXXXXX`. Unset means analytics stay off. */
  readonly VITE_GA_MEASUREMENT_ID?: string
}
