/**
 * The Kipe mark (Figma node 960:1335) — the exported vector, inlined so it
 * draws in `currentColor` rather than carrying its own fill. That keeps the
 * mark and the wordmark beside it the same colour by construction, from one
 * declaration on their shared parent.
 *
 * Decorative: the wordmark next to it is real text, so the name is already in
 * the accessibility tree and this would only repeat it.
 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 76 76"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M56.667 0C67.099 1.74665e-05 75.5557 8.4576 75.5557 18.8896C75.5552 29.3213 67.0987 37.7783 56.667 37.7783H46.4521L67.4775 58.8037C68.2055 59.532 68.2057 60.7123 67.4775 61.4404C66.7494 62.1684 65.569 62.1684 64.8408 61.4404L41.0195 37.6191C40.2913 36.891 40.2915 35.7107 41.0195 34.9824C41.3849 34.6171 41.864 34.4343 42.3428 34.4355V34.0488H56.667C64.9079 34.0488 71.6131 27.4722 71.8213 19.2812L71.8262 18.8896C71.8262 10.6481 65.2496 3.94212 57.0586 3.73438L56.667 3.72949H3.72949V56.667C3.72974 65.0389 10.5166 71.826 18.8887 71.8262C27.1301 71.8262 33.836 65.2495 34.0439 57.0586L34.0488 56.667V42.3857H34.0674C34.0673 42.3773 34.0664 42.3688 34.0664 42.3604C34.0664 41.3356 34.8971 40.4922 35.9219 40.4922C36.9466 40.4922 37.7773 41.3356 37.7773 42.3604C37.7773 42.3688 37.7765 42.3773 37.7764 42.3857H37.7783V56.667C37.7781 67.0989 29.3206 75.5557 18.8887 75.5557C8.45687 75.5555 0.000248777 67.0988 0 56.667V0H56.667Z"
        fill="currentColor"
      />
    </svg>
  )
}
