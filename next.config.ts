import type { NextConfig } from "next";

// AdSense domains — needed for the pagead loader to inject ad iframes and
// their creative assets. Keep these grouped so a future removal is one hunk.
const ADSENSE_SCRIPT = "https://pagead2.googlesyndication.com https://*.googlesyndication.com https://partner.googleadservices.com https://adservice.google.com https://*.adtrafficquality.google";
const ADSENSE_IMG = "https://*.googlesyndication.com https://*.doubleclick.net https://*.g.doubleclick.net https://*.google.com https://*.adtrafficquality.google";
const ADSENSE_FRAME = "https://googleads.g.doubleclick.net https://*.googlesyndication.com https://*.google.com https://*.doubleclick.net https://*.adtrafficquality.google";
const ADSENSE_CONNECT = "https://pagead2.googlesyndication.com https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.adtrafficquality.google";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://va.vercel-scripts.com https://*.clarity.ms ${ADSENSE_SCRIPT}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://*.clarity.ms https://c.bing.com ${ADSENSE_IMG}`,
  "font-src 'self'",
  `connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com https://cdn.jsdelivr.net https://*.clarity.ms https://c.bing.com https://api.gold-api.com ${ADSENSE_CONNECT}`,
  `frame-src ${ADSENSE_FRAME}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "livegoldkerala.com" }],
        destination: "https://www.livegoldkerala.com/:path*",
        permanent: true,
      },
      // Consolidate cannibalising city "today's rate" blog posts into the
      // canonical city pages (which carry the live daily rate). Keeps ranking
      // signal on one URL per city instead of splitting it across two.
      { source: "/blog/gold-rate-kozhikode-today", destination: "/kozhikode", permanent: true },
      { source: "/blog/gold-rate-thrissur-today", destination: "/thrissur", permanent: true },
      { source: "/blog/gold-rate-trivandrum-today", destination: "/trivandrum", permanent: true },
      // Calicut is the old name for Kozhikode — one city, so collapse the two
      // near-duplicate pages into /kozhikode to stop them splitting ranking
      // signal. /kozhikode names "Calicut" in its content, so it still serves
      // "gold rate today calicut" searches.
      { source: "/calicut", destination: "/kozhikode", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        // The embeddable rate widget — must be framable on third-party sites,
        // so it gets a permissive frame-ancestors and NO X-Frame-Options.
        source: "/embed",
        headers: [
          { key: "Content-Security-Policy", value: CSP.replace("frame-ancestors 'none'", "frame-ancestors *") },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // Everything else keeps the strict policy (no framing at all).
        source: "/((?!embed$).*)",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;
