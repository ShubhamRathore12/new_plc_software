"use client";

import React from 'react';
import Link from 'next/link';
import { usePerformance } from '@/contexts/PerformanceContext';

export default function PerformanceDemoPage() {
  const { metrics, deviceCapabilities } = usePerformance();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Performance Optimization Demos</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Performance Metrics</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>FCP:</span>
              <span>{metrics.FCP ? `${metrics.FCP.toFixed(2)}ms` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>LCP:</span>
              <span>{metrics.LCP ? `${metrics.LCP.toFixed(2)}ms` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>CLS:</span>
              <span>{metrics.CLS !== null && metrics.CLS !== undefined ? metrics.CLS.toFixed(3) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>FPS:</span>
              <span>{metrics.fps ? `${metrics.fps}` : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span>Memory Usage:</span>
              <span>{metrics.memoryUsage ? `${metrics.memoryUsage.toFixed(2)} MB` : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Device Capabilities</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Device Tier:</span>
              <span>{deviceCapabilities.tier}</span>
            </div>
            <div className="flex justify-between">
              <span>Connection:</span>
              <span>{deviceCapabilities.connection}</span>
            </div>
            <div className="flex justify-between">
              <span>GPU Tier:</span>
              <span>{deviceCapabilities.gpu.tier}</span>
            </div>
            <div className="flex justify-between">
              <span>Mobile:</span>
              <span>{deviceCapabilities.isMobile ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span>Touch:</span>
              <span>{deviceCapabilities.isTouch ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/performance-demo/lazy-loading" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-2">Dynamic Import Lazy Loading</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Demonstrates lazy loading components using Next.js dynamic imports with custom loading states.
            </p>
          </div>
        </Link>

        <Link href="/performance-demo/intersection-lazy-loading" className="block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold mb-2">Intersection Observer Lazy Loading</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Demonstrates loading components only when they become visible in the viewport.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}