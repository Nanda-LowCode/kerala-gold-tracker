import { createSupabaseReadClient } from "@/lib/supabase";
import OnamMahabali, { ONAM_END, ONAM_START } from "./OnamMahabali";

/**
 * Server loader for the Onam Mahabali easter egg — fetches the last two days of
 * Kochi rates so his blessings can react to today's move (down = "go buy",
 * up = sympathy). Fails soft: without data he just tells his generic jokes.
 * Outside the Onam window it renders nothing and skips the query entirely.
 */
export default async function OnamMahabaliLoader() {
  const now = new Date();
  if (now < ONAM_START || now > ONAM_END) return null;

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

  return <OnamMahabali rate22k={rate22k} change={change} />;
}
