import Reveal from './Reveal'
import Section from './Section'
import { useContent } from '@/content'

/**
 * Education & certification as bordered cards. Each lifts slightly on hover
 * and its border takes the accent, matching the DS's outline button treatment.
 */
export default function Credentials() {
  const { credentials, ui } = useContent()

  return (
    <Section labelledBy="credentials-heading" innerClassName="py-24 md:py-36">
      <Reveal>
        <h2 id="credentials-heading" className="text-h2 font-extrabold">
          {ui.credentials}
        </h2>
      </Reveal>

      <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
        {credentials.map((item, index) => (
          <li key={item.label}>
            <Reveal
              delay={Math.min(index, 3) * 90}
              className="group h-full rounded-xl border border-border p-7 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_12px_32px_rgba(2,178,98,0.12)]"
            >
              <span className="flex size-14 items-center justify-center overflow-hidden rounded-lg bg-accent-subtle transition-colors duration-300 group-hover:bg-accent/15">
                <img
                  src={item.logo}
                  alt={item.logoAlt}
                  width={item.logoWidth}
                  height={item.logoHeight}
                  style={{ width: item.logoWidth, height: item.logoHeight }}
                  className="max-w-none"
                />
              </span>

              <p className="mt-6 text-body-lg font-medium">{item.label}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}
