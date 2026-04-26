import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";
import PavanCalculator from "@/components/PavanCalculator";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pavan to Gram Gold Calculator — Kerala Sovereign & Tola Converter",
  description:
    "Convert between pavan, sovereign, gram, and tola instantly and see the gold value at today's Kerala rate. 1 pavan = 8 grams. Free gold unit converter for Kerala buyers.",
  alternates: { canonical: "/tools/pavan-to-gram-calculator" },
  openGraph: {
    title: "Pavan to Gram Gold Calculator — Kerala",
    description:
      "Convert pavan, sovereign, gram, and tola with live Kerala gold rates. Free gold unit converter.",
    url: "https://www.livegoldkerala.com/tools/pavan-to-gram-calculator",
  },
};

async function getLatestRates() {
  try {
    const supabase = createSupabaseReadClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("rate_22k_1g, rate_24k_1g")
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

const UNIT_FACTS = [
  {
    term: "Pavan",
    detail:
      "The standard gold unit used across Kerala, Tamil Nadu, and Karnataka. Exactly 8 grams. Most jewellery is quoted per pavan in South Indian showrooms.",
  },
  {
    term: "Sovereign",
    detail:
      "Identical to pavan in South India — 8 grams. The term comes from the British gold sovereign coin and is used interchangeably with pavan.",
  },
  {
    term: "Tola",
    detail:
      "Traditional unit from the Mughal era, still used in North India and wholesale markets. 1 tola = 11.664 grams, equal to 180 grains.",
  },
  {
    term: "Gram",
    detail:
      "The SI unit. International gold markets price per troy ounce (31.1035 g), but Indian retail rates are always quoted per gram.",
  },
];

const REFERENCE_ROWS = [
  { label: "1 Pavan", grams: 8 },
  { label: "1 Sovereign", grams: 8 },
  { label: "1 Tola", grams: 11.664 },
  { label: "1 Gram", grams: 1 },
  { label: "10 Grams", grams: 10 },
  { label: "1 Troy Ounce", grams: 31.1035 },
];

export default async function PavanToGramCalculatorPage() {
  const rates = await getLatestRates();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Pavan to Gram Gold Calculator — Kerala",
    description:
      "Convert between pavan, sovereign, gram, and tola and instantly see the gold value at today's Kerala board rate.",
    url: "https://www.livegoldkerala.com/tools/pavan-to-gram-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many grams is 1 pavan of gold?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "1 pavan (also called sovereign) equals exactly 8 grams of gold. It is the standard unit used across Kerala, Tamil Nadu, and Karnataka jewellery showrooms.",
        },
      },
      {
        "@type": "Question",
        name: "What is a tola in gold measurement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "1 tola equals 11.664 grams of gold. It is a traditional Mughal-era unit still used in North India and Gulf wholesale markets.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between pavan and sovereign?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Pavan and sovereign are identical in South India — both equal 8 grams. The term sovereign comes from the British gold sovereign coin and is used interchangeably with pavan.",
        },
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">⚖️</span>
          <div>
            <Link
              href="/"
              className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline"
            >
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Tools · Pavan / Gram Converter
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Pavan to Gram Gold Calculator
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Convert between pavan, sovereign, gram, and tola — and instantly see the gold value at
            today&apos;s Kerala rate.
          </p>
        </div>

        {rates ? (
          <PavanCalculator rate22k={rates.rate_22k_1g} rate24k={rates.rate_24k_1g} />
        ) : (
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">
              Gold rates are currently unavailable. Please check back shortly.
            </p>
          </div>
        )}

        {/* Static reference table */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100 md:text-lg">
            Standard gold unit conversion table
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Unit
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Grams
                  </th>
                  {rates && (
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      22K Today
                    </th>
                  )}
                  {rates && (
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
                      24K Today
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {REFERENCE_ROWS.map((row) => (
                  <tr
                    key={row.label}
                    className="transition-colors hover:bg-amber-50/30 dark:hover:bg-zinc-800/50"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">
                      {row.grams}
                    </td>
                    {rates && (
                      <td className="px-4 py-3 text-right font-semibold text-zinc-800 dark:text-zinc-200">
                        ₹{Math.round(row.grams * rates.rate_22k_1g).toLocaleString("en-IN")}
                      </td>
                    )}
                    {rates && (
                      <td className="px-4 py-3 text-right font-bold text-amber-700 dark:text-amber-400">
                        ₹{Math.round(row.grams * rates.rate_24k_1g).toLocaleString("en-IN")}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Explainer */}
        <section className="space-y-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100 md:text-lg">
            Pavan, sovereign, tola — what&apos;s the difference?
          </h2>
          <div className="space-y-4">
            {UNIT_FACTS.map((f) => (
              <div key={f.term} className="flex gap-3">
                <span className="mt-0.5 shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 ring-1 ring-amber-300/60 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-500/40">
                  {f.term}
                </span>
                <p>{f.detail}</p>
              </div>
            ))}
          </div>
          <p>
            When comparing jewellery prices across showrooms, always ask whether the quoted rate is
            per gram or per pavan. Kerala jewellers display the official board rate per gram, but
            making charges are often quoted per pavan. The converter above helps you keep track of
            both.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60"
          >
            ← Today&apos;s Gold Rate
          </Link>
          <Link
            href="/tools/gold-making-charge-calculator"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          >
            Making Charge Calculator →
          </Link>
          <Link
            href="/tools/hallmark-gold-calculator"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          >
            Hallmark Calculator →
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 pt-6 pb-8 dark:border-zinc-800/80 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <p className="font-medium">
            AKGSMA · For reference only
          </p>
          <p className="mt-1.5">© 2026 LiveGold Kerala</p>
        </div>
      </footer>
    </>
  );
}
