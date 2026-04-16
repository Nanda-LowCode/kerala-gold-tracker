"use client";

import React, { createContext, useContext, useState } from "react";
import { ExchangeRatesList } from "@/lib/fetchCurrencyRates";

export type CurrencyOption = "INR" | "AED" | "USD" | "EUR" | "GBP";
export type WeightUnitOption = "Gram" | "Pavan" | "Tola" | "Troy Ounce";

type GlobalSettingsContextType = {
  currency: CurrencyOption;
  setCurrency: (currency: CurrencyOption) => void;
  weightUnit: WeightUnitOption;
  setWeightUnit: (unit: WeightUnitOption) => void;
  exchangeRates: ExchangeRatesList;
  formatGlobalPrice: (inrPrice: number) => string;
  convertWeight: (grams: number) => number;
  weightMultiplier: number; // multiplier derived from selected weight string
};

const DEFAULT_RATES: ExchangeRatesList = {
  INR: 1,
  AED: 0.0438,
  USD: 0.0119,
  EUR: 0.0111,
  GBP: 0.0094,
};

const GlobalSettingsContext = createContext<GlobalSettingsContextType | undefined>(
  undefined
);

const CURRENCY_SYMBOLS: Record<CurrencyOption, string> = {
  INR: "₹",
  AED: "د.إ",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export function GlobalSettingsProvider({
  children,
  initialRates,
}: {
  children: React.ReactNode;
  initialRates?: ExchangeRatesList;
}) {
  const [currency, setCurrency] = useState<CurrencyOption>("INR");
  const [weightUnit, setWeightUnit] = useState<WeightUnitOption>("Gram");

  const exchangeRates = initialRates || DEFAULT_RATES;

  // Derive weight multiplier based on string
  const weightMultiplier = React.useMemo(() => {
    switch (weightUnit) {
      case "Pavan":
        return 8; // 1 Pavan = 8 g
      case "Tola":
        return 11.6638; // 1 Tola = 11.66 g
      case "Troy Ounce":
        return 31.1034768; // 1 troy oz = 31.1 g
      case "Gram":
      default:
        return 1;
    }
  }, [weightUnit]);

  // Convert Indian Rupee numerical value to the target currency numerically
  // then format it beautifully into a localized string
  const formatGlobalPrice = (inrPrice: number) => {
    // Math: inrPrice => user currency
    const rate = exchangeRates[currency] || 1;
    const converted = inrPrice * rate;

    // Formatting rules
    if (currency === "INR") {
      // Use South Asian numbering system
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }).format(converted);
    }

    // Otherwise use standard western grouping and 2 decimal places
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

  const convertWeight = (grams: number) => {
    return grams / weightMultiplier;
  };

  return (
    <GlobalSettingsContext.Provider
      value={{
        currency,
        setCurrency,
        weightUnit,
        setWeightUnit,
        exchangeRates,
        formatGlobalPrice,
        convertWeight,
        weightMultiplier,
      }}
    >
      {children}
    </GlobalSettingsContext.Provider>
  );
}

export function useGlobalSettings() {
  const context = useContext(GlobalSettingsContext);
  if (context === undefined) {
    throw new Error("useGlobalSettings must be used within GlobalSettingsProvider");
  }
  return context;
}
