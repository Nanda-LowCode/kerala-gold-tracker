"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tweens a number from its previous value to the new one whenever `value`
 * changes — the "roll" you see when a calculator recomputes. Distinct from
 * CountUp (which counts up from zero once on mount): this animates from wherever
 * it currently is, so dragging a slider produces a smooth continuous roll.
 *
 * SSR-safe (first paint shows the real value) and honours prefers-reduced-motion
 * (snaps instantly). tabular-nums keeps the width steady during the roll.
 */
export default function AnimatedNumber({
  value,
  format,
  durationMs = 380,
}: {
  value: number;
  format: (n: number) => string;
  durationMs?: number;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef(0);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    const to = value;
    // Reduced-motion (or no change) => zero duration, so the first frame snaps
    // to the target. Keeping all setState inside the rAF callback avoids the
    // synchronous-setState-in-effect lint rule.
    const dur = reduce ? 0 : durationMs;
    const start = performance.now();
    const tick = (now: number) => {
      const t = dur <= 0 ? 1 : Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const cur = from + (to - from) * eased;
      fromRef.current = t < 1 ? cur : to;
      setDisplay(t < 1 ? cur : to);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [value, durationMs]);

  return <span className="tabular-nums">{format(display)}</span>;
}
