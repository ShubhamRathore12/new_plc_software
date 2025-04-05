// src/components/Chiller.tsx
import React from "react";
import { useGLTF } from "@react-three/drei";

const Chiller = () => {
  const gltf = useGLTF("/models/chiller.gltf"); // Path inside public folder
  return <primitive object={gltf.scene} scale={0.5} />;
};

export default Chiller;
