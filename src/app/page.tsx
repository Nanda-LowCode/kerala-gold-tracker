import { Metadata } from "next";
import { createSupabaseReadClient } from "@/lib/supabase";
import { GoldRate } from "@/lib/types";
import DashboardLayout from "@/components/DashboardLayout";

export const revalidate = 3600; // Revalidate every 60 minutes

export async function getHistory(): Promise<GoldRate[]> {
  try {
    const supabase = createSupabaseReadClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("date, city, rate_18k_1g, rate_22k_1g, rate_24k_1g, rate_silver_1g")
      .eq("city", "Kochi")
      .order("date", { ascending: false })
      // Up to ~3 years to cover the historical backfill (scripts/backfill-history.mjs).
      // The chart slices to the selected range; table/sparkline use shorter windows.
      // If you backfill >3y (--years=5), raise this to ~1830.
      .limit(1100);

    if (error || !data) {
      console.error("[getHistory] Supabase query failed:", error?.message);
      return [];
    }
    return data as GoldRate[];
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const history = await getHistory();
  const today = history[0] ?? null;

  if (!today) {
    return {
      title: "Gold Rate Today in Kerala — 22K & 24K Live Price | LiveGold Kerala",
      description:
        "Today's gold rate in Kerala: live 22K (916) and 24K prices per gram and per pavan (8g), sourced from the Kerala board rate. Updated daily.",
      alternates: { canonical: "/" },
    };
  }

  const dateFormatted = new Date(today.date + "T00:00:00").toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return {
    title: `Gold Rate Today in Kerala (${dateFormatted}): 22K @ ₹${today.rate_22k_1g}/g`,
    description: `Today's gold rate in Kerala: 22 Karat (916) is ₹${today.rate_22k_1g}/gram (₹${(today.rate_22k_1g * 8).toLocaleString("en-IN")}/pavan) and 24 Karat is ₹${today.rate_24k_1g}/gram. Live Kerala board rate, updated daily by 10 AM IST.`,
    alternates: { canonical: "/" },
  };
}

export default async function Home() {
  const history = await getHistory();
  return <DashboardLayout history={history} cityName="Kochi" displayName="Kerala" />;
}
