"use client";

import { useEffect, useState } from "react";

const OZ_TO_GRAM = 31.1035;
const inr = (n: number) => "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

/**
 * Live international spot-gold ticker (24K, per gram, INR). Real-time gold price
 * from gold-api.com (free, no key) × the daily USD→INR rate. Refreshes each
 * minute for a "live market" feel — clearly distinct from the once-daily AKGSMA
 * board rate, which additionally carries India's import duty + local premium.
 *
 * Renders at a fixed height from first paint (skeleton → value, or a graceful
 * fallback line on failure) so it never causes layout shift.
 */
export default function SpotGoldTicker() {
  const [perGram, setPerGram] = useState<number | null>(null);
  const [ago, setAgo] = useState("");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const [gRes, fxRes] = await Promise.all([
          fetch("https://api.gold-api.com/price/XAU", { cache: "no-store" }),
          fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json"),
        ]);
        const g = await gRes.json();
        const fx = await fxRes.json();
        const usdPerOz = g?.price;
        const inrPerUsd = fx?.usd?.inr;
        if (!alive) return;
        if (typeof usdPerOz === "number" && typeof inrPerUsd === "number") {
          setPerGram((usdPerOz * inrPerUsd) / OZ_TO_GRAM);
          setAgo(typeof g?.updatedAtReadable === "string" ? g.updatedAtReadable : "just now");
        } else {
          setFailed(true);
        }
      } catch {
        if (alive) setFailed(true);
      }
    };
    load();
    const id = setInterval(load, 60000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, []);

  return (
    <section className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          <span className="pulse-glow inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Live · International Spot (24K)
        </span>
        {perGram !== null && ago && (
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400">updated {ago}</span>
        )}
      </div>

      <div className="mt-1.5 flex items-baseline gap-2">
        {perGram !== null ? (
          <p className="text-xl font-extrabold tracking-tight tabular-nums text-zinc-900 dark:text-zinc-100">
            {inr(perGram)}
            <span className="ml-0.5 text-xs font-semibold text-zinc-500">/g</span>
          </p>
        ) : failed ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Live market price unavailable right now.</p>
        ) : (
          <p className="h-6 w-28 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" aria-hidden />
        )}
      </div>

      <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
        Global market price (LBMA). The Kerala board rate above is higher — it includes import
        duty and local premium.
      </p>
    </section>
  );
}
