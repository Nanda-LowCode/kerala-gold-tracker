import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";
import type { GoldRate } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { computeStats } from "@/lib/commentary";
import { computeVerdict, type Verdict } from "@/lib/verdict";
import { VerdictDot } from "@/components/VerdictPill";
import { NewsSparkline } from "@/components/NewsSparkline";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Daily Kerala Gold Rate Updates — Live Gold Kerala",
  description:
    "Daily commentary on the Kerala gold rate. Browse historical 22K prices, weekly trends, and per-day market context.",
  alternates: { canonical: "/news" },
};

async function getRecentDays(limit = 30): Promise<GoldRate[]> {
  const supabase = createSupabaseReadClient();
  const { data, error } = await supabase
    .from("daily_gold_rates")
    .select("date, city, rate_18k_1g, rate_22k_1g, rate_24k_1g, rate_silver_1g")
    .eq("city", "Kochi")
    .order("date", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as GoldRate[];
}

function formatRowDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function weekKeyOf(d: string): string {
  const date = new Date(d + "T00:00:00");
  const day = date.getDay(); // 0=Sun
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7));
  return monday.toISOString().slice(0, 10);
}

function formatWeekRange(mondayIso: string): string {
  const start = new Date(mondayIso + "T00:00:00");
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  return `Week of ${fmt(start)} – ${fmt(end)}, ${start.getFullYear()}`;
}

export default async function NewsHub() {
  const rows = await getRecentDays(30);

  if (rows.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Daily Kerala Gold Rate Updates
        </h1>
        <p className="text-sm text-zinc-500">No daily updates yet. Check back tomorrow.</p>
      </main>
    );
  }

  // Hero stats from the 30-day window
  const values = rows.map((r) => r.rate_22k_1g);
  const weekValues = rows.slice(0, 7).map((r) => r.rate_22k_1g);
  const weekHigh = Math.max(...weekValues);
  const weekLow = Math.min(...weekValues);
  const monthAvg = values.reduce((a, b) => a + b, 0) / values.length;
  const netVs30dAgo = values[0] - values[values.length - 1];

  const sparklineData = [...rows]
    .reverse()
    .map((r) => ({ date: r.date, rate: r.rate_22k_1g }));

  // Group rows by week (Monday)
  const grouped: { weekKey: string; rows: GoldRate[] }[] = [];
  for (const row of rows) {
    const key = weekKeyOf(row.date);
    const last = grouped[grouped.length - 1];
    if (last && last.weekKey === key) last.rows.push(row);
    else grouped.push({ weekKey: key, rows: [row] });
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:py-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Daily Kerala Gold Rate Updates
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          One commentary per trading day, with week and month context.
        </p>
      </header>

      {/* Hero stats strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <HeroStat label="7-day high" value={formatCurrency(weekHigh)} />
        <HeroStat label="7-day low" value={formatCurrency(weekLow)} />
        <HeroStat label="30-day avg" value={formatCurrency(monthAvg)} />
        <HeroStat
          label="Net vs 30d ago"
          value={(netVs30dAgo > 0 ? "+" : "") + netVs30dAgo.toFixed(0)}
          accent={netVs30dAgo > 0 ? "up" : netVs30dAgo < 0 ? "down" : "flat"}
        />
      </section>

      {/* Sparkline card */}
      <section className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <div className="border-b border-zinc-100 bg-zinc-50/60 px-5 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/30">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            30-day trend — 22K
          </p>
        </div>
        <div className="px-5 py-4">
          <NewsSparkline data={sparklineData} height={160} />
        </div>
      </section>

      {/* Day cards, grouped by week */}
      <section className="flex flex-col gap-5">
        {grouped.map((group) => (
          <div key={group.weekKey}>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {formatWeekRange(group.weekKey)}
            </p>
            <ul className="flex flex-col gap-2">
              {group.rows.map((row) => {
                const globalIdx = rows.findIndex((r) => r.date === row.date);
                const window = rows.slice(globalIdx, globalIdx + 30);
                const stats = window.length >= 5 ? computeStats(window) : null;
                const verdict = stats ? computeVerdict(stats) : null;
                const prev = rows[globalIdx + 1];
                const change = prev ? row.rate_22k_1g - prev.rate_22k_1g : null;
                return (
                  <li key={row.date}>
                    <DayRowCard
                      date={row.date}
                      rate22k={row.rate_22k_1g}
                      change={change}
                      verdict={verdict}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}

function HeroStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "up" | "down" | "flat";
}) {
  const valueColor =
    accent === "up"
      ? "text-red-600"
      : accent === "down"
      ? "text-green-600"
      : "text-zinc-800 dark:text-zinc-200";
  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white p-4 text-center shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 text-lg font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

function DayRowCard({
  date,
  rate22k,
  change,
  verdict,
}: {
  date: string;
  rate22k: number;
  change: number | null;
  verdict: Verdict | null;
}) {
  return (
    <Link
      href={`/news/${date}`}
      className="group flex items-center gap-4 rounded-xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-800/40"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
            {formatRowDate(date)}
          </p>
          {verdict && <VerdictDot verdict={verdict} />}
        </div>
        <p className="text-xs text-zinc-500">
          22K {formatCurrency(rate22k)}/g · 1 Pavan {formatCurrency(rate22k * 8)}
        </p>
      </div>
      {change !== null && (
        <span
          className={
            change > 0
              ? "text-xs font-semibold text-red-600"
              : change < 0
              ? "text-xs font-semibold text-green-600"
              : "text-xs font-semibold text-zinc-500"
          }
        >
          {change > 0 ? "▲ +" : change < 0 ? "▼ " : ""}
          {change !== 0 ? change.toLocaleString("en-IN") : "no change"}
        </span>
      )}
    </Link>
  );
}
