import React from 'react';
import { OptimizedImage } from './OptimizedImage';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

/**
 * Example component demonstrating the usage of OptimizedImage
 * with different configurations based on device capabilities
 */
export const OptimizedImageExample: React.FC = () => {
  const deviceCapabilities = useDeviceCapabilities();
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Device Capabilities</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
          <p><strong>Device Tier:</strong> {deviceCapabilities.tier}</p>
          <p><strong>Connection:</strong> {deviceCapabilities.connection}</p>
          <p><strong>Mobile:</strong> {deviceCapabilities.isMobile ? 'Yes' : 'No'}</p>
          <p><strong>GPU Tier:</strong> {deviceCapabilities.gpu.tier}</p>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Basic Optimized Image</h2>
        <div className="relative w-full h-64">
          <OptimizedImage
            src="/logo.jpeg"
            alt="Logo"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Priority Image (Above the fold)</h2>
        <div className="relative w-full h-64">
          <OptimizedImage
            src="/images/fan.jpg"
            alt="Fan"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Custom Quality Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-1">Low Quality</h3>
            <div className="relative w-full h-40">
              <OptimizedImage
                src="/images/fan.png"
                alt="Fan Low Quality"
                fill
                style={{ objectFit: 'cover' }}
                lowQuality={30}
                mediumQuality={30}
                highQuality={30}
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">Medium Quality</h3>
            <div className="relative w-full h-40">
              <OptimizedImage
                src="/images/fan.png"
                alt="Fan Medium Quality"
                fill
                style={{ objectFit: 'cover' }}
                lowQuality={60}
                mediumQuality={60}
                highQuality={60}
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">High Quality</h3>
            <div className="relative w-full h-40">
              <OptimizedImage
                src="/images/fan.png"
                alt="Fan High Quality"
                fill
                style={{ objectFit: 'cover' }}
                lowQuality={90}
                mediumQuality={90}
                highQuality={90}
              />
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Format Optimization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium mb-1">WebP Enabled</h3>
            <div className="relative w-full h-40">
              <OptimizedImage
                src="/images/fan.jpg"
                alt="Fan WebP"
                fill
                style={{ objectFit: 'cover' }}
                useWebP={true}
                useAVIF={false}
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-1">AVIF Enabled (High-end devices)</h3>
            <div className="relative w-full h-40">
              <OptimizedImage
                src="/images/fan.jpg"
                alt="Fan AVIF"
                fill
                style={{ objectFit: 'cover' }}
                useWebP={true}
                useAVIF={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizedImageExample;