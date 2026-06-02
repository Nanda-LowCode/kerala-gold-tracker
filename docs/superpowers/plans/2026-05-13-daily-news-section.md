# Daily Gold News Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an auto-generated daily commentary section at `/news` and `/news/[date]` that statically renders one page per date in `daily_gold_rates`, producing ~250 words of unique per-day prose to give Google a fresh-content signal.

**Architecture:** Next.js 16 App Router. Pure server components. A `commentary.ts` module computes per-day stats from existing Supabase rows and generates 2–3 paragraphs by picking deterministic phrasing variants from `commentaryBranches.ts`. Pages render statically via `generateStaticParams` and revalidate from the existing cron route. No new data sources, no new cron jobs, no LLM dependency.

**Tech Stack:** Next.js 16.2.4 (App Router), TypeScript, Tailwind CSS v4, Supabase (`@supabase/supabase-js`), existing `revalidatePath` flow.

---

## Pre-flight reading

The project's `AGENTS.md` warns this Next.js version has breaking changes from prior versions. **Before Task 4**, read these to confirm the API shapes used in the new pages:

- `node_modules/next/dist/docs/02-app-router/02-routes/05-dynamic-routes.mdx` (or whichever filename exists under that path) — confirm whether `params` is a Promise (Next.js 15+) or a plain object, and the exact shape `generateStaticParams` must return.
- `node_modules/next/dist/docs/02-app-router/02-routes/06-route-handlers.mdx` — only if cron-route changes look surprising.
- Briefly scan `src/app/[city]/page.tsx` and `src/app/blog/[slug]/page.tsx` for the existing dynamic-route patterns used in this codebase. Match those patterns exactly.

If `params` is a Promise in 16.2.4, all `{ params }: { params: ... }` signatures in the code blocks below should be wrapped as `Promise<...>` and `await`-ed. Match what the existing dynamic routes already do.

---

## File structure

**Created:**

- `src/lib/commentary.ts` — types, `computeStats()`, `generateCommentary()`. Pure functions, no I/O.
- `src/lib/commentaryBranches.ts` — phrasing variants per condition. Plain string arrays.
- `src/app/news/page.tsx` — hub: lists most recent daily posts.
- `src/app/news/[date]/page.tsx` — individual day page.
- `scripts/verify-commentary.mjs` — one-off dev verification of `generateCommentary` output against synthetic inputs. Not deployed.

**Modified:**

- `src/app/sitemap.ts` — append `/news` and one `/news/[date]` URL per date in DB.
- `src/app/api/cron/update-rates/route.ts` — add `revalidatePath('/news')` and `revalidatePath('/news/<today>')` after upsert; add news URLs to the IndexNow ping.
- `src/components/DashboardLayout.tsx` — add a "Daily Market Updates" section above the existing "From the Blog" section; add a "Daily Updates" link to the footer tool grid.

---

## Task 1: Add `DayStats` type and `computeStats()` to `commentary.ts`

**Files:**

- Create: `src/lib/commentary.ts`

`computeStats()` is a pure function that takes today's row plus the most-recent-first history (today included at index 0) and returns every numeric input the prose generator needs.

- [ ] **Step 1: Create the file with types and `computeStats`**

```typescript
// src/lib/commentary.ts
import type { GoldRate } from "@/lib/types";

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
```

- [ ] **Step 2: Run type-check to confirm no errors**

Run: `npx tsc --noEmit`
Expected: no errors mentioning `src/lib/commentary.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/commentary.ts
git commit -m "feat(news): add DayStats type and computeStats() pure function"
```

---

## Task 2: Add `commentaryBranches.ts` with phrasing variants

**Files:**

- Create: `src/lib/commentaryBranches.ts`

Variants are written as complete sentences. Concatenation in `generateCommentary` will not interpolate any extra fields — placeholders like `{days}` are substituted by simple `.replace()` before output.

- [ ] **Step 1: Create the file with variants**

Write 6 variants per branch. Each variant is a sentence; placeholders use `{name}` syntax and must match exactly the keys passed by the generator (see Task 3).

