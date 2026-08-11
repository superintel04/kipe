/**
 * All page content lives here so copy edits never require touching markup.
 * Mirrors the Figma source: Kipe / Content (node 1:7).
 */

import projectCase1 from '@/assets/project-case-1.png'
import projectCase2 from '@/assets/project-case-2.png'
import projectCase3 from '@/assets/project-case-3.png'
import hfiLogo from '@/assets/hfi-logo.svg'
import nngLogo from '@/assets/nng-logo.png'
import scrumLogo from '@/assets/scrum-logo.png'
import graduationCap from '@/assets/graduation-cap.svg'

/** Width of the Figma page frame, used to derive proportions from the design. */
export const DESIGN_PAGE_WIDTH = 595

export const profile = {
  name: 'Ramesh Panti',
  title:
    'Experience Designer | Usability Analyst | Visual Designer & AI First Designer',
  /** Jumps to the case studies further down this page. */
  portfolioLabel: 'View Projects',
  portfolioUrl: '#projects',
  /** Shown if the portrait image is missing. */
  initials: 'RP',
} as const

export type MetaItem = {
  label: string
  value: string
  href?: string
}

export const meta: MetaItem[] = [
  { label: 'Experience', value: '15+ Yrs' },
  { label: 'Current Location', value: 'Riyadh, KSA' },
  { label: 'Client', value: 'ITCI (Ministry of Culture)' },
  { label: 'Ready to Join', value: 'Immediately' },
  { label: 'Contact', value: '0537313849', href: 'tel:+966537313849' },
  {
    label: 'Email',
    value: 'superintel04@gmail.com',
    href: 'mailto:superintel04@gmail.com',
  },
  { label: 'Work Visa', value: 'Transferable Iqama' },
]

/**
 * Body copy is a list of segments so individual phrases can be accented
 * (matching the highlighted "Figma" / "DGA Code" runs in the design).
 */
export type Segment = string | { accent: string }

export type Skill = {
  title: string
  body: Segment[]
}

export const skills: Skill[] = [
  {
    title: 'UX Strategist',
    body: [
      'Defined UX vision and roadmap, translating business goals into prioritized design initiatives that shipped across all releases.',
    ],
  },
  {
    title: 'Stakeholder Management',
    body: [
      'Presented design rationale to executives, product, and engineering leads, aligning competing priorities into agreed scope each cycle.',
    ],
  },
  {
    title: 'User Research',
    body: [
      'Conducted interviews, usability sessions, surveys with users, converting findings into design decisions that resolved recurring drop-off points.',
    ],
  },
  {
    title: 'User Interface Design',
    body: [
      'Designed end-to-end interfaces for web/mobile product, from wireframes to production-ready high-fidelity screens using ',
      { accent: 'Figma' },
    ],
  },
  {
    title: 'Design Systems',
    body: [
      'Built and maintained a component library and token set adopted across all products. Implemented the application using ',
      { accent: 'DGA Code' },
      ' (Digital Government Authority KSA) systems',
    ],
  },
  {
    title: 'UX Team Management',
    body: [
      'Led a team of designers, running critiques, workload planning, and quality reviews across concurrent product streams.',
    ],
  },
  {
    title: 'Cross-functional Collaboration',
    body: [
      'Partnered daily with product, engineering, and QA from discovery to launch, supporting implementation through to sign-off.',
    ],
  },
  {
    title: 'AI-First Designer',
    body: [
      'Used AI tools ',
      { accent: '(Claude Code + Figma + Cursor + Chat GPT)' },
      ' and workflows to accelerate concept exploration, research synthesis, and prototype-to-code handoff.',
    ],
  },
]

/** Accent banner closing the Skillset section. */
export const callout =
  '5+ years managing Middle East projects — Arabic interface design, Saudi design culture, and KSA Design Library.'

export type Role = {
  title: string
  company: string
  /** e.g. "Dec 2021 – Present · 4 yrs 9 mos" */
  period: string
  location?: string
}

export const experience: Role[] = [
  {
    title: 'User Experience Lead',
    company: 'ITC Infotech · Full-time',
    period: 'Dec 2021 – Present · 4 yrs 9 mos',
    location: 'Riyadh, Saudi Arabia · On-site',
  },
  {
    title: 'Lead UX Designer',
    company: 'Antra Info Solutions · Full-time',
    period: 'Jan 2020 – Dec 2021 · 2 yrs',
    location: 'Hyderabad, Telangana, India',
  },
  {
    title: 'Principal Engineer, UI/UX',
    company: 'Berkadia',
    period: 'Mar 2018 – Jan 2020 · 1 yr 11 mos',
  },
  {
    title: 'Lead UX Designer',
    company: 'Berkadia',
    period: 'Jul 2017 – Jan 2020 · 2 yrs 7 mos',
    location: 'Greater Hyderabad Area',
  },
  {
    title: 'Lead UX/UI',
    company: 'HAPP — The Healthcare App',
    period: 'Feb 2016 – Jul 2017 · 1 yr 6 mos',
  },
]

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

