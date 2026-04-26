"use client";

import { useEffect, useState } from "react";

interface FXRates {
  usd_inr: number;
  aed_inr: number;
  qar_inr: number;
  omr_inr: number;
  date: string;
}

const PAIRS = [
  { key: "usd_inr" as const, from: "USD", flag: "🇺🇸", label: "US Dollar" },
  { key: "aed_inr" as const, from: "AED", flag: "🇦🇪", label: "UAE Dirham" },
  { key: "qar_inr" as const, from: "QAR", flag: "🇶🇦", label: "Qatari Riyal" },
  { key: "omr_inr" as const, from: "OMR", flag: "🇴🇲", label: "Omani Rial" },
];

export default function ExchangeTicker() {
  const [rates, setRates] = useState<FXRates | null>(null);

  useEffect(() => {
    fetch(
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"
    )
      .then((r) => r.json())
      .then((data) => {
        const usd = data.usd as Record<string, number>;
        setRates({
          usd_inr: usd.inr,
          aed_inr: usd.inr / usd.aed,
          qar_inr: usd.inr / usd.qar,
          omr_inr: usd.inr / usd.omr,
          date: data.date as string,
        });
      })
      .catch(() => {}); // non-critical — silently skip if API is down
  }, []);

  if (!rates) return null;

  return (
    <section
      className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm shadow-amber-100/20 dark:shadow-none"
      aria-label="Live exchange rates"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            Live Exchange Rates
          </h2>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            Driving today&apos;s Kerala gold price
          </p>
        </div>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
          {rates.date}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PAIRS.map((p) => {
          const rate = rates[p.key];
          return (
            <div
              key={p.key}
              className="flex flex-col gap-0.5 rounded-xl bg-zinc-50 dark:bg-zinc-950/50 px-3 py-2.5 ring-1 ring-inset ring-zinc-200/60 dark:ring-zinc-800"
            >
              <div className="flex items-center gap-1.5">
                <span className="text-sm leading-none">{p.flag}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {p.from}/INR
                </span>
              </div>
              <p className="text-lg font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
                ₹{rate.toFixed(2)}
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                {p.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
