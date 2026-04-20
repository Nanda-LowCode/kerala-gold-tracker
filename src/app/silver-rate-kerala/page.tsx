import { Metadata } from "next";
import Link from "next/link";
import { getHistory } from "@/app/page";
import { formatCurrency } from "@/lib/format";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const history = await getHistory();
  const today = history[0];
  const rate = today?.rate_silver_1g;

  const title = rate
    ? `Silver Rate in Kerala Today: ₹${rate}/g | LiveGold Kerala`
    : "Today's Silver Rate in Kerala | LiveGold Kerala";

  return {
    title,
    description:
      "Check today's silver rate per gram, 100g, and 1kg in Kerala. Updated daily from the Kerala board rate. Free, accurate, no login required.",
    keywords: [
      "silver rate today kerala",
      "silver rate per gram kerala",
      "silver price kerala today",
      "silver rate kochi",
      "silver price india today",
    ],
    alternates: { canonical: "/silver-rate-kerala" },
    openGraph: {
      title,
      description: "Today's silver rate in Kerala — per gram, 100g, and 1kg. Updated daily.",
      url: "https://www.livegoldkerala.com/silver-rate-kerala",
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ChangeBadge({ change }: { change: number }) {
  if (change === 0)
    return (
      <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        No change
      </span>
    );
  const up = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ring-1 ring-inset ${
        up
          ? "bg-red-50 text-red-600 ring-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50"
          : "bg-green-50 text-green-600 ring-green-200/60 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50"
      }`}
    >
      {up ? "▲" : "▼"} {up ? "+" : ""}
      {change.toLocaleString("en-IN")} today
    </span>
  );
}

export default async function SilverRatePage() {
  const history = await getHistory();
  const today = history[0] ?? null;
  const yesterday = history[1] ?? null;

  const silverToday = today?.rate_silver_1g ?? null;
  const silverYesterday = yesterday?.rate_silver_1g ?? null;
  const change = silverToday && silverYesterday ? silverToday - silverYesterday : null;

  const denominations = silverToday
    ? [
        { label: "1 gram", value: silverToday },
        { label: "10 grams", value: silverToday * 10 },
        { label: "100 grams", value: silverToday * 100 },
        { label: "1 kilogram", value: silverToday * 1000 },
      ]
    : [];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">✨</span>
            <div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg">
                LiveGold{" "}
                <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                  Kerala
                </span>
              </span>
            </div>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-600 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Gold Rates →
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        {/* Hero */}
        <section className="mb-8 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <span className="text-base">🥈</span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Kerala Board Rate · Ag 999</span>
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            Silver Rate in Kerala Today
          </h1>
          {today && (
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              <time dateTime={today.date}>{formatDate(today.date)}</time>
            </p>
          )}
        </section>

        {silverToday ? (
          <>
            {/* Main rate card */}
            <div className="mb-6 rounded-2xl border border-slate-200/70 bg-white p-6 shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Per gram (999 fine)</p>
                  <p className="mt-1 text-5xl font-bold tracking-tight text-slate-700 dark:text-slate-300">
                    {formatCurrency(silverToday)}
                  </p>
                </div>
                {change !== null && <ChangeBadge change={change} />}
              </div>
            </div>

            {/* Denomination table */}
            <div className="mb-8 rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
                <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Today&apos;s Silver Rate by Weight
                </h2>
              </div>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {denominations.map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-5 py-3.5">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatCurrency(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="mb-8 rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-500 dark:text-zinc-400">
              Silver rate data will appear here after the next daily update (~10:30 AM IST).
            </p>
          </div>
        )}

        {/* Explainer */}
        <div className="space-y-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">About Silver Rates in Kerala</h2>

          <p>
            The silver rate in Kerala is set daily by the Kerala Gold &amp; Silver Merchants Association (KGSMA), the same body that sets gold rates. Like gold, the rate is uniform across all districts — Kochi, Trivandrum, Thrissur, and Kozhikode all follow the same board rate.
          </p>

          <p>
            Kerala silver is sold as <strong className="text-zinc-700 dark:text-zinc-300">999 fine silver</strong> (99.9% purity), equivalent to international &quot;three nines&quot; grade. This is the highest purity available and is the standard for investment-grade silver coins and bars.
          </p>

          <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">What drives the silver price?</h3>

          <p>
            Silver tracks the international spot price (USD/troy oz on COMEX), adjusted for the INR/USD exchange rate and import duty. Silver is more volatile than gold — it responds to both precious metal sentiment and industrial demand (electronics, solar panels, EVs).
          </p>

          <p>
            Silver&apos;s gold-to-silver ratio (how many grams of silver equal one gram of gold) historically ranges from 50 to 100. When the ratio is high (silver is cheap relative to gold), silver tends to mean-revert upward over time. Currently, the ratio is around{" "}
            {silverToday && today ? (
              <strong className="text-zinc-700 dark:text-zinc-300">
                {Math.round(today.rate_22k_1g / silverToday)}:1
              </strong>
            ) : (
              "80–90:1"
            )}.
          </p>
        </div>

        {/* CTA to gold rates */}
        <div className="mt-8 rounded-2xl border border-amber-200/50 bg-amber-50/50 p-5 text-center dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Looking for gold rates?{" "}
            <Link href="/" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 dark:text-amber-400">
              Check today&apos;s gold rate in Kerala →
            </Link>
          </p>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 py-8 text-center text-xs text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
        <p>Data sourced from Kerala board rate · For reference only</p>
        <p className="mt-1">© 2026 LiveGold Kerala</p>
      </footer>
    </>
  );
}
