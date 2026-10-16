import { describe, expect, it } from "vitest";
import { formatNumber, formatValue } from "./format";
import { roundToSignificant } from "./precision";

describe("roundToSignificant", () => {
  it("removes floating point noise", () => {
    expect(roundToSignificant(0.1 + 0.2)).toBe(0.3);
  });

  it("keeps large values intact", () => {
    expect(roundToSignificant(1234567.89)).toBe(1234567.89);
  });

  it("handles zero and non-finite values", () => {
    expect(roundToSignificant(0)).toBe(0);
    expect(roundToSignificant(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe("formatValue", () => {
  it("uses fixed decimals when the unit specifies them (currency)", () => {
    expect(formatValue(1234.5, { defaultDecimals: 2 })).toBe("1,234.50");
    expect(formatValue(13345, { defaultDecimals: 2 })).toBe("13,345.00");
  });

  it("uses significant digits otherwise, without leaking FP noise", () => {
    expect(formatValue(0.1 + 0.2, {})).toBe("0.3");
  });

  it("handles yen-style zero decimals", () => {
    expect(formatValue(1500.4, { defaultDecimals: 0 })).toBe("1,500");
  });

  it("returns a placeholder for non-finite values", () => {
    expect(formatValue(Number.NaN, {})).toBe("—");
  });
});

describe("formatNumber", () => {
  it("adds thousands separators", () => {
    expect(formatNumber(1234567)).toBe("1,234,567");
  });
});
