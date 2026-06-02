import type { DayStats } from "@/lib/commentary";

export type VerdictKind = "buy" | "fair" | "mid" | "peak";
export type VerdictTone = "emerald" | "amber" | "coral";

export interface Verdict {
  kind: VerdictKind;
  headline: string;
  sub: string;
  tone: VerdictTone;
}

export function computeVerdict(stats: DayStats): Verdict | null {
  if (!stats.positionInMonthRange || stats.monthPctDiff === null) {
    return null;
  }

  const pct = stats.monthPctDiff;
  const absPct = Math.abs(pct).toFixed(1);

  if (
    stats.positionInMonthRange === "new-low" ||
    stats.positionInMonthRange === "near-low"
  ) {
    return {
      kind: "buy",
      headline: "Buy Zone",
      sub: `${absPct}% below monthly average`,
      tone: "emerald",
    };
  }

  if (
    stats.positionInMonthRange === "near-high" ||
    stats.positionInMonthRange === "new-high"
  ) {
    return {
      kind: "peak",
      headline: "Near Peak",
      sub: `${absPct}% above monthly average`,
      tone: "coral",
    };
  }

  // positionInMonthRange === "mid"
  if (Math.abs(pct) <= 0.5) {
    return {
      kind: "fair",
      headline: "Fair Pricing",
      sub: "at the monthly average",
      tone: "amber",
    };
  }

  return {
    kind: "mid",
    headline: "Mid Range",
    sub: pct > 0 ? `${absPct}% above average` : `${absPct}% below average`,
    tone: "amber",
  };
}
