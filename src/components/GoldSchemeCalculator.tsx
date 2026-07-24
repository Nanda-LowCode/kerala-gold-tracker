"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/format";
import AnimatedNumber from "@/components/AnimatedNumber";

// Typical premium on a plain BIS-hallmarked coin over the board rate. The
// scheme's alternative is "just buy gold with the same money", and a coin is
// the cleanest like-for-like (no making charge).
const COIN_PREMIUM = 0.03;

const inr = (n: number) => formatCurrency(n);

export default function GoldSchemeCalculator({ rate22k }: { rate22k: number | null }) {
  const [monthly, setMonthly] = useState<number | "">(5000);
  const [months, setMonths] = useState<number | "">(11);
  const [bonusMonths, setBonusMonths] = useState(1);
  const [makingPct, setMakingPct] = useState(12);

  const m = typeof monthly === "number" ? monthly : 0;
  const n = typeof months === "number" ? months : 0;

  const totalPaid = m * n;
  const bonusAmount = m * bonusMonths;
  const maturityValue = totalPaid + bonusAmount;
  const bonusPct = totalPaid > 0 ? (bonusAmount / totalPaid) * 100 : 0;

  // Redemption is jewellery-only, so a making charge applies to the gold value.
  const schemeGoldValue = maturityValue / (1 + makingPct / 100);
  const makingPaid = maturityValue - schemeGoldValue;

  // The same cash put into a plain coin instead (small premium, no making).
  const coinGoldValue = totalPaid / (1 + COIN_PREMIUM);

  const diff = schemeGoldValue - coinGoldValue;
  const diffPct = coinGoldValue > 0 ? (diff / coinGoldValue) * 100 : 0;

  const grams = (v: number) => (rate22k && v > 0 ? `≈ ${(v / rate22k).toFixed(1)} g` : "");

  const verdict =
    diffPct > 2
      ? { label: "The scheme comes out ahead", tone: "good" as const }
      : diffPct >= -2
      ? { label: "It's basically a wash", tone: "meh" as const }
      : { label: "You'd do better buying coins", tone: "bad" as const };

  const toneClass = {
    good: "bg-emerald-50 text-emerald-700 ring-emerald-200/70 dark:bg-emerald-950/30 dark:text-emerald-400 dark:ring-emerald-800/50",
    meh: "bg-amber-50 text-amber-700 ring-amber-200/70 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/50",
    bad: "bg-red-50 text-red-700 ring-red-200/70 dark:bg-red-950/30 dark:text-red-400 dark:ring-red-800/50",
  }[verdict.tone];

  return (
    <div className="space-y-6">
      {/* Inputs */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Monthly installment (₹)</label>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={monthly}
            onChange={(e) => setMonthly(e.target.value === "" ? "" : Math.max(0, Number(e.target.value)))}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-amber-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="e.g. 5000"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Installments you pay</label>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={months}
            onChange={(e) => setMonths(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-900 outline-none focus:border-amber-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
            placeholder="e.g. 11"
          />
        </div>
      </div>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Jeweller&apos;s bonus (months of installment)</label>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{bonusMonths}</span>
        </div>
        <input type="range" min={0} max={2} step={0.25} value={bonusMonths} onChange={(e) => setBonusMonths(Number(e.target.value))} className="w-full accent-amber-500" />
        <p className="text-[10px] text-zinc-500 dark:text-zinc-500">Most schemes add ~1 installment (&ldquo;12th month free&rdquo;).</p>
      </section>

      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Making charge on the jewellery you&apos;ll buy</label>
          <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{makingPct}%</span>
        </div>
        <input type="range" min={0} max={30} step={1} value={makingPct} onChange={(e) => setMakingPct(Number(e.target.value))} className="w-full accent-amber-500" />
        <p className="text-[10px] text-zinc-500 dark:text-zinc-500">You can only redeem for jewellery — so this is the catch. Plain designs ~8%, intricate ~25%.</p>
      </section>

      {/* What the scheme advertises */}
      <section className="rounded-2xl border border-zinc-200/70 bg-zinc-50/70 p-5 dark:border-zinc-800 dark:bg-zinc-900/50">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">What the scheme advertises</h2>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between text-zinc-600 dark:text-zinc-400"><span>You pay ({n} × {inr(m)})</span><span className="font-medium"><AnimatedNumber value={totalPaid} format={inr} /></span></div>
          <div className="flex justify-between text-emerald-700 dark:text-emerald-400"><span>Jeweller&apos;s bonus (+{bonusPct.toFixed(1)}%)</span><span className="font-semibold">+<AnimatedNumber value={bonusAmount} format={inr} /></span></div>
          <div className="flex justify-between border-t border-zinc-200 pt-2 text-base font-bold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"><span>Maturity value</span><span><AnimatedNumber value={maturityValue} format={inr} /></span></div>
        </div>
      </section>

      {/* The reality */}
      <section className="rounded-2xl border border-amber-200/70 bg-amber-50/50 p-5 dark:border-amber-900/40 dark:bg-amber-950/20">
        <h2 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">The reality (after making charges)</h2>
        <div className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between text-red-600 dark:text-red-400"><span>Making charge on redemption ({makingPct}%)</span><span className="font-semibold">−<AnimatedNumber value={makingPaid} format={inr} /></span></div>
          <div className="flex justify-between text-zinc-700 dark:text-zinc-300"><span>Gold you actually get {grams(schemeGoldValue) && <em className="not-italic text-zinc-400">{grams(schemeGoldValue)}</em>}</span><span className="font-bold"><AnimatedNumber value={schemeGoldValue} format={inr} /></span></div>
          <div className="flex justify-between text-zinc-500 dark:text-zinc-400"><span>Same ₹ in plain coins instead {grams(coinGoldValue) && <em className="not-italic text-zinc-400">{grams(coinGoldValue)}</em>}</span><span className="font-medium"><AnimatedNumber value={coinGoldValue} format={inr} /></span></div>
        </div>

        <div className={`mt-4 rounded-xl px-4 py-3 ring-1 ring-inset ${toneClass}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">{verdict.label}</span>
            <span className="text-sm font-extrabold">{diff >= 0 ? "+" : "−"}<AnimatedNumber value={Math.abs(diff)} format={inr} /></span>
          </div>
          <p className="mt-1 text-xs opacity-90">
            vs simply buying coins with the same money ({diffPct >= 0 ? "+" : ""}{diffPct.toFixed(1)}%). The bonus mostly just pre-pays your making charge.
          </p>
        </div>
      </section>

      <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        This compares the scheme&apos;s bonus against the making charge you pay on redemption — it does not predict gold-price moves.
        Schemes are <strong className="text-zinc-600 dark:text-zinc-300">jewellery-only</strong>, can&apos;t be exited for cash, and your rupees buy gold at the <em>maturity</em> rate (so a rising gold price during the term buys you less). Coin premium assumed ~3%.
      </p>
    </div>
  );
}
