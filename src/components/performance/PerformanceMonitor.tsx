"use client";

import React, { useState } from 'react';
import { PerformanceMetricsDashboard } from './PerformanceMetricsDashboard';
import { usePerformance } from '../../contexts/PerformanceContext';

export const PerformanceMonitor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { metrics, deviceCapabilities } = usePerformance();
  
  // Show a small indicator with basic metrics that can be expanded
  return (
    <>
      {/* Floating indicator button */}
      <div 
        className="fixed bottom-4 right-4 z-50 flex flex-col items-end"
        style={{ pointerEvents: 'none' }}
      >
        {/* Full dashboard when expanded */}
        {isVisible && (
          <div 
            className="mb-2 w-full max-w-3xl"
            style={{ pointerEvents: 'auto' }}
          >
            <PerformanceMetricsDashboard />
          </div>
        )}
        
        {/* Indicator button */}
        <button
          onClick={() => setIsVisible(!isVisible)}
          className={`rounded-full p-2 shadow-lg flex items-center space-x-2 transition-all ${
            isVisible ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
          }`}
          style={{ pointerEvents: 'auto' }}
        >
          <div className="flex items-center">
            <span className="text-xs font-medium mr-2">
              {isVisible ? 'Hide Metrics' : 'Performance'}
            </span>
            
            {/* FPS indicator */}
            <div className="flex items-center mr-2">
              <span className="text-xs mr-1">FPS:</span>
              <span className={`text-xs font-bold ${
                metrics.fps && metrics.fps >= 50 ? 'text-green-500' : 
                metrics.fps && metrics.fps >= 30 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {metrics.fps || 'N/A'}
              </span>
            </div>
            
            {/* LCP indicator */}
            <div className="flex items-center">
              <span className="text-xs mr-1">LCP:</span>
              <span className={`text-xs font-bold ${
                metrics.LCP && metrics.LCP < 2500 ? 'text-green-500' : 
                metrics.LCP && metrics.LCP < 4000 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {metrics.LCP ? `${(metrics.LCP / 1000).toFixed(1)}s` : 'N/A'}
              </span>
            </div>
          </div>
        </button>
      </div>
    </>
  );
};