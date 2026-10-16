import type { Connect, Plugin } from "vite";
import { fetchRates } from "./rates";

/**
 * Emulates the `/api/rates` serverless function during local `vite dev`, so the
 * client can develop against the same endpoint it uses in production.
 */
export function ratesDevPlugin(): Plugin {
  const handler: Connect.NextHandleFunction = async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");
      const base = (url.searchParams.get("base") ?? "USD").toUpperCase();
      const data = await fetchRates(base);
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.statusCode = 200;
      res.end(JSON.stringify(data));
    } catch (error) {
      res.statusCode = 502;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: (error as Error).message }));
    }
  };

  return {
    name: "checkanything:rates-dev",
    configureServer(server) {
      server.middlewares.use("/api/rates", handler);
    },
  };
}
