"use client";

import { useState } from "react";
import { Share2, Loader2, Check } from "lucide-react";

/**
 * One-tap share that reaches the whole OS share sheet on mobile.
 *
 * Why this replaces "WhatsApp text + Download rate card" as two buttons:
 * on mobile (82% of traffic) navigator.share() attaches the rate card image
 * AND the text AND the URL in a single sheet — recipient sees the price on
 * the image, tap-through carries them to the site. Instagram, Signal, iMessage,
 * SMS, Telegram, email — the whole surface, not just WhatsApp.
 *
 * Desktop and older browsers fall back to the WhatsApp URL scheme so the
 * existing behaviour is preserved. UTMs are always applied so shared traffic
 * shows up separately from organic in GSC/analytics.
 */

export interface NativeShareButtonProps {
  /** Text sent alongside the URL (and image, if any). */
  text: string;
  /** URL to share — will be UTM-tagged. */
  url: string;
  /**
   * Optional image to attach (usually a route like /api/og/gold-rate-card).
   * Fetched on click, converted to File, attached via navigator.share.
   * If sharing files isn't supported, we just share text + URL.
   */
  imageUrl?: string;
  /** Filename for the attached image (should end in .png/.jpg). */
  imageFilename?: string;
  /** Button label. Defaults to "Share". */
  label?: string;
  /** UTM source (which surface the button lives on). */
  utmSource?: string;
  /** UTM campaign (what's being shared). */
  utmCampaign?: string;
  /** Visual variant — "primary" is amber-filled, "outline" is a lighter card look. */
  variant?: "primary" | "outline";
  /** Short a11y title on hover. */
  title?: string;
}

function appendUtm(
  url: string,
  { source, medium, campaign }: { source: string; medium: string; campaign: string }
): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", source);
    u.searchParams.set("utm_medium", medium);
    u.searchParams.set("utm_campaign", campaign);
    return u.toString();
  } catch {
    return url;
  }
}

export default function NativeShareButton({
  text,
  url,
  imageUrl,
  imageFilename = "gold-rate.png",
  label = "Share",
  utmSource = "share_button",
  utmCampaign = "rate_card",
  variant = "primary",
  title,
}: NativeShareButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "shared">("idle");

  async function handleClick() {
    // Native share carries no attribution about which app the user picked,
    // so we tag with medium=native. WhatsApp fallback tags medium=whatsapp.
    const nativeUrl = appendUtm(url, {
      source: utmSource,
      medium: "native",
      campaign: utmCampaign,
    });

    // Feature-detect once, before the fetch.
    const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

    if (canNativeShare && imageUrl) {
      setState("loading");
      try {
        const res = await fetch(imageUrl);
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const blob = await res.blob();
        const file = new File([blob], imageFilename, { type: blob.type || "image/png" });
        // canShare with a file is a separate feature check — some browsers
        // support navigator.share for text+url only.
        const nav = navigator as Navigator & {
          canShare?: (data: ShareData) => boolean;
        };
        if (nav.canShare?.({ files: [file] })) {
          await nav.share({ text, url: nativeUrl, files: [file] });
          setState("shared");
          setTimeout(() => setState("idle"), 1600);
          return;
        }
        // Files not sharable — fall through to text+url share.
        await nav.share({ text, url: nativeUrl });
        setState("shared");
        setTimeout(() => setState("idle"), 1600);
        return;
      } catch (err) {
        // AbortError = user dismissed the share sheet, no fallback needed.
        if ((err as { name?: string }).name === "AbortError") {
          setState("idle");
          return;
        }
        // Anything else (network error, denied permission) → WhatsApp fallback.
      }
    } else if (canNativeShare) {
      try {
        await (navigator as Navigator).share({ text, url: nativeUrl });
        setState("shared");
        setTimeout(() => setState("idle"), 1600);
        return;
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
        // fall through
      }
    }

    // Fallback: open WhatsApp with the text and (UTM-tagged) URL.
    const waUrl = appendUtm(url, {
      source: utmSource,
      medium: "whatsapp",
      campaign: utmCampaign,
    });
    const waHref = `https://wa.me/?text=${encodeURIComponent(`${text}\n${waUrl}`)}`;
    window.open(waHref, "_blank", "noopener,noreferrer");
    setState("idle");
  }

  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition-all active:scale-[0.98] disabled:opacity-70";
  const styles =
    variant === "primary"
      ? "bg-amber-500 text-white shadow-amber-500/25 ring-1 ring-inset ring-white/20 hover:bg-amber-600 hover:shadow-md"
      : "border border-amber-200/60 bg-amber-50/50 text-amber-800 hover:border-amber-300 hover:bg-amber-100/70 dark:border-amber-800/40 dark:bg-amber-950/20 dark:text-amber-400 dark:hover:bg-amber-900/30";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      title={title}
      className={`${base} ${styles}`}
    >
      {state === "loading" ? (
        <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
      ) : state === "shared" ? (
        <Check className="h-4 w-4 shrink-0" />
      ) : (
        <Share2 className="h-4 w-4 shrink-0" />
      )}
      {state === "shared" ? "Shared!" : label}
    </button>
  );
}
