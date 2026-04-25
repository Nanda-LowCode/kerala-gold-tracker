import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseReadClient } from "@/lib/supabase";

export const revalidate = 86400;

// URL param → DB community key
const DB_COMMUNITY: Record<string, Record<string, string>> = {
  hindu:     { nair: "nair", namboothiri: "namboothiri", ezhava: "ezhava" },
  christian: { syrian: "syrian-christian", latin: "latin-catholic", marthoma: "marthoma" },
  muslim:    { mappila: "mappila-muslim", sunni: "sunni-muslim" },
};

type CommunityInfo = {
  label: string;
  labelMl: string;
  tradition: string;
  thali: string;
  thaliMl: string;
  hasMahr: boolean;
  sections: { heading: string; body: string[] }[];
  keyTerms?: string[];
};

const COMMUNITY_INFO: Record<string, CommunityInfo> = {
  nair: {
    label: "Nair", labelMl: "നായർ", tradition: "Hindu",
    thali: "Kumbla Thali", thaliMl: "കുമ്പ്ള താലി", hasMahr: false,
    sections: [
      {
        heading: "The Nischayam and Talikettu",
        body: [
          "A Nair wedding begins with the Nischayam (engagement) — a formal gathering where horoscopes are matched and the alliance is fixed. The groom's family visits the bride's home; an exchange of betel leaves and sometimes rings marks the agreement.",
          "The central ceremony is Talikettu — the tying of the Thali (sacred pendant). The Kumbla Thali worn in Nair tradition is leaf-shaped, distinct from other Hindu communities' designs. It is tied around the bride's neck by the groom at the auspicious muhurat.",
        ],
      },
      {
        heading: "Bridal attire and gold",
        body: [
          "The bride traditionally wears a Kasavu saree — off-white Kerala silk with a gold border — for the Talikettu ceremony. Gold jewellery is worn across the head, ears, neck, arms, wrists, and waist. The Kasavu saree itself is considered part of the bridal ensemble.",
          "Key bridal ornaments include the Kumbla Thali, Kasu Mala (coin necklace), Palakka Mala, Manga Mala, Mullamottu Mala, Netti Chutti (forehead), Oddiyanam (waist belt), and Thadavala–Ottavala bangle sets. Actual ornament choice varies by family.",
        ],
      },
      {
        heading: "The Sadya feast",
        body: [
          "A wedding Sadya (feast) is served on a banana leaf as part of the celebration. The menu follows a specific sequence of dishes — sambar, rasam, avial, pachadi, payasam — served in prescribed order. The Sadya is an expression of abundance and hospitality, not simply a meal.",
        ],
      },
    ],
    keyTerms: ["thali", "talikettu", "kumbla"],
  },
  namboothiri: {
    label: "Namboothiri", labelMl: "നമ്പൂതിരി", tradition: "Hindu",
    thali: "Malarthi Thali", thaliMl: "മലർത്തി താലി", hasMahr: false,
    sections: [
      {
        heading: "The four-day ritual",
        body: [
          "A Namboothiri wedding is one of the most ritually elaborate in Kerala — typically spanning four days with Vedic ceremonies conducted by the Tantri (chief priest). Despite the ritual complexity, the bridal aesthetic is intentionally simple: the bride and groom wear minimal jewellery and plain attire.",
          "This contrast — extensive ceremony, restrained outward display — reflects the Namboothiri emphasis on ritual correctness over material display. The Malarthi Thali has a distinct pattern that differentiates it from the Nair Kumbla Thali.",
        ],
      },
      {
        heading: "Gold customs",
        body: [
          "Namboothiri bridal gold is deliberately simpler than Nair tradition. The Malarthi Thali is the central ornament; basic neckpieces, bangles, and earrings complete the set. Elaborate multi-piece collections are not customary in traditional Namboothiri practice.",
          "In many families, jewellery reflects ancestral pieces passed down generations rather than newly purchased sets. Weight and elaborateness are not markers of status in this tradition.",
        ],
      },
    ],
    keyTerms: ["thali", "malarthi", "talikettu"],
  },
  ezhava: {
    label: "Ezhava", labelMl: "ഈഴവ", tradition: "Hindu",
    thali: "Community Thali", thaliMl: "താലി", hasMahr: false,
    sections: [
      {
        heading: "Ezhava wedding customs",
        body: [
          "Ezhava weddings share several ornament traditions with Nair community — including the Kasu Mala, Palakka Mala, and Manga Mala — but maintain distinct ceremonial customs and community practices. The Thali pattern varies by region and family tradition.",
          "Wedding ceremonies typically include a formal engagement (Nischayam), the Talikettu, and a community gathering. The specific rituals observed vary between North Kerala and South Kerala Ezhava families.",
        ],
      },
      {
        heading: "Bridal ornaments",
        body: [
          "The bridal ornament set in Ezhava tradition is broadly similar to Nair — multiple necklaces, forehead ornament (Netti Chutti), waist belt (Oddiyanam), and bangle sets. Family customs and regional variations shape the specific pieces worn.",
          "As with all communities documented here, descriptions reflect common practice — not universal requirements. Individual families may observe different customs.",
        ],
      },
    ],
    keyTerms: ["thali", "talikettu"],
  },
  "syrian-christian": {
    label: "Syrian Christian", labelMl: "സുറിയാനി ക്രിസ്ത്യാനി", tradition: "Christian",
    thali: "Minnu", thaliMl: "മിന്ന്", hasMahr: false,
    sections: [
      {
        heading: "Aacharakalyanam and Manasamantham",
        body: [
          "A Syrian Christian wedding begins with the Aacharakalyanam — the formal date-fixing ceremony — and the Manasamantham (betrothal), conducted at the church with two witnesses. The Manasamantham is a formal church event that marks the official beginning of the engagement.",
          "The Minnukettu (tying of the Minnu) is the central wedding ceremony, directly paralleling the Hindu Talikettu. The Minnu is a gold pendant, leaf-shaped, with an embedded cross — distinct from the Hindu Thali in its Christian symbolism.",
        ],
      },
      {
        heading: "The Minnu and Manthrakodi",
        body: [
          "The Minnu is the signature ornament of the Syrian Christian bride. Its leaf shape echoes the Thali forms of Hindu communities in the same region — reflecting centuries of cultural interweaving — but the cross embedded in the pendant marks its Christian identity. It is given by the groom and tied at the Minnukettu ceremony.",
          "The Manthrakodi is the saree gifted by the groom that the bride changes into after the church ceremony. In many families, the bride arrives in white or cream and changes into the Manthrakodi saree, a kasavu or silk saree with gold border, for the reception.",
        ],
      },
      {
        heading: "Bridal gold",
        body: [
          "Syrian Christian bridal gold typically includes the Minnu, a Karimani Mala (black bead chain), longer chains, and bangles. Diamond jewellery is increasingly common for daily-wear pieces. The overall ensemble is generally less extensive than in Nair tradition.",
          "Some Knanaya, Marthoma, and Jacobite families maintain slightly different ornament customs. The Minnu pattern itself varies between sub-denominations.",
        ],
      },
    ],
    keyTerms: ["minnu", "minnukettu", "manthrakodi"],
  },
  "latin-catholic": {
    label: "Latin Catholic", labelMl: "ലത്തീൻ കത്തോലിക്ക", tradition: "Christian",
    thali: "Wedding ring (primary)", thaliMl: "മോതിരം", hasMahr: false,
    sections: [
      {
        heading: "Latin Catholic wedding customs",
        body: [
          "Latin Catholic communities in Kerala, concentrated along the coastal regions, have been influenced by Portuguese and western traditions since the 16th century. The wedding ring is the primary symbol of the union — distinct from the Thali tradition of Syrian Christians and Hindu communities.",
          "The church ceremony follows the Roman Rite with local adaptations. Gold customs vary considerably by family and region; the elaborateness of bridal jewellery is not a community marker in the same way as in other Kerala traditions.",
        ],
      },
      {
        heading: "Coastal gold customs",
        body: [
          "Among fishing and coastal farming communities, gold jewellery plays an important social role as stored wealth and family heritage. Common pieces include chains, bangles, and earrings, though specific customs vary widely by family.",
          "Compared to Syrian Christian or Hindu traditions, the gold load in Latin Catholic weddings is generally more modest, with greater variation between individual families.",
        ],
      },
    ],
    keyTerms: ["minnu"],
  },
  marthoma: {
    label: "Marthoma", labelMl: "മാർത്തോമ്മ", tradition: "Christian",
    thali: "Minnu (variant)", thaliMl: "മിന്ന്", hasMahr: false,
    sections: [
      {
        heading: "Marthoma Christian weddings",
        body: [
          "The Marthoma Church is a reformed Syrian Christian denomination, distinct in liturgy and some practices from Catholic and Jacobite Syrian traditions. Wedding ceremonies follow the Marthoma Qurbana order with local traditions.",
          "The Minnu is typically given in Marthoma weddings as in other Syrian traditions, though specific design and ceremony details vary. The church ceremony is central; reception customs have become more westernised in many families.",
        ],
      },
      {
        heading: "Gold customs",
        body: [
          "Marthoma bridal gold broadly parallels Syrian Christian tradition — Minnu, chain, bangles. The emphasis is on the church ceremony rather than the quantity of ornaments. As with all communities here, individual family practices vary significantly from these generalisations.",
        ],
      },
    ],
    keyTerms: ["minnu"],
  },
  "mappila-muslim": {
    label: "Mappila Muslim", labelMl: "മാപ്പിള", tradition: "Muslim",
    thali: "Mahr (mandatory, groom to bride)", thaliMl: "മഹ്ർ", hasMahr: true,
    sections: [
      {
        heading: "Valayidal and Naal Nischayam",
        body: [
          "The Valayidal is a key pre-wedding ceremony: the groom's mother visits the bride's home and gifts gold bangles — and sometimes a full ornament set — to the bride. This formalises the alliance and effectively serves as the engagement event.",
          "The Naal Nischayam is the date-fixing ceremony at the groom's home, conducted in the presence of a Maulvi.",
        ],
      },
      {
        heading: "Mailanchi Raavu",
        body: [
          "The Mailanchi Raavu (henna night) is held the evening before the Nikah. Women gather at the bride's home for Oppana — a form of Mappila Muslim song and dance performed by women — and apply intricate henna patterns. Mappila Paattu (traditional song) fills the evening.",
          "The Mailanchi Raavu is the most festive pre-wedding night in Mappila tradition and is distinct from other Kerala communities' pre-wedding customs.",
        ],
      },
      {
        heading: "Nikah and Mahr",
        body: [
          "The Nikah is conducted by a Maulvi or Qazi. The groom makes the declaration ('Qubool Hai') three times. The Mahr — a mandatory gift of gold or money from the groom to the bride — is agreed and declared during the Nikah.",
          "The Mahr is the bride's absolute right under Islamic law. It flows from groom to bride and becomes her sole property. It must never be described as dowry — dowry flows from the bride's family to the groom's, is illegal in India, and is the opposite of Mahr in both direction and legal character.",
          "After the Nikah, the Walima (reception feast by the groom's family) follows. The Chauthi (Veettil Koodal) — the bride's first return visit to her parents' home — occurs on the fourth day.",
        ],
      },
      {
        heading: "Mappila bridal gold",
        body: [
          "Mappila Muslim bridal jewellery reflects Mughal and Arab influences alongside local Kerala design. Multiple necklaces (including a prominent choker), a Jhoomar or Passa (head ornament), Haathphool (hand ornament), and the Arappatta (waist belt) are traditional pieces.",
          "The Valayidal bangles are particularly significant as they are given by the groom's family at the formal alliance event. The Mahr amount — typically in gold or currency — is kept separate from the ornament set and is the bride's independent financial right.",
        ],
      },
    ],
    keyTerms: ["mahr", "valayidal", "nikah"],
  },
  "sunni-muslim": {
    label: "Sunni Muslim", labelMl: "സുന്നി മുസ്ലിം", tradition: "Muslim",
    thali: "Mahr (mandatory)", thaliMl: "മഹ്ർ", hasMahr: true,
    sections: [
      {
        heading: "Kerala Sunni Muslim wedding customs",
        body: [
          "Kerala Sunni Muslim weddings follow the same fundamental Islamic structure as Mappila weddings — Nikah conducted by a Maulvi, Mahr agreed and given to the bride, Walima reception — with some variation in pre-wedding customs and regional practices.",
          "The Mahr is mandatory by Islamic law, agreed before the Nikah, and becomes the bride's property. As with Mappila tradition, the Mahr must not be conflated with dowry.",
        ],
      },
      {
        heading: "Bridal gold",
        body: [
          "Sunni Muslim bridal gold customs vary by region and family but generally include multiple necklaces, bangles, and earrings. The specific pieces and quantities depend on family tradition and negotiated arrangements.",
          "As with all communities documented here, the descriptions reflect common practice. Individual family customs vary significantly.",
        ],
      },
    ],
    keyTerms: ["mahr", "nikah"],
  },
};

