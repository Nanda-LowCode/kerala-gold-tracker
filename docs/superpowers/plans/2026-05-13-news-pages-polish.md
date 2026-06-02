# News Pages Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring `/news` and `/news/[date]` up to the homepage's visual quality bar by adding three new shared components (`VerdictPill`, `RangeBar`, `NewsSparkline`), a pure verdict helper, and restructuring both pages around the new "is now a good time to buy?" centerpiece.

**Architecture:** Three new presentational components plus one pure helper, all driven by the existing `DayStats`. Both pages restructured to lead with a verdict pill + range bar. `RateCard`/`RateBoard` extracted from `DashboardLayout.tsx` for re-use across homepage and news. Zero schema changes, zero new data sources.

**Tech Stack:** Next.js 16.2.4 (App Router), TypeScript, Tailwind CSS v4, Chart.js + react-chartjs-2 (already a dependency).

---

## Pre-flight notes

- The existing JSON-LD script tags inside `src/app/news/[date]/page.tsx` (the two `<script type="application/ld+json">` blocks for Article + BreadcrumbList) stay as-is. We won't touch them during the restructure.
- The codebase has no test framework; verification is `npx tsc --noEmit` plus the local-dev visual review at the end. We'll extend `scripts/verify-commentary.ts` to also dump `computeVerdict` output for the same synthetic scenarios so the verdict logic is sanity-checked without browsing.
- The homepage `RateCard` and `RateBoard` live in `src/components/DashboardLayout.tsx` (around line 493 onwards). Extraction preserves their exact JSX — same className strings, same props. Only the file location changes.

---

## File structure

**Created:**

- `src/components/RateCards.tsx` — `RateCard` and `RateBoard` extracted verbatim from `DashboardLayout.tsx`
- `src/lib/verdict.ts` — pure `computeVerdict(stats)` helper
- `src/components/VerdictPill.tsx` — pill badge rendering the verdict
- `src/components/RangeBar.tsx` — horizontal bar showing today vs. 30-day low/high
- `src/components/NewsSparkline.tsx` — client component, small Chart.js sparkline

**Modified:**

- `src/components/DashboardLayout.tsx` — import `RateCard`/`RateBoard` from the new file, remove the local definitions; add small verdict dot to the existing `RecentDailyUpdates` cards
- `src/app/news/[date]/page.tsx` — full restructure
- `src/app/news/page.tsx` — full restructure
- `scripts/verify-commentary.ts` — also print verdict per scenario

---

## Task 1: Extract `RateCard` and `RateBoard` to `src/components/RateCards.tsx`

**Files:**

- Create: `src/components/RateCards.tsx`
- Modify: `src/components/DashboardLayout.tsx` (remove local definitions, import instead)

- [ ] **Step 1: Read the existing definitions**

Open `src/components/DashboardLayout.tsx`. Locate `function RateCard(...)` and `function ChangeBadge(...)` and `function RateBoard(...)` — they're at the bottom of the file. Note that `RateBoard` uses `ChangeBadge` and `formatCurrency`, and `RateCard` also uses `ChangeBadge` and `formatCurrency`.

`ChangeBadge` is shared by both. Extract all three.

- [ ] **Step 2: Create `src/components/RateCards.tsx`**

Copy the three functions verbatim into the new file. Add the `formatCurrency` import.

```typescript
// src/components/RateCards.tsx
import { formatCurrency } from "@/lib/format";

export function RateCard({
  label,
  purity,
  ratePerGram,
  change,
  pavanRate,
  featured = false,
  compact = false,
}: {
  label: string;
  purity: string;
  ratePerGram: number;
  change: number | null;
  pavanRate?: number;
  featured?: boolean;
  compact?: boolean;
}) {
  // [PASTE: exact JSX body from DashboardLayout.tsx RateCard]
}

export function ChangeBadge({ change }: { change: number }) {
  // [PASTE: exact body]
}

export function RateBoard({
  rows,
}: {
  rows: {
    label: string;
    purity: string;
    ratePerGram: number;
    pavanRate: number;
    change: number | null;
  }[];
}) {
  // [PASTE: exact body]
}
```

Important: **copy the JSX bodies exactly as they are in `DashboardLayout.tsx`** — same className strings, same children. The goal is zero visual change on the homepage from this extraction.

