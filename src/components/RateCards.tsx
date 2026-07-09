import { formatCurrency } from "@/lib/format";
import CountUp from "@/components/CountUp";

export function RateCard({
  label,
  purity,
  ratePerGram,
  change,
  pavanRate,
  featured = false,
  compact = false,
  animate = false,
}: {
  label: string;
  purity: string;
  ratePerGram: number;
  change: number | null;
  pavanRate?: number;
  featured?: boolean;
  compact?: boolean;
  /** Featured hero card: shimmer sweep + count-up on the rate value. */
  animate?: boolean;
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border bg-white dark:bg-zinc-900 transition-all hover:-translate-y-0.5 ${
        animate ? "gold-shimmer" : ""
      } ${
        compact ? "p-4 md:p-5 lg:p-6" : "p-5 md:p-6"
      } ${
        featured
          ? "border-amber-300 ring-2 ring-amber-400/50 shadow-xl shadow-amber-300/40 hover:shadow-2xl hover:shadow-amber-400/50 dark:border-amber-500/50 dark:shadow-amber-900/20"
          : "border-zinc-200/70 shadow-md shadow-amber-100/40 hover:shadow-lg hover:shadow-amber-200/50 dark:border-zinc-800 dark:shadow-none dark:hover:border-zinc-700"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full blur-3xl ${
          featured
            ? "bg-gradient-to-br from-amber-300/50 to-transparent dark:from-amber-600/20"
            : "bg-gradient-to-br from-amber-200/30 to-transparent dark:from-zinc-800/80"
        }`}
      />

      <div className="relative">
        <div className="mb-2 flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-between">
          <p className={`font-semibold text-zinc-800 dark:text-zinc-200 ${compact ? "text-sm" : "text-base"}`}>{label}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {featured && (
              <span className="shrink-0 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm ring-1 ring-inset ring-amber-600/30">
                ★ Popular
              </span>
            )}
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${
                featured
                  ? "bg-amber-100 text-amber-800 ring-amber-300/60 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-500/40"
                  : "bg-amber-50 text-amber-700 ring-amber-200/60 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
              }`}
            >
              {purity}
            </span>
          </div>
        </div>

        <p
          className={`bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 bg-clip-text font-bold tracking-tight text-transparent ${
            compact
              ? "mt-2 text-2xl md:text-3xl"
              : "mt-2 text-3xl md:text-4xl"
          }`}
        >
          {animate ? <CountUp value={ratePerGram} /> : formatCurrency(ratePerGram)}
        </p>

        {pavanRate && (
          <p className="mt-0.5 text-[11px] font-medium text-zinc-500">
            ({formatCurrency(pavanRate)} per Pavan)
          </p>
        )}

        <div className={`flex items-center justify-between ${compact ? "mt-2" : "mt-2 sm:mt-3"}`}>
          <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-zinc-500">
            per gram
          </span>
          {change !== null && <ChangeBadge change={change} />}
        </div>

      </div>
    </article>
  );
}

export function ChangeBadge({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="rounded-full bg-zinc-100 px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-[11px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        No change
      </span>
    );
  }
  const up = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 sm:px-2 text-[10px] sm:text-[11px] font-semibold ring-1 ring-inset ${
        up
          ? "bg-red-50 text-red-600 ring-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50"
          : "bg-green-50 text-green-600 ring-green-200/60 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50"
      }`}
    >
      {up ? "▲" : "▼"} ₹{Math.abs(change).toLocaleString("en-IN")}
    </span>
  );
}

export function RateBoard({
  rows,
}: {
  rows: {
    label: string;
    purity: string;
    ratePerGram: number;
    pavanRate: number;
    change: number | null;
  }[];
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-md shadow-amber-100/30 dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/30 px-5 py-2.5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Other Karat Rates Today
        </p>
        <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Per gram · Per pavan</p>
      </div>

      <div className="divide-y divide-zinc-100 dark:divide-zinc-800/70">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center gap-4 px-5 py-3.5">
            {/* Purity label */}
            <div className="min-w-[90px]">
              <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{row.label}</p>
              <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">{row.purity}</p>
            </div>

            {/* Rates */}
            <div className="flex flex-1 items-baseline gap-2">
              <p className="bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
                {formatCurrency(row.ratePerGram)}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                / g
              </p>
              <p className="hidden sm:block text-xs text-zinc-500 dark:text-zinc-400">
                · {formatCurrency(row.pavanRate)} / pavan
              </p>
            </div>

            {/* Change badge */}
            <div className="shrink-0">
              {row.change !== null ? (
                <ChangeBadge change={row.change} />
              ) : (
                <span className="text-xs text-zinc-300 dark:text-zinc-600">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
