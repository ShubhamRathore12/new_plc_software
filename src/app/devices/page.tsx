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
} from "lucide-react";
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useFieldVisibility } from "@/hooks/useFieldVisibility";
import { useDataStore } from "@/lib/store";
import { useLanguage } from "@/providers/language-provider";
import { useMachineStatusFeed } from "@/hooks/useMachineStatusFeed";
import { useAutoData } from "@/hooks/useAutoData";

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

  const allDevices: Device[] = [
    {
      name: "GTPL-122-gT-1000T-S7-1200",
      location: "Noida---kanpur",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-1000T",
    },
    {
      name: "GTPL-118-gT-80E-P-S7-200",
      location: "Noida",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-80E-P",
    },
    {
      name: "GTPL-108-gT-40E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-40E-P",
    },
    {
      name: "GTPL-109-gT-40E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-40E-P",
    },
    {
      name: "GTPL-110-gT-40E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-40E-P",
    },
    {
      name: "GTPL-111-gT-80E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-80E-P",
    },
    {
      name: "GTPL-112-gT-80E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-80E-P",
    },
    {
      name: "GTPL-113-gT-80E-P-S7-200",
      location: "Germany",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-80E-P",
    },
    {
      name: "GTPL-30-gT-180E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-140E",
    },
    {
      name: "GTPL-115-gT-180E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-180E",
    },
    {
      name: "GTPL-116-gT-240E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-240E",
    },
    {
      name: "GTPL-117-gT-320E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-320E",
    },
    {
      name: "GTPL-119-gT-180E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-180E",
    },
    {
      name: "GTPL-120-gT-180E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-180E",
    },
    {
      name: "GTPL-121-gT-1000T-S7-1200",
      location: "Noida---kanpur",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-1000T",
    },
     {
      name: "GTPL-124-GT-450T-S7-1200",
      location: "Indonesia",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-240E",
    },
       {
      name: "GTPL-131-GT-650T-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-240E",
    },
       {
      name: "GTPL-132-300-AP-S7-1200",
      location: "Salem (Tamil Nadu)",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-240E",
    },
    {
      name: "GTPL-137-GT-450T-S7-1200",
      location: "Thailand",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-240E",
    },
    {
      name: "GTPL-138-GT-450T-S7-1200",
      location: "Thailand",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-240E",
    },
  ];

  // const locations: Location[] = [
  //   { name: t("All"), image: "/images/1200.jpg" },
  //   ...Array.from(new Set(allDevices.map((d) => d.location))).map((loc) => ({
  //     name: loc,
  //     image: loc.includes("kanpur") ? "/images/1200.jpg" : "/images/200.jpg",
  //   })),
  // ];

  // const filteredDevices = allDevices.filter(
  //   (device) =>
  //     selectedLocation === "" ||
  //     selectedLocation === "All" ||
  //     device.location === selectedLocation
  // );

  // const filteredDevices = allDevices.filter((device) => {
  //   const matchesLocation =
  //     selectedLocation === "" ||
  //     selectedLocation === "All" ||
  //     device.location === selectedLocation;

  //   const isRestricted = accessArray.includes(device.name.toLowerCase());

  //   return matchesLocation && !isRestricted;
  // });

  // Replace the existing filteredDevices logic with this updated version

const filteredDevices = allDevices.filter((device) => {
  const matchesLocation =
    selectedLocation === "" ||
    selectedLocation === "All" ||
    device.location === selectedLocation;

  const isRestricted = accessArray.includes(device.name.toLowerCase());

  // Hide Noida and Noida---kanpur locations if user's firstName is "carl"
  const shouldHideNoidaLocations = 
    data?.user?.firstName?.toLowerCase() === "carl" &&
    (device.location === "Noida" || device.location === "Noida---kanpur");

  return matchesLocation && !isRestricted && !shouldHideNoidaLocations;
});

