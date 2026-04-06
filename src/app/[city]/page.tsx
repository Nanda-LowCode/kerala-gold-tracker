import { Metadata } from "next";
import DashboardLayout, { KERALA_CITIES } from "@/components/DashboardLayout";
import { getHistory } from "../page";

export const revalidate = 300;

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

  if (!today) {
    return {
      title: `Today's Gold Rate in ${cityName} | LiveGold Kerala`,
      description: `View the most recent 22K and 24K gold rates in ${cityName}, Kerala.`,
    };
  }

  const dateFormatted = new Date(today.date + "T00:00:00").toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

  return {
    title: `Today's Gold Rate in ${cityName} (${dateFormatted}): 22K @ ₹${today.rate_22k_1g}/g`,
    description: `Current gold price in Kerala today: 22 Karat is ₹${today.rate_22k_1g} per gram (₹${today.rate_22k_1g * 8} per pavan). 24 Karat is ₹${today.rate_24k_1g} per gram. Live tracking.`,
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const p = await params;
  const cityName = p.city.charAt(0).toUpperCase() + p.city.slice(1);
  const history = await getHistory();
  
  return <DashboardLayout history={history} cityName={cityName} />;
}
