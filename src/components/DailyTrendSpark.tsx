import Link from "next/link";
import type { GoldRate } from "@/lib/types";

/**
 * Replaces the "three stacked date-and-price cards" pattern with a compact
 * 14-day sparkline. The information is a trend — which way is the rate
 * going — and a trend is a shape, not a card-by-card scan. This says more
 * in less vertical space and doesn't look like every other dashboard sidebar.
 *
 * Kept: the header, "All updates →" link, and the three most recent points
 * are individually clickable (as circles on the sparkline) to the daily
 * news pages. So the original navigation surface survives.
 */

const WINDOW = 14;
const W = 320;
const H = 96;
const PAD_X = 12;
const PAD_Y = 14;

function formatShortDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export default function DailyTrendSpark({ history }: { history: GoldRate[] }) {
  // `history` arrives newest-first from the page loader; the sparkline reads
  // left-to-right (oldest → newest), so flip a slice.
  const window = history.slice(0, WINDOW).reverse();
  if (window.length < 2) return null;

  const values = window.map((r) => r.rate_22k_1g);
  const min = Math.min(...values);
  const max = Math.max(...values);
  // Slight padding above/below so the line doesn't clip the top/bottom edges.
  const range = Math.max(max - min, 1);

  const points = window.map((r, i) => {
    const x = PAD_X + (i / (window.length - 1)) * (W - PAD_X * 2);
    const y = PAD_Y + (1 - (r.rate_22k_1g - min) / range) * (H - PAD_Y * 2);
    return { x, y, r };
  });

  const linePath = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${H - PAD_Y / 2} L ${points[0].x.toFixed(1)} ${H - PAD_Y / 2} Z`;

  const first = points[0];
  const last = points[points.length - 1];
  const change = last.r.rate_22k_1g - first.r.rate_22k_1g;
  const changePct = (change / first.r.rate_22k_1g) * 100;

  // The three most recent points get filled markers with links; older days
  // stay as tiny reference dots.
  const recent = points.slice(-3);

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Last {WINDOW} days
        </h2>
        <Link
          href="/news"
          className="shrink-0 text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400"
        >
          Daily notes →
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header row: start value + end value on the ends, change chip on the right */}
        <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <div>
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">{formatINR(first.r.rate_22k_1g)}</p>
            <p>{formatShortDate(first.r.date)}</p>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
              change > 0
                ? "bg-red-50 text-red-600 ring-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50"
                : change < 0
                  ? "bg-green-50 text-green-600 ring-green-200/60 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50"
                  : "bg-zinc-100 text-zinc-500 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700"
            }`}
          >
            {change > 0 ? "▲" : change < 0 ? "▼" : "·"} {formatINR(Math.abs(change))} ({changePct >= 0 ? "+" : "−"}
            {Math.abs(changePct).toFixed(2)}%)
          </span>
          <div className="text-right">
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">{formatINR(last.r.rate_22k_1g)}</p>
            <p>{formatShortDate(last.r.date)}</p>
          </div>
        </div>

        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="mt-1 h-24 w-full"
          role="img"
          aria-label={`22K gold rate over the last ${WINDOW} days, from ${formatINR(first.r.rate_22k_1g)} on ${formatShortDate(first.r.date)} to ${formatINR(last.r.rate_22k_1g)} on ${formatShortDate(last.r.date)}`}
        >
          <defs>
            <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath} fill="url(#spark-fill)" />
          <path
            d={linePath}
            fill="none"
            stroke="#d97706"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Faint reference dots for older days */}
          {points.slice(0, -3).map((p) => (
            <circle key={p.r.date} cx={p.x} cy={p.y} r="1.5" fill="#f59e0b" opacity="0.35" />
          ))}
          {/* The three most-recent days: linkable markers */}
          {recent.map((p, i) => (
            <a key={p.r.date} href={`/news/${p.r.date}`} aria-label={`Daily note for ${formatShortDate(p.r.date)}`}>
              {/* Larger transparent hit target so tapping between dots still lands */}
              <circle cx={p.x} cy={p.y} r="10" fill="transparent" />
              <circle
                cx={p.x}
                cy={p.y}
                r={i === recent.length - 1 ? 4 : 3}
                fill="#d97706"
                stroke="#fff"
                strokeWidth="1.5"
                className="transition-transform hover:scale-125"
              />
            </a>
          ))}
        </svg>
      </div>
    </section>
  );
}
