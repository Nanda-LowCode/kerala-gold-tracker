import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = false;

type GlossaryEntry = {
  term: string;
  termMl?: string;
  transliteration?: string;
  community: string;
  definition: string[];
  relatedTerms?: string[];
};

const GLOSSARY: Record<string, GlossaryEntry> = {
  thali: {
    term: "Thali",
    termMl: "താലി",
    transliteration: "thāli",
    community: "Hindu (all sub-communities)",
    definition: [
      "The Thali is the sacred pendant tied around the bride's neck by the groom at the moment of marriage — the central symbol of the Hindu wedding ceremony. It is the equivalent of the wedding ring in western tradition.",
      "Different Hindu communities in Kerala wear distinct Thali designs: Nair brides wear the Kumbla Thali (leaf-shaped); Namboothiri brides wear the Malarthi Thali (different pattern). These designs are community markers and are not interchangeable.",
      "In South Kerala, the Thali tradition extends across communities: Syrian Christian brides wear the Minnu (a leaf-shaped pendant with an embedded cross) and some Muslim communities have community-specific pendant forms. The shared form reflects centuries of cultural coexistence; the distinct symbols reflect each community's theology.",
    ],
    relatedTerms: ["kumbla", "malarthi", "minnu", "talikettu"],
  },
  minnu: {
    term: "Minnu",
    termMl: "മിന്ന്",
    transliteration: "minnu",
    community: "Syrian Christian",
    definition: [
      "The Minnu is the central wedding ornament of Syrian Christian brides in Kerala. It is a gold pendant, leaf-shaped, with a cross embedded in the centre — the Christian symbol distinguishing it from the Hindu Thali of the same region.",
      "The Minnu is given by the groom and tied around the bride's neck at the Minnukettu ceremony, which parallels the Hindu Talikettu. The word 'minnu' is believed to derive from a Malayalam word for 'gleam' or 'shine.'",
      "Minnu designs vary slightly between Syrian Catholic, Jacobite, Marthoma, and Knanaya families. The cross form and placement differ by denomination, though the leaf shape is broadly consistent.",
    ],
    relatedTerms: ["minnukettu", "manthrakodi", "thali"],
  },
  mahr: {
    term: "Mahr",
    termMl: "മഹ്ർ",
    transliteration: "mahr",
    community: "Muslim (all sub-communities)",
    definition: [
      "Mahr (also spelled Mehar) is a mandatory gift — of gold, money, or other agreed-upon value — given by the groom to the bride at the Nikah (Islamic marriage ceremony). It is declared and agreed before the Nikah takes place.",
      "Critically, Mahr is the bride's absolute right under Islamic law. It becomes her sole property. It flows from the groom to the bride — the opposite direction of dowry. Confusing Mahr with dowry is a serious factual error: dowry flows from the bride's family to the groom's, is illegal in India, and is antithetical to the purpose of Mahr.",
      "In Kerala Muslim tradition, Mahr is often given in gold or cash. The amount is negotiated before the wedding and stated publicly at the Nikah. It may be given immediately (Mahr-e-Mua'jjal) or deferred (Mahr-e-Muwa'jjal), though immediate payment is the norm in Kerala practice.",
    ],
    relatedTerms: ["nikah", "valayidal"],
  },
  valayidal: {
    term: "Valayidal",
    termMl: "വളയിടൽ",
    transliteration: "vaḷayidal",
    community: "Mappila Muslim",
    definition: [
      "Valayidal is a pre-wedding ceremony in Mappila Muslim tradition in which the groom's mother — and sometimes the groom's family collectively — visits the bride's home and gifts gold bangles (and often a full ornament set) to the bride.",
      "Valayidal formally announces and solidifies the marriage alliance. In this role, it functions similarly to a betrothal or formal engagement: after Valayidal, the families are publicly committed. The word means 'placing of bangles' (vala = bangle, idal = to place/give).",
      "The gold given at Valayidal is from the groom's family and is distinct from the Mahr, which the groom himself gives at the Nikah.",
    ],
    relatedTerms: ["mahr", "nikah"],
  },
  manthrakodi: {
    term: "Manthrakodi",
    termMl: "മന്ത്രക്കോടി",
    transliteration: "manthrakodi",
    community: "Syrian Christian",
    definition: [
      "Manthrakodi is the saree gifted by the groom to the bride in Syrian Christian tradition. The bride wears it after the church ceremony — she typically arrives in white or cream attire and changes into the Manthrakodi for the reception.",
      "The Manthrakodi is usually a Kerala kasavu saree (off-white silk with gold border) or a silk saree. It is a significant gift representing the groom's provision for his bride and is displayed publicly at the reception.",
      "The name combines 'manthra' (sacred, blessed) and 'kodi' (saree). It parallels the role of the wedding dress in western tradition but is worn after, not during, the church ceremony.",
    ],
    relatedTerms: ["minnu", "minnukettu"],
  },
  kumbla: {
    term: "Kumbla Thali",
    termMl: "കുമ്പ്ള താലി",
    transliteration: "kumbḷa thāli",
    community: "Nair (Hindu)",
    definition: [
      "The Kumbla Thali is the distinctive Thali design worn by Nair brides. Its shape is leaf-like, with a rounded base — 'kumbla' refers to the form of the pendant. It is distinct from the Namboothiri Malarthi Thali and cannot be used interchangeably.",
      "The Kumbla Thali is tied by the groom at the Talikettu ceremony, the central moment of a Nair wedding. It is worn continuously after marriage as a symbol of marital status.",
    ],
    relatedTerms: ["thali", "talikettu", "malarthi"],
  },
  malarthi: {
    term: "Malarthi Thali",
    termMl: "മലർത്തി താലി",
    transliteration: "malarthi thāli",
    community: "Namboothiri (Hindu)",
    definition: [
      "The Malarthi Thali is the wedding pendant worn by Namboothiri brides. Its design differs from the Nair Kumbla Thali — 'malarthi' refers to an open, upward-facing form. The design is specific to Namboothiri community tradition.",
      "Despite the Namboothiri wedding being one of Kerala's most ritually elaborate, the bridal ornament set is intentionally simple — a reflection of the community's emphasis on ritual correctness over material display.",
    ],
    relatedTerms: ["thali", "talikettu", "kumbla"],
  },
  talikettu: {
    term: "Talikettu",
    termMl: "താലികെട്ട്",
    transliteration: "thālikettu",
    community: "Hindu (Nair, Namboothiri, Ezhava)",
    definition: [
      "Talikettu (literally 'tying of the Thali') is the central ceremony of a Hindu wedding in Kerala. At the auspicious muhurat, the groom ties the Thali around the bride's neck — this act constitutes the marriage.",
      "The ceremony is typically conducted in the presence of family, with the Tantri or Vedic priest overseeing the ritual. In Nair tradition, the Talikettu is followed by the Sadya feast and other celebrations.",
      "Talikettu is paralleled in other communities by the Minnukettu (Syrian Christian) — both involve the groom placing a sacred pendant around the bride's neck as the defining moment of the union.",
    ],
    relatedTerms: ["thali", "kumbla", "malarthi", "minnukettu"],
  },
  minnukettu: {
    term: "Minnukettu",
    termMl: "മിന്ന് കെട്ടൽ",
    transliteration: "minnu kettal",
    community: "Syrian Christian",
    definition: [
      "Minnukettu is the ceremony at which the groom ties the Minnu around the bride's neck in a Syrian Christian wedding. It directly parallels the Hindu Talikettu in function — it is the central act that constitutes the marriage.",
      "The Minnukettu typically occurs during or immediately after the church ceremony. The Minnu (with its embedded cross) is placed by the groom as an act of covenant and provision.",
    ],
    relatedTerms: ["minnu", "talikettu", "manthrakodi"],
  },
  nikah: {
    term: "Nikah",
    termMl: "നിക്കാഹ്",
    transliteration: "nikāh",
    community: "Muslim (all sub-communities)",
    definition: [
      "Nikah is the Islamic marriage contract — the ceremony that constitutes the legal and religious marriage in Islam. It is conducted by a Maulvi or Qazi (Islamic religious judge) in the presence of witnesses.",
      "At the Nikah, the groom declares 'Qubool Hai' (I accept) three times. The Mahr — the mandatory gift from groom to bride — is declared and agreed at this ceremony. The signing of the Nikah document completes the marriage.",
      "In Kerala, the Nikah is typically a quieter ceremony than the later Walima (reception feast hosted by the groom's family), which is the larger public celebration.",
    ],
    relatedTerms: ["mahr", "valayidal"],
  },
};

