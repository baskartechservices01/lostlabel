import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  icon: Icon,
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-[0.18em]";

  const variants = {
    primary: "bg-[#e8e4d9] text-[#070707] hover:bg-[#faf7f0] active:scale-[0.99] shadow-[0_0_20px_rgba(232,228,217,0.1)]",
    secondary: "bg-[#181818] text-[#e8e4d9] border border-[#2a2a2a] hover:bg-[#222222] hover:border-[#383838]",
    outline: "border border-[#383838] text-[#e8e4d9] hover:border-[#e8e4d9] hover:bg-[#e8e4d9]/5",
    danger: "bg-red-950/40 text-red-300 border border-red-800/60 hover:bg-red-900/60",
    ghost: "text-[#8e8b83] hover:text-[#e8e4d9] hover:bg-[#151515]"
  };

  const sizes = {
    sm: "text-[10px] px-3.5 py-2",
    md: "text-xs px-5 py-3",
    lg: "text-xs px-7 py-4",
    xl: "text-sm px-8 py-4.5"
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span>Processing...</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4" />}
          {children}
        </span>
      )}
    </button>
  );
}
