// Historical gold-rate backfill for the Kerala tracker.
//
// WHY: the live cron only has data from launch (~Apr 2026) onward, so the
// long-range chart ("1Y/5Y") and "this day last year" have nothing to show.
//
// WHAT IT DOES (and does NOT do):
//   - It does NOT invent the official AKGSMA board rate for past dates — that
//     archive isn't published. Instead it derives 22K from real gold spot
//     (COMEX GC=F, USD/oz) × USD-INR (Yahoo, keyless), then CALIBRATES that
//     series to your existing live rows (median live/derived ratio over the
//     overlap window). The result joins your real data smoothly.
//   - Backfilled rows are tagged consensus_sources="backfill-yahoo-calibrated"
//     so they're always distinguishable from real board rates.
//   - It only writes dates EARLIER than your earliest live row — real board
//     rates are never overwritten.
//
// USAGE (dry run prints a plan and writes nothing):
//   node --env-file=.env.local scripts/backfill-history.mjs --years=3
//   node --env-file=.env.local scripts/backfill-history.mjs --from=2022-01-01 --apply
//
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.

import { createClient } from "@supabase/supabase-js";

const CITY = "Kochi";
const TROY_OZ_G = 31.1034768; // grams per troy ounce
const PURITY_22K = 0.916; // 916 hallmark
const SANE_MIN = 3000; // ₹/g guardrails (mirror the cron's validateRates)
const SANE_MAX = 30000;
const SOURCE_TAG = "backfill-yahoo-calibrated";

// ─── CLI args ────────────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  })
);
const APPLY = Boolean(args.apply);
const YEARS = args.years ? Number(args.years) : 3;
const FROM = args.from ? String(args.from) : null;

// ─── helpers ─────────────────────────────────────────────────────────────────
const isoDate = (d) => d.toISOString().slice(0, 10);
const round = (n) => Math.round(n);
const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** Fetch a Yahoo daily close series → Map<"YYYY-MM-DD", number> (nulls dropped). */
async function fetchYahooDaily(symbol, period1, period2) {
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?period1=${period1}&period2=${period2}&interval=1d`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Yahoo ${symbol}: HTTP ${res.status}`);
  const json = await res.json();
  const r = json?.chart?.result?.[0];
  const ts = r?.timestamp;
  const closes = r?.indicators?.quote?.[0]?.close;
  if (!ts || !closes) throw new Error(`Yahoo ${symbol}: unexpected payload shape`);
  const map = new Map();
  for (let i = 0; i < ts.length; i++) {
    if (closes[i] == null) continue;
    map.set(isoDate(new Date(ts[i] * 1000)), closes[i]);
  }
  if (map.size === 0) throw new Error(`Yahoo ${symbol}: empty series`);
  return map;
}

/** Forward-fill a date→value map across every day in [from, to]. */
function forwardFill(map, from, to) {
  const out = new Map();
  let last = null;
  for (let d = new Date(from); d <= to; d.setUTCDate(d.getUTCDate() + 1)) {
    const key = isoDate(d);
    if (map.has(key)) last = map.get(key);
    if (last != null) out.set(key, last);
  }
  return out;
}

