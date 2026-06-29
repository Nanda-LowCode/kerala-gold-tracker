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
  rate_18k_1g?: number;
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
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        "Cache-Control": "max-age=0",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        Connection: "keep-alive",
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

// ─── Fetcher: BankBazaar Silver ──────────────────────────────────────────────

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

// ─── Fetcher #1: BankBazaar ──────────────────────────────────────────────────

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

// ─── Fetcher #2: AKGSMA (All Kerala Gold & Silver Merchants Association — official board rate) ──

const fetchAKGSMA: FetcherFn = async () => {
  const html = await fetchHtml("https://akgsma.com/");
  const text = cheerio.load(html).text();

  // Page format: "22K916 (1gm) - ₹ 14320"
  const m22 = text.match(/22[Kk]\S*\s*\(1\s*gm\)\s*-\s*₹\s*([\d,]+)/i);
  if (!m22) throw new Error("AKGSMA: 22K rate not found in page");

  const rate22k = parsePrice(m22[1]);
  // AKGSMA does not publish 24K; derive from 22K via purity ratio
  const rate24k = Math.round(rate22k * (24 / 22));

  // Extract 18K directly — AKGSMA publishes it officially
  const m18 = text.match(/18[Kk]\S*\s*\(1\s*gm\)\s*-\s*₹\s*([\d,]+)/i);
  const rate18k = m18 ? parsePrice(m18[1]) : undefined;

  const result: GoldRateResult = { rate_22k_1g: rate22k, rate_24k_1g: rate24k, rate_18k_1g: rate18k, source: "akgsma" };
  validateRates(result);
  return result;
};

// ─── Fetcher #3: IBJA (India Bullion & Jewellers Association — wholesale benchmark) ──

const fetchIBJA: FetcherFn = async () => {
  const html = await fetchHtml("https://ibjarates.com/");
  const $ = cheerio.load(html);

  const raw916 = $("#GoldRatesCompare916").text().trim();
  const raw999 = $("#GoldRatesCompare999").text().trim();

  if (!raw916 || !raw999) throw new Error("IBJA: rate spans not found in page");

  const wholesale22k = parseFloat(raw916.replace(/,/g, ""));
  const wholesale24k = parseFloat(raw999.replace(/,/g, ""));

  if (isNaN(wholesale22k) || isNaN(wholesale24k)) {
    throw new Error(`IBJA: could not parse rates (916=${raw916}, 999=${raw999})`);
  }

  // IBJA wholesale ≈ Kerala retail (verified June 2026: markup is ~0%).
  // No markup applied — use IBJA rate directly as fallback approximation.
  const rate22k = Math.round(wholesale22k);
  const rate24k = Math.round(wholesale24k);

  const result: GoldRateResult = { rate_22k_1g: rate22k, rate_24k_1g: rate24k, source: "ibja" };
  validateRates(result);
  return result;
};

// ─── Parallel fetch with stale detection ─────────────────────────────────────

const FETCHERS: { name: string; fn: FetcherFn }[] = [
  { name: "AKGSMA", fn: fetchAKGSMA },
  { name: "BankBazaar", fn: fetchBankBazaar },
  { name: "IBJA", fn: fetchIBJA },
];

// AKGSMA is the official Kerala board — always preferred.
// BankBazaar mirrors AKGSMA and is the first fallback.
// IBJA (wholesale, no markup) is the last resort.
function getPreferredSource(): string {
  return "AKGSMA";
}

// Priority order when the preferred source is unavailable
const SOURCE_PRIORITY = ["AKGSMA", "BankBazaar", "IBJA"];

async function fetchWithConsensus(
  yesterdayRate22k: number | null
): Promise<{ data: GoldRateResult | null; errors: string[]; winner: string }> {
  const preferred = getPreferredSource();
  console.log(`[gold-cron] Preferred source at this hour: ${preferred}. Fetching all in parallel...`);

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
      // Among fresh sources, pick the time-appropriate preferred one
      const chosen = fresh.find((s) => s.name === preferred) ?? fresh[0];
      console.log(`[gold-cron] Winner: ${chosen.name} (fresh, stale sources skipped)`);
      return { data: chosen.data, errors, winner: chosen.name };
    }

    if (stale.length === successful.length) {
      console.log(
        `[gold-cron] All sources match yesterday (₹${yesterdayRate22k}) — genuine no-change or all still stale`
      );
      // Alert when any source failed — with only 2 sources we can't confirm genuine no-change
      if (errors.length > 0) {
        sendStaleAlert(yesterdayRate22k, errors).catch(() => {});
      }
    }
  }

  // No stale conflict: pick by priority order (preferred first, then fallback chain)
  const chosen =
    successful.find((s) => s.name === preferred) ??
    SOURCE_PRIORITY.map((name) => successful.find((s) => s.name === name)).find(Boolean) ??
    successful[0];
  console.log(`[gold-cron] Winner: ${chosen.name}`);
  return { data: chosen.data, errors, winner: chosen.name };
}

