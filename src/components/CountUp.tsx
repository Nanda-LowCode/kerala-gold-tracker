"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/format";

/**
 * Animates a currency value up to its final value once on mount (~easeOutCubic).
 * SSR-safe: the initial render shows the final value (so the real number is in
 * the HTML for SEO and there's no hydration mismatch), then the effect runs the
 * count-up. Honours prefers-reduced-motion (no animation → stays at the value).
 */
export default function CountUp({
  value,
  durationMs = 900,
}: {
  value: number;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setDisplay(t < 1 ? value * eased : value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return <span className="tabular-nums">{formatCurrency(display)}</span>;
}
