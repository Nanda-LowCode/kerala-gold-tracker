"use client";

import { useState } from "react";
import Link from "next/link";
import AnimatedNumber from "@/components/AnimatedNumber";

const UNITS = [
  { id: "gram", label: "Grams", toGrams: 1 },
  { id: "pavan", label: "Pavan", toGrams: 8 },
  { id: "sovereign", label: "Sovereign", toGrams: 8 },
  { id: "tola", label: "Tola", toGrams: 11.664 },
] as const;

type UnitId = (typeof UNITS)[number]["id"];

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const qty = (n: number) => (Number.isInteger(n) ? n.toString() : parseFloat(n.toFixed(3)).toString());

export default function PavanCalculator({
  rate18k,
  rate22k,
  rate24k,
}: {
  rate18k: number;
  rate22k: number;
  rate24k: number;
}) {
  const [value, setValue] = useState<number | "">(1);
  const [unit, setUnit] = useState<UnitId>("pavan");
  const [copied, setCopied] = useState(false);

  const v = typeof value === "number" ? value : 0;
  const grams = v * UNITS.find((u) => u.id === unit)!.toGrams;
  const unitLabel = UNITS.find((u) => u.id === unit)!.label.toLowerCase();

  const purities = [
    { k: "24K", sub: "999", value: grams * rate24k, featured: false },
    { k: "22K", sub: "916", value: grams * rate22k, featured: true },
    { k: "21K", sub: "875", value: grams * rate22k * (21 / 22), featured: false },
    { k: "18K", sub: "750", value: grams * rate18k, featured: false },
  ];

  function copyResult() {
    const txt = `${qty(v)} ${unitLabel} = ${qty(grams)} g = ${qty(grams / 8)} pavan · 22K value ${inr(grams * rate22k)} — livegoldkerala.com`;
    navigator.clipboard?.writeText(txt).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {}
    );
  }

  return (
    <div className="space-y-5">
      {/* Input */}
      <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <label htmlFor="pavan-qty" className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Enter an amount
        </label>
        <input
          id="pavan-qty"
          type="number"
          min={0}
          step={0.001}
          inputMode="decimal"
          value={value}
          onChange={(e) => setValue(e.target.value === "" ? "" : Math.max(0, parseFloat(e.target.value)))}
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-2xl font-extrabold tracking-tight text-zinc-900 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-100"
          placeholder="0"
        />
        {/* unit segmented control */}
        <div className="mt-3 grid grid-cols-4 gap-1 rounded-xl bg-zinc-100/70 p-1 dark:bg-zinc-800/70">
          {UNITS.map((u) => (
            <button
              key={u.id}
              onClick={() => setUnit(u.id)}
              className={`rounded-lg px-2 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                unit === u.id
                  ? "bg-amber-500 text-white shadow-sm"
                  : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
        {/* presets */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[0.5, 1, 2, 4, 8, 10].map((p) => (
            <button
              key={p}
              onClick={() => {
                setValue(p);
                setUnit("pavan");
              }}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 transition-colors hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            >
              {p} pavan
            </button>
          ))}
        </div>
      </section>

      {/* Conversion hero */}
      <section className="relative overflow-hidden rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-50 to-white p-5 shadow-lg shadow-amber-100/50 dark:border-amber-800/50 dark:from-amber-950/30 dark:to-zinc-900 dark:shadow-none">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          {v > 0 ? (
            <>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{qty(v)} {unitLabel}</span> equals
            </>
          ) : (
            "Enter an amount above to convert"
          )}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {UNITS.map((u) => {
            const q = grams / u.toGrams;
            const isPavan = u.id === "pavan";
            return (
              <div
                key={u.id}
                className={`rounded-xl p-3 text-center ${
                  isPavan
                    ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                    : "bg-white/70 ring-1 ring-inset ring-amber-200/50 dark:bg-zinc-900/60 dark:ring-zinc-700/50"
                }`}
              >
                <div className={`text-lg font-extrabold tracking-tight ${isPavan ? "text-white" : "text-zinc-900 dark:text-zinc-100"}`}>
                  {qty(q)}
                </div>
                <div className={`text-[10px] font-semibold uppercase tracking-wider ${isPavan ? "text-amber-50" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {u.label}
                  {isPavan ? " ★" : ""}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gold value by purity */}
      <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
            Gold value today <span className="font-normal text-zinc-400">· {qty(grams)} g</span>
          </h2>
          <button
            onClick={copyResult}
            className="shrink-0 rounded-lg bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-600 transition-colors hover:bg-amber-100 hover:text-amber-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-amber-950/40"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {purities.map((p) => (
            <div
              key={p.k}
              className={`rounded-xl p-3 ${
                p.featured
                  ? "bg-amber-50 ring-1 ring-inset ring-amber-300/60 dark:bg-amber-950/30 dark:ring-amber-700/50"
                  : "bg-zinc-50 ring-1 ring-inset ring-zinc-200/60 dark:bg-zinc-950/40 dark:ring-zinc-800"
              }`}
            >
              <div className="flex items-baseline gap-1">
                <span className={`text-sm font-extrabold ${p.featured ? "text-amber-700 dark:text-amber-400" : "text-zinc-700 dark:text-zinc-300"}`}>{p.k}</span>
                <span className="text-[9px] font-semibold uppercase tracking-wider text-zinc-400">{p.sub}</span>
              </div>
              <div className="mt-1 text-base font-bold text-zinc-900 dark:text-zinc-100">
                <AnimatedNumber value={p.value} format={inr} />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
          Raw gold value only — making charges &amp; 3% GST not included. 1 pavan = 1 sovereign = 8 g · 1 tola = 11.664 g. 21K is derived from the 916 rate.
        </p>
      </section>

      {/* Hand-off to the portfolio tracker. Someone converting a weight to pavan is
          usually holding that gold and wondering what it's worth — the most natural
          moment on the site to offer to keep tracking it. */}
      {grams > 0 && (
        <Link
          href={`/my-gold?g=${qty(grams)}`}
          className="group flex items-center justify-between gap-3 rounded-2xl border border-amber-200/70 bg-amber-50/60 p-4 transition-colors hover:border-amber-300 hover:bg-amber-100/60 dark:border-amber-800/40 dark:bg-amber-950/20 dark:hover:bg-amber-950/40"
        >
          <span>
            <span className="block text-sm font-bold text-amber-800 dark:text-amber-300">
              Own this {qty(grams)} g? Track it in My Gold
            </span>
            <span className="mt-0.5 block text-xs text-amber-700/80 dark:text-amber-400/70">
              Tell us the date you bought and we&apos;ll price it from that day&apos;s board rate — then follow the gain.
            </span>
          </span>
          <span
            aria-hidden
            className="shrink-0 text-lg font-bold text-amber-600 transition-transform group-hover:translate-x-0.5 dark:text-amber-400"
          >
            →
          </span>
        </Link>
      )}
    </div>
  );
}
