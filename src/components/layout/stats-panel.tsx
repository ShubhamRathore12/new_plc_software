"use client";

import { BarChart } from "lucide-react";

const stats = [
  { label: "SMS", value: "0/50" },
  { label: "EMAIL", value: "346/1000" },
  { label: "DEVICE", value: "45/50" },
  { label: "CONTACT", value: "4/10" },
  { label: "TRIGGER", value: "480/500" },
  { label: "Dashboard Widget", value: "3/10" },
  { label: "REPORT", value: "17/70" },
];

export default function StatsPanel() {
  return (
    <div className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="p-3 border-b  border-gray-200 dark:border-gray-700 flex items-center space-x-2">
        <BarChart className="h-5 w-5 text-emerald-500" />
        <h2 className="text-sm text-black dark:text-white font-medium">
          Account Quota Stats
        </h2>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-black dark:text-white">
                {stat.label}
              </span>
              <span className="text-sm font-medium text-black dark:text-white">
                {stat.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
