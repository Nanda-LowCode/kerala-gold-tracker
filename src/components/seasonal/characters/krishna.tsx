import type { CharacterConfig } from "../types";
import { en, ml } from "../types";

/**
 * Vishu 2027 — Bala Krishna. The Malayalam New Year is deeply Kerala-specific
 * and the Vishukkani tradition ties directly to gold: the first sight on Vishu
 * morning is meant to be the "kani" — an arrangement including gold coins,
 * cadamba flowers and kanikonna, arranged in front of Krishna. So Krishna
 * fits this site more precisely than any other festival character.
 *
 * Tone: playful and warm, gently wise. Not reverent like Lakshmi, not cheeky
 * like Mahabali — the boy-god who blesses new beginnings and teases about
 * the importance of intention over haste.
 *
 * Vishu 2027 falls on ~14 April; the window covers the buildup + the day
 * itself. Bump dates + storage key next year.
 */

const WINDOW_START = new Date("2027-04-10T00:00:00+05:30");
const WINDOW_END = new Date("2027-04-20T23:59:59+05:30");

const BLESSINGS_EN = [
  en("Vishu greetings! 🌼 May your first sight this morning be filled with gold."),
  en("Vishukkani blessings — kanikonna in bloom, and gold in your morning tray. 🪙"),
  en("Happy Vishu! ✨ May your gold be as pure as your intent, and your bill as clear as morning light."),
  en("The kanikonna blooms yellow for Vishu — nature's own gold. May your family's be just as steady."),
  en("Vishu greetings, my friend! 🌾 New year, new beginnings — buy with intention, not haste."),
  en("A blessed new year. Your kani was auspicious; may your gold be genuine 916. 🌟"),
  en("Little me plays a flute; you check the board rate. Both are wise. 🎶"),
];

const BLESSINGS_ML = [
  ml("വിഷുവിന്റെ ശുഭാശംസകൾ! 🌼 ഇന്നത്തെ കണിക്കാഴ്ച നിറയെ സ്വർണ്ണം കാണിക്കട്ടെ."),
  ml("വിഷുക്കണി അനുഗ്രഹങ്ങൾ — കണിക്കൊന്ന വിടർന്നു, കണിത്തിളക്കത്തിൽ സ്വർണ്ണം. 🪙"),
  ml("ഹാപ്പി വിഷു! ✨ നിങ്ങളുടെ സ്വർണ്ണം ശുദ്ധമായിരിക്കട്ടെ, ബില്ല് സുതാര്യമായിരിക്കട്ടെ."),
  ml("കണിക്കൊന്ന വിഷുവിന് പൂക്കുന്നു — പ്രകൃതിയുടെ സ്വർണ്ണം. നിങ്ങളുടെ കുടുംബത്തിന്റെതും അതുപോലെ ശാശ്വതമാകട്ടെ."),
  ml("വിഷുവാശംസകൾ, കൂട്ടുകാരാ! 🌾 പുതുവർഷം, പുതിയ തുടക്കങ്ങൾ — ഉദ്ദേശ്യത്തോടെ വാങ്ങൂ, തിടുക്കത്തിലല്ല."),
  ml("അനുഗ്രഹീത പുതുവർഷം. കണി ശുഭകരമായി; സ്വർണ്ണവും യഥാർത്ഥ 916 ആകട്ടെ. 🌟"),
  ml("ഞാൻ ഓടക്കുഴൽ വായിക്കുന്നു; നിങ്ങൾ ബോർഡ് നിരക്ക് നോക്കൂ. രണ്ടും വിവേകമാണ്. 🎶"),
];

