import type { CharacterConfig } from "../types";
import { en, ml } from "../types";

/**
 * Akshaya Tritiya 2027 — Kubera, treasurer of the gods. This is the single
 * biggest gold-buying day of the Indian year: "akshaya" means "imperishable",
 * so gold purchased today is said to never diminish. On a rate-checking site
 * this is the character that matters most — the audience is quite literally
 * about to spend money, and Kubera's traditional role is the wise steward
 * of wealth.
 *
 * Tone: reverent-but-practical, like a trusted family accountant who is also
 * divine. Not folkloric like Mahabali, not benedictory like Lakshmi, not
 * playful like Krishna — Kubera reminds you that the auspicious day rewards
 * discernment, not haste. He glides on a treasure chest (hasGait: false) —
 * imagery of the god who literally sits on his hoard.
 *
 * Akshaya Tritiya 2027 falls on ~9 May. Bump dates + storage key next year.
 */

const WINDOW_START = new Date("2027-05-05T00:00:00+05:30");
const WINDOW_END = new Date("2027-05-12T23:59:59+05:30");

const BLESSINGS_EN = [
  en("Akshaya Tritiya blessings! 🪙 May today's gold never diminish — akshaya means 'imperishable'."),
  en("The most auspicious day for gold — but auspicious does not mean automatic. Verify before you spend."),
  en("Blessings on your purchase. What you buy today grows, but only if it's true. ✨"),
  en("Every gramme laid down today is said to endure. May yours be genuine 916. 🌟"),
  en("Wealth accumulates when it's guarded well. Read the bill, save the receipt."),
  en("May today's investment become tomorrow's inheritance. Choose the hallmark, not the biggest ornament."),
  en("On Akshaya Tritiya the imperishable rewards intention. Buy small, buy pure, buy calmly."),
];

const BLESSINGS_ML = [
  ml("അക്ഷയ തൃതീയയുടെ ശുഭാശംസകൾ! 🪙 ഇന്നത്തെ സ്വർണ്ണം ക്ഷയിക്കാതിരിക്കട്ടെ — അക്ഷയമെന്നാൽ 'ശാശ്വതം'."),
  ml("സ്വർണ്ണത്തിന് ഏറ്റവും ശുഭകരമായ ദിവസം — എന്നാൽ ശുഭകരമെന്നാൽ അലക്ഷ്യമെന്നല്ല. വാങ്ങുന്നതിന് മുമ്പ് പരിശോധിക്കൂ."),
  ml("വാങ്ങലിന് അനുഗ്രഹങ്ങൾ. ഇന്ന് വാങ്ങുന്നത് വളരും — യഥാർത്ഥമാണെങ്കിൽ മാത്രം. ✨"),
  ml("ഇന്ന് വാങ്ങുന്ന ഓരോ ഗ്രാമും ശാശ്വതമെന്ന് വിശ്വാസം. നിങ്ങളുടേത് യഥാർത്ഥ 916 ആകട്ടെ. 🌟"),
  ml("സമ്പത്ത് വളരുന്നത് നന്നായി കാത്തുസൂക്ഷിക്കുമ്പോൾ. ബില്ല് വായിക്കൂ, രസീത് സൂക്ഷിക്കൂ."),
  ml("ഇന്നത്തെ വാങ്ങൽ നാളത്തെ പൈതൃകമാകട്ടെ. ഏറ്റവും വലിയ ആഭരണമല്ല, ഹാൾമാർക്ക് തിരഞ്ഞെടുക്കൂ."),
  ml("അക്ഷയ തൃതീയക്ക് ശാശ്വതം ഉദ്ദേശ്യത്തെ ബഹുമാനിക്കുന്നു. ചെറുതും ശുദ്ധവുമായി, ശാന്തതയോടെ വാങ്ങൂ."),
];

