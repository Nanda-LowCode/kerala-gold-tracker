import { createSupabaseReadClient } from "@/lib/supabase";

export const revalidate = 86400; // daily; freshness pushed on-demand by the update-rates cron (revalidatePath)

// Self-contained, embeddable "Kerala gold rate today" widget. Served as a tiny
// standalone HTML document (no site chrome) so other sites can drop it in an
// <iframe>. Framing is allowed for this path only — see next.config.ts, which
// sets `frame-ancestors *` and omits X-Frame-Options for /embed.
//
// The shareable embed snippet (see /widget) pairs this iframe with a visible
// attribution <a> link back to livegoldkerala.com — that anchor is the backlink.

const inr = (n: number) => "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dark = url.searchParams.get("theme") === "dark";

  const supabase = createSupabaseReadClient();
  const { data } = await supabase
    .from("daily_gold_rates")
    .select("date, rate_22k_1g, rate_24k_1g")
    .eq("city", "Kochi")
    .order("date", { ascending: false })
    .limit(2);

  const today = data?.[0];
  const yesterday = data?.[1] ?? null;

  const bg = dark ? "#18181b" : "#ffffff";
  const fg = dark ? "#fafafa" : "#18181b";
  const sub = dark ? "#a1a1aa" : "#71717a";
  const border = dark ? "#3f3f46" : "#fde68a";
  const gold = dark ? "#fbbf24" : "#b45309";

  let body: string;
  if (!today) {
    body = `<div style="color:${sub};font-size:13px;padding:8px">Rate unavailable. <a href="https://www.livegoldkerala.com" target="_blank" rel="noopener" style="color:${gold}">View live →</a></div>`;
  } else {
    const change = yesterday ? today.rate_22k_1g - yesterday.rate_22k_1g : 0;
    const up = change > 0, flat = change === 0;
    const chColor = flat ? sub : up ? "#dc2626" : "#16a34a";
    const chText = flat ? "No change" : `${up ? "▲" : "▼"} ${inr(Math.abs(change))}/g`;
    const dateStr = esc(new Date(today.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }));

    body = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px">
      <div style="font-weight:700;font-size:13px;color:${fg}"><svg width="14" height="14" viewBox="0 0 64 64" style="vertical-align:-2px;margin-right:2px" aria-hidden="true"><path d="M50 20 A 24 24 0 1 0 56 32" fill="none" stroke="${gold}" stroke-width="7" stroke-linecap="round"/><rect x="34" y="29" width="22" height="7" rx="3.5" fill="${gold}"/></svg> Gold Rate Today · Kerala</div>
      <div style="font-size:11px;color:${sub}">${dateStr}</div>
    </div>
    <div style="display:flex;align-items:flex-end;gap:10px;margin-bottom:4px">
      <div style="font-size:11px;font-weight:700;color:${sub};text-transform:uppercase;letter-spacing:.04em">22K</div>
      <div style="font-size:26px;font-weight:800;line-height:1;color:${gold}">${inr(today.rate_22k_1g)}<span style="font-size:12px;font-weight:600;color:${sub}">/g</span></div>
      <div style="font-size:12px;font-weight:700;color:${chColor};padding-bottom:2px">${chText}</div>
    </div>
    <div style="font-size:12px;color:${sub};margin-bottom:10px">${inr(today.rate_22k_1g * 8)} per pavan &nbsp;·&nbsp; 24K ${inr(today.rate_24k_1g)}/g</div>
    <a href="https://www.livegoldkerala.com" target="_blank" rel="noopener" style="display:block;text-align:center;font-size:11px;font-weight:600;color:${gold};text-decoration:none;border-top:1px solid ${border};padding-top:8px">Live AKGSMA board rate · livegoldkerala.com →</a>`;
  }

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Kerala Gold Rate Today</title></head>
<body style="margin:0;background:transparent">
  <div style="box-sizing:border-box;max-width:340px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:${bg};border:1px solid ${border};border-radius:14px;padding:14px 16px;box-shadow:0 1px 3px rgba(0,0,0,.06)">
    ${body}
  </div>
</body></html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=1800, s-maxage=3600",
    },
  });
}
