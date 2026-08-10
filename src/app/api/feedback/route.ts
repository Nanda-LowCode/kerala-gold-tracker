import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

// Simple per-IP rate limit (same pattern as the notification routes).
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  if (entry.count >= 4) return true;
  entry.count++;
  return false;
}

const ALLOWED_TYPES = new Set(["suggestion", "bug", "other"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many submissions. Please try again in a minute." }, { status: 429 });
  }

  try {
    const body = await request.json();

    // Honeypot — real users never fill this hidden field; bots do.
    if (typeof body.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true }); // silently accept + drop
    }

    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (message.length < 4 || message.length > 2000) {
      return NextResponse.json({ error: "Please enter between 4 and 2000 characters." }, { status: 400 });
    }

    const type = ALLOWED_TYPES.has(body.type) ? body.type : "suggestion";
    const emailRaw = typeof body.email === "string" ? body.email.trim() : "";
    const email = emailRaw && EMAIL_RE.test(emailRaw) && emailRaw.length <= 254 ? emailRaw.toLowerCase() : null;
    const page = typeof body.page === "string" ? body.page.slice(0, 300) : null;
    const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? null;

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase
      .from("feedback")
      .insert({ message, type, email, page, user_agent: userAgent });

    if (error) {
      console.error("[feedback] Supabase error:", error.message);
      return NextResponse.json({ error: "Could not save your feedback. Please try again." }, { status: 500 });
    }

    // Best-effort email ping to the owner so feedback isn't missed (optional).
    const resendKey = process.env.RESEND_API_KEY;
    const to = process.env.ALERT_EMAIL;
    if (resendKey && to) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "LiveGold Kerala <feedback@livegoldkerala.com>",
            to,
            subject: `New ${type} from a visitor`,
            text: `${message}\n\n— type: ${type}\n— from: ${email ?? "anonymous"}\n— page: ${page ?? "unknown"}`,
          }),
        });
      } catch {
        /* notification is best-effort; the row is already saved */
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
