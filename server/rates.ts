/**
 * Server-side FX rate fetching.
 *
 * Runs only on the server (Vercel serverless function + the Vite dev middleware),
 * never in the browser bundle. The provider API key is read from the server-side
 * environment (`FX_API_KEY`) and is never exposed to the client (ADR-007).
 */

import type { RatesPayload } from "../src/data/currency/types";

export type { RatesPayload };

const FETCH_TIMEOUT_MS = 8000;

async function fetchJson(url: string): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) {
      throw new Error(`Upstream responded ${res.status} for ${url}`);
    }
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Primary provider: exchangerate-api v6 (requires FX_API_KEY). */
async function fromExchangeRateApi(base: string, key: string): Promise<RatesPayload> {
  const data = await fetchJson(
    `https://v6.exchangerate-api.com/v6/${key}/latest/${base}`,
  );
  if (!isRecord(data) || data.result !== "success" || !isRecord(data.conversion_rates)) {
    throw new Error("exchangerate-api returned an unexpected payload");
  }
  return {
    base,
    date: typeof data.time_last_update_utc === "string" ? data.time_last_update_utc : "",
    rates: data.conversion_rates as Record<string, number>,
    source: "exchangerate-api.com",
  };
}

/** Keyless fallback: open.er-api.com (same provider, free tier, supports NPR). */
async function fromOpenErApi(base: string): Promise<RatesPayload> {
  const data = await fetchJson(`https://open.er-api.com/v6/latest/${base}`);
  if (!isRecord(data) || data.result !== "success" || !isRecord(data.rates)) {
    throw new Error("open.er-api.com returned an unexpected payload");
  }
  return {
    base,
    date: typeof data.time_last_update_utc === "string" ? data.time_last_update_utc : "",
    rates: data.rates as Record<string, number>,
    source: "open.er-api.com",
  };
}

/**
 * Fetch rates for a base currency, trying providers in order of preference.
 * Throws only when every provider fails.
 */
export async function fetchRates(base = "USD"): Promise<RatesPayload> {
  const normalizedBase = base.trim().toUpperCase();
  const key = process.env.FX_API_KEY?.trim();
  const errors: string[] = [];

  if (key) {
    try {
      return await fromExchangeRateApi(normalizedBase, key);
    } catch (error) {
      errors.push(`exchangerate-api: ${(error as Error).message}`);
    }
  }

  try {
    return await fromOpenErApi(normalizedBase);
  } catch (error) {
    errors.push(`open.er-api: ${(error as Error).message}`);
  }

  throw new Error(`No FX provider available. ${errors.join(" | ")}`);
}