- [ ] **Step 3: Replace the local definitions in `DashboardLayout.tsx`**

In `src/components/DashboardLayout.tsx`:

1. Remove the local `function RateCard(...)`, `function ChangeBadge(...)`, and `function RateBoard(...)` definitions at the bottom of the file.
2. Add an import at the top:

```typescript
import { RateCard, RateBoard } from "@/components/RateCards";
```

(Don't re-import `ChangeBadge` unless the file uses it externally — check with Grep.)

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: zero errors. If `ChangeBadge` is referenced outside its scope, add it to the import too.

- [ ] **Step 5: Commit**

```bash
git add src/components/RateCards.tsx src/components/DashboardLayout.tsx
git commit -m "refactor: extract RateCard, RateBoard, ChangeBadge to shared component file"
```

---

## Task 2: Add `computeVerdict()` to `src/lib/verdict.ts`

**Files:**

- Create: `src/lib/verdict.ts`

Pure function. Inputs: `DayStats`. Output: a `Verdict` object describing the buyer's situation, or `null` if there's insufficient data.

- [ ] **Step 1: Create the file**

```typescript
// src/lib/verdict.ts
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
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Extend the verify script to dump verdicts**

Open `scripts/verify-commentary.ts`. After the existing `for (const [name, history] ...)` loop, add:

```typescript
import { computeVerdict } from "../src/lib/verdict";

console.log("\n\n=== VERDICTS ===");
for (const [name, history] of Object.entries(scenarios)) {
  const stats = computeStats(history);
  const verdict = computeVerdict(stats);
  console.log(`${name}: ${verdict ? `${verdict.headline} — ${verdict.sub} (${verdict.tone})` : "(no verdict — insufficient data)"}`);
}
```

(Add the `computeVerdict` import at the top with the existing imports.)

- [ ] **Step 4: Run the script and check the output**

Run: `npx tsx --tsconfig tsconfig.json scripts/verify-commentary.ts`

Expected (final block):
```
=== VERDICTS ===
rising 5-day streak at near-high: Near Peak — X.X% above monthly average (coral)
falling 4-day streak at near-low: Buy Zone — X.X% below monthly average (emerald)
flat today, mid-range: Fair Pricing — at the monthly average (amber)
   (or Mid Range — depending on stat values)
new monthly high: Near Peak — ... (coral)
new monthly low: Buy Zone — ... (emerald)
```

If any scenario doesn't match its scenario name, the thresholds need a look.

- [ ] **Step 5: Commit**

```bash
git add src/lib/verdict.ts scripts/verify-commentary.ts
git commit -m "feat(news): add computeVerdict() pure helper"
```

---

## Task 3: Create `VerdictPill` component

**Files:**

- Create: `src/components/VerdictPill.tsx`

Pure server component. Renders the pill in `lg` (used at top of daily page) or `sm` (used on hub day cards) size. Also exports a tiny `VerdictDot` used on the homepage cards.

- [ ] **Step 1: Create the component**

```typescript
// src/components/VerdictPill.tsx
import type { Verdict } from "@/lib/verdict";

const TONE_CLASSES = {
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-900/50",
    text: "text-emerald-700 dark:text-emerald-400",
    glow: "shadow-emerald-300/30",
    dot: "bg-emerald-500",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-900/50",
    text: "text-amber-700 dark:text-amber-400",
    glow: "shadow-amber-300/30",
    dot: "bg-amber-500",
  },
  coral: {
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-900/50",
    text: "text-red-700 dark:text-red-400",
    glow: "shadow-red-300/30",
    dot: "bg-red-500",
  },
} as const;

export function VerdictPill({
  verdict,
  size = "lg",
}: {
  verdict: Verdict;
  size?: "lg" | "sm";
}) {
  const tone = TONE_CLASSES[verdict.tone];

  if (size === "sm") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tone.bg} ${tone.border} ${tone.text}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} />
        {verdict.headline}
      </span>
    );
  }

  return (
    <div
      className={`inline-flex flex-col items-start gap-0.5 rounded-2xl border px-4 py-2.5 shadow-md ${tone.bg} ${tone.border} ${tone.text} ${tone.glow}`}
    >
      <div className="flex items-center gap-2">
        <span className={`relative flex h-2.5 w-2.5`}>
          <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${tone.dot}`} />
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${tone.dot}`} />
        </span>
        <span className="text-sm font-black uppercase tracking-widest">
          {verdict.headline}
        </span>
      </div>
      <p className="text-xs font-medium opacity-80">{verdict.sub}</p>
    </div>
  );
}

