import type { ComponentType, CSSProperties } from "react";

/** A single blessing line, tagged with its language for lang attributes. */
export interface Line {
  text: string;
  ml?: boolean;
}

export const en = (text: string): Line => ({ text });
export const ml = (text: string): Line => ({ text, ml: true });

/**
 * Everything a seasonal character needs to appear on the site.
 *
 * Design intent: each new character (Vishu Krishna, Akshaya Tritiya Kubera,
 * Dhanteras Lakshmi…) is a config file + an SVG. All the animation, blessing
 * bubble, share bar, dismiss handling, rate-reactive picker and mobile behaviour
 * live in SeasonalCharacter and never change.
 */
export interface CharacterConfig {
  /** Stable id — used in aria labels + storage key generation. */
  id: string;
  /** Display name — kept for future use (e.g. GA event). */
  name: string;
  /** localStorage key for "dismiss for the season". Include the year. */
  storageKey: string;
  /** IST window when the character rides in. Both bounds inclusive. */
  window: { start: Date; end: Date };

  /** Accessible label on the tap button, in each language. */
  ariaLabel: { en: string; ml: string };
  /** Tooltip on hover, in each language. */
  tapHint: { en: string; ml: string };

  /** Generic blessings pulled from at random after the first tap. */
  blessings: { en: Line[]; ml: Line[] };
  /** Rate-reactive lines. Called with today's rate + delta; returns 0-N lines. */
  buildRateLines: (
    rate22k: number | null,
    change: number | null,
    ml: boolean,
  ) => Line[];

  /** Prefix on the shared WhatsApp blessing (usually an emoji). */
  shareIntro: string;
  /** "Share the blessing" button label. */
  shareLabel: { en: string; ml: string };

  /** Colors for the particle burst on each tap. */
  particleColors: string[];
  /**
   * Whether the character has a walking gait. Onam Mahabali strides across;
   * a goddess-on-lotus glides. When false, the SVG's transform still moves
   * but the CSS gait classes are skipped so nothing bobs or takes strides.
   */
  hasGait?: boolean;
  /**
   * If provided, applied as inline style to the container that holds the
   * SVG — handy for tuning size or a per-character glow.
   */
  containerStyle?: CSSProperties;

  /** The SVG mascot. Rendered inside the tappable button. */
  Art: ComponentType;

  /**
   * Optional site-wide dressing for the character's season — a thin trim
   * across the top of every page, and a soft wash of colour behind the top
   * of the viewport. Both are class names that must exist in globals.css.
   * Omit to skip theming for that character (rare — usually the whole point
   * is a matching visual cue).
   */
  theme?: {
    trimClass?: string;
    washClass?: string;
  };
}
