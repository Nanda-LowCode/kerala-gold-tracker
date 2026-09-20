import type { CharacterConfig } from "./types";
import { MAHABALI } from "./characters/mahabali";
import { LAKSHMI } from "./characters/lakshmi";
import { KRISHNA } from "./characters/krishna";
import { KUBERA } from "./characters/kubera";

/**
 * Registered seasonal characters. Order matters for overlap — if two windows
 * ever cover the same day, the first match wins. Keep the list chronological
 * (by start of the season) to make bumping year-over-year windows obvious.
 */
export const CHARACTERS: CharacterConfig[] = [
  KRISHNA,  // Vishu · Apr (2027)
  KUBERA,   // Akshaya Tritiya · May (2027)
  MAHABALI, // Onam · Aug-Sep (2026)
  LAKSHMI,  // Dhanteras/Diwali · Nov (2026)
];

/**
 * The character whose season contains `at` (defaults to now). Returns null
 * outside every configured window — nothing renders, no fetch happens.
 */
export function activeCharacter(at: Date = new Date()): CharacterConfig | null {
  return CHARACTERS.find((c) => at >= c.window.start && at <= c.window.end) ?? null;
}

/**
 * Theme-only seasons — no character, just site-wide dressing (trim + wash).
 *
 * Used for cultural moments where personifying a figure would be
 * inappropriate. Islam, for instance, doesn't personify divine figures,
 * so Ramadan and Eid ride only on themed CSS without a mascot walking or
 * gliding across the screen. Same shape as a CharacterConfig's `theme`,
 * without the rest of the config.
 */
interface ThemeWindow {
  id: string;
  name: string;
  window: { start: Date; end: Date };
  trimClass: string;
  washClass: string;
}

export const THEME_WINDOWS: ThemeWindow[] = [
  // Ramadan 2027 + Eid al-Fitr — the exact start/end shift by ~1 day based
  // on moon sighting; window is padded to catch both possible cycles.
  {
    id: "ramadan-2027",
    name: "Ramadan · Eid al-Fitr",
    window: {
      start: new Date("2027-02-16T00:00:00+05:30"),
      end: new Date("2027-03-22T23:59:59+05:30"),
    },
    trimClass: "ramadan-trim",
    washClass: "ramadan-glow",
  },
  // Eid al-Adha 2027 — same theme, separate short window.
  {
    id: "eid-al-adha-2027",
    name: "Eid al-Adha",
    window: {
      start: new Date("2027-05-25T00:00:00+05:30"),
      end: new Date("2027-05-29T23:59:59+05:30"),
    },
    trimClass: "ramadan-trim",
    washClass: "ramadan-glow",
  },
];

/**
 * Any active site-wide theme, from either a character's linked theme or a
 * standalone theme-only window. Characters win when both would match on
 * the same day.
 */
export function activeSeasonTheme(
  at: Date = new Date(),
): { trimClass: string; washClass: string } | null {
  const char = activeCharacter(at);
  if (char?.theme?.trimClass && char.theme?.washClass) {
    return { trimClass: char.theme.trimClass, washClass: char.theme.washClass };
  }
  const win = THEME_WINDOWS.find((w) => at >= w.window.start && at <= w.window.end);
  return win ? { trimClass: win.trimClass, washClass: win.washClass } : null;
}
