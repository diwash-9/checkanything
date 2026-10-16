/**
 * Rounding helpers. We compute at full precision and only round for display, to
 * avoid floating-point noise like `0.30000000000000004`.
 */

/**
 * Round `value` to a number of significant digits.
 * `roundToSignificant(0.30000000000000004, 10) === 0.3`
 */
export function roundToSignificant(value: number, digits = 10): number {
  if (value === 0 || !Number.isFinite(value)) return value;
  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  const factor = Math.pow(10, digits - 1 - magnitude);
  return Math.round(value * factor) / factor;
}

/** Count the number of significant digits in a value (for diagnostics/tests). */
export function significantDigits(value: number): number {
  if (value === 0 || !Number.isFinite(value)) return 0;
  const text = Math.abs(value).toPrecision(15).replace(/0+$/, "");
  return text.replace(/[^0-9]/g, "").replace(/^0+/, "").length;
}

/** Clamp a decimal count into a sane, non-negative range. */
export function clampDecimals(value: number, min = 0, max = 20): number {
  return Math.min(max, Math.max(min, Math.trunc(value)));
}