```typescript
// src/lib/commentaryBranches.ts

// Streak — direction + length
export const RISING_STREAK: string[] = [
  "Kerala's gold market continues its upward run, marking {days} consecutive days of gains.",
  "The Kerala board rate climbed again today, extending a {days}-day rally.",
  "Gold buyers in Kerala are watching another rise, the {days}th in a row.",
  "Today marks the {days}th straight session of higher 22K prices in Kerala.",
  "The trend remains firmly upward — {days} days of consecutive increases in the Kerala gold rate.",
  "Kerala's gold rate has now risen for {days} straight days, a notable run for short-term buyers.",
];

export const FALLING_STREAK: string[] = [
  "Kerala's gold rate has now eased for {days} consecutive days, offering relief to buyers.",
  "The board rate slipped again today, extending a {days}-day decline.",
  "Today's update marks the {days}th straight day of softer prices for Kerala buyers.",
  "Gold has been on a downward run, with {days} consecutive sessions of lower rates.",
  "The Kerala market continues to cool, posting its {days}th straight day of declines.",
  "Buyers eyeing a window may take note: {days} consecutive days of price drops in Kerala.",
];

export const FLAT_TODAY: string[] = [
  "The Kerala board rate held flat today, with no change from yesterday.",
  "Today's update brings no movement in Kerala's gold rate.",
  "The Kerala market took a breather, leaving the 22K rate unchanged from yesterday.",
  "No change in the board rate today — the Kerala gold price is steady.",
  "Gold rates in Kerala held their ground today, posting no day-over-day change.",
  "It was a flat session for Kerala gold today, with the board rate unchanged.",
];

export const MIXED_RECENT: string[] = [
  "Recent sessions have been mixed, with the market swinging in both directions before settling today.",
  "The last several days have shown no clear direction in Kerala's gold rate.",
  "Trading has been choppy this week, with gains and losses alternating.",
  "Kerala's gold rate has moved sideways with no sustained direction lately.",
  "Recent price action has been uneven, making short-term trends harder to read.",
  "The market has lacked conviction this week, alternating between small gains and losses.",
];

// Position in 30-day range
export const NEW_HIGH: string[] = [
  "Today's rate sets a fresh 30-day high in Kerala.",
  "The 22K price in Kerala just hit its highest level in a month.",
  "Kerala buyers are looking at a new monthly peak for gold today.",
  "Today's level marks the highest the Kerala board rate has been in the past 30 days.",
  "Gold in Kerala has broken to a new monthly high.",
  "The current rate is the dearest gold has been for Kerala buyers in the last 30 days.",
];

export const NEAR_HIGH: string[] = [
  "Today's level sits near the top of the 30-day range — gold is on the expensive side relative to the past month.",
  "Kerala's gold rate is trading close to its monthly peak.",
  "Today's price is in the upper portion of where it's been this month.",
  "Buyers are facing rates near the upper edge of the 30-day band.",
  "The current rate is closer to the month's high than its low.",
  "Today's level is in the priciest fifth of the last 30 days.",
];

export const NEAR_LOW: string[] = [
  "Today's level sits near the bottom of the 30-day range, often a notable zone for buyers.",
  "Kerala's gold rate is trading close to its monthly low — a watched level for jewellery shoppers.",
  "Today's price is in the lower portion of where it's been this month, historically a buying window.",
  "Buyers are seeing rates near the lower edge of the 30-day band.",
  "The current rate is closer to the month's low than its high.",
  "Today's level is in the cheapest fifth of the last 30 days.",
];

export const NEW_LOW: string[] = [
  "Today's rate prints a fresh 30-day low in Kerala — the cheapest gold has been in a month.",
  "Kerala buyers are looking at the lowest 22K rate of the past 30 days.",
  "Gold in Kerala just broke to a new monthly low.",
  "The current rate is the lowest the Kerala board rate has been in the last 30 days.",
  "Today's update sets a fresh monthly low for Kerala gold.",
  "Buyers eyeing a discount may take note: today is the cheapest gold has been this month.",
];

export const MID_RANGE: string[] = [
  "Today's rate sits in the middle of the 30-day range — no extreme reading either way.",
  "The current price is roughly in the middle of where gold has traded this month.",
  "Kerala's gold rate is at a neutral level relative to the past 30 days.",
  "Today's rate is mid-range when compared to the last month's prices.",
  "The price is neither rich nor cheap by recent standards.",
  "Today's level is right around the centre of the past month's band.",
];

// Pavan-rate callout (always included as a separate sentence)
export const PAVAN_NOTE: string[] = [
  "At today's rate, one pavan (8 grams) of 22K gold works out to {pavan}.",
  "For pavan buyers, today's 22K rate translates to {pavan} for a single sovereign.",
  "Wedding-bound buyers should note: a pavan of 22K is priced at {pavan} today.",
  "The pavan-level price — 8 grams of 22K — sits at {pavan} based on today's update.",
  "In pavan terms, today's 22K rate amounts to {pavan} per sovereign.",
  "Today's 22K rate puts one pavan at {pavan}.",
];

// Month average position
export const ABOVE_MONTH_AVG: string[] = [
  "The current rate is {pct}% above the 30-day average, suggesting recent strength.",
  "Today's price sits {pct}% over the rolling 30-day average for Kerala gold.",
  "Buyers are paying {pct}% more than the monthly average right now.",
  "Compared with the 30-day mean, today's rate is {pct}% higher.",
  "The market is trading {pct}% above its 30-day average — on the firmer side.",
  "Today's level is {pct}% above the recent monthly mean.",
];

export const BELOW_MONTH_AVG: string[] = [
  "The current rate is {pct}% below the 30-day average, a softer reading versus the recent trend.",
  "Today's price sits {pct}% under the rolling 30-day average for Kerala gold.",
  "Buyers are getting today's gold at {pct}% less than the monthly average.",
  "Compared with the 30-day mean, today's rate is {pct}% lower.",
  "The market is trading {pct}% below its 30-day average — on the softer side.",
  "Today's level is {pct}% under the recent monthly mean.",
];

export const AT_MONTH_AVG: string[] = [
  "The current rate sits right around the 30-day average for Kerala gold.",
  "Today's price is in line with the rolling 30-day average.",
  "Buyers are paying close to the monthly average right now.",
  "The market is trading at roughly the 30-day mean.",
  "Compared with the past month, today's level is neither expensive nor cheap.",
  "Today's rate matches the recent monthly mean almost exactly.",
];
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/commentaryBranches.ts
git commit -m "feat(news): add commentary phrasing variants"
```

