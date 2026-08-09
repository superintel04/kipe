import Avatar from './Avatar'
import portrait from '@/assets/Ramesh-New-dp2.jpg'
import { profile } from '@/data/profile'

/**
 * Splits the role line on its "|" and "&" separators, keeping them as their own
 * pieces so they can be dimmed and let the titles themselves carry the line.
 */
const titleParts = profile.title.split(/\s*([|&])\s*/)

/**
 * Portrait + name on the left, portfolio pill on the right.
 * The pill bleeds past the sheet's horizontal padding so it sits flush to the
 * right edge with left-only rounding, as in the Figma design.
 */
export default function ProfileHeader() {
  return (
    <header className="flex items-center justify-between gap-4 md:gap-8">
      <div className="flex items-center gap-4 md:gap-5">
        <Avatar
          src={portrait}
          alt={`Portrait of ${profile.name}`}
          initials={profile.initials}
          className="aspect-[114/138] w-20 md:w-28"
        />
        {/* min-w-0 lets the longer role line wrap instead of squeezing the pill. */}
        <div className="min-w-0">
          <p className="text-base font-bold md:text-lg">{profile.name}</p>
          <p className="text-sm font-normal text-balance md:text-base">
            {titleParts.map((part, index) =>
              part === '|' || part === '&' ? (
                <span key={`${part}-${index}`} className="mx-1.5 text-muted">
                  {part}
                </span>
              ) : (
                <span key={`${part}-${index}`}>{part}</span>
              ),
            )}
          </p>
        </div>
      </div>

      <a
        href={profile.portfolioUrl}
        className="-mr-6 flex shrink-0 items-center rounded-l-full bg-accent py-3 pr-6 pl-7 text-xs font-bold whitespace-nowrap text-paper transition-opacity hover:opacity-90 md:-mr-10 md:py-4 md:pr-10 md:pl-9 md:text-sm"
      >
        {profile.portfolioLabel}
      </a>
    </header>
  )
}
