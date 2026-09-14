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
