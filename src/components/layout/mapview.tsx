"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { apiRequest } from "@/lib/api";

// Fix Leaflet marker icon loading in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom colored marker icons
function createIcon(color: string) {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="
      width: 14px; height: 14px;
      background: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 0 6px ${color}, 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10],
  });
}

const greenIcon = createIcon("#22c55e");
const redIcon = createIcon("#ef4444");
const yellowIcon = createIcon("#eab308");

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

// Machine location mapping — maps API machineName to coordinates and device info
const MACHINE_LOCATIONS: Record<
  string,
  { lat: number; lng: number; location: string; plc: string; chillerModel: string }
> = {
  // India — Noida / Kanpur
  GTPL_122_S7_1200: { lat: 28.5708, lng: 77.321, location: "Noida", plc: "S7-1200", chillerModel: "gT-1000T" },
  GTPL_121: { lat: 26.4499, lng: 80.3319, location: "Kanpur", plc: "S7-1200", chillerModel: "gT-1000T" },
  KABO_200: { lat: 28.545, lng: 77.3358, location: "Noida", plc: "S7-200", chillerModel: "gT-80E-P" },
  GTPL_124: { lat: 28.5677, lng: 77.3211, location: "Noida", plc: "S7-1200", chillerModel: "GT-450T" },
  GTPL_131: { lat: 28.5692, lng: 77.3181, location: "Noida", plc: "S7-1200", chillerModel: "GT-650T" },
  GTPL_132: { lat: 28.6304, lng: 77.373, location: "Noida", plc: "S7-1200", chillerModel: "GT-300AP" },
  GTPL_134: { lat: 28.575, lng: 77.325, location: "Noida", plc: "S7-1200", chillerModel: "GT-450T" },
  GTPL_135: { lat: 28.578, lng: 77.328, location: "Noida", plc: "S7-1200", chillerModel: "GT-450T" },
  GTPL_136: { lat: 28.582, lng: 77.315, location: "Noida", plc: "S7-1200", chillerModel: "GT-450AP" },
  GTPL_137: { lat: 28.585, lng: 77.332, location: "Noida", plc: "S7-1200", chillerModel: "GT-450T" },
  GTPL_138: { lat: 28.560, lng: 77.340, location: "Noida", plc: "S7-1200", chillerModel: "GT-450T" },
  GTPL_139: { lat: 28.563, lng: 77.310, location: "Noida", plc: "S7-1200", chillerModel: "GT-300AP" },
  GTPL_142: { lat: 28.555, lng: 77.345, location: "Noida", plc: "S7-1200", chillerModel: "GT-450AP" },
  GTPL_123: { lat: 28.590, lng: 77.318, location: "Noida", plc: "S7-1200", chillerModel: "GT-450AP" },
  GTPL_143: { lat: 28.548, lng: 77.350, location: "Noida", plc: "S7-1200", chillerModel: "GT-450AP" },
  GTPL_061: { lat: 28.595, lng: 77.335, location: "Noida", plc: "S7-1200", chillerModel: "GT-450T" },

  // Germany
  GTPL_108: { lat: 51.20, lng: 10.40, location: "Germany", plc: "S7-200", chillerModel: "gT-40E-P" },
  GTPL_109: { lat: 51.18, lng: 10.45, location: "Germany", plc: "S7-200", chillerModel: "gT-40E-P" },
  GTPL_110: { lat: 51.22, lng: 10.50, location: "Germany", plc: "S7-200", chillerModel: "gT-40E-P" },
  GTPL_111: { lat: 51.15, lng: 10.42, location: "Germany", plc: "S7-200", chillerModel: "gT-80E-P" },
  GTPL_112: { lat: 51.17, lng: 10.48, location: "Germany", plc: "S7-200", chillerModel: "gT-80E-P" },
  GTPL_113: { lat: 51.24, lng: 10.44, location: "Germany", plc: "S7-200", chillerModel: "gT-80E-P" },
  GTPL_114: { lat: 51.12, lng: 10.38, location: "Germany", plc: "S7-1200", chillerModel: "gT-140E" },
  GTPL_115: { lat: 51.14, lng: 10.52, location: "Germany", plc: "S7-1200", chillerModel: "gT-180E" },
  GTPL_116: { lat: 51.10, lng: 10.46, location: "Germany", plc: "S7-1200", chillerModel: "gT-240E" },
  GTPL_117: { lat: 51.26, lng: 10.36, location: "Germany", plc: "S7-1200", chillerModel: "gT-320E" },
  GTPL_119: { lat: 51.21, lng: 10.55, location: "Germany", plc: "S7-1200", chillerModel: "gT-180E" },
  GTPL_120: { lat: 51.19, lng: 10.35, location: "Germany", plc: "S7-1200", chillerModel: "gT-180E" },
};

// Format time ago
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

export default function MapView() {
  const [machines, setMachines] = useState<MachineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMachines = useCallback(async () => {
    try {
      const result = await apiRequest<any>("/api/machine/status-public");
      if (result.success && Array.isArray(result.data)) {
        setMachines(result.data);
      }
    } catch {
      // silently fail — keep showing last data
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll every 18 seconds
  useEffect(() => {
    fetchMachines();
    intervalRef.current = setInterval(fetchMachines, 18000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchMachines]);

  const liveCount = machines.filter((m) => m.machineStatus).length;
  const offlineCount = machines.filter((m) => !m.machineStatus).length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-black dark:text-white">
          Live Machine Map
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500" />
            Live: {liveCount}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500" />
            Offline: {offlineCount}
          </span>
          {loading && (
            <span className="text-gray-400 animate-pulse">Loading...</span>
          )}
        </div>
      </div>

      {/* Map */}
      <div className="w-full h-[420px] rounded-md overflow-hidden relative">
        <MapContainer
          center={[30, 50]}
          zoom={4}
          scrollWheelZoom
          className="w-full h-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {machines.map((machine) => {
            const loc = MACHINE_LOCATIONS[machine.machineName];
            if (!loc) return null;

            const icon = machine.machineStatus
              ? machine.internetStatus
                ? greenIcon
                : yellowIcon
              : redIcon;

            return (
              <Marker
                key={machine.machineName}
                position={[loc.lat, loc.lng]}
                icon={icon}
              >
                <Popup>
                  <div className="text-xs min-w-[180px]">
                    <div className="font-bold text-sm mb-1">{machine.machineName}</div>
                    <div>Location: {loc.location}</div>
                    <div>PLC: {loc.plc}</div>
                    <div>Chiller: {loc.chillerModel}</div>
                    <hr className="my-1" />
                    <div className="flex items-center gap-1">
                      Machine:
                      <span className={machine.machineStatus ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                        {machine.machineStatus ? "ONLINE" : "OFFLINE"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      Cooling:
                      <span className={machine.coolingStatus ? "text-green-600" : "text-red-600"}>
                        {machine.coolingStatus ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      Internet:
                      <span className={machine.internetStatus ? "text-green-600" : "text-red-600"}>
                        {machine.internetStatus ? "Connected" : "Disconnected"}
                      </span>
                    </div>
                    {machine.condFanOn !== undefined && (
                      <div>Condenser Fan: {machine.condFanOn ? "ON" : "OFF"}</div>
                    )}
                    <div className="text-gray-500 mt-1">
                      Last update: {machine.lastUpdate ? timeAgo(machine.lastUpdate) : "N/A"}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
