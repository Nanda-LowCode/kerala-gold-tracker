import type { GoldRate } from "@/lib/types";
import {
  RISING_STREAK,
  FALLING_STREAK,
  FLAT_TODAY,
  MIXED_RECENT,
  NEW_HIGH,
  NEAR_HIGH,
  NEAR_LOW,
  NEW_LOW,
  MID_RANGE,
  PAVAN_NOTE,
  ABOVE_MONTH_AVG,
  BELOW_MONTH_AVG,
  AT_MONTH_AVG,
} from "@/lib/commentaryBranches";

export type StreakDirection = "up" | "down" | "flat" | "mixed";
export type RangePosition =
  | "new-high"
  | "near-high"
  | "mid"
  | "near-low"
  | "new-low";

export interface DayStats {
  today: GoldRate;
  yesterday: GoldRate | null;

  change22k: number | null;
  change22kPct: number | null;

  weekHigh: number | null;
  weekLow: number | null;
  weekAvg: number | null;
  weekNetChange: number | null;

  monthAvg: number | null;
  monthHigh: number | null;
  monthLow: number | null;
  monthPctDiff: number | null;
  positionInMonthRange: RangePosition | null;

  streakDirection: StreakDirection;
  streakDays: number;
}

/**
 * Compute per-day stats for commentary.
 *
 * @param history Rows ordered most-recent-first. `history[0]` must be the day
 *                we are reporting on. Up to ~30 rows expected.
 */
export function computeStats(history: GoldRate[]): DayStats {
  if (history.length === 0) {
    throw new Error("computeStats requires at least one row (the report day).");
  }

  const today = history[0];
  const yesterday = history[1] ?? null;

  const change22k = yesterday ? today.rate_22k_1g - yesterday.rate_22k_1g : null;
  const change22kPct =
    yesterday && yesterday.rate_22k_1g > 0
      ? (change22k! / yesterday.rate_22k_1g) * 100
      : null;

  const week = history.slice(0, 7).map((r) => r.rate_22k_1g);
  const weekHigh = week.length > 0 ? Math.max(...week) : null;
  const weekLow = week.length > 0 ? Math.min(...week) : null;
  const weekAvg =
    week.length > 0 ? week.reduce((a, b) => a + b, 0) / week.length : null;
  const weekNetChange =
    week.length >= 2 ? week[0] - week[week.length - 1] : null;

  const month = history.slice(0, 30).map((r) => r.rate_22k_1g);
  const monthHigh = month.length > 0 ? Math.max(...month) : null;
  const monthLow = month.length > 0 ? Math.min(...month) : null;
  const monthAvg =
    month.length > 0 ? month.reduce((a, b) => a + b, 0) / month.length : null;
  const monthPctDiff =
    monthAvg && monthAvg > 0
      ? ((today.rate_22k_1g - monthAvg) / monthAvg) * 100
      : null;

  let positionInMonthRange: RangePosition | null = null;
  if (monthHigh !== null && monthLow !== null && month.length >= 5) {
    const range = monthHigh - monthLow;
    if (range === 0) {
      positionInMonthRange = "mid";
    } else if (today.rate_22k_1g >= monthHigh) {
      positionInMonthRange = "new-high";
    } else if (today.rate_22k_1g <= monthLow) {
      positionInMonthRange = "new-low";
    } else {
      const pos = (today.rate_22k_1g - monthLow) / range;
      if (pos >= 0.8) positionInMonthRange = "near-high";
      else if (pos <= 0.2) positionInMonthRange = "near-low";
      else positionInMonthRange = "mid";
    }
  }

  let streakDirection: StreakDirection = "flat";
  let streakDays = 0;
  if (history.length >= 2) {
    const deltas: number[] = [];
    for (let i = 0; i < history.length - 1; i++) {
      deltas.push(history[i].rate_22k_1g - history[i + 1].rate_22k_1g);
      if (deltas.length >= 7) break;
    }
    const firstSign = Math.sign(deltas[0]);
    if (firstSign === 0) {
      streakDirection = "flat";
      streakDays = 1;
      for (const d of deltas) {
        if (d === 0) streakDays++;
        else break;
      }
    } else {
      streakDirection = firstSign > 0 ? "up" : "down";
      streakDays = 0;
      for (const d of deltas) {
        if (Math.sign(d) === firstSign) streakDays++;
        else break;
      }
      if (streakDays === 0) streakDirection = "mixed";
    }
  }

  return {
    today,
    yesterday,
    change22k,
    change22kPct,
    weekHigh,
    weekLow,
    weekAvg,
    weekNetChange,
    monthAvg,
    monthHigh,
    monthLow,
    monthPctDiff,
    positionInMonthRange,
    streakDirection,
    streakDays,
  };
}