---

## Task 3: Add `generateCommentary()` to `commentary.ts`

**Files:**

- Modify: `src/lib/commentary.ts` (append to existing file)

`generateCommentary` returns an array of strings, each a paragraph. Variant selection is keyed off a hash of `today.date` so the same day always renders the same text (idempotency under static regeneration).

- [ ] **Step 1: Append the generator and helpers**

```typescript
// Append to src/lib/commentary.ts

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
 * Build 2–3 paragraphs of commentary for the given day's stats.
 * Deterministic: same `stats.today.date` always produces the same output.
 */
export function generateCommentary(stats: DayStats): string[] {
  const seed = hashDate(stats.today.date);
  const paragraphs: string[] = [];

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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Create `scripts/verify-commentary.mjs` to sanity-check output**

```bash
mkdir -p scripts
```

```javascript
// scripts/verify-commentary.mjs
// Run with: npx tsx scripts/verify-commentary.mjs
// Prints generated commentary for several synthetic 30-day windows.
// Intended for local-dev sanity checks only — not deployed, not in CI.

import { computeStats, generateCommentary } from "../src/lib/commentary.ts";

function makeHistory(prices) {
  // prices: most-recent-first array of 22K rates
  return prices.map((rate22k, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      date: d.toISOString().slice(0, 10),
      city: "Kochi",
      rate_18k_1g: Math.round(rate22k * 0.818),
      rate_22k_1g: rate22k,
      rate_24k_1g: Math.round(rate22k * 1.0909),
      rate_silver_1g: 100,
    };
  });
}

const scenarios = {
  "rising 5-day streak at near-high":   makeHistory([14000, 13900, 13800, 13700, 13600, 13500, 13400]),
  "falling 4-day streak at near-low":   makeHistory([12500, 12600, 12700, 12800, 12900, 13000, 13100]),
  "flat today, mid-range":              makeHistory([13000, 13000, 13050, 12950, 13000, 13100, 12900]),
  "new monthly high":                   makeHistory(Array(30).fill(0).map((_, i) => i === 0 ? 15000 : 13000)),
  "new monthly low":                    makeHistory(Array(30).fill(0).map((_, i) => i === 0 ? 11000 : 13000)),
};

