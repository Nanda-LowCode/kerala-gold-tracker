import type { CharacterConfig } from "../types";
import { en, ml } from "../types";

/**
 * Dhanteras 2026 — Goddess Lakshmi. She glides across the bottom of the
 * screen on a lotus (no walking gait) and, when tapped, offers a blessing
 * for a wise gold purchase.
 *
 * Tone: reverent and warm, not cheeky. Lakshmi is an actively worshipped
 * goddess — every line is written as a benediction, never a joke.
 * The message theme is prosperity through discernment: the auspicious day
 * amplifies value only when the metal itself is genuine.
 *
 * Dhanteras 2026 falls on ~8 Nov. Window covers the ~5-day festival window
 * around Diwali. Bump the dates + storage key next year.
 */

const WINDOW_START = new Date("2026-11-03T00:00:00+05:30");
const WINDOW_END = new Date("2026-11-14T23:59:59+05:30");

const BLESSINGS_EN = [
  en("Blessings for a prosperous Dhanteras. 🪔 May today's gold bring lasting wealth."),
  en("Dhanteras is auspicious for gold — but only if the purity is true. Look for the 916 mark. ✨"),
  en("Wealth follows wisdom, my child. Verify the board rate before you spend."),
  en("Gold bought today is said to grow thirteenfold. Real 916 grows further still. 🪙"),
  en("A small pure piece today is worth more than a large impure one. Choose well."),
  en("Prosperity to your household this Diwali. 🪔 May every gramme be genuine."),
  en("A blessed purchase — but ask for the hallmark, and read the bill in full."),
];

const BLESSINGS_ML = [
  ml("ധനത്രയോദശിയുടെ ശുഭാശംസകൾ 🪔 ഇന്നത്തെ സ്വർണ്ണം ദീർഘസമ്പത്തായി വളരട്ടെ."),
  ml("ധനത്രയോദശിക്ക് സ്വർണ്ണം വാങ്ങുക — എന്നാൽ ശുദ്ധത യഥാർത്ഥമായിരിക്കട്ടെ. 916 മുദ്ര നോക്കൂ. ✨"),
  ml("സമ്പത്ത് വേഗതയെയല്ല, വിവേകത്തെയാണ് പിന്തുടരുന്നത്, കുഞ്ഞേ. ബോർഡ് നിരക്ക് പരിശോധിക്കൂ."),
  ml("ധനത്രയോദശിക്ക് വാങ്ങുന്ന സ്വർണ്ണം പതിമൂന്ന് മടങ്ങായി വളരുമെന്നാണ് വിശ്വാസം — യഥാർത്ഥ 916 ആണെങ്കിൽ! 🪙"),
  ml("ചെറിയ ശുദ്ധ സ്വർണ്ണം വലിയ അയഥാർത്ഥത്തിനേക്കാൾ വിലയേറും. നന്നായി തിരഞ്ഞെടുക്കൂ."),
  ml("ദീപാവലിയുടെ ശുഭാശംസകൾ 🪔 എല്ലാ ഗ്രാമും ശുദ്ധമായിരിക്കട്ടെ."),
  ml("ശുഭകരമായ വാങ്ങൽ — ഹാൾമാർക്ക് ചോദിക്കൂ, ബില്ല് പൂർണ്ണമായി വായിക്കൂ."),
];

function buildRateLines(rate22k: number | null, change: number | null, malayalam: boolean) {
  if (rate22k == null) return [];
  const rate = `₹${rate22k.toLocaleString("en-IN")}`;
  const d = change != null ? `₹${Math.abs(change).toLocaleString("en-IN")}` : "";

  if (malayalam) {
    const lines = [
      ml(`ഇന്നത്തെ 22K വില ${rate}/ഗ്രാം. ഈ ധനത്രയോദശിക്ക് അനുഗ്രഹീത വാങ്ങൽ. 🪔`),
    ];
    if (change != null && change < 0) {
      lines.push(
        ml(`ബോർഡ് ധനത്രയോദശിക്ക് അനുഗ്രഹിക്കുന്നു — 22K ${d} കുറഞ്ഞു. ശുഭകരമായ വാങ്ങൽ.`),
        ml(`${d} കുറഞ്ഞു! വിവേകത്തോടെ വാങ്ങാൻ സമയമായി.`),
      );
    } else if (change != null && change > 0) {
      lines.push(
        ml(`ദീപാവലിക്ക് വില ${d} കൂടി — ചെറിയ ശുദ്ധ സ്വർണ്ണം എപ്പോഴും അനുഗ്രഹമാണ്.`),
        ml(`22K ${d} കയറി. തിടുക്കത്തിലല്ല, വിവേകത്തിലാണ് സമ്പത്ത്.`),
      );
    } else if (change === 0) {
      lines.push(ml("വില സ്ഥിരമായി നിൽക്കുന്നു. വാങ്ങാനും കാത്തിരിക്കാനും വിവേകം."));
    }
    return lines;
  }

  const lines = [en(`Today's 22K is ${rate}/g. A blessed rate for a Dhanteras purchase. 🪔`)];
  if (change != null && change < 0) {
    lines.push(
      en(`The board smiles on Dhanteras — 22K down ${d} today. An auspicious moment.`),
      en(`A dip of ${d}! Buy wisely, and buy real 916.`),
    );
  } else if (change != null && change > 0) {
    lines.push(
      en(`Rate rises before Diwali — up ${d}. A small pure gramme still brings lasting blessings.`),
      en(`22K climbs ${d}. Wealth follows discernment, my child, not haste.`),
    );
  } else if (change === 0) {
    lines.push(en("The rate is steady today. Wisdom to buy, wisdom to wait."));
  }
  return lines;
}

