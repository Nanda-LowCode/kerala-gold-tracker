import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/next";
import InstallPrompt from "@/components/InstallPrompt";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.livegoldkerala.com"),
  manifest: "/manifest.json",
  themeColor: "#fbbf24",
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
    description: "Latest 22K and 24K gold rates in Kochi. Updated twice daily.",
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
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
          <InstallPrompt />
          <Analytics />
          {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
