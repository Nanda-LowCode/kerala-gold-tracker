import type { Metadata } from "next";
import { createSupabaseReadClient } from "@/lib/supabase";
import RelatedTools from "@/components/RelatedTools";
import MyGoldClient from "./MyGoldClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "My Gold — Track Your Kerala Gold Portfolio",
  description:
    "Log the gold you own and see what it's worth today. Enter the weight and the date you bought, and each purchase is priced automatically from the actual Kerala board rate on that day. Free, private, no sign-up.",
  alternates: { canonical: "/my-gold" },
  openGraph: {
    title: "My Gold — Track Your Kerala Gold Portfolio",
    description:
      "See what your gold is worth today. Purchases are priced from the real Kerala board rate on the day you bought. Free, private, no sign-up.",
    url: "https://www.livegoldkerala.com/my-gold",
  },
};

async function getTodayRate() {
  try {
    const supabase = createSupabaseReadClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("date, rate_18k_1g, rate_22k_1g, rate_24k_1g")
      .eq("city", "Kochi")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function MyGoldPage() {
  const today = await getTodayRate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "My Gold — Kerala Gold Portfolio Tracker",
    description:
      "Track the gold you own and see its current value at the Kerala board rate. Each purchase is priced from the historical board rate on the date it was bought.",
    url: "https://www.livegoldkerala.com/my-gold",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            My Gold
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Add the gold you own and see what it&apos;s worth today. Enter the weight and the date
            you bought it — we&apos;ll price it from the actual Kerala board rate on that day, so you
            don&apos;t have to remember what you paid.
          </p>
        </div>

        {today ? (
          <MyGoldClient today={today} />
        ) : (
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Gold rates are currently unavailable. Please check back shortly.
            </p>
          </div>
        )}

        <RelatedTools exclude={["/my-gold"]} />
      </main>
    </>
  );
}
