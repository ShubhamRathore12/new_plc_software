import React from "react";
import { useGLTF } from "@react-three/drei";

const Chiller = () => {
  const { scene } = useGLTF("/chiller.gltf"); // Or .glb if that's the format
  return <primitive object={scene} scale={0.5} />;
};

export default Chiller;