for (const [name, history] of Object.entries(scenarios)) {
  const stats = computeStats(history);
  const paragraphs = generateCommentary(stats);
  console.log(`\n=== ${name} ===`);
  for (const p of paragraphs) console.log(p);
}
```

- [ ] **Step 4: Run the verification script**

If `tsx` is not installed, install it as a dev dep first:

```bash
npm install --save-dev tsx
```

Then run:

```bash
npx tsx scripts/verify-commentary.mjs
```

Expected: prints 5 scenarios, each with 2 paragraphs of sensible English. Read each one — if any paragraph feels grammatically broken or off-topic, the variant strings in `commentaryBranches.ts` need revision, not the generator.

- [ ] **Step 5: Commit**

```bash
git add src/lib/commentary.ts scripts/verify-commentary.mjs package.json package-lock.json
git commit -m "feat(news): add generateCommentary() with deterministic variant picker"
```

(If `tsx` wasn't installed, omit `package.json` and `package-lock.json` from the add.)

---

## Task 4: Build `/news/[date]` per-day page

**Files:**

- Create: `src/app/news/[date]/page.tsx`

This is the main rendered output. Follow the pattern in `src/app/[city]/page.tsx` for `generateStaticParams`, `generateMetadata`, and Supabase querying.

**Pre-flight reminder:** read the Next.js docs note at the top of this plan and check `src/app/[city]/page.tsx` to confirm the `params` shape (Promise vs plain object) in this Next.js version. The code block below assumes the same shape as the existing `[city]` route — adjust if that route differs.

**JSON-LD pattern note:** This page emits two structured-data scripts (Article + BreadcrumbList). The codebase already uses this pattern — see `src/components/DashboardLayout.tsx:159-162` for the exact `<script type="application/ld+json">` syntax used elsewhere. Copy that pattern verbatim for the two JSON objects defined in this task. The data is fully server-controlled (built from Supabase rows and constants) so `JSON.stringify` is safe to inline.

- [ ] **Step 1: Create the per-day page skeleton (Supabase helpers + params)**

```typescript
// src/app/news/[date]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseReadClient } from "@/lib/supabase";
import type { GoldRate } from "@/lib/types";
import { computeStats, generateCommentary } from "@/lib/commentary";
import { formatCurrency } from "@/lib/format";

export const revalidate = 3600;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

async function getDayWithHistory(
  date: string
): Promise<{ today: GoldRate; history: GoldRate[] } | null> {
  if (!ISO_DATE.test(date)) return null;
  const supabase = createSupabaseReadClient();
  const { data, error } = await supabase
    .from("daily_gold_rates")
    .select("date, city, rate_18k_1g, rate_22k_1g, rate_24k_1g, rate_silver_1g")
    .eq("city", "Kochi")
    .lte("date", date)
    .order("date", { ascending: false })
    .limit(31);
  if (error || !data || data.length === 0) return null;
  if (data[0].date !== date) return null;
  return { today: data[0] as GoldRate, history: data as GoldRate[] };
}