export function VerdictDot({ verdict }: { verdict: Verdict }) {
  const tone = TONE_CLASSES[verdict.tone];
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${tone.dot}`}
      title={verdict.headline}
      aria-label={verdict.headline}
    />
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/VerdictPill.tsx
git commit -m "feat(news): add VerdictPill and VerdictDot components"
```

---

## Task 4: Create `RangeBar` component

**Files:**

- Create: `src/components/RangeBar.tsx`

Pure server component. Renders a horizontal bar from low to high with a glowing dot at `current`'s position.

- [ ] **Step 1: Create the component**

```typescript
// src/components/RangeBar.tsx
import { formatCurrency } from "@/lib/format";

export function RangeBar({
  low,
  high,
  current,
  label = "30-day range",
}: {
  low: number;
  high: number;
  current: number;
  label?: string;
}) {
  if (high <= low) return null;
  const pos = Math.min(1, Math.max(0, (current - low) / (high - low)));
  const posPct = `${(pos * 100).toFixed(1)}%`;

  return (
    <div className="w-full">
      <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        <span>{label}</span>
        <span>
          {formatCurrency(low)} – {formatCurrency(high)}
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gradient-to-r from-emerald-200 via-amber-200 to-red-200 dark:from-emerald-900/40 dark:via-amber-900/40 dark:to-red-900/40">
        <div
          className="absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-zinc-900 shadow-lg shadow-amber-400/50 dark:border-zinc-950"
          style={{ left: posPct }}
          aria-label={`Today's price is ${formatCurrency(current)}`}
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500">
        <span>Low</span>
        <span className="font-semibold text-zinc-700 dark:text-zinc-200">
          Today {formatCurrency(current)}
        </span>
        <span>High</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/RangeBar.tsx
git commit -m "feat(news): add RangeBar component"
```

---

## Task 5: Create `NewsSparkline` component

**Files:**

- Create: `src/components/NewsSparkline.tsx`

Client component (uses Chart.js). Lean — line + fill, optional highlight dot, no axes, no tooltip clutter.

- [ ] **Step 1: Reference the existing chart usage**

Open `src/components/PriceChart.tsx` to see how the project sets up Chart.js (which Chart.js controllers, scales, and elements are registered). Match those registrations in this file.

- [ ] **Step 2: Create the component**

```typescript
// src/components/NewsSparkline.tsx
"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

export function NewsSparkline({
  data,
  highlightDate,
  height = 120,
}: {
  data: { date: string; rate: number }[];
  highlightDate?: string;
  height?: number;
}) {
  if (data.length < 2) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center rounded-xl border border-dashed border-zinc-200 text-xs text-zinc-400 dark:border-zinc-800"
      >
        Not enough data for a trend chart yet.
      </div>
    );
  }

  const labels = data.map((d) => d.date);
  const values = data.map((d) => d.rate);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const padding = (max - min) * 0.15 || 50;

  const pointRadius = data.map((d) =>
    d.date === highlightDate ? 6 : 0
  );
  const pointBgColor = data.map(() => "rgb(217, 119, 6)");
  const pointBorderColor = data.map(() => "white");

  return (
    <div style={{ height }}>
      <Line
        data={{
          labels,
          datasets: [
            {
              data: values,
              borderColor: "rgb(217, 119, 6)",
              backgroundColor: "rgba(251, 191, 36, 0.18)",
              borderWidth: 2,
              fill: true,
              tension: 0.35,
              pointRadius,
              pointBackgroundColor: pointBgColor,
              pointBorderColor: pointBorderColor,
              pointBorderWidth: 2,
              pointHoverRadius: 6,
            },
          ],
        }}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              displayColors: false,
              callbacks: {
                label: (ctx) =>
                  `₹${ctx.parsed.y.toLocaleString("en-IN")} on ${ctx.label}`,
              },
            },
          },
          scales: {
            x: { display: false },
            y: { display: false, min: min - padding, max: max + padding },
          },
          interaction: { intersect: false, mode: "nearest" },
        }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: zero errors. If Chart.js types complain about `pointBorderColor: string[]`, fall back to a single string value — both forms are accepted.

