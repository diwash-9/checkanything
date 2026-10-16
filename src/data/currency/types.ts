/**
 * Shape of the `/api/rates` response. Shared by the server function and the
 * client data layer — kept dependency-free so both projects can import it.
 */
export interface RatesPayload {
  /** Base currency code the rates are expressed against. */
  base: string;
  /** ISO/provider date for the rates (may be empty). */
  date: string;
  /** Mapping of currency code -> units per 1 unit of `base`. */
  rates: Record<string, number>;
  /** Human-readable provider name, surfaced in the UI. */
  source: string;
}
