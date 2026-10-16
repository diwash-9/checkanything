import { getCurrencyMeta } from "@/data/currency/currencies";
import { currencyUnitId } from "@/domain/units/categories/currency";
import type { LinearUnit } from "@/domain/units/types";

/**
 * Build the selectable currency units from a live rate table. Known codes are
 * enriched with metadata (name, decimals); unknown ones fall back to the code.
 * Units are sorted alphabetically by code.
 */
export function buildCurrencyUnits(rates: Record<string, number>): LinearUnit[] {
  return Object.keys(rates)
    .filter((code) => Number.isFinite(rates[code]) && rates[code] > 0)
    .sort((a, b) => a.localeCompare(b))
    .map((code): LinearUnit => {
      const meta = getCurrencyMeta(code);
      return {
        id: currencyUnitId(code),
        kind: "linear",
        name: meta.name,
        symbol: code,
        aliases: [code.toLowerCase(), meta.name.toLowerCase()],
        dynamic: true,
        factor: 1, // placeholder — real factors come from ConvertContext.factors
        system: "other",
        defaultDecimals: meta.decimals ?? 2,
      };
    });
}
