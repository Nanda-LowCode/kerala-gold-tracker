import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import * as cheerio from "cheerio";
import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase";

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

// ─── Waterfall ───────────────────────────────────────────────────────────────

const FETCHERS: { name: string; fn: FetcherFn }[] = [
  { name: "Malabar Gold", fn: fetchMalabar },
  { name: "BankBazaar", fn: fetchBankBazaar },
];

async function fetchWithFallbacks(): Promise<{ data: GoldRateResult | null; errors: string[] }> {
  const errors: string[] = [];

  for (const { name, fn } of FETCHERS) {
    try {
      console.log(`[gold-cron] Trying source: ${name}...`);
      const data = await fn();
      console.log(`[gold-cron] Success from ${name}: 22K=${data.rate_22k_1g}, 24K=${data.rate_24k_1g}`);
      return { data, errors };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const warning = `[gold-cron] ${name} failed: ${message}`;
      console.warn(warning);
      errors.push(warning);
    }
  }

  return { data: null, errors };
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
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, errors } = await fetchWithFallbacks();

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

    // Upsert into Supabase
    const supabase = createSupabaseAdminClient();
    const today = getTodayIST();

    const { error } = await supabase.from("daily_gold_rates").upsert(
      {
        date: today,
        city: "Kochi",
        rate_18k_1g: rate18k,
        rate_22k_1g: data.rate_22k_1g,
        rate_24k_1g: data.rate_24k_1g,
        consensus_sources: 1,
      },
      { onConflict: "date,city" }
    );

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    // Clear Next.js cache for all pages
    revalidatePath("/");
    const cities = ["trivandrum", "kozhikode", "thrissur", "kollam", "palakkad", "kannur", "alappuzha", "kottayam", "malappuram"];
    for (const city of cities) {
      revalidatePath(`/${city}`);
    }

    return NextResponse.json({
      success: true,
      date: today,
      rate_18k_1g: rate18k,
      rate_22k_1g: data.rate_22k_1g,
      rate_24k_1g: data.rate_24k_1g,
      source: data.source,
      fallback_errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Cron update-rates failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
