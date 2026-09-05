import React from "react";

export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[#181818] text-[#b3b0a6] border border-[#2a2a2a]",
    pending: "bg-amber-950/30 text-amber-300 border border-amber-800/40",
    submitted: "bg-blue-950/30 text-blue-300 border border-blue-800/40",
    verified: "bg-emerald-950/30 text-emerald-300 border border-emerald-800/40",
    rejected: "bg-rose-950/30 text-rose-300 border border-rose-800/40",
    low_stock: "bg-red-950/40 text-red-300 border border-red-800/50",
    ivory: "bg-[#e8e4d9] text-[#070707] font-semibold"
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-widest ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