function hashDate(date: string): number {
  let h = 0;
  for (let i = 0; i < date.length; i++) {
    h = ((h << 5) - h + date.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function pick(arr: string[], seed: number, salt: number): string {
  return arr[(seed + salt) % arr.length];
}

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

function formatINR(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

/**
 * Build 3 paragraphs of commentary for the given day's stats.
 * Paragraph 0 is a data-grounded lede unique to each day's rates.
 * Deterministic: same `stats.today.date` always produces the same output.
 */
export function generateCommentary(stats: DayStats): string[] {
  const seed = hashDate(stats.today.date);
  const paragraphs: string[] = [];

  // Paragraph 0: data-grounded lede — always unique because prices change daily
  const r22 = formatINR(stats.today.rate_22k_1g);
  const r24 = formatINR(stats.today.rate_24k_1g);
  const pavan = formatINR(stats.today.rate_22k_1g * 8);
  if (stats.change22k !== null && stats.change22kPct !== null) {
    const dir = stats.change22k > 0 ? "rose" : stats.change22k < 0 ? "fell" : "held steady";
    const absDiff = formatINR(Math.abs(stats.change22k));
    const absPct = Math.abs(stats.change22kPct).toFixed(2);
    if (stats.change22k === 0) {
      paragraphs.push(
        `The Kerala gold rate held unchanged on this date, with 22 Karat gold at ${r22} per gram (${pavan} per sovereign) and 24 Karat at ${r24} per gram.`
      );
    } else {
      paragraphs.push(
        `The Kerala board rate for 22 Karat gold ${dir} by ${absDiff} (${absPct}%) to ${r22} per gram on this date, equivalent to ${pavan} per sovereign (pavan). The 24 Karat rate stood at ${r24} per gram.`
      );
    }
  } else {
    paragraphs.push(
      `The Kerala board rate for 22 Karat gold stood at ${r22} per gram (${pavan} per sovereign) on this date. The 24 Karat rate was ${r24} per gram.`
    );
  }

  // Paragraph 1: streak + month-range position
  const sentences1: string[] = [];

  if (stats.streakDirection === "up" && stats.streakDays >= 2) {
    sentences1.push(
      fill(pick(RISING_STREAK, seed, 1), { days: String(stats.streakDays) })
    );
  } else if (stats.streakDirection === "down" && stats.streakDays >= 2) {
    sentences1.push(
      fill(pick(FALLING_STREAK, seed, 2), { days: String(stats.streakDays) })
    );
  } else if (stats.streakDirection === "flat") {
    sentences1.push(pick(FLAT_TODAY, seed, 3));
  } else {
    sentences1.push(pick(MIXED_RECENT, seed, 4));
  }

  if (stats.positionInMonthRange === "new-high") {
    sentences1.push(pick(NEW_HIGH, seed, 5));
  } else if (stats.positionInMonthRange === "near-high") {
    sentences1.push(pick(NEAR_HIGH, seed, 6));
  } else if (stats.positionInMonthRange === "near-low") {
    sentences1.push(pick(NEAR_LOW, seed, 7));
  } else if (stats.positionInMonthRange === "new-low") {
    sentences1.push(pick(NEW_LOW, seed, 8));
  } else if (stats.positionInMonthRange === "mid") {
    sentences1.push(pick(MID_RANGE, seed, 9));
  }

  paragraphs.push(sentences1.join(" "));

  // Paragraph 2: month-average context + pavan callout
  const sentences2: string[] = [];

  if (stats.monthPctDiff !== null) {
    const absPct = Math.abs(stats.monthPctDiff).toFixed(1);
    if (stats.monthPctDiff > 0.5) {
      sentences2.push(fill(pick(ABOVE_MONTH_AVG, seed, 10), { pct: absPct }));
    } else if (stats.monthPctDiff < -0.5) {
      sentences2.push(fill(pick(BELOW_MONTH_AVG, seed, 11), { pct: absPct }));
    } else {
      sentences2.push(pick(AT_MONTH_AVG, seed, 12));
    }
  }

  sentences2.push(
    fill(pick(PAVAN_NOTE, seed, 13), {
      pavan: formatINR(stats.today.rate_22k_1g * 8),
    })
  );

  paragraphs.push(sentences2.join(" "));

  return paragraphs;
}
