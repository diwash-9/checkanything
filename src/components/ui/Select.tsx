import { useId, type ReactNode, type SelectHTMLAttributes } from "react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  children: ReactNode;
}

export default function Select({
  label,
  id,
  className = "",
  children,
  ...rest
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-xs font-medium text-gray-500">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`rounded-lg bg-gray-100 px-2 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-60 ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
