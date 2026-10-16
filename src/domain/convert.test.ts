import { describe, expect, it } from "vitest";
import { convert, fromBase, toBase } from "./convert";
import type { AffineUnit, LinearUnit, UnitId } from "./units/types";

const metre: LinearUnit = {
  id: "length.metre",
  kind: "linear",
  name: "Metre",
  symbol: "m",
  factor: 1,
};
const kilometre: LinearUnit = {
  id: "length.kilometre",
  kind: "linear",
  name: "Kilometre",
  symbol: "km",
  factor: 1000,
};
const mile: LinearUnit = {
  id: "length.mile",
  kind: "linear",
  name: "Mile",
  symbol: "mi",
  factor: 1609.344,
};

// Base unit for temperature in this test: kelvin.
const kelvin: AffineUnit = {
  id: "temp.kelvin",
  kind: "affine",
  name: "Kelvin",
  symbol: "K",
  toBase: (v) => v,
  fromBase: (v) => v,
};
const celsius: AffineUnit = {
  id: "temp.celsius",
  kind: "affine",
  name: "Celsius",
  symbol: "°C",
  toBase: (c) => c + 273.15,
  fromBase: (k) => k - 273.15,
};
const fahrenheit: AffineUnit = {
  id: "temp.fahrenheit",
  kind: "affine",
  name: "Fahrenheit",
  symbol: "°F",
  toBase: (f) => ((f + 459.67) * 5) / 9,
  fromBase: (k) => (k * 9) / 5 - 459.67,
};

describe("convert (linear)", () => {
  it("returns the same value for identical units", () => {
    expect(convert(42, metre, metre)).toBe(42);
  });

  it("converts through the base unit", () => {
    expect(convert(1, kilometre, metre)).toBe(1000);
    expect(convert(1000, metre, kilometre)).toBe(1);
  });

  it("converts between non-base units", () => {
    expect(convert(1, mile, kilometre)).toBeCloseTo(1.609344, 10);
    expect(convert(1, kilometre, mile)).toBeCloseTo(0.6213711922, 9);
  });

  it("round-trips", () => {
    const there = convert(7.5, mile, kilometre);
    expect(convert(there, kilometre, mile)).toBeCloseTo(7.5, 10);
  });

  it("supports runtime factor overrides (dynamic categories)", () => {
    const usd: LinearUnit = {
      id: "currency.usd",
      kind: "linear",
      name: "USD",
      symbol: "USD",
      factor: 1,
    };
    const npr: LinearUnit = {
      id: "currency.npr",
      kind: "linear",
      name: "NPR",
      symbol: "NPR",
      factor: 1,
    };
    const factors = new Map<UnitId, number>([
      ["currency.usd", 1],
      ["currency.npr", 1 / 133.45],
    ]);
    expect(convert(100, usd, npr, { factors })).toBeCloseTo(13345, 6);
    expect(convert(13345, npr, usd, { factors })).toBeCloseTo(100, 6);
  });

  it("throws when a dynamic unit has no factor", () => {
    const dynamic: LinearUnit = {
      id: "currency.xyz",
      kind: "linear",
      name: "XYZ",
      symbol: "XYZ",
      dynamic: true,
      factor: 1,
    };
    expect(() => toBase(1, dynamic)).toThrow();
  });
});

describe("convert (affine / temperature)", () => {
  it("freezing and boiling points", () => {
    expect(convert(0, celsius, fahrenheit)).toBeCloseTo(32, 10);
    expect(convert(100, celsius, fahrenheit)).toBeCloseTo(212, 10);
    expect(convert(0, celsius, kelvin)).toBeCloseTo(273.15, 10);
  });

  it("handles negative values", () => {
    expect(convert(-40, celsius, fahrenheit)).toBeCloseTo(-40, 10);
  });

  it("round-trips", () => {
    const k = toBase(37, celsius);
    expect(fromBase(k, celsius)).toBeCloseTo(37, 10);
  });
});
