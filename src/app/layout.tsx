import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import InstallPrompt from "@/components/InstallPrompt";
import SiteNav from "@/components/SiteNav";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

// Next 16: themeColor belongs in the viewport export, not metadata.
export const viewport: Viewport = {
  themeColor: "#fbbf24",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://www.livegoldkerala.com"),
  manifest: "/manifest.json",
  title: {
    default: "Today's Gold Rate in Kochi, Kerala | LiveGold Kerala",
    template: "%s | LiveGold Kerala",
  },
  description:
    "Check today's 22 Karat and 24 Karat gold rate per gram and per sovereign (8g) in Kochi, Kerala. Updated daily from Malabar Gold.",
  keywords: [
    "gold rate today",
    "gold rate kochi",
    "gold rate kerala",
    "22k gold price",
    "24k gold price",
    "malabar gold rate",
    "gold price per gram",
    "sovereign price today",
  ],
  openGraph: {
    title: "LiveGold Kerala | Verified Today's Gold Rate",
    description: "Check today's 22 Karat and 24 Karat gold rate in Kochi, Kerala. Updated daily.",
    url: "https://www.livegoldkerala.com",
    siteName: "LiveGold Kerala",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiveGold Kerala | Verified Today's Gold Rate",
    description: "Latest 22K and 24K gold rates in Kochi. Updated daily at 10:15 AM IST.",
  },
  verification: {
    google: "RJTBoklRKLnaK24UcIkOxVTLH4tgXkXCjjRgCR-JDek",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-gradient-to-b from-amber-50 to-white font-sans text-gray-900 dark:from-zinc-950 dark:to-zinc-950 dark:text-zinc-200 transition-colors duration-300">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `{"@context":"https://schema.org","@graph":[{"@type":"Organization","@id":"https://www.livegoldkerala.com/#organization","name":"Live Gold Kerala","url":"https://www.livegoldkerala.com"},{"@type":"WebSite","@id":"https://www.livegoldkerala.com/#website","url":"https://www.livegoldkerala.com","name":"Live Gold Kerala","publisher":{"@id":"https://www.livegoldkerala.com/#organization"}}]}` }} />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SiteNav />
          {children}
          <InstallPrompt />
          <Analytics />
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          )}
          {/* Microsoft Clarity — behavioral analytics (heatmaps + session recordings).
              Production only. Requires clarity.ms in the CSP (see next.config.ts). */}
          {process.env.NODE_ENV === "production" && (
            <Script id="ms-clarity" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","xcc8gp87mw");`}
            </Script>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
