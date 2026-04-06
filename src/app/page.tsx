import { createSupabaseClient } from "@/lib/supabase";
import PriceChart from "@/components/PriceChart";
import HistoryTable from "@/components/HistoryTable";
import FAQ from "@/components/FAQ";
import TodayVsYesterday from "@/components/TodayVsYesterday";
import MonthlyHighLow from "@/components/MonthlyHighLow";

interface GoldRate {
  date: string;
  city: string;
  rate_18k_1g: number;
  rate_22k_1g: number;
  rate_24k_1g: number;
}

async function getHistory(): Promise<GoldRate[]> {
  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("date, city, rate_18k_1g, rate_22k_1g, rate_24k_1g")
      .eq("city", "Kochi")
      .order("date", { ascending: false })
      .limit(30);

    if (error || !data) return [];
    return data as GoldRate[];
  } catch {
    return [];
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export const revalidate = 300;

export default async function Home() {
  const history = await getHistory();
  const today = history[0] ?? null;
  const yesterday = history[1] ?? null;

  const change18k =
    today && yesterday ? today.rate_18k_1g - yesterday.rate_18k_1g : null;
  const change22k =
    today && yesterday ? today.rate_22k_1g - yesterday.rate_22k_1g : null;
  const change24k =
    today && yesterday ? today.rate_24k_1g - yesterday.rate_24k_1g : null;
  const chartData = [...history].reverse();

  return (
    <>
      {/* Premium sticky header */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl leading-none">✨</span>
            <div>
              <h1 className="text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
                LiveGold{" "}
                <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
                  Kerala
                </span>
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                Kochi · Realtime
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-green-200 bg-green-50/80 px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-semibold text-green-700">
              Live Updates
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-7 px-4 py-10 sm:py-14">
        {today ? (
          <>
            {/* Hero: trust badge + date */}
            <section className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 shadow-sm">
                <svg
                  className="h-3.5 w-3.5 text-emerald-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs font-semibold text-emerald-700">
                  Verified Kerala Board Rate
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                Today&apos;s Gold Rate
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {formatDate(today.date)} · {today.city}
              </p>
            </section>

            {/* Rate Cards */}
            <div className="grid gap-5 sm:grid-cols-3">
              <RateCard
                label="18 Karat Gold"
                purity="750"
                ratePerGram={today.rate_18k_1g}
                change={change18k}
              />
              <RateCard
                label="22 Karat Gold"
                purity="916 Hallmark"
                ratePerGram={today.rate_22k_1g}
                change={change22k}
              />
              <RateCard
                label="24 Karat Gold"
                purity="999 Fine"
                ratePerGram={today.rate_24k_1g}
                change={change24k}
                featured
              />
            </div>

            {/* Per Pavan section */}
            <div className="relative overflow-hidden rounded-2xl border border-zinc-200/70 bg-white p-7 shadow-lg shadow-amber-100/40">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-amber-200/40 to-transparent blur-3xl" />
              <div className="relative">
                <div className="mb-5 text-center">
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-zinc-400">
                    Per Pavan · 8 Grams
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Traditional Kerala measurement
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border-r border-zinc-100 pr-4 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">
                      18K
                    </p>
                    <p className="mt-1.5 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
                      {formatCurrency(today.rate_18k_1g * 8)}
                    </p>
                  </div>
                  <div className="border-r border-zinc-100 pr-4 text-center">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
                      22K
                    </p>
                    <p className="mt-1.5 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
                      {formatCurrency(today.rate_22k_1g * 8)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
                      24K
                    </p>
                    <p className="mt-1.5 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl">
                      {formatCurrency(today.rate_24k_1g * 8)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Today vs. Yesterday multi-weight comparison */}
            <TodayVsYesterday today={today} yesterday={yesterday} />

            {/* Monthly High/Low SEO callout */}
            <MonthlyHighLow history={history} />

            {/* Price Chart */}
            <PriceChart history={chartData} />

            {/* History Table */}
            <HistoryTable history={history} />
          </>
        ) : (
          <EmptyState />
        )}

        {/* FAQ — always visible for SEO */}
        <FAQ />
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 py-8 text-center text-xs text-zinc-400">
        <p className="font-medium">
          Data sourced from Malabar Gold &amp; Diamonds · For reference only
        </p>
        <p className="mt-1.5">© 2026 LiveGold Kerala</p>
      </footer>
    </>
  );
}

function RateCard({
  label,
  purity,
  ratePerGram,
  change,
  featured = false,
  showCTA = false,
}: {
  label: string;
  purity: string;
  ratePerGram: number;
  change: number | null;
  featured?: boolean;
  showCTA?: boolean;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white p-6 transition-all hover:-translate-y-0.5 ${
        featured
          ? "border-amber-200/80 shadow-lg shadow-amber-200/60 hover:shadow-xl hover:shadow-amber-300/70"
          : "border-zinc-200/70 shadow-lg shadow-amber-100/40 hover:shadow-xl hover:shadow-amber-200/50"
      }`}
    >
      {/* Decorative gold glow */}
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${
          featured
            ? "bg-gradient-to-br from-amber-300/50 to-transparent"
            : "bg-gradient-to-br from-amber-200/40 to-transparent"
        }`}
      />

      <div className="relative">
        <div className="mb-1 flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-800">{label}</p>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
              featured
                ? "bg-amber-100 text-amber-800 ring-amber-300/60"
                : "bg-amber-50 text-amber-700 ring-amber-200/60"
            }`}
          >
            {purity}
          </span>
        </div>

        <p className="mt-4 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-5xl font-black tracking-tight text-transparent sm:text-[3.5rem] sm:leading-none">
          {formatCurrency(ratePerGram)}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            per gram
          </span>
          {change !== null && <ChangeBadge change={change} />}
        </div>

        {showCTA && (
          <button
            type="button"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-amber-500/30 ring-1 ring-inset ring-white/20 transition-all hover:shadow-lg hover:shadow-amber-500/50 hover:brightness-110 active:scale-[0.98]"
          >
            Buy Digital Gold
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

function ChangeBadge({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-500">
        No change
      </span>
    );
  }
  const up = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${
        up
          ? "bg-red-50 text-red-600 ring-red-200/60"
          : "bg-green-50 text-green-600 ring-green-200/60"
      }`}
    >
      {up ? "\u25B2" : "\u25BC"} {up ? "+" : ""}
      {change.toLocaleString("en-IN")}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-zinc-200/70 bg-white p-12 text-center shadow-lg shadow-amber-100/30">
      <div className="rounded-full bg-gradient-to-br from-amber-100 to-amber-200 p-4 shadow-inner">
        <svg
          className="h-8 w-8 text-amber-700"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </div>
      <h2 className="text-lg font-bold text-zinc-800">Rates coming soon</h2>
      <p className="max-w-xs text-sm text-zinc-500">
        Gold rates will appear here once the first data update runs. Check back
        shortly!
      </p>
    </div>
  );
}