export function generateStaticParams() {
  return Object.keys(GLOSSARY).map((term) => ({ term }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>;
}): Promise<Metadata> {
  const { term } = await params;
  const entry = GLOSSARY[term.toLowerCase()];
  if (!entry) return { title: "Term Not Found" };

  return {
    title: `${entry.term} — Kerala Wedding Gold Glossary | LiveGold Kerala`,
    description: `${entry.term} (${entry.termMl ?? entry.transliteration}) — ${entry.community}. ${entry.definition[0].slice(0, 150)}`,
    alternates: { canonical: `/culture/weddings/glossary/${term}` },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>;
}) {
  const { term } = await params;
  const entry = GLOSSARY[term.toLowerCase()];
  if (!entry) notFound();

  return (
    <>
      <header className="border-b border-zinc-200/60 bg-white/70 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/70">
        <div className="mx-auto flex max-w-3xl items-center gap-2.5 px-4 py-4">
          <span className="text-2xl leading-none">📖</span>
          <div>
            <Link href="/" className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-lg hover:underline">
              LiveGold{" "}
              <span className="bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent dark:from-amber-400 dark:to-yellow-400">
                Kerala
              </span>
            </Link>
            <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <Link href="/culture/weddings" className="hover:text-zinc-600">Weddings</Link>
              {" · "}Glossary · {entry.term}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-4 py-8 md:py-12">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 md:text-3xl">
            {entry.term}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            {entry.termMl && (
              <span className="text-base text-zinc-500 dark:text-zinc-400">{entry.termMl}</span>
            )}
            {entry.transliteration && (
              <span className="text-sm italic text-zinc-400 dark:text-zinc-500">{entry.transliteration}</span>
            )}
          </div>
          <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {entry.community}
          </p>
        </div>

        <div className="space-y-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
          {entry.definition.map((para, i) => <p key={i}>{para}</p>)}
        </div>

        {entry.relatedTerms && entry.relatedTerms.length > 0 && (
          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Related terms</p>
            <div className="flex flex-wrap gap-2">
              {entry.relatedTerms.map((t) => (
                <Link
                  key={t}
                  href={`/culture/weddings/glossary/${t}`}
                  className="rounded-full border border-zinc-200/60 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-amber-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/culture/weddings" className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:ring-amber-800/60">
            ← Wedding Traditions
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
