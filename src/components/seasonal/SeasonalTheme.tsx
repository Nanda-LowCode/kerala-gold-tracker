import { activeSeasonTheme } from "./registry";

/**
 * Seasonal site-wide dressing — a thin trim across the top plus a soft
 * coloured wash behind the top of the page. Which theme depends on which
 * season is active: Onam kasavu + marigold during Onam, Dhanteras gold
 * ribbon + warmer glow during Diwali, a green-and-gold arabesque during
 * Ramadan/Eid, etc. Some seasons carry a character too, some don't; this
 * component only cares about the theme part.
 *
 * Deliberately restrained: this is a rate-checking utility people trust
 * with money, so the festive cue should read as "dressed for the season",
 * not as a decorated greeting card. Purely decorative and inert: no layout
 * shift beyond the 7px band, no JS, no motion.
 */
export default function SeasonalTheme() {
  const theme = activeSeasonTheme();
  if (!theme) return null;

  return (
    <>
      <div
        aria-hidden
        className={`${theme.washClass} pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px]`}
      />
      <div aria-hidden className={`${theme.trimClass} w-full shrink-0`} />
    </>
  );
}
