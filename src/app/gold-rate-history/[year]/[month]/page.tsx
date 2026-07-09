import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseReadClient } from "@/lib/supabase";
import type { GoldRate } from "@/lib/types";

export const revalidate = 86400;

// Month archive pages — target the "gold rate {month} {year} kerala" cluster
// (GSC shows ~30 such queries at pos 6–12 with no dedicated page; the year
// pages only aggregate monthly averages).

const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
];
const MONTH_LABELS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

// First real (non-backfill) data month — earlier months are calibrated estimates.
const FIRST_REAL = "2026-04";

type RouteParams = { params: Promise<{ year: string; month: string }> };

function monthIndex(month: string): number {
  return MONTHS.indexOf(month.toLowerCase());
}

async function getMonthRows(year: string, mIdx: number): Promise<GoldRate[]> {
  if (!/^\d{4}$/.test(year) || mIdx < 0) return [];
  const mm = String(mIdx + 1).padStart(2, "0");
  const lastDay = new Date(Number(year), mIdx + 1, 0).getDate();
  const supabase = createSupabaseReadClient();
  const { data, error } = await supabase
    .from("daily_gold_rates")
    .select("date, rate_18k_1g, rate_22k_1g, rate_24k_1g")
    .eq("city", "Kochi")
    .gte("date", `${year}-${mm}-01`)
    .lte("date", `${year}-${mm}-${String(lastDay).padStart(2, "0")}`)
    .order("date", { ascending: true });
  if (error || !data) return [];
  return data as GoldRate[];
}

