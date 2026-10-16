/**
 * Display formatting for converted values. Pure.
 */
import type { Unit } from "./units/types";

export interface FormatOptions {
  locale?: string;
  /** Significant digits used when a unit has no fixed decimal count. */
  maximumSignificantDigits?: number;
}

const PLACEHOLDER = "—";

/**
 * Format a numeric value for a given unit.
 *
 * - Units with `defaultDecimals` (currency) render with that many decimals.
 * - Otherwise the value is rendered with ~10 significant digits so floating
 *   point noise never leaks into the UI.
 */
export function formatValue(
  value: number,
  unit: Pick<Unit, "defaultDecimals">,
  options: FormatOptions = {},
): string {
  if (!Number.isFinite(value)) return PLACEHOLDER;
  const locale = options.locale ?? "en-US";

  if (unit.defaultDecimals !== undefined) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: unit.defaultDecimals,
      maximumFractionDigits: unit.defaultDecimals,
    }).format(value);
  }

  return new Intl.NumberFormat(locale, {
    maximumSignificantDigits: options.maximumSignificantDigits ?? 10,
  }).format(value);
}

/** Format a plain number with thousands separators (no unit semantics). */
export function formatNumber(value: number, options: FormatOptions = {}): string {
  if (!Number.isFinite(value)) return PLACEHOLDER;
  return new Intl.NumberFormat(options.locale ?? "en-US", {
    maximumSignificantDigits: options.maximumSignificantDigits ?? 10,
  }).format(value);
}