- [ ] **Step 4: Commit**

```bash
git add src/components/NewsSparkline.tsx
git commit -m "feat(news): add NewsSparkline client component"
```

---

## Task 6: Restructure the daily page (`/news/[date]`)

**Files:**

- Modify: `src/app/news/[date]/page.tsx`

This is the biggest task. We're not rewriting the data layer — `getDayWithHistory`, `getNeighbours`, `generateStaticParams`, `generateMetadata`, the existing JSON-LD script blocks, and `NewsDay`'s top section all stay. We're rewriting the JSX body to use the new components.

- [ ] **Step 1: Add imports**

In `src/app/news/[date]/page.tsx`, replace the existing import block at the top with:

```typescript
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseReadClient } from "@/lib/supabase";
import type { GoldRate } from "@/lib/types";
import { computeStats, generateCommentary } from "@/lib/commentary";
import { computeVerdict } from "@/lib/verdict";
import { formatCurrency } from "@/lib/format";
import { VerdictPill } from "@/components/VerdictPill";
import { RangeBar } from "@/components/RangeBar";
import { NewsSparkline } from "@/components/NewsSparkline";
import { RateCard, RateBoard } from "@/components/RateCards";
```

(Keep everything else — data helpers, `generateStaticParams`, `generateMetadata` — as is.)

- [ ] **Step 2: Add computed values inside `NewsDay` (before the return)**

After the existing variable declarations (`today, history, stats, paragraphs, prev, next, longDate, pavan22k, articleJsonLd, breadcrumbJsonLd`), add:

```typescript
  const verdict = computeVerdict(stats);
  const rate21k = today.rate_22k_1g * (21 / 22);
  const change18k = stats.yesterday ? today.rate_18k_1g - stats.yesterday.rate_18k_1g : null;
  const change21k = stats.yesterday ? rate21k - stats.yesterday.rate_22k_1g * (21 / 22) : null;
  const change24k = stats.yesterday ? today.rate_24k_1g - stats.yesterday.rate_24k_1g : null;

  // Chronological sparkline data (oldest left, newest right)
  const sparklineData = [...history]
    .slice(0, 30)
    .reverse()
    .map((r) => ({ date: r.date, rate: r.rate_22k_1g }));
```

- [ ] **Step 3: Replace the JSX inside the `<main>...</main>` block**

Keep the two existing JSON-LD script tags that come before `<main>`. Replace the entire body of `<main>` with this new structure:

```tsx
        {/* Trust + breadcrumb */}
        <div className="flex flex-col items-start gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/30">
            <svg className="h-3 w-3 text-emerald-600 dark:text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
              Verified Kerala Board Rate
            </span>
          </span>
          <nav className="text-[11px] text-zinc-500">
            <Link href="/" className="hover:underline">Home</Link>
            <span className="mx-1">/</span>
            <Link href="/news" className="hover:underline">Daily Updates</Link>
            <span className="mx-1">/</span>
            <span>{longDate}</span>
          </nav>
        </div>

        {/* H1 + verdict */}
        <header className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            Kerala Gold Rate on {longDate}
          </h1>
          {verdict && <VerdictPill verdict={verdict} size="lg" />}
        </header>

        {/* Range bar */}
        {stats.monthHigh !== null && stats.monthLow !== null && (
          <section className="rounded-2xl border border-zinc-200/70 bg-white p-4 shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none md:p-5">
            <RangeBar
              low={stats.monthLow}
              high={stats.monthHigh}
              current={today.rate_22k_1g}
              label="30-day range — 22K"
            />
          </section>
        )}

        {/* Rate cards — homepage style */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <RateCard
            label="22 Karat Gold"
            purity="916 Hallmark"
            ratePerGram={today.rate_22k_1g}
            change={stats.change22k}
            pavanRate={pavan22k}
            featured
          />
          <RateBoard
            rows={[
              { label: "24 Karat", purity: "999 Fine", ratePerGram: today.rate_24k_1g, pavanRate: today.rate_24k_1g * 8, change: change24k },
              { label: "21 Karat", purity: "875 · Gulf imports", ratePerGram: rate21k, pavanRate: rate21k * 8, change: change21k },
              { label: "18 Karat", purity: "750", ratePerGram: today.rate_18k_1g, pavanRate: today.rate_18k_1g * 8, change: change18k },
            ]}
          />
        </div>

        {/* Sparkline + 7-day summary in one premium card */}
        {stats.weekHigh !== null && (
          <section className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
            <div className="border-b border-zinc-100 bg-zinc-50/60 px-5 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/30">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                30-day trend — 22K
              </p>
            </div>
            <div className="px-5 pt-4">
              <NewsSparkline data={sparklineData} highlightDate={today.date} height={140} />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 px-5 pb-5 pt-3 text-xs sm:grid-cols-4">
              <SummaryStat label="7-day high" value={formatCurrency(stats.weekHigh)} />
              <SummaryStat label="7-day low" value={formatCurrency(stats.weekLow!)} />
              <SummaryStat label="7-day avg" value={formatCurrency(stats.weekAvg!)} />
              <SummaryStat
                label="7-day net"
                value={
                  stats.weekNetChange !== null
                    ? (stats.weekNetChange > 0 ? "+" : "") + stats.weekNetChange.toFixed(0)
                    : "—"
                }
              />
            </div>
          </section>
        )}

        {/* Commentary with drop cap */}
        <section className="rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none md:p-6">
          <h2 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            Market commentary
          </h2>
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className={`text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 ${
                i === 0
                  ? "first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-black first-letter:leading-[0.85] first-letter:text-amber-600 dark:first-letter:text-amber-400"
                  : "mt-3"
              }`}
            >
              {p}
            </p>
          ))}
        </section>

        {/* Prev/next as cards */}
        <nav className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {prev ? <NavCard direction="prev" date={prev} /> : <div />}
          {next ? <NavCard direction="next" date={next} /> : <div />}
        </nav>

        {/* CTA */}
        <section className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md shadow-amber-200/40 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900 dark:shadow-none">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            See today&apos;s live rate on the{" "}
            <Link href="/" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500">
              homepage
            </Link>{" "}
            · try the{" "}
            <Link href="/tools/gold-making-charge-calculator" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500">
              making charge calculator
            </Link>{" "}
            · or browse the full{" "}
            <Link href="/news" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500">
              daily archive
            </Link>
            .
          </p>
        </section>
```

Update the outer `<main>` className to:
```
className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-6 md:gap-7 md:py-10"
```

- [ ] **Step 4: Replace the old `PriceTile` function at the bottom with `SummaryStat` and `NavCard`**

The old `PriceTile` function is no longer used. Delete it. Add these two at the bottom of the file:

```typescript
function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold text-zinc-800 dark:text-zinc-200">
        {value}
      </p>
    </div>
  );
}

async function NavCard({ direction, date }: { direction: "prev" | "next"; date: string }) {
  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("rate_22k_1g")
    .eq("city", "Kochi")
    .eq("date", date)
    .maybeSingle();
  const rate = (data?.rate_22k_1g ?? null) as number | null;
  const shortDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  return (
    <Link
      href={`/news/${date}`}
      className={`group flex items-center justify-between gap-3 rounded-xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-800/40 ${
        direction === "next" ? "sm:text-right" : ""
      }`}
    >
      <div>
        <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
          {direction === "prev" ? "Previous" : "Next"}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
          {direction === "prev" ? "← " : ""}{shortDate}{direction === "next" ? " →" : ""}
        </p>
        {rate !== null && (
          <p className="text-xs text-zinc-500">22K {formatCurrency(rate)}/g</p>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 6: Visual verify**

Start dev server (`npm run dev` in your main checkout where `.env.local` exists) and visit `http://localhost:3000/news/<some-recent-date>`.

Expected on the page:
1. Emerald "Verified Kerala Board Rate" pill at top, breadcrumb underneath
2. Large H1 + glowing verdict pill (color matches verdict — emerald/amber/coral)
3. Range bar card with today's dot positioned between low and high
4. Big 22K rate card (gradient text, ★ Popular badge) + 3-row board for 24K/21K/18K — looks identical to homepage
5. Sparkline card with stats grid (7-day high/low/avg/net)
6. Commentary section with first paragraph drop cap (large amber letter)
7. Two nav cards side-by-side with prev/next date + rate
8. Amber CTA card at bottom

