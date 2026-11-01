// Malayalam city data for the /ml/[city] pages.
//
// Kept small and factual on purpose — Malayalam text that a native speaker
// might find grammatically off hurts more than it helps. Each entry carries:
//
//  - `nameMl`:  the district name in standard Malayalam Unicode
//  - `headline`: a short Malayalam phrase for the H1 ("<city>-ൽ ഇന്നത്തെ…")
//  - `nearby`:  2-5 nearby towns (romanised, matches the English cityData
//               convention) — used to differentiate each page's content so
//               Google doesn't deduplicate the 14 pages
//  - `faqA`:    one city-specific Malayalam FAQ answer (location + rate
//               uniformity reassurance)
//
// Add richer content (jeweller lists, cultural notes) iteratively as GSC
// shows which city terms Malayalam searchers actually use.

export interface MalayalamCityInfo {
  slug: string;
  nameMl: string;
  headline: string;
  nearby: string[];
  faqA: string;
}

export const MALAYALAM_CITIES: Record<string, MalayalamCityInfo> = {
  trivandrum: {
    slug: "trivandrum",
    nameMl: "തിരുവനന്തപുരം",
    headline: "തിരുവനന്തപുരത്ത് ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Nedumangad", "Attingal", "Neyyattinkara", "Varkala", "Kazhakoottam"],
    faqA: "തിരുവനന്തപുരം ജില്ലയിലെ (കരമന, നെടുമങ്ങാട്, ആറ്റിങ്ങൽ, നെയ്യാറ്റിൻകര ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  ernakulam: {
    slug: "ernakulam",
    nameMl: "എറണാകുളം",
    headline: "എറണാകുളത്ത് ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Kochi", "Aluva", "Perumbavoor", "Angamaly", "Muvattupuzha", "Tripunithura"],
    faqA: "എറണാകുളം ജില്ലയിലെ (കൊച്ചി, ആലുവ, അങ്കമാലി, പെരുമ്പാവൂർ, മൂവാറ്റുപുഴ ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  kozhikode: {
    slug: "kozhikode",
    nameMl: "കോഴിക്കോട്",
    headline: "കോഴിക്കോട് ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Vadakara", "Koyilandy", "Feroke", "Mukkam", "Thamarassery", "Koduvally"],
    faqA: "കോഴിക്കോട് ജില്ലയിലെ (വടകര, കൊയിലാണ്ടി, ഫറോക്ക്, മുക്കം, താമരശ്ശേരി ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  thrissur: {
    slug: "thrissur",
    nameMl: "തൃശ്ശൂർ",
    headline: "തൃശ്ശൂർ ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Chalakudy", "Kunnamkulam", "Irinjalakuda", "Guruvayur", "Kodungallur", "Chavakkad"],
    faqA: "തൃശ്ശൂർ ജില്ലയിലെ (ചാലക്കുടി, കുന്നംകുളം, ഇരിങ്ങാലക്കുട, ഗുരുവായൂർ, കൊടുങ്ങല്ലൂർ ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. ഇന്ത്യയുടെ 'ഗോൾഡ് ക്യാപ്പിറ്റൽ' എന്നറിയപ്പെടുന്ന തൃശ്ശൂർ കേരളത്തിലെ ജ്വല്ലറി നിർമ്മാണ കേന്ദ്രമാണ്.",
  },
  kollam: {
    slug: "kollam",
    nameMl: "കൊല്ലം",
    headline: "കൊല്ലത്ത് ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Punalur", "Karunagappally", "Paravur", "Kottarakkara", "Chavara"],
    faqA: "കൊല്ലം ജില്ലയിലെ (പുനലൂർ, കരുനാഗപ്പള്ളി, പരവൂർ, കൊട്ടാരക്കര ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  palakkad: {
    slug: "palakkad",
    nameMl: "പാലക്കാട്",
    headline: "പാലക്കാട് ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Ottapalam", "Shoranur", "Chittur", "Mannarkkad", "Pattambi", "Cherpulassery"],
    faqA: "പാലക്കാട് ജില്ലയിലെ (ഒറ്റപ്പാലം, ഷൊർണൂർ, ചിറ്റൂർ, മണ്ണാർക്കാട്, പട്ടാമ്പി ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  kannur: {
    slug: "kannur",
    nameMl: "കണ്ണൂർ",
    headline: "കണ്ണൂർ ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Thalassery", "Payyanur", "Mattannur", "Taliparamba", "Iritty"],
    faqA: "കണ്ണൂർ ജില്ലയിലെ (തലശ്ശേരി, പയ്യന്നൂർ, മട്ടന്നൂർ, തളിപ്പറമ്പ ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  alappuzha: {
    slug: "alappuzha",
    nameMl: "ആലപ്പുഴ",
    headline: "ആലപ്പുഴയിൽ ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Cherthala", "Mavelikkara", "Chengannur", "Kayamkulam", "Haripad"],
    faqA: "ആലപ്പുഴ ജില്ലയിലെ (ചേർത്തല, മാവേലിക്കര, ചെങ്ങന്നൂർ, കായംകുളം, ഹരിപ്പാട് ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  kottayam: {
    slug: "kottayam",
    nameMl: "കോട്ടയം",
    headline: "കോട്ടയത്ത് ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Changanassery", "Pala", "Vaikom", "Ettumanoor", "Kanjirappally"],
    faqA: "കോട്ടയം ജില്ലയിലെ (ചങ്ങനാശ്ശേരി, പാല, വൈക്കം, ഏറ്റുമാനൂർ, കാഞ്ഞിരപ്പള്ളി ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  malappuram: {
    slug: "malappuram",
    nameMl: "മലപ്പുറം",
    headline: "മലപ്പുറത്ത് ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Tirur", "Manjeri", "Perinthalmanna", "Nilambur", "Ponnani", "Kottakkal"],
    faqA: "മലപ്പുറം ജില്ലയിലെ (തിരൂർ, മഞ്ചേരി, പെരിന്തൽമണ്ണ, നിലമ്പൂർ, പൊന്നാനി ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  pathanamthitta: {
    slug: "pathanamthitta",
    nameMl: "പത്തനംതിട്ട",
    headline: "പത്തനംതിട്ടയിൽ ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Adoor", "Thiruvalla", "Mallappally", "Ranni", "Konni"],
    faqA: "പത്തനംതിട്ട ജില്ലയിലെ (അടൂർ, തിരുവല്ല, മല്ലപ്പള്ളി, റാന്നി ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  idukki: {
    slug: "idukki",
    nameMl: "ഇടുക്കി",
    headline: "ഇടുക്കിയിൽ ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Thodupuzha", "Munnar", "Adimali", "Kattappana", "Kumily"],
    faqA: "ഇടുക്കി ജില്ലയിലെ (തൊടുപുഴ, മൂന്നാർ, അടിമാലി, കട്ടപ്പന ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  wayanad: {
    slug: "wayanad",
    nameMl: "വയനാട്",
    headline: "വയനാട്ടിൽ ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Kalpetta", "Mananthavady", "Sulthan Bathery", "Meppadi"],
    faqA: "വയനാട് ജില്ലയിലെ (കൽപറ്റ, മാനന്തവാടി, സുൽത്താൻ ബത്തേരി, മേപ്പാടി ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
  kasaragod: {
    slug: "kasaragod",
    nameMl: "കാസർഗോഡ്",
    headline: "കാസർഗോഡ് ഇന്നത്തെ സ്വർണ്ണ വില",
    nearby: ["Kanhangad", "Nileshwar", "Uppala", "Manjeshwar"],
    faqA: "കാസർഗോഡ് ജില്ലയിലെ (കാഞ്ഞങ്ങാട്, നീലേശ്വരം, ഉപ്പള, മഞ്ചേശ്വരം ഉൾപ്പെടെ) എല്ലാ ജ്വല്ലറികളിലും സ്വർണ്ണ വില ഒരുപോലെയാണ് — AKGSMA ബോർഡ് നിരക്ക്. വ്യത്യാസം വരുന്നത് പണിക്കൂലിയിലും 3% GST-യിലും മാത്രം.",
  },
};

export const MALAYALAM_CITY_SLUGS = Object.keys(MALAYALAM_CITIES);
