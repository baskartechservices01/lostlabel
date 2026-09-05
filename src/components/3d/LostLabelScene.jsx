import React, { Suspense, useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Sparkles, Move3d, ArrowDown, Compass } from "lucide-react";
import HeroScene from "./HeroScene";
import FallbackHero from "./FallbackHero";
import { playEnterWarpSound, playAmbientDrone } from "../../utils/audio";

const checkWebGLSupport = () => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
};

export default function LostLabelScene() {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [canvasError, setCanvasError] = useState(false);

  // Vean Enter state
  const [hasEntered, setHasEntered] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const droneRef = useRef(null);

  useEffect(() => {
    const supported = checkWebGLSupport();
    setHasWebGL(supported);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSound = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      droneRef.current = playAmbientDrone();
    } else {
      setSoundEnabled(false);
      if (droneRef.current) {
        droneRef.current.stop();
        droneRef.current = null;
      }
    }
  };

  const handleEnterAtelier = () => {
    if (isEntering || hasEntered) return;

    if (soundEnabled) {
      playEnterWarpSound();
    }

    setIsEntering(true);

    setTimeout(() => {
      setHasEntered(true);
      setIsEntering(false);
      // Smoothly scroll down towards collection
      const target = document.getElementById("featured");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 700);
  };

  if (!hasWebGL || canvasError) {
    return <FallbackHero />;
  }

  return (
    <div className="relative w-full h-[95vh] md:h-screen bg-[#070707] overflow-hidden select-none">
      {/* 3D WebGL Canvas */}
      <Canvas
        dpr={isMobile ? [1, 1.3] : [1, 1.8]}
        camera={{ position: [0, 0, 6.8], fov: isMobile ? 55 : 45 }}
        gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
        onError={() => setCanvasError(true)}
        className="w-full h-full"
      >
        <Suspense fallback={null}>
          <HeroScene
            isMobile={isMobile}
            isEntering={isEntering}
            hasEntered={hasEntered}
          />
        </Suspense>
      </Canvas>

      {/* --- VEAN STYLE EDITORIAL HUD & TELEMETRY OVERLAY --- */}
      <div className="absolute inset-0 pointer-events-none p-6 sm:p-10 flex flex-col justify-between z-20">
        {/* Top HUD Bar */}
        <div className="flex items-center justify-between text-[10px] tracking-[0.28em] uppercase text-[#777] font-mono">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>SYS.LOC // 12.9716° N, 77.5946° E</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 bg-[#121212]/80 border border-[#262626] text-[#b3b0a6] hover:text-[#e8e4d9] hover:border-[#444] transition-colors"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>AUDIO: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#666]" />
                <span>AUDIO: OFF</span>
              </>
            )}
          </button>
        </div>

        {/* Center: "ENTER ATELIER" Gate Overlay (if not entered yet) */}
        <AnimatePresence>
          {!hasEntered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.15, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center text-center space-y-6 pointer-events-auto"
            >
              {/* Brand Titles */}
              <div className="space-y-2">
                <span className="font-editorial text-[10px] tracking-[0.4em] text-[#8e8b83] block">
                  ESTD. 2026 • UNDERGROUND LUXURY
                </span>
                <h1 className="font-cinzel text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-[0.2em] text-[#e8e4d9] uppercase drop-shadow-[0_0_35px_rgba(232,228,217,0.2)]">
                  LOST LABEL
                </h1>
                <p className="font-editorial text-xs tracking-[0.3em] text-[#666]">
                  STREETWEAR ARCHIVE
                </p>
              </div>

              {/* Enter Button with Pulse Rings */}
              <div className="relative pt-2">
                <div className="absolute inset-0 rounded-none bg-[#e8e4d9]/10 animate-ping pointer-events-none" />
                <button
                  type="button"
                  onClick={handleEnterAtelier}
                  disabled={isEntering}
                  className="group relative px-10 py-4.5 bg-[#e8e4d9] text-[#070707] font-cinzel text-xs font-bold tracking-[0.3em] uppercase hover:bg-white active:scale-95 transition-all duration-300 shadow-[0_0_40px_rgba(232,228,217,0.3)] flex items-center gap-3"
                >
                  <span>{isEntering ? "DIVING INTO ATELIER..." : "ENTER ATELIER"}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#070707] group-hover:scale-150 transition-transform" />
                </button>
              </div>

              {/* 360 Drag Interaction Cue */}
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#777] font-mono pt-2">
                <Move3d className="w-3.5 h-3.5 text-[#b3b0a6]" />
                <span>Click & Drag to Rotate 360°</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom HUD Bar */}
        <div className="flex items-end justify-between text-[10px] tracking-[0.25em] uppercase text-[#777] font-mono">
          <div className="hidden sm:block">
            <span>LIMITED RUN ARCHIVE // 01</span>
          </div>

          {/* If entered, show discover cue */}
          {hasEntered ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto flex items-center gap-4 text-left"
            >
              <a
                href="#featured"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0a]/80 border border-[#282828] text-xs text-[#e8e4d9] uppercase tracking-widest hover:border-[#888] transition-colors backdrop-blur-sm"
              >
                <span>Explore Drops</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setHasEntered(false)}
                className="text-[10px] uppercase tracking-widest text-[#666] hover:text-[#e8e4d9] transition-colors"
              >
                Replay Intro
              </button>
            </motion.div>
          ) : (
            <div className="flex items-center gap-2 text-[#666]">
              <span className="w-1.5 h-1.5 bg-[#e8e4d9]" />
              <span>ORBIT CONTROLS ACTIVE</span>
            </div>
          )}
        </div>
      </div>

      {/* Atmospheric Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#070707] to-transparent pointer-events-none" />
    </div>
  );
}