function buildRateLines(rate22k: number | null, change: number | null, malayalam: boolean) {
  if (rate22k == null) return [];
  const rate = `₹${rate22k.toLocaleString("en-IN")}`;
  const d = change != null ? `₹${Math.abs(change).toLocaleString("en-IN")}` : "";

  if (malayalam) {
    const lines = [
      ml(`ഇന്നത്തെ 22K വില ${rate}/ഗ്രാം. വിഷുവിന് അനുഗ്രഹീത ദിവസം. 🌼`),
    ];
    if (change != null && change < 0) {
      lines.push(
        ml(`കണി പുഞ്ചിരിക്കുന്നു — വിഷുവിന് 22K ${d} കുറഞ്ഞു. ശുഭകരമായ ദിവസം.`),
        ml(`${d} കുറഞ്ഞു! വിവേകത്തോടെ വാങ്ങാൻ പുതുവർഷം അനുഗ്രഹിക്കുന്നു.`),
      );
    } else if (change != null && change > 0) {
      lines.push(
        ml(`വിഷുവിന് വില ${d} കൂടി — എന്നാൽ കണിക്കൊന്ന ഇപ്പോഴും സ്വതന്ത്രമായി പൂക്കുന്നു. ചെറുതും ശുദ്ധവുമായി വാങ്ങൂ.`),
        ml(`22K ${d} കയറി. തിടുക്കത്തിലല്ല, ഉദ്ദേശ്യത്തിലാണ് സമ്പത്ത്.`),
      );
    } else if (change === 0) {
      lines.push(ml("ഇന്ന് വിലക്ക് മാറ്റമില്ല. പുതുവർഷത്തിന് ശാന്തമായ തുടക്കം."));
    }
    return lines;
  }

  const lines = [en(`Today's 22K is ${rate}/g. A blessed morning for the kani. 🌼`)];
  if (change != null && change < 0) {
    lines.push(
      en(`The kani smiles — 22K down ${d} on Vishu. An auspicious start to the year.`),
      en(`A dip of ${d}! The new year invites a wise purchase.`),
    );
  } else if (change != null && change > 0) {
    lines.push(
      en(`Vishu brings a rise — up ${d}. But kanikonna still blooms free. Buy small, buy pure.`),
      en(`22K climbs ${d}. Intention over haste, my friend, always.`),
    );
  } else if (change === 0) {
    lines.push(en("The rate is steady today. A calm start to the year."));
  }
  return lines;
}

/**
 * Original artwork — Bala Krishna, the youthful playful form. Blue skin,
 * peacock feather rising from behind the crown, small mukut, yellow silk
 * dhoti with gold trim, flute at lips, halo behind head. Deliberately
 * different from both Mahabali (jolly king with belly) and Lakshmi
 * (serene standing goddess): boyish proportions, tribhanga-inspired soft
 * S-curve, gentle mischievous smile.
 *
 * Uses the walking gait classes (mb-figure, mb-leg-f, mb-leg-b) so he
 * dances across the screen. mahabali-wave is not applied — the flute-hand
 * stays at the lips.
 */
