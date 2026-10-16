import { describe, expect, it } from "vitest";
import { convert } from "@/domain/convert";
import { buildCurrencyUnits } from "@/features/converter/currencyUnits";
import type { Unit } from "@/domain/units/types";
import { buildCurrencyFactors } from "./rates";

describe("buildCurrencyFactors", () => {
  it("builds factors to the base currency (1 / per-base rate)", () => {
    const factors = buildCurrencyFactors({ USD: 1, NPR: 133.45, EUR: 0.92 });
    expect(factors.get("currency.usd")).toBe(1);
    expect(factors.get("currency.npr")).toBeCloseTo(1 / 133.45, 12);
    expect(factors.get("currency.eur")).toBeCloseTo(1 / 0.92, 12);
  });

  it("skips zero, negative and non-finite rates", () => {
    const factors = buildCurrencyFactors({
      USD: 1,
      BAD_ZERO: 0,
      BAD_NEG: -5,
      BAD_NAN: Number.NaN,
    });
    expect(factors.has("currency.bad_zero")).toBe(false);
    expect(factors.has("currency.bad_neg")).toBe(false);
    expect(factors.has("currency.bad_nan")).toBe(false);
  });
});

describe("currency conversion path", () => {
  const rates = { USD: 1, NPR: 133.45, EUR: 0.92, JPY: 150.2 };
  const factors = buildCurrencyFactors(rates);
  const units = buildCurrencyUnits(rates);
  const byId = new Map<string, Unit>(units.map((unit) => [unit.id, unit]));

  const usd = byId.get("currency.usd")!;
  const npr = byId.get("currency.npr")!;
  const eur = byId.get("currency.eur")!;

  it("converts USD to NPR", () => {
    expect(convert(100, usd, npr, { factors })).toBeCloseTo(13345, 6);
  });

  it("converts NPR to USD", () => {
    expect(convert(13345, npr, usd, { factors })).toBeCloseTo(100, 6);
  });

  it("converts across non-base currencies", () => {
    expect(convert(1, eur, npr, { factors })).toBeCloseTo(133.45 / 0.92, 6);
  });

  it("round-trips", () => {
    const there = convert(250, usd, npr, { factors });
    expect(convert(there, npr, usd, { factors })).toBeCloseTo(250, 6);
  });
});
