"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type TooltipItem,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const RANGES = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "All", days: Infinity },
] as const;

/** Silver-only price trend. `series` is chronological { date, rate } (999 fine, ₹/g). */
export default function SilverChart({ series }: { series: { date: string; rate: number }[] }) {
  const [days, setDays] = useState<number>(30);

  if (series.length < 2) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
        Chart will appear once there are at least 2 days of data.
      </div>
    );
  }

  const view = Number.isFinite(days) ? series.slice(-days) : series;
  const labels = view.map((d) =>
    new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short", day: "numeric" })
  );

  const data = {
    labels,
    datasets: [
      {
        data: view.map((d) => d.rate),
        borderColor: "#64748b",
        backgroundColor: "rgba(100,116,139,0.12)",
        borderWidth: 2,
        pointRadius: view.length > 15 ? (view.length > 60 ? 0 : 2) : 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      tooltip: {
        backgroundColor: "rgba(255,255,255,0.95)",
        titleColor: "#a1a1aa",
        titleFont: { size: 12, weight: "normal" as const },
        bodyColor: "#475569",
        bodyFont: { size: 15, weight: "bold" as const },
        borderColor: "rgba(100,116,139,0.3)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        cornerRadius: 8,
        callbacks: {
          title: (context: TooltipItem<"line">[]) => context[0].label,
          label: (context: TooltipItem<"line">) => `₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}/g`,
        },
      },
    },
    scales: {
      x: { ticks: { autoSkip: true, maxTicksLimit: 12, maxRotation: 60, minRotation: 0 } },
      y: { ticks: { callback: (val: string | number) => `₹${Number(val).toLocaleString("en-IN")}` } },
    },
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Silver Price Trend (999)</h2>
        <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800/70">
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setDays(r.days)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                days === r.days
                  ? "bg-slate-700 text-white shadow-sm dark:bg-slate-600"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
