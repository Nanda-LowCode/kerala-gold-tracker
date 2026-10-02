import { Metadata } from "next";
import Link from "next/link";
import HuidChecker from "@/components/HuidChecker";
import SiblingCalculators from "@/components/SiblingCalculators";
import RelatedTools from "@/components/RelatedTools";

export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "HUID Check — Verify Your 6-Character Gold Hallmark Number (BIS)",
  description:
    "Check a HUID (Hallmark Unique ID) stamped on your gold jewellery. Format validator for the 6-character BIS code, what each hallmark mark means, and how to verify officially in the BIS Care app.",
  alternates: { canonical: "/tools/huid-checker" },
  openGraph: {
    title: "HUID Check — Verify Your Gold Hallmark Number",
    description:
      "Format validator for the 6-character BIS HUID, plus a guide to the four marks on hallmarked gold and how to verify officially in BIS Care.",
    url: "https://www.livegoldkerala.com/tools/huid-checker",
  },
};

const MARKS = [
  {
    key: "bis",
    label: "BIS logo",
    detail:
      "A tiny triangle — the Bureau of Indian Standards mark. If this is missing, the piece isn't BIS hallmarked at all.",
  },
  {
    key: "purity",
    label: "Purity mark",
    detail:
      "A 3-digit number: 999 (24K), 916 (22K), 750 (18K), 585 (14K) or 375 (9K). Tells you the actual gold content.",
  },
  {
    key: "huid",
    label: "HUID",
    detail:
      "A 6-character alphanumeric code, unique to this piece. Mandatory since June 2021 — any piece without one shouldn't be sold.",
  },
  {
    key: "jeweller",
    label: "Jeweller's mark",
    detail:
      "The jeweller's own identification stamp, registered with BIS. Lets a buyer trace which showroom certified the piece.",
  },
];

