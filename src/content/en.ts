/**
 * English content. Mirrors the Figma source: Kipe / Content (node 1:7).
 */

import {
  graduationCap,
  hfiLogo,
  nngLogo,
  projectCase1,
  projectCase2,
  projectCase3,
  scrumLogo,
  dewaneHero,
  culturalHubHero,
  beyondBusinessHero,
  mocLogo,
  qatarAirwaysLogo,
} from './assets'
import type { Content } from './types'

export const en: Content = {
  documentTitle: 'Ramesh Panti · Lead UX Designer',

  profile: {
    name: 'Ramesh Panti',
    tagline: [
      'Lead Product Designer with ',
      { highlight: '15+ years' },
      ' across UX strategy, research, and design systems. Research-led product design, end to end: from user insight to interface to front-end. Currently with the ',
      { strong: 'Ministry of Culture' },
      ' in Riyadh, KSA.',
    ],
    portfolioLabel: 'View Projects',
    portfolioUrl: '#projects',
    initials: 'RP',
  },

  meta: [
    { label: 'Experience', value: '15+ Yrs' },
    { label: 'Current Location', value: 'Riyadh, KSA' },
    { label: 'Client', value: 'ITCI (Ministry of Culture)' },
    { label: 'Contact', value: '+966 53 731 3849', href: 'tel:+966537313849' },
    {
      label: 'Email',
      value: 'superintel04@gmail.com',
      href: 'mailto:superintel04@gmail.com',
    },
    { label: 'Work Visa', value: 'Transferable Iqama' },
  ],

  skills: [
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
      title: 'Value AI Strategist',
      body: [
        'Research, Building, Testing and Shipping the Apps using',
        { accent: '(Claude Code + Figma + Figma MCP + Cursor )' },
        ' and workflows to accelerate concept exploration, research synthesis, and prototype-to-code handoff.',
      ],
    },
  ],

  callout:
    '5+ years experience in Middle East projects. Experience in Arabic interface design, Saudi design context & culture, and KSA Design Library.',

  experience: [
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
      title: 'Senior UX Designer',
      company: 'HAPP · The Healthcare App',
      period: 'Feb 2016 – Jul 2017 · 1 yr 6 mos',
    },
  ],

  credentials: [
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
  ],

  closing: {
    message:
      'Thank you for considering my profile. I am looking forward to taking on a new challenge, whether as a Team Leader or an Individual Contributor.',
    contactPrefix: 'Please reach out to me on mobile:',
    emailLabel: 'email:',
    phone: '+966 53 731 3849',
    phoneHref: 'tel:+966537313849',
    email: 'superintel04@gmail.com',
    signOff: 'Regards,',
  },

  caseStudies: [
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
          'The Ministry of Culture runs a large catalogue of services for its own employees, and most of them were manual. Requests meant paperwork and constant manual intervention, there was no reliable way to track where a request stood, and delays were routine with no proper service management underneath any of it. They wanted an intranet portal: an employee digital hub called Dewane.',
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
      detail: {
        challenge:
          'Cultural Hub is a source of inspiration for everything that promotes and preserves the unique Saudi culture shaped over time. The Ministry wanted the portal rebuilt on DGA Code the Digital Government Authority’s unified design library for all government applications so we redesigned the portal’s experience end to end.',
        approach: {
          intro:
            'We rebuilt the portal on DGA Code, starting from an audit of the existing experience rather than a visual refresh.',
          steps: [
            'Ran a heuristic evaluation and identified the navigation problems in the existing portal.',
            'Conducted user research with several commission departments and pinpointed their expectations and needs.',
            'Redesigned the complete portal against DGA Code.',
          ],
        },
        outcomes: [
          'The revamp earned users’ trust building on DGA Code makes the portal immediately recognisable as an official government application.',
          'Improved the portal’s responsiveness and made the experience more intuitive, with a fully responsive layout that works properly on mobile.',
        ],
      },
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
      detail: {
        challenge:
          'Beyond Business by Qatar Airways is a corporate rewards programme that gives companies and their employees benefits for business travel. The existing portal made its core journeys hard work: enrolment ran through complex form flows, navigation labels were unclear, visual elements were inconsistent, and the experience did not hold up on smaller screens. Qatar Airways wanted enrolment, flight booking, account management, exclusive offers, and points redemption rebuilt: responsive, consistent with the brand, and properly integrated with the loyalty programme.',
        approach: {
          intro:
            'We led research, visual design, and the design system for the redesign, working from evidence before touching the interface.',
          steps: [
            'Interviewed stakeholders across marketing, the Beyond Business team, product, and engineering to fix the scope and surface the pain points each group was hitting.',
            'Ran a heuristic evaluation of the live portal across the core journeys enrolment, promotions, account settings documenting every issue with screenshots, then grouping and prioritising them by severity and user impact.',
            'Benchmarked the corporate loyalty portals of Emirates, Etihad Airways, Singapore Airlines, and Oman Air to establish what users would expect from earning, redemption, membership tiers, and partner offers.',
            'Rebuilt the information architecture using card sorting and tree testing, mapped the user flows for each task, and produced sitemaps for the full portal.',
            'Designed the responsive interface against Qatar Airways’ brand style guide, covering colour, typography, icons, and imagery.',
          ],
        },
        outcomes: [
          'Critical usability issues were addressed first clearer navigation labels, a simpler enrolment flow, and consistent visual elements across the portal.',
          'A responsive design that adapts across desktop, laptop, tablet, and mobile, giving business travellers the same experience on whichever device they reach for.',
          'Exclusive offers, new benefits, and limited-time promotions surfaced deliberately within the architecture, so users can find and act on them.',
          'Visual language aligned to Qatar Airways’ brand identity, building the familiarity and credibility users expect from the airline.',
        ],
      },
    },
  ],

  caseStudyPages: [
    {
      slug: 'project1',
      heroEyebrow: 'Case study  /  Employee digital hub  /  Government',
      name: 'Dewane',
      heroSubtitle: 'Employee Digital Hub for the Ministry of Culture',
      heroImage: dewaneHero,
      heroAlt: 'Ministry of Culture headquarters at dusk',
      heroLogo: mocLogo,
      logoAlt: 'Ministry of Culture',
      scrollCue: 'SCROLL',
      meta: [
        { label: 'Role', value: 'Lead UX Designer' },
        { label: 'Users', value: 'MoC Employees' },
        { label: 'Application platform', value: 'Web & React Native' },
      ],
      briefLabel: '01 · The brief',
      processLabel: '02 · Process',
      resultLabel: '03 · Result',
      challenge: [
        'The Ministry of Culture runs a large catalogue of services for its own employees. Most of them were still ',
        { highlight: 'manual' },
        ': paper forms, hand-offs between departments, no way to track a request once it was raised. The result was constant manual intervention, delayed services and no single view of how anything was performing. They wanted one intranet portal to absorb all of it: an employee digital hub called ',
        { strong: 'Dewane' },
        '.',
      ],
      approachIntro:
        'Three phases ran before a single screen was designed. Select a phase to read it.',
      phases: [
        {
          title: 'Business Intent',
          chip: 'Phase 01  ·  Alignment',
          bullets: [
            'Defined product vision',
            'Scoped 50+ services',
            'Set on-premises requirement',
            'Translated intent into KPIs',
            'Aligned executive dashboard needs',
          ],
          outcome:
            'A shared definition of success gave every team the same target. KPIs turned an abstract vision into something trackable, kept cross-functional teams pulling in one direction, and gave stakeholders regular visibility into progress and early wins.',
        },
        {
          title: 'Product & Technical Focus Group',
          chip: 'Phase 02  ·  Feasibility',
          bullets: [
            'Ran cross-team focus group',
            'Captured product owner vision',
            'Documented technical constraints',
            'Estimated project scope',
            'Mapped stakeholders and dependencies',
          ],
          outcome:
            'Technical constraints surfaced early rather than mid-build, so design decisions stayed within what the chosen stack could support. This cut feasibility rework and let product items be prioritized realistically against the release plan.',
        },
        {
          title: 'UX Roadmap & Requirements Analysis',
          chip: 'Phase 03  ·  Definition',
          bullets: [
            'Built UX roadmap',
            'Planned timeline and resources',
            'Analysed BRD documentation',
            'Raised stakeholder clarifications',
            'Secured requirement sign-off',
          ],
          outcome:
            'Ambiguous and missing requirements were resolved, and unnecessary functions eliminated, before a single screen was designed. Design began from a validated, signed-off baseline, which reduced downstream development rework.',
        },
        {
          title: 'Research',
          chip: 'Phase 04  ·  Discovery',
          bullets: [
            'Interviewed MoC employees',
            'Studied existing processes',
            'Mapped request journeys',
            'Compared service workflows',
            'Observed the legacy platform',
          ],
          outcome:
            'Service journeys were simplified and opportunities for reusable UX patterns identified. User needs were prioritised against the research analysis rather than assumption.',
        },
        {
          title: 'Information Architecture & User Flows',
          chip: 'Phase 05  ·  Structure',
          bullets: [
            'Categorised 50+ services',
            'Defined navigation structure',
            'Created task flows',
            'Split experiences by role',
          ],
          outcome:
            'Employees could discover services easily and understand what action to take next, with distinct paths for employees, approvers and administrators.',
        },
        {
          title: 'Brand Styleguide & Design System',
          chip: 'Phase 06  ·  Foundations',
          bullets: [
            'Followed MoC brand guidelines',
            'Built reusable components',
            'Aligned web and mobile',
          ],
          outcome:
            'A consistent, scalable design foundation across multiple services. Predefined components cut front-end effort, and Lovable was used to generate front-end code.',
        },
        {
          title: 'Wireframes & Visual Design',
          chip: 'Phase 07  ·  Design',
          bullets: [
            'Wireframed key screens',
            'Reviewed flows with teams',
            'Ran design reviews',
            'Checked technical feasibility',
            'Iterated against constraints',
          ],
          outcome:
            'Structure and journeys were validated before investing in visual design, producing solutions that were both user-focused and technically feasible, and a realistic product experience ready for stakeholder validation and development.',
        },
        {
          title: 'Usability Testing',
          chip: 'Phase 08  ·  Validation',
          bullets: [
            'Scripted testing scenarios',
            'Identified usability issues',
          ],
          outcome:
            'Designs were validated with real users, improving the experience before and during development rather than after release.',
        },
        {
          title: 'Developer Handover',
          chip: 'Phase 09  ·  Handover',
          bullets: ['Prepared final UI specs', 'Supported implementation'],
          outcome:
            'A smooth design-to-development transition, with reduced ambiguity and less rework during the build.',
        },
      ],

      overallOutcome: {
        label: 'Overall outcome',
        items: [
          '50+ employee services moved to digital, trackable workflows.',
          'Reduced dependency on manual processes.',
          'Improved request visibility and approval tracking.',
          'A consistent experience across every employee service.',
          'Secure access to internal services on web and mobile.',
          'A scalable design system ready for future services.',
          'KPI-driven decision-making for stakeholders and leadership.',
        ],
      },
      nextLabel: 'See all case studies',
      footerTagline: 'Ramesh  ·  Product & UX design',
    },
    {
      slug: 'project2',
      heroEyebrow: 'Case study  /  Public cultural portal  /  Government',
      name: 'Cultural Hub',
      heroSubtitle:
        'A public portal for Saudi culture, heritage, events and initiatives',
      heroImage: culturalHubHero,
      heroAlt: 'A Saudi heritage fort at dusk',
      heroLogo: mocLogo,
      logoAlt: 'Ministry of Culture',
      scrollCue: 'SCROLL',
      meta: [
        { label: 'Role', value: 'Lead UX Designer' },
        { label: 'Users', value: 'All KSA citizens' },
        { label: 'Application platform', value: 'Responsive Web Portal' },
      ],
      briefLabel: '01 · The brief',
      processLabel: '02 · Process',
      resultLabel: '03 · Result',
      challenge: [
        'Cultural Hub is a source of inspiration for everything that promotes and preserves the ',
        { highlight: 'unique Saudi culture' },
        ' shaped over time. The Ministry wanted the portal rebuilt on ',
        { strong: 'DGA Code' },
        ' (the Digital Government Authority’s unified design library for all government applications), so we redesigned the portal’s experience end to end.',
      ],
      approachIntro:
        'The rebuild started from an audit of the existing experience rather than a visual refresh. Select a phase to read it.',
      phases: [
        {
          title: 'Heuristic Evaluation',
          chip: 'Phase 01  ·  Audit',
          bullets: [
            'Ran heuristic evaluation',
            'Identified navigation problems',
          ],
          outcome:
            'Navigation problems in the existing portal were identified and documented, so the redesign began from evidence rather than from a visual refresh.',
        },
        {
          title: 'Departmental User Research',
          chip: 'Phase 02  ·  Research',
          bullets: [
            'Researched commission departments',
            'Pinpointed expectations and needs',
          ],
          outcome:
            'Expectations and needs were pinpointed across several commission departments, so the redesign reflected how the portal is actually used rather than how it was assumed to be used.',
        },
        {
          title: 'Redesign on DGA Code',
          chip: 'Phase 03  ·  Rebuild',
          bullets: [
            'Rebuilt on DGA Code',
            'Redesigned the complete portal',
            'Made the layout responsive',
          ],
          outcome:
            'Building on DGA Code makes the portal immediately recognisable as an official government application, while responsiveness improved and the experience became more intuitive, with a layout that works properly on mobile.',
        },
      ],

      overallOutcome: {
        label: 'Overall outcome',
        items: [
          'The portal reads immediately as an official government service.',
          'Users’ trust earned through a recognisably DGA-compliant experience.',
          'Improved responsiveness across the portal.',
          'A more intuitive route to cultural information, heritage and events.',
          'A fully responsive layout that works properly on mobile.',
          'One accessible platform serving citizens nationwide.',
        ],
      },

      nextLabel: 'See all case studies',
      footerTagline: 'Ramesh  ·  Product & UX design',
    },
    {
      slug: 'project3',
      heroEyebrow: 'Case study  /  Corporate loyalty platform  /  Aviation',
      name: 'Beyond Business',
      heroSubtitle:
        'The corporate rewards platform for Qatar Airways business travellers',
      heroImage: beyondBusinessHero,
      heroAlt: 'Qatar Airways business travellers',
      heroLogo: qatarAirwaysLogo,
      logoAlt: 'Qatar Airways',
      scrollCue: 'SCROLL',
      meta: [
        { label: 'Role', value: 'UX Designer' },
        { label: 'Users', value: 'Corporate companies & business travellers' },
        { label: 'Application platform', value: 'Responsive Web Portal' },
      ],
      briefLabel: '01 · The brief',
      processLabel: '02 · Process',
      resultLabel: '03 · Result',
      challenge: [
        'Beyond Business by Qatar Airways is a corporate rewards programme that gives companies and their employees benefits for business travel. The existing portal made its core journeys ',
        { highlight: 'hard work' },
        ': enrolment ran through complex form flows, navigation labels were unclear, visual elements were inconsistent, and the experience did not hold up on smaller screens. Qatar Airways wanted enrolment, flight booking, account management, exclusive offers, and points redemption rebuilt: responsive, consistent with the brand, and properly integrated with the ',
        { strong: 'loyalty programme' },
        '.',
      ],
      approachIntro:
        'Research, visual design and the design system, working from evidence before touching the interface. Select a phase to read it.',
      phases: [
        {
          title: 'Stakeholder Interviews',
          chip: 'Phase 01  ·  Discovery',
          bullets: [
            'Interviewed marketing and product',
            'Fixed the project scope',
            'Surfaced team pain points',
          ],
          outcome:
            'Scope was agreed across marketing, the Beyond Business team, product and engineering, and the pain points each group was hitting surfaced before design work began.',
        },
        {
          title: 'Heuristic Evaluation',
          chip: 'Phase 02  ·  Audit',
          bullets: [
            'Audited the core journeys',
            'Documented issues with screenshots',
            'Prioritised by severity',
          ],
          outcome:
            'Critical usability issues were addressed first: clearer navigation labels, a simpler enrolment flow, and consistent visual elements across the portal.',
        },
        {
          title: 'Competitor Benchmarking',
          chip: 'Phase 03  ·  Benchmarking',
          bullets: [
            'Benchmarked four airlines',
            'Compared earning and redemption',
            'Reviewed membership tiers',
          ],
          outcome:
            'Measured against Emirates, Etihad Airways, Singapore Airlines and Oman Air, establishing what users would expect from earning, redemption, membership tiers and partner offers.',
        },
        {
          title: 'Information Architecture',
          chip: 'Phase 04  ·  Structure',
          bullets: [
            'Ran card sorting',
            'Ran tree testing',
            'Mapped user flows',
            'Produced full sitemaps',
          ],
          outcome:
            'Exclusive offers, new benefits and limited-time promotions were surfaced deliberately within the architecture, so users can find and act on them.',
        },
        {
          title: 'Responsive Interface Design',
          chip: 'Phase 05  ·  Design',
          bullets: [
            'Designed the responsive interface',
            'Applied the brand style guide',
            'Covered colour and typography',
          ],
          outcome:
            'A design that adapts across desktop, laptop, tablet and mobile, with visual language aligned to Qatar Airways’ brand identity.',
        },
      ],

      overallOutcome: {
        label: 'Overall outcome',
        items: [
          'Critical usability issues resolved ahead of everything else.',
          'A simpler enrolment flow and clearer navigation labels.',
          'One responsive experience across desktop, tablet and mobile.',
          'Offers and promotions surfaced where users will act on them.',
          'Consistent visual language across the whole portal.',
          'Familiarity and credibility users expect from the airline.',
        ],
      },

      nextLabel: 'See all case studies',
      footerTagline: 'Ramesh  ·  Product & UX design',
    },
  ],

  ui: {
    skillset: 'Skillset',
    experience: 'Experience',
    credentials: 'Education & Certification',
    challenge: 'Challenge',
    approach: 'Approach',
    outcome: 'Outcome',
    screens: 'Screens',
    caseStudy: 'Case study',
    backToProfile: 'Back to profile',
    viewCaseStudy: 'View Case study',
    closeCaseStudy: 'Close case study',
    closeImage: 'Close image',
    profileDetails: 'Profile details',
    projectDetails: (name) => `${name} project details`,
    languageToggle: 'Switch to Arabic',
    languageToggleGlyph: 'ع',
    languageToggleAria: 'Switch the site to Arabic',
  },
}