async function getNeighbours(
  date: string
): Promise<{ prev: string | null; next: string | null }> {
  const supabase = createSupabaseReadClient();
  const [prevRes, nextRes] = await Promise.all([
    supabase
      .from("daily_gold_rates")
      .select("date")
      .eq("city", "Kochi")
      .lt("date", date)
      .order("date", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("daily_gold_rates")
      .select("date")
      .eq("city", "Kochi")
      .gt("date", date)
      .order("date", { ascending: true })
      .limit(1)
      .maybeSingle(),
  ]);
  return {
    prev: prevRes.data?.date ?? null,
    next: nextRes.data?.date ?? null,
  };
}

export async function generateStaticParams() {
  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("date")
    .eq("city", "Kochi");
  return (data ?? []).map((row: { date: string }) => ({ date: row.date }));
}

function formatLongDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Adjust this signature to match the project's convention from
// src/app/[city]/page.tsx. If that file uses `Promise<{ city: string }>`,
// then use `Promise<{ date: string }>` here and await accordingly.
type RouteParams = { params: Promise<{ date: string }> };
```

- [ ] **Step 2: Add `generateMetadata`**

Append to the same file:

```typescript
export async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
  const { date } = await params;
  const result = await getDayWithHistory(date);
  if (!result) {
    return { title: "Daily Update Not Found", robots: { index: false } };
  }
  const { today } = result;
  const longDate = formatLongDate(today.date);
  const title = `Kerala Gold Rate on ${longDate}: 22K at ₹${today.rate_22k_1g.toLocaleString("en-IN")}/g`;
  const description = `Kerala gold rate on ${longDate}: 22K at ₹${today.rate_22k_1g}/g (₹${(today.rate_22k_1g * 8).toLocaleString("en-IN")}/pavan), 24K at ₹${today.rate_24k_1g}/g. Daily commentary and trend context.`;
  return {
    title,
    description,
    alternates: { canonical: `/news/${today.date}` },
    openGraph: { title, description, type: "article" },
  };
}
```

- [ ] **Step 3: Add the default export — the page component**

Append:

```typescript
export default async function NewsDay({ params }: RouteParams) {
  const { date } = await params;
  const result = await getDayWithHistory(date);
  if (!result) notFound();

  const { today, history } = result;
  const stats = computeStats(history);
  const paragraphs = generateCommentary(stats);
  const { prev, next } = await getNeighbours(today.date);

  const longDate = formatLongDate(today.date);
  const pavan22k = today.rate_22k_1g * 8;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: `Kerala Gold Rate on ${longDate}`,
    datePublished: `${today.date}T10:30:00+05:30`,
    dateModified: `${today.date}T10:30:00+05:30`,
    author: { "@type": "Organization", name: "Live Gold Kerala" },
    publisher: {
      "@type": "Organization",
      name: "Live Gold Kerala",
      url: "https://www.livegoldkerala.com",
    },
    mainEntityOfPage: `https://www.livegoldkerala.com/news/${today.date}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.livegoldkerala.com" },
      { "@type": "ListItem", position: 2, name: "Daily Updates", item: "https://www.livegoldkerala.com/news" },
      {
        "@type": "ListItem",
        position: 3,
        name: longDate,
        item: `https://www.livegoldkerala.com/news/${today.date}`,
      },
    ],
  };

  return (
    <>
      {/*
        Emit articleJsonLd and breadcrumbJsonLd as <script type="application/ld+json">
        tags using the exact same pattern as src/components/DashboardLayout.tsx:159-162.
        Two script tags, one per object, both serialized with JSON.stringify().
      */}

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:py-10">
        <nav className="text-xs text-zinc-500">
          <Link href="/" className="hover:underline">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/news" className="hover:underline">Daily Updates</Link>
          <span className="mx-1">/</span>
          <span>{longDate}</span>
        </nav>

        <header>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Kerala Gold Rate on {longDate}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">22K at {formatCurrency(today.rate_22k_1g)} per gram</p>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <PriceTile label="22K" purity="916" rate={today.rate_22k_1g} />
          <PriceTile label="24K" purity="999" rate={today.rate_24k_1g} />
          <PriceTile label="21K" purity="875" rate={today.rate_22k_1g * (21 / 22)} />
          <PriceTile label="18K" purity="750" rate={today.rate_18k_1g} />
        </section>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          1 Pavan (8 g) of 22K = <span className="font-semibold">{formatCurrency(pavan22k)}</span>
          {today.rate_silver_1g ? ` · Silver at ${formatCurrency(today.rate_silver_1g)}/g` : ""}
        </p>

        {stats.change22k !== null && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Day-over-day change:{" "}
            <span
              className={
                stats.change22k > 0
                  ? "font-semibold text-red-600"
                  : stats.change22k < 0
                  ? "font-semibold text-green-600"
                  : "font-semibold text-zinc-600"
              }
            >
              {stats.change22k > 0 ? "+" : ""}
              {stats.change22k}/g ({stats.change22kPct?.toFixed(2)}%)
            </span>
          </p>
        )}

        {stats.weekHigh !== null && (
          <section className="rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="mb-2 font-semibold text-zinc-800 dark:text-zinc-200">7-day summary (22K)</h2>
            <ul className="grid grid-cols-2 gap-y-1 text-zinc-600 dark:text-zinc-400">
              <li>High: {formatCurrency(stats.weekHigh)}</li>
              <li>Low: {formatCurrency(stats.weekLow!)}</li>
              <li>Avg: {formatCurrency(stats.weekAvg!)}</li>
              <li>
                Net change:{" "}
                {stats.weekNetChange !== null
                  ? (stats.weekNetChange > 0 ? "+" : "") + stats.weekNetChange
                  : "—"}
              </li>
            </ul>
          </section>
        )}

        <section className="prose prose-zinc max-w-none dark:prose-invert">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <nav className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-zinc-800">
          {prev ? (
            <Link href={`/news/${prev}`} className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400">
              ← {formatLongDate(prev)}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link href={`/news/${next}`} className="text-sm font-semibold text-amber-700 hover:underline dark:text-amber-400">
              {formatLongDate(next)} →
            </Link>
          ) : (
            <span />
          )}
        </nav>

        <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-sm dark:border-amber-900/40 dark:bg-amber-950/20">
          <p className="text-zinc-700 dark:text-zinc-300">
            See today's live rate on the{" "}
            <Link href="/" className="font-semibold text-amber-700 underline dark:text-amber-400">homepage</Link>, or try the{" "}
            <Link href="/tools/gold-making-charge-calculator" className="font-semibold text-amber-700 underline dark:text-amber-400">making charge calculator</Link>.
          </p>
        </section>
      </main>
    </>
  );
}

