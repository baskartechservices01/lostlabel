import React from "react";
import { motion } from "framer-motion";

export default function Loader({ text = "LOST LABEL" }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070707] text-[#e8e4d9]">
      <div className="relative w-28 h-28 mb-6">
        <img
          src="/logo.jpg"
          alt="LOST LABEL"
          className="w-full h-full object-contain rounded-full animate-pulse"
        />
        <div className="absolute inset-0 rounded-full border border-[#e8e4d9]/20 animate-spin" />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="font-cinzel text-xs tracking-[0.35em] text-[#b3b0a6] uppercase"
      >
        {text}
      </motion.p>
    </div>
  );
}