function KrishnaSvg() {
  return (
    <svg
      viewBox="0 0 120 152"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-[72px] drop-shadow-md sm:w-[86px]"
      role="img"
      aria-label="Bala Krishna"
    >
      <defs>
        <radialGradient id="kr-halo" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#fff5c8" />
          <stop offset="55%" stopColor="#facc15" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="kr-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffdf6b" />
          <stop offset="55%" stopColor="#f3b93a" />
          <stop offset="100%" stopColor="#a86a10" />
        </linearGradient>
        <linearGradient id="kr-silk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <radialGradient id="kr-feather-eye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="55%" stopColor="#f3b93a" />
          <stop offset="100%" stopColor="#166534" />
        </radialGradient>
      </defs>

      {/* Halo — soft yellow disc behind head */}
      <circle cx="60" cy="48" r="40" fill="url(#kr-halo)" />

      {/* Ground shadow */}
      <ellipse cx="60" cy="149" rx="24" ry="2.4" fill="#000" opacity="0.1" />

      {/* Peacock feathers rising from behind the crown — three fronds */}
      <g>
        {[-20, 0, 20].map((rot, i) => (
          <g key={i} transform={`translate(60 22) rotate(${rot})`}>
            {/* stem */}
            <path
              d={`M 0 0 Q ${-3 + i * 1.5} -14 ${-1 + i * 2} -28`}
              fill="none"
              stroke="#166534"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* eye/oval at feather tip */}
            <ellipse
              cx={-1 + i * 2}
              cy={-30}
              rx="4"
              ry="6"
              fill="url(#kr-feather-eye)"
              stroke="#166534"
              strokeWidth="0.6"
            />
            {/* iris */}
            <ellipse
              cx={-1 + i * 2}
              cy={-30}
              rx="1.6"
              ry="2.6"
              fill="#1e3a8a"
            />
            <ellipse
              cx={-1 + i * 2}
              cy={-30}
              rx="0.7"
              ry="1.2"
              fill="#a5b4fc"
            />
          </g>
        ))}
      </g>

      {/* Everything below rocks as one body while walking */}
      <g className="mb-figure">
        {/* Legs (bare feet) with stride */}
        <g className="mb-leg-b">
          <rect x="49" y="132" width="6" height="12" rx="3" fill="#6e91d0" />
          <ellipse cx="51.5" cy="146.5" rx="5" ry="2.2" fill="#4b6a99" />
        </g>
        <g className="mb-leg-f">
          <rect x="65" y="132" width="6" height="12" rx="3" fill="#6e91d0" />
          <ellipse cx="68" cy="146.5" rx="5" ry="2.2" fill="#4b6a99" />
        </g>

        {/* Yellow silk dhoti with gold trim — shorter than Mahabali's mundu */}
        <path
          d="M40 96 Q37 118 40 134 L80 134 Q83 118 80 96 Q60 104 40 96 Z"
          fill="url(#kr-silk)"
          stroke="#a16207"
          strokeWidth="0.6"
        />
        {/* Kasavu-style gold border on the hem */}
        <path d="M40.5 131 L79.5 131" stroke="url(#kr-gold)" strokeWidth="2.4" />
        <path d="M41 133.5 L79 133.5" stroke="#ffdf6b" strokeWidth="1" />
        {/* pleats */}
        <path d="M60 104 L60 128" stroke="#a16207" strokeWidth="0.8" opacity="0.6" />
        <path d="M50 102 L48 128 M70 102 L72 128" stroke="#a16207" strokeWidth="0.6" opacity="0.5" />

        {/* Bare torso — blue skin, boyish */}
        <ellipse cx="60" cy="82" rx="18" ry="15" fill="#6e91d0" />

        {/* Pearl necklace with pendant */}
        <path d="M48 62 Q60 72 72 62" fill="none" stroke="#e5e7eb" strokeWidth="1.4" />
        <circle cx="60" cy="70" r="2.6" fill="url(#kr-gold)" stroke="#7a4e08" strokeWidth="0.6" />
        <circle cx="60" cy="70" r="0.9" fill="#dc2626" />
        {/* pearls */}
        {[-8, -4, 4, 8].map((x) => (
          <circle key={x} cx={60 + x} cy={65 + Math.abs(x) * 0.25} r="0.9" fill="#f9fafb" stroke="#9ca3af" strokeWidth="0.2" />
        ))}

        {/* Yellow silk sash across the chest */}
        <path d="M42 71 L48 68 L75 96 L68 100 Z" fill="url(#kr-silk)" opacity="0.9" stroke="#a16207" strokeWidth="0.4" />
        <path d="M46 69.5 L71.5 98.5" stroke="url(#kr-gold)" strokeWidth="0.8" />

        {/* Waist belt with medallion */}
        <path
          d="M40 94 Q60 100 80 94 L80 99 Q60 105 40 99 Z"
          fill="url(#kr-gold)"
          stroke="#7a4e08"
          strokeWidth="0.5"
        />
        <circle cx="60" cy="99" r="3.4" fill="#ffdf6b" stroke="#7a4e08" strokeWidth="0.6" />
        <circle cx="60" cy="99" r="1.1" fill="#dc2626" />

        {/* Right arm (viewer's left) — holds the flute up to lips */}
        <path d="M45 74 Q40 60 46 48" fill="none" stroke="#6e91d0" strokeWidth="7.5" strokeLinecap="round" />
        {/* fingers holding flute */}
        <circle cx="47" cy="48" r="4.5" fill="#6e91d0" />
        {/* bangle */}
        <path d="M42 72 L48 72" stroke="url(#kr-gold)" strokeWidth="2.6" />

        {/* Left arm (viewer's right) — relaxed at side, holding flute end */}
        <path d="M75 74 Q82 62 78 48" fill="none" stroke="#6e91d0" strokeWidth="7.5" strokeLinecap="round" />
        <circle cx="76" cy="48" r="4.5" fill="#6e91d0" />
        <path d="M72 72 L78 72" stroke="url(#kr-gold)" strokeWidth="2.6" />

        {/* Flute — angled from viewer-right hand to lips */}
        <line x1="48" y1="47" x2="76" y2="47" stroke="#7a4e08" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="52" y1="46" x2="72" y2="46" stroke="#facc15" strokeWidth="0.8" />

        {/* Neck */}
        <rect x="55.5" y="52" width="9" height="6" rx="3" fill="#6e91d0" />

        {/* Face — round, boyish, blue skin */}
        <circle cx="60" cy="42" r="13.5" fill="#6e91d0" />
        {/* rosy cheeks */}
        <circle cx="50.5" cy="45.5" r="2.5" fill="#f472b6" opacity="0.35" />
        <circle cx="69.5" cy="45.5" r="2.5" fill="#f472b6" opacity="0.35" />
        {/* brows */}
        <path d="M51 35 Q54.5 33.6 57 35 M63 35 Q65.5 33.6 69 35" fill="none" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
        {/* eyes — bright, playful */}
        <ellipse cx="54" cy="39.5" rx="2.4" ry="2.8" fill="#fff" />
        <ellipse cx="66" cy="39.5" rx="2.4" ry="2.8" fill="#fff" />
        <circle cx="54.3" cy="40" r="1.4" fill="#1e293b" />
        <circle cx="66.3" cy="40" r="1.4" fill="#1e293b" />
        <circle cx="54.8" cy="39.4" r="0.4" fill="#fff" />
        <circle cx="66.8" cy="39.4" r="0.4" fill="#fff" />
        {/* tilaka on forehead */}
        <path d="M60 32 L60 36" stroke="#eab308" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="60" cy="33.8" r="1.3" fill="#dc2626" />
        {/* nose */}
        <path d="M60 41 L58.7 46 Q60 47 61.3 46 Z" fill="#5378bd" />
        {/* playful smile with flute at lips */}
        <path d="M56 49.5 Q60 48 64 49.5" fill="none" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
        {/* small mouth around flute */}
        <ellipse cx="60" cy="48" rx="1.4" ry="0.9" fill="#7c2d12" opacity="0.4" />

        {/* Small mukut (crown) — modest, boyish, three points */}
        <path
          d="M46 28 L49 20 L54 25 L60 15 L66 25 L71 20 L74 28 Z"
          fill="url(#kr-gold)"
          stroke="#7a4e08"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        <circle cx="60" cy="21" r="1.6" fill="#dc2626" stroke="#7a4e08" strokeWidth="0.3" />
        <circle cx="54" cy="25" r="1" fill="#166534" stroke="#7a4e08" strokeWidth="0.2" />
        <circle cx="66" cy="25" r="1" fill="#166534" stroke="#7a4e08" strokeWidth="0.2" />
        <rect x="45" y="27" width="30" height="4" rx="2" fill="url(#kr-gold)" stroke="#7a4e08" strokeWidth="0.4" />

        {/* Ears + gold earrings */}
        <circle cx="46" cy="43" r="2.5" fill="#6e91d0" />
        <circle cx="74" cy="43" r="2.5" fill="#6e91d0" />
        <circle cx="46" cy="47" r="1.5" fill="none" stroke="url(#kr-gold)" strokeWidth="1" />
        <circle cx="74" cy="47" r="1.5" fill="none" stroke="url(#kr-gold)" strokeWidth="1" />
      </g>
    </svg>
  );
}

