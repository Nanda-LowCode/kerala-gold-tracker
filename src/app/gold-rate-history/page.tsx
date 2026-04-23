import { Metadata } from "next";
import Link from "next/link";
import { getHistory } from "../page";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Gold Rate History Kerala — Last 30 Days | LiveGold Kerala",
  description:
    "View gold rate history in Kerala for the last 30 days. Daily 22K and 24K gold prices per gram and per pavan (sovereign). Compare price trends at a glance.",
  alternates: { canonical: "/gold-rate-history" },
  openGraph: {
    title: "Gold Rate History Kerala — Last 30 Days",
    description: "Daily 22K and 24K gold prices in Kerala for the past 30 days.",
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
          Gold Rate History — Kerala (Last 30 Days)
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Daily board rates set by the Kerala Gold &amp; Silver Merchants Association. Uniform across all districts.
        </p>

        {today && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "22K Today", value: formatCur(today.rate_22k_1g) + "/g" },
              { label: "24K Today", value: formatCur(today.rate_24k_1g) + "/g" },
              { label: "22K per Pavan", value: formatCur(today.rate_22k_1g * 8) },
              { label: "24K per Pavan", value: formatCur(today.rate_24k_1g * 8) },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-amber-200/50 bg-amber-50/40 p-3 dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">{stat.label}</p>
                <p className="mt-0.5 text-base font-bold text-amber-700 dark:text-amber-400">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

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
              {history.map((row, i) => {
                const prev = history[i + 1];
                const change = prev ? row.rate_22k_1g - prev.rate_22k_1g : null;
                const isToday = i === 0;
                return (
                  <tr key={row.date} className={`transition-colors hover:bg-amber-50/30 dark:hover:bg-zinc-800/50 ${isToday ? "bg-amber-50/50 dark:bg-amber-950/20" : ""}`}>
                    <td className="px-4 py-3 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {formatDate(row.date)}
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
          <p className="font-medium">Data sourced from Malabar Gold &amp; Diamonds · For reference only</p>
          <p className="mt-1.5">© 2026 LiveGold Kerala</p>
        </div>
      </footer>
    </>
  );
}
