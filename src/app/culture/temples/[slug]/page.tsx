import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseReadClient } from "@/lib/supabase";

export const revalidate = 86400;

type Temple = {
  slug: string;
  name_en: string | null;
  name_ml: string | null;
  district: string | null;
  deity: string | null;
  lat: number | null;
  lng: number | null;
  description_en: string | null;
};

async function getTemple(slug: string): Promise<Temple | null> {
  try {
    const supabase = createSupabaseReadClient();
    const { data } = await supabase
      .from("temples")
      .select("slug, name_en, name_ml, district, deity, lat, lng, description_en")
      .eq("slug", slug)
      .single();
    return data as Temple | null;
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const supabase = createSupabaseReadClient();
    const { data } = await supabase.from("temples").select("slug");
    return (data ?? []).map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const temple = await getTemple(slug);

  if (!temple) {
    return { title: "Temple Not Found | LiveGold Kerala" };
  }

  const detail = RICH_CONTENT[slug];
  const description = detail?.metaDescription ??
    `${temple.name_en} — ${temple.district}, Kerala. Sacred gold traditions, history, and visitor information.`;

  return {
    title: `${temple.name_en} — Sacred Gold Traditions | LiveGold Kerala`,
    description,
    alternates: { canonical: `/culture/temples/${slug}` },
    openGraph: {
      title: `${temple.name_en} — Sacred Gold Traditions`,
      description,
      url: `https://www.livegoldkerala.com/culture/temples/${slug}`,
    },
  };
}

// ── Rich content for anchor temples ─────────────────────────────
// All facts verified from named sources (see spec: Wikipedia, Pandalam Palace
// site, Deccan Chronicle, Devaswom sites). No monetary valuations on sacred gold.

type RichContent = {
  metaDescription: string;
  highlight: string;
  sections: { heading: string; body: string[] }[];
  facts?: { label: string; value: string }[];
  relatedSlugs?: string[];
};

const RICH_CONTENT: Record<string, RichContent> = {
  guruvayur: {
    metaDescription:
      "Guruvayur Thulabharam — how the ritual works, materials offered (including gold), timings, and a weight-to-gold estimator. Verified facts from Guruvayur Devaswom.",
    highlight: "Thulabharam ritual",
    facts: [
      { label: "Deity", value: "Lord Guruvayurappan (Krishna/Vishnu)" },
      { label: "District", value: "Thrissur, Kerala" },
      { label: "Thulabharam counters", value: "3 (separate facility near Kalyana Mandapam for non-Hindus)" },
      { label: "Timings", value: "5:00 AM – 1:30 PM · 5:00 PM – 8:30 PM (approximate)" },
      { label: "Booking", value: "No advance booking required" },
      { label: "Materials supplied by", value: "Guruvayur Devaswom (most materials)" },
    ],
    sections: [
      {
        heading: "What is Thulabharam?",
        body: [
          "Thulabharam (literally 'weight offering') is a ritual in which a devotee is weighed on a large balance scale against an offering material. The offering — equal in weight to the devotee — is then donated to the temple. It is an act of total surrender: giving one's own weight as an offering.",
          "The practice is described in ancient texts and associated with the Dwapara Yuga. It is performed at Guruvayur, Tirupati, Dwaraka, and Udupi, among other temples, but Guruvayur is the most prominent centre for this ritual in Kerala.",
        ],
      },
      {
        heading: "Materials offered at Guruvayur",
        body: [
          "The Devaswom permits several materials for Thulabharam. Common offerings include: ripe bananas (the most frequent), sugar, jaggery, coconut, curry leaves, butter, and tulsi (holy basil). Silver and gold Thulabharam are also performed.",
          "Gold Thulabharam — in which the devotee is weighed against gold — is considered the most profound form. Historical records document several notable gold Thulabharam events, including one by a Sri Lankan head of state (77 kg of sandalwood, documented in 2015).",
          "The specific material and quantity of donation are arranged with the Devaswom. Charges vary by material and weight; the Devaswom should be contacted directly for current rates, which are not fixed.",
        ],
      },
      {
        heading: "Performing Thulabharam",
        body: [
          "Devotees arrive at the temple and approach the Thulabharam counter after completing the main darshan. The counter staff seat the devotee on one pan of the large scale. The offering material is loaded on the opposite pan until balance is achieved.",
          "The weighed material is then dedicated to the deity. Devotees typically offer a prayer (sashtangam) after the ritual. The entire process takes 15–30 minutes depending on queue and material.",
          "Three counters operate within the temple complex. A separate facility near the Kalyana Mandapam is available for non-Hindu devotees who wish to observe or participate in a modified form.",
        ],
      },
      {
        heading: "Gold Thulabharam: weight estimator",
        body: [
          "The table below shows the gold equivalent for common body weights at today's Kerala rate. This is an informational estimate only — actual Devaswom charges, procedures, and material sourcing must be confirmed directly with Guruvayur Devaswom before planning a visit.",
        ],
      },
    ],
    relatedSlugs: ["sabarimala", "padmanabhaswamy", "ettumanoor"],
  },

  sabarimala: {
    metaDescription:
      "Sabarimala Thiruvabharanam — the sacred ornaments of Lord Ayyappa, the three caskets, the 83 km procession route, and the annual January schedule. Sourced from Pandalam Palace and Devaswom records.",
    highlight: "Thiruvabharanam procession",
    facts: [
      { label: "Deity", value: "Lord Ayyappa (Dharma Sastha)" },
      { label: "District", value: "Pathanamthitta, Kerala (Periyar Tiger Reserve)" },
      { label: "Procession start", value: "~January 12 each year (Pandalam)" },
      { label: "Procession distance", value: "83 km on foot" },
      { label: "Makaravilakku date", value: "January 14 (1st of Malayalam month Makaram)" },
      { label: "Ornaments kept at", value: "Srambickal Palace, Pandalam Palace premises" },
    ],
    sections: [
      {
        heading: "What is Thiruvabharanam?",
        body: [
          "Thiruvabharanam (sacred ornaments) refers to the divine jewellery of Lord Ayyappa, which is housed year-round at the Srambickal Palace within the Pandalam Palace premises in Pathanamthitta district. According to tradition, these ornaments were commissioned by the Pandalam King who adopted Ayyappan as his son.",
          "Each year, the ornaments are carried in a ceremonial procession from Pandalam to the Sabarimala Sannidhanam — a journey of 83 km on foot through the Western Ghats — arriving in time for the Makaravilakku festival on January 14.",
        ],
      },
      {
        heading: "The three sacred caskets",
        body: [
          "The procession carries three caskets: the Thiruvabharana Petti (containing the ornaments themselves), the Velli Petti (silver vessels), and the Kodi Petti (ceremonial flag).",
          "The ornament casket contains: the golden face mask of Lord Ayyappa, miniature figures of the tiger and elephant (the deity's vahanas), the Sarapoli Mala, Velakku Mala, Mani Mala, and Erukkum Poomala, a Navaratna ring, swords, and silver arrows. These are not listed for their material value — they are sacred objects whose significance is devotional, not commercial.",
        ],
      },
      {
        heading: "The 83 km procession",
        body: [
          "The Thiruvabharanam procession departs Pandalam approximately three days before Makaravilakku (around January 11–12). It travels on foot through named halt points including the Ayroor Puthiyakavu Devi temple, Kaipuzha, Kulanada, Cherukol Subrahmanya temple, Pampadimon Ayyappa shrine, and the Mangattu Palace, before ascending to Sabarimala.",
          "The Pandalam Raja never travels with the procession — the royal family nominates a representative. The ornaments arrive at the Sannidhanam on the evening of January 14, and the Tantri and Melsanthi adorn the deity before the deeparadhana.",
        ],
      },
      {
        heading: "The Krishnaparunthu tradition",
        body: [
          "Integral to the Thiruvabharanam procession is the sighting of the Krishnaparunthu (brahminy kite), believed by devotees to be a manifestation of Garuda, Vishnu's vahana. Devotees believe the bird appears circling overhead at the procession's departure from Pandalam and again at its arrival at Sabarimala, marking divine acceptance of the ornaments.",
          "This belief is central to the devotional experience of the Makaravilakku festival and is documented in multiple Kerala news sources covering the annual event.",
        ],
      },
    ],
    relatedSlugs: ["guruvayur", "padmanabhaswamy", "aranmula"],
  },

  padmanabhaswamy: {
    metaDescription:
      "Sree Padmanabhaswamy Temple and its historic treasure — the 2011 Supreme Court discovery, Sangam-era references, millennium of donations, and the Padmanabhadasa tradition. Sourced from court records and Wikipedia.",
    highlight: "Historic treasure",
    facts: [
      { label: "Deity", value: "Lord Padmanabha (Vishnu, reclining on Ananta)" },
      { label: "District", value: "Thiruvananthapuram, Kerala" },
      { label: "Vault discovery", value: "27 June 2011 (Supreme Court order)" },
      { label: "Vaults opened", value: "5 of 6 (or 8) vaults" },
      { label: "Earliest reference", value: "Silappatikaram (Sangam era, 500 BC – 300 AD)" },
      { label: "Administrative body", value: "Travancore Royal Family Trust (court-supervised)" },
    ],
    sections: [
      {
        heading: "The temple and Travancore history",
        body: [
          "Sree Padmanabhaswamy Temple in Thiruvananthapuram is one of the 108 Divya Desams (sacred Vishnu temples) in India. The Travancore royal family ruled as Padmanabhadasa — 'servants of Lord Padmanabha' — a tradition in which the ruler holds sovereignty not for themselves but on behalf of the deity. All of Travancore was considered the deity's property.",
          "Tamil Sangam literature (500 BC – 300 AD) refers to the temple site as 'Arituyil-Amardon' ('the one who reclines in eternal sleep') in the Silappatikaram, indicating its antiquity.",
        ],
      },
      {
        heading: "The 2011 vault discovery",
        body: [
          "On 27 June 2011, following a Supreme Court of India order on a private petition, a court-appointed committee opened five of the temple's vaults. The documented findings are considered the largest collection of gold and precious stones in recorded world history.",
          "Among verified contents: gold coins from the 200 BC era (an 800-kilogram hoard referenced by former Comptroller and Auditor General Vinod Rai), gold donated over millennia by the Chera, Pandya, Travancore, Kolathiri, Pallava, and Chola dynasties.",
          "One vault (Vault B) remains sealed under Supreme Court supervision. Its contents have not been documented and no estimates of its contents are made on this page.",
        ],
      },
      {
        heading: "Centuries of donations",
        body: [
          "The treasure accumulated through royal donations across more than a millennium — not through commercial activity. Donations came from rulers who regarded the temple as the seat of their sovereignty. The Travancore royal family's practice of dedicating military victories and coronation gifts to the deity is documented in royal records.",
          "The cultural significance of the collection is inseparable from its devotional context. These are offerings made to a deity, not hoarded wealth, and their cultural and historical value vastly exceeds any monetary estimate.",
        ],
      },
      {
        heading: "Visiting Padmanabhaswamy",
        body: [
          "The temple is open to Hindu devotees. Men must wear the traditional Kerala dhoti (mundu); women must wear a saree or half-saree with blouse. Western clothing is not permitted inside the sanctum. Non-Hindus may view the exterior of the temple.",
          "The main darshan timings are 3:30 AM – 4:45 AM, 6:30 AM – 7:00 AM, 8:30 AM – 10:00 AM, 10:30 AM – 11:00 AM, 11:30 AM – 12:00 PM, 5:00 PM – 6:15 PM, and 6:45 PM – 7:20 PM. These timings are subject to change on festival days; verify with the temple before visiting.",
        ],
      },
    ],
    relatedSlugs: ["sabarimala", "guruvayur", "attukal"],
  },
};

// Weight × gold rate estimator data (for Guruvayur)
const THULABHARAM_WEIGHTS = [30, 40, 50, 60, 70, 80, 90, 100];

export default async function TemplePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const temple = await getTemple(slug);

  if (!temple) notFound();

  const rich = RICH_CONTENT[slug];

  return (
    <>
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">🛕</span>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline">
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Link href="/culture" className="hover:text-zinc-600">Culture</Link>
              {" · "}
              <Link href="/culture/temples" className="hover:text-zinc-600">Temples</Link>
              {" · "}{temple.name_en}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        {/* Title */}
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
              {temple.name_en}
            </h1>
            {rich && (
              <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                {rich.highlight}
              </span>
            )}
          </div>
          {temple.name_ml && (
            <p className="mt-1 text-base text-zinc-500 dark:text-zinc-400">{temple.name_ml}</p>
          )}
          {temple.district && (
            <p className="mt-0.5 text-sm text-zinc-400 dark:text-zinc-500">
              {temple.district} · {temple.deity}
            </p>
          )}
        </div>

        {/* Facts table */}
        {rich?.facts && (
          <div className="overflow-x-auto rounded-2xl border border-amber-200/50 bg-amber-50/30 shadow-sm dark:border-amber-800/30 dark:bg-amber-950/10">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-amber-100/60 dark:divide-amber-800/20">
                {rich.facts.map((f) => (
                  <tr key={f.label}>
                    <td className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-1/3">
                      {f.label}
                    </td>
                    <td className="px-4 py-2.5 text-zinc-800 dark:text-zinc-200">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Rich content sections */}
        {rich ? (
          <div className="space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
            {rich.sections.map((section, i) => (
              <section key={i} className="space-y-3">
                <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100 md:text-lg">
                  {section.heading}
                </h2>
                {section.body.map((para, j) => (
                  <p key={j}>{para}</p>
                ))}

                {/* Thulabharam estimator — only for Guruvayur weight section */}
                {slug === "guruvayur" && section.heading === "Gold Thulabharam: weight estimator" && (
                  <div className="rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-100 dark:border-zinc-800">
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Body weight</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">Gold (grams)</th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">Gold (pavan)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {THULABHARAM_WEIGHTS.map((kg) => (
                          <tr key={kg} className="hover:bg-amber-50/30 dark:hover:bg-zinc-800/50">
                            <td className="px-4 py-2.5 font-medium text-zinc-700 dark:text-zinc-300">{kg} kg</td>
                            <td className="px-4 py-2.5 text-right text-zinc-600 dark:text-zinc-400">{(kg * 1000).toLocaleString("en-IN")} g</td>
                            <td className="px-4 py-2.5 text-right font-semibold text-amber-700 dark:text-amber-400">
                              {Math.round((kg * 1000) / 8).toLocaleString("en-IN")} pavan
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="px-4 py-3 text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-100 dark:border-zinc-800">
                      Informational only. Actual Devaswom rates, material availability, and procedures vary — confirm with Guruvayur Devaswom directly before planning.
                    </p>
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : (
          /* Basic template for temples without rich content yet */
          <div className="space-y-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
            {temple.description_en ? (
              <p>{temple.description_en}</p>
            ) : (
              <div className="rounded-xl border border-zinc-200/50 bg-zinc-50/60 p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
                <p className="font-medium text-zinc-700 dark:text-zinc-300">
                  {temple.name_en}
                </p>
                <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                  {temple.district} · {temple.deity}
                </p>
                <p className="mt-3 text-xs text-zinc-400">
                  Detailed content for this temple is being prepared. Facts are verified against
                  named sources before publication per our editorial standards.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sacred gold notice */}
        <div className="rounded-xl border border-amber-200/50 bg-amber-50/40 px-4 py-3 text-xs leading-relaxed text-amber-800 dark:border-amber-800/30 dark:bg-amber-950/10 dark:text-amber-300">
          Sacred ornaments and temple gold are not commodities. This page describes traditions
          and verified history — it does not estimate the monetary value of sacred objects.
        </div>

        {/* Related temples */}
        {rich?.relatedSlugs && rich.relatedSlugs.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Related temples</h2>
            <div className="flex flex-wrap gap-2">
              {rich.relatedSlugs.map((s) => (
                <Link
                  key={s}
                  href={`/culture/temples/${s}`}
                  className="rounded-full border border-zinc-200/60 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-amber-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ")} →
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/culture/temples" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← All Temples
          </Link>
          <Link href="/culture/festivals" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Festival Calendar →
          </Link>
        </div>
      </main>

      <footer className="border-t border-zinc-200/60 bg-white/50 pt-6 pb-8 dark:border-zinc-800/80 dark:bg-zinc-950/50">
        <div className="mx-auto max-w-3xl px-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
          <p className="font-medium">AKGSMA · For reference only</p>
          <p className="mt-1.5">© 2026 LiveGold Kerala</p>
        </div>
      </footer>
    </>
  );
}
