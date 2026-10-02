import { Metadata } from "next";
import Link from "next/link";
import { createSupabaseReadClient } from "@/lib/supabase";
import GoldCalculator from "@/components/GoldCalculator";
import RelatedTools from "@/components/RelatedTools";
import SiblingCalculators from "@/components/SiblingCalculators";

export const revalidate = 86400; // daily; freshness pushed on-demand by the update-rates cron (revalidatePath)

export async function generateMetadata(): Promise<Metadata> {
  let rateSnippet = "";
  let descRate = "";

  try {
    const supabase = createSupabaseReadClient();
    const { data } = await supabase
      .from("daily_gold_rates")
      .select("date, rate_22k_1g")
      .eq("city", "Kochi")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (data) {
      const rate = data.rate_22k_1g;
      const dateStr = new Date(data.date + "T00:00:00").toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      });
      rateSnippet = ` — 22K ₹${rate.toLocaleString("en-IN")}/g (${dateStr})`;
      descRate = `Today's 22K rate is ₹${rate.toLocaleString("en-IN")}/g. `;
    }
  } catch {
    // fall through to static fallback
  }

  // Title captures three CTR clusters we were ranking high (pos 1-7) but
  // getting 0 clicks on: panikooli (90 imp/mo), pavan making-charge queries
  // (64 imp/mo), per-gram queries. Head term "gold making charges in Kerala"
  // stays front-loaded for the winning 5%+ CTR query.
  const title = `Gold Making Charges (Panikooli) in Kerala — Per Pavan & Gram${rateSnippet}`;
  // Description leads with chain/ring/bangle intent to catch the 60+ imp/mo
  // of chain-making-charge queries where the user wants a typical range, not
  // just a calculator.
  const description = `Chain, ring, bangle or pavan — typical gold making charges (panikooli) in Kerala. ${descRate}Calculate 8–25% MC + 3% GST for 22K, 24K, 18K.`;

  return {
    title,
    description,
    alternates: { canonical: "/tools/gold-making-charge-calculator" },
    openGraph: {
      title: `Gold Making Charges (Panikooli) in Kerala — Per Pavan & Gram`,
      description,
      url: "https://www.livegoldkerala.com/tools/gold-making-charge-calculator",
    },
  };
}

async function getLatestRates() {
  try {
    const supabase = createSupabaseReadClient();
    const { data, error } = await supabase
      .from("daily_gold_rates")
      .select("rate_18k_1g, rate_22k_1g, rate_24k_1g")
      .eq("city", "Kochi")
      .order("date", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;
    return data;
  } catch {
    return null;
  }
}

export default async function GoldMakingChargeCalculatorPage() {
  const rates = await getLatestRates();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Kerala Gold Making Charge & GST Calculator",
    description:
      "Calculate the total cost of gold jewelry in Kerala including making charges and 3% GST.",
    url: "https://www.livegoldkerala.com/tools/gold-making-charge-calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted"
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: 0,
          currency: "INR"
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN"
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY"
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 0,
            unitCode: "DAY"
          }
        }
      }
    },
  };

  return (
    <>
      {/* Static hardcoded JSON-LD, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-6 md:gap-10 md:py-12">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 md:text-3xl">
          Kerala Gold Making Charge &amp; GST Calculator
        </h1>

        {rates ? (
          <GoldCalculator
            rate18k={rates.rate_18k_1g}
            rate22k={rates.rate_22k_1g}
            rate24k={rates.rate_24k_1g}
          />
        ) : (
          <div className="rounded-2xl border border-zinc-200/70 bg-white p-8 text-center shadow-md">
            <p className="text-sm text-zinc-500">
              Gold rates are currently unavailable. Please check back shortly.
            </p>
          </div>
        )}

        <SiblingCalculators exclude={["/tools/gold-making-charge-calculator"]} />

        <section className="space-y-4 text-sm leading-relaxed text-zinc-600 md:text-base">
          <p>
            When you buy gold jewelry from a showroom in Kerala, the price you
            pay is more than just the gold value. Jewellers add a{" "}
            <strong className="text-zinc-800">making charge</strong> — typically
            between <strong className="text-zinc-800">8% and 25%</strong> of the
            gold value — to cover the cost of craftsmanship, design, and
            wastage. Simple designs like chains and plain bangles sit at the
            lower end, while intricate antique or temple jewellery can reach the
            higher end.
          </p>
          <p>
            On top of the gold value and making charges, the Government of India
            levies a mandatory{" "}
            <strong className="text-zinc-800">3% GST</strong> on the total
            invoice amount (gold + making charge). This tax is uniform across
            all states and applies whether you buy from a large chain or a local
            jeweller. Understanding this breakdown helps you compare quotes from
            different showrooms and avoid overpaying.
          </p>
          <p>
            Use the calculator above to enter your desired weight and purity,
            adjust the making charge percentage, and instantly see how the final
            price is split between gold value, making charge, and GST. It is a
            quick way to plan your jewelry budget before visiting a store.
          </p>
        </section>

        <RelatedTools exclude={["/tools/gold-making-charge-calculator"]} />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 ring-1 ring-inset ring-amber-200/60 transition-colors hover:bg-amber-100"
          >
            ← View Today&apos;s Gold Rates
          </Link>
          <Link
            href="/tools/old-gold-exchange-calculator"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100"
          >
            Old Gold Exchange Estimator →
          </Link>
          <Link
            href="/tools/gold-import-duty-calculator"
            className="inline-flex items-center gap-1.5 rounded-full bg-zinc-50 px-4 py-2 text-sm font-semibold text-zinc-700 ring-1 ring-inset ring-zinc-200/60 transition-colors hover:bg-zinc-100"
          >
            NRI Import Duty Estimator →
          </Link>
        </div>
      </main>

    </>
  );
}
