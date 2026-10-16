/**
 * Client-side FX rates: fetch from `/api/rates`, cache in localStorage, and
 * expose helpers to build conversion factors.
 *
 * Never talks to the provider directly — the API key stays server-side (ADR-007).
 */
import { currencyUnitId } from "@/domain/units/categories/currency";
import type { RatesPayload } from "./types";

export interface RatesResult extends RatesPayload {
  /** Epoch ms when we obtained these rates. */
  fetchedAt: number;
  /** True when served from cache rather than a fresh network response. */
  cached: boolean;
}

const CACHE_PREFIX = "checkanything:rates:";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function cacheKey(base: string): string {
  return `${CACHE_PREFIX}${base.toUpperCase()}`;
}

export function readCachedRates(base = "USD"): RatesResult | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(cacheKey(base));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { payload?: RatesPayload; fetchedAt?: number };
    if (!parsed?.payload?.rates || typeof parsed.fetchedAt !== "number") return null;
    return { ...parsed.payload, fetchedAt: parsed.fetchedAt, cached: true };
  } catch {
    return null;
  }
}

export function writeCachedRates(base: string, payload: RatesPayload): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(
      cacheKey(base),
      JSON.stringify({ payload, fetchedAt: Date.now() }),
    );
  } catch {
    /* storage full or unavailable — non-fatal */
  }
}

export function isFresh(result: RatesResult, ttlMs = CACHE_TTL_MS): boolean {
  return Date.now() - result.fetchedAt < ttlMs;
}

/** Fetch rates from our own `/api/rates` endpoint. */
export async function fetchRatesFromApi(
  base = "USD",
  signal?: AbortSignal,
): Promise<RatesPayload> {
  const res = await fetch(`/api/rates?base=${encodeURIComponent(base)}`, { signal });
  if (!res.ok) {
    throw new Error(`Rates request failed with status ${res.status}`);
  }
  const data = (await res.json()) as Partial<RatesPayload>;
  if (!data || typeof data !== "object" || !data.rates) {
    throw new Error("Rates response was malformed");
  }
  return {
    base: data.base ?? base,
    date: data.date ?? "",
    rates: data.rates,
    source: data.source ?? "unknown",
  };
}

/**
 * Build conversion factors "to the base currency" keyed by unit id, from a rate
 * table expressed as "units per 1 base unit". Currency conversion is therefore
 * just another linear conversion in the engine.
 */
export function buildCurrencyFactors(rates: Record<string, number>): Map<string, number> {
  const factors = new Map<string, number>();
  for (const [code, perBase] of Object.entries(rates)) {
    if (!Number.isFinite(perBase) || perBase <= 0) continue;
    factors.set(currencyUnitId(code), 1 / perBase);
  }
  return factors;
}
