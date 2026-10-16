import Result from "@/components/ui/Result";
import { formatRelativeTime } from "@/lib/time";

export interface RateHintProps {
  rate: string | null;
  fetchedAt: number | null;
  source: string | null;
  cached: boolean;
}

export default function RateHint({ rate, fetchedAt, source, cached }: RateHintProps) {
  if (!rate) return null;

  const details: string[] = [];
  if (fetchedAt) details.push(`Updated ${formatRelativeTime(fetchedAt)}`);
  if (source) details.push(source);
  if (cached) details.push("cached");

  return <Result label="Exchange rate" value={rate} secondary={details.join(" · ")} />;
}
