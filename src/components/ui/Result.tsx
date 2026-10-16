import type { ReactNode } from "react";

export interface ResultProps {
  label?: string;
  value: ReactNode;
  secondary?: ReactNode;
}

export default function Result({ label, value, secondary }: ResultProps) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2" role="status" aria-live="polite">
      {label && <p className="text-xs font-medium text-gray-500">{label}</p>}
      <p className="mt-0.5 break-words text-base font-semibold text-gray-900">{value}</p>
      {secondary && <p className="mt-0.5 text-xs text-gray-500">{secondary}</p>}
    </div>
  );
}
