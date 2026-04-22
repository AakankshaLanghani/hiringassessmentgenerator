"use client";

import { cn } from "@/lib/utils";

interface TextareaInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  hint?: string;
  rows?: number;
  className?: string;
  maxLength?: number;
}

export default function TextareaInput({
  value,
  onChange,
  placeholder,
  label,
  hint,
  rows = 10,
  className,
  maxLength,
}: TextareaInputProps) {
  const charCount = value.length;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {(label || hint) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="text-sm font-semibold text-gray-700">{label}</label>
          )}
          {hint && (
            <span className="text-xs text-gray-400">{hint}</span>
          )}
        </div>
      )}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          maxLength={maxLength}
          placeholder={placeholder}
          className={cn(
            "w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 leading-relaxed",
            "focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all",
            "shadow-sm hover:border-gray-300"
          )}
        />
        {maxLength && (
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {charCount}/{maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
