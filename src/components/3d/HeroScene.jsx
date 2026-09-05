import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Sparkles, PresentationControls } from "@react-three/drei";
import * as THREE from "three";
import LogoObject from "./LogoObject";

function CameraWarpController({ isEntering, hasEntered }) {
  const targetZ = useRef(6.8);
  const targetY = useRef(0);
  const targetFov = useRef(45);

  useFrame((state, delta) => {
    if (isEntering) {
      // Cinematic camera dive: accelerate into and through the emblem
      targetZ.current = THREE.MathUtils.lerp(targetZ.current, -3.5, delta * 3.5);
      targetY.current = THREE.MathUtils.lerp(targetY.current, -0.5, delta * 2.5);
    } else if (hasEntered) {
      // Once entered, anchor camera into subtle scroll reactive positioning
      const scrollY = window.scrollY || 0;
      const progress = Math.min(scrollY / 800, 1.5);
      targetZ.current = 7.0 + progress * 2.5;
      targetY.current = -progress * 1.5 + (state.pointer.y * 0.3);
    } else {
      // Intro idle state: subtle mouse parallax
      targetZ.current = 6.6;
      targetY.current = state.pointer.y * 0.4;
    }

    const targetX = isEntering ? 0 : state.pointer.x * 0.5;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.06);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY.current, 0.06);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ.current, 0.08);

    state.camera.lookAt(0, isEntering ? -0.5 : 0, 0);
  });

  return null;
}

export default function HeroScene({ isMobile = false, isEntering = false, hasEntered = false }) {
  const particleCount = isMobile ? 40 : 110;

  return (
    <>
      <CameraWarpController isEntering={isEntering} hasEntered={hasEntered} />

      {/* Atmospheric Fog */}
      <color attach="background" args={["#070707"]} />
      <fog attach="fog" args={["#070707", 4, 19]} />

      {/* Studio Lighting Setup */}
      <ambientLight intensity={0.4} color="#FAF7F0" />

      {/* Key Rim Spotlight */}
      <spotLight
        position={[6, 9, 6]}
        angle={0.45}
        penumbra={1}
        intensity={3.5}
        color="#FFFFFF"
        castShadow={!isMobile}
      />

      {/* Counter Rim Light */}
      <spotLight
        position={[-7, -3, -4]}
        angle={0.6}
        penumbra={1}
        intensity={2.2}
        color="#E8E4D9"
      />

      {/* Central Core Glow */}
      <pointLight position={[0, 0, 2.5]} intensity={2.4} color="#FAF7F0" distance={7} />

      {/* Background Architectural Monoliths */}
      <group position={[0, -2, -5]}>
        <mesh position={[-5, 1, -2]}>
          <boxGeometry args={[0.9, 10, 0.9]} />
          <meshStandardMaterial color="#0f0f0f" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[5, 1, -2]}>
          <boxGeometry args={[0.9, 10, 0.9]} />
          <meshStandardMaterial color="#0f0f0f" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[25, 25]} />
          <meshStandardMaterial color="#080808" metalness={0.9} roughness={0.35} />
        </mesh>
      </group>

      {/* 360° Drag Interactive Controls for user rotation */}
      <PresentationControls
        global={false}
        cursor={true}
        snap={{ mass: 3, tension: 300 }}
        speed={1.8}
        zoom={1}
        rotation={[0, 0, 0]}
        polar={[-Math.PI / 6, Math.PI / 6]}
        azimuth={[-Math.PI / 2, Math.PI / 2]}
      >
        <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.35}>
          <LogoObject isMobile={isMobile} isEntering={isEntering} />
        </Float>
      </PresentationControls>

      {/* Sparkles / Atmospheric Dust */}
      <Sparkles
        count={particleCount}
        scale={11}
        size={isMobile ? 2 : 3.5}
        speed={0.4}
        color="#E8E4D9"
        opacity={0.75}
      />
    </>
  );
}
