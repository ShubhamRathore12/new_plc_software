"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Stars, OrbitControls } from "@react-three/drei";
import { Mesh } from "three";

function BlinkingStars() {
  return (
    <Stars
      radius={100}
      depth={50}
      count={2500}
      factor={10}
      fade
      saturation={0}
      speed={2}
      toneMapped={false}
    />
  );
}

function RotatingGalaxy() {
  const galaxyRef = useRef<Mesh>(null);

  useFrame(() => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += 0.001;
      galaxyRef.current.rotation.z += 0.001;
    }
  });

  return (
    <mesh ref={galaxyRef}>
      <torusGeometry args={[8, 1.5, 16, 100]} />
      <meshBasicMaterial color="#4444ff" wireframe />
    </mesh>
  );
}

function SpinningPlanet() {
  const planetRef = useRef<Mesh>(null);

  useFrame(() => {
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.003;
    }
  });

  return (
    <mesh ref={planetRef} position={[3, 0, -10]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial color="orange" emissive="red" />
    </mesh>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Suspense fallback={null}>
          <BlinkingStars />
          <RotatingGalaxy />
          <SpinningPlanet />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  );
}
