import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import * as cheerio from "cheerio";
import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase";
import webpush from "web-push";

// Configure web-push with VAPID keys
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    "mailto:" + (process.env.ALERT_EMAIL || "admin@example.com"),
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface GoldRateResult {
  rate_22k_1g: number;
  rate_24k_1g: number;
  source: string;
}

type FetcherFn = () => Promise<GoldRateResult>;

// ─── Config ──────────────────────────────────────────────────────────────────

const FETCH_TIMEOUT_MS = 15_000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getTodayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/** Parse Malabar JSON strings like "13,835.00 INR" into integers */
function parseRate(rateStr: string): number {
  const match = rateStr.replace(/,/g, "").match(/[\d.]+/);
  if (!match) throw new Error(`Cannot parse rate: ${rateStr}`);
  const num = parseFloat(match[0]);
  if (isNaN(num)) throw new Error(`Cannot parse rate: ${rateStr}`);
  return Math.round(num);
}

/** Parse scraped price strings like "₹14,984" or "₹ 13,735" into integers */
function parsePrice(raw: string): number {
  const cleaned = raw.replace(/[₹,\s]/g, "").trim();
  const num = Math.round(parseFloat(cleaned));
  if (isNaN(num) || num <= 0) {
    throw new Error(`Invalid price: "${raw}" → ${cleaned}`);
  }
  return num;
}

/** Fetch HTML with timeout and browser headers */
async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

/** Sanity check — reject rates outside a reasonable band */
function validateRates(result: GoldRateResult): void {
  const { rate_22k_1g, rate_24k_1g, source } = result;
  if (rate_22k_1g < 3000 || rate_22k_1g > 30000) {
    throw new Error(`[${source}] 22K rate ${rate_22k_1g} outside sane range`);
  }
  if (rate_24k_1g < 3000 || rate_24k_1g > 35000) {
    throw new Error(`[${source}] 24K rate ${rate_24k_1g} outside sane range`);
  }
  if (rate_24k_1g <= rate_22k_1g) {
    throw new Error(`[${source}] 24K (${rate_24k_1g}) must be > 22K (${rate_22k_1g})`);
  }
}

// ─── Fetcher #1: Malabar Gold (Primary — JSON API) ──────────────────────────

const fetchMalabar: FetcherFn = async () => {
  const MALABAR_URL =
    "https://www.malabargoldanddiamonds.com/malabarprice/index/getrates/?country=IN&state=Kerala";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
  // Step 1: Initial request to get session cookie (returns 302)
  const initialRes = await fetch(MALABAR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "User-Agent": "Mozilla/5.0" },
    redirect: "manual",
    cache: "no-store",
    signal: controller.signal,
  });
  const cookies = initialRes.headers.getSetCookie?.().join("; ") ?? "";

  // Step 2: Follow up with cookie to get actual JSON
  const res = await fetch(MALABAR_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "Mozilla/5.0",
      Cookie: cookies,
    },
    cache: "no-store",
    signal: controller.signal,
  });

  if (!res.ok) throw new Error(`Malabar API returned ${res.status}`);

  const data: { "22kt": string; "24kt": string } = await res.json();
  const rate22k = parseRate(data["22kt"]);
  const rate24k = parseRate(data["24kt"]);

  const result: GoldRateResult = { rate_22k_1g: rate22k, rate_24k_1g: rate24k, source: "malabar" };
  validateRates(result);
  return result;
  } finally {
    clearTimeout(timer);
  }
};

// ─── Fetcher #3: BankBazaar Silver ───────────────────────────────────────────

