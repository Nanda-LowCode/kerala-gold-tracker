import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | LiveGold Kerala",
  description: "Get in touch with the LiveGold Kerala team.",
  alternates: { canonical: "/contact" },
  robots: { index: true, follow: true },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-1.5 text-sm text-amber-700 hover:text-amber-900 dark:text-amber-400">
        ← Back to Gold Rates
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Contact Us</h1>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
        We&apos;d love to hear from you — rate corrections, feedback, partnership enquiries, or
        anything else.
      </p>

      <div className="mt-8 rounded-2xl border border-amber-200/50 bg-amber-50/40 p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">Email</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Reach us at{" "}
          <a
            href="mailto:nanda1994dec@gmail.com"
            className="font-medium text-amber-700 underline dark:text-amber-400"
          >
            nanda1994dec@gmail.com
          </a>
          . We aim to respond within 24 hours on weekdays.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200/50 bg-zinc-50/40 p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">Rate corrections</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          If you spot an incorrect gold rate, please email us with the correct rate and your
          source. We verify and update within the hour during business days.
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-zinc-200/50 bg-zinc-50/40 p-6 dark:border-zinc-700 dark:bg-zinc-900">
        <h2 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">Embed our widget</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Jewellers can embed a free auto-updating Kerala gold rate widget on their website.
          Contact us for the embed code — it takes under 30 seconds to install.
        </p>
      </div>
    </main>
  );
}
