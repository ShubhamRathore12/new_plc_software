import React, { createContext, useContext, ReactNode } from 'react';
import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';
import { DeviceCapabilities } from '../hooks/useDeviceCapabilities';
import { PerformanceMetrics } from '../hooks/usePerformanceMetrics';

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  deviceCapabilities: DeviceCapabilities;
  trackRenderTime: (componentName: string, time: number) => void;
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined);

export const PerformanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { metrics, trackRenderTime, deviceCapabilities } = usePerformanceMetrics();

  return (
    <PerformanceContext.Provider value={{ metrics, deviceCapabilities, trackRenderTime }}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = (): PerformanceContextType => {
  const context = useContext(PerformanceContext);
  if (context === undefined) {
    throw new Error('usePerformance must be used within a PerformanceProvider');
  }
  return context;
};

// Higher-order component to track component render time
export const withPerformanceTracking = <P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
): React.FC<P> => {
  return (props: P) => {
    const { trackRenderTime } = usePerformance();
    const startTime = performance.now();
    
    React.useEffect(() => {
      const renderTime = performance.now() - startTime;
      trackRenderTime(componentName, renderTime);
    }, []);
    
    return <Component {...props} />;
  };
};