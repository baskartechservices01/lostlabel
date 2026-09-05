import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CameraController() {
  const vec = useRef(new THREE.Vector3());

  useFrame((state) => {
    // Read window scroll offset
    const scrollY = window.scrollY || 0;
    const scrollProgress = Math.min(scrollY / (window.innerHeight || 1), 2);

    // Dynamic dolly and subtle height change based on scroll and pointer
    const targetZ = 6.8 + scrollProgress * 2.2;
    const targetY = -scrollProgress * 1.2 + (state.pointer.y * 0.4);
    const targetX = state.pointer.x * 0.6;

    vec.current.set(targetX, targetY, targetZ);
    state.camera.position.lerp(vec.current, 0.05);
    state.camera.lookAt(0, -scrollProgress * 0.5, 0);
  });

  return null;
}