/**
 * Original artwork — Goddess Lakshmi on a lotus, right hand raised in abhaya
 * (fearless-blessing) mudra, left hand cradling gold coins that spill toward
 * the viewer. Symmetric composition per traditional iconography. Deliberately
 * different from Mahabali: serene closed-mouth smile, no mustache or belly,
 * jewellery that reads as tasteful rather than jolly.
 *
 * No walking-gait classes — she glides on the lotus (SeasonalCharacter still
 * translates the whole container horizontally; only the leg/arm bob classes
 * are opted out).
 */
function LakshmiSvg() {
  return (
    <svg
      viewBox="0 0 120 152"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-[76px] drop-shadow-md sm:w-[90px]"
      role="img"
      aria-label="Goddess Lakshmi"
    >
      <defs>
        <radialGradient id="lx-halo" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#fff5c8" />
          <stop offset="55%" stopColor="#f7c948" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#e08a1e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lx-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffdf6b" />
          <stop offset="55%" stopColor="#f3b93a" />
          <stop offset="100%" stopColor="#a86a10" />
        </linearGradient>
        <linearGradient id="lx-saree" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e63a5e" />
          <stop offset="100%" stopColor="#9b0f2b" />
        </linearGradient>
        <radialGradient id="lx-coin" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff2a8" />
          <stop offset="60%" stopColor="#f3b93a" />
          <stop offset="100%" stopColor="#a86a10" />
        </radialGradient>
      </defs>

      {/* Halo — sits behind head + shoulders */}
      <circle cx="60" cy="48" r="42" fill="url(#lx-halo)" />
      {/* Ray points around the halo */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="60"
          y1="48"
          x2={60 + Math.cos((deg * Math.PI) / 180) * 46}
          y2={48 + Math.sin((deg * Math.PI) / 180) * 46}
          stroke="#f7c948"
          strokeWidth="1"
          opacity="0.6"
        />
      ))}

      {/* Ground shadow beneath lotus */}
      <ellipse cx="60" cy="150" rx="24" ry="2.4" fill="#000" opacity="0.12" />

      {/* Lotus pedestal — three concentric petal rows */}
      <g>
        <ellipse cx="60" cy="143" rx="26" ry="6" fill="#fbbfd0" opacity="0.55" />
        {/* outer petals */}
        {[-24, -15, -5, 5, 15, 24].map((x, i) => (
          <path
            key={`o${i}`}
            d={`M${60 + x} 141 Q${60 + x * 1.3} 133 ${60 + x} 128 Q${60 + x * 0.7} 133 ${60 + x} 141 Z`}
            fill="#f472b6"
            opacity="0.9"
          />
        ))}
        {/* inner petals — deeper red-pink */}
        {[-14, -5, 5, 14].map((x, i) => (
          <path
            key={`i${i}`}
            d={`M${60 + x} 139 Q${60 + x * 1.3} 132 ${60 + x} 127 Q${60 + x * 0.7} 132 ${60 + x} 139 Z`}
            fill="#e63a5e"
            opacity="0.85"
          />
        ))}
        {/* centre bud */}
        <ellipse cx="60" cy="138" rx="5" ry="3" fill="#9b0f2b" />
      </g>

      {/* Saree (draped body) — falls from waist to lotus, red with gold border */}
      <path
        d="M36 96 Q30 115 33 135 Q60 145 87 135 Q90 115 84 96 Q60 106 36 96 Z"
        fill="url(#lx-saree)"
        stroke="#5a0a1a"
        strokeWidth="0.6"
      />
      {/* Kasavu-style gold border along the hem */}
      <path d="M33.5 133 Q60 143 86.5 133" fill="none" stroke="url(#lx-gold)" strokeWidth="2.2" />
      <path d="M34 129.5 Q60 138.5 86 129.5" fill="none" stroke="#ffdf6b" strokeWidth="0.9" />
      {/* Pleats */}
      <path d="M60 106 L60 134" stroke="#a01234" strokeWidth="0.8" opacity="0.7" />
      <path d="M50 106 L47.5 133 M70 106 L72.5 133" stroke="#a01234" strokeWidth="0.6" opacity="0.55" />

      {/* Upper body / choli */}
      <path
        d="M43 78 Q60 84 77 78 L79 96 Q60 102 41 96 Z"
        fill="url(#lx-saree)"
        stroke="#5a0a1a"
        strokeWidth="0.6"
      />
      {/* Neck */}
      <rect x="55.5" y="52.5" width="9" height="8" rx="3" fill="#e4a86b" />

      {/* Necklaces */}
      <path d="M45 64 Q60 76 75 64" fill="none" stroke="url(#lx-gold)" strokeWidth="2.2" />
      <path d="M47.5 66 Q60 74 72.5 66" fill="none" stroke="#ffdf6b" strokeWidth="1.2" />
      {/* Central pendant */}
      <circle cx="60" cy="74" r="3" fill="url(#lx-gold)" stroke="#7a4e08" strokeWidth="0.6" />
      <circle cx="60" cy="74" r="1" fill="#dc2626" />

      {/* Right arm — raised in abhaya mudra (blessing), fingers together */}
      <path
        d="M45 78 Q34 68 32 50"
        fill="none"
        stroke="#e4a86b"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="32" cy="46" r="6.5" fill="#e4a86b" />
      {/* Fingers on right palm */}
      <path
        d="M28 42.5 L27.5 36 M31 40.5 L31 33.5 M34.5 41 L36.5 34.5 M36.5 46 L40.5 44"
        stroke="#e4a86b"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Bangles on right wrist */}
      <path d="M35.5 76 L43 78.5" stroke="url(#lx-gold)" strokeWidth="2.6" />
      <path d="M30 60 L37 61.5" stroke="url(#lx-gold)" strokeWidth="2" />
      <path d="M29.5 63 L36.5 64.5" stroke="url(#lx-gold)" strokeWidth="1.5" />

      {/* Left arm — cradling coins */}
      <path
        d="M75 78 Q88 75 95 86"
        fill="none"
        stroke="#e4a86b"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <circle cx="96" cy="90" r="6.5" fill="#e4a86b" />
      {/* Coins spilling from left palm */}
      <circle cx="93" cy="94" r="3" fill="url(#lx-coin)" stroke="#7a4e08" strokeWidth="0.5" />
      <circle cx="99" cy="93" r="2.5" fill="url(#lx-coin)" stroke="#7a4e08" strokeWidth="0.5" />
      <circle cx="97" cy="98" r="2.8" fill="url(#lx-coin)" stroke="#7a4e08" strokeWidth="0.5" />
      <circle cx="102" cy="97" r="2" fill="url(#lx-coin)" stroke="#7a4e08" strokeWidth="0.4" />
      <circle cx="94" cy="100" r="2" fill="url(#lx-coin)" stroke="#7a4e08" strokeWidth="0.4" />
      {/* Bangles on left wrist */}
      <path d="M76 76.5 L84 76" stroke="url(#lx-gold)" strokeWidth="2.6" />
      <path d="M91 85 L98 84.2" stroke="url(#lx-gold)" strokeWidth="2" />
      <path d="M91.5 87.5 L98.5 86.7" stroke="url(#lx-gold)" strokeWidth="1.5" />

      {/* Hair — long, framing the face */}
      <path d="M44 32 Q41 42 44 55 L48 55 Q45 44 48 32 Z" fill="#241a12" />
      <path d="M76 32 Q79 42 76 55 L72 55 Q75 44 72 32 Z" fill="#241a12" />

      {/* Ears + earrings */}
      <circle cx="45.5" cy="43" r="2.8" fill="#e4a86b" />
      <circle cx="74.5" cy="43" r="2.8" fill="#e4a86b" />
      <circle cx="45.5" cy="47.5" r="1.8" fill="url(#lx-gold)" stroke="#7a4e08" strokeWidth="0.5" />
      <circle cx="74.5" cy="47.5" r="1.8" fill="url(#lx-gold)" stroke="#7a4e08" strokeWidth="0.5" />

      {/* Face — serene */}
      <circle cx="60" cy="42" r="13.8" fill="#e4a86b" />
      {/* Gentle cheek warmth */}
      <circle cx="50.5" cy="45.5" r="2.5" fill="#d97a54" opacity="0.35" />
      <circle cx="69.5" cy="45.5" r="2.5" fill="#d97a54" opacity="0.35" />
      {/* Brows — soft, symmetric */}
      <path d="M51 36 Q54.5 34.5 57 36 M63 36 Q65.5 34.5 69 36" fill="none" stroke="#241a12" strokeWidth="1.4" strokeLinecap="round" />
      {/* Eyes — slightly downcast, serene */}
      <path d="M52 40 Q54.5 42 57 40" fill="none" stroke="#241a12" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M63 40 Q65.5 42 68 40" fill="none" stroke="#241a12" strokeWidth="1.5" strokeLinecap="round" />
      {/* Third eye / tilaka */}
      <path d="M60 32.5 L60 36.5" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" />
      {/* Bindi */}
      <circle cx="60" cy="31" r="1.6" fill="#dc2626" />
      {/* Nose */}
      <path d="M60 41 L58.7 46 Q60 47 61.3 46 Z" fill="#c9743d" />
      {/* Nose stud */}
      <circle cx="57" cy="45" r="0.7" fill="url(#lx-gold)" />
      {/* Serene closed-mouth smile */}
      <path d="M56 50 Q60 51.6 64 50" fill="none" stroke="#8a3f2a" strokeWidth="1.4" strokeLinecap="round" />

      {/* Crown (mukut) — temple-shaped, three points */}
      <path
        d="M43 27 L47 15 L51.5 22 L55 12 L60 5 L65 12 L68.5 22 L73 15 L77 27 Z"
        fill="url(#lx-gold)"
        stroke="#7a4e08"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {/* Crown jewels */}
      <circle cx="60" cy="19" r="2.2" fill="#dc2626" stroke="#7a4e08" strokeWidth="0.4" />
      <circle cx="51" cy="21" r="1.4" fill="#2f9e63" stroke="#7a4e08" strokeWidth="0.3" />
      <circle cx="69" cy="21" r="1.4" fill="#2f9e63" stroke="#7a4e08" strokeWidth="0.3" />
      {/* Crown finials */}
      <circle cx="47" cy="14" r="1.4" fill="url(#lx-gold)" stroke="#7a4e08" strokeWidth="0.4" />
      <circle cx="60" cy="4.5" r="1.8" fill="url(#lx-gold)" stroke="#7a4e08" strokeWidth="0.4" />
      <circle cx="73" cy="14" r="1.4" fill="url(#lx-gold)" stroke="#7a4e08" strokeWidth="0.4" />
      {/* Crown base band */}
      <rect x="42" y="26.5" width="36" height="5" rx="2" fill="url(#lx-gold)" stroke="#7a4e08" strokeWidth="0.5" />
    </svg>
  );
}

