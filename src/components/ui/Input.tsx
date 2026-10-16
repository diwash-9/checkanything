import { useId, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export default function Input({ label, hint, id, className = "", ...rest }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-xs font-medium text-gray-500">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full bg-transparent py-1.5 text-lg outline-none placeholder:text-gray-300 disabled:text-gray-700 ${className}`}
        {...rest}
      />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