export const credentials: Credential[] = [
  {
    label: 'HFI CUA & CXA Certified',
    logo: hfiLogo,
    logoAlt: 'Human Factors International',
    logoWidth: 23,
    logoHeight: 12,
  },
  {
    label: 'NNG Certified',
    logo: nngLogo,
    logoAlt: 'Nielsen Norman Group',
    logoWidth: 31,
    logoHeight: 15,
  },
  {
    label: 'Scrum Product Owner',
    logo: scrumLogo,
    logoAlt: 'Professional Scrum Product Owner',
    logoWidth: 24,
    logoHeight: 24,
  },
  {
    label: "Bachelor's Degree in Computer Science",
    logo: graduationCap,
    logoAlt: '',
    logoWidth: 44,
    logoHeight: 44,
  },
]

/** Closing note in the page footer. */
export const closing = {
  message:
    'Thank you for considering my profile. I am looking forward to taking on a new challenge, whether as a Team Leader or an Individual Contributor.',
  phone: '0537313849',
  phoneHref: 'tel:+966537313849',
  email: 'superintel04@gmail.com',
  signOff: 'Regards,',
} as const

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

export const caseStudies: CaseStudy[] = [
  {
    eyebrow: 'Project',
    name: 'Dewane',
    client: ' - Ministry of Culture',
    summary:
      'Digitized 50 employee service workflows across the Ministry of Culture and its commissions led research, design, and usability testing to replace manual processes with fast, trackable digital requests.',
    meta: [
      { label: 'Role', value: 'Lead UX Designer' },
      { label: 'Users', value: 'MoC Employees' },
      { label: 'Application Platform', value: 'Web & React Native' },
    ],
    image: projectCase1,
    imageAlt:
      'Dewane shown on a phone, laptop, and tablet employee service workflows for the Ministry of Culture',
    imageWidth: 464,
    imageHeight: 259,
    bandRatio: 0.86,
    detail: {
      challenge:
        'The Ministry of Culture runs a large catalogue of services for its own employees, and most of them were manual. Requests meant paperwork and constant manual intervention, there was no reliable way to track where a request stood, and delays were routine — with no proper service management underneath any of it. They wanted an intranet portal: an employee digital hub called Dewane.',
      approach: {
        intro:
          'We built Dewane as a web and mobile employee digital hub covering more than 50 services, digitising the full catalogue across both platforms.',
        steps: [
          'Ran foundational user research to establish which services employees used most, and how they actually used them.',
          'Documented the research findings and shared them with stakeholders.',
          'Built the design system and information architecture for the entire platform, and produced the prototypes.',
          'Ran business reviews and design iterations, then handed over to the development team and supported user testing through to completion.',
        ],
      },
      outcomes: [
        'Digitised the most critical services and automated several of them, letting every employee raise and track a request themselves.',
        'Normalised the approval centre across all approval levels, with dashboards that let management track requests at department level.',
        'Extended the services platform to all commissions across the Ministry of Culture.',
      ],
    },
  },
  {
    eyebrow: 'Project',
    name: 'Cultural Hub',
    client: ' - Ministry of Culture',
    summary:
      'Designed a public web portal consolidating Saudi cultural information heritage, events, and initiatives into a single accessible platform for citizens nationwide.',
    meta: [
      { label: 'Role', value: 'Lead UX Designer' },
      { label: 'Users', value: 'All KSA citizens' },
      { label: 'Application Platform', value: 'Responsive Web Portal' },
    ],
    image: projectCase2,
    imageAlt:
      'The Cultural Hub web portal, showing the hero banner and category tiles for Saudi cultural heritage',
    imageWidth: 459,
    imageHeight: 220,
    bandRatio: 0.95,
  },
  {
    eyebrow: 'Project',
    name: 'Beyond Business',
    client: ' - Qatar Airways',
    summary:
      "Designed Qatar Airways' corporate rewards platform, covering dashboard, employee management, and Qrewards redemption enabling companies to track and maximize business travel benefits.",
    meta: [
      { label: 'Role', value: 'UX Designer' },
      { label: 'Users', value: 'Corporate Companies & Business travellers' },
      { label: 'Application Platform', value: 'Responsive Web Portal' },
    ],
    image: projectCase3,
    imageAlt:
      'The Beyond Business portal by Qatar Airways, showing the landing page for corporate travel rewards',
    imageWidth: 451,
    imageHeight: 200,
    bandRatio: 0.88,
  },
]
