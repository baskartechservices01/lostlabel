import React from "react";

export default function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  type = "text",
  required = false,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-[11px] font-medium tracking-wider uppercase text-[#8e8b83]">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        className={`w-full bg-[#0e0e0e] border ${
          error ? "border-red-500/80 focus:border-red-500" : "border-[#262626] focus:border-[#e8e4d9]"
        } px-4 py-3 text-sm text-[#e8e4d9] placeholder-[#555] focus:outline-none focus:ring-1 focus:ring-[#e8e4d9]/40 transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-[11px] text-red-400 font-light">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-[#666]">{helperText}</p>}
    </div>
  );
}
