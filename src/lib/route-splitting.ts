import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Define route groups for prefetching
export const routeGroups = {
  dashboard: [
    '/dashboard',
    '/monitoring-locations',
    '/devices',
  ],
  reports: [
    '/reports',
    '/performance-demo',
  ],
  settings: [
    '/contacts',
    '/notifications',
    '/triggers',
  ],
  visualization: [
    '/3d',
    '/aeration',
    '/technik',
  ],
};

// Function to get related routes based on current path
export const getRelatedRoutes = (currentPath: string): string[] => {
  for (const [_, routes] of Object.entries(routeGroups)) {
    if (routes.includes(currentPath)) {
      return routes.filter(route => route !== currentPath);
    }
  }
  return [];
};

// Hook to prefetch related routes
export const usePrefetchRelatedRoutes = () => {
  const pathname = usePathname();
  
  useEffect(() => {
    const relatedRoutes = getRelatedRoutes(pathname);
    
    // Use Next.js router to prefetch related routes
    if (relatedRoutes.length > 0 && typeof window !== 'undefined') {
      const prefetchRoutes = async () => {
        // Wait a bit to ensure the current page is loaded first
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
      };
      
      prefetchRoutes();
    }
  }, [pathname]);
};

// Export a component that can be used to enable route prefetching
export const RoutePrefetcher: React.FC = () => {
  usePrefetchRelatedRoutes();
  return null;
};