export default function HuidCheckerPage() {
  const toolJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "HUID Check — Gold Hallmark Verification",
    description:
      "Format validator for the 6-character BIS HUID stamped on hallmarked gold jewellery in India, with a visual guide to the four marks and a link to the official BIS Care app.",
    url: "https://www.livegoldkerala.com/tools/huid-checker",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a HUID number on gold?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "HUID stands for Hallmark Unique ID. It is a 6-character alphanumeric code (uppercase letters and digits) stamped by BIS on every hallmarked gold jewellery piece sold in India since June 2021. Each HUID is unique to one piece.",
        },
      },
      {
        "@type": "Question",
        name: "How do I verify a gold HUID?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Download the BIS Care app (Android or iOS), open Verify HUID, and enter the 6-character code stamped on the jewellery. The app returns the piece's purity, weight, jeweller details and registration date. There is no public web lookup — BIS only exposes verification through the app.",
        },
      },
      {
        "@type": "Question",
        name: "What if my hallmark number has only 4 or 5 digits?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "That is likely an older pre-June-2021 hallmark number, not a HUID. Those older codes identified the hallmarking centre, not the individual piece. If you bought the piece recently (after April 2023, when HUID was fully enforced) and it has fewer than 6 characters, be cautious — ask the jeweller for a BIS-hallmarked replacement.",
        },
      },
      {
        "@type": "Question",
        name: "Can I verify HUID without the BIS Care app?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. BIS does not publish a public web API or lookup for HUID verification. The BIS Care mobile app is the only official way. This page validates the format (6 characters, A–Z and 0–9) so you can catch obvious typos or clear fakes before you install the app.",
        },
      },
      {
        "@type": "Question",
        name: "What should I do if a HUID looks fake?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If the BIS Care app returns 'HUID not found' or 'invalid', report it to BIS through the same app (Lodge Complaint). You can also raise it with the jeweller — a genuine BIS-registered seller must either produce the matching registration or replace the piece.",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <header className="flex flex-col gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700 dark:text-amber-500">
            BIS Hallmark Verification
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            HUID Check — Verify Your Gold Hallmark Number
          </h1>
          <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
            Every BIS-hallmarked gold piece sold in India since June 2021 carries
            a unique 6-character HUID. Paste yours below to check the format —
            then verify officially in the BIS Care app.
          </p>
        </header>

        <HuidChecker />

        <SiblingCalculators exclude={["/tools/huid-checker"]} />

        {/* The four marks explainer */}
        <section className="space-y-5">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 md:text-xl">
            The four marks on hallmarked gold
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
            On a BIS-hallmarked piece, four separate marks are stamped close
            together — usually on an inner clasp or the back of a pendant.
            All four must be present. Missing or illegible marks mean the
            piece isn&apos;t properly hallmarked.
          </p>

          {/* Schematic — a clasp with four marks laid out */}
          <figure className="rounded-2xl border border-zinc-200/70 bg-gradient-to-br from-amber-50/60 to-white p-5 shadow-sm dark:border-zinc-800 dark:from-amber-950/10 dark:to-zinc-900">
            <svg
              viewBox="0 0 320 130"
              className="mx-auto h-auto w-full max-w-md"
              role="img"
              aria-label="Schematic of a hallmarked gold clasp showing the BIS triangle, purity mark, HUID, and jeweller's mark laid out in a row."
            >
              {/* Backing surface — a soft gold rectangle */}
              <rect
                x="12"
                y="38"
                width="296"
                height="54"
                rx="8"
                fill="url(#goldSheen)"
                stroke="#c7a74b"
                strokeWidth="0.75"
              />
              <defs>
                <linearGradient id="goldSheen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f6d479" />
                  <stop offset="55%" stopColor="#e9bc49" />
                  <stop offset="100%" stopColor="#d1a136" />
                </linearGradient>
              </defs>

              {/* Mark 1 — BIS triangle */}
              <polygon
                points="46,78 54,62 62,78"
                fill="#4a3418"
                opacity="0.85"
              />
              <text
                x="54"
                y="110"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui"
                textAnchor="middle"
                fill="#4a3418"
                fontWeight="700"
              >
                BIS
              </text>

              {/* Mark 2 — purity */}
              <text
                x="112"
                y="74"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
                fill="#2e1f0b"
                fontWeight="700"
                letterSpacing="1"
              >
                916
              </text>
              <text
                x="112"
                y="110"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui"
                textAnchor="middle"
                fill="#4a3418"
                fontWeight="700"
              >
                Purity
              </text>

              {/* Mark 3 — HUID */}
              <text
                x="190"
                y="74"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
                fill="#2e1f0b"
                fontWeight="700"
                letterSpacing="1"
              >
                AZ4W29
              </text>
              <text
                x="190"
                y="110"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui"
                textAnchor="middle"
                fill="#4a3418"
                fontWeight="700"
              >
                HUID
              </text>

              {/* Mark 4 — jeweller */}
              <text
                x="266"
                y="74"
                fontSize="12"
                fontFamily="ui-monospace, monospace"
                textAnchor="middle"
                fill="#2e1f0b"
                fontWeight="700"
                letterSpacing="1"
              >
                KL15
              </text>
              <text
                x="266"
                y="110"
                fontSize="8"
                fontFamily="ui-sans-serif, system-ui"
                textAnchor="middle"
                fill="#4a3418"
                fontWeight="700"
              >
                Jeweller
              </text>

              {/* Title above */}
              <text
                x="160"
                y="22"
                fontSize="9"
                fontFamily="ui-sans-serif, system-ui"
                textAnchor="middle"
                fill="#6b4a1a"
                fontWeight="600"
                letterSpacing="2"
              >
                HALLMARKED CLASP (ENLARGED)
              </text>
            </svg>
            <figcaption className="mt-3 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Schematic — the real marks sit within a few millimetres,
              typically on a clasp or ring shank.
            </figcaption>
          </figure>

          <ol className="space-y-3">
            {MARKS.map((m, i) => (
              <li
                key={m.key}
                className="flex gap-3 rounded-xl border border-zinc-200/70 bg-white p-3.5 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-black text-amber-800 ring-1 ring-amber-300/60 dark:bg-amber-900/40 dark:text-amber-200 dark:ring-amber-500/40">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {m.label}
                  </strong>{" "}
                  — {m.detail}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* What this tool does, honestly */}
        <section className="rounded-2xl border border-zinc-200/70 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-950/40">
          <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">
            What this tool checks (and what it doesn&apos;t)
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>
              <strong className="text-emerald-700 dark:text-emerald-400">
                ✓ Checks:
              </strong>{" "}
              that the HUID you entered has the correct 6-character
              alphanumeric format. Catches typos, lowercase pastes, hyphens,
              and obviously-wrong lengths.
            </li>
            <li>
              <strong className="text-rose-700 dark:text-rose-400">
                ✗ Does not check:
              </strong>{" "}
              whether that HUID matches a real registered piece in the BIS
              database. BIS doesn&apos;t publish a public lookup API — only
              the BIS Care mobile app can confirm a genuine match. If the
              format passes here, the next step is the app.
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 md:text-xl">
            Frequently asked
          </h2>
          {faqJsonLd.mainEntity.map((q) => (
            <details
              key={q.name}
              className="group rounded-xl border border-zinc-200/70 bg-white p-4 open:shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <summary className="cursor-pointer list-none text-sm font-bold text-zinc-900 marker:hidden dark:text-zinc-100">
                <span className="inline-flex items-start gap-2">
                  <span
                    aria-hidden
                    className="mt-0.5 text-amber-700 transition-transform group-open:rotate-90 dark:text-amber-500"
                  >
                    ›
                  </span>
                  <span>{q.name}</span>
                </span>
              </summary>
              <p className="mt-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {q.acceptedAnswer.text}
              </p>
            </details>
          ))}
        </section>

        <RelatedTools exclude={["/tools/huid-checker"]} />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60"
          >
            ← Today&apos;s Gold Rate
          </Link>
          <Link
            href="/tools/hallmark-gold-calculator"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          >
            Hallmark Purity Calculator →
          </Link>
          <Link
            href="/tools/gold-making-charge-calculator"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700"
          >
            Making Charge Calculator →
          </Link>
        </div>
      </main>
    </>
  );
}
