import { Metadata } from "next";
import { notFound } from "next/navigation";
import DashboardLayout, { KERALA_CITIES } from "@/components/DashboardLayout";
import { getHistory } from "../page";
import { getCityData } from "@/lib/cityData";

export const revalidate = 86400; // daily; freshness pushed on-demand by the update-rates cron (revalidatePath)

export function generateStaticParams() {
  return KERALA_CITIES.map((city) => ({
    city: city,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const p = await params;
  const cityName = p.city.charAt(0).toUpperCase() + p.city.slice(1);
  const history = await getHistory();
  const today = history[0] ?? null;

  const cityData = getCityData(p.city);
  const descPrefix = cityData?.metaDescriptionPrefix ? cityData.metaDescriptionPrefix + " " : "";

  if (!today) {
    return {
      title: `Gold Rate Today in ${cityName}, Kerala | LiveGold Kerala`,
      description: `${descPrefix}View the most recent 22K and 24K gold rates in ${cityName}, Kerala.`,
      alternates: { canonical: `/${p.city}` },
    };
  }

  const dateFormatted = new Date(today.date + "T00:00:00").toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return {
    // Same lead-with-the-head-phrase treatment as the homepage — city pages
    // are the ones Google actually surfaces for geo-personalised "gold rate
    // today" searches (see /kottayam picking up 76 impressions).
    title: `Gold Rate Today in ${cityName} (${dateFormatted}): 22K ₹${today.rate_22k_1g}/g`,
    description: `${descPrefix}Gold rate today in ${cityName}, Kerala: 22K at ₹${today.rate_22k_1g}/gram (₹${(today.rate_22k_1g * 8).toLocaleString("en-IN")}/pavan), 24K at ₹${today.rate_24k_1g}/gram. Live AKGSMA board rate.`,
    alternates: { canonical: `/${p.city}` },
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const p = await params;
  if (!KERALA_CITIES.includes(p.city)) notFound();
  const cityName = p.city.charAt(0).toUpperCase() + p.city.slice(1);
  const history = await getHistory();

  return <DashboardLayout history={history} cityName={cityName} />;
}
