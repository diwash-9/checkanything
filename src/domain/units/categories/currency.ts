/**
 * Currency category.
 *
 * Currency is a *dynamic* category: the units (codes) are known statically, but
 * their factors come from a live rate table at runtime and are injected through
 * `ConvertContext.factors` (see src/features/converter/useCurrencyRates.ts).
 * The `factor` values here are placeholders and are never used for conversion.
 */
import type { Category, LinearUnit } from "../types";
import { CURRENCIES } from "@/data/currency/currencies";

export const CURRENCY_BASE_UNIT_ID = "currency.usd";

export function currencyUnitId(code: string): string {
  return `currency.${code.toLowerCase()}`;
}

export const currencyCategory: Category = {
  id: "currency",
  name: "Currency",
  baseUnitId: CURRENCY_BASE_UNIT_ID,
  dynamic: "currency",
  defaults: { from: "currency.usd", to: "currency.npr" },
  units: CURRENCIES.map((currency): LinearUnit => ({
    id: currencyUnitId(currency.code),
    kind: "linear",
    name: currency.name,
    symbol: currency.code,
    aliases: [currency.code.toLowerCase(), currency.name.toLowerCase()],
    dynamic: true,
    factor: 1,
    system: "other",
    defaultDecimals: currency.decimals ?? 2,
  })),
};
