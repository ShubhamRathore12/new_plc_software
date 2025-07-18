"use client";

import React, { Suspense, lazy, ComponentType } from 'react';
import { usePerformance } from '@/contexts/PerformanceContext';

interface LoadingProps {
  height?: string | number;
  className?: string;
}

// Default loading skeleton component
export const LoadingSkeleton: React.FC<LoadingProps> = ({ 
  height = '200px',
  className = ''
}) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${className}`}
      style={{ height }}
    />
  );
};

// Custom loading component for 3D content
export const Loading3DSkeleton: React.FC<LoadingProps> = ({ 
  height = '400px',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">
          <svg 
            className="w-12 h-12 animate-spin" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="mt-2 text-center">Loading 3D content...</p>
        </div>
      </div>
    </div>
  );
};

// Custom loading component for charts and data visualizations
export const LoadingChartSkeleton: React.FC<LoadingProps> = ({ 
  height = '300px',
  className = ''
}) => {
  return (
    <div className={`relative ${className}`} style={{ height }}>
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-full px-8">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-6"></div>
          <div className="flex justify-between items-end w-full h-40">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div 
                key={i} 
                className="w-8 bg-gray-300 dark:bg-gray-700 rounded-t"
                style={{ height: `${Math.random() * 100}%` }}
              />
            ))}
          </div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mt-6"></div>
        </div>
      </div>
    </div>
  );
};

// Function to create a lazy-loaded component with performance tracking
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string,
  LoadingComponent: React.FC<LoadingProps> = LoadingSkeleton,
  loadingProps: LoadingProps = {}
) {
  const LazyComponent = lazy(importFunc);
  
  const LazyLoadedComponent = (props: React.ComponentProps<T>) => {
    const { trackRenderTime } = usePerformance();
    const startTime = performance.now();
    
    React.useEffect(() => {
      const renderTime = performance.now() - startTime;
      trackRenderTime(`${componentName}:loaded`, renderTime);
    }, []);
    
    return (
      <Suspense fallback={<LoadingComponent {...loadingProps} />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
  
  return LazyLoadedComponent;
}

// Function to create a lazy-loaded 3D component
export function lazy3D<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string,
  height: string | number = '400px',
  className: string = ''
) {
  return lazyLoad(
    importFunc,
    componentName,
    Loading3DSkeleton,
    { height, className }
  );
}

// Function to create a lazy-loaded chart component
export function lazyChart<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  componentName: string,
  height: string | number = '300px',
  className: string = ''
) {
  return lazyLoad(
    importFunc,
    componentName,
    LoadingChartSkeleton,
    { height, className }
  );
}