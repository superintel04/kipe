/**
 * The R mark (Figma file "R Logo", nodes 8:148 and 40:283) — the exported
 * vector, inlined so it draws in `currentColor` rather than carrying its own
 * fill. That keeps the mark and the wordmark beside it the same colour by
 * construction, from one declaration on their shared parent.
 *
 * The mark is two nodes in the source: the outlined R and the short diagonal
 * inside its bowl. They are composed here on the R's own 100×100 box, with
 * the diagonal translated to the offset it sits at in the design.
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
        d="M75.001 0C88.8078 0.000263885 100.001 11.1931 100.001 25C100.001 38.8068 88.8078 49.9997 75.001 50H60.8281L88.9873 78.1592C89.7678 78.9403 89.7682 80.2064 88.9873 80.9873C88.2064 81.7682 86.9403 81.7678 86.1592 80.9873L54.6309 49.459C53.8498 48.6779 53.8498 47.4119 54.6309 46.6309C55.021 46.2408 55.5318 46.0454 56.043 46.0449V46H75.001C86.4175 45.9997 95.7065 36.8892 95.9941 25.542L96.001 25C96.0009 13.5836 86.8903 4.29456 75.543 4.00684L75.001 4H4V75C4.00013 86.5976 13.4031 95.9998 25.001 96C36.4175 95.9997 45.7065 86.8892 45.9941 75.542L46.001 75V56.0986H46.0059C46.0558 55.0385 46.9285 54.1943 48.001 54.1943C49.0735 54.1943 49.9462 55.0385 49.9961 56.0986H50.001V75C50.0008 88.8068 38.8078 99.9997 25.001 100C11.1941 99.9998 0.000131948 88.8069 0 75V0H75.001Z"
        fill="currentColor"
      />
      <g transform="translate(35.24,40.22)">
        <line
          x1="12.7353"
          y1="12.7352"
          x2="2.00012"
          y2="2"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
