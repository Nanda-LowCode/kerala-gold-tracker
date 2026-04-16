import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";
import OldGoldCalculator from "@/components/OldGoldCalculator";
import GlobalSettingsBar from "@/components/GlobalSettingsBar";
import { GlobalSettingsProvider } from "@/hooks/useGlobalSettings";
import { fetchCurrencyRates } from "@/lib/fetchCurrencyRates";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Old Gold Exchange & Melting Loss Calculator | Kerala",
  description:
    "Calculate the resale or exchange value of your old 22K and 18K gold jewelry in Kerala. Estimate melting loss (2%–5%), wastage deductions, and the net cash value you can expect from jewellers.",
  alternates: { canonical: "/tools/old-gold-exchange-calculator" },
  openGraph: {
    title: "Old Gold Exchange & Melting Loss Calculator | Kerala",
    description:
      "Free tool to estimate the exchange or cash value of old gold after melting loss and wastage deductions.",
    url: "https://livegoldkerala.com/tools/old-gold-exchange-calculator",
  },
};

async function getLatestRates() {
  try {
    const supabase = createSupabaseReadClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("rate_18k_1g, rate_22k_1g")
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

export default async function OldGoldExchangeCalculatorPage() {
  const rates = await getLatestRates();
  const initialRates = await fetchCurrencyRates();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Old Gold Exchange & Melting Loss Calculator",
    description:
      "Estimate the resale or exchange value of old gold jewelry after melting loss and wastage deductions.",
    url: "https://livegoldkerala.com/tools/old-gold-exchange-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is melting loss?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "When a jeweller melts down old ornaments, 2% to 5% of the weight is lost due to impurities, solder, dirt, and rhodium plating that burn off during the process.",
        },
      },
      {
        "@type": "Question",
        name: "Will I get cash or exchange value?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Exchanging old gold for new jewelry almost always gives a better rate than a direct cash payout, because the jeweller saves on sourcing new metal.",
        },
      },
    ],
  };

  return (
    <>
      {/* Static hardcoded JSON-LD, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
              Tools · Old Gold Exchange
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:gap-10 md:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
          Old Gold Exchange &amp; Melting Loss Calculator
        </h1>

        {rates ? (
          <GlobalSettingsProvider initialRates={initialRates}>
            <GlobalSettingsBar />
            <OldGoldCalculator
              rate18k={rates.rate_18k_1g}
              rate22k={rates.rate_22k_1g}
            />
          </GlobalSettingsProvider>
        ) : (
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-md">
            <p className="text-sm text-zinc-500">
              Gold rates are currently unavailable. Please check back shortly.
            </p>
          </div>
        )}

        <section>
          <h2 className="mb-4 text-lg font-bold tracking-tight text-zinc-900 md:text-xl">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200/70 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-800 md:text-base">
                What is melting loss?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                When a jeweller melts down your old ornaments, a small
                percentage of the weight is lost due to impurities, solder,
                dirt, and rhodium plating that burn off during the process.
                This deduction — commonly called{" "}
                <strong className="text-zinc-800">melting loss</strong> or{" "}
                <strong className="text-zinc-800">wastage</strong> — typically
                ranges from <strong className="text-zinc-800">2% to 5%</strong>{" "}
                of the total weight, depending on the condition and age of the
                jewelry.
              </p>
            </div>

            <div className="rounded-xl border border-zinc-200/70 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-bold text-zinc-800 md:text-base">
                Will I get cash or exchange value?
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                Most Kerala jewellers offer two options:{" "}
                <strong className="text-zinc-800">cash purchase</strong> or{" "}
                <strong className="text-zinc-800">exchange for new gold</strong>.
                Exchanging your old gold for new jewelry almost always gives you
                a better rate because the jeweller saves on sourcing new metal.
                If you opt for a direct cash payout, expect the offered price to
                be slightly lower than the prevailing market rate.
              </p>
            </div>
          </div>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100"
          >
            ← View Today&apos;s Gold Rates
          </Link>
          <Link
            href="/tools/gold-making-charge-calculator"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100"
          >
            Making Charge Calculator →
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 pt-6 pb-8">
        <div className="mx-auto max-w-3xl px-4">
          <div className="mb-6 flex flex-wrap justify-center gap-3 text-xs font-medium">
            <Link href="/" className="text-zinc-500 hover:text-zinc-800">Today&apos;s Rate</Link>
            <span className="text-zinc-300">·</span>
            <Link href="/tools/gold-making-charge-calculator" className="text-zinc-500 hover:text-zinc-800">Making Charge Calculator</Link>
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
