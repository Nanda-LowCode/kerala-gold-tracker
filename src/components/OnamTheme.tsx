import { ONAM_END, ONAM_START } from "./OnamMahabali";

/**
 * Seasonal Onam dressing for the whole site — a kasavu (gold zari) trim across
 * the top and a soft marigold wash behind the page. Deliberately restrained:
 * this is a rate-checking utility people trust with money, so the festive cue
 * should read as "dressed for Onam", not as a decorated greeting card.
 *
 * Renders nothing outside the Onam window (same dates as the Mahabali easter
 * egg — bump them together each year). Purely decorative and inert: no layout
 * shift beyond the 7px band, no JS, no motion.
 */
export default function OnamTheme() {
  const now = new Date();
  if (now < ONAM_START || now > ONAM_END) return null;

  return (
    <>
      {/* Warm wash behind the top of every page. Negative z keeps it under all
          content but above the body gradient. */}
      <div
        aria-hidden
        className="onam-glow pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px]"
      />
      {/* Kasavu trim — the gold border of a Kerala set-mundu. */}
      <div aria-hidden className="onam-kasavu w-full shrink-0" />
    </>
  );
}