function PriceTile({ label, purity, rate }: { label: string; purity: string; rate: number }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600">{label} · {purity}</p>
      <p className="mt-1 text-lg font-bold text-zinc-800 dark:text-zinc-200">{formatCurrency(rate)}</p>
      <p className="text-[10px] text-zinc-400">per gram</p>
    </div>
  );
}
```

- [ ] **Step 4: Inline the JSON-LD scripts in place of the comment**

In the JSX returned by `NewsDay`, replace the placeholder comment block with two `<script>` tags emitting the `articleJsonLd` and `breadcrumbJsonLd` objects. Copy the exact pattern from `src/components/DashboardLayout.tsx:159-162` (two `<script type="application/ld+json">` tags, one per object, each fed by `JSON.stringify(obj)`).

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Run dev server and visit a known-good date**

```bash
npm run dev
```

Open `http://localhost:3000/news/<any-date-in-your-supabase-table>` — pick a recent date from Supabase Studio if unsure.

Expected: page renders with H1, 4 price tiles, 7-day summary block, 2 paragraphs of commentary, prev/next nav. View the page source and confirm two `<script type="application/ld+json">` blocks are present.

- [ ] **Step 7: Visit a date not in the DB**

Open `http://localhost:3000/news/2020-01-01`

Expected: 404 page (Next.js `notFound()` handler).

- [ ] **Step 8: Commit**

```bash
git add src/app/news/[date]/page.tsx
git commit -m "feat(news): add per-day commentary page"
```

---

## Task 5: Build `/news` hub page

**Files:**

- Create: `src/app/news/page.tsx`

The hub lists the most recent 30 daily posts with date, 22K rate, and day-over-day change.

- [ ] **Step 1: Create the hub page**

