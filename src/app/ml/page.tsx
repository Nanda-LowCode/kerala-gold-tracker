import { Metadata } from "next";
import Link from "next/link";
import { getHistory } from "@/app/page";

export const revalidate = 3600;

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

// Malayalam version of the core "today's gold rate" page — targets
// "സ്വർണ്ണ വില" (gold price) searches, which GSC shows we get impressions for.
// One well-built page with hreflang, rather than a half-translated site.

export async function generateMetadata(): Promise<Metadata> {
  const history = await getHistory();
  const today = history[0] ?? null;

  const languages = { "en-IN": "/", "ml-IN": "/ml", "x-default": "/" };

  if (!today) {
    return {
      title: "ഇന്നത്തെ സ്വർണ്ണ വില കേരളം — 22K & 24K | LiveGold Kerala",
      description:
        "ഇന്നത്തെ കേരള സ്വർണ്ണ വില: 22 കാരറ്റ് (916), 24 കാരറ്റ് നിരക്കുകൾ ഗ്രാമിനും പവനും. AKGSMA ബോർഡ് നിരക്ക്, ദിവസവും അപ്ഡേറ്റ്.",
      alternates: { canonical: "/ml", languages },
    };
  }

  return {
    title: `ഇന്നത്തെ സ്വർണ്ണ വില കേരളം: 22K ₹${today.rate_22k_1g}/ഗ്രാം · ${inr(today.rate_22k_1g * 8)}/പവൻ`,
    description: `ഇന്നത്തെ കേരള സ്വർണ്ണ വില: 22 കാരറ്റ് (916) ഗ്രാമിന് ₹${today.rate_22k_1g}, ഒരു പവന് (8 ഗ്രാം) ${inr(today.rate_22k_1g * 8)}. 24 കാരറ്റ് ₹${today.rate_24k_1g}/ഗ്രാം. AKGSMA ബോർഡ് നിരക്ക് — എല്ലാ ജില്ലകളിലും ഒരേ വില.`,
    alternates: { canonical: "/ml", languages },
  };
}