type OrnamentDefault = {
  default_pavan: number | null;
  is_required: boolean;
  notes: string | null;
  ornaments: {
    slug: string;
    name_en: string;
    name_ml: string | null;
    typical_weight_pavan_min: number | null;
    typical_weight_pavan_max: number | null;
  } | null;
};

async function getOrnamentDefaults(dbCommunity: string): Promise<OrnamentDefault[]> {
  try {
    const supabase = createSupabaseReadClient();
    const { data } = await supabase
      .from("wedding_ornament_defaults")
      .select("default_pavan, is_required, notes, ornaments(slug, name_en, name_ml, typical_weight_pavan_min, typical_weight_pavan_max)")
      .eq("community", dbCommunity as import("@/lib/database.types").WeddingCommunity)
      .order("is_required", { ascending: false });
    return (data ?? []) as OrnamentDefault[];
  } catch {
    return [];
  }
}

export function generateStaticParams() {
  return [
    { tradition: "hindu",     community: "nair" },
    { tradition: "hindu",     community: "namboothiri" },
    { tradition: "hindu",     community: "ezhava" },
    { tradition: "christian", community: "syrian" },
    { tradition: "christian", community: "latin" },
    { tradition: "christian", community: "marthoma" },
    { tradition: "muslim",    community: "mappila" },
    { tradition: "muslim",    community: "sunni" },
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tradition: string; community: string }>;
}): Promise<Metadata> {
  const { tradition, community } = await params;
  const dbKey = DB_COMMUNITY[tradition]?.[community];
  const info = dbKey ? COMMUNITY_INFO[dbKey] : null;
  if (!info) return { title: "Not Found" };

  return {
    title: `${info.label} Wedding Gold Traditions Kerala — ${info.thali} | LiveGold Kerala`,
    description: `${info.label} (${info.tradition}) wedding gold customs in Kerala — ${info.thali}, bridal ornaments, ceremony overview. Community-specific, sourced facts.`,
    alternates: { canonical: `/culture/weddings/${tradition}/${community}` },
    openGraph: {
      title: `${info.label} Wedding Gold Traditions — Kerala`,
      description: `${info.thali} and bridal ornament customs of the ${info.label} community in Kerala.`,
      url: `https://www.livegoldkerala.com/culture/weddings/${tradition}/${community}`,
    },
  };
}