- [ ] **Step 7: Commit**

```bash
git add src/app/news/[date]/page.tsx
git commit -m "feat(news): restructure daily page with verdict, range bar, and rich cards"
```

---

## Task 7: Restructure the hub page (`/news`)

**Files:**

- Modify: `src/app/news/page.tsx`

- [ ] **Step 1: Replace the file contents**

This is a full rewrite. The data fetch (`getRecentDays`) gets bigger and we add per-day verdict computation.

```typescript
// src/app/news/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";
import type { GoldRate } from "@/lib/types";
import { formatCurrency } from "@/lib/format";
import { computeStats } from "@/lib/commentary";
import { computeVerdict, type Verdict } from "@/lib/verdict";
import { VerdictDot } from "@/components/VerdictPill";
import { NewsSparkline } from "@/components/NewsSparkline";

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

function formatRowDate(d: string): string {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function weekKeyOf(d: string): string {
  const date = new Date(d + "T00:00:00");
  const day = date.getDay(); // 0=Sun
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7));
  return monday.toISOString().slice(0, 10);
}

function formatWeekRange(mondayIso: string): string {
  const start = new Date(mondayIso + "T00:00:00");
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  return `Week of ${fmt(start)} – ${fmt(end)}, ${start.getFullYear()}`;
}

export default async function NewsHub() {
  const rows = await getRecentDays(30);

  if (rows.length === 0) {
    return (
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Daily Kerala Gold Rate Updates
        </h1>
        <p className="text-sm text-zinc-500">No daily updates yet. Check back tomorrow.</p>
      </main>
    );
  }

  // Hero stats from the 30-day window
  const values = rows.map((r) => r.rate_22k_1g);
  const weekValues = rows.slice(0, 7).map((r) => r.rate_22k_1g);
  const weekHigh = Math.max(...weekValues);
  const weekLow = Math.min(...weekValues);
  const monthAvg = values.reduce((a, b) => a + b, 0) / values.length;
  const netVs30dAgo = values[0] - values[values.length - 1];

  const sparklineData = [...rows]
    .reverse()
    .map((r) => ({ date: r.date, rate: r.rate_22k_1g }));

  // Group rows by week (Monday)
  const grouped: { weekKey: string; rows: GoldRate[] }[] = [];
  for (const row of rows) {
    const key = weekKeyOf(row.date);
    const last = grouped[grouped.length - 1];
    if (last && last.weekKey === key) last.rows.push(row);
    else grouped.push({ weekKey: key, rows: [row] });
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:gap-8 md:py-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
          Daily Kerala Gold Rate Updates
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          One commentary per trading day, with week and month context.
        </p>
      </header>

      {/* Hero stats strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <HeroStat label="7-day high" value={formatCurrency(weekHigh)} />
        <HeroStat label="7-day low" value={formatCurrency(weekLow)} />
        <HeroStat label="30-day avg" value={formatCurrency(monthAvg)} />
        <HeroStat
          label="Net vs 30d ago"
          value={(netVs30dAgo > 0 ? "+" : "") + netVs30dAgo.toFixed(0)}
          accent={netVs30dAgo > 0 ? "up" : netVs30dAgo < 0 ? "down" : "flat"}
        />
      </section>

      {/* Sparkline card */}
      <section className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
        <div className="border-b border-zinc-100 bg-zinc-50/60 px-5 py-2.5 dark:border-zinc-800 dark:bg-zinc-800/30">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            30-day trend — 22K
          </p>
        </div>
        <div className="px-5 py-4">
          <NewsSparkline data={sparklineData} height={160} />
        </div>
      </section>

      {/* Day cards, grouped by week */}
      <section className="flex flex-col gap-5">
        {grouped.map((group) => (
          <div key={group.weekKey}>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {formatWeekRange(group.weekKey)}
            </p>
            <ul className="flex flex-col gap-2">
              {group.rows.map((row) => {
                const globalIdx = rows.findIndex((r) => r.date === row.date);
                const window = rows.slice(globalIdx, globalIdx + 30);
                const stats = window.length >= 5 ? computeStats(window) : null;
                const verdict = stats ? computeVerdict(stats) : null;
                const prev = rows[globalIdx + 1];
                const change = prev ? row.rate_22k_1g - prev.rate_22k_1g : null;
                return (
                  <li key={row.date}>
                    <DayRowCard
                      date={row.date}
                      rate22k={row.rate_22k_1g}
                      change={change}
                      verdict={verdict}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}

function HeroStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "up" | "down" | "flat";
}) {
  const valueColor =
    accent === "up"
      ? "text-red-600"
      : accent === "down"
      ? "text-green-600"
      : "text-zinc-800 dark:text-zinc-200";
  return (
    <div className="rounded-2xl border border-zinc-200/70 bg-white p-4 text-center shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
      <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {label}
      </p>
      <p className={`mt-1 text-lg font-bold ${valueColor}`}>{value}</p>
    </div>
  );
}

function DayRowCard({
  date,
  rate22k,
  change,
  verdict,
}: {
  date: string;
  rate22k: number;
  change: number | null;
  verdict: Verdict | null;
}) {
  return (
    <Link
      href={`/news/${date}`}
      className="group flex items-center gap-4 rounded-xl border border-zinc-200/70 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-800/40"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
            {formatRowDate(date)}
          </p>
          {verdict && <VerdictDot verdict={verdict} />}
        </div>
        <p className="text-xs text-zinc-500">
          22K {formatCurrency(rate22k)}/g · 1 Pavan {formatCurrency(rate22k * 8)}
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
          {change !== 0 ? change.toLocaleString("en-IN") : "no change"}
        </span>
      )}
    </Link>
  );
}
```

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 3: Visual verify**

