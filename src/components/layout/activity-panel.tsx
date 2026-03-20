"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Wifi, WifiOff, Search } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { useDataStore } from "@/lib/store";
import { getDevicesForDisplay } from "@/lib/machineRegistry";

// Derived from centralized registry — no manual updates needed
const allDevices = getDevicesForDisplay();

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.35, ease: "easeOut" },
  }),
};

export default function ActivityPanel() {
  const { t } = useLanguage();
  const { data } = useDataStore();
  const [visibleDevices, setVisibleDevices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const accessList =
      typeof data.monitorAccess === "string"
        ? data.monitorAccess.split(",").map((x: any) => x.trim())
        : Array.isArray(data.monitorAccess)
        ? data.monitorAccess.map((x: any) => x.trim())
        : [];

    const deviceAccessList = accessList.filter((item: any) =>
      item.startsWith("GTPL-")
    );

    const filtered: any = allDevices.filter(
      (device) => !deviceAccessList.includes(device.name.trim())
    );

    setVisibleDevices(filtered);
  }, [data]);

  const filteredDevices = searchQuery
    ? visibleDevices.filter(
        (d) =>
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.plc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.chillerModel?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : visibleDevices;

  return (
    <div className="p-3 space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search devices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
          {filteredDevices.length}
        </span>
      </div>

      {/* Device List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence>
          {filteredDevices.length > 0 ? (
            filteredDevices.map((device: any, index: number) => (
              <motion.div
                key={device.name}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.01, x: 4 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/10 border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-default group"
              >
                {/* Device Icon */}
                <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-600 rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <Cpu className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                </div>

                {/* Device Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {device.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      PLC: {device.plc}
                    </span>
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {device.chillerModel}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="flex-shrink-0 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Wifi className="h-3.5 w-3.5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 text-center"
            >
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                <WifiOff className="h-5 w-5 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                {searchQuery
                  ? "No devices match your search"
                  : t("no_devices_to_display") || "No devices to display."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