const TRADITION_COLOR: Record<string, string> = {
  Hindu: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Christian: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Muslim: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

export default async function CommunityWeddingPage({
  params,
}: {
  params: Promise<{ tradition: string; community: string }>;
}) {
  const { tradition, community } = await params;
  const dbKey = DB_COMMUNITY[tradition]?.[community];
  if (!dbKey) notFound();

  const info = COMMUNITY_INFO[dbKey];
  if (!info) notFound();

  const defaults = await getOrnamentDefaults(dbKey);

  return (
    <>
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">💍</span>
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
              <Link href="/culture/weddings" className="hover:text-zinc-600">Weddings</Link>
              {" · "}{info.label}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
              {info.label} Wedding Traditions
            </h1>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${TRADITION_COLOR[info.tradition]}`}>
              {info.tradition}
            </span>
          </div>
          <p className="mt-1 text-base text-zinc-500 dark:text-zinc-400">{info.labelMl}</p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-zinc-500">Central ornament:</span>
            <span className="font-semibold text-amber-700 dark:text-amber-400">{info.thali}</span>
            <span className="text-xs text-zinc-400">{info.thaliMl}</span>
          </div>
        </div>

        {/* Mahr notice for Muslim communities */}
        {info.hasMahr && (
          <div className="rounded-xl border border-green-200/60 bg-green-50/40 px-4 py-3 text-xs leading-relaxed text-green-800 dark:border-green-800/30 dark:bg-green-950/10 dark:text-green-300">
            <strong>Mahr:</strong> A mandatory gift from groom to bride, declared at the Nikah and
            her sole property by Islamic law. It is not dowry — dowry flows in the opposite
            direction, is illegal in India, and is a distinct and opposed practice.
          </div>
        )}

        {/* Editorial note */}
        <div className="rounded-xl border border-zinc-200/50 bg-zinc-50/60 px-4 py-3 text-xs leading-relaxed text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400">
          Practices described here use &quot;In {info.label} tradition…&quot; or &quot;Many families…&quot; —
          never universal claims. Ornament weights are indicative community averages from the
          wedding budget defaults, not requirements.
        </div>

        {/* Traditions sections */}
        <div className="space-y-8 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
          {info.sections.map((section, i) => (
            <section key={i} className="space-y-3">
              <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100 md:text-lg">
                {section.heading}
              </h2>
              {section.body.map((para, j) => <p key={j}>{para}</p>)}
            </section>
          ))}
        </div>

        {/* Ornament defaults from DB */}
        {defaults.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-base font-bold text-zinc-800 dark:text-zinc-100">
              Common bridal ornaments
            </h2>
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Default weights used in the wedding budget calculator. Indicative community averages — actual choices vary by family.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-zinc-200/70 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">Ornament</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">Default (pavan)</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">Required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {defaults.map((d, i) => (
                    <tr key={i} className="hover:bg-amber-50/30 dark:hover:bg-zinc-800/50">
                      <td className="px-4 py-2.5">
                        <p className="font-medium text-zinc-800 dark:text-zinc-200">{d.ornaments?.name_en}</p>
                        {d.ornaments?.name_ml && (
                          <p className="text-xs text-zinc-400">{d.ornaments.name_ml}</p>
                        )}
                        {d.notes && (
                          <p className="text-xs text-zinc-400 mt-0.5">{d.notes}</p>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-amber-700 dark:text-amber-400">
                        {d.default_pavan ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {d.is_required ? (
                          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Yes</span>
                        ) : (
                          <span className="text-xs text-zinc-400">Optional</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link
              href="/culture/weddings/budget-calculator"
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
            >
              Open budget calculator →
            </Link>
          </section>
        )}

        {/* Key terms */}
        {info.keyTerms && (
          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Glossary</p>
            <div className="flex flex-wrap gap-2">
              {info.keyTerms.map((term) => (
                <Link
                  key={term}
                  href={`/culture/weddings/glossary/${term}`}
                  className="rounded-full border border-zinc-200/60 bg-white px-3 py-1 text-xs font-medium text-zinc-600 hover:border-amber-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                >
                  {term.charAt(0).toUpperCase() + term.slice(1)} →
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/culture/weddings" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← All Communities
          </Link>
          <Link href="/culture/weddings/budget-calculator" className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700">
            Budget Calculator →
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