Start dev server, visit `http://localhost:3000/news`.

Expected:
1. 4 hero stat cards (week high, week low, 30-day avg, net change)
2. Big sparkline card
3. Rows grouped into "Week of X – Y, 2026" sections
4. Each row card: date + verdict dot (green/amber/red) + rate + change badge

- [ ] **Step 4: Commit**

```bash
git add src/app/news/page.tsx
git commit -m "feat(news): restructure hub with hero stats, sparkline, and grouped day cards"
```

---

## Task 8: Add verdict dots to `RecentDailyUpdates` on homepage

**Files:**

- Modify: `src/components/DashboardLayout.tsx`

The homepage's "Daily Market Updates" section currently shows date + "Kerala Gold Rate Daily Update" text. Replace that with the actual rate + a small verdict dot so the homepage signals the buy-zone moment without needing the user to click.

- [ ] **Step 1: Replace `getRecentNewsDates` with a richer fetcher**

In `src/components/DashboardLayout.tsx`, find the existing `getRecentNewsDates` helper near the top of the file. Replace it with:

```typescript
async function getRecentNewsWithVerdicts(limit = 3) {
  const { createSupabaseReadClient } = await import("@/lib/supabase");
  const { computeStats } = await import("@/lib/commentary");
  const { computeVerdict } = await import("@/lib/verdict");
  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("date, city, rate_18k_1g, rate_22k_1g, rate_24k_1g, rate_silver_1g")
    .eq("city", "Kochi")
    .order("date", { ascending: false })
    .limit(30);
  const all = (data ?? []) as import("@/lib/types").GoldRate[];
  return all.slice(0, limit).map((row, i) => {
    const window = all.slice(i, i + 30);
    const stats = window.length >= 5 ? computeStats(window) : null;
    const verdict = stats ? computeVerdict(stats) : null;
    return { date: row.date, rate22k: row.rate_22k_1g, verdict };
  });
}
```

- [ ] **Step 2: Update the call site inside `DashboardLayout`**

Find the line:
```typescript
const recentNewsDates = await getRecentNewsDates(3);
```

Replace with:
```typescript
const recentNewsEntries = await getRecentNewsWithVerdicts(3);
```

- [ ] **Step 3: Replace `RecentDailyUpdates` with a richer version**

Find the existing `RecentDailyUpdates` function. Replace it with:

