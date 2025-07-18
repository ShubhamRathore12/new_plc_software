"use client";

import React, { useRef, useEffect } from 'react';
import { usePerformance } from '../../contexts/PerformanceContext';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment, Loader } from '@react-three/drei';
import * as THREE from 'three';
import { startPerformanceMeasure } from '../../lib/performance-utils';

// Component to handle adaptive quality based on device capabilities
const AdaptiveQualityController = () => {
  const { deviceCapabilities } = usePerformance();
  const { gl } = useThree();
  
  useEffect(() => {
    // Adjust renderer settings based on device tier
    if (deviceCapabilities.tier === 'low') {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1));
      gl.shadowMap.enabled = false;
      gl.shadowMap.type = THREE.BasicShadowMap;
    } else if (deviceCapabilities.tier === 'medium') {
      gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFShadowMap;
    } else {
      gl.setPixelRatio(window.devicePixelRatio);
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }
  }, [deviceCapabilities.tier, gl]);
  
  return null;
};

// Progressive loading model component
interface ProgressiveModelProps {
  url: string;
  position?: [number, number, number];
  scale?: number;
}

const ProgressiveModel: React.FC<ProgressiveModelProps> = ({ 
  url, 
  position = [0, 0, 0], 
  scale = 1 
}) => {
  const { deviceCapabilities } = usePerformance();
  const modelRef = React.useRef<THREE.Group>(null);
  
  // Load model with appropriate level of detail
  const { scene } = useGLTF(url, true);
  
  useEffect(() => {
    if (!scene) return;
    
    // Apply optimizations based on device tier
    scene.traverse((object:any) => {
      if (object.isMesh) {
        // Apply appropriate material settings based on device tier
        if (deviceCapabilities.tier === 'low') {
          object.material.flatShading = true;
          object.material.precision = 'lowp';
          object.material.fog = false;
          object.castShadow = false;
          object.receiveShadow = false;
        } else if (deviceCapabilities.tier === 'medium') {
          object.material.flatShading = false;
          object.material.precision = 'mediump';
          object.material.fog = true;
          object.castShadow = true;
          object.receiveShadow = true;
        } else {
          object.material.flatShading = false;
          object.material.precision = 'highp';
          object.material.fog = true;
          object.castShadow = true;
          object.receiveShadow = true;
        }
      }
    });
  }, [scene, deviceCapabilities.tier]);
  
  // Measure render performance
  useFrame(() => {
    const measureEnd = startPerformanceMeasure('modelRender');
    // Render logic here
    measureEnd();
  });
  
  return (
    <primitive 
      ref={modelRef}
      object={scene} 
      position={position} 
      scale={scale} 
    />
  );
};

// Main optimized Three.js scene component
export const OptimizedThreeScene: React.FC<{
  modelUrl: string;
  className?: string;
}> = ({ modelUrl, className = '' }) => {
  const { deviceCapabilities } = usePerformance();
  
  return (
    <div className={`relative ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, deviceCapabilities.tier === 'high' ? 2 : 1.5]}
        performance={{ min: 0.5 }}
        shadows={deviceCapabilities.tier !== 'low'}
      >
        <AdaptiveQualityController />
        <ambientLight intensity={0.5} />
        <spotLight 
          position={[10, 10, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={1} 
          castShadow={deviceCapabilities.tier !== 'low'} 
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <ProgressiveModel 
          url={modelUrl} 
          position={[0, 0, 0]} 
          scale={1} 
        />
        <OrbitControls 
          enableDamping={deviceCapabilities.tier !== 'low'} 
          dampingFactor={0.05} 
          rotateSpeed={0.5} 
        />
        <Environment preset="sunset" />
      </Canvas>
      <Loader />
    </div>
  );
};