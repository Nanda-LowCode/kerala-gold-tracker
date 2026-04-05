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
  rate_22k_1g: number;
  rate_24k_1g: number;
}

export default function PriceChart({ history }: { history: DayRate[] }) {
  const [karat, setKarat] = useState<"22k" | "24k">("22k");

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

  const values = history.map((d) =>
    karat === "22k" ? d.rate_22k_1g : d.rate_24k_1g
  );

  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: karat === "22k" ? "#d97706" : "#b45309",
        backgroundColor: karat === "22k" ? "rgba(217,119,6,0.1)" : "rgba(180,83,9,0.1)",
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
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number | null } }) =>
            `₹${(ctx.parsed.y ?? 0).toLocaleString("en-IN")}/g`,
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
          <button
            onClick={() => setKarat("22k")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition ${
              karat === "22k"
                ? "bg-amber-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            22K
          </button>
          <button
            onClick={() => setKarat("24k")}
            className={`rounded-md px-3 py-1 text-sm font-medium transition ${
              karat === "24k"
                ? "bg-amber-700 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            24K
          </button>
        </div>
      </div>
      <div className="h-64">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
