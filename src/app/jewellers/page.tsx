import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gold Making Charges by Jeweller in Kerala (2026) — Compare Before You Buy",
  description:
    "Compare Kerala's major gold jewellers — Malabar, Kalyan, Joyalukkas, Bhima and more — on heritage, hallmarking and making-charge approach, plus the typical making-charge ranges by design so you know what to expect.",
  alternates: { canonical: "/jewellers" },
};

interface Jeweller {
  name: string;
  origin: string;
  knownFor: string;
}

// Factual basics only (origin/heritage/positioning). We deliberately do NOT
// publish a precise making-charge % per brand — those vary by design, store and
// season, so a fixed number would be misleading. The honest, useful guidance is
// the design-based ranges below + "always ask for the exact charge on your piece".
const JEWELLERS: Jeweller[] = [
  {
    name: "Malabar Gold & Diamonds",
    origin: "Kozhikode (Calicut), 1993",
    knownFor: "India's largest chain; transparent pricing and frequent making-charge offers.",
  },
  {
    name: "Kalyan Jewellers",
    origin: "Thrissur, 1993",
    knownFor: "Large national network; wide design range and festival schemes.",
  },
  {
    name: "Joyalukkas",
    origin: "Thrissur, 1987",
    knownFor: "Strong bridal collections and a big Gulf-NRI presence.",
  },
  {
    name: "Bhima Jewellers",
    origin: "Thiruvananthapuram, since 1925",
    knownFor: "Heritage Kerala jeweller; traditional Travancore designs.",
  },
  {
    name: "Jos Alukkas",
    origin: "Thrissur",
    knownFor: "Large showrooms across Kerala; broad everyday and bridal range.",
  },
  {
    name: "Josco Jewellers",
    origin: "Thrissur",
    knownFor: "Established Kerala network; mid-market and bridal focus.",
  },
  {
    name: "Chemmanur International",
    origin: "Kozhikode, heritage house",
    knownFor: "Long-standing Malabar jeweller; classic North-Kerala craftsmanship.",
  },
];

interface ChargeBand {
  type: string;
  range: string;
  note: string;
}

// Widely-cited Kerala making-charge ranges by design type — guidance, not quotes.
const CHARGE_BANDS: ChargeBand[] = [
  { type: "Machine-made / lightweight chains", range: "~3–8%", note: "Lowest making charge; mass-produced designs." },
  { type: "Standard 22K ornaments", range: "~8–15%", note: "Everyday bangles, rings, chains." },
  { type: "Handmade / antique / temple jewellery", range: "~15–25%+", note: "Intricate, labour-heavy work costs the most to make." },
  { type: "Diamond / stone-studded", range: "Varies + stone cost", note: "Making charge plus separate stone pricing — read the bill carefully." },
];

const FAQS = [
  {
    q: "Which jeweller has the lowest making charges in Kerala?",
    a: "There's no single answer — making charges depend more on the design you choose than the brand. The same shop can charge 5% on a machine-made chain and 20% on a handmade antique piece. Always ask for the exact making charge on your specific item and compare it across two or three showrooms before buying.",
  },
  {
    q: "Is the gold rate different between jewellers in Kerala?",
    a: "No. The metal rate is the uniform Kerala board rate set by the AKGSMA, so it's the same at Malabar, Kalyan, Joyalukkas or any local jeweller. The difference between shops is the making charge, wastage, and any festival offer — not the gold rate.",
  },
  {
    q: "Do all these jewellers sell BIS-hallmarked gold?",
    a: "Yes. BIS hallmarking with a 6-digit HUID is mandatory across India, so every reputable Kerala jeweller sells hallmarked 916 (22K) gold. Always check for the BIS mark and HUID on each piece regardless of the brand.",
  },
  {
    q: "How can I reduce what I pay above the gold rate?",
    a: "Negotiate the making charge (it's the most flexible cost), prefer lighter or machine-made designs, buy during festival making-charge waivers, and always take a proper GST invoice. Use our making charge calculator to see the full cost before you visit a showroom.",
  },
];

export default function JewellersPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.livegoldkerala.com" },
      { "@type": "ListItem", position: 2, name: "Kerala Jewellers & Making Charges", item: "https://www.livegoldkerala.com/jewellers" },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:gap-10 md:py-12">
        <header className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-500">
            For Kerala buyers
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-4xl">
            Gold Making Charges by{" "}
            <span className="bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-transparent dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500">
              Jeweller in Kerala
            </span>
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
            The gold rate is the same at every showroom (it&apos;s the{" "}
            <Link href="/" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
              uniform Kerala board rate
            </Link>
            ). What changes between jewellers is the <strong>making charge</strong> — so that&apos;s
            what to compare. Here&apos;s who the major Kerala jewellers are and what to expect.
          </p>
        </header>

        {/* Jeweller table */}
        <section className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-md shadow-amber-100/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left dark:border-zinc-800 dark:bg-zinc-800/40">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Jeweller</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Origin</th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Known for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {JEWELLERS.map((j) => (
                  <tr key={j.name}>
                    <td className="px-4 py-3 font-semibold text-zinc-900 dark:text-zinc-100">{j.name}</td>
                    <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400">{j.origin}</td>
                    <td className="px-4 py-3 text-zinc-600 dark:text-zinc-300">{j.knownFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-zinc-100 px-4 py-3 text-[11px] text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            All major Kerala jewellers sell BIS-hallmarked 916 gold. We don&apos;t list a fixed
            making-charge % per brand — it varies by design, store and season, so a single number
            would mislead. Compare the actual quote on <em>your</em> piece.
          </p>
        </section>

        {/* Making charge ranges */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            What making charges to expect (by design)
          </h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/60 text-left dark:border-zinc-800 dark:bg-zinc-800/40">
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Design type</th>
                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Typical making charge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {CHARGE_BANDS.map((b) => (
                    <tr key={b.type}>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-zinc-800 dark:text-zinc-200">{b.type}</span>
                        <span className="block text-xs text-zinc-500 dark:text-zinc-400">{b.note}</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-amber-700 dark:text-amber-400">{b.range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Indicative ranges for Kerala; actual charges vary. Remember to add <strong>3% GST</strong> on
            the total. Learn more in our{" "}
            <Link href="/blog/gold-making-charges-explained-kerala" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
              making charges guide
            </Link>{" "}
            and{" "}
            <Link href="/blog/gold-tax-gst-kerala-2026" className="font-semibold text-amber-700 hover:underline dark:text-amber-400">
              gold tax &amp; GST guide
            </Link>
            .
          </p>
        </section>

        {/* CTA to calculator */}
        <section className="rounded-2xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-white p-5 shadow-md shadow-amber-200/40 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-zinc-900 dark:shadow-none md:p-6">
          <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
            Before you visit a showroom, work out the real total — gold value + making charge + GST —
            with our{" "}
            <Link href="/tools/gold-making-charge-calculator" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500">
              Making Charge Calculator
            </Link>
            , using today&apos;s verified{" "}
            <Link href="/" className="font-semibold text-amber-700 underline decoration-amber-300/60 underline-offset-2 hover:text-amber-900 hover:decoration-amber-500">
              Kerala board rate
            </Link>
            .
          </p>
        </section>

        {/* FAQ */}
        <section className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-4 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Frequently Asked Questions
          </h2>
          <dl className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
            {FAQS.map((f) => (
              <div key={f.q} className="py-4 first:pt-0 last:pb-0">
                <dt className="text-sm font-semibold text-zinc-900 dark:text-zinc-200">{f.q}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </main>
    </>
  );
}
