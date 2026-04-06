import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createSupabaseClient } from "@/lib/supabase";

interface MalabarRateResponse {
  "22kt": string;
  "24kt": string;
}

function parseRate(rateStr: string): number {
  // Malabar returns strings like "13,835.00 INR" — extract the number before decimals
  const match = rateStr.replace(/,/g, "").match(/(\d+)/);
  if (!match) throw new Error(`Cannot parse rate: ${rateStr}`);
  return parseInt(match[1], 10);
}

function getTodayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this header for cron jobs)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch rates from Malabar Gold
    // Step 1: Initial request to get session cookie (returns 302)
    const MALABAR_URL =
      "https://www.malabargoldanddiamonds.com/malabarprice/index/getrates/?country=IN&state=Kerala";

    const initialRes = await fetch(MALABAR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
      },
      redirect: "manual",
      cache: "no-store",
    });

    // Extract cookies from the redirect response
    const cookies = initialRes.headers.getSetCookie?.().join("; ") ?? "";

    // Step 2: Follow up with the cookie to get actual data
    const res = await fetch(MALABAR_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        Cookie: cookies,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Malabar API returned ${res.status}`);
    }

    const data: MalabarRateResponse = await res.json();

    const rate22k = parseRate(data["22kt"]);
    const rate24k = parseRate(data["24kt"]);
    // 18K = 75% purity (18/24 of 24K) — Malabar doesn't provide 18kt directly
    const rate18k = Math.round(rate24k * (18 / 24));

    if (isNaN(rate22k) || isNaN(rate24k)) {
      throw new Error(`Failed to parse rates: 22k="${data["22kt"]}", 24k="${data["24kt"]}"`);
    }

    // Upsert into Supabase (won't duplicate if cron runs twice)
    const supabase = createSupabaseClient();
    const today = getTodayIST();

    const { error } = await supabase.from("daily_gold_rates").upsert(
      {
        date: today,
        city: "Kochi",
        rate_18k_1g: rate18k,
        rate_22k_1g: rate22k,
        rate_24k_1g: rate24k,
        consensus_sources: 1,
      },
      { onConflict: "date,city" }
    );

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    // Clear the Next.js frontend cache to display new rates instantly
    revalidatePath("/");

    return NextResponse.json({
      success: true,
      date: today,
      rate_18k_1g: rate18k,
      rate_22k_1g: rate22k,
      rate_24k_1g: rate24k,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Cron update-rates failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
