"use client";

import { useState } from "react";
import AnimatedNumber from "@/components/AnimatedNumber";

const HALLMARKS = [
  { karat: 24, label: "Pure gold", badge: "999", purity: 1 },
  { karat: 22, label: "Standard hallmark", badge: "916", purity: 22 / 24 },
  { karat: 18, label: "18K hallmark", badge: "750", purity: 18 / 24 },
  { karat: 14, label: "14K hallmark", badge: "585", purity: 14 / 24 },
  { karat: 9, label: "9K hallmark", badge: "375", purity: 9 / 24 },
];

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function HallmarkCalculator({
  rate18k,
  rate22k,
  rate24k,
}: {
  rate18k: number;
  rate22k: number;
  rate24k: number;
}) {
  const [weight, setWeight] = useState<number | "">(8);
  const [copied, setCopied] = useState(false);

  const w = typeof weight === "number" ? weight : 0;

  // 24K/22K/18K are quoted on the Kerala board, so use those rates directly —
  // 18K in particular sits ~₹45/g above a straight 18/24 share of the 24K rate,
  // and deriving it made this page disagree with the rest of the site. 14K and
  // 9K aren't quoted anywhere, so they stay a purity share of 24K.
  const quoted: Record<number, number> = { 24: rate24k, 22: rate22k, 18: rate18k };
  const rows = HALLMARKS.map((h) => ({ ...h, rate: quoted[h.karat] ?? rate24k * h.purity }));

  const featured = rows.find((h) => h.karat === 22)!;
  const others = rows.filter((h) => h.karat !== 22);

  const value = (rate: number) => rate * w;

  function copyResult() {
    const lines = rows.map((h) => `${h.badge} (${h.karat}K) ${inr(value(h.rate))}`).join(" · ");
    navigator.clipboard?.writeText(`${w}g gold value — ${lines} — livegoldkerala.com`).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {}
    );
  }

  return (
    <div className="space-y-5">
      {/* Weight input */}
      <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <label htmlFor="hallmark-weight" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Gold weight
        </label>
        <div className="mt-2 flex items-center gap-3">
          <input
            id="hallmark-weight"
            type="number"
            min={0}
            max={5000}
            step={0.1}
            inputMode="decimal"
            value={weight}
            onChange={(e) => setWeight(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value)))}
            className="w-36 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-2xl font-extrabold tracking-tight text-zinc-900 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-100"
            placeholder="0"
          />
          <div className="text-sm text-zinc-500 dark:text-zinc-400">
            grams
            <span className="ml-1 block text-xs text-zinc-400">{(w / 8).toFixed(2)} pavan</span>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[1, 2, 4, 8, 10, 16].map((g) => (
            <button
              key={g}
              onClick={() => setWeight(g)}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {g}g{g === 8 ? " · 1 pavan" : ""}
            </button>
          ))}
        </div>
      </section>

      {/* Featured 22K hero */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-50 to-white p-5 shadow-lg shadow-amber-100/50 dark:border-amber-800/50 dark:from-amber-950/30 dark:to-zinc-900 dark:shadow-none">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 ring-1 ring-inset ring-amber-300/60 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-500/40">
              {featured.badge}
            </span>
            <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">22K · standard hallmark</span>
          </div>
          <button
            onClick={copyResult}
            className="shrink-0 rounded-lg bg-white/70 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 hover:text-amber-700 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <p className="mt-2 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent">
          <AnimatedNumber value={value(featured.rate)} format={inr} />
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          for {w || 0}g at {inr(featured.rate)}/g
        </p>
      </section>

      {/* Other purities */}
      <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-sm font-bold text-zinc-800 dark:text-zinc-100">
          Value at other purities <span className="font-normal text-zinc-400">· {w || 0} g</span>
        </h2>
        <div className="grid grid-cols-2 gap-2.5">
          {others.map((h) => (
            <div key={h.karat} className="rounded-xl bg-zinc-50 p-3 ring-1 ring-inset ring-zinc-200/60 dark:bg-zinc-950/40 dark:ring-zinc-800">
              <div className="flex items-center gap-1.5">
                <span className="rounded-full bg-zinc-200/70 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {h.badge}
                </span>
                <span className="text-sm font-extrabold text-zinc-700 dark:text-zinc-300">{h.karat}K</span>
                <span className="text-[10px] text-zinc-400">{inr(h.rate)}/g</span>
              </div>
              <div className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">
                <AnimatedNumber value={value(h.rate)} format={inr} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          Match the number stamped on your piece (999 / 916 / 750 / 585 / 375) to read its true gold value.
          Gold value only — making charges &amp; GST not included. Based on today&apos;s Kerala board rate.
        </p>
      </section>
    </div>
  );
}
