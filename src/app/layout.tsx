import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://livegoldkerala.com"),
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
    url: "https://livegoldkerala.com",
    siteName: "LiveGold Kerala",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LiveGold Kerala | Verified Today's Gold Rate",
    description: "Latest 22K and 24K gold rates in Kochi. Hourly updates.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gradient-to-b from-amber-50 to-white font-sans text-gray-900">
        {children}
      </body>
    </html>
  );
}