export const KRISHNA: CharacterConfig = {
  id: "krishna",
  name: "Bala Krishna",
  storageKey: "vishu-2027-krishna-dismissed",
  window: { start: WINDOW_START, end: WINDOW_END },
  ariaLabel: {
    en: "Tap Bala Krishna for a Vishu blessing",
    ml: "വിഷുവിന്റെ അനുഗ്രഹത്തിനായി ബാലകൃഷ്ണനെ തൊടുക",
  },
  tapHint: {
    en: "Vishu greetings — tap 🌼",
    ml: "വിഷുവാശംസകൾ — തൊടൂ 🌼",
  },
  blessings: { en: BLESSINGS_EN, ml: BLESSINGS_ML },
  buildRateLines,
  shareIntro: "🌼",
  shareLabel: {
    en: "Share the blessing 🌼",
    ml: "അനുഗ്രഹം പങ്കുവയ്ക്കൂ 🌼",
  },
  // Kanikonna yellow dominant, with Krishna-blue accents and a touch of
  // pink/green for the shrub in bloom.
  particleColors: ["#facc15", "#fbbf24", "#fde047", "#f59e0b", "#60a5fa", "#22c55e", "#f472b6"],
  hasGait: true,
  Art: KrishnaSvg,
  theme: { trimClass: "vishu-trim", washClass: "vishu-glow" },
};

export const VISHU_START = WINDOW_START;
export const VISHU_END = WINDOW_END;
