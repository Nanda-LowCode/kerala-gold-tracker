import { createSupabaseReadClient } from "@/lib/supabase";
import SeasonalCharacterClient from "./SeasonalCharacterClient";
import { activeCharacter } from "./registry";

/**
 * Server loader for the seasonal-character easter egg.
 *
 * Fetches the last two days of Kochi rates so the blessing can react to
 * today's move (down = celebrate, up = sympathy, flat = a rare peace).
 * Outside every configured window, this returns null and skips the query
 * entirely — no cost when nothing's in season.
 *
 * Fails soft: without rate data the character just tells generic blessings.
 */
export default async function SeasonalCharacterLoader() {
  const character = activeCharacter();
  if (!character) return null;

  let rate22k: number | null = null;
  let change: number | null = null;
  try {
    const supabase = createSupabaseReadClient();
    const { data } = await supabase
      .from("daily_gold_rates")
      .select("date, rate_22k_1g")
      .eq("city", "Kochi")
      .order("date", { ascending: false })
      .limit(2);
    if (data?.[0]?.rate_22k_1g != null) {
      rate22k = data[0].rate_22k_1g;
      if (data[1]?.rate_22k_1g != null) change = rate22k - data[1].rate_22k_1g;
    }
  } catch {
    /* fail soft — generic blessings only */
  }

  // Only the id (a plain string) crosses the RSC boundary — the full config
  // contains functions and components that can't be serialised. The client
  // dispatcher looks the id up locally.
  return <SeasonalCharacterClient characterId={character.id} rate22k={rate22k} change={change} />;
}
