"use client";

import React from 'react';
import { lazyLoad, lazy3D, lazyChart } from '@/lib/lazy-load';
import { usePerformance } from '@/contexts/PerformanceContext';

// Lazy load the 3D components
const LazyThreeBackground = lazy3D(
  () => import('@/components/ThreeBackground'),
  'ThreeBackground',
  '400px'
);

const LazyDashboard3D = lazy3D(
  () => import('@/components/Dashbaord3d'),
  'Dashboard3D',
  '600px'
);

// Lazy load regular components with custom loading states
const LazyDataViewer = lazyLoad(
  () => import('@/components/DataViewer'),
  'DataViewer',
  ({ height = '300px', className = '' }) => (
    <div className={`p-4 border rounded-md ${className}`} style={{ height }}>
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  ),
  { height: '300px' }
);

// Example component to demonstrate lazy loading
const LazyLoadingExample: React.FC = () => {
  const { deviceCapabilities } = usePerformance();
  const [showComponents, setShowComponents] = React.useState({
    threeBackground: false,
    dashboard3D: false,
    dataViewer: false
  });

  return (
    <div className="space-y-8 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Lazy Loading Components</h2>
        <p className="mb-4">
          This example demonstrates lazy loading of components with custom loading states.
          Components are only loaded when they become visible or when explicitly requested.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setShowComponents(prev => ({ ...prev, threeBackground: !prev.threeBackground }))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            {showComponents.threeBackground ? 'Hide' : 'Show'} Three Background
          </button>
          
          <button
            onClick={() => setShowComponents(prev => ({ ...prev, dashboard3D: !prev.dashboard3D }))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            {showComponents.dashboard3D ? 'Hide' : 'Show'} Dashboard 3D
          </button>
          
          <button
            onClick={() => setShowComponents(prev => ({ ...prev, dataViewer: !prev.dataViewer }))}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            {showComponents.dataViewer ? 'Hide' : 'Show'} Data Viewer
          </button>
        </div>
        
        <div className="space-y-6">
          {showComponents.threeBackground && (
            <div className="border rounded-lg overflow-hidden">
              <h3 className="p-3 bg-gray-100 dark:bg-gray-700">Three Background</h3>
              <LazyThreeBackground />
            </div>
          )}
          
          {showComponents.dashboard3D && (
            <div className="border rounded-lg overflow-hidden">
              <h3 className="p-3 bg-gray-100 dark:bg-gray-700">Dashboard 3D</h3>
              <LazyDashboard3D />
            </div>
          )}
          
          {showComponents.dataViewer && (
            <div className="border rounded-lg overflow-hidden">
              <h3 className="p-3 bg-gray-100 dark:bg-gray-700">Data Viewer</h3>
              <LazyDataViewer />
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Device Capabilities</h2>
        <p className="mb-4">
          Components are loaded with different quality settings based on your device capabilities:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <h3 className="font-semibold mb-2">Device Tier</h3>
            <p className="text-lg">{deviceCapabilities.tier}</p>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <h3 className="font-semibold mb-2">Connection</h3>
            <p className="text-lg">{deviceCapabilities.connection}</p>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <h3 className="font-semibold mb-2">GPU Tier</h3>
            <p className="text-lg">{deviceCapabilities.gpu.tier}</p>
          </div>
          
          <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
            <h3 className="font-semibold mb-2">Screen Size</h3>
            <p className="text-lg">{deviceCapabilities.screenSize.width} x {deviceCapabilities.screenSize.height}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LazyLoadingExample;