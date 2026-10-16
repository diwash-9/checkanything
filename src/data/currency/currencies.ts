/**
 * Currency metadata: display name, symbol, and display decimals.
 *
 * This is a curated set of common currencies (including NPR). The live rate
 * table may return more codes; the client enriches known ones with this metadata
 * and falls back to the bare code for the rest.
 */
export interface CurrencyMeta {
  code: string;
  name: string;
  symbol: string;
  /** Decimal places to display (default 2). */
  decimals?: number;
}

export const CURRENCIES: readonly CurrencyMeta[] = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "NPR", name: "Nepalese Rupee", symbol: "रू" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", decimals: 0 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$" },
  { code: "NZD", name: "New Zealand Dollar", symbol: "NZ$" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", decimals: 0 },
  { code: "THB", name: "Thai Baht", symbol: "฿" },
  { code: "MYR", name: "Malaysian Ringgit", symbol: "RM" },
  { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", decimals: 0 },
  { code: "PHP", name: "Philippine Peso", symbol: "₱" },
  { code: "VND", name: "Vietnamese Dong", symbol: "₫", decimals: 0 },
  { code: "PKR", name: "Pakistani Rupee", symbol: "₨" },
  { code: "BDT", name: "Bangladeshi Taka", symbol: "৳" },
  { code: "LKR", name: "Sri Lankan Rupee", symbol: "Rs" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
  { code: "SAR", name: "Saudi Riyal", symbol: "﷼" },
  { code: "QAR", name: "Qatari Riyal", symbol: "ر.ق" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك" },
  { code: "BHD", name: "Bahraini Dinar", symbol: "ب.د" },
  { code: "OMR", name: "Omani Rial", symbol: "ر.ع." },
  { code: "TRY", name: "Turkish Lira", symbol: "₺" },
  { code: "RUB", name: "Russian Ruble", symbol: "₽" },
  { code: "ZAR", name: "South African Rand", symbol: "R" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$" },
  { code: "MXN", name: "Mexican Peso", symbol: "Mex$" },
  { code: "ARS", name: "Argentine Peso", symbol: "AR$" },
  { code: "CLP", name: "Chilean Peso", symbol: "CLP$", decimals: 0 },
  { code: "COP", name: "Colombian Peso", symbol: "COL$" },
  { code: "PEN", name: "Peruvian Sol", symbol: "S/" },
  { code: "EGP", name: "Egyptian Pound", symbol: "E£" },
  { code: "NGN", name: "Nigerian Naira", symbol: "₦" },
  { code: "KES", name: "Kenyan Shilling", symbol: "KSh" },
  { code: "GHS", name: "Ghanaian Cedi", symbol: "₵" },
  { code: "ILS", name: "Israeli New Shekel", symbol: "₪" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr" },
  { code: "DKK", name: "Danish Krone", symbol: "kr" },
  { code: "PLN", name: "Polish Zloty", symbol: "zł" },
  { code: "CZK", name: "Czech Koruna", symbol: "Kč" },
  { code: "HUF", name: "Hungarian Forint", symbol: "Ft" },
  { code: "RON", name: "Romanian Leu", symbol: "lei" },
  { code: "UAH", name: "Ukrainian Hryvnia", symbol: "₴" },
];

export const CURRENCY_BY_CODE: ReadonlyMap<string, CurrencyMeta> = new Map(
  CURRENCIES.map((currency) => [currency.code, currency]),
);

export function getCurrencyMeta(code: string): CurrencyMeta {
  const normalized = code.toUpperCase();
  return (
    CURRENCY_BY_CODE.get(normalized) ?? {
      code: normalized,
      name: normalized,
      symbol: normalized,
      decimals: 2,
    }
  );
}
