"use client";

import SeasonalCharacter from "./SeasonalCharacter";
import { MAHABALI } from "./characters/mahabali";
import { LAKSHMI } from "./characters/lakshmi";

/**
 * Client-side dispatcher that resolves a character id to its full config.
 *
 * The server loader picks *which* character is in season and passes the id
 * across the RSC boundary — a plain string, which serialises. Function
 * props like `buildRateLines` and component props like `Art` in the full
 * config can't cross that boundary, so both the config lookup and the
 * SeasonalCharacter render happen on the client side.
 *
 * Adding a new character means registering it here (id → config) and in
 * the server-side registry (id + window). Two lines total.
 */
const CONFIGS = {
  mahabali: MAHABALI,
  lakshmi: LAKSHMI,
} as const;

export type CharacterId = keyof typeof CONFIGS;

export default function SeasonalCharacterClient({
  characterId,
  rate22k,
  change,
}: {
  characterId: string;
  rate22k: number | null;
  change: number | null;
}) {
  const config = CONFIGS[characterId as CharacterId];
  if (!config) return null;
  return <SeasonalCharacter character={config} rate22k={rate22k} change={change} />;
}
