import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";
import GoldCalculator from "@/components/GoldCalculator";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kerala Gold Making Charge & GST Calculator",
  description:
    "Calculate the total cost of gold jewelry in Kerala including making charges (8%–25%) and 3% GST. Estimate showroom prices for 22K, 24K, and 18K gold with our free calculator.",
  alternates: { canonical: "/tools/gold-making-charge-calculator" },
  openGraph: {
    title: "Kerala Gold Making Charge & GST Calculator",
    description:
      "Free tool to estimate Kerala jewelry prices with making charges and GST included.",
    url: "https://www.livegoldkerala.com/tools/gold-making-charge-calculator",
  },
};

async function getLatestRates() {
  try {
    const supabase = createSupabaseReadClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("rate_18k_1g, rate_22k_1g, rate_24k_1g")
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

export default async function GoldMakingChargeCalculatorPage() {
  const rates = await getLatestRates();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Kerala Gold Making Charge & GST Calculator",
    description:
      "Calculate the total cost of gold jewelry in Kerala including making charges and 3% GST.",
    url: "https://www.livegoldkerala.com/tools/gold-making-charge-calculator",
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
      {/* Static hardcoded JSON-LD, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">✨</span>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg hover:underline">
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
              Tools · Making Charge Calculator
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:gap-10 md:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
          Kerala Gold Making Charge &amp; GST Calculator
        </h1>

        {rates ? (
          <GoldCalculator
            rate18k={rates.rate_18k_1g}
            rate22k={rates.rate_22k_1g}
            rate24k={rates.rate_24k_1g}
          />
        ) : (
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-md">
            <p className="text-sm text-zinc-500">
              Gold rates are currently unavailable. Please check back shortly.
            </p>
          </div>
        )}

        <section className="space-y-4 text-sm leading-relaxed text-zinc-600 md:text-base">
          <p>
            When you buy gold jewelry from a showroom in Kerala, the price you
            pay is more than just the gold value. Jewellers add a{" "}
            <strong className="text-zinc-800">making charge</strong> — typically
            between <strong className="text-zinc-800">8% and 25%</strong> of the
            gold value — to cover the cost of craftsmanship, design, and
            wastage. Simple designs like chains and plain bangles sit at the
            lower end, while intricate antique or temple jewellery can reach the
            higher end.
          </p>
          <p>
            On top of the gold value and making charges, the Government of India
            levies a mandatory{" "}
            <strong className="text-zinc-800">3% GST</strong> on the total
            invoice amount (gold + making charge). This tax is uniform across
            all states and applies whether you buy from a large chain or a local
            jeweller. Understanding this breakdown helps you compare quotes from
            different showrooms and avoid overpaying.
          </p>
          <p>
            Use the calculator above to enter your desired weight and purity,
            adjust the making charge percentage, and instantly see how the final
            price is split between gold value, making charge, and GST. It is a
            quick way to plan your jewelry budget before visiting a store.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100"
          >
            ← View Today&apos;s Gold Rates
          </Link>
          <Link
            href="/tools/old-gold-exchange-calculator"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100"
          >
            Old Gold Exchange Estimator →
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 pt-6 pb-8">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6 flex flex-wrap justify-center gap-3 text-xs font-medium">
            <Link href="/" className="text-zinc-500 hover:text-zinc-800">Today&apos;s Rate</Link>
            <span className="text-zinc-300">·</span>
            <Link href="/tools/old-gold-exchange-calculator" className="text-zinc-500 hover:text-zinc-800">Old Gold Exchange</Link>
            <span className="text-zinc-300">·</span>
            <Link href="/blog" className="text-zinc-500 hover:text-zinc-800">Gold Knowledge Hub</Link>
          </div>
          <div className="text-center text-xs text-zinc-400">
            <p className="font-medium">
              Data sourced from Malabar Gold &amp; Diamonds · For reference only
            </p>
            <p className="mt-1.5">© 2026 LiveGold Kerala</p>
          </div>
        </div>
      </footer>
    </>
  );
}
