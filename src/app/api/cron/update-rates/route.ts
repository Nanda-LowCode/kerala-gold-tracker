import { NextRequest, NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabase";

interface MalabarRateResponse {
  "22kt": string;
  "24kt": string;
  [key: string]: unknown;
}

function parseRate(rateStr: string): number {
  // Malabar returns strings like "₹7,285" or "7285" — strip everything except digits
  return parseInt(rateStr.replace(/[^0-9]/g, ""), 10);
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
    const res = await fetch(
      "https://www.malabargoldanddiamonds.com/malabarprice/index/getrates/?country=IN&state=Kerala",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      throw new Error(`Malabar API returned ${res.status}`);
    }

    const data: MalabarRateResponse = await res.json();

    const rate22k = parseRate(data["22kt"]);
    const rate24k = parseRate(data["24kt"]);

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
        rate_22k_1g: rate22k,
        rate_24k_1g: rate24k,
        consensus_sources: 1,
      },
      { onConflict: "date,city" }
    );

    if (error) {
      throw new Error(`Supabase upsert failed: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      date: today,
      rate_22k_1g: rate22k,
      rate_24k_1g: rate24k,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Cron update-rates failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
