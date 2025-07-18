/**
 * Utility functions for performance monitoring and optimization
 */

/**
 * Reports Web Vitals metrics to an analytics service
 * @param metric The Web Vitals metric to report
 */
export const reportWebVitalsToAnalytics = (metric: any) => {
  // This is a placeholder for sending metrics to your analytics service
  // Replace with your actual analytics implementation
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    // window.gtag('event', name, {
    //   event_category: 'Web Vitals',
    //   event_label: id,
    //   value: Math.round(name === 'CLS' ? value * 1000 : value),
    //   non_interaction: true,
    // });
    
    console.log('Reporting Web Vitals:', metric);
  }
};

/**
 * Determines if the current device is low-end based on various factors
 */
export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Check for memory constraints
  const lowMemory = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2;
  
  // Check for CPU constraints (indirect via hardwareConcurrency)
  const lowCPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
  
  // Check for slow connection
  const connection = (navigator as any).connection;
  const slowConnection = connection && 
    (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
  
  // Check for mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    .test(navigator.userAgent);
  
  // Consider it a low-end device if it meets at least two of these criteria
  let lowEndFactors = 0;
  if (lowMemory) lowEndFactors++;
  if (lowCPU) lowEndFactors++;
  if (slowConnection) lowEndFactors++;
  if (isMobile) lowEndFactors++;
  
  return lowEndFactors >= 2;
};

/**
 * Creates a performance mark and returns a function to measure the duration
 * @param markName Name of the performance mark
 * @returns Function to end the measurement and return the duration
 */
export const startPerformanceMeasure = (markName: string): () => number => {
  const uniqueMarkName = `${markName}_${Date.now()}`;
  performance.mark(uniqueMarkName);
  
  return () => {
    const measureName = `${uniqueMarkName}_measure`;
    performance.measure(measureName, uniqueMarkName);
    const entries = performance.getEntriesByName(measureName);
    const duration = entries.length > 0 ? entries[0].duration : 0;
    
    // Clean up
    performance.clearMarks(uniqueMarkName);
    performance.clearMeasures(measureName);
    
    return duration;
  };
};

/**
 * Debounces a function to improve performance
 * @param func Function to debounce
 * @param wait Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Throttles a function to improve performance
 * @param func Function to throttle
 * @param limit Limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle = false;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};