import { Metadata } from "next";
import Link from "next/link";
import GoldImportDutyCalculator from "@/components/GoldImportDutyCalculator";
import { createSupabaseReadClient } from "@/lib/supabase";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "NRI Gold Import Duty Calculator | Kerala",
  description:
    "Calculate the exact airport customs duty for bringing gold into India from abroad based on the latest 2026 CBIC baggage rules.",
  alternates: { canonical: "/tools/gold-import-duty-calculator" },
  openGraph: {
    title: "NRI Gold Import Duty Calculator | Kerala",
    description:
      "Free tool to estimate the customs duty on gold jewelry when landing at airports in India.",
    url: "https://www.livegoldkerala.com/tools/gold-import-duty-calculator",
  },
};

async function getLatestRates() {
  try {
    const supabase = createSupabaseReadClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("rate_24k_1g")
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

const IMPORT_DUTY_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "NRI Gold Import Duty Calculator India",
  description:
    "Calculate the exact airport customs duty for bringing gold into India based on 2026 CBIC baggage rules. Free tool for NRIs flying into Kerala.",
  url: "https://www.livegoldkerala.com/tools/gold-import-duty-calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
});

export default async function GoldImportDutyCalculatorPage() {
  const rates = await getLatestRates();

  return (
    <>
      {/* Static JSON-LD schema — content is hardcoded, not from user input */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: IMPORT_DUTY_LD }} />
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">✨</span>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline">
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
              Tools · Gold Import Duty
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:gap-10 md:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl text-center">
          Terminal Customs Duty Estimator
        </h1>

        <GoldImportDutyCalculator initialGoldRate={rates?.rate_24k_1g || 14000} />

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/20 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-500 ring-1 ring-inset ring-amber-200/60 dark:ring-amber-900/40 transition-colors hover:bg-amber-100 dark:hover:bg-amber-900/40"
          >
            ← View Today&apos;s Gold Rates
          </Link>
        </div>
      </main>
    </>
  );
}
