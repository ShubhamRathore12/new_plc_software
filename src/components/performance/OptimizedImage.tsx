import React, { useMemo } from 'react';
import Image, { ImageProps } from 'next/image';
import { useDeviceCapabilities } from '@/hooks/useDeviceCapabilities';

export interface OptimizedImageProps extends Omit<ImageProps, 'quality'> {
  /**
   * Low quality version (0-100) for low-end devices
   * @default 60
   */
  lowQuality?: number;
  
  /**
   * Medium quality version (0-100) for medium-tier devices
   * @default 75
   */
  mediumQuality?: number;
  
  /**
   * High quality version (0-100) for high-end devices
   * @default 90
   */
  highQuality?: number;
  
  /**
   * Whether to use WebP format when supported
   * @default true
   */
  useWebP?: boolean;
  
  /**
   * Whether to use AVIF format when supported (higher compression but less support)
   * @default false
   */
  useAVIF?: boolean;
  
  /**
   * Sizes attribute for responsive images
   * If not provided, it will be automatically generated based on device capabilities
   */
  sizes?: string;
  
  /**
   * Whether to enable blur placeholder
   * Will be disabled on low-end devices to save memory
   * @default true
   */
  enableBlur?: boolean;
}

/**
 * OptimizedImage component that extends Next.js Image with responsive sizing and format optimization
 * based on device capabilities
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  lowQuality = 60,
  mediumQuality = 75,
  highQuality = 90,
  useWebP = true,
  useAVIF = false,
  sizes,
  enableBlur = true,
  placeholder,
  priority,
  ...props
}) => {
  const deviceCapabilities = useDeviceCapabilities();
  
  // Determine image quality based on device tier
  const quality = useMemo(() => {
    switch (deviceCapabilities.tier) {
      case 'low':
        return lowQuality;
      case 'medium':
        return mediumQuality;
      case 'high':
        return highQuality;
      default:
        return mediumQuality;
    }
  }, [deviceCapabilities.tier, lowQuality, mediumQuality, highQuality]);
  
  // Determine image formats based on device capabilities and preferences
  const formats = useMemo(() => {
    const supportedFormats = [];
    
    // Only use AVIF on high-end devices if enabled
    if (useAVIF && deviceCapabilities.tier === 'high') {
      supportedFormats.push('image/avif');
    }
    
    // Use WebP on medium and high-end devices if enabled
    if (useWebP && deviceCapabilities.tier !== 'low') {
      supportedFormats.push('image/webp');
    }
    
    // Always include original format as fallback
    supportedFormats.push('image/jpeg', 'image/png');
    
    return supportedFormats;
  }, [useAVIF, useWebP, deviceCapabilities.tier]);
  
  // Generate responsive sizes if not provided
  const responsiveSizes = useMemo(() => {
    if (sizes) return sizes;
    
    // Generate sizes based on device capabilities
    if (deviceCapabilities.isMobile) {
      return '(max-width: 640px) 100vw, (max-width: 768px) 75vw, 50vw';
    }
    
    return '(max-width: 1024px) 75vw, (max-width: 1536px) 50vw, 33vw';
  }, [sizes, deviceCapabilities.isMobile]);
  
  // Determine if we should use blur placeholder
  // Disable blur on low-end devices to save memory
  const shouldUseBlur = enableBlur && deviceCapabilities.tier !== 'low';
  
  // Determine loading strategy
  // Use eager loading for priority images or for above-the-fold images on high-end devices
  const loadingStrategy = priority ? 'eager' : 'lazy';
  
  return (
    <Image
      {...props}
      quality={quality}
      sizes={responsiveSizes}
      placeholder={shouldUseBlur && placeholder ? placeholder : undefined}
      priority={priority}
      loading={loadingStrategy}
      // @ts-ignore - Next.js types don't include formats yet, but it's supported
      formats={formats}
    />
  );
};

export default OptimizedImage;