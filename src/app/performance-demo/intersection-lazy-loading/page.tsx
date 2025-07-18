"use client";

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the IntersectionLazyLoad component
const IntersectionLazyLoad = dynamic(
  () => import('@/components/performance/IntersectionLazyLoad'),
  {
    loading: () => (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    ),
    ssr: false
  }
);

export default function IntersectionLazyLoadingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Intersection Observer Lazy Loading Demo</h1>
      <IntersectionLazyLoad />
    </div>
  );
}