// Posts the day's Kerala gold rate to your own subreddit, once per day.
//
// Reuses the live Supabase data (read-only anon key) and submits a text post
// via Reddit's OAuth API using a "script" app + the bot account that moderates
// the sub. Designed to run from a GitHub Action after the morning rate update.
//
// Required env vars:
//   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY   (same as the site)
//   REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET                    (reddit.com/prefs/apps, "script" type)
//   REDDIT_USERNAME, REDDIT_PASSWORD                          (the bot/mod account)
//   REDDIT_SUBREDDIT                                          (e.g. "LiveGoldKerala", no "r/")
// Optional:
//   REDDIT_FORCE=1   post even if today's rate row isn't in yet (for manual tests)
//
//   node --env-file=.env.local scripts/post-to-reddit.mjs

import { createClient } from "@supabase/supabase-js";

const {
  NEXT_PUBLIC_SUPABASE_URL: SB_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: SB_KEY,
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_USERNAME,
  REDDIT_PASSWORD,
  REDDIT_SUBREDDIT,
  REDDIT_FORCE,
} = process.env;

const required = {
  NEXT_PUBLIC_SUPABASE_URL: SB_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: SB_KEY,
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_USERNAME,
  REDDIT_PASSWORD,
  REDDIT_SUBREDDIT,
};
const missing = Object.entries(required).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  console.error("✗ Missing env vars:", missing.join(", "));
  process.exit(1);
}

const UA = `livegoldkerala-rate-bot/1.0 (by /u/${REDDIT_USERNAME})`;
const inr = (n) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// ── 1. Pull the latest two rate rows ──────────────────────────────────────────
const supabase = createClient(SB_URL, SB_KEY);
const { data, error } = await supabase
  .from("daily_gold_rates")
  .select("date, rate_18k_1g, rate_22k_1g, rate_24k_1g")
  .eq("city", "Kochi")
  .order("date", { ascending: false })
  .limit(2);

if (error || !data?.length) {
  console.error("✗ Supabase read failed:", error?.message ?? "no rows");
  process.exit(1);
}

const today = data[0];
const yesterday = data[1] ?? null;

// Freshness guard: don't post a stale rate as "today's". Skip cleanly (exit 0)
// if the latest row isn't actually today's date in IST, unless REDDIT_FORCE.
const istToday = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
if (today.date !== istToday && REDDIT_FORCE !== "1") {
  console.log(`• Latest rate row is ${today.date}, not today (${istToday} IST). Skipping post.`);
  process.exit(0);
}

const change22k = yesterday ? today.rate_22k_1g - yesterday.rate_22k_1g : 0;
const pct = yesterday ? (change22k / yesterday.rate_22k_1g) * 100 : 0;
const arrow = change22k > 0 ? "▲" : change22k < 0 ? "▼" : "■";
const changeStr = yesterday
  ? `${arrow} ${inr(Math.abs(change22k))}/g (${Math.abs(pct).toFixed(2)}%)`
  : "first reading";

const dateLong = new Date(today.date + "T00:00:00").toLocaleDateString("en-IN", {
  weekday: "long", day: "numeric", month: "long", year: "numeric",
});

// ── 2. Compose the post ───────────────────────────────────────────────────────
const title =
  `Kerala Gold Rate Today (${new Date(today.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}): ` +
  `22K ${inr(today.rate_22k_1g)}/g · ${inr(today.rate_22k_1g * 8)}/pavan ${yesterday ? arrow + " " + inr(Math.abs(change22k)) : ""}`.trim();

const text = `**Today's Kerala gold rate** — AKGSMA board rate, ${dateLong}:

| Purity | Per gram | Per pavan (8 g) |
|---|---|---|
| 22K (916) | ${inr(today.rate_22k_1g)} | ${inr(today.rate_22k_1g * 8)} |
| 24K (999) | ${inr(today.rate_24k_1g)} | ${inr(today.rate_24k_1g * 8)} |
| 18K (750) | ${inr(today.rate_18k_1g)} | ${inr(today.rate_18k_1g * 8)} |

**Change since yesterday (22K):** ${changeStr}

Rates are the official All Kerala Gold & Silver Merchants Association board rate and are uniform across all districts.

📈 Live rate, 30-day chart & full history → https://www.livegoldkerala.com

^(Auto-posted daily. Not investment advice; confirm at your jeweller before buying.)`;

// ── 3. Authenticate (script app, password grant) ──────────────────────────────
const basic = Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString("base64");
const tokenRes = await fetch("https://www.reddit.com/api/v1/access_token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${basic}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": UA,
  },
  body: new URLSearchParams({
    grant_type: "password",
    username: REDDIT_USERNAME,
    password: REDDIT_PASSWORD,
    scope: "submit",
  }),
});
const tokenJson = await tokenRes.json().catch(() => ({}));
if (!tokenRes.ok || !tokenJson.access_token) {
  console.error("✗ Reddit auth failed:", tokenRes.status, JSON.stringify(tokenJson));
  process.exit(1);
}

// ── 4. Submit the post ─────────────────────────────────────────────────────────
const submitRes = await fetch("https://oauth.reddit.com/api/submit", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${tokenJson.access_token}`,
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": UA,
  },
  body: new URLSearchParams({
    api_type: "json",
    sr: REDDIT_SUBREDDIT,
    kind: "self",
    title: title.slice(0, 300),
    text,
    sendreplies: "false",
  }),
});
const submitJson = await submitRes.json().catch(() => ({}));
const errs = submitJson?.json?.errors ?? [];
if (!submitRes.ok || errs.length) {
  console.error("✗ Reddit submit failed:", submitRes.status, JSON.stringify(errs.length ? errs : submitJson));
  process.exit(1);
}

console.log(`✓ Posted to r/${REDDIT_SUBREDDIT}: ${submitJson?.json?.data?.url ?? "(no url returned)"}`);
