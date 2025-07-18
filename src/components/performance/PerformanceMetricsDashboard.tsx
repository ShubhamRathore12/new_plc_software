import React, { useState } from 'react';
import { usePerformance } from '../../contexts/PerformanceContext';

interface MetricCardProps {
  title: string;
  value: string | number | null;
  unit?: string;
  status?: 'good' | 'warning' | 'poor';
  description?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit = '', 
  status = 'good',
  description
}) => {
  const statusColors = {
    good: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    poor: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${statusColors[status]} transition-all`}>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">{title}</h3>
        {description && (
          <div className="relative group">
            <span className="cursor-help text-gray-500">ⓘ</span>
            <div className="absolute bottom-full mb-2 hidden group-hover:block bg-white p-2 rounded shadow-lg text-xs w-48 z-10">
              {description}
            </div>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold mt-1">
        {value !== null ? value : 'N/A'}{unit && value !== null ? unit : ''}
      </p>
    </div>
  );
};

export const PerformanceMetricsDashboard: React.FC<{
  className?: string;
  compact?: boolean;
}> = ({ className = '', compact = false }) => {
  const { metrics, deviceCapabilities } = usePerformance();
  const [isExpanded, setIsExpanded] = useState(!compact);

  // Helper function to determine status based on metric values
  const getWebVitalStatus = (
    metric: string, 
    value: number | null
  ): 'good' | 'warning' | 'poor' => {
    if (value === null) return 'good';
    
    switch (metric) {
      case 'LCP':
        return value < 2500 ? 'good' : value < 4000 ? 'warning' : 'poor';
      case 'FID':
        return value < 100 ? 'good' : value < 300 ? 'warning' : 'poor';
      case 'CLS':
        return value < 0.1 ? 'good' : value < 0.25 ? 'warning' : 'poor';
      case 'FCP':
        return value < 1800 ? 'good' : value < 3000 ? 'warning' : 'poor';
      case 'TTFB':
        return value < 800 ? 'good' : value < 1800 ? 'warning' : 'poor';
      case 'fps':
        return value >= 50 ? 'good' : value >= 30 ? 'warning' : 'poor';
      default:
        return 'good';
    }
  };

  const webVitalsDescriptions = {
    LCP: 'Largest Contentful Paint: measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.',
    FID: 'First Input Delay: measures interactivity. To provide a good user experience, pages should have a FID of 100 milliseconds or less.',
    CLS: 'Cumulative Layout Shift: measures visual stability. To provide a good user experience, pages should maintain a CLS of 0.1 or less.',
    FCP: 'First Contentful Paint: measures when the browser renders the first bit of content from the DOM.',
    TTFB: 'Time to First Byte: measures the time between the request for a resource and when the first byte of a response begins to arrive.',
  };

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Performance Metrics</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="p-4">
          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Device Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <MetricCard 
                title="Device Tier" 
                value={deviceCapabilities.tier} 
                description="Overall performance capability of the device"
              />
              <MetricCard 
                title="Connection" 
                value={deviceCapabilities.connection} 
                description="Network connection type"
              />
              <MetricCard 
                title="Memory" 
                value={deviceCapabilities.memory || 'Unknown'} 
                unit={deviceCapabilities.memory ? ' GB' : ''}
                description="Device memory capacity"
              />
              <MetricCard 
                title="GPU Tier" 
                value={deviceCapabilities.gpu.tier} 
                description="Graphics processing capability"
              />
              <MetricCard 
                title="Screen Size" 
                value={`${deviceCapabilities.screenSize.width}x${deviceCapabilities.screenSize.height}`} 
                description="Current viewport dimensions"
              />
              <MetricCard 
                title="Platform" 
                value={deviceCapabilities.isCapacitor ? 'Capacitor' : (deviceCapabilities.isMobile ? 'Mobile Web' : 'Desktop Web')} 
                description="Current platform"
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Web Vitals</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
              <MetricCard 
                title="LCP" 
                value={metrics.LCP !== null ? (metrics.LCP / 1000).toFixed(2) : null} 
                unit="s" 
                status={getWebVitalStatus('LCP', metrics.LCP)}
                description={webVitalsDescriptions.LCP}
              />
              <MetricCard 
                title="FID" 
                value={metrics.FID} 
                unit="ms" 
                status={getWebVitalStatus('FID', metrics.FID)}
                description={webVitalsDescriptions.FID}
              />
              <MetricCard 
                title="CLS" 
                value={metrics.CLS !== null ? metrics.CLS.toFixed(3) : null} 
                status={getWebVitalStatus('CLS', metrics.CLS)}
                description={webVitalsDescriptions.CLS}
              />
              <MetricCard 
                title="FCP" 
                value={metrics.FCP !== null ? (metrics.FCP / 1000).toFixed(2) : null} 
                unit="s" 
                status={getWebVitalStatus('FCP', metrics.FCP)}
                description={webVitalsDescriptions.FCP}
              />
              <MetricCard 
                title="TTFB" 
                value={metrics.TTFB !== null ? (metrics.TTFB / 1000).toFixed(2) : null} 
                unit="s" 
                status={getWebVitalStatus('TTFB', metrics.TTFB)}
                description={webVitalsDescriptions.TTFB}
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-md font-medium mb-2">Runtime Metrics</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricCard 
                title="FPS" 
                value={metrics.fps} 
                status={getWebVitalStatus('fps', metrics.fps)}
                description="Frames per second - measures rendering smoothness"
              />
              <MetricCard 
                title="Memory Usage" 
                value={metrics.memoryUsage !== null ? metrics.memoryUsage.toFixed(1) : null} 
                unit=" MB"
                description="JavaScript heap memory usage"
              />
              <MetricCard 
                title="Network Requests" 
                value={metrics.networkRequests.count} 
                description="Total number of network requests"
              />
              <MetricCard 
                title="Network Size" 
                value={metrics.networkRequests.totalSize > 0 ? (metrics.networkRequests.totalSize / (1024 * 1024)).toFixed(2) : 0} 
                unit=" MB"
                description="Total size of network requests"
              />
              <MetricCard 
                title="Avg Request Time" 
                value={metrics.networkRequests.averageTime > 0 ? metrics.networkRequests.averageTime.toFixed(0) : 0} 
                unit=" ms"
                description="Average network request duration"
              />
            </div>
          </div>

          {Object.keys(metrics.renderTime).length > 0 && (
            <div>
              <h3 className="text-md font-medium mb-2">Component Render Times</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(metrics.renderTime).map(([component, time]) => (
                  <MetricCard 
                    key={component}
                    title={component} 
                    value={time.toFixed(1)} 
                    unit=" ms"
                    description={`Render time for ${component} component`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};