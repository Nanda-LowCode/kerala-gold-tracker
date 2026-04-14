import { Metadata } from "next";
import { createSupabaseReadClient } from "@/lib/supabase";
import { GoldRate } from "@/lib/types";
import DashboardLayout from "@/components/DashboardLayout";
import { getCityData } from "@/lib/cityData";

export const revalidate = 3600; // Revalidate every 60 minutes

export async function getHistory(): Promise<GoldRate[]> {
  try {
    const supabase = createSupabaseReadClient();
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

  const cityData = getCityData("Kochi");
  const descPrefix = cityData?.metaDescriptionPrefix ? cityData.metaDescriptionPrefix + " " : "";

  if (!today) {
    return {
      title: "Today's Gold Rate in Kochi | LiveGold Kerala",
      description: `${descPrefix}View the most recent 22K and 24K gold rates in Kochi, Kerala.`,
      alternates: { canonical: "/" },
    };
  }

  const dateFormatted = new Date(today.date + "T00:00:00").toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return {
    title: `Today's Gold Rate in Kochi (${dateFormatted}): 22K @ ₹${today.rate_22k_1g}/g`,
    description: `${descPrefix}Current gold price in Kerala today: 22 Karat is ₹${today.rate_22k_1g} per gram (₹${today.rate_22k_1g * 8} per pavan). 24 Karat is ₹${today.rate_24k_1g} per gram. Live tracking.`,
    alternates: { canonical: "/" },
  };
}

export default async function Home() {
  const history = await getHistory();
  return <DashboardLayout history={history} cityName="Kochi" />;
}
