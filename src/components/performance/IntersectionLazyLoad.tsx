"use client";

import React from 'react';
import { LazyLoadOnVisible } from '@/hooks/useIntersectionObserver';
import { usePerformance } from '@/contexts/PerformanceContext';

// Component that will be lazy loaded
const HeavyComponent: React.FC<{ index: number }> = ({ index }) => {
  const { trackRenderTime } = usePerformance();
  const startTime = performance.now();
  
  // Simulate a heavy component by creating a large array
  const items = Array.from({ length: 1000 }, (_, i) => i);
  
  React.useEffect(() => {
    const renderTime = performance.now() - startTime;
    trackRenderTime(`HeavyComponent-${index}`, renderTime);
  }, [index, trackRenderTime]);
  
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Heavy Component {index}</h3>
      <div className="grid grid-cols-5 gap-2">
        {items.slice(0, 20).map((item) => (
          <div 
            key={item} 
            className="h-8 bg-blue-500 dark:bg-blue-700 rounded"
            style={{ opacity: (item + 1) / 20 }}
          />
        ))}
      </div>
    </div>
  );
};

// Placeholder component shown while the actual component is not yet visible
const PlaceholderComponent: React.FC = () => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="h-8 bg-gray-300 dark:bg-gray-700 rounded" />
        ))}
      </div>
    </div>
  </div>
);

// Main component that demonstrates intersection observer-based lazy loading
const IntersectionLazyLoad: React.FC = () => {
  return (
    <div className="space-y-8 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Intersection Observer Lazy Loading</h2>
        <p className="mb-4">
          Scroll down to see components load only when they become visible in the viewport.
          This technique reduces initial load time and saves resources.
        </p>
      </div>
      
      {/* First component is loaded immediately */}
      <HeavyComponent index={1} />
      
      {/* Spacer to ensure scrolling is needed */}
      <div className="h-[50vh]" />
      
      {/* Components below are lazy loaded when they become visible */}
      {Array.from({ length: 5 }).map((_, i) => (
        <LazyLoadOnVisible
          key={i + 2}
          placeholder={<PlaceholderComponent />}
          rootMargin="100px"
        >
          <HeavyComponent index={i + 2} />
        </LazyLoadOnVisible>
      ))}
    </div>
  );
};

export default IntersectionLazyLoad;