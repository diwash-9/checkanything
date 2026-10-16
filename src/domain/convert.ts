/**
 * The conversion engine. Pure: no React, no network.
 *
 * Every conversion is `value -> base unit -> target unit`. Currency is the only
 * category whose factors are dynamic; they are injected through the context.
 */
import type { LinearUnit, Unit, UnitId } from "./units/types";

export interface ConvertContext {
  /**
   * Runtime factors "to base unit", keyed by unit id. Used for dynamic
   * categories (currency). When present for a unit, it takes precedence over the
   * unit's static `factor`.
   */
  factors?: ReadonlyMap<UnitId, number>;
}

function isLinear(unit: Unit): unit is LinearUnit {
  return unit.kind === "linear";
}

function factorToBase(unit: Unit, context: ConvertContext): number {
  const override = context.factors?.get(unit.id);
  if (override !== undefined) return override;
  if (isLinear(unit) && !unit.dynamic) return unit.factor;
  throw new Error(`No runtime factor provided for dynamic unit "${unit.id}"`);
}

/** Convert a value from `unit` into the category base unit. */
export function toBase(value: number, unit: Unit, context: ConvertContext = {}): number {
  return isLinear(unit) ? value * factorToBase(unit, context) : unit.toBase(value);
}

/** Convert a value from the category base unit into `unit`. */
export function fromBase(
  value: number,
  unit: Unit,
  context: ConvertContext = {},
): number {
  return isLinear(unit) ? value / factorToBase(unit, context) : unit.fromBase(value);
}

/** Convert `value` from one unit to another. */
export function convert(
  value: number,
  from: Unit,
  to: Unit,
  context: ConvertContext = {},
): number {
  if (from.id === to.id) return value;
  return fromBase(toBase(value, from, context), to, context);
}
