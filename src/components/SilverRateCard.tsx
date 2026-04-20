import { formatCurrency } from "@/lib/format";

export default function SilverRateCard({
  ratePerGram,
  change,
}: {
  ratePerGram: number;
  change: number | null;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/70 bg-white px-5 py-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg dark:bg-zinc-800">
          🥈
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            Silver Rate Today
          </p>
          <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
            Ag 999 · Kerala Board Rate
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-2xl font-bold tracking-tight text-slate-700 dark:text-slate-300">
            {formatCurrency(ratePerGram)}
            <span className="ml-1 text-xs font-medium text-zinc-400">/g</span>
          </p>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {formatCurrency(ratePerGram * 100)} per 100g
          </p>
        </div>
        {change !== null && <SilverChangeBadge change={change} />}
      </div>
    </div>
  );
}

function SilverChangeBadge({ change }: { change: number }) {
  if (change === 0) {
    return (
      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
        No change
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