export const LAKSHMI: CharacterConfig = {
  id: "lakshmi",
  name: "Goddess Lakshmi",
  storageKey: "dhanteras-2026-lakshmi-dismissed",
  window: { start: WINDOW_START, end: WINDOW_END },
  ariaLabel: {
    en: "Tap Goddess Lakshmi for a Dhanteras blessing",
    ml: "ധനത്രയോദശി അനുഗ്രഹത്തിനായി ലക്ഷ്മീദേവിയെ തൊടുക",
  },
  tapHint: {
    en: "Dhanteras blessings — tap 🙏",
    ml: "ധനത്രയോദശിയുടെ അനുഗ്രഹം — തൊടൂ 🙏",
  },
  blessings: { en: BLESSINGS_EN, ml: BLESSINGS_ML },
  buildRateLines,
  shareIntro: "🪔",
  shareLabel: {
    en: "Share the blessing 🪔",
    ml: "അനുഗ്രഹം പങ്കുവയ്ക്കൂ 🪔",
  },
  // Gold coin burst — golds, warm whites, a Diwali red spark.
  particleColors: ["#fbbf24", "#facc15", "#f59e0b", "#fef3c7", "#ffffff", "#fde68a", "#dc2626"],
  // Lakshmi doesn't walk. The container still translates horizontally so
  // she drifts across, but no leg/arm bob.
  hasGait: false,
  Art: LakshmiSvg,
  theme: { trimClass: "dhanteras-trim", washClass: "dhanteras-glow" },
};

export const DHANTERAS_START = WINDOW_START;
export const DHANTERAS_END = WINDOW_END;
