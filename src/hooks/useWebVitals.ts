import { useEffect, useState } from 'react';

// Define the Metric type since we can't import it from web-vitals
export interface Metric {
  name: string;
  value: number;
  id: string;
  delta: number;
  entries: any[];
}

export interface WebVitalsMetrics {
  CLS: number | null; // Cumulative Layout Shift
  FCP: number | null; // First Contentful Paint
  FID: number | null; // First Input Delay
  LCP: number | null; // Largest Contentful Paint
  TTFB: number | null; // Time to First Byte
}

/**
 * Hook to track Web Vitals metrics
 * @param reportToAnalytics - Optional function to report metrics to analytics
 * @returns Current Web Vitals metrics
 */
export const useWebVitals = (
  reportToAnalytics?: (metric: Metric) => void
): WebVitalsMetrics => {
  const [metrics, setMetrics] = useState<WebVitalsMetrics>({
    CLS: null,
    FCP: null,
    FID: null,
    LCP: null,
    TTFB: null,
  });

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    // Function to handle metrics
    const handleMetric = (metric: Metric) => {
      // Update state with the latest metrics
      setMetrics(prev => ({
        ...prev,
        [metric.name]: metric.value,
      }));

      // Report to analytics if function is provided
      if (reportToAnalytics) {
        reportToAnalytics(metric);
      }

      // Log metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Web Vital: ${metric.name}`, metric);
      }
    };

    // Dynamically import web-vitals to avoid build errors if the package isn't installed
    const importWebVitals = async () => {
      try {
        // Try to dynamically import web-vitals
        const webVitals:any = await import('web-vitals');
        
        // In web-vitals v5+, the API has changed to use a single 'onMetric' function
        // or individual metric functions might have different names
        if (typeof webVitals.onAll === 'function') {
          // Use onAll if available (v5+)
          webVitals.onAll(handleMetric);
        } else {
          // Fallback to individual functions with try/catch for each
          try { webVitals.onCLS?.(handleMetric); } catch (e) { console.warn('CLS not available', e); }
          try { webVitals.onFCP?.(handleMetric); } catch (e) { console.warn('FCP not available', e); }
          try { webVitals.onINP?.(handleMetric); } catch (e) { console.warn('INP not available', e); } // INP replaces FID in newer versions
          try { webVitals.onLCP?.(handleMetric); } catch (e) { console.warn('LCP not available', e); }
          try { webVitals.onTTFB?.(handleMetric); } catch (e) { console.warn('TTFB not available', e); }
        }
      } catch (error) {
        console.warn('Web Vitals library not available:', error);
        
        // Provide fallback metrics using Performance API if available
        if (window.performance) {
          // Use Performance API to get some basic metrics
          const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          if (navigationEntry) {
            // Calculate TTFB
            const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
            setMetrics(prev => ({
              ...prev,
              TTFB: ttfb,
            }));
            
            // Calculate FCP if available
            const paintEntries = performance.getEntriesByType('paint');
            const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
            if (fcpEntry) {
              setMetrics(prev => ({
                ...prev,
                FCP: fcpEntry.startTime,
              }));
            }
          }
        }
      }
    };

    importWebVitals();
    
    // No cleanup needed
  }, [reportToAnalytics]);

  return metrics;
};