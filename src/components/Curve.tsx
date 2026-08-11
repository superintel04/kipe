/**
 * Exact geometry of the curved divider, exported from the Figma vector
 * (node 1:48, 597×14). Stretched to the container width with
 * preserveAspectRatio="none", exactly as it scales in the design.
 */
const CURVE_PATH = 'M0 14C78.8994 3.43527 308.759 -11.3554 597 14H0Z'

/** Caps the bottom of a band, blending it into the white sheet below. */
export default function Curve({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 597 14"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`absolute inset-x-0 bottom-0 h-[14px] w-full md:h-[21px] ${className}`}
    >
      <path d={CURVE_PATH} fill="var(--color-paper)" />
    </svg>
  )
}