// Also update the locations array to exclude Noida locations for carl
const locations: Location[] = [
  { name: t("All"), image: "/images/1200.jpg" },
  ...Array.from(new Set(allDevices.map((d) => d.location)))
    .filter((loc) => {
      // Filter out Noida locations if user is carl
      if (data?.user?.firstName?.toLowerCase() === "carl" || data?.user?.firstName?.toLowerCase() === "Weinzierl") {
        return loc !== "Noida" && loc !== "Noida---kanpur";
      }
      return true;
    })
    .map((loc) => ({
      name: loc,
      image: loc.includes("kanpur") ? "/images/1200.jpg" : "/images/200.jpg",
    })),
];

  const deviceNameToStatusKey: Record<string, string> = {
    "GTPL-122-gT-1000T-S7-1200": "GTPL_122_S7_1200",
    "GTPL-118-gT-80E-P-S7-200": "KABO_200",
    "GTPL-108-gT-40E-P-S7-200": "GTPL_108",
    "GTPL-109-gT-40E-P-S7-200": "GTPL_109",
    "GTPL-110-gT-40E-P-S7-200": "GTPL_110",
    "GTPL-111-gT-80E-P-S7-200": "GTPL_111",
    "GTPL-112-gT-80E-P-S7-200": "GTPL_112",
    "GTPL-113-gT-80E-P-S7-200": "GTPL_113",
    "GTPL-30-gT-180E-S7-1200": "GTPL_114",
    "GTPL-115-gT-180E-S7-1200": "GTPL_115",
    "GTPL-116-gT-240E-S7-1200": "GTPL_116",
    "GTPL-117-gT-320E-S7-1200": "GTPL_117",
    "GTPL-119-gT-180E-S7-1200": "GTPL_119",
    "GTPL-120-gT-180E-S7-1200": "GTPL_120",
    "GTPL-121-gT-1000T-S7-1200": "GTPL_121",
    'GTPL-124-GT-450T-S7-1200':"GTPL_124",
    "GTPL-131-GT-650T-S7-1200":"GTPL_131",
    "GTPL-132-300-AP-S7-1200":"GTPL_132",
    "GTPL-137-GT-450T-S7-1200":"GTPL_137",
    "GTPL-138-GT-450T-S7-1200":"GTPL_138"
  };

  const handleViewMore = (deviceName: string) => {
    const key = deviceNameToStatusKey[deviceName];
    const deviceStatus = status.machines.find(m => m.machineName === key);
  
    const machineStatusValue = deviceStatus?.machineStatus ?? false;
  
    // Correct JSON stringify and encode
    const statusString = encodeURIComponent(JSON.stringify({ machineStatus: machineStatusValue }));
  
    router.push(`/menu/${deviceName}?status=${statusString}`);
  };
  
  
  
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950">
        <div
          className="relative transform transition-transform origin-top-left"
          style={{
            transform: `scale(${zoomLevel}) translateX(${(zoomLevel - 1) * 256}px)`,
          }}
        >
          <div className="flex-1 p-6">
            {/* Header with gradient text */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                {t("Devices Overview")}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t("Monitor and manage your industrial devices")}
              </p>
            </div>

            {/* Modern Dropdown Section - Updated to always show company dropdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Location dropdown */}
              <div className="relative" ref={locationDropdownRef}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  {t("Select Location")}
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-between h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 text-gray-800 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  onClick={() =>
                    setIsLocationDropdownOpen(!isLocationDropdownOpen)
                  }
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    {selectedLocation || t("select_a_location")}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${isLocationDropdownOpen ? "rotate-180" : ""}`}
                  />
                </Button>
                {isLocationDropdownOpen && (
                  <Card className="absolute z-20 w-full mt-2 max-h-60 overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl border-0 ring-1 ring-gray-200 dark:ring-gray-700 animate-in slide-in-from-top-2 duration-200">
                    {locations.map((location, idx) => (
                      <div
                        key={location.name}
                        className="flex items-center p-3 m-2 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 rounded-lg transition-all duration-200 hover:scale-[1.02] border-0 shadow-sm hover:shadow-md"
                        onClick={() => {
                          setSelectedLocation(location.name);
                          setIsLocationDropdownOpen(false);
                        }}
                      >
                        <div className="relative">
                          <img
                            src={location.image}
                            alt={location.name}
                            className="w-10 h-10 object-cover rounded-lg mr-3 ring-2 ring-blue-200 dark:ring-blue-800"
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {location.name}
                        </span>
                      </ div>
                    ))}
                  </Card>
                )}
              </div>

              {/* Company dropdown - Now always shown, with fallback for when hook fails */}
              <div className="relative" ref={companyDropdownRef}>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-purple-500" />
                  {t("Select Company")}
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-between h-12 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 text-gray-800 dark:text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                  onClick={() =>
                    setIsCompanyDropdownOpen(!isCompanyDropdownOpen)
                  }
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-500" />
                    {selectedCompany || t("select_a_company")}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-300 ${isCompanyDropdownOpen ? "rotate-180" : ""}`}
                  />
                </Button>
                {isCompanyDropdownOpen && (
                  <Card className="absolute z-20 w-full mt-2 max-h-60 overflow-y-auto bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-2xl border-0 ring-1 ring-gray-200 dark:ring-gray-700 animate-in slide-in-from-top-2 duration-200">
                    {[t("Grain Technik")].map((company) => (
                      <Card
                        key={company}
                        className="flex items-center p-3 m-2 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 rounded-lg transition-all duration-200 hover:scale-[1.02] border-0 shadow-sm hover:shadow-md"
                        onClick={() => {
                          setSelectedCompany(company);
                          setIsCompanyDropdownOpen(false);
                        }}
                      >
                        <div className="relative">
                          <img
                            src="/images/1200.jpg"
                            alt={company}
                            className="w-10 h-10 object-cover rounded-lg mr-3 ring-2 ring-purple-200 dark:ring-purple-800"
                          />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white dark:ring-gray-800"></div>
                        </div>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                          {company}
                        </span>
                      </Card>
                    ))}
                  </Card>
                )}
              </div>
            </div>

            {/* Enhanced Device Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDevices.map((device: Device, index) => {
                const key = deviceNameToStatusKey[device.name];
                const deviceStatus = status.machines.find(
                  (m) => m.machineName === key
                );
                const isMachineRunning = deviceStatus?.machineStatus ?? false;
                const isInternetConnected =
                  deviceStatus?.internetStatus ?? false;
                const isCoolingWorking = deviceStatus?.hasNewData ?? false;

                return (
                  <Card
                    key={index}
                    className="group relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 cursor-pointer hover:bg-gradient-to-br hover:from-white hover:via-blue-50/50 hover:to-purple-50/50 dark:hover:from-gray-800/90 dark:hover:via-blue-900/20 dark:hover:to-purple-900/20"
                  >
                    {/* Enhanced Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Light overlay for enhanced brightness */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/30 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Status indicator */}
                    <div className="absolute top-4 right-4 z-10">
                      <div
                        className={`w-3 h-3 rounded-full ${isMachineRunning ? "bg-green-500" : "bg-red-500"} shadow-lg ring-2 ring-white dark:ring-gray-900`}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${isMachineRunning ? "bg-green-500" : "bg-red-500"} animate-ping`}
                        ></div>
                      </div>
                    </div>

                    <div className="relative p-6">
                      {/* Device Image */}
                      <div className="relative mb-4 overflow-hidden rounded-xl">
                        <img
                          src={device.image}
                          alt={device.name}
                          className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      {/* Device Info */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {device.name}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Building2 className="h-4 w-4 text-purple-500" />
                          <span className="font-medium">
                            {selectedCompany || t("Grain Technik")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-4 w-4 text-blue-500" />
                          <span>{device.location}</span>
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-1 gap-2 pt-2">
                          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/50 group-hover:bg-white/90 group-hover:shadow-md dark:group-hover:bg-gray-700/60 transition-all duration-300">
                            <div className="flex items-center gap-2">
                              <Cpu className="h-4 w-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                                {t("Machine")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  isMachineRunning
                                    ? "bg-green-500 group-hover:bg-green-600"
                                    : "bg-red-500 group-hover:bg-red-600"
                                } shadow-sm transition-colors duration-300`}
                              />
                              <span
                                className={`text-xs font-semibold ${isMachineRunning ? "text-green-600 dark:text-green-400 group-hover:text-green-700" : "text-red-600 dark:text-red-400 group-hover:text-red-700"} transition-colors duration-300`}
                              >
                                {isMachineRunning ? t("Active") : t("InActive")}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/50 group-hover:bg-white/90 group-hover:shadow-md dark:group-hover:bg-gray-700/60 transition-all duration-300">
                            <div className="flex items-center gap-2">
                              <Wifi className="h-4 w-4 text-green-500 group-hover:text-green-600 transition-colors duration-300" />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                                {t("Internet")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  isInternetConnected
                                    ? "bg-green-500 group-hover:bg-green-600"
                                    : "bg-red-500 group-hover:bg-red-600"
                                } shadow-sm transition-colors duration-300`}
                              />
                              <span
                                className={`text-xs font-semibold ${isInternetConnected ? "text-green-600 dark:text-green-400 group-hover:text-green-700" : "text-red-600 dark:text-red-400 group-hover:text-red-700"} transition-colors duration-300`}
                              >
                                {isInternetConnected
                                  ? t("Connected")
                                  : t("Offline")}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/50 group-hover:bg-white/90 group-hover:shadow-md dark:group-hover:bg-gray-700/60 transition-all duration-300">
                            <div className="flex items-center gap-2">
                              <Snowflake className="h-4 w-4 text-cyan-500 group-hover:text-cyan-600 transition-colors duration-300" />
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors duration-300">
                                {t("Cooling")}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  isCoolingWorking
                                    ? "bg-green-500 group-hover:bg-green-600"
                                    : "bg-red-500 group-hover:bg-red-600"
                                } shadow-sm transition-colors duration-300`}
                              />
                              <span
                                className={`text-xs font-semibold ${isCoolingWorking ? "text-green-600 dark:text-green-400 group-hover:text-green-700" : "text-red-600 dark:text-red-400 group-hover:text-red-700"} transition-colors duration-300`}
                              >
                                {isCoolingWorking ? t("Active") : t("Inactive")}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group/btn"
                            onClick={() => handleViewMore(device.name)}
                          >
                            <Eye className="h-4 w-4 mr-1 group-hover/btn:rotate-12 transition-transform duration-300" />
                            {t("view_more")}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-gradient-to-r from-green-500 to-teal-600 text-white border-0 hover:from-green-600 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group/btn"
                          >
                            <Download className="h-4 w-4 group-hover/btn:translate-y-0.5 transition-transform duration-300" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Animated border */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
