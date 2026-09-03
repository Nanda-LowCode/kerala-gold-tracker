import { useId } from "react";
import Link from "next/link";
import type { GoldRate } from "@/lib/types";

/**
 * Replaces the "three stacked date-and-price cards" pattern with a compact
 * sparkline. The information is a trend — which way is the rate going — and
 * a trend is a shape, not a card-by-card scan. Says more in less vertical
 * space and doesn't look like every other dashboard sidebar.
 *
 * The three most recent days survive as clickable HTML markers overlaid on
 * the SVG (positioned by percentage). They use Next.js <Link> so navigation
 * stays client-side — SVG-namespaced <a href> would round-trip the server
 * and lose the prefetch.
 */

const WINDOW = 14;
const W = 320;
const H = 96;
const PAD_X = 12;
const PAD_Y = 14;

/** Optional label overrides for non-English rendering (Malayalam, etc.). */
export interface DailyTrendSparkLabels {
  heading?: (days: number) => string;
  linkLabel?: string;
  noChangeLabel?: string;
  ariaLabel?: (args: {
    days: number;
    fromValue: string;
    fromDate: string;
    toValue: string;
    toDate: string;
  }) => string;
  markerLabel?: (date: string) => string;
}

const DEFAULT_LABELS: Required<DailyTrendSparkLabels> = {
  heading: (days) => `Last ${days} days`,
  linkLabel: "Daily notes →",
  noChangeLabel: "No change",
  ariaLabel: ({ days, fromValue, fromDate, toValue, toDate }) =>
    `22K gold rate over the last ${days} days, from ${fromValue} on ${fromDate} to ${toValue} on ${toDate}`,
  markerLabel: (date) => `Daily note for ${date}`,
};

function formatShortDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export default function DailyTrendSpark({
  history,
  labels,
}: {
  history: GoldRate[];
  labels?: DailyTrendSparkLabels;
}) {
  const L = { ...DEFAULT_LABELS, ...(labels ?? {}) };
  // `history` arrives newest-first from the page loader; the sparkline reads
  // left-to-right (oldest → newest), so flip a slice.
  const window = history.slice(0, WINDOW).reverse();
  // Server components can call useId — the id is stable across SSR/hydration
  // and unique per mount, so multiple sparklines on one page don't collide.
  const gradientId = useId();

  if (window.length < 2) return null;

  const values = window.map((r) => r.rate_22k_1g);
  const min = Math.min(...values);
  const max = Math.max(...values);
  // Guard the flat-line case from division-by-zero.
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

  const chipTone =
    change > 0
      ? "bg-red-50 text-red-600 ring-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-900/50"
      : change < 0
        ? "bg-green-50 text-green-600 ring-green-200/60 dark:bg-green-950/30 dark:text-green-400 dark:ring-green-900/50"
        : "bg-zinc-100 text-zinc-500 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:ring-zinc-700";

  const chipLabel =
    change === 0
      ? L.noChangeLabel
      : `${change > 0 ? "▲" : "▼"} ${formatINR(Math.abs(change))} (${change > 0 ? "+" : "−"}${Math.abs(changePct).toFixed(2)}%)`;

  // The three most recent points get filled markers with links; older days
  // stay as tiny reference dots.
  const recent = points.slice(-3);

  return (
    <section>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {L.heading(window.length)}
        </h2>
        <Link
          href="/news"
          className="shrink-0 text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400"
        >
          {L.linkLabel}
        </Link>
      </div>

      <div className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header row: start value + change chip + end value */}
        <div className="mb-2 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <div>
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">{formatINR(first.r.rate_22k_1g)}</p>
            <p>{formatShortDate(first.r.date)}</p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${chipTone}`}>
            {chipLabel}
          </span>
          <div className="text-right">
            <p className="font-semibold text-zinc-700 dark:text-zinc-300">{formatINR(last.r.rate_22k_1g)}</p>
            <p>{formatShortDate(last.r.date)}</p>
          </div>
        </div>

        {/* SVG is the visual layer; the three linkable markers ride on top as
            positioned HTML so navigation stays client-side. */}
        <div className="relative mt-1 h-24 w-full">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="h-full w-full"
            role="img"
            aria-label={L.ariaLabel({
              days: window.length,
              fromValue: formatINR(first.r.rate_22k_1g),
              fromDate: formatShortDate(first.r.date),
              toValue: formatINR(last.r.rate_22k_1g),
              toDate: formatShortDate(last.r.date),
            })}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#${gradientId})`} />
            {/* vector-effect keeps the stroke a consistent width under
                preserveAspectRatio="none" — otherwise the wider the sidebar,
                the thinner the horizontal segments look. */}
            <path
              d={linePath}
              fill="none"
              stroke="#d97706"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
            {/* Faint reference dots for older days */}
            {points.slice(0, -3).map((p) => (
              <circle key={p.r.date} cx={p.x} cy={p.y} r="1.5" fill="#f59e0b" opacity="0.35" />
            ))}
          </svg>

          {recent.map((p, i) => {
            const isLast = i === recent.length - 1;
            return (
              <Link
                key={p.r.date}
                href={`/news/${p.r.date}`}
                aria-label={L.markerLabel(formatShortDate(p.r.date))}
                className="group absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-transform hover:scale-125 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
                style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%` }}
              >
                <span
                  aria-hidden
                  className={`block rounded-full bg-amber-600 ring-2 ring-white dark:ring-zinc-900 ${
                    isLast ? "h-2.5 w-2.5" : "h-2 w-2"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
