/**
 * The shape every locale bundle must fill. Adding a language means adding one
 * file that satisfies `Content` — components read it through `useContent()`
 * and never import a locale directly.
 */

/** Width of the Figma page frame, used to derive proportions from the design. */
export const DESIGN_PAGE_WIDTH = 595

export type Language = 'en' | 'ar'

export type MetaItem = {
  label: string
  value: string
  href?: string
}

/**
 * Body copy is a list of segments so individual phrases can be accented
 * (matching the highlighted "Figma" / "DGA Code" runs in the design).
 */
export type Segment = string | { accent: string }

export type Skill = {
  title: string
  body: Segment[]
}

export type Role = {
  title: string
  company: string
  /** e.g. "Dec 2021 – Present · 4 yrs 9 mos" */
  period: string
  location?: string
}

/**
 * Credentials. Each mark is exported from the Figma frame (node 9:63) and sits
 * in a 44px disc; `logoWidth`/`logoHeight` are its size inside that disc.
 */
export type Credential = {
  label: string
  logo: string
  logoAlt: string
  logoWidth: number
  logoHeight: number
}

/**
 * The long-form write-up shown in the dialog (Figma node 41:59). Optional —
 * a project without one simply has no "View Case study" button.
 */
export type CaseStudyDetail = {
  challenge: string
  approach: {
    intro: string
    steps: string[]
  }
  outcomes: string[]
  /** Extra screens, shown as a grid and openable in the lightbox. */
  gallery?: { src: string; alt: string }[]
}

export type CaseStudy = {
  eyebrow: string
  /** Accented first half of the title, e.g. the product name. */
  name: string
  /** Plain remainder of the title. */
  client: string
  summary: string
  meta: MetaItem[]
  /** Device mockup — a Vite asset import from src/assets. */
  image: string
  imageAlt: string
  /**
   * The mockup's size in the design (the files themselves are exported at 2x
   * for retina). Sets the aspect ratio, and is measured against
   * DESIGN_PAGE_WIDTH so the image keeps its proportion at any viewport.
   */
  imageWidth: number
  imageHeight: number
  /**
   * How far down the block the gradient band reaches, as a fraction — the
   * mockup deliberately overhangs it. Taken from the Figma frames:
   * band height ÷ mockup bottom edge.
   */
  bandRatio: number
  detail?: CaseStudyDetail
}

/** Section headings, button labels and other chrome. */
export type UiStrings = {
  skillset: string
  experience: string
  credentials: string
  challenge: string
  approach: string
  outcome: string
  screens: string
  viewCaseStudy: string
  closeCaseStudy: string
  closeImage: string
  profileDetails: string
  /** e.g. "Dewane project details" — takes the project name. */
  projectDetails: (name: string) => string
  /** Label on the language toggle, naming the language it switches to. */
  languageToggle: string
  /** Single glyph in the toggle's tile — "ع" for Arabic, "En" for English. */
  languageToggleGlyph: string
  languageToggleAria: string
}

export type Content = {
  profile: {
    name: string
    title: string
    portfolioLabel: string
    portfolioUrl: string
    initials: string
  }
  meta: MetaItem[]
  skills: Skill[]
  callout: string
  experience: Role[]
  credentials: Credential[]
  closing: {
    message: string
    contactPrefix: string
    emailLabel: string
    phone: string
    phoneHref: string
    email: string
    signOff: string
  }
  caseStudies: CaseStudy[]
  ui: UiStrings
  /** Used for the <html lang> and <title> attributes. */
  documentTitle: string
}
