import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";

export const revalidate = 86400; // daily

const BASE = "https://www.livegoldkerala.com";

export const metadata: Metadata = {
  title: "Kerala Gold Price Trends (2020–2026): How 22K Gold Tripled | LiveGold Kerala",
  description:
    "A data study of Kerala gold prices since 2020: 22K gold has more than tripled, far outpacing bank fixed deposits and inflation. Year-by-year averages, annual return (CAGR), all-time high, and what ₹1 lakh of gold would be worth now.",
  alternates: { canonical: "/kerala-gold-price-trends" },
  openGraph: {
    title: "Kerala Gold Price Trends (2020–2026) — A Data Study",
    description:
      "How 22K gold tripled in Kerala since 2020, vs a bank FD and inflation. Year-by-year averages, the 2024–2026 surge, and what ₹1 lakh of gold would be worth now.",
    url: `${BASE}/kerala-gold-price-trends`,
    type: "article",
  },
};

type AnnualStat = {
  yr: number;
  avg_22k: number;
  low_22k: number;
  high_22k: number;
  n: number;
  has_real: boolean;
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

async function getData() {
  const supabase = createSupabaseReadClient();
  const [{ data: annualRaw }, { data: firstRow }, { data: lastRow }] = await Promise.all([
    supabase.rpc("kerala_gold_annual_stats"),
    supabase.from("daily_gold_rates").select("date, rate_22k_1g").eq("city", "Kochi").order("date", { ascending: true }).limit(1),
    supabase.from("daily_gold_rates").select("date, rate_22k_1g").eq("city", "Kochi").order("date", { ascending: false }).limit(1),
  ]);

  const annual: AnnualStat[] = (annualRaw ?? []).map((r: Record<string, unknown>) => ({
    yr: Number(r.yr),
    avg_22k: Number(r.avg_22k),
    low_22k: Number(r.low_22k),
    high_22k: Number(r.high_22k),
    n: Number(r.n),
    has_real: Boolean(r.has_real),
  }));

  return {
    annual,
    first: firstRow?.[0] ?? null,
    last: lastRow?.[0] ?? null,
  };
}

export default async function GoldPriceTrendsPage() {
  const { annual, first, last } = await getData();

  if (annual.length < 2 || !first || !last) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-zinc-500">
        Trend data is being prepared. Check back soon.
      </main>
    );
  }

  const firstRate = first.rate_22k_1g;
  const lastRate = last.rate_22k_1g;
  const firstYear = new Date(first.date + "T00:00:00").getFullYear();
  const lastYear = new Date(last.date + "T00:00:00").getFullYear();
  const totalPct = Math.round(((lastRate - firstRate) / firstRate) * 100);
  const multiple = (lastRate / firstRate).toFixed(1);
  const allHigh = Math.max(...annual.map((a) => a.high_22k));
  const allLow = Math.min(...annual.map((a) => a.low_22k));
  const maxAvg = Math.max(...annual.map((a) => a.avg_22k));

  // What ₹1,00,000 of 22K gold bought at the start would be worth now.
  const gramsFor1L = 100000 / firstRate;
  const worthNow = gramsFor1L * lastRate;

  // Annualised return (CAGR) over the exact period, and an illustrative
  // comparison against a bank FD and inflation on the same ₹1,00,000.
  const yearsElapsed =
    (new Date(last.date + "T00:00:00").getTime() - new Date(first.date + "T00:00:00").getTime()) /
    (365.25 * 86400000);
  const cagr = (Math.pow(lastRate / firstRate, 1 / yearsElapsed) - 1) * 100;
  const FD_RATE = 0.065; // representative average Indian bank FD over the period
  const INFLATION = 0.055; // representative average CPI over the period
  const fdWorth = 100000 * Math.pow(1 + FD_RATE, yearsElapsed);
  const inflWorth = 100000 * Math.pow(1 + INFLATION, yearsElapsed);

  // The year that set the all-time high (for the "peaked then eased" note).
  const highYear = annual.find((a) => a.high_22k === allHigh)?.yr ?? lastYear;

  const stats = [
    { label: `Total rise (22K, ${firstYear}–${lastYear})`, value: `+${totalPct}%` },
    { label: "Price multiple", value: `${multiple}×` },
    { label: "Annual return (CAGR)", value: `~${cagr.toFixed(0)}%/yr` },
    { label: "All-time high (22K/g)", value: inr(allHigh) },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Kerala Gold Price Trends (22K), 2020–2026",
    description:
      "Year-by-year average, high and low 22K gold rate per gram in Kerala from 2020 to 2026, derived from the AKGSMA Kerala board rate (April 2026 onward) and calibrated international gold prices for earlier years.",
    url: `${BASE}/kerala-gold-price-trends`,
    creator: { "@type": "Organization", name: "LiveGold Kerala", url: BASE },
    temporalCoverage: `${firstYear}/${lastYear}`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
    keywords: ["Kerala gold price", "22K gold rate history", "gold price trend India"],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />


      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Kerala Gold Price Trends ({firstYear}–{lastYear}): How 22K Gold Tripled
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-base">
          Gold has been one of the best-performing assets for Kerala households this decade. The
          22K (916) board rate has climbed from about {inr(firstRate)} per gram in {firstYear} to{" "}
          {inr(lastRate)} today — a rise of <strong>+{totalPct}%</strong> ({multiple}× the price).
          This study breaks down the year-by-year trend and the dramatic {lastYear - 2} -year surge
          that reshaped gold buying in Kerala.
        </p>

        {/* Key stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-amber-200/50 bg-amber-50/40 p-3 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{s.label}</p>
              <p className="mt-0.5 text-base font-bold text-amber-700 dark:text-amber-400">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Annual averages with inline bars */}
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Average 22K gold rate by year
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Yearly average price per gram, with the year-on-year change.
          </p>
          <div className="mt-4 space-y-2.5">
            {annual.map((a, i) => {
              const prev = i > 0 ? annual[i - 1].avg_22k : null;
              const yoy = prev ? ((a.avg_22k - prev) / prev) * 100 : null;
              return (
                <div key={a.yr} className="flex items-center gap-3">
                  <span className="w-10 shrink-0 text-sm font-bold text-zinc-700 dark:text-zinc-300">{a.yr}</span>
                  <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                    <div
                      className="flex h-full items-center justify-end rounded-md bg-gradient-to-r from-amber-400 to-amber-600 pr-2"
                      style={{ width: `${Math.max((a.avg_22k / maxAvg) * 100, 12)}%` }}
                    >
                      <span className="text-[11px] font-bold text-white">{inr(a.avg_22k)}</span>
                    </div>
                  </div>
                  <span
                    className={`w-16 shrink-0 text-right text-xs font-semibold ${
                      yoy === null ? "text-zinc-500" : yoy >= 0 ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"
                    }`}
                  >
                    {yoy === null ? "—" : `${yoy >= 0 ? "+" : ""}${yoy.toFixed(0)}%`}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            {lastYear} is a partial year (to date). Range over the full period: {inr(allLow)}–{inr(allHigh)} per gram.
          </p>
        </section>

        {/* The surge */}
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            The 2024–2026 surge
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            For the first half of the decade, Kerala gold moved gently — the yearly average sat
            between {inr(annual[0].avg_22k)} and {inr(annual[3].avg_22k)} from {annual[0].yr} to{" "}
            {annual[3].yr}. Then it accelerated sharply: the average jumped to{" "}
            {inr(annual[Math.min(4, annual.length - 1)].avg_22k)} in {annual[Math.min(4, annual.length - 1)].yr},{" "}
            {annual.length > 5 ? `${inr(annual[5].avg_22k)} in ${annual[5].yr}, ` : ""}
            and {inr(annual[annual.length - 1].avg_22k)} in {annual[annual.length - 1].yr}. In other words,
            22K gold roughly doubled in barely two years — driven by global gold demand, a softer
            rupee, and safe-haven buying.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            22K gold reached an all-time high of <strong>{inr(allHigh)}/g</strong> in {highYear}
            {lastRate < allHigh
              ? `, and has since eased to ${inr(lastRate)}/g — about ${Math.round(((allHigh - lastRate) / allHigh) * 100)}% off the peak.`
              : "."}{" "}
            Day-to-day movements are shown on our{" "}
            <Link href="/gold-rate-history" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
              full rate history
            </Link>.
          </p>
        </section>

        {/* Gold vs FD vs inflation — the comparison Kerala savers actually search for */}
        <section className="mt-10 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Gold vs a bank FD vs inflation
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            The question every Kerala saver asks: was gold better than leaving the money in the bank?
            Take {inr(100000)} in {firstYear} (about {gramsFor1L.toFixed(1)} g of 22K at {inr(firstRate)}/g).
            Over {yearsElapsed.toFixed(1)} years, here is what it became:
          </p>
          <div className="mt-4 space-y-2.5">
            {[
              { label: "22K gold", sub: `metal value · ~${cagr.toFixed(0)}%/yr`, value: worthNow, accent: true },
              { label: "Bank fixed deposit", sub: "at ~6.5% / yr", value: fdWorth, accent: false },
              { label: "Just keeping up with inflation", sub: "at ~5.5% / yr", value: inflWorth, accent: false },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <div className="w-36 shrink-0 sm:w-44">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{row.label}</p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">{row.sub}</p>
                </div>
                <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className={`flex h-full items-center justify-end rounded-md pr-2 ${
                      row.accent
                        ? "bg-gradient-to-r from-amber-400 to-amber-600"
                        : "bg-gradient-to-r from-zinc-400 to-zinc-500 dark:from-zinc-600 dark:to-zinc-700"
                    }`}
                    style={{ width: `${Math.max((row.value / worthNow) * 100, 14)}%` }}
                  >
                    <span className="text-[11px] font-bold text-white">{inr(row.value)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Gold is the metal value only (excludes making charges &amp; 3% GST; resale is on the gold
            value, not making charges). FD and inflation use representative average rates over the
            period and are illustrative, not guaranteed. See the full{" "}
            <Link href="/blog/gold-vs-fixed-deposit-india" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
              gold vs fixed deposit
            </Link>{" "}
            breakdown.
          </p>
        </section>

        {/* Methodology */}
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Methodology &amp; sources</h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
            <li>
              <strong>From April 2026:</strong> figures are the actual daily <strong>AKGSMA Kerala
              board rate</strong> (All Kerala Gold &amp; Silver Merchants Association) — the official
              22K rate used by jewellers across Kerala.
            </li>
            <li>
              <strong>Before April 2026:</strong> figures are <em>estimated</em> from the international
              gold spot price (COMEX) converted to INR and calibrated to the Kerala board rate. They
              track the trend closely but are indicative, not official historical quotes.
            </li>
            <li>
              Based on {annual.reduce((s, a) => s + a.n, 0).toLocaleString("en-IN")} daily data points
              for Kochi, {firstYear}–{lastYear}. Browse the{" "}
              <Link href="/gold-rate-history" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">full rate history</Link>{" "}
              or any{" "}
              <Link href={`/gold-rate-history/${lastYear}`} className="font-semibold text-amber-700 hover:underline dark:text-amber-400">year page</Link>.
            </li>
          </ul>
        </section>

        {/* Citation block — encourages attribution backlinks */}
        <section className="mt-8 rounded-xl border border-zinc-200/70 bg-zinc-50/70 p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900/50">
          <p className="font-bold text-zinc-800 dark:text-zinc-100">Cite this data</p>
          <p className="mt-1 text-zinc-600 dark:text-zinc-300">
            Free to use with attribution (CC BY 4.0). Please credit and link to LiveGold Kerala:
          </p>
          <p className="mt-2 rounded-lg bg-white px-3 py-2 font-mono text-xs text-zinc-600 ring-1 ring-zinc-200 dark:bg-zinc-950 dark:text-zinc-400 dark:ring-zinc-800">
            “Kerala Gold Price Trends ({firstYear}–{lastYear}),” LiveGold Kerala. {BASE}/kerala-gold-price-trends
          </p>
        </section>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Today&apos;s Rate
          </Link>
          <Link href="/gold-rate-history" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Full History &amp; Chart →
          </Link>
        </div>
      </main>

    </>
  );
}
