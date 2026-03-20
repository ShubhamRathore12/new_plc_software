"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronDown,
  MapPin,
  Building2,
  Wifi,
  Cpu,
  Snowflake,
  Download,

  
  Eye,
  Activity,
  Signal,
} from "lucide-react";
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useFieldVisibility } from "@/hooks/useFieldVisibility";
import { useDataStore } from "@/lib/store";
import { useLanguage } from "@/providers/language-provider";
import { useMachineStatusFeed } from "@/hooks/useMachineStatusFeed";
import { useAutoData } from "@/hooks/useAutoData";
import { getDevicesForDisplay, DEVICE_TO_STATUS_KEY } from "@/lib/machineRegistry";

// Define interfaces for type safety
interface Device {
  name: string;
  location: string;
  image: string;
  plc: string;
  chillerModel: string;
}

interface Location {
  name: string;
  image: string;
}

interface DeviceStatus {
  machineStatus?: boolean;
  internetStatus?: boolean;
  condFanOn?: boolean;
}

export default function DevicesPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [zoomLevel, setZoomLevel] = useState(1);
  const { t } = useLanguage();
  const router = useRouter();

  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  const { status } = useMachineStatusFeed();
  const { data } = useDataStore();
  const { showCompanyField } = useFieldVisibility(data);

  const accessArray = (data?.user?.monitorAccess?.split(",") || []).map(
    (name: string) => name.trim().toLowerCase()
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationDropdownRef.current &&
        !locationDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLocationDropdownOpen(false);
      }
      if (
        companyDropdownRef.current &&
        !companyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCompanyDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Derived from centralized registry — no manual updates needed
  const allDevices: Device[] = getDevicesForDisplay();

  // Extract GTPL number for sorting (e.g. "GTPL-30-..." → 30, "GTPL-145-..." → 145)
  const getGtplNumber = (name: string): number => {
    const match = name.match(/GTPL-(\d+)/i);
    return match ? parseInt(match[1], 10) : 9999;
  };

  const filteredDevices = allDevices
    .filter((device) => {
      const matchesLocation =
        selectedLocation === "" ||
        selectedLocation === "All" ||
        device.location === selectedLocation;

      const isRestricted = accessArray.includes(device.name.toLowerCase());

      const shouldHideNoidaLocations =
        data?.user?.firstName?.toLowerCase() === "carl" &&
        (device.location === "Noida" || device.location === "Noida---kanpur");

      const isTantikornUser = data?.user?.firstName?.toLowerCase() === "tantikorn";
      const showOnlyThailand = isTantikornUser && device.location !== "Thailand";

      return matchesLocation && !isRestricted && !shouldHideNoidaLocations && !showOnlyThailand;
    })
    .sort((a, b) => getGtplNumber(a.name) - getGtplNumber(b.name));

  const locations: Location[] = [
    { name: t("All"), image: "/images/1200.jpg" },
    ...Array.from(new Set(allDevices.map((d) => d.location)))
      .filter((loc) => {
        if (data?.user?.firstName?.toLowerCase() === "carl" || data?.user?.firstName?.toLowerCase() === "Weinzierl") {
          return loc !== "Noida" && loc !== "Noida---kanpur";
        }
        if (data?.user?.firstName?.toLowerCase() === "tantikorn") {
          return loc === "Thailand";
        }
        return true;
      })
      .map((loc) => ({
        name: loc,
        image: loc.includes("kanpur") ? "/images/1200.jpg" : "/images/200.jpg",
      })),
  ];

  // Derived from centralized registry
  const deviceNameToStatusKey = DEVICE_TO_STATUS_KEY;

  const handleViewMore = (deviceName: string) => {
    const key = deviceNameToStatusKey[deviceName];
    const deviceStatus = status.machines.find(m => m.machineName === key);

    const machineStatusValue = deviceStatus?.machineStatus ?? false;

    const statusString = encodeURIComponent(JSON.stringify({ machineStatus: machineStatusValue }));

    router.push(`/menu/${deviceName}?status=${statusString}`);
  };

  // Stats for header
  const activeCount = filteredDevices.filter((d) => {
    const key = deviceNameToStatusKey[d.name];
    return status.machines.find((m) => m.machineName === key)?.machineStatus ?? false;
  }).length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div
          className="relative transform transition-transform origin-top-left"
          style={{
            transform: `scale(${zoomLevel}) translateX(${(zoomLevel - 1) * 256}px)`,
          }}
        >
          <div className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1800px] mx-auto">

            {/* Header with Stats */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {t("Devices Overview")}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  {t("Monitor and manage your industrial devices")}
                </p>
              </div>
              <div className="flex gap-3">
                <div className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">{t("Total")}</span>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{filteredDevices.length}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">{t("Active")}</span>
                  <span className="text-xl font-bold text-emerald-600">{activeCount}</span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <span className="text-xs text-gray-500 dark:text-gray-400 block">{t("InActive")}</span>
                  <span className="text-xl font-bold text-red-500">{filteredDevices.length - activeCount}</span>
                </div>
              </div>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Location dropdown */}
              <div className="relative" ref={locationDropdownRef}>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  {t("Select Location")}
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-between h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                  onClick={() =>
                    setIsLocationDropdownOpen(!isLocationDropdownOpen)
                  }
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-500" />
                    {selectedLocation || t("select_a_location")}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isLocationDropdownOpen ? "rotate-180" : ""}`}
                  />
                </Button>
                {isLocationDropdownOpen && (
                  <Card className="absolute z-20 w-full mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl">
                    {locations.map((location) => (
                      <div
                        key={location.name}
                        className="flex items-center p-2.5 mx-1.5 my-1 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedLocation(location.name);
                          setIsLocationDropdownOpen(false);
                        }}
                      >
                        <img
                          src={location.image}
                          alt={location.name}
                          className="w-8 h-8 object-cover rounded-lg mr-2.5 border border-gray-200 dark:border-gray-600"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {location.name}
                        </span>
                      </div>
                    ))}
                  </Card>
                )}
              </div>

              {/* Company dropdown */}
              <div className="relative" ref={companyDropdownRef}>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  {t("Select Company")}
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-between h-11 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl"
                  onClick={() =>
                    setIsCompanyDropdownOpen(!isCompanyDropdownOpen)
                  }
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-500" />
                    {selectedCompany || t("select_a_company")}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isCompanyDropdownOpen ? "rotate-180" : ""}`}
                  />
                </Button>
                {isCompanyDropdownOpen && (
                  <Card className="absolute z-20 w-full mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-xl">
                    {[t("Grain Technik")].map((company) => (
                      <div
                        key={company}
                        className="flex items-center p-2.5 mx-1.5 my-1 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedCompany(company);
                          setIsCompanyDropdownOpen(false);
                        }}
                      >
                        <img
                          src="/images/1200.jpg"
                          alt={company}
                          className="w-8 h-8 object-cover rounded-lg mr-2.5 border border-gray-200 dark:border-gray-600"
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {company}
                        </span>
                      </div>
                    ))}
                  </Card>
                )}
              </div>
            </div>

            {/* Device Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredDevices.map((device: Device, index) => {
                const key = deviceNameToStatusKey[device.name];
                const deviceStatus = status.machines.find(
                  (m) => m.machineName === key
                );
                const isMachineRunning = deviceStatus?.machineStatus ?? false;
                const isInternetConnected = deviceStatus?.internetStatus ?? false;
                const isCoolingWorking = deviceStatus?.hasNewData ?? false;
                const gtplNum = device.name.match(/GTPL-(\d+)/i)?.[1] || "";

                return (
                  <div
                    key={index}
                    className="group relative"
                  >
                    <div className={`relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                      isMachineRunning
                        ? "border-emerald-200 dark:border-emerald-800/40"
                        : "border-gray-200 dark:border-gray-700"
                    }`}>

                      {/* Device Image */}
                      <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <img
                          src="/images/1200.jpg"
                          alt={device.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        {/* Status badge on image */}
                        <div className="absolute top-3 right-3">
                          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-sm ${
                            isMachineRunning
                              ? "bg-emerald-500/90 text-white"
                              : "bg-red-500/90 text-white"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isMachineRunning ? "bg-white animate-pulse" : "bg-white/60"}`} />
                            {isMachineRunning ? t("Active") : t("InActive")}
                          </div>
                        </div>
                        {/* GTPL number badge on image */}
                        <div className="absolute bottom-3 left-3">
                          <span className="inline-flex items-center justify-center px-3 py-1 rounded-lg bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-indigo-700 dark:text-indigo-300 text-sm font-bold border border-white/20">
                            GTPL-{gtplNum}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        {/* Device Name + Model */}
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-[13px] font-semibold text-gray-900 dark:text-white truncate flex-1" title={device.name}>
                            {device.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-md">{device.plc}</span>
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-purple-500 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-md">{device.chillerModel}</span>
                        </div>

                        {/* Info Row */}
                        <div className="flex items-center gap-3 mb-3 text-xs text-gray-500 dark:text-gray-400">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-indigo-400" />
                            {device.location}
                          </span>
                          <span className="text-gray-300 dark:text-gray-600">|</span>
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-purple-400" />
                            {selectedCompany || t("Grain Technik")}
                          </span>
                        </div>

                        {/* Status Indicators */}
                        <div className="flex gap-2 mb-4">
                          <div className={`flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium ${
                            isMachineRunning ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-gray-50 text-gray-400 dark:bg-gray-900/40 dark:text-gray-500"
                          }`}>
                            <Cpu className="h-3.5 w-3.5" />
                            {t("Machine")}
                          </div>
                          <div className={`flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium ${
                            isInternetConnected ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" : "bg-gray-50 text-gray-400 dark:bg-gray-900/40 dark:text-gray-500"
                          }`}>
                            <Signal className="h-3.5 w-3.5" />
                            {t("Internet")}
                          </div>
                          <div className={`flex-1 flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium ${
                            isCoolingWorking ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-400" : "bg-gray-50 text-gray-400 dark:bg-gray-900/40 dark:text-gray-500"
                          }`}>
                            <Snowflake className="h-3.5 w-3.5" />
                            {t("Cooling")}
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-lg"
                          onClick={() => handleViewMore(device.name)}
                        >
                          <Eye className="h-4 w-4" />
                          {t("view_more")}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}