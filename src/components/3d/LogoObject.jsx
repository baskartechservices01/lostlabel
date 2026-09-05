import React, { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

export default function LogoObject({ isMobile = false, isEntering = false }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const crosshairRef = useRef();

  // Load official Lost Label logo texture
  const texture = useLoader(THREE.TextureLoader, "/logo.jpg");
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Smooth hover floating
    const t = state.clock.elapsedTime;
    meshRef.current.position.y = Math.sin(t * 1.5) * 0.15;

    // Subtle continuous rotation with mouse parallax
    if (!isEntering) {
      meshRef.current.rotation.y += delta * 0.25;
      meshRef.current.rotation.x = Math.sin(t * 0.8) * 0.1;
    } else {
      // Accelerate spin during fly-through
      meshRef.current.rotation.y += delta * 3.5;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.4;
      ring1Ref.current.rotation.x = Math.sin(t * 0.5) * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.6;
      ring2Ref.current.rotation.y = Math.cos(t * 0.4) * 0.25;
    }
    if (crosshairRef.current) {
      crosshairRef.current.rotation.z += delta * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central 3D Medallion with Official Brand Logo */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <cylinderGeometry args={[2.3, 2.3, 0.22, isMobile ? 32 : 64]} />
        {/* Rim: Polished Dark Chrome / Titanium with high specular reflectivity */}
        <meshStandardMaterial
          attach="material-0"
          color="#121212"
          metalness={0.95}
          roughness={0.15}
        />
        {/* Front Face: Official Lost Label Logo */}
        <meshStandardMaterial
          attach="material-1"
          map={texture}
          metalness={0.4}
          roughness={0.35}
        />
        {/* Back Face: Official Lost Label Logo */}
        <meshStandardMaterial
          attach="material-2"
          map={texture}
          metalness={0.4}
          roughness={0.35}
        />
      </mesh>

      {/* Outer Astral Orbital Ring (Brushed Platinum) */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3.2, 0, 0]}>
        <torusGeometry args={[3.3, 0.025, 16, isMobile ? 48 : 100]} />
        <meshStandardMaterial
          color="#d4d4d4"
          metalness={0.98}
          roughness={0.1}
          emissive="#222"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Inner Counter-Rotating Halo Ring (Warm Ivory) */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.8, 0.018, 16, isMobile ? 36 : 80]} />
        <meshStandardMaterial
          color="#e8e4d9"
          metalness={0.85}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Gothic Starburst Crosshair Spikes behind emblem */}
      <group ref={crosshairRef} position={[0, 0, -0.05]}>
        {/* Vertical spike */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.03, 5.2, 0.02]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Horizontal spike */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[5.2, 0.03, 0.02]} />
          <meshStandardMaterial color="#888" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Diagonal accents */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[3.6, 0.02, 0.015]} />
          <meshStandardMaterial color="#666" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}
