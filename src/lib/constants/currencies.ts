import { Currency } from "@/types/models";

export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "en-IN" },
  { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc", locale: "de-CH" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan", locale: "zh-CN" },
];

/**
 * Default currency set INR(₹) for the application.
 */
export const DEFAULT_CURRENCY = CURRENCIES[0];

/**
 * Get currency by code.
 * @param code Currency code.
 * @returns Currency object.
 */
export const getCurrencyByCode = (code: string): Currency => {
  return (
    CURRENCIES.find((currency) => currency.code === code) || DEFAULT_CURRENCY
  );
};
