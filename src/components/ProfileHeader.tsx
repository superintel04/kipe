import Avatar from './Avatar'
import portrait from '@/assets/Ramesh-DP.png'
import { profile } from '@/data/profile'

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
          className="size-16 md:size-24"
        />
        {/* min-w-0 lets the longer role line wrap instead of squeezing the pill. */}
        <div className="min-w-0">
          <p className="text-base font-bold md:text-lg">{profile.name}</p>
          <p className="text-sm font-normal text-balance md:text-base">
            {profile.title}
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
