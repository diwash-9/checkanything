import { describe, expect, it } from "vitest";
import type { LinearUnit } from "@/domain/units/types";
import {
  buildPairPath,
  buildPairSlug,
  parsePairSlug,
  parseValueParam,
} from "./converterUrl";

const npr: LinearUnit = {
  id: "currency.npr",
  kind: "linear",
  name: "Nepalese Rupee",
  symbol: "NPR",
  factor: 1,
};
const usd: LinearUnit = {
  id: "currency.usd",
  kind: "linear",
  name: "US Dollar",
  symbol: "USD",
  factor: 1,
};

describe("parsePairSlug", () => {
  it("splits a canonical pair slug", () => {
    expect(parsePairSlug("usd-to-npr")).toEqual({ from: "usd", to: "npr" });
    expect(parsePairSlug("bigha-to-ropani")).toEqual({ from: "bigha", to: "ropani" });
  });

  it("lowercases the parts", () => {
    expect(parsePairSlug("USD-to-NPR")).toEqual({ from: "usd", to: "npr" });
  });

  it("rejects malformed slugs", () => {
    expect(parsePairSlug("usd")).toBeNull();
    expect(parsePairSlug("to-npr")).toBeNull();
    expect(parsePairSlug("usd-to-")).toBeNull();
  });
});

describe("buildPairSlug / buildPairPath", () => {
  it("builds a slug from units", () => {
    expect(buildPairSlug(usd, npr)).toBe("usd-to-npr");
  });

  it("builds a full path", () => {
    expect(buildPairPath({ id: "currency" } as never, usd, npr)).toBe(
      "/currency/usd-to-npr",
    );
  });
});

describe("parseValueParam", () => {
  it("parses plain and comma-formatted numbers", () => {
    expect(parseValueParam("5")).toBe(5);
    expect(parseValueParam("1,234.5")).toBe(1234.5);
  });

  it("returns null for empty or invalid input", () => {
    expect(parseValueParam(null)).toBeNull();
    expect(parseValueParam("")).toBeNull();
    expect(parseValueParam("abc")).toBeNull();
  });
});
