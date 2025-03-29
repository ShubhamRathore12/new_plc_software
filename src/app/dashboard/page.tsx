"use client";

import dynamic from "next/dynamic";

// 🔁 Dynamically import components to avoid SSR issues
const MapView = dynamic(() => import("@/components/layout/mapview"), {
  ssr: false,
});
const ActivityPanel = dynamic(
  () => import("@/components/layout/activity-panel"),
  { ssr: false }
);
const StatsPanel = dynamic(() => import("@/components/layout/stats-panel"), {
  ssr: false,
});

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <div className="space-y-4 md:space-y-6">
        {/* Map Card */}
        <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 text-black dark:text-white">
          <MapView />
        </div>
        {/* Activity Panel Card */}
        <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 text-black dark:text-white">
          <ActivityPanel />
        </div>
      </div>
      <div>
        {/* Stats Panel Card */}
        <div className="p-4 rounded-lg shadow bg-white dark:bg-gray-800 text-black dark:text-white">
          <StatsPanel />
        </div>
      </div>
    </div>
  );
}
