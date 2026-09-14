import type { CharacterConfig } from "./types";
import { MAHABALI } from "./characters/mahabali";
import { LAKSHMI } from "./characters/lakshmi";

/**
 * Registered seasonal characters. Order matters for overlap — if two windows
 * ever cover the same day, the first match wins. Keep the list chronological
 * to make bumping year-over-year windows obvious.
 */
export const CHARACTERS: CharacterConfig[] = [
  MAHABALI, // Onam · Aug-Sep
  LAKSHMI,  // Dhanteras/Diwali · Nov
];

/**
 * The character whose season contains `at` (defaults to now). Returns null
 * outside every configured window — nothing renders, no fetch happens.
 */
export function activeCharacter(at: Date = new Date()): CharacterConfig | null {
  return CHARACTERS.find((c) => at >= c.window.start && at <= c.window.end) ?? null;
}
