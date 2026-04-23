import { Metadata } from "next";
import Link from "next/link";
import { getHistory } from "../page";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const history = await getHistory();
  const yesterday = history[1] ?? null;

  const base = {
    alternates: { canonical: "/gold-rate-yesterday-kerala" },
    openGraph: {
      url: "https://www.livegoldkerala.com/gold-rate-yesterday-kerala",
    },
  };

  if (!yesterday) {
    return {
      title: "Gold Rate Yesterday Kerala | LiveGold Kerala",
      description: "Yesterday's 22K and 24K gold rate in Kerala per gram and per pavan. Compare with today's price.",
      ...base,
    };
  }

  return {
    title: `Gold Rate Yesterday Kerala — 22K ₹${yesterday.rate_22k_1g}/g | LiveGold Kerala`,
    description: `Yesterday's gold rate in Kerala: 22 Karat was ₹${yesterday.rate_22k_1g} per gram (₹${yesterday.rate_22k_1g * 8} per pavan), 24 Karat was ₹${yesterday.rate_24k_1g} per gram. See how it compares to today.`,
    ...base,
  };
}

function formatDate(dateStr: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...opts,
  });
}

function formatCur(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export default async function YesterdayPage() {
  const history = await getHistory();
  const today = history[0] ?? null;
  const yesterday = history[1] ?? null;

  const change22k = today && yesterday ? today.rate_22k_1g - yesterday.rate_22k_1g : null;
  const change24k = today && yesterday ? today.rate_24k_1g - yesterday.rate_24k_1g : null;

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
              Yesterday&apos;s Gold Rate
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Gold Rate Yesterday — Kerala
        </h1>
        {yesterday && (
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {formatDate(yesterday.date)} · Kerala Board Rate
          </p>
        )}

        {yesterday ? (
          <>
            {/* Yesterday rate cards */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-5 shadow-sm dark:border-amber-800/50 dark:bg-amber-950/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">22K Gold — Yesterday</p>
                <p className="mt-2 text-3xl font-bold text-amber-700 dark:text-amber-400">{formatCur(yesterday.rate_22k_1g)}<span className="ml-1 text-sm font-normal text-zinc-400">/g</span></p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{formatCur(yesterday.rate_22k_1g * 8)} per Pavan (8g)</p>
              </div>
              <div className="rounded-2xl border border-zinc-200/70 bg-zinc-50/60 p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">24K Gold — Yesterday</p>
                <p className="mt-2 text-3xl font-bold text-zinc-700 dark:text-zinc-200">{formatCur(yesterday.rate_24k_1g)}<span className="ml-1 text-sm font-normal text-zinc-400">/g</span></p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{formatCur(yesterday.rate_24k_1g * 8)} per Pavan (8g)</p>
              </div>
            </div>

            {/* Today vs Yesterday comparison */}
            {today && (
              <div className="mt-6 rounded-2xl border border-zinc-200/60 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">Today vs Yesterday</h2>
                <p className="mt-0.5 text-xs text-zinc-400">Today: {formatDate(today.date, { weekday: "long", month: "short", day: "numeric" })}</p>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "22K Gold", todayRate: today.rate_22k_1g, change: change22k },
                    { label: "24K Gold", todayRate: today.rate_24k_1g, change: change24k },
                  ].map(({ label, todayRate, change }) => (
                    <div key={label} className="flex items-center justify-between gap-4">
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                      <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{formatCur(todayRate)}/g</span>
                      {change === null ? null : change === 0 ? (
                        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-500 dark:bg-zinc-800">No change</span>
                      ) : (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${change > 0 ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400" : "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400"}`}>
                          {change > 0 ? "▲ +" : "▼ "}{change.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
              * Kerala gold rate is uniform across all districts — the same rate applies in Kochi, Thrissur, Kozhikode, and all other cities.
            </p>
          </>
        ) : (
          <div className="mt-8 rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Yesterday&apos;s data is not yet available.</p>
          </div>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Today&apos;s Rate
          </Link>
          <Link href="/gold-rate-history" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            30-Day History →
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 pt-6 pb-8 dark:border-zinc-800/80 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <p className="font-medium">AKGSMA official Kerala rates · Data via Malabar Gold &amp; BankBazaar · For reference only</p>
          <p className="mt-1.5">© 2026 LiveGold Kerala</p>
        </div>
      </footer>
    </>
  );
}
