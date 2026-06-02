// scripts/verify-commentary.ts
// Run with: npx tsx --tsconfig tsconfig.json scripts/verify-commentary.ts
// Prints generated commentary for several synthetic 30-day windows.
// Intended for local-dev sanity checks only — not deployed, not in CI.

import { computeStats, generateCommentary } from "../src/lib/commentary";
import { computeVerdict } from "../src/lib/verdict";
import type { GoldRate } from "../src/lib/types";

function makeHistory(prices: number[]): GoldRate[] {
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

const scenarios: Record<string, GoldRate[]> = {
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

console.log("\n\n=== VERDICTS ===");
for (const [name, history] of Object.entries(scenarios)) {
  const stats = computeStats(history);
  const verdict = computeVerdict(stats);
  console.log(
    `${name}: ${
      verdict
        ? `${verdict.headline} — ${verdict.sub} (${verdict.tone})`
        : "(no verdict — insufficient data)"
    }`
  );
}
