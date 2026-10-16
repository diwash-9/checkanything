import { useCallback, useMemo, useState } from "react";
import { convert } from "@/domain/convert";
import { formatValue } from "@/domain/format";
import { roundToSignificant } from "@/domain/precision";
import { findUnitBySlug } from "@/domain/units/registry";
import type { Category, Unit, UnitId } from "@/domain/units/types";
import { useCurrencyRates, type CurrencyRatesState } from "./useCurrencyRates";

export interface UseConversionOptions {
  category: Category;
  initialFromSlug?: string;
  initialToSlug?: string;
  initialValue?: number | null;
}

export interface ConversionController {
  category: Category;
  units: Unit[];
  fromUnit: Unit | null;
  toUnit: Unit | null;
  amountInput: string;
  setAmountInput: (value: string) => void;
  selectFrom: (unitId: UnitId) => void;
  selectTo: (unitId: UnitId) => void;
  swap: () => void;
  result: number | null;
  resultText: string;
  /** e.g. "1 USD = 133.45 NPR", or null when not applicable. */
  rateHint: string | null;
  /** Currency metadata (status/timestamps), or null for static categories. */
  currency: Pick<
    CurrencyRatesState,
    "status" | "fetchedAt" | "source" | "cached" | "error"
  > | null;
}

/** Parse a user-entered amount string into a number, tolerating commas. */
export function parseAmount(input: string): number | null {
  const trimmed = input.trim();
  if (trimmed === "") return null;
  const value = Number(trimmed.replace(/,/g, ""));
  return Number.isFinite(value) ? value : null;
}

/** Resolve which unit a side should show given user selection, URL slug and default. */
function resolveUnit(
  units: readonly Unit[],
  selectedId: UnitId | null,
  slug: string | undefined,
  defaultId: UnitId | undefined,
): Unit | null {
  if (units.length === 0) return null;
  if (selectedId) {
    const selected = units.find((unit) => unit.id === selectedId);
    if (selected) return selected;
  }
  if (slug) {
    const bySlug = findUnitBySlug(units, slug);
    if (bySlug) return bySlug;
  }
  if (defaultId) {
    const byDefault = units.find((unit) => unit.id === defaultId);
    if (byDefault) return byDefault;
  }
  return units[0] ?? null;
}

/**
 * Drives a single converter instance: unit resolution, live conversion, swap and
 * currency-rate metadata. The URL is the source of truth for slugs/defaults; the
 * live amount and manual selections are component state.
 */
export function useConversion({
  category,
  initialFromSlug,
  initialToSlug,
  initialValue,
}: UseConversionOptions): ConversionController {
  const isCurrency = category.dynamic === "currency";
  const currencyRates = useCurrencyRates(isCurrency);

  const units = isCurrency ? currencyRates.units : category.units;
  const factors = isCurrency ? currencyRates.factors : undefined;

  const [amountInput, setAmountInput] = useState(() =>
    initialValue != null ? String(initialValue) : "",
  );
  const [selectedFrom, setSelectedFrom] = useState<UnitId | null>(null);
  const [selectedTo, setSelectedTo] = useState<UnitId | null>(null);

  const fromUnit = useMemo(
    () => resolveUnit(units, selectedFrom, initialFromSlug, category.defaults?.from),
    [units, selectedFrom, initialFromSlug, category.defaults],
  );
  const toUnit = useMemo(
    () => resolveUnit(units, selectedTo, initialToSlug, category.defaults?.to),
    [units, selectedTo, initialToSlug, category.defaults],
  );

  const numericAmount = useMemo(() => parseAmount(amountInput), [amountInput]);

  const result = useMemo(() => {
    if (fromUnit == null || toUnit == null || numericAmount == null) return null;
    const value = convert(numericAmount, fromUnit, toUnit, { factors });
    return Number.isFinite(value) ? value : null;
  }, [fromUnit, toUnit, numericAmount, factors]);

  const resultText = useMemo(
    () => (result != null && toUnit ? formatValue(result, toUnit) : ""),
    [result, toUnit],
  );

  const rateHint = useMemo(() => {
    if (fromUnit == null || toUnit == null || fromUnit.id === toUnit.id) return null;
    const rate = convert(1, fromUnit, toUnit, { factors });
    if (!Number.isFinite(rate)) return null;
    return `1 ${fromUnit.symbol} = ${formatValue(rate, toUnit)} ${toUnit.symbol}`;
  }, [fromUnit, toUnit, factors]);

  const selectFrom = useCallback((unitId: UnitId) => setSelectedFrom(unitId), []);
  const selectTo = useCallback((unitId: UnitId) => setSelectedTo(unitId), []);

  const swap = useCallback(() => {
    if (fromUnit == null || toUnit == null) return;
    setSelectedFrom(toUnit.id);
    setSelectedTo(fromUnit.id);
    if (result != null) {
      setAmountInput(String(roundToSignificant(result, 12)));
    }
  }, [fromUnit, toUnit, result]);

  const currency = isCurrency
    ? {
        status: currencyRates.status,
        fetchedAt: currencyRates.fetchedAt,
        source: currencyRates.source,
        cached: currencyRates.cached,
        error: currencyRates.error,
      }
    : null;

  return {
    category,
    units,
    fromUnit,
    toUnit,
    amountInput,
    setAmountInput,
    selectFrom,
    selectTo,
    swap,
    result,
    resultText,
    rateHint,
    currency,
  };
}
