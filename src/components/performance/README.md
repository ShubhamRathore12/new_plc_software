# Performance Components

This directory contains components optimized for performance across different device capabilities.

## Components

### OptimizedImage

A wrapper around Next.js Image component that automatically adjusts image quality, format, and loading strategy based on device capabilities.

#### Features

- Automatically adjusts image quality based on device tier (low/medium/high)
- Uses modern image formats (WebP, AVIF) when supported
- Responsive sizing based on device capabilities
- Disables blur placeholders on low-end devices to save memory
- Optimizes loading strategy based on priority and device capabilities

#### Usage Example

```tsx
import { OptimizedImage } from '@/components/performance/OptimizedImage';

// Basic usage
<OptimizedImage 
  src="/path/to/image.jpg" 
  alt="Description" 
  width={800} 
  height={600} 
/>

// Advanced usage with custom quality settings
<OptimizedImage 
  src="/path/to/image.jpg" 
  alt="Description" 
  width={800} 
  height={600}
  lowQuality={50}    // Quality for low-end devices (default: 60)
  mediumQuality={70} // Quality for medium-tier devices (default: 75)
  highQuality={85}   // Quality for high-end devices (default: 90)
  useWebP={true}     // Use WebP format when supported (default: true)
  useAVIF={true}     // Use AVIF format when supported (default: false)
  enableBlur={true}  // Enable blur placeholder (default: true, disabled on low-end devices)
  priority={true}    // Load with high priority (default: false)
/>
```

#### Implementation Details

- Uses the `useDeviceCapabilities` hook to detect device capabilities
- Automatically generates responsive `sizes` attribute if not provided
- Disables expensive features on low-end devices
- Supports all Next.js Image props