"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

export function NewsSparkline({
  data,
  highlightDate,
  height = 120,
}: {
  data: { date: string; rate: number }[];
  highlightDate?: string;
  height?: number;
}) {
  if (data.length < 2) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-xl border border-dashed border-zinc-200 text-xs text-zinc-500 dark:border-zinc-800"
      >
        Not enough data for a trend chart yet.
      </div>
    );
  }

  const labels = data.map((d) => d.date);
  const values = data.map((d) => d.rate);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.15 || 50;

  const pointRadius = data.map((d) => (d.date === highlightDate ? 6 : 0));

  return (
    <div style={{ height }}>
      <Line
        data={{
          labels,
          datasets: [
            {
              data: values,
              borderColor: "rgb(217, 119, 6)",
              backgroundColor: "rgba(251, 191, 36, 0.18)",
              borderWidth: 2,
              fill: true,
              tension: 0.35,
              pointRadius,
              pointBackgroundColor: "rgb(217, 119, 6)",
              pointBorderColor: "white",
              pointBorderWidth: 2,
              pointHoverRadius: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              displayColors: false,
              callbacks: {
                label: (ctx) => {
                  const y = ctx.parsed.y;
                  return y === null
                    ? ""
                    : `₹${y.toLocaleString("en-IN")} on ${ctx.label}`;
                },
              },
            },
          },
          scales: {
            x: { display: false },
            y: { display: false, min: min - padding, max: max + padding },
          },
          interaction: { intersect: false, mode: "nearest" },
        }}
      />
    </div>
  );
}
