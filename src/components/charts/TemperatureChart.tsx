"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text, Grid, Line, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

// 3D component props
interface ComponentProps {
  position: [number, number, number];
  geometry: any;
  color: string;
  label?: string;
  labelPosition?: [number, number, number];
}

// Text box props
interface TextBoxProps {
  position: [number, number, number];
  width: number;
  height: number;
  title: string;
  values: string[];
  units: string[];
  colors: string[];
}

// Flow line props
interface FlowLineProps {
  points: [number, number, number][];
}

export default function TemperatureChart() {
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
          color="#000"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </>
  );
}

function TextBox({
  position,
  width,
  height,
  title,
  values,
  units,
  colors,
}: TextBoxProps) {
  return (
    <group position={position}>
      <RoundedBox args={[width, height, 0.1]} radius={0.1}>
        <meshStandardMaterial color="#fff" opacity={0.9} transparent />
      </RoundedBox>

      <Text
        position={[0, height / 2 - 0.3, 0.1]}
        fontSize={0.3}
        color="#000"
        anchorX="center"
        anchorY="middle"
      >
        {title}
      </Text>

      {values.map((value, index) => (
        <group
          key={index}
          position={[index === 0 ? -width / 4 : width / 4, 0, 0.1]}
        >
          <RoundedBox args={[width / 3, height / 3, 0.1]} radius={0.05}>
            <meshStandardMaterial
              color={colors[index]}
              opacity={0.9}
              transparent
            />
          </RoundedBox>
          <Text
            position={[0, 0, 0.2]}
            fontSize={0.3}
            color="#000"
            anchorX="center"
            anchorY="middle"
          >
            {value}
          </Text>
          <Text
            position={[0, -height / 3 - 0.2, 0.1]}
            fontSize={0.2}
            color="#000"
            anchorX="center"
            anchorY="middle"
          >
            {units[index]}
          </Text>
        </group>
      ))}
    </group>
  );
}

function ComponentGroup() {
  return (
    <>
      <Text
        position={[-6, 4, 0]}
        fontSize={0.4}
        color="#000"
        anchorX="left"
        anchorY="middle"
      >
        SR.NO:STPL-109
      </Text>

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
      <TextBox
        position={[-5, 1.5, 0]}
        width={1.5}
        height={0.8}
        title="TH"
        values={["1.9"]}
        units={["°C"]}
        colors={["#87CEEB"]}
      />
      <Component
        position={[-2, 0, 0]}
        geometry={<boxGeometry args={[1, 2, 1]} />}
        color="#00f"
        label="HTR"
        labelPosition={[-2, 2, 0]}
      />
      <TextBox
        position={[-2, -2, 0]}
        width={2.5}
        height={1}
        title="Running Time"
        values={["3", "0"]}
        units={["HOURS", "MINUTES"]}
        colors={["#87CEEB", "#87CEEB"]}
      />
      <Component
        position={[2, -3, 0]}
        geometry={<sphereGeometry args={[0.5, 32, 32]} />}
        color="#f00"
        label="BLOWER"
        labelPosition={[2, -4, 0]}
      />
      <TextBox
        position={[2, -2, 0]}
        width={1.5}
        height={0.8}
        title=""
        values={["0"]}
        units={["%"]}
        colors={["#87CEEB"]}
      />
      <TextBox
        position={[5, 2, 0]}
        width={2}
        height={1}
        title="Delta(Δ) Set Duration"
        values={["5", "9"]}
        units={["°C", "h"]}
        colors={["#000", "#000"]}
      />
      <TextBox
        position={[5, 0, 0]}
        width={1.5}
        height={0.8}
        title="T2"
        values={["3.0"]}
        units={["°C"]}
        colors={["#87CEEB"]}
      />
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
          [2, 0, 0],
          [2, -3, 0],
        ]}
      />
      <FlowLine
        points={[
          [2, -3, 0],
          [5, -3, 0],
          [5, 0, 0],
        ]}
      />
    </>
  );
}