// ─── main ────────────────────────────────────────────────────────────────────
async function main() {
  const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      "✗ Missing env. Run with: node --env-file=.env.local scripts/backfill-history.mjs"
    );
    process.exit(1);
  }
  const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // 1) Read live rows (source of truth for calibration + the cutoff).
  const { data: live, error } = await supabase
    .from("daily_gold_rates")
    .select("date, rate_22k_1g")
    .eq("city", CITY)
    .order("date", { ascending: true });
  if (error) throw new Error(`Supabase read failed: ${error.message}`);
  if (!live || live.length === 0) {
    console.error("✗ No live rows found — need existing data to calibrate against. Run the cron first.");
    process.exit(1);
  }
  const earliestLive = live[0].date;
  const liveMap = new Map(live.map((r) => [r.date, r.rate_22k_1g]));
  console.log(`Live data: ${live.length} rows, earliest ${earliestLive}.`);

  // 2) Date range to backfill: [from, earliestLive).
  const cutoff = new Date(earliestLive + "T00:00:00Z");
  const from = FROM
    ? new Date(FROM + "T00:00:00Z")
    : new Date(Date.UTC(cutoff.getUTCFullYear() - YEARS, cutoff.getUTCMonth(), cutoff.getUTCDate()));
  if (from >= cutoff) {
    console.error(`✗ from (${isoDate(from)}) is not before earliest live date (${earliestLive}).`);
    process.exit(1);
  }
  const now = new Date();
  console.log(`Backfill window: ${isoDate(from)} → ${earliestLive} (exclusive).`);

  // 3) Fetch spot gold (USD/oz) + USD-INR, forward-filled across the full span
  //    (extend `to` to today so the overlap window for calibration is covered).
  const p1 = Math.floor(from.getTime() / 1000);
  const p2 = Math.floor(now.getTime() / 1000);
  console.log("Fetching Yahoo GC=F (gold) and INR=X (USD-INR)…");
  const [goldRaw, inrRaw] = await Promise.all([
    fetchYahooDaily("GC=F", p1, p2),
    fetchYahooDaily("INR=X", p1, p2),
  ]);
  const gold = forwardFill(goldRaw, from, now);
  const inr = forwardFill(inrRaw, from, now);

  // raw 22K ₹/g from spot, before local calibration
  const raw22k = (date) => {
    const oz = gold.get(date);
    const fx = inr.get(date);
    if (oz == null || fx == null) return null;
    return ((oz * fx) / TROY_OZ_G) * PURITY_22K;
  };

  // 4) Calibration factor = median(live 22K / raw 22K) over overlapping dates.
  const ratios = [];
  for (const [date, live22k] of liveMap) {
    const r = raw22k(date);
    if (r && r > 0) ratios.push(live22k / r);
  }
  if (ratios.length < 5) {
    console.error(`✗ Only ${ratios.length} overlapping dates — too few to calibrate reliably.`);
    process.exit(1);
  }
  const factor = median(ratios);
  console.log(
    `Calibration factor: ${factor.toFixed(4)} (from ${ratios.length} overlap days). ` +
      `Captures Kerala board premium over spot.`
  );
  if (factor < 0.7 || factor > 1.5) {
    console.error("✗ Calibration factor outside sane band — aborting (likely a unit/data issue).");
    process.exit(1);
  }

  // 5) Build rows for every Mon–Sat in the window (Kerala market closed Sundays).
  const rows = [];
  let skipped = 0;
  for (let d = new Date(from); d < cutoff; d.setUTCDate(d.getUTCDate() + 1)) {
    const date = isoDate(d);
    if (d.getUTCDay() === 0) continue; // Sunday
    if (liveMap.has(date)) continue; // never touch real rows
    const base = raw22k(date);
    if (base == null) {
      skipped++;
      continue;
    }
    const r22 = round(base * factor);
    const r24 = round(r22 * (24 / 22)); // match site convention
    const r18 = round(r24 * (18 / 24));
    if (r22 < SANE_MIN || r22 > SANE_MAX || r24 <= r22) {
      skipped++;
      continue;
    }
    rows.push({
      date,
      city: CITY,
      rate_18k_1g: r18,
      rate_22k_1g: r22,
      rate_24k_1g: r24,
      consensus_sources: SOURCE_TAG,
    });
  }

  // 6) Report + (optionally) write.
  if (rows.length === 0) {
    console.log("Nothing to backfill.");
    return;
  }
  const first = rows[0];
  const last = rows[rows.length - 1];
  console.log(
    `\nPrepared ${rows.length} rows (${skipped} skipped). Sample:\n` +
      `  ${first.date}: 22K ₹${first.rate_22k_1g}/g, 24K ₹${first.rate_24k_1g}/g\n` +
      `  ${last.date}: 22K ₹${last.rate_22k_1g}/g, 24K ₹${last.rate_24k_1g}/g`
  );

  if (!APPLY) {
    console.log("\nDRY RUN — no rows written. Re-run with --apply to write.");
    return;
  }

  console.log("\nWriting in batches of 500…");
  for (let i = 0; i < rows.length; i += 500) {
    const batch = rows.slice(i, i + 500);
    const { error: upErr } = await supabase
      .from("daily_gold_rates")
      .upsert(batch, { onConflict: "date,city" });
    if (upErr) throw new Error(`Upsert failed at batch ${i}: ${upErr.message}`);
    console.log(`  wrote ${Math.min(i + 500, rows.length)}/${rows.length}`);
  }
  console.log(`✓ Backfill complete: ${rows.length} rows tagged "${SOURCE_TAG}".`);
}

main().catch((err) => {
  console.error("✗ Backfill failed:", err.message);
  process.exit(1);
});
