import { useEffect } from 'react'
import Section from '@/components/Section'
import BrandingHero from '@/components/branding/BrandingHero'
import {
  BrandingDeliverables,
  BrandingFaq,
  BrandingFinalCta,
  BrandingFooter,
  BrandingPackages,
} from '@/components/branding/BrandingSections'
import {
  BrandingButton,
  Wordmark,
} from '@/components/branding/BrandingPrimitives'
import { useContent } from '@/content'

/** The sticky header (Figma 23:1239). */
function BrandingHeader() {
  const { branding } = useContent()

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle bg-bg/95 backdrop-blur">
      <Section innerClassName="flex items-center justify-between gap-6 py-4">
        <a href="#work" className="shrink-0">
          <Wordmark {...branding.wordmark} />
        </a>

        <nav aria-label={branding.navLabel} className="hidden md:block">
          <ul className="flex items-center gap-4 lg:gap-8">
            {branding.nav.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="rounded-[5px] px-4 py-2 text-body-sm font-medium text-fg-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <BrandingButton
          href="mailto:superintel04@gmail.com"
          size="sm"
          className="shrink-0"
        >
          {branding.headerCta}
        </BrandingButton>
      </Section>
    </header>
  )
}

/**
 * The personal brand studio landing page (Figma 23:1238), at `/branding`.
 *
 * It is a separate business from the profile, so it owns its whole chrome —
 * its own header, nav and footer — and rebinds the accent to the design's
 * green on the `.branding` root. Everything else comes from the shared design
 * system: the same type scale, radii, spacing and neutrals the profile uses,
 * which is why the page needs no second palette.
 *
 * The site's own `documentTitle` is set by LanguageProvider for every route,
 * so this page overrides it on mount and restores it on the way out.
 */
export default function BrandingPage() {
  const { branding } = useContent()

  useEffect(() => {
    const previous = document.title
    document.title = branding.documentTitle
    return () => {
      document.title = previous
    }
  }, [branding.documentTitle])

  return (
    <div className="branding bg-bg">
      <BrandingHeader />
      <main>
        <BrandingHero />
        <BrandingDeliverables />
        <BrandingPackages />
        <BrandingFaq />
        <BrandingFinalCta />
      </main>
      <BrandingFooter />
    </div>
  )
}