function buildRateLines(rate22k: number | null, change: number | null, malayalam: boolean) {
  if (rate22k == null) return [];
  const rate = `₹${rate22k.toLocaleString("en-IN")}`;
  const d = change != null ? `₹${Math.abs(change).toLocaleString("en-IN")}` : "";

  if (malayalam) {
    const lines = [
      ml(`ഇന്നത്തെ 22K വില ${rate}/ഗ്രാം. അക്ഷയ തൃതീയക്ക് അനുഗ്രഹീത ദിവസം. 🪙`),
    ];
    if (change != null && change < 0) {
      lines.push(
        ml(`ബോർഡ് അക്ഷയ തൃതീയക്ക് അനുകൂലം — 22K ${d} കുറഞ്ഞു. വിവേകം പ്രതിഫലിക്കുന്നു.`),
        ml(`${d} കുറഞ്ഞു. അക്ഷയമെന്നാൽ ശാശ്വതം — ഇന്ന് വാങ്ങുന്നത് നിലനിൽക്കും.`),
      );
    } else if (change != null && change > 0) {
      lines.push(
        ml(`അക്ഷയ തൃതീയക്ക് വില ${d} കൂടി — എന്നാൽ ചെറിയ യഥാർത്ഥ 916, വലിയ കൃത്രിമത്തിനേക്കാൾ ദീർഘകാലം നിലനിൽക്കും.`),
        ml(`22K ${d} കയറി. തിടുക്കത്തിലല്ല, ഉദ്ദേശ്യത്തോടെ വാങ്ങൂ, കുഞ്ഞേ.`),
      );
    } else if (change === 0) {
      lines.push(ml("വില സ്ഥിരമായി നിൽക്കുന്നു. ഏറ്റവും ശുഭകരമായ ദിവസം, സ്ഥിരമായ വില — ഉദ്ദേശ്യത്തോടെ വാങ്ങൂ."));
    }
    return lines;
  }

  const lines = [en(`Today's 22K is ${rate}/g. A blessed day for the imperishable. 🪙`)];
  if (change != null && change < 0) {
    lines.push(
      en(`The board favours you on Akshaya Tritiya — 22K down ${d}. Wisdom rewarded.`),
      en(`A dip of ${d}. Akshaya means imperishable — what you lay down today endures.`),
    );
  } else if (change != null && change > 0) {
    lines.push(
      en(`Rate rises on Akshaya Tritiya — up ${d}. A small piece of true 916 outlasts a large piece of alloy.`),
      en(`22K climbs ${d}. Intention over haste, my friend. The imperishable can wait for the right ounce.`),
    );
  } else if (change === 0) {
    lines.push(en("Steady today. The most auspicious day, a stable price — buy with intention."));
  }
  return lines;
}

/**
 * Original artwork — Kubera the yaksha-king, seated on a treasure chest, one
 * hand holding a jewelled pot of overflowing coins, the other in varada
 * mudra (palm out, fingers down — the "granting boon" gesture). Round belly
 * signifying abundance, elaborate crown, red-and-gold robe, calm benevolent
 * face with a heavy moustache. Different from Mahabali (jolly folkloric
 * king striding across) and Lakshmi (serene goddess on lotus): Kubera
 * feels like a wealthy divine steward — grounded, weighty, generous.
 *
 * Glides on the treasure chest (hasGait: false). Coin heap spills toward
 * the viewer at the front of the chest — the wealth is visibly emerging
 * from his hoard.
 */
