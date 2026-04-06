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
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

interface DayRate {
  date: string;
  rate_18k_1g: number;
  rate_22k_1g: number;
  rate_24k_1g: number;
}

export default function PriceChart({ history }: { history: DayRate[] }) {
  const [karat, setKarat] = useState<"18k" | "22k" | "24k">("22k");

  if (history.length < 2) {
    return (
      <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm text-center text-sm text-gray-400">
        Chart will appear once there are at least 2 days of data.
      </div>
    );
  }

  const labels = history.map((d) =>
    new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    })
  );

  const rateKey = `rate_${karat}_1g` as keyof DayRate;
  const values = history.map((d) => d[rateKey] as number);

  const colors: Record<string, { border: string; bg: string }> = {
    "18k": { border: "#ca8a04", bg: "rgba(202,138,4,0.1)" },
    "22k": { border: "#d97706", bg: "rgba(217,119,6,0.1)" },
    "24k": { border: "#b45309", bg: "rgba(180,83,9,0.1)" },
  };

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: colors[karat].border,
        backgroundColor: colors[karat].bg,
        borderWidth: 2,
        pointRadius: history.length > 15 ? 2 : 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#a1a1aa",
        titleFont: { size: 12, weight: "normal" as const },
        bodyColor: "#b45309",
        bodyFont: { size: 15, weight: "bold" as const },
        borderColor: "rgba(251, 191, 36, 0.3)",
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        cornerRadius: 8,
        callbacks: {
          title: (context: any[]) => context[0].label,
          label: (context: any) => `₹${(context.parsed.y ?? 0).toLocaleString("en-IN")}/g`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (val: string | number) => `₹${Number(val).toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Price Trend</h2>
        <div className="flex gap-1 rounded-lg bg-gray-100 p-1">
          {(["18k", "22k", "24k"] as const).map((k) => (
            <button
              key={k}
              onClick={() => setKarat(k)}
              className={`rounded-md px-3 py-1 text-sm font-medium transition ${
                karat === k
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {k.toUpperCase()}
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