// ─── Alerting ────────────────────────────────────────────────────────────────

async function sendStaleAlert(rate22k: number, errors: string[]): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.ALERT_EMAIL;
  if (!apiKey || !alertEmail) return;

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: "LiveGold Alerts <onboarding@resend.dev>",
      to: alertEmail,
      subject: `[LiveGold] ⚠️ Rate may be stale — verify manually`,
      text: [
        `The gold rate cron ran at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST.`,
        ``,
        `Written rate: ₹${rate22k}/g (22K) — same as yesterday.`,
        ``,
        `Some sources failed, so we can't tell if this is a genuine no-change or stale data.`,
        `Please verify at https://www.malabargoldanddiamonds.com or https://ibjarates.com and update Supabase if needed.`,
        ``,
        `After updating Supabase, flush the cache:`,
        `curl -H "Authorization: Bearer ${process.env.CRON_SECRET}" https://www.livegoldkerala.com/api/revalidate`,
        ``,
        `Failed sources:`,
        ...errors,
      ].join("\n"),
    });
    console.log("[gold-cron] Stale alert email sent");
  } catch (err) {
    console.error("[gold-cron] Failed to send stale alert email:", err);
  }
}

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

    // 18K: use AKGSMA's official rate if available (extracted in the AKGSMA fetcher), else derive
    const rate18k = data.rate_18k_1g ?? Math.round(data.rate_24k_1g * (18 / 24));

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
    // News hub + today's daily update
    revalidatePath("/news");
    revalidatePath(`/news/${today}`);
    // Rate-history pages that show today's data
    revalidatePath("/gold-rate-history");
    revalidatePath("/gold-rate-yesterday-kerala");
    revalidatePath("/silver-rate-kerala");

    // Ping IndexNow so Bing/Yandex reindex immediately
    if (process.env.INDEXNOW_KEY) {
      const key = process.env.INDEXNOW_KEY;
      const base = "https://www.livegoldkerala.com";
      const urlList = [
        base,
        ...cities.map((c) => `${base}/${c}`),
        `${base}/news`,
        `${base}/news/${today}`,
      ];
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

    // Email price alerts — notify users whose target is at or above today's 22K rate.
    if (process.env.RESEND_API_KEY) {
      try {
        const { data: emailAlerts } = await supabase
          .from("email_alerts")
          .select("email, target_rate, token")
          .gte("target_rate", data.rate_22k_1g);

        if (emailAlerts && emailAlerts.length > 0) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const rateStr = data.rate_22k_1g.toLocaleString("en-IN");
          const pavanStr = (data.rate_22k_1g * 8).toLocaleString("en-IN");

          await Promise.allSettled(
            emailAlerts.map((a: { email: string; target_rate: number; token: string }) => {
              const unsub = `https://www.livegoldkerala.com/api/notifications/email-unsubscribe?token=${a.token}`;
              return resend.emails.send({
                from: "LiveGold Kerala <onboarding@resend.dev>",
                to: a.email,
                subject: `🎯 Gold alert: 22K is ₹${rateStr}/g in Kerala`,
                html: `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:480px;color:#18181b">
  <p>Good news — <strong>22K gold has reached your target of ₹${Number(a.target_rate).toLocaleString("en-IN")}/g</strong>.</p>
  <p>Today's Kerala board rate is <strong>₹${rateStr}/g</strong> (₹${pavanStr} per pavan).</p>
  <p><a href="https://www.livegoldkerala.com" style="color:#b45309;font-weight:600;text-decoration:none">See the live rate →</a></p>
  <hr style="border:none;border-top:1px solid #eee;margin:16px 0">
  <p style="font-size:12px;color:#999">You set this one-time alert at livegoldkerala.com. <a href="${unsub}" style="color:#999">Unsubscribe</a>.</p>
</div>`,
              });
            })
          );

          // One-shot: remove fired alerts so they don't repeat the next day.
          await supabase.from("email_alerts").delete().gte("target_rate", data.rate_22k_1g);
          console.log(`[gold-cron] Sent ${emailAlerts.length} email price alerts.`);
        }
      } catch (err) {
        console.error("[gold-cron] Email alert send failed:", err);
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
