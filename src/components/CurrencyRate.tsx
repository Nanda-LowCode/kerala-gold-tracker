"use client";

import { useEffect, useState } from "react";
import type { FxCurrency, FxRates } from "@/lib/fx";
import AnimatedNumber from "@/components/AnimatedNumber";

const META: Record<FxCurrency, { flag: string; label: string; locale: string; dp: number }> = {
  AED: { flag: "🇦🇪", label: "UAE Dirham", locale: "en-AE", dp: 2 },
  SAR: { flag: "🇸🇦", label: "Saudi Riyal", locale: "en-SA", dp: 2 },
  QAR: { flag: "🇶🇦", label: "Qatari Riyal", locale: "en-QA", dp: 2 },
  KWD: { flag: "🇰🇼", label: "Kuwaiti Dinar", locale: "en-KW", dp: 3 },
  OMR: { flag: "🇴🇲", label: "Omani Rial", locale: "en-OM", dp: 3 },
  BHD: { flag: "🇧🇭", label: "Bahraini Dinar", locale: "en-BH", dp: 3 },
  USD: { flag: "🇺🇸", label: "US Dollar", locale: "en-US", dp: 2 },
  GBP: { flag: "🇬🇧", label: "British Pound", locale: "en-GB", dp: 2 },
  EUR: { flag: "🇪🇺", label: "Euro", locale: "en-IE", dp: 2 },
  SGD: { flag: "🇸🇬", label: "Singapore Dollar", locale: "en-SG", dp: 2 },
  AUD: { flag: "🇦🇺", label: "Australian Dollar", locale: "en-AU", dp: 2 },
  CAD: { flag: "🇨🇦", label: "Canadian Dollar", locale: "en-CA", dp: 2 },
};

const STORAGE_KEY = "lgk_fx_currency";

/**
 * Optional label overrides for non-English rendering (Malayalam, etc.).
 *
 * `footnote` is a plain string — this is a client component, and function
 * props can't cross the server/client boundary. Callers who need dynamic
 * text (e.g. the FX-as-of date) interpolate it on the server before passing.
 */
export interface CurrencyRateLabels {
  title?: string;
  description?: string;
  currencyLabel?: string;
  perGramSuffix?: string;
  perPavanSuffix?: string;
  footnote?: string;
}

const DEFAULT_LABELS: Required<CurrencyRateLabels> = {
  title: "Gold rate in your currency",
  description: "For NRIs & the Kerala diaspora — today's board rate, converted live.",
  currencyLabel: "Choose currency",
  perGramSuffix: "/g",
  perPavanSuffix: "/pavan (8g)",
  // Empty string sentinel — the render falls back to the interpolated default
  // when the caller hasn't supplied a language-specific override.
  footnote: "",
};

export default function CurrencyRate({
  rate22k,
  rate24k,
  fx,
  labels,
}: {
  rate22k: number;
  rate24k: number;
  fx: FxRates;
  labels?: CurrencyRateLabels;
}) {
  const L = { ...DEFAULT_LABELS, ...(labels ?? {}) };
  const available = (Object.keys(fx.rates) as FxCurrency[]).filter((c) => META[c]);
  // Default to AED (largest Gulf-Malayali base); fall back to whatever is first.
  const [cur, setCur] = useState<FxCurrency>(
    available.includes("AED") ? "AED" : available[0]
  );

  // Remember the visitor's choice across pages/visits.
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as FxCurrency | null;
    if (saved && available.includes(saved)) setCur(saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pick(c: FxCurrency) {
    setCur(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* private mode — non-fatal */
    }
  }

  const perInr = fx.rates[cur]!; // currency units per 1 INR
  // Formats an already-converted amount (so AnimatedNumber can tween the
  // converted value and roll when you switch currency).
  const fmtCur = (n: number) =>
    new Intl.NumberFormat(META[cur].locale, {
      style: "currency",
      currency: cur,
      maximumFractionDigits: META[cur].dp,
    }).format(n);

  const rows = [
    { label: "22K (916)", perGram: rate22k, featured: true },
    { label: "24K (999)", perGram: rate24k, featured: false },
  ];

  return (
    <section className="rounded-2xl border border-amber-200/70 bg-white p-5 shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {L.title}
          </h2>
          <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
            {L.description}
          </p>
        </div>
        <label className="relative inline-flex items-center self-start sm:self-auto">
          <span className="sr-only">{L.currencyLabel}</span>
          <select
            value={cur}
            onChange={(e) => pick(e.target.value as FxCurrency)}
            className="appearance-none rounded-xl border border-zinc-200 bg-white py-2 pl-3 pr-9 text-sm font-semibold text-zinc-900 shadow-sm outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 dark:border-zinc-700 dark:bg-zinc-950/50 dark:text-zinc-100"
          >
            {available.map((c) => (
              <option key={c} value={c}>
                {META[c].flag} {c} — {META[c].label}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 text-xs text-zinc-400">▾</span>
        </label>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`rounded-xl border p-4 ${
              row.featured
                ? "border-amber-300 bg-amber-50/50 dark:border-amber-500/40 dark:bg-amber-950/20"
                : "border-zinc-200/70 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/40"
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              {row.label}
            </p>
            <p className="mt-1 text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
              <AnimatedNumber value={row.perGram * perInr} format={fmtCur} />
              <span className="ml-1 text-xs font-medium text-zinc-500">{L.perGramSuffix}</span>
            </p>
            <p className="mt-0.5 text-sm font-semibold text-zinc-600 dark:text-zinc-300">
              <AnimatedNumber value={row.perGram * 8 * perInr} format={fmtCur} />
              <span className="ml-1 text-xs font-normal text-zinc-500">{L.perPavanSuffix}</span>
            </p>
          </div>
        ))}
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        {L.footnote ? (
          L.footnote
        ) : (
          <>
            Converted from the Kerala board rate (₹{rate22k.toLocaleString("en-IN")}/g for 22K) at
            today&apos;s exchange rate
            {fx.asOf
              ? ` (FX as of ${new Date(fx.asOf).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })})`
              : ""}
            . Indicative gold value only — excludes making charges, GST and local import duties.
          </>
        )}
      </p>
    </section>
  );
}
