import { activeCharacter } from "./registry";

/**
 * Seasonal site-wide dressing — a thin trim across the top plus a soft
 * coloured wash behind the top of the page. Which theme depends on which
 * character is in season: Onam kasavu + marigold during Onam, Dhanteras
 * gold ribbon + warmer glow during Diwali, etc. Renders nothing outside
 * every configured window.
 *
 * Deliberately restrained: this is a rate-checking utility people trust
 * with money, so the festive cue should read as "dressed for the season",
 * not as a decorated greeting card. Purely decorative and inert: no layout
 * shift beyond the 7px band, no JS, no motion.
 */
export default function SeasonalTheme() {
  const character = activeCharacter();
  const theme = character?.theme;
  if (!theme) return null;

  return (
    <>
      {theme.washClass && (
        <div
          aria-hidden
          className={`${theme.washClass} pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px]`}
        />
      )}
      {theme.trimClass && (
        <div aria-hidden className={`${theme.trimClass} w-full shrink-0`} />
      )}
    </>
  );
}
