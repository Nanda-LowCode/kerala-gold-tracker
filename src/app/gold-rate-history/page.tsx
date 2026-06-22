import { Metadata } from "next";
import Link from "next/link";
import { getHistory } from "../page";
import PriceChart from "@/components/PriceChart";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kerala Gold Rate History — Daily 22K & 24K Price Archive | LiveGold Kerala",
  description:
    "Kerala gold rate history: daily 22K and 24K board rates per gram and per pavan. Browse the trend chart, see the all-time high and low, and download the full dataset as CSV.",
  alternates: { canonical: "/gold-rate-history" },
  openGraph: {
    title: "Kerala Gold Rate History — Daily 22K & 24K Price Archive",
    description: "Daily Kerala board gold rates with trend chart and a downloadable CSV dataset.",
    url: "https://www.livegoldkerala.com/gold-rate-history",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCur(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default async function GoldRateHistoryPage() {
  const history = await getHistory();
  const today = history[0] ?? null;

  // All-time stats over whatever history is available (deepens with the backfill).
  const rates22 = history.map((h) => h.rate_22k_1g);
  const allHigh = rates22.length ? Math.max(...rates22) : null;
  const allLow = rates22.length ? Math.min(...rates22) : null;
  const chartData = [...history].reverse(); // chronological for the chart
  const visible = history.slice(0, 90); // cap the table; full data in the CSV

  return (
    <>
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">✨</span>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline">
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              30-Day Rate History
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Kerala Gold Rate History
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Daily 22K &amp; 24K board rates from the Kerala Gold &amp; Silver Merchants Association —
          {history.length > 0 ? ` ${history.length} days tracked.` : " uniform across all districts."} Trend
          chart, all-time high/low, and a free CSV download below.
        </p>

        {today && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "22K Today", value: formatCur(today.rate_22k_1g) + "/g" },
              { label: "22K per Pavan", value: formatCur(today.rate_22k_1g * 8) },
              { label: "All-time High (22K/g)", value: allHigh !== null ? formatCur(allHigh) : "—" },
              { label: "All-time Low (22K/g)", value: allLow !== null ? formatCur(allLow) : "—" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-amber-200/50 bg-amber-50/40 p-3 dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{stat.label}</p>
                <p className="mt-0.5 text-base font-bold text-amber-700 dark:text-amber-400">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Trend chart — multi-range, deepens as data accrues / after backfill */}
        {chartData.length >= 2 && (
          <div className="mt-8">
            <PriceChart history={chartData} />
          </div>
        )}

        {/* Download + attribution — this is what makes the page link-worthy */}
        <section className="mt-8 flex flex-col gap-3 rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Download the full dataset</p>
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              Free Kerala gold-rate history (CSV). Using it? A link back to livegoldkerala.com is appreciated.
            </p>
          </div>
          <a
            href="/api/gold-rate-history"
            download
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition-all hover:brightness-110"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download CSV
          </a>
        </section>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">22K/g</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">22K/Pavan</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">24K/g</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {visible.map((row, i) => {
                const prev = history[i + 1];
                const change = prev ? row.rate_22k_1g - prev.rate_22k_1g : null;
                const isToday = i === 0;
                return (
                  <tr key={row.date} className={`transition-colors hover:bg-amber-50/30 dark:hover:bg-zinc-800/50 ${isToday ? "bg-amber-50/50 dark:bg-amber-950/20" : ""}`}>
                    <td className="px-4 py-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      <Link href={`/news/${row.date}`} className="hover:text-amber-700 dark:hover:text-amber-400">
                        {formatDate(row.date)}
                      </Link>
                      {isToday && (
                        <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                          Today
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-zinc-800 dark:text-zinc-200">{formatCur(row.rate_22k_1g)}</td>
                    <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{formatCur(row.rate_22k_1g * 8)}</td>
                    <td className="px-4 py-3 text-right text-zinc-600 dark:text-zinc-400">{formatCur(row.rate_24k_1g)}</td>
                    <td className="px-4 py-3 text-right">
                      {change === null ? (
                        <span className="text-zinc-300 dark:text-zinc-600">—</span>
                      ) : change === 0 ? (
                        <span className="text-xs text-zinc-400">No change</span>
                      ) : (
                        <span className={`text-xs font-semibold ${change > 0 ? "text-red-500" : "text-green-600"}`}>
                          {change > 0 ? "▲" : "▼"} {change > 0 ? "+" : ""}{change.toLocaleString("en-IN")}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-zinc-400">
                    No data available yet. Check back after the first rate update.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
          * Rates are the official Kerala board rate per gram. Pavan = 8 grams.
          {history.length > visible.length
            ? ` Table shows the most recent ${visible.length} days — download the CSV above for the full ${history.length}-day history.`
            : ""}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Today&apos;s Rate
          </Link>
          <Link href="/gold-rate-yesterday-kerala" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Yesterday&apos;s Rate →
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 pt-6 pb-8 dark:border-zinc-800/80 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <p className="font-medium">AKGSMA · For reference only</p>
          <p className="mt-1.5">© 2026 LiveGold Kerala</p>
        </div>
      </footer>
    </>
  );
}