async function fetchSilverBankBazaar(): Promise<number> {
  const html = await fetchHtml("https://www.bankbazaar.com/silver-rate-kerala.html");
  const $ = cheerio.load(html);

  let rate: number | null = null;

  // Strategy A: find h2 with "Silver Rate", walk to next table, first data row
  $("h2").each((_, heading) => {
    if (rate !== null) return;
    if (!/silver\s+rate/i.test($(heading).text())) return;

    let sibling = $(heading).next();
    while (sibling.length) {
      let table: ReturnType<typeof $> | null = null;
      if (sibling.is("table")) table = sibling;
      else {
        const inner = sibling.find("table");
        if (inner.length) table = inner.first();
      }
      if (table && table.length) {
        const price = table.find("tr").eq(1).find("td").eq(1).text().trim();
        if (price) {
          try {
            const parsed = parsePrice(price);
            if (parsed >= 50 && parsed <= 10000) rate = parsed;
          } catch {}
        }
        break;
      }
      sibling = sibling.next();
    }
  });

  // Strategy B: any table with a "1 gram" row, Today column
  if (rate === null) {
    $("table").each((_, el) => {
      if (rate !== null) return;
      $(el).find("tr").each((i, row) => {
        if (rate !== null || i === 0) return;
        const cells = $(row).find("td");
        if (cells.length < 2) return;
        const label = cells.eq(0).text().trim().toLowerCase();
        if (!label.includes("gram") || label.includes("kg")) return;
        try {
          const parsed = parsePrice(cells.eq(1).text().trim());
          if (parsed >= 50 && parsed <= 10000) rate = parsed;
        } catch {}
      });
    });
  }

  if (rate === null) throw new Error("BankBazaar silver: could not extract 1g rate");
  return rate;
}

// ─── Fetcher #2: BankBazaar (Fallback — HTML scrape) ────────────────────────

const fetchBankBazaar: FetcherFn = async () => {
  const html = await fetchHtml("https://www.bankbazaar.com/gold-rate-kerala.html");
  const $ = cheerio.load(html);

  let rate22k: number | null = null;
  let rate24k: number | null = null;

  // Strategy A: Find tables by their preceding h2 heading
  $("h2").each((_, heading) => {
    const headingText = $(heading).text().trim();
    if (!/(?:22|24)\s*Carat/i.test(headingText)) return;

    // Walk forward through siblings to find the next table
    let sibling = $(heading).next();
    let table: ReturnType<typeof $> | null = null;
    while (sibling.length && !table) {
      if (sibling.is("table")) {
        table = sibling;
      } else {
        const inner = sibling.find("table");
        if (inner.length) table = inner.first();
      }
      sibling = sibling.next();
    }
    if (!table || !table.length) return;

    // Extract "Today" price from first data row, second cell
    const todayCell = table.find("tr").eq(1).find("td").eq(1);
    if (!todayCell.length) return;

    const price = todayCell.text().trim();
    if (/22\s*Carat/i.test(headingText) && !rate22k) rate22k = parsePrice(price);
    else if (/24\s*Carat/i.test(headingText) && !rate24k) rate24k = parsePrice(price);
  });

  // Strategy B: Positional fallback — first table.w-full = 22K, second = 24K
  if (!rate22k || !rate24k) {
    const tables = $("table.w-full");
    if (!rate22k && tables.length > 0) {
      const price = $(tables[0]).find("tr").eq(1).find("td").eq(1).text().trim();
      if (price) rate22k = parsePrice(price);
    }
    if (!rate24k && tables.length > 1) {
      const price = $(tables[1]).find("tr").eq(1).find("td").eq(1).text().trim();
      if (price) rate24k = parsePrice(price);
    }
  }

  if (!rate22k || !rate24k) {
    throw new Error(`BankBazaar: Could not extract both rates (22K=${rate22k}, 24K=${rate24k})`);
  }

  const result: GoldRateResult = { rate_22k_1g: rate22k, rate_24k_1g: rate24k, source: "bankbazaar" };
  validateRates(result);
  return result;
};

// ─── Fetcher #4: GoodReturns (Kerala gold rate page) ─────────────────────────

