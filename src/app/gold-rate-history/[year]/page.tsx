import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseReadClient } from "@/lib/supabase";
import type { GoldRate } from "@/lib/types";

export const revalidate = 86400; // historical data barely changes — daily is plenty

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

type RouteParams = { params: Promise<{ year: string }> };

async function getYearRows(year: string): Promise<GoldRate[]> {
  if (!/^\d{4}$/.test(year)) return [];
  const supabase = createSupabaseReadClient();
  const { data, error } = await supabase
    .from("daily_gold_rates")
    .select("date, rate_18k_1g, rate_22k_1g, rate_24k_1g")
    .eq("city", "Kochi")
    .gte("date", `${year}-01-01`)
    .lte("date", `${year}-12-31`)
    .order("date", { ascending: true });
  if (error || !data) return [];
  return data as GoldRate[];
}

interface MonthStat {
  month: number;
  avg22: number;
  high22: number;
  low22: number;
  avg24: number;
}
interface YearStats {
  high: number;
  low: number;
  avg: number;
  startRate: number;
  endRate: number;
  change: number;
  pct: number;
  months: MonthStat[];
}

function computeStats(rows: GoldRate[]): YearStats {
  const r22 = rows.map((r) => r.rate_22k_1g);
  const high = Math.max(...r22);
  const low = Math.min(...r22);
  const avg = r22.reduce((a, b) => a + b, 0) / r22.length;
  const startRate = rows[0].rate_22k_1g;
  const endRate = rows[rows.length - 1].rate_22k_1g;
  const change = endRate - startRate;
  const pct = (change / startRate) * 100;

  const byMonth = new Map<number, GoldRate[]>();
  for (const row of rows) {
    const m = Number(row.date.slice(5, 7)) - 1;
    if (!byMonth.has(m)) byMonth.set(m, []);
    byMonth.get(m)!.push(row);
  }
  const months: MonthStat[] = [...byMonth.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([month, rs]) => {
      const v22 = rs.map((r) => r.rate_22k_1g);
      const v24 = rs.map((r) => r.rate_24k_1g);
      return {
        month,
        avg22: v22.reduce((a, b) => a + b, 0) / v22.length,
        high22: Math.max(...v22),
        low22: Math.min(...v22),
        avg24: v24.reduce((a, b) => a + b, 0) / v24.length,
      };
    });

  return { high, low, avg, startRate, endRate, change, pct, months };
}

export async function generateStaticParams() {
  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("date")
    .eq("city", "Kochi")
    .order("date", { ascending: true })
    .limit(1);
  const startYear = data?.[0]?.date
    ? new Date(data[0].date + "T00:00:00").getFullYear()
    : new Date().getFullYear();
  const currentYear = new Date().getFullYear();
  const params: { year: string }[] = [];
  for (let y = startYear; y <= currentYear; y++) params.push({ year: String(y) });
  return params;
}

export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { year } = await params;
  const rows = await getYearRows(year);
  if (rows.length === 0) {
    return { title: "Gold Rate History — Year Not Found", robots: { index: false } };
  }
  const s = computeStats(rows);
  const title = `Kerala Gold Rate History ${year} — Monthly 22K & 24K Prices`;
  const description = `Gold rate in Kerala through ${year}: 22K ranged ${inr(s.low)}–${inr(
    s.high
  )} per gram (avg ${inr(s.avg)}). Month-by-month highs, lows and averages from the Kerala board rate.`;
  return {
    title,
    description,
    alternates: { canonical: `/gold-rate-history/${year}` },
    openGraph: { title, description, type: "article" },
  };
}

export default async function YearHistoryPage({ params }: RouteParams) {
  const { year } = await params;
  const rows = await getYearRows(year);
  if (rows.length === 0) notFound();

  const s = computeStats(rows);
  const yearNum = Number(year);
  const currentYear = new Date().getFullYear();
  const prevYear = yearNum - 1;
  const nextYear = yearNum + 1;
  const up = s.change > 0;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.livegoldkerala.com" },
      { "@type": "ListItem", position: 2, name: "Gold Rate History", item: "https://www.livegoldkerala.com/gold-rate-history" },
      { "@type": "ListItem", position: 3, name: `${year}`, item: `https://www.livegoldkerala.com/gold-rate-history/${year}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        <nav className="text-[11px] text-zinc-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/gold-rate-history" className="hover:underline">Gold Rate History</Link>
          <span className="mx-1">/</span>
          <span>{year}</span>
        </nav>

        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Kerala Gold Rate in {year}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Through {year}, the 22K (916) Kerala board rate ranged from{" "}
          <strong>{inr(s.low)}</strong> to <strong>{inr(s.high)}</strong> per gram (average{" "}
          {inr(s.avg)}). It {up ? "rose" : s.change === 0 ? "held" : "fell"} from {inr(s.startRate)} to{" "}
          {inr(s.endRate)} over the year
          {s.change !== 0 ? ` — a ${up ? "gain" : "drop"} of ${inr(Math.abs(s.change))}/g (${Math.abs(s.pct).toFixed(1)}%)` : ""}.
          {yearNum >= 2020 && yearNum <= 2025
            ? " Pre-launch values are estimated from spot gold calibrated to the official board rate."
            : ""}
        </p>

        {/* Year summary */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: `${year} High (22K/g)`, value: inr(s.high) },
            { label: `${year} Low (22K/g)`, value: inr(s.low) },
            { label: "Year Average", value: inr(s.avg) },
            { label: "Year Change", value: `${up ? "+" : ""}${s.pct.toFixed(1)}%` },
          ].map((stat) => (
            <div key={stat.label} className="rounded-xl border border-amber-200/50 bg-amber-50/40 p-3 dark:border-zinc-700 dark:bg-zinc-900">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{stat.label}</p>
              <p className="mt-0.5 text-base font-bold text-amber-700 dark:text-amber-400">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Monthly table */}
        <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Month</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Avg 22K/g</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">High</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Low</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Avg/Pavan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {s.months.map((m) => (
                <tr key={m.month} className="transition-colors hover:bg-amber-50/30 dark:hover:bg-zinc-800/50">
                  <td className="px-4 py-3 font-medium text-zinc-700 dark:text-zinc-300">{MONTHS[m.month]} {year}</td>
                  <td className="px-4 py-3 text-right font-semibold text-zinc-800 dark:text-zinc-200">{inr(m.avg22)}</td>
                  <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{inr(m.high22)}</td>
                  <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{inr(m.low22)}</td>
                  <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{inr(m.avg22 * 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
          * Monthly figures are averages of the daily Kerala board rate (22K per gram). Pavan = 8 grams.
          Download the full daily dataset{" "}
          <a href="/api/gold-rate-history" download className="font-semibold text-amber-700 hover:underline dark:text-amber-400">as CSV</a>.
        </p>

        {/* Year navigation */}
        <nav className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href={`/gold-rate-history/${prevYear}`} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            ← {prevYear}
          </Link>
          <Link href="/gold-rate-history" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            All History
          </Link>
          {nextYear <= currentYear && (
            <Link href={`/gold-rate-history/${nextYear}`} className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
              {nextYear} →
            </Link>
          )}
        </nav>
      </main>
    </>
  );
}
