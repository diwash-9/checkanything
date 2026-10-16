/**
 * Core unit model. Pure types — no React, no I/O.
 *
 * Conversions all go through a single base unit per category (see
 * docs/ARCHITECTURE.md §4). Most units are linear (`factor`); non-linear units
 * such as temperature are affine (`toBase`/`fromBase`).
 */

export type UnitId = string;
export type CategoryId = string;

export type UnitSystem = "metric" | "imperial" | "us" | "nepali" | "other";

interface UnitBase {
  /** Globally unique, `category.slug` (e.g. `length.metre`, `currency.npr`). */
  id: UnitId;
  /** Canonical display name, e.g. "Metre". */
  name: string;
  /** Short symbol shown in UI, e.g. "m", "NPR". */
  symbol: string;
  /** Extra search terms (lowercase), e.g. ["meter", "meters", "metre"]. */
  aliases?: string[];
  /** Optional explicit URL slug; defaults to the part of `id` after the dot. */
  slug?: string;
  /**
   * Marks a unit whose factor is supplied at runtime (currency). The engine
   * refuses to convert such a unit unless a runtime factor is provided, so a
   * missing rate can never silently convert 1:1.
   */
  dynamic?: boolean;
  system?: UnitSystem;
  /** Fixed number of decimals for display (currency metadata uses this). */
  defaultDecimals?: number;
  /** Optional UI note, e.g. "Terai region". */
  note?: string;
  /** Citation key mapped to docs/CONVERSION-DATA.md §5. */
  source?: string;
}

/** A unit whose value maps to the base as `base = value * factor`. */
export interface LinearUnit extends UnitBase {
  kind: "linear";
  factor: number;
}

/** A unit whose value maps to the base via affine functions (e.g. temperature). */
export interface AffineUnit extends UnitBase {
  kind: "affine";
  toBase(value: number): number;
  fromBase(value: number): number;
}

export type Unit = LinearUnit | AffineUnit;

export interface Category {
  id: CategoryId;
  /** Human-readable name, e.g. "Currency". */
  name: string;
  /** The unit all conversions pass through. */
  baseUnitId: UnitId;
  units: Unit[];
  /**
   * Marks a category whose unit *factors* are supplied at runtime rather than
   * stored statically. Currency is the only such category.
   */
  dynamic?: "currency";
  /** Sensible initial from/to pair for the converter UI. */
  defaults?: { from: UnitId; to: UnitId };
}
