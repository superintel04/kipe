import { credentials } from '@/data/profile'

/**
 * Education & certification (Figma node 9:63). Each credential pairs its brand
 * mark, sized as in the design, with a 44px disc in the pale accent tint.
 */
export default function Credentials() {
  return (
    <section aria-labelledby="credentials-heading" className="pt-16 md:pt-24">
      <h2
        id="credentials-heading"
        className="text-3xl font-light text-accent md:text-4xl"
      >
        Education &amp; Certification
      </h2>

      <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2 md:mt-10">
        {credentials.map((item) => (
          <li key={item.label} className="flex items-center gap-2.5">
            <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-disc">
              <img
                src={item.logo}
                alt={item.logoAlt}
                width={item.logoWidth}
                height={item.logoHeight}
                style={{ width: item.logoWidth, height: item.logoHeight }}
                className="max-w-none"
              />
            </span>

            <span className="text-sm font-light text-ink md:text-base">
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