function KuberaSvg() {
  return (
    <svg
      viewBox="0 0 120 152"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-[76px] drop-shadow-md sm:w-[90px]"
      role="img"
      aria-label="Kubera, treasurer of the gods"
    >
      <defs>
        <radialGradient id="kb-halo" cx="50%" cy="42%" r="55%">
          <stop offset="0%" stopColor="#fff5c8" />
          <stop offset="55%" stopColor="#f3b93a" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#a86a10" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="kb-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffdf6b" />
          <stop offset="55%" stopColor="#f3b93a" />
          <stop offset="100%" stopColor="#7a4e08" />
        </linearGradient>
        <linearGradient id="kb-robe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e63946" />
          <stop offset="100%" stopColor="#8b0e1c" />
        </linearGradient>
        <radialGradient id="kb-coin" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff2a8" />
          <stop offset="60%" stopColor="#f3b93a" />
          <stop offset="100%" stopColor="#7a4e08" />
        </radialGradient>
        <linearGradient id="kb-chest" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5a1c" />
          <stop offset="100%" stopColor="#4a2d05" />
        </linearGradient>
      </defs>

      {/* Halo */}
      <circle cx="60" cy="46" r="42" fill="url(#kb-halo)" />

      {/* Ground shadow */}
      <ellipse cx="60" cy="150" rx="30" ry="2.8" fill="#000" opacity="0.14" />

      {/* Treasure chest — the pedestal */}
      <g>
        {/* body of chest */}
        <rect x="30" y="132" width="60" height="16" rx="1.5" fill="url(#kb-chest)" stroke="#3a1f04" strokeWidth="0.7" />
        {/* domed lid, open, tilted slightly back */}
        <path d="M28 132 Q60 118 92 132 Z" fill="#a37438" stroke="#3a1f04" strokeWidth="0.7" />
        {/* iron banding */}
        <path d="M42 132 L42 148 M78 132 L78 148" stroke="#3a1f04" strokeWidth="1.2" />
        {/* lock plate */}
        <rect x="55" y="139" width="10" height="6" rx="1" fill="url(#kb-gold)" stroke="#3a1f04" strokeWidth="0.5" />
        <circle cx="60" cy="142" r="1.2" fill="#3a1f04" />

        {/* Coin heap spilling from the front lip of the chest */}
        {[
          [40, 148, 3], [48, 149, 2.8], [55, 149.5, 3], [63, 149, 2.6], [70, 149.5, 2.9], [78, 149, 2.7],
          [44, 145, 2.4], [52, 146, 2.6], [60, 147, 2.4], [68, 146, 2.5], [76, 145, 2.6],
        ].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="url(#kb-coin)" stroke="#7a4e08" strokeWidth="0.4" />
        ))}
      </g>

      {/* Everything above rocks gently as one body — no leg gait since he sits. */}
      <g className="mb-figure">
        {/* Legs folded in front of the chest — soft cross-legged suggestion */}
        <ellipse cx="60" cy="128" rx="26" ry="8" fill="url(#kb-robe)" stroke="#5a0910" strokeWidth="0.6" />
        {/* Gold border on the folded robe */}
        <path d="M35 128 Q60 133 85 128" fill="none" stroke="url(#kb-gold)" strokeWidth="1.4" />
        {/* Toe hint peeking out */}
        <circle cx="42" cy="130" r="3" fill="#c98a5c" />
        <circle cx="78" cy="130" r="3" fill="#c98a5c" />

        {/* Torso — round, jolly, red robe */}
        <ellipse cx="60" cy="105" rx="24" ry="14" fill="url(#kb-robe)" stroke="#5a0910" strokeWidth="0.6" />
        {/* Round belly bulging forward */}
        <ellipse cx="60" cy="112" rx="20" ry="12" fill="url(#kb-robe)" opacity="0.7" />

        {/* Angavastram (gold sash) — draped across the chest */}
        <path d="M42 82 L52 79 L78 118 L68 122 Z" fill="url(#kb-gold)" opacity="0.9" stroke="#7a4e08" strokeWidth="0.4" />
        <path d="M45 81 L71 120" stroke="#ffdf6b" strokeWidth="0.8" />

        {/* Waist belt with medallion */}
        <path d="M38 108 Q60 114 82 108 L82 114 Q60 120 38 114 Z" fill="url(#kb-gold)" stroke="#7a4e08" strokeWidth="0.5" />
        <circle cx="60" cy="114" r="3.6" fill="#ffdf6b" stroke="#7a4e08" strokeWidth="0.6" />
        <circle cx="60" cy="114" r="1.2" fill="#dc2626" />

        {/* Right arm (viewer's left) — varada mudra, palm out */}
        <path d="M42 88 Q30 96 30 112" fill="none" stroke="#c98a5c" strokeWidth="8" strokeLinecap="round" />
        <circle cx="30" cy="115" r="5.5" fill="#c98a5c" />
        {/* fingers — held down, palm toward viewer */}
        <path
          d="M27 118 L26 124 M30 119 L30.5 125 M33.5 118 L34.5 124"
          stroke="#c98a5c"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* bangles on right wrist */}
        <path d="M32 87 L42 87" stroke="url(#kb-gold)" strokeWidth="2.8" />
        <path d="M27 108 L34 108" stroke="url(#kb-gold)" strokeWidth="1.8" />
        <path d="M27 111 L34 111" stroke="url(#kb-gold)" strokeWidth="1.4" />

        {/* Left arm (viewer's right) — holds jewelled pot of coins */}
        <path d="M78 88 Q90 92 92 104" fill="none" stroke="#c98a5c" strokeWidth="8" strokeLinecap="round" />
        <circle cx="92" cy="108" r="5" fill="#c98a5c" />
        {/* pot of overflowing coins */}
        <path d="M83 108 Q92 100 101 108 L98 116 L86 116 Z" fill="url(#kb-gold)" stroke="#7a4e08" strokeWidth="0.6" />
        <path d="M84 108 L100 108" stroke="#ffdf6b" strokeWidth="0.8" />
        {/* coins spilling from the pot */}
        <circle cx="88" cy="106" r="1.8" fill="url(#kb-coin)" stroke="#7a4e08" strokeWidth="0.3" />
        <circle cx="93" cy="105" r="1.6" fill="url(#kb-coin)" stroke="#7a4e08" strokeWidth="0.3" />
        <circle cx="97" cy="106.5" r="1.5" fill="url(#kb-coin)" stroke="#7a4e08" strokeWidth="0.3" />
        <circle cx="90" cy="104" r="1.3" fill="url(#kb-coin)" stroke="#7a4e08" strokeWidth="0.2" />
        {/* bangles on left wrist */}
        <path d="M78 86 L86 84" stroke="url(#kb-gold)" strokeWidth="2.8" />

        {/* Neck */}
        <rect x="54.5" y="62" width="11" height="8" rx="3" fill="#c98a5c" />

        {/* Elaborate multi-strand necklace */}
        <path d="M45 70 Q60 82 75 70" fill="none" stroke="url(#kb-gold)" strokeWidth="3" />
        <path d="M48 72 Q60 79 72 72" fill="none" stroke="#ffdf6b" strokeWidth="1.6" />
        <circle cx="60" cy="80" r="3.4" fill="url(#kb-gold)" stroke="#7a4e08" strokeWidth="0.6" />
        <circle cx="60" cy="80" r="1.2" fill="#dc2626" />

        {/* Head — broad, jolly */}
        {/* hair puffs at sides */}
        <path d="M45 34 Q42 40 44 50 L48 50 Q46 42 48 34 Z" fill="#241a12" />
        <path d="M75 34 Q78 40 76 50 L72 50 Q74 42 72 34 Z" fill="#241a12" />
        {/* Ears + gold earrings */}
        <circle cx="46" cy="46" r="3" fill="#c98a5c" />
        <circle cx="74" cy="46" r="3" fill="#c98a5c" />
        <circle cx="46" cy="50" r="1.7" fill="none" stroke="url(#kb-gold)" strokeWidth="1.3" />
        <circle cx="74" cy="50" r="1.7" fill="none" stroke="url(#kb-gold)" strokeWidth="1.3" />
        {/* Face */}
        <circle cx="60" cy="46" r="15" fill="#c98a5c" />
        {/* full cheeks */}
        <circle cx="48.5" cy="50" r="3.5" fill="#a86e42" opacity="0.4" />
        <circle cx="71.5" cy="50" r="3.5" fill="#a86e42" opacity="0.4" />
        {/* brows — thick */}
        <path d="M49 38 Q53.5 36.5 57 38 M63 38 Q66.5 36.5 71 38" fill="none" stroke="#241a12" strokeWidth="1.8" strokeLinecap="round" />
        {/* eyes — kind, half-lidded */}
        <ellipse cx="53.5" cy="43" rx="2.5" ry="2.6" fill="#fff" />
        <ellipse cx="66.5" cy="43" rx="2.5" ry="2.6" fill="#fff" />
        <circle cx="53.8" cy="43.5" r="1.4" fill="#3a2417" />
        <circle cx="66.8" cy="43.5" r="1.4" fill="#3a2417" />
        <circle cx="54.3" cy="43" r="0.4" fill="#fff" />
        <circle cx="67.3" cy="43" r="0.4" fill="#fff" />
        {/* third eye */}
        <path d="M60 34 L60 38" stroke="#eab308" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="60" cy="35.5" r="1.4" fill="#dc2626" />
        {/* nose */}
        <path d="M60 44 L58.4 50 Q60 51 61.6 50 Z" fill="#a86e42" />
        {/* moustache — broad, drooping (distinguishes from Mahabali's upward curl) */}
        <path
          d="M60 52 Q52 55 46 54 Q42 53 42.5 50 Q46 52 50 52 Q54 52 60 51 Q66 52 70 52 Q74 52 77.5 50 Q78 53 74 54 Q68 55 60 52 Z"
          fill="#241a12"
        />
        {/* mouth beneath moustache — closed, benevolent */}
        <path d="M56 56 Q60 57.5 64 56" fill="none" stroke="#3a2417" strokeWidth="1.2" strokeLinecap="round" />

        {/* Elaborate kirita crown — taller than Mahabali's, curved */}
        <path
          d="M43 30 L45 16 L48 24 L53 12 L60 4 L67 12 L72 24 L75 16 L77 30 Z"
          fill="url(#kb-gold)"
          stroke="#7a4e08"
          strokeWidth="0.9"
          strokeLinejoin="round"
        />
        {/* crown jewels — larger central */}
        <circle cx="60" cy="18" r="2.6" fill="#dc2626" stroke="#7a4e08" strokeWidth="0.4" />
        <circle cx="53" cy="20" r="1.4" fill="#2f9e63" stroke="#7a4e08" strokeWidth="0.3" />
        <circle cx="67" cy="20" r="1.4" fill="#2f9e63" stroke="#7a4e08" strokeWidth="0.3" />
        <circle cx="47.5" cy="22" r="1" fill="#a5b4fc" stroke="#7a4e08" strokeWidth="0.2" />
        <circle cx="72.5" cy="22" r="1" fill="#a5b4fc" stroke="#7a4e08" strokeWidth="0.2" />
        {/* crown finials */}
        <circle cx="45" cy="15" r="1.5" fill="url(#kb-gold)" stroke="#7a4e08" strokeWidth="0.4" />
        <circle cx="60" cy="3" r="2" fill="url(#kb-gold)" stroke="#7a4e08" strokeWidth="0.4" />
        <circle cx="75" cy="15" r="1.5" fill="url(#kb-gold)" stroke="#7a4e08" strokeWidth="0.4" />
        {/* crown band */}
        <rect x="42" y="29" width="36" height="5" rx="2" fill="url(#kb-gold)" stroke="#7a4e08" strokeWidth="0.5" />
      </g>
    </svg>
  );
}

