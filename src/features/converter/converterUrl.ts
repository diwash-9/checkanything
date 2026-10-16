/**
 * URL <-> converter state helpers. Pair pages look like `/:category/:from-to`,
 * e.g. `/length/km-to-mi` or `/currency/usd-to-npr`.
 */
import { getUnitSlug } from "@/domain/units/registry";
import type { Category, Unit } from "@/domain/units/types";

export const PAIR_SEPARATOR = "-to-";

export interface PairSlugs {
  from: string;
  to: string;
}

/** Parse `"usd-to-npr"` into `{ from: "usd", to: "npr" }`, or null if invalid. */
export function parsePairSlug(slug: string): PairSlugs | null {
  const index = slug.indexOf(PAIR_SEPARATOR);
  if (index <= 0) return null;
  const from = slug.slice(0, index).toLowerCase();
  const to = slug.slice(index + PAIR_SEPARATOR.length).toLowerCase();
  if (!from || !to) return null;
  return { from, to };
}

/** Build `"usd-to-npr"` from two units. */
export function buildPairSlug(from: Unit, to: Unit): string {
  return `${getUnitSlug(from)}${PAIR_SEPARATOR}${getUnitSlug(to)}`;
}

/** Build `/currency/usd-to-npr`. */
export function buildPairPath(category: Category, from: Unit, to: Unit): string {
  return `/${category.id}/${buildPairSlug(from, to)}`;
}

/** Parse the `?value=` query parameter into a number, or null. */
export function parseValueParam(raw: string | null): number | null {
  if (raw == null || raw.trim() === "") return null;
  const value = Number(raw.replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}
