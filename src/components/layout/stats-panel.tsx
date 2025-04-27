"use client";

import { BarChart } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

const stats = [
  { label: "sms", value: "0/50" },
  { label: "email", value: "346/1000" },
  { label: "device", value: "45/50" },
  { label: "contact", value: "4/10" },
  { label: "trigger", value: "480/500" },
  { label: "dashboard_widget", value: "3/10" },
  { label: "report", value: "17/70" },
];

export default function StatsPanel() {
  const { t } = useLanguage();

  return (
    <div className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
        <BarChart className="h-5 w-5 text-emerald-500" />
        <h2 className="text-sm text-black dark:text-white font-medium">
          {t("account_quota_stats")}
        </h2>
      </div>
      <div className="p-4">
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm text-black dark:text-white">
                {t(stat.label)}
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
