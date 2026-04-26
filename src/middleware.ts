import { NextRequest, NextResponse } from "next/server";

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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept the homepage
  if (pathname !== "/") return NextResponse.next();

  const rawCity = request.headers.get("x-vercel-ip-city");
  if (!rawCity) return NextResponse.next();

  const slug = CITY_MAP[decodeURIComponent(rawCity).toLowerCase().trim()];
  if (!slug) return NextResponse.next();

  // 307 not 301 — location changes per visitor, must not be browser-cached
  return NextResponse.redirect(new URL(`/${slug}`, request.url), { status: 307 });
}

export const config = {
  matcher: "/",
};
