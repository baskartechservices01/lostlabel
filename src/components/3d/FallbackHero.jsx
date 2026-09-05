import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FallbackHero({ onExplore }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Subtle star dust particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw stars
      particles.forEach((p) => {
        ctx.fillStyle = `rgba(232, 228, 217, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-[#070707]">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-40" />

      {/* Atmospheric radial vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,30,30,0.6)_0%,rgba(7,7,7,0.95)_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Official Lost Label Logo Emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 mb-8 rounded-full p-1 bg-gradient-to-b from-[#e8e4d9]/30 via-transparent to-[#e8e4d9]/10 shadow-[0_0_50px_rgba(232,228,217,0.12)]"
        >
          <img
            src="/logo.jpg"
            alt="LOST LABEL Official Monogram"
            className="w-full h-full object-contain rounded-full filter drop-shadow-2xl"
          />
          <div className="absolute inset-0 rounded-full border border-[#e8e4d9]/20 animate-pulse pointer-events-none" />
        </motion.div>

        {/* Brand Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="space-y-4"
        >
          <p className="font-editorial text-xs sm:text-sm tracking-[0.3em] text-[#8e8b83]">
            ESTD. 2026 • UNDERGROUND LUXURY
          </p>
          <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-bold tracking-widest text-[#e8e4d9] uppercase">
            LOST LABEL
          </h1>
          <p className="max-w-md mx-auto text-sm sm:text-base text-[#b3b0a6] font-light tracking-wide leading-relaxed">
            Architectural cuts, heavyweight drape, and digital identity. Not made to blend in.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link
            to="/shop"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-[#e8e4d9] text-[#070707] font-semibold text-xs tracking-[0.2em] uppercase rounded-none hover:bg-[#faf7f0] transition-all duration-300 shadow-[0_0_30px_rgba(232,228,217,0.2)]"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <a
            href="#featured"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 border border-[#262626] text-[#b3b0a6] hover:text-[#e8e4d9] hover:border-[#8e8b83] font-medium text-xs tracking-[0.2em] uppercase transition-colors duration-300"
          >
            <span>View Drops</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
