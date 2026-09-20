import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";
import GoldReturnCalculator from "@/components/GoldReturnCalculator";
import SiblingCalculators from "@/components/SiblingCalculators";
import RelatedTools from "@/components/RelatedTools";

export const revalidate = 86400;

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

export async function generateMetadata(): Promise<Metadata> {
  const today = await getTodayRate();
  if (!today) {
    return {
      title: "Gold Return Calculator — Kerala AKGSMA Board Rate History",
      description:
        "See what your gold would be worth today. Calculate historical returns using the actual Kerala board rate back to April 2020 — 22K, per gram, per pavan. Free.",
      alternates: { canonical: "/tools/gold-return-calculator" },
    };
  }
  return {
    title: `Gold Return Calculator — Kerala 22K Now ₹${today.rate_22k_1g.toLocaleString("en-IN")}/g`,
    description: `See what gold bought in 2020, 2021, 2022 or later is worth today. Uses the real Kerala AKGSMA board rate — today's 22K is ₹${today.rate_22k_1g}/g. Free calculator.`,
    alternates: { canonical: "/tools/gold-return-calculator" },
    openGraph: {
      title: "What's Your Gold Worth Today? — Kerala Gold Return Calculator",
      description:
        "Enter any amount and any date since 2020. See today's value, absolute return, % return and annualised return — computed from the actual Kerala board rate.",
      url: "https://www.livegoldkerala.com/tools/gold-return-calculator",
    },
  };
}

export default async function GoldReturnCalculatorPage() {
  const today = await getTodayRate();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Kerala Gold Return Calculator",
    description:
      "Historical gold return calculator using the real Kerala AKGSMA board rate. Enter an amount and a past date; see today's value, absolute + percent + annualised return.",
    url: "https://www.livegoldkerala.com/tools/gold-return-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:py-10">
        <header>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            What if you&apos;d bought gold?
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            Enter an amount and a past date. We look up the actual Kerala AKGSMA board rate for that
            day — real, not estimated — and show what it would be worth today. Data goes back to
            April 2020.
          </p>
        </header>

        {today ? (
          <GoldReturnCalculator today={today} />
        ) : (
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-md dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">
              Rates are currently unavailable. Please check back shortly.
            </p>
          </div>
        )}

        <SiblingCalculators exclude={["/tools/gold-return-calculator"]} />

        {/* Why this exists / how to read the result */}
        <section className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
          <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100 md:text-lg">
            How the calculation works
          </h2>
          <p>
            Most online gold return tools multiply the international spot price by a currency rate.
            The number you actually pay at a Kerala jeweller is set by the{" "}
            <Link href="/blog/kerala-board-rate-vs-global-spot-price" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
              AKGSMA board rate
            </Link>{" "}
            — which includes import duty, GST on the metal, refining and local premium. So a spot-price
            calculator will tell you gold has done one thing while your actual holding did something
            slightly different. This tool uses the real board rate for every day back to April 2020.
          </p>
          <p>
            The three numbers to read: <strong className="text-zinc-800 dark:text-zinc-200">total
            return</strong> is what you would have made in rupees;{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">% return</strong> is that as a
            fraction of what you put in; and{" "}
            <strong className="text-zinc-800 dark:text-zinc-200">annualised</strong> is what the
            same result works out to per year — the fair way to compare a 2-year holding with a
            5-year one.
          </p>
          <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-500">
            The result is the pure metal value only. It excludes making charges (8–25% depending on
            design) and 3% GST that jewellers add on top of the board rate — see the{" "}
            <Link href="/tools/gold-making-charge-calculator" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
              making charge calculator
            </Link>{" "}
            for that. Historical returns are not a guarantee of future performance — but they are the
            actual AKGSMA history, not a projection.
          </p>
        </section>

        <Suspense fallback={null}>
          <RelatedTools exclude={["/tools/gold-return-calculator"]} />
        </Suspense>
      </main>
    </>
  );
}
