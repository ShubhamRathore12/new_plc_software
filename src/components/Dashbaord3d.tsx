"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";

const Dashboard3D = () => {
  return (
    <div className="w-full h-[600px] relative">
      {/* Optional 3D Scene Canvas */}
      <Canvas>
        <OrbitControls />
        <Environment preset="sunset" />
        {/* You can load any 3D model here using useGLTF or custom components */}
      </Canvas>

      {/* Sketchfab iframe OVERLAY - separate from the Canvas */}
      <div className="absolute inset-0 z-10">
        <iframe
          title="industrial chillers"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; xr-spatial-tracking"
          className="w-full h-full"
          src="https://sketchfab.com/models/47d07d52ef984c568597475094835fbe/embed"
        />
      </div>
    </div>
  );
};

export default Dashboard3D;
