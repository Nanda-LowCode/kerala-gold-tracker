"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import type { Karat } from "@/lib/holdings";

// Only the doughnut's arc element is needed here — registering the line/category
// scales (as PriceChart does) would pull in bundle we never draw.
ChartJS.register(ArcElement, Tooltip, Legend);

/** A monochromatic gold ramp: richer metal = deeper amber. */
const KARAT_COLOR: Record<Karat, string> = {
  24: "#d97706",
  22: "#f59e0b",
  18: "#fcd34d",
};

export default function AllocationChart({
  gramsByKarat,
}: {
  gramsByKarat: Record<Karat, number>;
}) {
  const present = ([24, 22, 18] as Karat[]).filter((k) => gramsByKarat[k] > 0);

  if (present.length === 0) return null;

  const data = {
    labels: present.map((k) => `${k}K`),
    datasets: [
      {
        data: present.map((k) => gramsByKarat[k]),
        backgroundColor: present.map((k) => KARAT_COLOR[k]),
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  return (
    <div className="h-[200px]">
      <Doughnut
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          cutout: "62%",
          plugins: {
            legend: {
              position: "right",
              labels: {
                boxWidth: 10,
                boxHeight: 10,
                usePointStyle: true,
                pointStyle: "circle",
                font: { size: 12 },
                color: "#71717a",
              },
            },
            tooltip: {
              callbacks: {
                label: (ctx) => `${ctx.label}: ${(ctx.raw as number).toFixed(1)} g`,
              },
            },
          },
        }}
      />
    </div>
  );
}

/** Exported so the summary card can colour-match the chart. */
export { KARAT_COLOR };
