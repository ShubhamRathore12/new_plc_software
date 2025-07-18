import { useEffect, useState } from 'react';

export interface DeviceCapabilities {
  tier: 'low' | 'medium' | 'high';
  connection: 'slow-2g' | '2g' | '3g' | '4g' | 'wifi' | 'unknown';
  memory: number;
  gpu: {
    tier: 'low' | 'medium' | 'high';
    features: string[];
  };
  isCapacitor: boolean;
  isMobile: boolean;
  isTouch: boolean;
  screenSize: {
    width: number;
    height: number;
  };
}

/**
 * Hook to detect device capabilities
 * @returns Device capabilities information
 */
export const useDeviceCapabilities = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    tier: 'medium', // Default to medium until we can determine
    connection: 'unknown',
    memory: 0,
    gpu: {
      tier: 'medium',
      features: [],
    },
    isCapacitor: false,
    isMobile: false,
    isTouch: false,
    screenSize: {
      width: 0,
      height: 0,
    },
  });

  useEffect(() => {
    // Function to determine device tier based on various factors
    const determineDeviceTier = () => {
      // Check for Capacitor
      const isCapacitor = typeof window !== 'undefined' && 
        window.hasOwnProperty('Capacitor');

      // Check for mobile
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
        .test(navigator.userAgent);

      // Check for touch capability
      const isTouch = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        (navigator as any).msMaxTouchPoints > 0;

      // Get screen dimensions
      const screenSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // Get memory info if available
      let memory = 0;
      if ((navigator as any).deviceMemory) {
        memory = (navigator as any).deviceMemory;
      }

      // Determine connection type
      let connection: DeviceCapabilities['connection'] = 'unknown';
      const navConnection = (navigator as any).connection;
      if (navConnection) {
        if (navConnection.effectiveType) {
          connection = navConnection.effectiveType as DeviceCapabilities['connection'];
        }
      }

      // Determine GPU capabilities
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
      
      let gpuTier: 'low' | 'medium' | 'high' = 'medium';
      const gpuFeatures: string[] = [];
      
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          
          // Check for high-end GPU indicators
          if (
            /NVIDIA/i.test(renderer) || 
            /AMD Radeon/i.test(renderer) || 
            /Intel Iris/i.test(renderer)
          ) {
            gpuTier = 'high';
          } 
          // Check for low-end GPU indicators
          else if (
            /Intel HD Graphics/i.test(renderer) || 
            /Mali-[GT][0-9]{2,3}/i.test(renderer) || 
            /Adreno 3/i.test(renderer)
          ) {
            gpuTier = 'low';
          }
          
          gpuFeatures.push(renderer);
        }
        
        // Check for WebGL2 support
        const isWebGL2 = !!canvas.getContext('webgl2');
        if (isWebGL2) {
          gpuFeatures.push('WebGL2');
        } else {
          gpuFeatures.push('WebGL1');
        }
      } else {
        gpuTier = 'low'; // No WebGL support indicates a low-end device
      }

      // Determine overall device tier
      let deviceTier: 'low' | 'medium' | 'high' = 'medium';
      
      // Low-end device indicators
      if (
        (memory > 0 && memory <= 2) || // 2GB RAM or less
        connection === 'slow-2g' || 
        connection === '2g' ||
        gpuTier === 'low' ||
        (isMobile && screenSize.width < 768)
      ) {
        deviceTier = 'low';
      } 
      // High-end device indicators
      else if (
        (memory > 0 && memory >= 8) || // 8GB RAM or more
        connection === '4g' || 
        connection === 'wifi' ||
        gpuTier === 'high' ||
        (!isMobile && screenSize.width >= 1920)
      ) {
        deviceTier = 'high';
      }

      return {
        tier: deviceTier,
        connection,
        memory,
        gpu: {
          tier: gpuTier,
          features: gpuFeatures,
        },
        isCapacitor,
        isMobile,
        isTouch,
        screenSize,
      };
    };

    // Only run in browser environment
    if (typeof window !== 'undefined') {
      const deviceCapabilities = determineDeviceTier();
      setCapabilities(deviceCapabilities);

      // Listen for connection changes if available
      const navConnection = (navigator as any).connection;
      if (navConnection) {
        const updateConnectionInfo = () => {
          setCapabilities(prev => ({
            ...prev,
            connection: navConnection.effectiveType as DeviceCapabilities['connection'],
          }));
        };
        
        navConnection.addEventListener('change', updateConnectionInfo);
        return () => {
          navConnection.removeEventListener('change', updateConnectionInfo);
        };
      }

      // Listen for resize events to update screen size
      const handleResize = () => {
        setCapabilities(prev => ({
          ...prev,
          screenSize: {
            width: window.innerWidth,
            height: window.innerHeight,
          },
        }));
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return capabilities;
};