import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Bot / scraper blocking (deterministic, stateless — the only kind that's
// reliable in proxy; per Next docs proxy must not rely on in-memory/global
// state). This does NOT rate-limit; that's enforced at the edge by Vercel's
// WAF (see docs/anti-scraping.md). User-agents are trivially spoofable, so this
// is a speed bump that stops lazy scrapers and competitor-intel crawlers, not a
// wall. The real protections are the WAF rate limit and no longer exposing a
// one-shot bulk CSV.
//
// We deliberately do NOT block search-engine or social-preview crawlers —
// Googlebot/Bingbot are our SEO, and WhatsApp/Twitter/Facebook/Slack power link
// previews. The blocklist is specific tokens only; nothing matches "Googlebot".
// ---------------------------------------------------------------------------
const BLOCKED_UA = [
  // Competitor-intelligence / SEO crawlers
  "ahrefsbot", "semrushbot", "mj12bot", "dotbot", "dataforseo", "rogerbot",
  "blexbot", "barkrowler", "megaindex", "serpstatbot", "zoominfobot",
  "petalbot", "seokicks", "sistrix", "linkdexbot", "spbot",
  // AI training / answer-engine scrapers
  "gptbot", "ccbot", "claudebot", "claude-web", "anthropic-ai",
  "google-extended", "bytespider", "amazonbot", "perplexitybot", "cohere-ai",
  "diffbot", "omgili", "imagesiftbot", "friendlycrawler", "ai2bot",
  "applebot-extended",
  // Generic HTTP libraries & scraping frameworks
  "python-requests", "python-urllib", "scrapy", "go-http-client", "okhttp",
  "libwww-perl", "httpclient", "aiohttp", "node-fetch", "axios/",
  "guzzlehttp", "mechanize", "phantomjs", "wget", "curl/",
];

// Maps Vercel's x-vercel-ip-city values → our city slug
// Vercel returns the English city name from MaxMind GeoIP
const CITY_MAP: Record<string, string> = {
  thiruvananthapuram: "trivandrum",
  trivandrum: "trivandrum",
  ernakulam: "ernakulam",
  kochi: "ernakulam",
  cochin: "ernakulam",
  kozhikode: "kozhikode",
  calicut: "kozhikode",
  thrissur: "thrissur",
  trichur: "thrissur",
  kollam: "kollam",
  quilon: "kollam",
  palakkad: "palakkad",
  palghat: "palakkad",
  kannur: "kannur",
  cannanore: "kannur",
  alappuzha: "alappuzha",
  alleppey: "alappuzha",
  kottayam: "kottayam",
  malappuram: "malappuram",
  pathanamthitta: "pathanamthitta",
  idukki: "idukki",
  wayanad: "wayanad",
  kalpetta: "wayanad",
  kasaragod: "kasaragod",
};

export function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const uaLower = ua.toLowerCase();

  // 1) Block scrapers / competitor-intel / AI crawlers on every content page.
  //    Empty UA on a content page is almost always a script, not a browser.
  if (uaLower === "" || BLOCKED_UA.some((bad) => uaLower.includes(bad))) {
    return new NextResponse("Forbidden", {
      status: 403,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
  }

  const { pathname } = request.nextUrl;

  // 2) Geo-redirect — homepage only.
  if (pathname !== "/") return NextResponse.next();

  // Let crawlers see the canonical homepage content — don't geo-redirect bots
  if (/googlebot|bingbot|slurp|duckduckbot|baiduspider|yandex|facebookexternalhit/i.test(ua)) {
    return NextResponse.next();
  }

  const rawCity = request.headers.get("x-vercel-ip-city");
  if (!rawCity) return NextResponse.next();

  const slug = CITY_MAP[decodeURIComponent(rawCity).toLowerCase().trim()];
  if (!slug) return NextResponse.next();

  // 307 not 301 — location changes per visitor, must not be browser-cached
  return NextResponse.redirect(new URL(`/${slug}`, request.url), { status: 307 });
}

export const config = {
  // Content pages only. Exclude api (cron, IndexNow, OG image fetched by social
  // crawlers), framework assets, and metadata files (search engines fetch them).
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
