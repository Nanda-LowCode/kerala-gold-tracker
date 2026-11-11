#!/usr/bin/env node
/**
 * Site uptime + freshness check, run every 30 min by
 * .github/workflows/health-check.yml. Exits non-zero on any problem, which
 * fails the workflow and makes GitHub email the repo owner.
 *
 * Catches: the site being down or paused (e.g. the Vercel 402 pause of
 * 7–10 Nov 2026), Cloudflare Worker errors (5xx / error 1102), and a stale
 * rate — the homepage still showing an old date after the 10:05 IST update.
 */

const BASE = "https://www.livegoldkerala.com";
const UA = "livegoldkerala-health-check/1.0";
const PAGES = ["/", "/ml", "/tools/pavan-to-gram-calculator", "/ads.txt"];
// The update cron runs at 10:05 IST with backups at 10:30 and 10:45.
const FRESHNESS_DEADLINE_IST = { hour: 11, minute: 0 };

function nowIST() {
  return new Date(Date.now() + 5.5 * 3600 * 1000);
}

async function fetchPage(path) {
  const res = await fetch(BASE + path, {
    headers: { "User-Agent": UA },
    redirect: "follow",
    signal: AbortSignal.timeout(30_000),
  });
  return { status: res.status, body: await res.text() };
}

async function main() {
  const failures = [];
  let homepage = "";

  for (const path of PAGES) {
    try {
      const { status, body } = await fetchPage(path);
      if (status !== 200) {
        failures.push(`${path} returned HTTP ${status}${body.length < 300 ? `: ${body.trim()}` : ""}`);
      } else {
        console.log(`✓ ${path} 200`);
        if (path === "/") homepage = body;
      }
    } catch (err) {
      failures.push(`${path} unreachable: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Freshness: the homepage <title> carries the rate date, e.g. "(11 Nov)".
  const ist = nowIST();
  const pastDeadline =
    ist.getUTCHours() > FRESHNESS_DEADLINE_IST.hour ||
    (ist.getUTCHours() === FRESHNESS_DEADLINE_IST.hour && ist.getUTCMinutes() >= FRESHNESS_DEADLINE_IST.minute);
  if (homepage && pastDeadline) {
    const today = ist.toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
    const title = homepage.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
    if (!title.includes(`(${today})`)) {
      failures.push(`Homepage is not showing today's rate (${today}). Title: "${title}"`);
    } else {
      console.log(`✓ homepage shows today's rate (${today})`);
    }
  }

  if (failures.length) {
    console.error("\nSITE PROBLEM:");
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log("\nAll checks passed.");
}

main().catch((err) => {
  console.error(`Health check crashed: ${err.message}`);
  process.exit(2);
});