```typescript
// src/app/news/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";
import type { GoldRate } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Daily Kerala Gold Rate Updates — Live Gold Kerala",
  description:
    "Daily commentary on the Kerala gold rate. Browse historical 22K prices, weekly trends, and per-day market context.",
  alternates: { canonical: "/news" },
};

async function getRecentDays(limit = 30): Promise<GoldRate[]> {
  const supabase = createSupabaseReadClient();
  const { data, error } = await supabase
    .from("daily_gold_rates")
    .select("date, city, rate_18k_1g, rate_22k_1g, rate_24k_1g, rate_silver_1g")
    .eq("city", "Kochi")
    .order("date", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as GoldRate[];
}

function formatLongDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function NewsHub() {
  const rows = await getRecentDays(30);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:py-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Daily Kerala Gold Rate Updates
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          One commentary per trading day, with week and month context.
        </p>
      </header>

      {rows.length === 0 ? (
        <p className="text-sm text-zinc-500">No daily updates yet. Check back tomorrow.</p>
      ) : (
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {rows.map((row, i) => {
            const prev = rows[i + 1];
            const change = prev ? row.rate_22k_1g - prev.rate_22k_1g : null;
            return (
              <li key={row.date} className="py-3">
                <Link
                  href={`/news/${row.date}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                      {formatLongDate(row.date)}
                    </p>
                    <p className="text-xs text-zinc-500">
                      22K at {formatCurrency(row.rate_22k_1g)} / g
                    </p>
                  </div>
                  {change !== null && (
                    <span
                      className={
                        change > 0
                          ? "text-xs font-semibold text-red-600"
                          : change < 0
                          ? "text-xs font-semibold text-green-600"
                          : "text-xs font-semibold text-zinc-500"
                      }
                    >
                      {change > 0 ? "▲ +" : change < 0 ? "▼ " : ""}
                      {change !== 0 ? change : "no change"}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
```

- [ ] **Step 2: Type-check + visit dev server**

Run: `npx tsc --noEmit`, then visit `http://localhost:3000/news`.

Expected: list of up to 30 daily entries with dates, 22K rates, and ▲/▼ change indicators. Clicking an entry opens the per-day page from Task 4.

- [ ] **Step 3: Commit**

```bash
git add src/app/news/page.tsx
git commit -m "feat(news): add /news hub page listing recent daily updates"
```

---

## Task 6: Append news URLs to `sitemap.ts`

**Files:**

- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add a news-dates query and route entries**

Open `src/app/sitemap.ts` and locate the `blogRoutes` block. After it, add:

```typescript
// Daily news routes — one per date in daily_gold_rates
const { data: newsDates } = await supabase
  .from("daily_gold_rates")
  .select("date")
  .eq("city", "Kochi");

const newsRoutes: MetadataRoute.Sitemap = [
  { url: `${BASE}/news`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.7 },
  ...(newsDates ?? []).map((row: { date: string }) => ({
    url: `${BASE}/news/${row.date}`,
    lastModified: new Date(row.date),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  })),
];
```

Then include `newsRoutes` in the final return statement (e.g. `return [...rootRoute, ...cityRoutes, ...toolRoutes, ...blogRoutes, ...newsRoutes, /* ...others */]`). Preserve every spread already there — only add `...newsRoutes`.

- [ ] **Step 2: Type-check and inspect sitemap output**

Run: `npx tsc --noEmit`. Then start dev server and visit `http://localhost:3000/sitemap.xml`.

Expected: the XML includes `/news` and one entry for each date.

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat(news): add daily news URLs to sitemap"
```

---

## Task 7: Wire cron route to revalidate news paths + IndexNow

**Files:**

- Modify: `src/app/api/cron/update-rates/route.ts`

Two changes near the existing `revalidatePath("/")` block (around line 436) and the IndexNow block (around line 443).

- [ ] **Step 1: Add `revalidatePath` calls for news**

In `route.ts`, locate this existing block (around line 436):

```typescript
// Clear Next.js cache for all pages
revalidatePath("/");
const cities = ["trivandrum", "ernakulam", ...];
for (const city of cities) {
  revalidatePath(`/${city}`);
}
```

Immediately after the `for (const city of cities)` loop, add:

```typescript
// News hub + today's daily update
revalidatePath("/news");
revalidatePath(`/news/${data.date}`);
```

Where `data.date` is the variable already used elsewhere in the route for the upserted row. If the variable has a different name (e.g. `todayDate`, `payload.date`), use whatever the existing code uses to refer to today's date string.

- [ ] **Step 2: Add news URLs to the IndexNow ping**

Locate the IndexNow block (around line 443):

```typescript
if (process.env.INDEXNOW_KEY) {
  const key = process.env.INDEXNOW_KEY;
  const base = "https://www.livegoldkerala.com";
  const urlList = [base, ...cities.map((c) => `${base}/${c}`)];
  // ...
}
```

Change the `urlList` line to:

```typescript
const urlList = [
  base,
  ...cities.map((c) => `${base}/${c}`),
  `${base}/news`,
  `${base}/news/${data.date}`,
];
```

(Use whatever variable the route already uses for today's date.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/cron/update-rates/route.ts
git commit -m "feat(news): revalidate news paths and ping IndexNow on cron update"
```

---

## Task 8: Add "Daily Market Updates" section to homepage + footer link

**Files:**

- Modify: `src/components/DashboardLayout.tsx`

Two additions: a new `<RecentDailyUpdates />` section in the main flow next to the existing `<RecentArticles />`, and one new footer card link.

- [ ] **Step 1: Add a helper to fetch recent news dates**

In `src/components/DashboardLayout.tsx`, add a server-side helper near the existing component:

```typescript
async function getRecentNewsDates(limit = 3): Promise<string[]> {
  const { createSupabaseReadClient } = await import("@/lib/supabase");
  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("date")
    .eq("city", "Kochi")
    .order("date", { ascending: false })
    .limit(limit);
  return (data ?? []).map((r: { date: string }) => r.date);
}
```

- [ ] **Step 2: Make `DashboardLayout` async and fetch the dates**

`DashboardLayout` is currently a sync function. Change its signature to `async function DashboardLayout(...)`. Near the top of the function body, after the existing `today`/`yesterday` setup, add:

```typescript
const recentNewsDates = await getRecentNewsDates(3);
```

- [ ] **Step 3: Add a `RecentDailyUpdates` component**

Add at the bottom of `DashboardLayout.tsx`, near the existing `RecentArticles` function:

```typescript
function RecentDailyUpdates({ dates }: { dates: string[] }) {
  if (dates.length === 0) return null;
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Daily Market Updates
        </h2>
        <Link
          href="/news"
          className="text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400"
        >
          All updates →
        </Link>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        {dates.map((d) => (
          <Link
            key={d}
            href={`/news/${d}`}
            className="group rounded-xl border border-zinc-200/60 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-800/40"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
              {new Date(d + "T00:00:00").toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
            </p>
            <p className="mt-0.5 text-sm font-semibold leading-snug text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
              Kerala Gold Rate Daily Update
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Render `<RecentDailyUpdates />` in the layout**

In the JSX, find the existing line `<RecentArticles />` (around line 390) and add immediately before it:

```tsx
<RecentDailyUpdates dates={recentNewsDates} />
```

- [ ] **Step 5: Add the footer link**

In the same file, find the footer's tool grid (around line 437–473 — the grid containing "Making Charge Calculator", "Old Gold Exchange Estimator", etc.) and add a new card just before the `Gold Knowledge Hub` link:

```tsx
<Link
  href="/news"
  className="rounded-xl border border-zinc-200/70 bg-white px-4 py-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:border-zinc-700"
>
  <p className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500">Updates</p>
  <p className="mt-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">Daily Market Updates</p>
</Link>
```

Adjust the grid column count if needed (`sm:grid-cols-2 md:grid-cols-4` may become `md:grid-cols-5` — match what looks balanced in the existing pattern).

- [ ] **Step 6: Type-check + dev server visual review**

Run: `npx tsc --noEmit`. Then `npm run dev` and visit `http://localhost:3000/`.

Expected: the homepage shows a "Daily Market Updates" section above "From the Blog" with 3 recent dates, and the footer has a new "Daily Market Updates" card. All links navigate to working pages.

- [ ] **Step 7: Commit**

```bash
git add src/components/DashboardLayout.tsx
git commit -m "feat(news): link news section from homepage and footer"
```

---

## Task 9: Full build + manual review of first 10 generated pages

This is the launch gate. Before deploying, eyeball the output to catch awkward variant combinations.

- [ ] **Step 1: Run a production build**

Run: `npm run build`
Expected: build succeeds, output lists `/news` and `/news/[date]` — confirm all dates in DB are pre-rendered (look for one rendered route per DB row, plus the hub).

- [ ] **Step 2: Start production server**

Run: `npm run start`
Expected: server starts on port 3000.

- [ ] **Step 3: Visit the 10 most recent dates and read the prose**

Open Supabase Studio or run a quick query to find the 10 most recent dates, then visit each `/news/[date]`. Read the two commentary paragraphs on each. Watch for:

- Grammatically broken sentences (a variant doesn't fit its context)
- Repeated phrasing across consecutive days (suggests variant pool too small or hash too clustered)
- Stat values that look wrong (e.g. negative percentages where they shouldn't be)
- Awkward sentence joins where the streak sentence and the range-position sentence don't flow

If issues are found, edit `commentaryBranches.ts` (most fixes are variant rewrites) or `commentary.ts` (only if logic is wrong), re-run `npx tsx scripts/verify-commentary.mjs`, then re-build.

- [ ] **Step 4: Visit `/news` hub and confirm list renders**

Open `http://localhost:3000/news`. Expected: list of recent days, each clickable, with correct dates and ▲/▼ indicators.

- [ ] **Step 5: Visit `/sitemap.xml` and confirm news URLs present**

Open `http://localhost:3000/sitemap.xml`. Expected: includes `/news` and `/news/<each-date>`.

- [ ] **Step 6: Commit any prose fixes from Step 3**

```bash
git add src/lib/commentaryBranches.ts src/lib/commentary.ts
git commit -m "fix(news): tune commentary variants from launch review"
```

(Skip if no fixes needed.)

---

## Done criteria

- `/news` renders a hub of recent days.
- `/news/<any-date-in-db>` renders 2 paragraphs of date-stable commentary plus prices, week summary, and prev/next nav.
- `/news/<unknown-date>` returns a 404.
- Sitemap includes one URL per backfilled date.
- Cron route revalidates the news hub + today's page after each successful upsert.
- Homepage shows a "Daily Market Updates" section and footer link.
- First 10 reviewed pages read naturally with no broken grammar.