export async function generateStaticParams() {
  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("date")
    .eq("city", "Kochi")
    .order("date", { ascending: true })
    .limit(1);
  const start = data?.[0]?.date ? new Date(data[0].date + "T00:00:00") : new Date();
  const now = new Date();
  const params: { year: string; month: string }[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cursor <= now) {
    params.push({ year: String(cursor.getFullYear()), month: MONTHS[cursor.getMonth()] });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return params;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { year, month } = await params;
  const mIdx = monthIndex(month);
  const rows = await getMonthRows(year, mIdx);
  if (rows.length === 0) {
    return { title: "Gold Rate History — Month Not Found", robots: { index: false } };
  }
  const label = `${MONTH_LABELS[mIdx]} ${year}`;
  const r22 = rows.map((r) => r.rate_22k_1g);
  const high = Math.max(...r22);
  const low = Math.min(...r22);
  const avg = Math.round(r22.reduce((a, b) => a + b, 0) / r22.length);
  const title = `Gold Rate in Kerala ${label} — Daily 22K & 24K Prices`;
  return {
    title,
    description: `Kerala gold rate in ${label}: 22K ranged ${inr(low)}–${inr(high)} per gram (average ${inr(avg)}, ${inr(avg * 8)}/pavan). Day-by-day 22K and 24K board rates for the full month.`,
    alternates: { canonical: `/gold-rate-history/${year}/${month.toLowerCase()}` },
    openGraph: { title, description: `Day-by-day Kerala gold rates for ${label}.`, type: "article" },
  };
}

export default async function MonthHistoryPage({ params }: RouteParams) {
  const { year, month } = await params;
  const mIdx = monthIndex(month);
  if (mIdx === -1) notFound();
  const rows = await getMonthRows(year, mIdx);
  if (rows.length === 0) notFound();

  const label = `${MONTH_LABELS[mIdx]} ${year}`;
  const r22 = rows.map((r) => r.rate_22k_1g);
  const high = Math.max(...r22);
  const low = Math.min(...r22);
  const avg = r22.reduce((a, b) => a + b, 0) / r22.length;
  const change = rows[rows.length - 1].rate_22k_1g - rows[0].rate_22k_1g;
  const pct = (change / rows[0].rate_22k_1g) * 100;
  const isEstimated = `${year}-${String(mIdx + 1).padStart(2, "0")}` < FIRST_REAL;

  // Prev / next month (bounded by data at render time via 404s).
  const prev = new Date(Number(year), mIdx - 1, 1);
  const next = new Date(Number(year), mIdx + 1, 1);
  const now = new Date();
  const hasNext = next <= new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = [
    { label: "Average (22K/g)", value: inr(avg) },
    { label: "Highest", value: inr(high) },
    { label: "Lowest", value: inr(low) },
    { label: "Month change", value: `${change >= 0 ? "+" : "−"}${inr(Math.abs(change))} (${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%)` },
  ];

  const breadcrumbJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Gold Rate History", item: "https://www.livegoldkerala.com/gold-rate-history" },
      { "@type": "ListItem", position: 2, name: year, item: `https://www.livegoldkerala.com/gold-rate-history/${year}` },
      { "@type": "ListItem", position: 3, name: label, item: `https://www.livegoldkerala.com/gold-rate-history/${year}/${month.toLowerCase()}` },
    ],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd }} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <Link href="/gold-rate-history" className="hover:text-amber-700 dark:hover:text-amber-400">History</Link>
          {" / "}
          <Link href={`/gold-rate-history/${year}`} className="hover:text-amber-700 dark:hover:text-amber-400">{year}</Link>
          {" / "}{MONTH_LABELS[mIdx]}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Gold Rate in Kerala — {label}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          In {label}, the 22K gold rate in Kerala ranged between {inr(low)} and {inr(high)} per gram,
          averaging {inr(avg)}/g ({inr(avg * 8)} per pavan). Over the month the rate{" "}
          {change >= 0 ? "rose" : "fell"} {inr(Math.abs(change))} per gram ({pct >= 0 ? "+" : ""}
          {pct.toFixed(1)}%).
        </p>

        {isEstimated && (
          <p className="mt-3 rounded-xl border border-zinc-200/60 bg-zinc-50/60 px-4 py-2.5 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
            Rates for this month are <strong>estimates</strong> derived from international gold prices
            calibrated to the Kerala board rate — see the{" "}
            <Link href="/kerala-gold-price-trends" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">methodology</Link>.
            From April 2026 onward our data is the actual daily AKGSMA board rate.
          </p>
        )}

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-amber-200/50 bg-amber-50/40 p-3 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">{s.label}</p>
              <p className="mt-0.5 text-sm font-bold text-amber-700 dark:text-amber-400">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Daily table */}
        <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">22K/g</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">22K/Pavan</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">24K/g</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {rows.map((row, i) => {
                const prevRow = i > 0 ? rows[i - 1] : null;
                const dayChange = prevRow ? row.rate_22k_1g - prevRow.rate_22k_1g : null;
                return (
                  <tr key={row.date} className="transition-colors hover:bg-amber-50/30 dark:hover:bg-zinc-800/50">
                    <td className="px-4 py-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {new Date(row.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-zinc-800 dark:text-zinc-200">{inr(row.rate_22k_1g)}</td>
                    <td className="px-4 py-2.5 text-right text-zinc-600 dark:text-zinc-400">{inr(row.rate_22k_1g * 8)}</td>
                    <td className="px-4 py-2.5 text-right text-zinc-600 dark:text-zinc-400">{inr(row.rate_24k_1g)}</td>
                    <td className="px-4 py-2.5 text-right">
                      {dayChange === null ? (
                        <span className="text-zinc-300 dark:text-zinc-600">—</span>
                      ) : dayChange === 0 ? (
                        <span className="text-xs text-zinc-500">0</span>
                      ) : (
                        <span className={`text-xs font-semibold ${dayChange > 0 ? "text-red-500" : "text-green-600"}`}>
                          {dayChange > 0 ? "▲" : "▼"} {inr(Math.abs(dayChange))}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          * Daily Kerala board rate (22K per gram); pavan = 8 grams. Some dates may be missing where
          no rate was published.
        </p>

        {/* Month navigation */}
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/gold-rate-history/${prev.getFullYear()}/${MONTHS[prev.getMonth()]}`} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            ← {MONTH_LABELS[prev.getMonth()]} {prev.getFullYear()}
          </Link>
          <Link href={`/gold-rate-history/${year}`} className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            {year} Overview
          </Link>
          {hasNext && (
            <Link href={`/gold-rate-history/${next.getFullYear()}/${MONTHS[next.getMonth()]}`} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
              {MONTH_LABELS[next.getMonth()]} {next.getFullYear()} →
            </Link>
          )}
        </nav>
      </main>
    </>
  );
}
