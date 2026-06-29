import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 5) return true;
  entry.count++;
  return false;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const { email, targetRate } = await request.json();

    if (typeof email !== "string" || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    if (typeof targetRate !== "number" || targetRate < 1000 || targetRate > 200000) {
      return NextResponse.json({ error: "Enter a sensible target rate." }, { status: 400 });
    }

    const supabase = createSupabaseAdminClient();
    // One active alert per email — re-submitting updates the target.
    const { error } = await supabase
      .from("email_alerts")
      .upsert({ email: email.toLowerCase().trim(), target_rate: targetRate }, { onConflict: "email" });

    if (error) {
      console.error("[email-alert] Supabase error:", error.message);
      return NextResponse.json({ error: "Could not save your alert. Try again." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[email-alert] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
