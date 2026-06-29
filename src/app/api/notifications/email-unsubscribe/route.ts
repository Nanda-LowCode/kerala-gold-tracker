import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase";

// One-click unsubscribe for email price alerts. Linked from every alert email.
export async function GET(request: NextRequest) {
  const token = new URL(request.url).searchParams.get("token");

  const page = (msg: string) =>
    new Response(
      `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Email alerts · LiveGold Kerala</title></head>
<body style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#fffbeb;color:#18181b;display:flex;min-height:100vh;align-items:center;justify-content:center">
  <div style="max-width:420px;text-align:center;padding:32px">
    <div style="font-size:32px">✨</div>
    <p style="font-size:16px;font-weight:600;margin:12px 0 6px">${msg}</p>
    <p style="font-size:13px;color:#71717a;margin:0 0 18px">LiveGold Kerala price alerts</p>
    <a href="https://www.livegoldkerala.com" style="font-size:13px;font-weight:600;color:#b45309">Back to today's gold rate →</a>
  </div>
</body></html>`,
      { headers: { "Content-Type": "text/html; charset=utf-8" } }
    );

  if (!token) return page("Invalid unsubscribe link.");

  try {
    const supabase = createSupabaseAdminClient();
    await supabase.from("email_alerts").delete().eq("token", token);
    return page("You've been unsubscribed from price alerts.");
  } catch {
    return page("Something went wrong — please try again.");
  }
}
