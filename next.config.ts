import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://va.vercel-scripts.com https://*.clarity.ms",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.clarity.ms https://c.bing.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com https://vitals.vercel-insights.com https://cdn.jsdelivr.net https://*.clarity.ms https://c.bing.com",
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
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
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
