import { formatCurrency } from "@/lib/format";

export function RangeBar({
  low,
  high,
  current,
  label = "30-day range",
}: {
  low: number;
  high: number;
  current: number;
  label?: string;
}) {
  if (high <= low) return null;
  const pos = Math.min(1, Math.max(0, (current - low) / (high - low)));
  const posPct = `${(pos * 100).toFixed(1)}%`;

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        <span>{label}</span>
        <span>
          {formatCurrency(low)} – {formatCurrency(high)}
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-200 via-amber-200 to-red-200 dark:from-emerald-900/40 dark:via-amber-900/40 dark:to-red-900/40">
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-zinc-900 shadow-lg shadow-amber-400/50 dark:border-zinc-950"
          style={{ left: posPct }}
          aria-label={`Today's price is ${formatCurrency(current)}`}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
        <span>Low</span>
        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
          Today {formatCurrency(current)}
        </span>
        <span>High</span>
      </div>
    </div>
  );
}
