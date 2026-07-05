/**
 * LiveGold Kerala mark — the "Ingot G": a geometric G whose crossbar is a gold
 * bar. Inline SVG so it's crisp at any size, themeable, and costs no request.
 * Same geometry is mirrored in app/icon.svg, apple-icon.svg, the /embed widget
 * and the OG images — update them together if the mark changes.
 */
export default function Logo({
  size = 22,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M50 20 A 24 24 0 1 0 56 32"
        fill="none"
        strokeWidth="6.5"
        strokeLinecap="round"
        className="stroke-amber-700 dark:stroke-amber-400"
      />
      <rect
        x="34"
        y="29"
        width="22"
        height="7"
        rx="3.5"
        className="fill-amber-500 dark:fill-amber-300"
      />
    </svg>
  );
}
