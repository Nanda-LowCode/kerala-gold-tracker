import { Metadata } from "next";
import { createSupabaseClient } from "@/lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";

interface GoldRate {
  date: string;
  city: string;
  rate_18k_1g: number;
  rate_22k_1g: number;
  rate_24k_1g: number;
}

export const revalidate = 300;

export async function getHistory(): Promise<GoldRate[]> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("date, city, rate_18k_1g, rate_22k_1g, rate_24k_1g")
      .eq("city", "Kochi")
      .order("date", { ascending: false })
      .limit(30);

    if (error || !data) return [];
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
      title: "Today's Gold Rate in Kochi | LiveGold Kerala",
      description: "View the most recent 22K and 24K gold rates in Kochi, Kerala.",
    };
  }

  const dateFormatted = new Date(today.date + "T00:00:00").toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return {
    title: `Today's Gold Rate in Kochi (${dateFormatted}): 22K @ ₹${today.rate_22k_1g}/g`,
    description: `Current gold price in Kerala today: 22 Karat is ₹${today.rate_22k_1g} per gram (₹${today.rate_22k_1g * 8} per pavan). 24 Karat is ₹${today.rate_24k_1g} per gram. Live tracking.`,
  };
}

export default async function Home() {
  const history = await getHistory();
  return <DashboardLayout history={history} cityName="Kochi" />;
}
