import { Metadata } from "next";
import { createSupabaseReadClient } from "@/lib/supabase";
import SocialCardClient from "./SocialCardClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Daily Gold Rate Card for Social Media",
  description:
    "Download today's Kerala gold rate card image for sharing on Facebook, Instagram, and WhatsApp.",
  robots: { index: false, follow: false },
};

function fmt(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export default async function SocialPage() {
  const supabase = createSupabaseReadClient();
  const { data: rows } = await supabase
    .from("daily_gold_rates")
    .select("date, rate_22k_1g, rate_24k_1g")
    .eq("city", "Kochi")
    .order("date", { ascending: false })
    .limit(2);

  const latest = rows?.[0];
  const prev = rows?.[1];
  const rate22k = latest?.rate_22k_1g ?? 0;
  const change = prev ? rate22k - prev.rate_22k_1g : 0;

  const dateLabel = latest
    ? new Date(latest.date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Today";

  const changeStr = change > 0 ? `↑₹${change}` : change < 0 ? `↓₹${Math.abs(change)}` : "No change";

  const caption = `Today's Gold Rate in Kerala (${dateLabel})\n\n22K: ${fmt(rate22k)}/gram (${changeStr})\n24K: ${fmt(latest?.rate_24k_1g ?? 0)}/gram\n\nLive rates & calculators 👇\nhttps://www.livegoldkerala.com?utm_source=facebook&utm_medium=social&utm_campaign=daily_rate`;

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Daily Rate Card
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Download today&apos;s gold rate card and suggested caption for Facebook, Instagram &amp; WhatsApp.
        </p>
      </div>

      <SocialCardClient caption={caption} dateLabel={dateLabel} />
    </main>
  );
}
