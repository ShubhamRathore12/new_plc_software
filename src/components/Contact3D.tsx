"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import { Mesh } from "three";

export default function Contact3D() {
  const meshRef = useRef<Mesh>(null);

  return (
    <div className="w-full h-80">
      <Canvas camera={{ position: [2, 2, 4], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} intensity={1} />
        <Stars radius={100} depth={50} count={3000} factor={4} fade />

        <mesh ref={meshRef} rotation={[0.5, 0.5, 0]}>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial color="#2563eb" wireframe />
        </mesh>

        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}
