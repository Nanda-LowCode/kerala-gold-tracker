// Fetches the latest Kerala gold rate from Supabase and writes props.json
// for the Remotion render. Read-only (anon key). Run before `remotion render`.
//
//   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... node fetch-rate.mjs
//
import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) {
  console.error(
    "✗ Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars."
  );
  process.exit(1);
}

const supabase = createClient(url, key);

const { data, error } = await supabase
  .from("daily_gold_rates")
  .select("date, rate_22k_1g, rate_24k_1g")
  .eq("city", "Kochi")
  .order("date", { ascending: false })
  .limit(8);

if (error || !data || data.length === 0) {
  console.error("✗ Supabase read failed:", error?.message ?? "no rows");
  process.exit(1);
}

const today = data[0];
const yesterday = data[1] ?? null;
const change22k = yesterday ? today.rate_22k_1g - yesterday.rate_22k_1g : 0;
const pct = yesterday ? (change22k / yesterday.rate_22k_1g) * 100 : 0;
// oldest → newest for the sparkline
const spark = [...data].reverse().map((r) => r.rate_22k_1g);

const props = {
  date: today.date,
  city: "Kerala",
  rate22k: today.rate_22k_1g,
  rate24k: today.rate_24k_1g,
  change22k,
  pct,
  spark,
};

writeFileSync("props.json", JSON.stringify(props, null, 2));
console.log("✓ Wrote props.json:", props);
