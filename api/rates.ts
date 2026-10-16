import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRates } from "../server/rates";

/**
 * GET /api/rates?base=USD
 *
 * Vercel serverless function. Keeps the FX provider key server-side (ADR-007) and
 * caches responses at the edge for an hour.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const baseParam = req.query.base;
  const base = (
    Array.isArray(baseParam) ? baseParam[0] : (baseParam ?? "USD")
  ).toUpperCase();

  try {
    const data = await fetchRates(base);
    res.setHeader(
      "Cache-Control",
      "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(502).json({ error: (error as Error).message });
  }
}
