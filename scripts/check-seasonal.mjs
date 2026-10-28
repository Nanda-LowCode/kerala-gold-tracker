#!/usr/bin/env node
/**
 * Seasonal activation health check.
 *
 * Runs daily from .github/workflows/seasonal-check.yml. Verifies that the
 * live homepage reflects whatever the seasonal registry says should be
 * active today — and, outside every window, that no stale season markers
 * are hanging around. Any mismatch fails the workflow and GitHub emails
 * the repo owner (default behaviour for workflow_run failure).
 *
 * This script DUPLICATES the schedule in src/components/seasonal/characters/*.
 * That's deliberate: it's a plain .mjs with zero project deps, so the check
 * works even if the Next.js build is broken. When you bump a season's dates
 * for the next year, bump them here too — the whole configured range is
 * only ~6 lines.
 */

const SITE = "https://www.livegoldkerala.com/";
const UA = "livegoldkerala-seasonal-check/1.0";

// Each entry is one window. `marker` is a CSS class name present on the
// homepage ONLY when that window is active. Mirror src/components/seasonal.
const WINDOWS = [
  // Characters (also contribute their theme classes)
  { id: "mahabali", marker: "onam-kasavu",     start: "2026-08-11", end: "2026-09-06" },
  { id: "lakshmi",  marker: "dhanteras-trim",  start: "2026-11-03", end: "2026-11-14" },
  { id: "krishna",  marker: "vishu-trim",      start: "2027-04-10", end: "2027-04-20" },
  { id: "kubera",   marker: "akshaya-trim",    start: "2027-05-05", end: "2027-05-12" },
  // Theme-only windows (no character)
  { id: "ramadan",       marker: "ramadan-trim", start: "2027-02-16", end: "2027-03-22" },
  { id: "eid-al-adha",   marker: "ramadan-trim", start: "2027-05-25", end: "2027-05-29" },
];

// Every marker that would EVER appear on the homepage. Used for the
// "nothing active" assertion so we catch a leaked class from an expired
// window that someone forgot to tear down.
const ALL_MARKERS = Array.from(new Set(WINDOWS.map((w) => w.marker)));

function todayInIST() {
  const istMs = Date.now() + 5.5 * 3600 * 1000;
  return new Date(istMs).toISOString().slice(0, 10);
}

function windowActive(today, { start, end }) {
  return today >= start && today <= end;
}

async function fetchHomepage() {
  const res = await fetch(SITE, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`Homepage returned ${res.status}`);
  return await res.text();
}

async function main() {
  const today = todayInIST();
  const active = WINDOWS.filter((w) => windowActive(today, w));

  console.log(`Today (IST): ${today}`);
  if (active.length === 0) {
    console.log("No seasonal window is active.");
  } else {
    console.log(`Expected active: ${active.map((w) => w.id).join(", ")}`);
  }

  const html = await fetchHomepage();
  const failures = [];

  // 1. Every expected marker must be present
  for (const w of active) {
    if (!html.includes(w.marker)) {
      failures.push(
        `[${w.id}] window active (${w.start} → ${w.end}) but marker "${w.marker}" is missing from the live homepage HTML.`,
      );
    } else {
      console.log(`✓ ${w.id}: marker "${w.marker}" present`);
    }
  }

  // 2. No stale markers for inactive windows
  const expectedMarkers = new Set(active.map((w) => w.marker));
  for (const marker of ALL_MARKERS) {
    if (expectedMarkers.has(marker)) continue;
    if (html.includes(marker)) {
      failures.push(
        `No window should render "${marker}" today, but it appears on the live homepage. A past window's teardown may have broken, or the registry drifted.`,
      );
    }
  }

  if (failures.length > 0) {
    console.error("\nFAILURES:");
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }

  console.log("\nAll seasonal activation checks passed.");
}

main().catch((err) => {
  console.error(`Check script errored: ${err.message}`);
  process.exit(2);
});
