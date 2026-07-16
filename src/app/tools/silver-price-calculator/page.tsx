import { Metadata } from "next";
import Link from "next/link";
import { getHistory } from "@/app/page";
import SilverCalculator from "@/components/SilverCalculator";

export const revalidate = 86400; // daily; freshness pushed on-demand by the update-rates cron (revalidatePath)

export const metadata: Metadata = {
  title: "Silver Price Calculator Kerala — Making Charges & GST | LiveGold Kerala",
  description:
    "Calculate the total price of silver in Kerala — anklets, coins, utensils and jewellery. Enter weight and purity (999 or 925 sterling) to see silver value, making charges and 3% GST at today's silver rate.",
  alternates: { canonical: "/tools/silver-price-calculator" },
  openGraph: {
    title: "Silver Price Calculator Kerala — Making Charges & GST",
    description: "Estimate silver jewellery, coin and utensil prices in Kerala with making charges and GST.",
    url: "https://www.livegoldkerala.com/tools/silver-price-calculator",
  },
};

export default async function SilverCalculatorPage() {
  const history = await getHistory();
  const rate999 = history[0]?.rate_silver_1g ?? null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Silver Price Calculator Kerala",
    description: "Calculate the total cost of silver in Kerala including making charges and 3% GST.",
    url: "https://www.livegoldkerala.com/tools/silver-price-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-8 md:gap-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Silver Price Calculator (Kerala)
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            Work out the real price of silver — anklets (<em>kolusu</em>), coins, gift utensils or
            jewellery. Enter weight and purity to see the silver value, making charge and 3% GST at
            today&apos;s silver rate.
          </p>
          {rate999 && (
            <p className="mt-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              Live 999 silver rate: ₹{rate999.toLocaleString("en-IN")}/g ·{" "}
              <Link href="/silver-rate-kerala" className="text-amber-700 hover:underline dark:text-amber-400">
                see the full silver rate
              </Link>
            </p>
          )}
        </div>

        {rate999 ? (
          <SilverCalculator rate999={rate999} />
        ) : (
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-8 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
            Silver rate is unavailable right now — please check back shortly.
          </div>
        )}

        <section className="space-y-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">How silver pricing works in Kerala</h2>
          <p>
            Silver is billed on the metal value (weight × silver rate, adjusted for purity), plus a{" "}
            <strong className="text-zinc-700 dark:text-zinc-300">making charge</strong> and 3% GST.
            Coins and bars carry little or no making charge; anklets and intricate jewellery can run
            10–25% or a flat per-gram rate. <strong className="text-zinc-700 dark:text-zinc-300">925
            sterling</strong> (92.5% pure) is common for jewellery and utensils, while{" "}
            <strong className="text-zinc-700 dark:text-zinc-300">999 fine</strong> is used for coins
            and investment bars.
          </p>
        </section>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/silver-rate-kerala" className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-200/60 transition-colors hover:bg-slate-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            ← Silver Rate Today
          </Link>
          <Link href="/tools/gold-making-charge-calculator" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Gold Making Charge Calculator →
          </Link>
        </div>
      </main>
    </>
  );
}
