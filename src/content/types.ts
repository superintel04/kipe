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
 * Body copy is a list of segments so individual phrases can be emphasised
 * without putting markup in the content:
 * - `accent`    — set in the accent colour (the "Figma" / "DGA Code" runs)
 * - `strong`    — bold, in the foreground colour
 * - `highlight` — bold with an accent underline wash behind it
 */
export type Segment =
  string | { accent: string } | { strong: string } | { highlight: string }

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

/**
 * A standalone case study page (Figma node 402:265), reached at its own URL —
 * e.g. `/project1`. Each step is a card straddling the central timeline rail:
 * what was done on one side, what it produced on the other.
 */
export type CaseStudyPhase = {
  title: string
  /** Small pill above the phase, e.g. "Phase 01 · Alignment". */
  chip: string
  bullets: string[]
  outcome: string
}

export type CaseStudyPage = {
  /** URL segment — the page lives at `/{slug}`. */
  slug: string
  /** Breadcrumb-ish line over the hero title. */
  heroEyebrow: string
  name: string
  heroSubtitle: string
  /** Full-bleed hero photograph — a Vite asset import. */
  heroImage: string
  heroAlt: string
  /** Client mark shown over the hero. Omitted when there is no usable mark. */
  heroLogo?: string
  logoAlt?: string
  scrollCue: string
  meta: MetaItem[]
  /** Section eyebrows, e.g. "01 — The brief". */
  briefLabel: string
  processLabel: string
  resultLabel: string
  challenge: Segment[]
  /** Optional lead-in above the timeline. */
  approachIntro?: string
  phases: CaseStudyPhase[]
  /** Closing summary of what the work delivered overall. */
  overallOutcome: {
    label: string
    items: string[]
  }
  nextLabel: string
  footerTagline: string
}

/** Section headings, button labels and other chrome. */
export type UiStrings = {
  /**
   * Hero navigation labels. The targets themselves are structure, not copy,
   * so they live in `Nav.tsx` — only the wording is translated.
   */
  nav: {
    skills: string
    projects: string
    certifications: string
    resume: string
    linkedin: string
    /** Accessible name for the bar itself. */
    label: string
    /** Appended to the LinkedIn link, which opens in a new tab. */
    newTab: string
  }
  skillset: string
  /** Heading over the skill-card marquee. */
  meetSkillset: string
  /** e.g. "UX Strategist — show details"; takes the card's title. */
  skillDetails: (title: string) => string
  closeSkillDetails: string
  experience: string
  credentials: string
  challenge: string
  approach: string
  outcome: string
  screens: string
  caseStudy: string
  /** Heading over the project grid. */
  projects: string
  /** "Outcome" label on a project card — `outcome` is the case-study one. */
  outcomeLabel: string
  fullCaseStudy: string
  backToProfile: string
  /** Accessible name for the floating return-to-top control. */
  backToTop: string
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

/**
 * One claim in the Saudi-experience band. The mark keeps its own designed
 * dimensions rather than being normalised, as in `Credential`.
 */
export type RegionalPoint = {
  /** Vite asset import for the mark, drawn in white on the green card. */
  icon: string
  iconWidth: number
  iconHeight: number
  label: string
}

/** Marks a metric can carry instead of a figure (Figma node 869:4068). */
export type ProjectMetricIcon = 'devices' | 'document' | 'money' | 'dga'

/**
 * One outcome on a project card: either a figure with a caption, or a mark
 * with a caption where the outcome is qualitative.
 */
export type ProjectMetric = {
  label: string
  value?: string
  icon?: ProjectMetricIcon
}

/** One card in the project grid. */
export type ProjectCard = {
  logo: string
  logoAlt: string
  logoWidth: number
  logoHeight: number
  name: string
  /** Domain chips under the title. */
  tags: string[]
  challenge: string
  metrics: ProjectMetric[]
  image: string
  imageAlt: string
  /** Route of the full case study, where one exists. */
  slug?: string
}

/**
 * Colour a line of the skill card's reverse takes. Named by role rather than
 * by hex, so the palette can move without touching the locale bundles.
 */
export type SkillTone = 'indigo' | 'accent' | 'coral' | 'muted'

export type SkillCardLine = {
  text: string
  tone: SkillTone
  /** Adds a blank line above, as the design does before "Dev Components". */
  spaced?: boolean
}

/**
 * One card in the "Meet my skillset" marquee: a portrait of the person the
 * skill is likened to on the front, the claim on the reverse.
 */
export type SkillCard = {
  image: string
  imageAlt: string
  /** Card title, one array entry per line, as broken in the design. */
  title: string[]
  /** Reverse face. */
  back: SkillCardLine[]
  /** Which set of tool marks the reverse carries, if any. */
  tools?: SkillToolSet
}

/** Named groups of tool marks; the images themselves live in `SkillCards`. */
export type SkillToolSet = 'design' | 'ai' | 'frontend'

export type Content = {
  profile: {
    name: string
    /** Positioning statement under the name, as accentable segments. */
    tagline: Segment[]
    portfolioLabel: string
    portfolioUrl: string
    initials: string
  }
  meta: MetaItem[]
  skills: Skill[]
  /** "Meet my skillset" marquee. */
  skillCards: SkillCard[]
  /** Saudi-experience band: three claims over the Riyadh skyline. */
  regional: {
    points: RegionalPoint[]
    skylineAlt: string
  }
  experience: Role[]
  credentials: Credential[]
  closing: {
    /** One entry per line — the break is authored, not left to wrapping. */
    message: string[]
    contactPrefix: string
    emailLabel: string
    phone: string
    phoneHref: string
    email: string
    signOff: string
  }
  /** Project grid on the home page. */
  projectCards: ProjectCard[]
  caseStudies: CaseStudy[]
  /** Long-form project pages, each at its own route. */
  caseStudyPages: CaseStudyPage[]
  ui: UiStrings
  /** Used for the <html lang> and <title> attributes. */
  documentTitle: string
}
