import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | LiveGold Kerala",
  description: "Privacy policy for LiveGold Kerala — how we collect, use, and protect your data.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 dark:text-amber-400">
        ← Back to Gold Rates
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Privacy Policy</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Last updated: 22 April 2026</p>

      <div className="prose prose-zinc dark:prose-invert mt-8 max-w-none text-sm leading-relaxed">
        <h2>What we collect</h2>
        <p>
          LiveGold Kerala collects minimal data. When you enable push notifications, we store a
          browser subscription token to deliver price alerts. When you use the price-alert feature,
          we store your target price alongside the subscription token. We do not collect names,
          email addresses, or payment information.
        </p>

        <h2>Analytics</h2>
        <p>
          We use Google Analytics 4 to understand aggregate site usage (page views, session
          duration, city page popularity). This data is anonymised and not linked to any individual.
          You can opt out via your browser&apos;s privacy settings or a GA opt-out extension.
        </p>

        <h2>Cookies</h2>
        <p>
          We use a single functional cookie to remember your dark/light theme preference. No
          third-party advertising cookies are set.
        </p>

        <h2>Data storage</h2>
        <p>
          Push-notification subscription tokens are stored in Supabase (EU region). Gold rate data
          is fetched from public sources and is not personally identifiable.
        </p>

        <h2>Third-party services</h2>
        <ul>
          <li>Google Analytics — aggregate usage analytics</li>
          <li>Vercel — hosting and edge delivery</li>
          <li>Supabase — database for gold rates and push subscriptions</li>
        </ul>

        <h2>Your rights</h2>
        <p>
          To delete your push notification subscription, simply disable notifications in your
          browser settings. To request deletion of any stored data, contact us at the address
          below.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Reach us at{" "}
          <Link href="/contact" className="text-amber-700 underline dark:text-amber-400">
            our contact page
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
