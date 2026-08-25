import Reveal from './Reveal'
import { useContent } from '@/content'

/**
 * Closing note that ends the page — the message, contact details, and sign-off.
 */
export default function Footer() {
  const { closing, profile } = useContent()

  return (
    <footer className="mt-16 border-t border-black/5 pt-10 md:mt-24 md:pt-12">
      <Reveal>
        <p className="max-w-3xl text-[15px] leading-relaxed font-light text-ink md:text-base">
          {closing.message}
        </p>

        <p className="mt-6 text-[15px] leading-relaxed font-light text-ink md:text-base">
          {closing.contactPrefix}{' '}
          <a
            href={closing.phoneHref}
            dir="ltr"
            className="font-bold transition-colors hover:text-accent"
          >
            {closing.phone}
          </a>{' '}
          | {closing.emailLabel}{' '}
          <a
            href={`mailto:${closing.email}`}
            dir="ltr"
            className="underline underline-offset-2 transition-colors hover:text-accent"
          >
            {closing.email}
          </a>
        </p>

        <p className="mt-6 text-[15px] leading-relaxed font-light text-ink md:text-base">
          {closing.signOff}
          <br />
          {profile.name}
        </p>
      </Reveal>
    </footer>
  )
}
