/** Format an epoch-ms timestamp as a short relative string ("2h ago"). */
export function formatRelativeTime(timestampMs: number, now = Date.now()): string {
  const diffSeconds = Math.round((timestampMs - now) / 1000);
  const abs = Math.abs(diffSeconds);

  if (abs < 45) return "just now";

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, secondsInUnit] of units) {
    if (abs >= secondsInUnit || unit === "second") {
      return formatter.format(Math.round(diffSeconds / secondsInUnit), unit);
    }
  }
  return "just now";
}