const fetchGoodReturns: FetcherFn = async () => {
  const html = await fetchHtml("https://www.goodreturns.in/gold-rates/kerala.html");
  const $ = cheerio.load(html);

  let rate22k: number | null = null;
  let rate24k: number | null = null;

  // Strategy A: table rows whose first cell mentions 22/24 carat
  $("table").each((_, table) => {
    if (rate22k && rate24k) return;
    $(table).find("tr").each((_, row) => {
      if (rate22k && rate24k) return;
      const cells = $(row).find("td");
      if (cells.length < 2) return;
      const label = cells.eq(0).text().trim().toLowerCase();
      const valueText = cells.eq(1).text().trim();
      if (!valueText) return;
      try {
        const parsed = parsePrice(valueText);
        if (!rate22k && label.includes("22") && parsed >= 3000 && parsed <= 30000) rate22k = parsed;
        if (!rate24k && label.includes("24") && parsed >= 3000 && parsed <= 35000) rate24k = parsed;
      } catch {}
    });
  });

  // Strategy B: elements with data-gold-type or class hints
  if (!rate22k || !rate24k) {
    $("[class*='gold']").each((_, el) => {
      if (rate22k && rate24k) return;
      const text = $(el).text().trim().toLowerCase();
      const priceEl = $(el).find("[class*='price'], [class*='rate'], td").first();
      if (!priceEl.length) return;
      try {
        const parsed = parsePrice(priceEl.text().trim());
        if (!rate22k && text.includes("22") && parsed >= 3000 && parsed <= 30000) rate22k = parsed;
        if (!rate24k && text.includes("24") && parsed >= 3000 && parsed <= 35000) rate24k = parsed;
      } catch {}
    });
  }

  if (!rate22k || !rate24k) {
    throw new Error(`GoodReturns: could not extract rates (22K=${rate22k}, 24K=${rate24k})`);
  }

  const result: GoldRateResult = { rate_22k_1g: rate22k, rate_24k_1g: rate24k, source: "goodreturns" };
  validateRates(result);
  return result;
};

// ─── Parallel fetch with stale detection ─────────────────────────────────────

const FETCHERS: { name: string; fn: FetcherFn }[] = [
  { name: "Malabar Gold", fn: fetchMalabar },
  { name: "BankBazaar", fn: fetchBankBazaar },
  { name: "GoodReturns", fn: fetchGoodReturns },
];

async function fetchWithConsensus(
  yesterdayRate22k: number | null
): Promise<{ data: GoldRateResult | null; errors: string[]; winner: string }> {
  console.log("[gold-cron] Fetching all sources in parallel...");

  const settled = await Promise.allSettled(FETCHERS.map((f) => f.fn()));

  const successful: Array<{ name: string; data: GoldRateResult }> = [];
  const errors: string[] = [];

  settled.forEach((result, i) => {
    if (result.status === "fulfilled") {
      const d = result.value;
      console.log(`[gold-cron] ${FETCHERS[i].name}: 22K=₹${d.rate_22k_1g}, 24K=₹${d.rate_24k_1g}`);
      successful.push({ name: FETCHERS[i].name, data: d });
    } else {
      const msg = `[gold-cron] ${FETCHERS[i].name} failed: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`;
      console.warn(msg);
      errors.push(msg);
    }
  });

  if (successful.length === 0) return { data: null, errors, winner: "none" };

  // Stale detection: if some sources match yesterday but others don't → those are stale
  if (yesterdayRate22k !== null) {
    const fresh = successful.filter((s) => s.data.rate_22k_1g !== yesterdayRate22k);
    const stale = successful.filter((s) => s.data.rate_22k_1g === yesterdayRate22k);

    if (fresh.length > 0 && stale.length > 0) {
      stale.forEach((s) =>
        console.warn(`[gold-cron] ${s.name} is STALE — matches yesterday's ₹${yesterdayRate22k}`)
      );
      // Prefer Malabar if it's fresh; otherwise take first fresh source
      const chosen = fresh.find((s) => s.name === "Malabar Gold") ?? fresh[0];
      console.log(`[gold-cron] Winner: ${chosen.name} (fresh, stale sources skipped)`);
      return { data: chosen.data, errors, winner: chosen.name };
    }

    if (stale.length === successful.length) {
      console.log(
        `[gold-cron] All sources match yesterday (₹${yesterdayRate22k}) — genuine no-change day or all still stale`
      );
    }
  }

  // No stale conflict: prefer Malabar as most authoritative
  const chosen = successful.find((s) => s.name === "Malabar Gold") ?? successful[0];
  console.log(`[gold-cron] Winner: ${chosen.name}`);
  return { data: chosen.data, errors, winner: chosen.name };
}

