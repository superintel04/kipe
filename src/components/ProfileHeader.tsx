import Avatar from './Avatar'
import portrait from '@/assets/portrait.jpg'
import { useContent } from '@/content'

/**
 * Portrait + name on the left, portfolio pill on the right.
 * The pill bleeds past the sheet's inline padding so it sits flush to the
 * trailing edge with rounding on its leading side, as in the Figma design.
 * Logical properties mean it mirrors automatically in Arabic.
 */
export default function ProfileHeader() {
  const { profile } = useContent()

  /**
   * Split the role line on its "|" and "&" separators, keeping them as their
   * own pieces so they can be dimmed and let the titles carry the line.
   */
  const titleParts = profile.title.split(/\s*([|&])\s*/)

  return (
    <header className="flex items-center justify-between gap-4 md:gap-8">
      <div className="flex items-center gap-4 md:gap-5">
        <Avatar
          src={portrait}
          alt={profile.name}
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
        className="-me-6 flex shrink-0 items-center rounded-s-full bg-accent py-3 pe-6 ps-7 text-xs font-bold whitespace-nowrap text-paper transition-opacity hover:opacity-90 md:-me-10 md:py-4 md:pe-10 md:ps-9 md:text-sm"
      >
        {profile.portfolioLabel}
      </a>
    </header>
  )
}
