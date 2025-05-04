"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Grid, Line } from "@react-three/drei";
import * as THREE from "three";

interface ComponentProps {
  position: [number, number, number];
  geometry: any;
  color: string;
  label?: string;
  labelPosition?: [number, number, number];
}

interface FlowLineProps {
  points: [number, number, number][];
}

export default function PressureChart() {
  return (
    <div className="w-full h-screen bg-[#e6f0fa]">
      <Canvas camera={{ position: [10, 10, 10], fov: 60 }}>
        <SceneContent />
      </Canvas>
    </div>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Grid
        position={[0, -1, 0]}
        args={[20, 20]}
        cellColor="#00f"
        sectionColor="#00f"
        fadeDistance={50}
        infiniteGrid
      />
      <ComponentGroup />
      <FlowLines />
      <OrbitControls enablePan enableZoom enableRotate />
    </>
  );
}

function Component({
  position,
  geometry,
  color,
  label,
  labelPosition,
}: ComponentProps) {
  const ref = useRef<THREE.Mesh>(null);

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

function FlowLine({ points }: FlowLineProps) {
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

function ComponentGroup() {
  return (
    <>
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

      <Component
        position={[5, -2, 0]}
        geometry={<boxGeometry args={[2, 1, 1]} />}
        color="#f00"
        label="COND"
        labelPosition={[5, -2.5, 0]}
      />

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

function FlowLines() {
  return (
    <>
      <FlowLine
        points={[
          [-5, 0, 0],
          [-2, 0, 0],
        ]}
      />
      <FlowLine
        points={[
          [-2, 0, 0],
          [0, 0, 0],
        ]}
      />
      <FlowLine
        points={[
          [0, 0, 0],
          [2, 0, 0],
        ]}
      />
      <FlowLine
        points={[
          [2, 0, 0],
          [5, 0, 0],
        ]}
      />
      <FlowLine
        points={[
          [5, 0, 0],
          [5, -2, 0],
        ]}
      />
      <FlowLine
        points={[
          [5, -2, 0],
          [2, -3, 0],
        ]}
      />
      <FlowLine
        points={[
          [2, -3, 0],
          [-2, 0, 0],
        ]}
      />
    </>
  );
}