export const KUBERA: CharacterConfig = {
  id: "kubera",
  name: "Kubera",
  storageKey: "akshaya-tritiya-2027-kubera-dismissed",
  window: { start: WINDOW_START, end: WINDOW_END },
  ariaLabel: {
    en: "Tap Kubera for an Akshaya Tritiya blessing",
    ml: "അക്ഷയ തൃതീയ അനുഗ്രഹത്തിനായി കുബേരനെ തൊടുക",
  },
  tapHint: {
    en: "Akshaya Tritiya blessings — tap 🪙",
    ml: "അക്ഷയ തൃതീയ അനുഗ്രഹങ്ങൾ — തൊടൂ 🪙",
  },
  blessings: { en: BLESSINGS_EN, ml: BLESSINGS_ML },
  buildRateLines,
  shareIntro: "🪙",
  shareLabel: {
    en: "Share the blessing 🪙",
    ml: "അനുഗ്രഹം പങ്കുവയ്ക്കൂ 🪙",
  },
  // Pure gold with a small red spark for prosperity — heavier gold than
  // Lakshmi's (whose palette leaned pink from the lotus). Kubera is coins.
  particleColors: ["#fbbf24", "#facc15", "#f59e0b", "#eab308", "#ffdf6b", "#fef3c7", "#dc2626"],
  // Kubera sits — glides across on the treasure chest, no walking gait.
  hasGait: false,
  Art: KuberaSvg,
  theme: { trimClass: "akshaya-trim", washClass: "akshaya-glow" },
};

export const AKSHAYA_START = WINDOW_START;
export const AKSHAYA_END = WINDOW_END;
