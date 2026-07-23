"use client";

import { useState } from "react";
import AnimatedNumber from "@/components/AnimatedNumber";

const GST_RATE = 0.03;

// Purity factor applied to the 999 silver rate.
const PURITIES = [
  { value: "999", label: "999 fine", factor: 1 },
  { value: "925", label: "925 sterling", factor: 0.925 },
];

// Typical making-charge starting point by item type (fully adjustable).
const FORMS = [
  { value: "coin", label: "Coin / bar", making: 3 },
  { value: "jewellery", label: "Jewellery / anklet", making: 12 },
  { value: "utensil", label: "Utensil / gift", making: 8 },
];

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function SilverCalculator({ rate999 }: { rate999: number }) {
  const [grams, setGrams] = useState<number | "">(100);
  const [purity, setPurity] = useState("999");
  const [form, setForm] = useState("jewellery");
  const [makingPct, setMakingPct] = useState(12);
  const [gstIncluded, setGstIncluded] = useState(true);

  const g = typeof grams === "number" ? grams : 0;
  const factor = PURITIES.find((p) => p.value === purity)?.factor ?? 1;

  const silverValue = g * rate999 * factor;
  const makingCharge = silverValue * (makingPct / 100);
  const gst = gstIncluded ? (silverValue + makingCharge) * GST_RATE : 0;
  const total = silverValue + makingCharge + gst;

  return (
    <div className="space-y-6">
      {/* Weight */}
      <section className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Weight (grams)</label>
        <input
          type="number"
          min={1}
          inputMode="numeric"
          value={grams}
          onChange={(e) => setGrams(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-slate-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
          placeholder="e.g. 100"
        />
      </section>

      {/* Purity */}
      <section className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Purity</label>
        <div className="flex gap-2">
          {PURITIES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPurity(p.value)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                purity === p.value
                  ? "bg-slate-700 text-white dark:bg-slate-600"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* Form preset */}
      <section className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Item type</label>
        <div className="flex flex-wrap gap-2">
          {FORMS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => {
                setForm(f.value);
                setMakingPct(f.making);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                form === f.value
                  ? "bg-slate-700 text-white dark:bg-slate-600"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Making charge slider */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Making charge</label>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{makingPct}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={30}
          step={1}
          value={makingPct}
          onChange={(e) => setMakingPct(Number(e.target.value))}
          className="w-full accent-slate-600"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 dark:text-zinc-500">
          <span>0% (coins/bars)</span>
          <span>30% (intricate)</span>
        </div>
      </section>

      {/* GST toggle */}
      <section className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">GST</label>
        <div className="flex gap-2">
          {([true, false] as const).map((inc) => (
            <button
              key={String(inc)}
              type="button"
              onClick={() => setGstIncluded(inc)}
              className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${
                gstIncluded === inc
                  ? "bg-slate-700 text-white dark:bg-slate-600"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {inc ? "Incl. 3% GST" : "Excl. GST"}
            </button>
          ))}
        </div>
      </section>

      {/* Estimate */}
      <section className="rounded-xl border border-slate-200/70 bg-slate-50/60 px-5 py-4 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Estimate</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Silver ({g} g × {inr(rate999)}/g{purity === "925" ? " × 92.5%" : ""})</span>
            <span className="font-medium"><AnimatedNumber value={silverValue} format={inr} /></span>
          </div>
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>Making charge ({makingPct}%)</span>
            <span className="font-medium"><AnimatedNumber value={makingCharge} format={inr} /></span>
          </div>
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
            <span>{gstIncluded ? "GST (3%)" : "GST (not applied)"}</span>
            <span className="font-medium"><AnimatedNumber value={gst} format={inr} /></span>
          </div>
          <div className="border-t border-slate-200 pt-2 dark:border-zinc-700">
            <div className="flex justify-between text-base font-extrabold text-zinc-900 dark:text-zinc-100">
              <span>Estimated total</span>
              <span><AnimatedNumber value={total} format={inr} /></span>
            </div>
          </div>
        </div>
        <p className="mt-3 text-[10px] text-zinc-500 dark:text-zinc-500">
          Estimate at today&apos;s 999 silver rate. Actual cost varies by jeweller, design and current market.
        </p>
      </section>
    </div>
  );
}
