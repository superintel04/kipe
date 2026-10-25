/**
 * The R mark (Figma file "R Logo", nodes 8:148 and 40:283) — the exported
 * vector, inlined so it draws in `currentColor` rather than carrying its own
 * fill. That keeps the mark and the wordmark beside it the same colour by
 * construction, from one declaration on their shared parent.
 *
 * One path, from `src/assets/R-Logo.svg`. The diagonal inside the bowl is
 * united into the outline rather than drawn as a separate stroked line —
 * which is what gives the join its curve. Composing it from the two source
 * nodes instead left a round cap butting against the bowl, and read sharp.
 *
 * Decorative: the wordmark next to it is real text, so the name is already in
 * the accessibility tree and this would only repeat it.
 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M75.001 0C88.8076 0.000395819 100.001 11.1933 100.001 25C100.001 38.8068 88.8077 49.9996 75.001 50H60.8281L88.9873 78.1592C89.7677 78.9402 89.7679 80.2064 88.9873 80.9873C88.2064 81.7682 86.9403 81.7678 86.1592 80.9873L54.6309 49.459C53.8498 48.6779 53.8498 47.4119 54.6309 46.6309C55.0209 46.2409 55.5319 46.0454 56.043 46.0449V46H75.001C86.4174 45.9996 95.7065 36.8891 95.9941 25.542L96.001 25C96.0007 13.5838 86.8901 4.29469 75.543 4.00684L75.001 4H4V75C4.00013 86.5976 13.4031 95.9998 25.001 96C36.4174 95.9996 45.7065 86.8891 45.9941 75.542L46.001 75V56.9756L35.8193 46.7949C35.0383 46.0139 35.0383 44.7469 35.8193 43.9658C36.6004 43.1848 37.8674 43.1848 38.6484 43.9658L49.3828 54.7012C49.6034 54.9217 49.7595 55.1819 49.8555 55.458C49.9347 55.6581 49.9854 55.8729 49.9961 56.0986H50.001V75C50.0008 88.8068 38.8077 99.9996 25.001 100C11.1941 99.9998 0.000131947 88.8069 0 75V0H75.001Z"
        fill="currentColor"
      />
    </svg>
  )
}