```typescript
function RecentDailyUpdates({
  entries,
}: {
  entries: { date: string; rate22k: number; verdict: import("@/lib/verdict").Verdict | null }[];
}) {
  if (entries.length === 0) return null;
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
        {entries.map((e) => (
          <Link
            key={e.date}
            href={`/news/${e.date}`}
            className="group rounded-xl border border-zinc-200/60 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-amber-800/40"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400">
                {new Date(e.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              </p>
              {e.verdict && <VerdictDot verdict={e.verdict} />}
            </div>
            <p className="mt-0.5 text-sm font-semibold leading-snug text-zinc-800 group-hover:text-amber-700 dark:text-zinc-200 dark:group-hover:text-amber-400">
              22K at ₹{e.rate22k.toLocaleString("en-IN")}/g
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-500">
              {e.verdict ? e.verdict.headline : "Daily update"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add the import at the top of the file**

```typescript
import { VerdictDot } from "@/components/VerdictPill";
```

- [ ] **Step 5: Update the JSX call site**

Find:
```tsx
<RecentDailyUpdates dates={recentNewsDates} />
```

Replace with:
```tsx
<RecentDailyUpdates entries={recentNewsEntries} />
```

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit`
Expected: zero errors.

- [ ] **Step 7: Visual verify**

Start dev server, visit `http://localhost:3000/`. Scroll to the "Daily Market Updates" section.

Expected: 3 cards, each showing date + small verdict dot (green/amber/red) + 22K rate + verdict label ("Buy Zone" / "Fair Pricing" / "Near Peak" / "Mid Range").

- [ ] **Step 8: Commit**

```bash
git add src/components/DashboardLayout.tsx
git commit -m "feat(news): show verdict dot on homepage Daily Market Updates cards"
```

---

## Task 9: Final full pass — build + cross-browser visual review

This is the launch gate before the user merges back to `main`.

- [ ] **Step 1: Production build**

Run: `npm run build`
Expected: build succeeds. Route output shows `/news` (static) and `/news/[date]` (static, count matches DB rows).

- [ ] **Step 2: Production server + visit each surface**

Run: `npm run start`

Visit and eyeball:
1. `http://localhost:3000/` — verify the existing rate cards (22K hero + board) look IDENTICAL to before extraction. Verify the Daily Market Updates section shows verdict dots.
2. `http://localhost:3000/news` — hero stats, sparkline, grouped day cards with verdict dots.
3. `http://localhost:3000/news/<recent-date-near-monthly-high>` — verify "Near Peak" coral pill.
4. `http://localhost:3000/news/<recent-date-near-monthly-low>` — verify "Buy Zone" emerald pill.
5. `http://localhost:3000/news/<recent-date-mid-range>` — verify "Fair Pricing" amber pill.

- [ ] **Step 3: View source on one daily page**

Confirm both `<script type="application/ld+json">` blocks (NewsArticle + BreadcrumbList) are still present and well-formed. These weren't touched but should be verified.

- [ ] **Step 4: Sitemap re-check**

Visit `http://localhost:3000/sitemap.xml` — should still contain `/news` and one entry per date. The polish work shouldn't have changed sitemap output, but a quick grep confirms nothing got dropped.

- [ ] **Step 5: Tune verdict thresholds if needed**

If during Step 2 review the verdicts feel off (e.g. too many days reading "Buy Zone" when they don't feel cheap), tune `src/lib/verdict.ts`:
- The "Buy Zone" / "Near Peak" thresholds are inherited from `computeStats`'s `positionInMonthRange` (top/bottom 20% of the 30-day band).
- The "Fair Pricing" band is `Math.abs(pct) <= 0.5` of monthly average.
- Edit, re-run `npx tsx --tsconfig tsconfig.json scripts/verify-commentary.ts` to sanity-check, rebuild.

```bash
git add src/lib/verdict.ts
git commit -m "tune(news): adjust verdict thresholds from launch review"
```

(Skip if no tuning needed.)

---

## Done criteria

- Homepage rate cards visually unchanged from before extraction.
- Homepage Daily Market Updates cards show verdict dots and headlines.
- `/news` hub shows hero stats strip, sparkline card, and day cards grouped by week with verdict dots.
- `/news/[date]` shows verdict pill, range bar, homepage-style rate cards, sparkline+summary card, drop-cap commentary, prev/next nav cards, amber CTA.
- All three verdicts (Buy Zone / Fair / Near Peak) verified across at least 3 different daily pages.
- Production build succeeds, no type errors anywhere.
- Sitemap still contains all `/news/[date]` URLs.
