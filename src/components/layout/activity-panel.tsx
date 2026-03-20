"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Activity, Wifi, WifiOff, Thermometer, MapPin, Cpu, Clock } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { apiRequest } from "@/lib/api";

type MachineEntry = {
  machineName: string;
  machineType: string;
  machineStatus: boolean;
  coolingStatus: boolean;
  internetStatus: boolean;
  lastUpdate: string;
  recordId: number;
  hasNewData: boolean;
  priority: string;
  condFanOn?: boolean;
};

// Machine display info mapping
const MACHINE_INFO: Record<string, { location: string; plc: string; chiller: string }> = {
  GTPL_122_S7_1200: { location: "Noida", plc: "S7-1200", chiller: "gT-1000T" },
  GTPL_121: { location: "Kanpur", plc: "S7-1200", chiller: "gT-1000T" },
  KABO_200: { location: "Noida", plc: "S7-200", chiller: "gT-80E-P" },
  GTPL_124: { location: "Noida", plc: "S7-1200", chiller: "GT-450T" },
  GTPL_131: { location: "Noida", plc: "S7-1200", chiller: "GT-650T" },
  GTPL_132: { location: "Noida", plc: "S7-1200", chiller: "GT-300AP" },
  GTPL_134: { location: "Noida", plc: "S7-1200", chiller: "GT-450T" },
  GTPL_135: { location: "Noida", plc: "S7-1200", chiller: "GT-450T" },
  GTPL_136: { location: "Noida", plc: "S7-1200", chiller: "GT-450AP" },
  GTPL_137: { location: "Noida", plc: "S7-1200", chiller: "GT-450T" },
  GTPL_138: { location: "Noida", plc: "S7-1200", chiller: "GT-450T" },
  GTPL_139: { location: "Noida", plc: "S7-1200", chiller: "GT-300AP" },
  GTPL_142: { location: "Noida", plc: "S7-1200", chiller: "GT-450AP" },
  GTPL_123: { location: "Noida", plc: "S7-1200", chiller: "GT-450AP" },
  GTPL_143: { location: "Noida", plc: "S7-1200", chiller: "GT-450AP" },
  GTPL_061: { location: "Noida", plc: "S7-1200", chiller: "GT-450T" },
  GTPL_108: { location: "Germany", plc: "S7-200", chiller: "gT-40E-P" },
  GTPL_109: { location: "Germany", plc: "S7-200", chiller: "gT-40E-P" },
  GTPL_110: { location: "Germany", plc: "S7-200", chiller: "gT-40E-P" },
  GTPL_111: { location: "Germany", plc: "S7-200", chiller: "gT-80E-P" },
  GTPL_112: { location: "Germany", plc: "S7-200", chiller: "gT-80E-P" },
  GTPL_113: { location: "Germany", plc: "S7-200", chiller: "gT-80E-P" },
  GTPL_114: { location: "Germany", plc: "S7-1200", chiller: "gT-140E" },
  GTPL_115: { location: "Germany", plc: "S7-1200", chiller: "gT-180E" },
  GTPL_116: { location: "Germany", plc: "S7-1200", chiller: "gT-240E" },
  GTPL_117: { location: "Germany", plc: "S7-1200", chiller: "gT-320E" },
  GTPL_119: { location: "Germany", plc: "S7-1200", chiller: "gT-180E" },
  GTPL_120: { location: "Germany", plc: "S7-1200", chiller: "gT-180E" },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ActivityPanel() {
  const { t } = useLanguage();
  const [machines, setMachines] = useState<MachineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "online" | "offline">("all");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMachines = useCallback(async () => {
    try {
      const result = await apiRequest<any>("/api/machine/status-public");
      if (result.success && Array.isArray(result.data)) {
        setMachines(result.data);
      }
    } catch {
      // keep last data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMachines();
    intervalRef.current = setInterval(fetchMachines, 18000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchMachines]);

  const onlineCount = machines.filter((m) => m.machineStatus).length;
  const offlineCount = machines.filter((m) => !m.machineStatus).length;

  const filtered = machines.filter((m) => {
    if (filter === "online") return m.machineStatus;
    if (filter === "offline") return !m.machineStatus;
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-500" />
          <h2 className="text-sm font-semibold text-black dark:text-white">
            {t("device_activity") || "Device Activity"}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Summary badges */}
          <span className="text-xs px-2.5 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 font-medium">
            {onlineCount} Online
          </span>
          <span className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 font-medium">
            {offlineCount} Offline
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg w-fit">
        {(["all", "online", "offline"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
              filter === f
                ? "bg-white dark:bg-gray-600 text-black dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {f === "all" ? `All (${machines.length})` : f === "online" ? `Online (${onlineCount})` : `Offline (${offlineCount})`}
          </button>
        ))}
      </div>

      {/* Machine cards grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-gray-100 dark:bg-gray-700/50 animate-pulse" />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((machine) => {
            const info = MACHINE_INFO[machine.machineName];
            return (
              <div
                key={machine.machineName}
                className={`relative rounded-xl border p-4 transition-all hover:shadow-md ${
                  machine.machineStatus
                    ? "border-green-200 dark:border-green-800/50 bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-gray-800"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                }`}
              >
                {/* Status indicator dot */}
                <div className="absolute top-3 right-3">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      machine.machineStatus
                        ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"
                        : "bg-red-500"
                    }`}
                  />
                </div>

                {/* Machine name */}
                <div className="text-sm font-bold text-black dark:text-white mb-2 pr-6">
                  {machine.machineName}
                </div>

                {/* Info rows */}
                <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                  {info && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 shrink-0" />
                        {info.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Cpu className="h-3 w-3 shrink-0" />
                        {info.plc} &middot; {info.chiller}
                      </div>
                    </>
                  )}
                  <div className="flex items-center gap-1.5">
                    {machine.internetStatus ? (
                      <Wifi className="h-3 w-3 shrink-0 text-green-500" />
                    ) : (
                      <WifiOff className="h-3 w-3 shrink-0 text-red-400" />
                    )}
                    {machine.internetStatus ? "Connected" : "Disconnected"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="h-3 w-3 shrink-0" />
                    Cooling: {machine.coolingStatus ? (
                      <span className="text-green-600 dark:text-green-400">Active</span>
                    ) : (
                      <span className="text-red-500">Inactive</span>
                    )}
                  </div>
                </div>

                {/* Footer — last update & priority */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-gray-500">
                    <Clock className="h-3 w-3" />
                    {machine.lastUpdate ? timeAgo(machine.lastUpdate) : "N/A"}
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider ${
                      machine.priority === "high"
                        ? "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
                        : machine.priority === "medium"
                        ? "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400"
                        : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {machine.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          {t("no_devices_to_display") || "No devices to display."}
        </div>
      )}
    </div>
  );
}
