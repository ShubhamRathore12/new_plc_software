"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { getRelatedRoutes } from '@/lib/route-splitting';

export const RoutePrefetcher: React.FC = () => {
  const pathname = usePathname();
  
  useEffect(() => {
    const relatedRoutes = getRelatedRoutes(pathname);
    
    // Use Next.js router to prefetch related routes
    if (relatedRoutes.length > 0 && typeof window !== 'undefined') {
      // Wait a bit to ensure the current page is loaded first
      const timer = setTimeout(() => {
        // For Next.js App Router, we need to use link prefetching
        // Create invisible link elements with prefetch
        relatedRoutes.forEach(route => {
          try {
            // Create a link element for prefetching
            const linkEl = document.createElement('link');
            linkEl.rel = 'prefetch';
            linkEl.href = route;
            linkEl.as = 'document';
            
            // Add to head and remove after a delay
            document.head.appendChild(linkEl);
            
            // Remove the link element after it's been processed
            setTimeout(() => {
              if (document.head.contains(linkEl)) {
                document.head.removeChild(linkEl);
              }
            }, 3000);
          } catch (error) {
            console.error(`Failed to prefetch route: ${route}`, error);
          }
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [pathname]);
  
  return null;
};

export default RoutePrefetcher;