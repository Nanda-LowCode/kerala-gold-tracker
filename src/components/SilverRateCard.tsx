import { formatCurrency } from "@/lib/format";

/** Optional label overrides for non-English rendering (Malayalam, etc.). */
export interface SilverRateLabels {
  title?: string;
  subtitle?: string;
  perGramSuffix?: string;
  per100gSuffix?: string;
  noChangeLabel?: string;
}

const DEFAULT_LABELS: Required<SilverRateLabels> = {
  title: "Silver Rate Today",
  subtitle: "Ag 999 · Kerala Board Rate",
  perGramSuffix: "/g",
  per100gSuffix: "per 100g",
  noChangeLabel: "No change",
};

export default function SilverRateCard({
  ratePerGram,
  change,
  labels,
}: {
  ratePerGram: number;
  change: number | null;
  labels?: SilverRateLabels;
}) {
  const L = { ...DEFAULT_LABELS, ...(labels ?? {}) };
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg dark:bg-zinc-800">
          🥈
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            {L.title}
          </p>
          <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
            {L.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-2xl font-bold tracking-tight text-slate-700 dark:text-slate-300">
            {formatCurrency(ratePerGram)}
            <span className="ml-1 text-xs font-medium text-zinc-500">{L.perGramSuffix}</span>
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {formatCurrency(ratePerGram * 100)} {L.per100gSuffix}
          </p>
        </div>
        {change !== null && <SilverChangeBadge change={change} noChangeLabel={L.noChangeLabel} />}
      </div>
    </div>
  );
}

function SilverChangeBadge({ change, noChangeLabel }: { change: number; noChangeLabel: string }) {
  if (change === 0) {
    return (
      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        {noChangeLabel}
      </span>
    );
  }
  const up = change > 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
        up
          ? "bg-red-50 text-red-600 ring-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50"
          : "bg-green-50 text-green-600 ring-green-200/60 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50"
      }`}
    >
      {up ? "▲" : "▼"} {up ? "+" : ""}
      {change.toLocaleString("en-IN")}
    </span>
  );
}