export default async function MalayalamRatePage() {
  const history = await getHistory();
  const today = history[0] ?? null;
  const yesterday = history[1] ?? null;

  if (!today) {
    return (
      <main lang="ml" className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center text-sm text-zinc-500">
        നിരക്ക് ലഭ്യമല്ല. അല്പസമയത്തിനു ശേഷം വീണ്ടും ശ്രമിക്കുക.
      </main>
    );
  }

  const change = yesterday ? today.rate_22k_1g - yesterday.rate_22k_1g : null;
  const dateMl = new Date(today.date + "T00:00:00").toLocaleDateString("ml-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const karats = [
    { label: "24 കാരറ്റ്", purity: "999", perGram: today.rate_24k_1g },
    { label: "22 കാരറ്റ്", purity: "916 ഹാൾമാർക്ക്", perGram: today.rate_22k_1g },
    { label: "18 കാരറ്റ്", purity: "750", perGram: today.rate_18k_1g },
  ];

  const weights = [
    { label: "1 ഗ്രാം", grams: 1 },
    { label: "8 ഗ്രാം (1 പവൻ)", grams: 8 },
    { label: "10 ഗ്രാം", grams: 10 },
    { label: "100 ഗ്രാം", grams: 100 },
  ];

  const faqs = [
    {
      q: "ഇന്ന് കേരളത്തിൽ ഒരു ഗ്രാം 22 കാരറ്റ് സ്വർണ്ണത്തിന്റെ വില എത്ര?",
      a: `ഇന്ന് (${dateMl}) കേരളത്തിൽ 22 കാരറ്റ് (916) സ്വർണ്ണത്തിന്റെ വില ഗ്രാമിന് ${inr(today.rate_22k_1g)} ആണ്. ഒരു പവന് (8 ഗ്രാം) ${inr(today.rate_22k_1g * 8)}.`,
    },
    {
      q: "ഒരു പവൻ സ്വർണ്ണം എത്ര ഗ്രാം ആണ്?",
      a: "ഒരു പവൻ = 8 ഗ്രാം. കേരളത്തിൽ സ്വർണ്ണം സാധാരണയായി പവൻ കണക്കിലാണ് വാങ്ങുന്നത്.",
    },
    {
      q: "സ്വർണ്ണ വില എല്ലാ ജില്ലകളിലും ഒരുപോലെയാണോ?",
      a: "അതെ. AKGSMA (ഓൾ കേരള ഗോൾഡ് & സിൽവർ മർച്ചന്റ്സ് അസോസിയേഷൻ) ബോർഡ് നിരക്ക് കൊച്ചി, തിരുവനന്തപുരം, കോഴിക്കോട്, തൃശ്ശൂർ ഉൾപ്പെടെ എല്ലാ ജില്ലകളിലും ഒരുപോലെയാണ്. ജ്വല്ലറികൾ തമ്മിൽ വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലാണ്.",
    },
    {
      q: "916 എന്നാൽ എന്താണ്?",
      a: "916 എന്നാൽ 91.6% ശുദ്ധത — അതായത് 22 കാരറ്റ് സ്വർണ്ണം. ആഭരണങ്ങൾ വാങ്ങുമ്പോൾ BIS ഹാൾമാർക്ക് (916 മുദ്ര) ഉറപ്പാക്കുക.",
    },
  ];

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "ml",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  }).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqJsonLd }} />

      <main lang="ml" className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 md:py-12">
        {/* Hero */}
        <section className="text-center">
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            ഇന്നത്തെ സ്വർണ്ണ വില കേരളത്തിൽ
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            <time dateTime={today.date}>{dateMl}</time> · AKGSMA ബോർഡ് നിരക്ക് · എല്ലാ ജില്ലകളിലും ഒരേ വില
          </p>
          <p className="mt-2">
            <Link href="/" lang="en" className="text-xs font-semibold text-amber-700 hover:underline dark:text-amber-400">
              Read in English →
            </Link>
          </p>
        </section>

        {/* Main 22K card */}
        <section className="gold-shimmer relative mt-6 overflow-hidden rounded-2xl border border-amber-300 bg-white p-6 text-center shadow-xl shadow-amber-300/40 ring-2 ring-amber-400/50 dark:border-amber-500/50 dark:bg-zinc-900 dark:shadow-amber-900/20">
          <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-300">22 കാരറ്റ് സ്വർണ്ണം (916 ഹാൾമാർക്ക്)</p>
          <p className="mt-2 bg-gradient-to-br from-amber-600 via-yellow-500 to-amber-700 bg-clip-text text-4xl font-bold tracking-tight text-transparent dark:from-amber-400 dark:via-yellow-400 dark:to-amber-500">
            {inr(today.rate_22k_1g)}
            <span className="text-lg font-semibold"> / ഗ്രാം</span>
          </p>
          <p className="mt-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
            ഒരു പവന് (8 ഗ്രാം): <strong className="text-zinc-800 dark:text-zinc-200">{inr(today.rate_22k_1g * 8)}</strong>
          </p>
          {change !== null && (
            <p
              className={`mt-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
                change > 0
                  ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-400"
                  : change < 0
                    ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-400"
                    : "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400"
              }`}
            >
              <span aria-hidden>{change > 0 ? "▲" : change < 0 ? "▼" : "—"}</span>
              {change === 0
                ? "ഇന്നലത്തെ അതേ വില"
                : `ഇന്നലത്തേക്കാൾ ${inr(Math.abs(change))} ${change > 0 ? "കൂടുതൽ" : "കുറവ്"} (ഗ്രാമിന്)`}
            </p>
          )}
        </section>

        {/* Karat table */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-800/30">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-zinc-500">കാരറ്റ്</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">ഗ്രാമിന്</th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-zinc-500">പവന് (8 ഗ്രാം)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {karats.map((k) => (
                <tr key={k.label}>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-zinc-800 dark:text-zinc-200">{k.label}</p>
                    <p className="text-[11px] text-zinc-500">{k.purity}</p>
                  </td>
                  <td className="px-5 py-3.5 text-right font-semibold text-zinc-900 dark:text-zinc-100">{inr(k.perGram)}</td>
                  <td className="px-5 py-3.5 text-right text-zinc-600 dark:text-zinc-400">{inr(k.perGram * 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Weight table (22K) */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="border-b border-zinc-100 px-5 py-3 dark:border-zinc-800">
            <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100">തൂക്കം അനുസരിച്ച് — 22 കാരറ്റ്</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {weights.map((w) => (
              <div key={w.label} className="flex items-center justify-between px-5 py-3">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{w.label}</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{inr(today.rate_22k_1g * w.grams)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Source note */}
        <p className="mt-4 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          * 22K, 18K നിരക്കുകൾ ഔദ്യോഗിക AKGSMA കേരള ബോർഡ് നിരക്കാണ്. 24K നിരക്ക് 916 നിരക്കിൽ നിന്ന്
          ശുദ്ധത അനുപാതത്തിൽ കണക്കാക്കിയത്. പണിക്കൂലിയും 3% GST-യും അധികമായി വരും.
        </p>

        {/* FAQ */}
        <section className="mt-8">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">സാധാരണ ചോദ്യങ്ങൾ</h2>
          <div className="mt-3 divide-y divide-zinc-100 dark:divide-zinc-800">
            {faqs.map((f) => (
              <div key={f.q} className="py-4">
                <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{f.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cross-links to the English tools */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            തത്സമയ ഡാഷ്ബോർഡ് (English) →
          </Link>
          <Link href="/tools/gold-making-charge-calculator" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            പണിക്കൂലി കാൽക്കുലേറ്റർ →
          </Link>
        </div>
      </main>
    </>
  );
}