// ─── Alerting ────────────────────────────────────────────────────────────────

async function sendFailureAlert(errors: string[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.ALERT_EMAIL;
  if (!apiKey || !alertEmail) return;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "LiveGold Alerts <onboarding@resend.dev>",
      to: alertEmail,
      subject: `[LiveGold] Cron failed — all gold rate sources down`,
      text: `All gold rate sources failed at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST.\n\nErrors:\n${errors.join("\n")}\n\nNo data was written for today. Check the sources manually.`,
    });
    console.log("[gold-cron] Failure alert email sent");
  } catch (err) {
    console.error("[gold-cron] Failed to send alert email:", err);
  }
}

// ─── Route Handler ───────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createSupabaseAdminClient();
    const yesterdayDate = new Date(Date.now() - 86400000).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

    // Yesterday's rate (stale detection) + silver run in parallel; gold sources run in parallel inside fetchWithConsensus
    const [{ data: yesterdayRow }, silverRate] = await Promise.all([
      supabase.from("daily_gold_rates").select("rate_22k_1g").eq("city", "Kochi").eq("date", yesterdayDate).single(),
      fetchSilverBankBazaar().catch((err) => {
        console.warn("[gold-cron] Silver fetch failed:", err instanceof Error ? err.message : String(err));
        return null;
      }),
    ]);

    const yesterdayRate22k: number | null = yesterdayRow?.rate_22k_1g ?? null;
    const { data, errors, winner } = await fetchWithConsensus(yesterdayRate22k);

    if (silverRate !== null) {
      console.log(`[gold-cron] Silver rate: ₹${silverRate}/g`);
    }

    if (!data) {
      console.error("[gold-cron] All sources failed!", errors);
      await sendFailureAlert(errors);
      return NextResponse.json(
        { success: false, error: "All gold rate sources failed", details: errors },
        { status: 502 }
      );
    }

    // Calculate 18K from 24K (75% purity = 18/24)
    const rate18k = Math.round(data.rate_24k_1g * (18 / 24));

    const today = getTodayIST();

    const goldPayload = {
      date: today,
      city: "Kochi",
      rate_18k_1g: rate18k,
      rate_22k_1g: data.rate_22k_1g,
      rate_24k_1g: data.rate_24k_1g,
      consensus_sources: data.source,
    };

    let { error } = await supabase.from("daily_gold_rates").upsert(
      { ...goldPayload, ...(silverRate !== null && { rate_silver_1g: silverRate }) },
      { onConflict: "date,city" }
    );

    // If silver column doesn't exist yet (DB migration pending), retry gold-only
    if (error && silverRate !== null) {
      console.warn("[gold-cron] Upsert with silver failed, retrying gold-only:", error.message);
      ({ error } = await supabase.from("daily_gold_rates").upsert(goldPayload, { onConflict: "date,city" }));
    }

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    // Clear Next.js cache for all pages
    revalidatePath("/");
    const cities = ["trivandrum", "ernakulam", "kozhikode", "thrissur", "kollam", "palakkad", "kannur", "alappuzha", "kottayam", "malappuram", "pathanamthitta", "idukki", "wayanad", "kasaragod"];
    for (const city of cities) {
      revalidatePath(`/${city}`);
    }

    // Ping IndexNow so Bing/Yandex reindex immediately
    if (process.env.INDEXNOW_KEY) {
      const key = process.env.INDEXNOW_KEY;
      const base = "https://www.livegoldkerala.com";
      const urlList = [base, ...cities.map((c) => `${base}/${c}`)];
      fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify({ host: "www.livegoldkerala.com", key, urlList }),
      }).catch((err) => console.warn("[gold-cron] IndexNow ping failed:", err));
    }

    // Broadcast Push Notifications
    if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      try {
        let changeText = "";
        if (yesterdayRate22k !== null) {
          const diff = data.rate_22k_1g - yesterdayRate22k;
          if (diff > 0) changeText = `Up by ₹${diff.toLocaleString("en-IN")}`;
          else if (diff < 0) changeText = `Down by ₹${Math.abs(diff).toLocaleString("en-IN")}`;
          else changeText = `No change today`;
        }

        const { data: subscriptions } = await supabase.from("push_subscriptions").select("*");

        if (subscriptions && subscriptions.length > 0) {
          // Fire price-drop alerts first for users who set a target rate
          const alertSubs = subscriptions.filter(
            (s) => s.target_rate !== null && s.target_rate !== undefined && data.rate_22k_1g <= s.target_rate
          );
          if (alertSubs.length > 0) {
            await Promise.allSettled(
              alertSubs.map(async (sub) => {
                try {
                  await webpush.sendNotification(
                    { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                    JSON.stringify({
                      title: `🎯 Gold Alert: ₹${data.rate_22k_1g.toLocaleString("en-IN")}/g`,
                      body: `22K gold has dropped to your target! Today's rate is ₹${data.rate_22k_1g.toLocaleString("en-IN")}/g.`,
                      url: "/",
                    })
                  );
                  // Clear the target so it doesn't re-fire tomorrow
                  await supabase.from("push_subscriptions").update({ target_rate: null }).eq("endpoint", sub.endpoint);
                } catch (error: unknown) {
                  const e = error as { statusCode?: number };
                  if (e.statusCode === 410 || e.statusCode === 404) {
                    await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
                  }
                }
              })
            );
            console.log(`[gold-cron] Fired price-drop alerts to ${alertSubs.length} users.`);
          }

          // General daily broadcast to all subscribers
          const payload = JSON.stringify({
            title: `Gold Rate: ₹${data.rate_22k_1g.toLocaleString("en-IN")}/g`,
            body: changeText || `Today's 22K gold rate has been updated.`,
            url: "/"
          });

          const pushPromises = subscriptions.map(async (sub) => {
            try {
              await webpush.sendNotification(
                {
                  endpoint: sub.endpoint,
                  keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                  }
                },
                payload
              );
            } catch (error: unknown) {
              const e = error as { statusCode?: number };
              if (e.statusCode === 410 || e.statusCode === 404) {
                await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
              } else {
                console.error("[gold-cron] Error sending push to", sub.endpoint, error);
              }
            }
          });

          await Promise.allSettled(pushPromises);
          console.log(`[gold-cron] Broadcasted push notifications to ${subscriptions.length} devices.`);
        }
      } catch (err) {
        console.error("[gold-cron] Failed during Push Notification broadcast:", err);
      }
    }

    return NextResponse.json({
      success: true,
      date: today,
      rate_18k_1g: rate18k,
      rate_22k_1g: data.rate_22k_1g,
      rate_24k_1g: data.rate_24k_1g,
      rate_silver_1g: silverRate,
      source: winner,
      stale_detection: yesterdayRate22k !== null ? { yesterday_rate: yesterdayRate22k, is_same: data.rate_22k_1g === yesterdayRate22k } : null,
      fallback_errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    console.error("Cron update-rates failed:", err instanceof Error ? err.message : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
