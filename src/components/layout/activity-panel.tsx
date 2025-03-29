"use client";

import { Activity, Circle } from "lucide-react";

const recentActivities = [
  {
    type: "Report Vibration Report",
    status: "completed successfully",
    timestamp: "17/08/23 @ 06:05:08 am",
  },
  {
    type: "Device FLVA_A196 configuration",
    status: "updated successfully",
    timestamp: "17/08/23 @ 11:26:11 am",
  },
  {
    type: "Device FLVA_A197 configuration",
    status: "updated successfully",
    timestamp: "17/08/23 @ 11:26:04 am",
  },
];

const devices = [
  {
    name: "VI MIXER",
    lastActivity: "17/08/23 @ 03:00:08 am",
    status: "active",
  },
  {
    name: "VI CUTTER",
    lastActivity: "17/08/23 @ 03:00:08 am",
    status: "active",
  },
  {
    name: "AGITATOR MIXER 1",
    lastActivity: "17/08/23 @ 03:00:08 am",
    status: "active",
  },
  {
    name: "NAS TANK",
    lastActivity: "17/08/23 @ 03:00:08 am",
    status: "active",
  },
  {
    name: "BLENDER 09",
    lastActivity: "17/08/23 @ 03:00:08 am",
    status: "active",
  },
];

export default function ActivityPanel() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Trigger/Report Activity Card */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
          <Activity className="h-5 w-5 text-emerald-500" />
          <h2 className="text-sm font-medium text-black dark:text-white">
            Trigger/Report Activity
          </h2>
        </div>
        <div className="p-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded p-3">
            <div className="text-xs font-medium text-black dark:text-white mb-1">
              ACTIVE TRIGGER
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              No Active Triggers Found!
            </div>
          </div>
        </div>
      </div>

      {/* Device Activity Card */}
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
          <Circle className="h-5 w-5 text-emerald-500" />
          <h2 className="text-sm font-medium text-black dark:text-white">
            Device Activity
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {devices.map((device, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <div>
                <div className="text-sm font-medium text-black dark:text-white">
                  {device.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  Last Activity: {device.lastActivity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
