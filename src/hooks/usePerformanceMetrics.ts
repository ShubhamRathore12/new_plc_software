import { useEffect, useState, useRef } from 'react';
import { useWebVitals, WebVitalsMetrics } from './useWebVitals';
import { useDeviceCapabilities } from './useDeviceCapabilities';

export interface PerformanceMetrics extends WebVitalsMetrics {
  fps: number | null;
  memoryUsage: number | null;
  renderTime: Record<string, number>;
  networkRequests: {
    count: number;
    totalSize: number;
    averageTime: number;
  };
}

/**
 * Hook to track comprehensive performance metrics
 * @returns Current performance metrics
 */
export const usePerformanceMetrics = () => {
  const webVitals = useWebVitals();
  const deviceCapabilities = useDeviceCapabilities();
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    ...webVitals,
    fps: null,
    memoryUsage: null,
    renderTime: {},
    networkRequests: {
      count: 0,
      totalSize: 0,
      averageTime: 0,
    },
  });

  // Refs for FPS calculation
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const animationFrameRef = useRef<number | null>(null);

  // Track component render times
  const trackRenderTime = (componentName: string, time: number) => {
    setMetrics(prev => ({
      ...prev,
      renderTime: {
        ...prev.renderTime,
        [componentName]: time,
      },
    }));
  };

  // Calculate FPS
  useEffect(() => {
    const calculateFps = () => {
      frameCountRef.current += 1;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      // Update FPS every second
      if (elapsed >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / elapsed);
        
        setMetrics(prev => ({
          ...prev,
          fps,
        }));

        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameRef.current = requestAnimationFrame(calculateFps);
    };

    // Only run FPS tracking on high and medium tier devices to avoid performance impact on low-end devices
    if (deviceCapabilities.tier !== 'low') {
      animationFrameRef.current = requestAnimationFrame(calculateFps);
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [deviceCapabilities.tier]);

  // Track memory usage
  useEffect(() => {
    const trackMemory = () => {
      if ((performance as any).memory) {
        setMetrics(prev => ({
          ...prev,
          memoryUsage: (performance as any).memory.usedJSHeapSize / (1024 * 1024), // Convert to MB
        }));
      }
    };

    // Only track memory on high and medium tier devices
    if (deviceCapabilities.tier !== 'low' && (performance as any).memory) {
      const memoryInterval = setInterval(trackMemory, 2000);
      return () => clearInterval(memoryInterval);
    }
  }, [deviceCapabilities.tier]);

  // Track network requests using PerformanceObserver
  useEffect(() => {
    if (typeof PerformanceObserver !== 'undefined') {
      let requestCount = 0;
      let totalSize = 0;
      let totalTime = 0;

      const entryHandler = (entries: PerformanceObserverEntryList) => {
        entries.getEntries().forEach(entry => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            requestCount++;
            
            // Calculate size if available
            if (resourceEntry.transferSize) {
              totalSize += resourceEntry.transferSize;
            }
            
            // Calculate time
            totalTime += resourceEntry.duration;
            
            setMetrics(prev => ({
              ...prev,
              networkRequests: {
                count: requestCount,
                totalSize: totalSize,
                averageTime: requestCount > 0 ? totalTime / requestCount : 0,
              },
            }));
          }
        });
      };

      const observer = new PerformanceObserver(entryHandler);
      observer.observe({ entryTypes: ['resource'] });

      return () => observer.disconnect();
    }
  }, []);

  // Update metrics with web vitals
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      ...webVitals,
    }));
  }, [webVitals]);

  return {
    metrics,
    trackRenderTime,
    deviceCapabilities,
  };
};