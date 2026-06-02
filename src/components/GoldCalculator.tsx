"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";

const TOLA = 11.6638; // grams per tola (traditional Indian standard)

interface GoldCalculatorProps {
  rate18k: number;
  rate22k: number;
  rate24k: number;
}

type Karat = "18k" | "21k" | "22k" | "24k";
type Unit = "gram" | "pavan" | "tola";

function toGrams(v: number | "", unit: Unit): number {
  if (v === "") return 0;
  if (unit === "pavan") return v * 8;
  if (unit === "tola") return v * TOLA;
  return v;
}

function fromGrams(grams: number, unit: Unit): number {
  if (unit === "pavan") return parseFloat((grams / 8).toFixed(4));
  if (unit === "tola") return parseFloat((grams / TOLA).toFixed(4));
  return parseFloat(grams.toFixed(4));
}

export default function GoldCalculator({
  rate18k,
  rate22k,
  rate24k,
}: GoldCalculatorProps) {
  const [karat, setKarat] = useState<Karat>("22k");
  const [unit, setUnit] = useState<Unit>("gram");
  const [weightValue, setWeightValue] = useState<number | "">(8);
  const [makingChargePercent, setMakingChargePercent] = useState<number | "">(10);

  const rates: Record<Karat, number> = {
    "18k": rate18k,
    "21k": rate22k * (21 / 22),
    "22k": rate22k,
    "24k": rate24k,
  };

  const currentRate = rates[karat];
  const parsedGrams = toGrams(weightValue, unit);
  const parsedMaking = typeof makingChargePercent === "number" ? makingChargePercent : 0;

  const pavans = parsedGrams / 8;
  const tolas = parsedGrams / TOLA;
  const basePrice = parsedGrams * currentRate;
  const makingCharges = basePrice * (parsedMaking / 100);
  const gst = (basePrice + makingCharges) * 0.03;
  const totalPrice = basePrice + makingCharges + gst;

  function handleUnitChange(newUnit: Unit) {
    if (newUnit === unit) return;
    const grams = toGrams(weightValue, unit);
    const converted = fromGrams(grams, newUnit);
    setWeightValue(converted || "");
    setUnit(newUnit);
  }

  const unitSuffix = unit === "gram" ? "g" : unit === "pavan" ? "pav" : "tola";
  const unitPlaceholder =
    unit === "gram" ? "e.g. 8" : unit === "pavan" ? "e.g. 1" : "e.g. 0.69";

  const weightBadge =
    unit === "tola"
      ? `= ${parsedGrams > 0 ? parsedGrams.toFixed(2) : "0"}g · ~${pavans.toFixed(2)} Pav`
      : unit === "pavan"
      ? `= ${parsedGrams > 0 ? parsedGrams.toFixed(2) : "0"}g · ~${tolas.toFixed(3)} Tola`
      : `~${pavans.toFixed(2)} Pav · ~${tolas.toFixed(3)} Tola`;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-amber-200/70 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-lg shadow-amber-100/40 dark:shadow-none md:p-8"
      aria-labelledby="calculator-heading"
    >
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-amber-100/60 to-transparent dark:from-amber-900/10 blur-3xl" />

      <div className="relative">
        <div className="mb-6">
          <h2
            id="calculator-heading"
            className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            Jewelry Estimator & Calculator
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Estimate jewelry cost including making charges and 3% GST. Supports
            Gram, Pavan, and Tola (Gulf standard).
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Inputs Section */}
          <div className="space-y-6">
            {/* Karat Selection */}
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Gold Purity
              </label>
              <div className="flex gap-1.5 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/70 p-1">
                {(["18k", "21k", "22k", "24k"] as const).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKarat(k)}
                    className={`flex-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-all sm:text-sm ${
                      karat === k
                        ? "bg-amber-500 text-white shadow-sm ring-1 ring-amber-600/50 dark:bg-amber-600 dark:ring-amber-500/50"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                    }`}
                  >
                    {k.toUpperCase()}
                  </button>
                ))}
              </div>
              {karat === "21k" && (
                <p className="mt-1.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                  21K (875): common in Gulf-imported machine-made jewelry
                </p>
              )}
            </div>

            {/* Weight Input */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  htmlFor="weight-input"
                >
                  Weight
                </label>
                <div className="rounded-full bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:text-amber-400 ring-1 ring-inset ring-amber-200/60 dark:ring-amber-900/50">
                  {parsedGrams > 0 ? weightBadge : "0"}
                </div>
              </div>

              {/* Unit toggle */}
              <div className="mb-2 flex gap-1 rounded-lg bg-zinc-100/70 dark:bg-zinc-800/70 p-1">
                {(["gram", "pavan", "tola"] as const).map((u) => (
                  <button
                    key={u}
                    onClick={() => handleUnitChange(u)}
                    className={`flex-1 rounded-md px-2 py-1 text-xs font-semibold capitalize transition-all ${
                      unit === u
                        ? "bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-zinc-100 ring-1 ring-zinc-200/80 dark:ring-zinc-600"
                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    }`}
                  >
                    {u === "pavan" ? "Pavan (8g)" : u === "tola" ? "Tola (11.66g)" : "Gram"}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  id="weight-input"
                  type="number"
                  min="0.001"
                  step={unit === "gram" ? "0.1" : unit === "pavan" ? "0.5" : "0.01"}
                  value={weightValue}
                  onChange={(e) =>
                    setWeightValue(
                      e.target.value === "" ? "" : parseFloat(e.target.value)
                    )
                  }
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 px-4 py-2.5 pr-16 text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/20"
                  placeholder={unitPlaceholder}
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-sm font-medium text-zinc-400 pointer-events-none">
                  {unitSuffix}
                </span>
              </div>
            </div>

            {/* Making Charges Slider & Input */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                  htmlFor="making-slider"
                >
                  Making Charges (%)
                </label>
              </div>
              <div className="flex items-center gap-4">
                <input
                  id="making-slider"
                  type="range"
                  min="0"
                  max="40"
                  step="1"
                  value={parsedMaking}
                  onChange={(e) =>
                    setMakingChargePercent(parseFloat(e.target.value))
                  }
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 dark:bg-zinc-800 accent-amber-500 hover:accent-amber-600"
                />
                <div className="relative w-20 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="40"
                    value={makingChargePercent}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        setMakingChargePercent("");
                        return;
                      }
                      const v = parseFloat(e.target.value);
                      setMakingChargePercent(
                        isNaN(v) ? "" : Math.min(40, Math.max(0, v))
                      );
                    }}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950/50 px-3 py-1.5 text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100 shadow-sm transition-colors focus:border-amber-400 focus:outline-none focus:ring-4 focus:ring-amber-500/10 dark:focus:ring-amber-500/20"
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center text-xs font-bold text-zinc-400 pointer-events-none">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="flex flex-col rounded-xl bg-zinc-50 dark:bg-zinc-950/50 p-5 ring-1 ring-inset ring-zinc-200/80 dark:ring-zinc-800/80">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Estimated Breakdown
            </h3>

            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                Gold Value ({karat.toUpperCase()})
              </span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {formatCurrency(basePrice)}
              </span>
            </div>

            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">
                Making Charges ({parsedMaking}%)
              </span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {formatCurrency(makingCharges)}
              </span>
            </div>

            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-zinc-500 dark:text-zinc-400">GST (3%)</span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                {formatCurrency(gst)}
              </span>
            </div>

            <div className="mt-auto border-t border-zinc-200/80 dark:border-zinc-800/80 pt-4">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-500">
                    Total Estimate
                  </p>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    Incl. taxes & making
                  </p>
                </div>
                <p className="bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
