"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Grid, Line } from "@react-three/drei";

// Separate component for the 3D scene
export default function BlueprintScene() {
  return (
    <div className="w-full h-screen bg-[#e6f0fa]">
      <Suspense
        fallback={
          <div className="w-full h-screen flex items-center justify-center">
            Loading...
          </div>
        }
      >
        <Canvas camera={{ position: [10, 10, 10], fov: 60 }}>
          <SceneContent />
        </Canvas>
      </Suspense>
    </div>
  );
}

// All the 3D content
function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Grid for Blueprint Style */}
      <Grid
        position={[0, -1, 0]}
        args={[20, 20]}
        cellColor="#00f"
        sectionColor="#00f"
        fadeDistance={50}
        infiniteGrid
      />

      {/* Components */}
      <ComponentGroup />

      {/* Flow Lines */}
      <FlowLines />

      {/* Controls */}
      <OrbitControls enablePan enableZoom enableRotate />
    </>
  );
}

// Component for each 3D element
function Component({ position, geometry, color, label, labelPosition }: any) {
  const ref = useRef();

  return (
    <>
      <mesh ref={ref} position={position}>
        {geometry}
        <meshStandardMaterial
          color={color}
          wireframe
          wireframeLinewidth={1}
          opacity={0.8}
          transparent
        />
      </mesh>
      {label && (
        <Text
          position={
            labelPosition || [position[0], position[1] + 1, position[2]]
          }
          fontSize={0.5}
          color="#00f"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </>
  );
}

// Group all components
function ComponentGroup() {
  return (
    <>
      {/* Silo */}
      <Component
        position={[-5, 0, 0]}
        geometry={<cylinderGeometry args={[1, 1, 4, 32]} />}
        color="#00f"
        label="SILO"
        labelPosition={[-5, 3, 0]}
      />
      <Component
        position={[-5, 2, 0]}
        geometry={<coneGeometry args={[1, 1, 32]} />}
        color="#00f"
      />

      {/* HTR */}
      <Component
        position={[-2, 0, 0]}
        geometry={<boxGeometry args={[1, 2, 1]} />}
        color="#00f"
        label="HTR"
        labelPosition={[-2, 2, 0]}
      />
      <Text position={[-2, -1, 0]} fontSize={0.4} color="#00f">
        TH
      </Text>

      {/* AHT */}
      <Component
        position={[0, 0, 0]}
        geometry={<boxGeometry args={[1, 2, 1]} />}
        color="#00f"
        label="AHT"
        labelPosition={[0, 2, 0]}
      />
      <Text position={[0, -1, 0]} fontSize={0.4} color="#00f">
        T0
      </Text>

      {/* HGS */}
      <Component
        position={[2, 0, 0]}
        geometry={<boxGeometry args={[1, 2, 1]} />}
        color="#00f"
        label="HGS"
        labelPosition={[2, 2, 0]}
      />
      <Text position={[2, -1, 0]} fontSize={0.4} color="#00f">
        T1
      </Text>

      {/* COMP */}
      <Component
        position={[5, 0, 0]}
        geometry={<boxGeometry args={[2, 1, 1]} />}
        color="#f00"
        label="COMP"
        labelPosition={[5, 1.5, 0]}
      />
      <Text position={[5, -1, 0]} fontSize={0.4} color="#00f">
        T2
      </Text>
      <Text position={[5, 2, 0]} fontSize={0.4} color="#f00">
        TH - T1
      </Text>

      {/* COND */}
      <Component
        position={[5, -2, 0]}
        geometry={<boxGeometry args={[2, 1, 1]} />}
        color="#f00"
        label="COND"
        labelPosition={[5, -2.5, 0]}
      />

      {/* Blower */}
      <Component
        position={[2, -3, 0]}
        geometry={<sphereGeometry args={[0.5, 32, 32]} />}
        color="#f00"
        label="BLOWER"
        labelPosition={[2, -4, 0]}
      />
    </>
  );
}

// Flow lines between components
function FlowLine({ points }: any) {
  return (
    <Line
      points={points}
      color="#00f"
      lineWidth={2}
      dashed
      dashSize={0.2}
      gapSize={0.1}
    />
  );
}

// Group all flow lines
function FlowLines() {
  return (
    <>
      {/* Silo to HTR */}
      <FlowLine
        points={[
          [-5, 0, 0],
          [-2, 0, 0],
        ]}
      />
      {/* HTR to AHT */}
      <FlowLine
        points={[
          [-2, 0, 0],
          [0, 0, 0],
        ]}
      />
      {/* AHT to HGS */}
      <FlowLine
        points={[
          [0, 0, 0],
          [2, 0, 0],
        ]}
      />
      {/* HGS to COMP */}
      <FlowLine
        points={[
          [2, 0, 0],
          [5, 0, 0],
        ]}
      />
      {/* COMP to COND */}
      <FlowLine
        points={[
          [5, 0, 0],
          [5, -2, 0],
        ]}
      />
      {/* COND to Blower */}
      <FlowLine
        points={[
          [5, -2, 0],
          [2, -3, 0],
        ]}
      />
      {/* Blower to TH (T2 connects back to TH) */}
      <FlowLine
        points={[
          [2, -3, 0],
          [-2, 0, 0],
        ]}
      />
    </>
  );
}
