import { useEffect, useMemo, useState } from "react";
import {
  buildCurrencyFactors,
  fetchRatesFromApi,
  isFresh,
  readCachedRates,
  writeCachedRates,
  type RatesResult,
} from "@/data/currency/rates";
import type { LinearUnit, UnitId } from "@/domain/units/types";
import { buildCurrencyUnits } from "./currencyUnits";

const BASE = "USD";

export type CurrencyStatus = "idle" | "loading" | "ready" | "error";

export interface CurrencyRatesState {
  status: CurrencyStatus;
  units: LinearUnit[];
  factors: Map<UnitId, number>;
  /** Epoch ms of the rates currently in use, or null. */
  fetchedAt: number | null;
  /** Provider name, or null. */
  source: string | null;
  /** True when the shown rates came from cache. */
  cached: boolean;
  error: string | null;
}

/**
 * Load live currency rates (with caching + stale fallback) and expose them as
 * units + conversion factors. Fetching is skipped when `enabled` is false.
 */
export function useCurrencyRates(enabled = true): CurrencyRatesState {
  const [result, setResult] = useState<RatesResult | null>(() =>
    enabled ? readCachedRates(BASE) : null,
  );
  const [status, setStatus] = useState<CurrencyStatus>(() => {
    if (!enabled) return "idle";
    return readCachedRates(BASE) ? "ready" : "loading";
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const cached = readCachedRates(BASE);
    if (cached) {
      setResult(cached);
      setStatus("ready");
      if (isFresh(cached)) return;
    } else {
      setStatus("loading");
    }

    const controller = new AbortController();
    void (async () => {
      try {
        const fresh = await fetchRatesFromApi(BASE, controller.signal);
        writeCachedRates(BASE, fresh);
        setResult({ ...fresh, fetchedAt: Date.now(), cached: false });
        setStatus("ready");
        setError(null);
      } catch (cause) {
        if (controller.signal.aborted) return;
        setError((cause as Error).message);
        // Keep showing cached (stale) rates if we have them.
        setStatus(cached ? "ready" : "error");
      }
    })();

    return () => controller.abort();
  }, [enabled]);

  const units = useMemo(() => (result ? buildCurrencyUnits(result.rates) : []), [result]);
  const factors = useMemo(
    () => (result ? buildCurrencyFactors(result.rates) : new Map<UnitId, number>()),
    [result],
  );

  return {
    status,
    units,
    factors,
    fetchedAt: result?.fetchedAt ?? null,
    source: result?.source ?? null,
    cached: result?.cached ?? false,
    error,
  };
}
