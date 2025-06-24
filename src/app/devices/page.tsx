"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useFieldVisibility } from "@/hooks/useFieldVisibility";
import { useDataStore } from "@/lib/store";
import { useLanguage } from "@/providers/language-provider";
import { useMachineStatusFeed } from "@/hooks/useMachineStatusFeed";

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

  const { status } = useMachineStatusFeed("ws");

  const allDevices = [
    // ⬆️ First: GTPL-118
    { name: "GTPL-122-gT-1000T-S7-1200", location: "Noida---kanpur", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-1000T" },
    { name: "GTPL-118-gT-80E-P-S7-200", location: "Noida", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
  
    // ⬆️ Second: GTPL-122
   
  
    // Remaining in original order (excluding 118 & 122)
    { name: "GTPL-108-gT-40E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-40E-P" },
    { name: "GTPL-109-gT-40E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-40E-P" },
    { name: "GTPL-110-gT-40E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-40E-P" },
    { name: "GTPL-111-gT-80E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
    { name: "GTPL-112-gT-80E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
    { name: "GTPL-113-gT-80E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
    { name: "GTPL-114-gT-140E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-140E" },
    { name: "GTPL-115-gT-180E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-180E" },
    { name: "GTPL-116-gT-240E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-240E" },
    { name: "GTPL-117-gT-320E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-320E" },
    { name: "GTPL-119-gT-180E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-180E" },
    { name: "GTPL-120-gT-180E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-180E" },
    { name: "GTPL-121-gT-1000T-S7-1200", location: "Noida---kanpur", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-1000T" },
  ];
  
  

  const locations = [
    { name: "All", image: "/images/1200.jpg" }, // default "All" option
    ...Array.from(new Set(allDevices.map((d) => d.location))).map((loc) => ({
      name: loc,
      image: loc.includes("kanpur") ? "/images/1200.jpg" : "/images/200.jpg",
    })),
  ];

  const filteredDevices = allDevices.filter(
    (device) => selectedLocation === "" || selectedLocation === "All" || device.location === selectedLocation
  );
  

  const deviceNameToStatusKey: Record<string, string> = {
    "GTPL-122-S7-1200": "gtpl",
    "GTPL-111-S7-200": "kabo",
  };

  const handleViewMore = (deviceName: string) => {
    router.push(`/menu/${deviceName}`);
  };

  const { data } = useDataStore();
  const { showCompanyField } = useFieldVisibility(data);

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div
          className="relative transform transition-transform origin-top-left"
          style={{
            transform: `scale(${zoomLevel}) translateX(${(zoomLevel - 1) * 256}px)`,
          }}
        >
          <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
              {t("Devices Overview")}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Location dropdown */}
              <div className="relative" ref={locationDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("Select Location")}
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  onClick={() =>
                    setIsLocationDropdownOpen(!isLocationDropdownOpen)
                  }
                >
                  {selectedLocation || t("select_a_location")}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                {isLocationDropdownOpen && (
                  <Card className="absolute z-10 w-full mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg">
                    {locations.map((location) => (
                      <Card
                        key={location.name}
                        className="flex items-center p-2 m-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setSelectedLocation(location.name);
                          setIsLocationDropdownOpen(false);
                        }}
                      >
                        <img
                          src={location.image}
                          alt={location.name}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <span className="text-sm text-gray-800 dark:text-gray-100">
                          {location.name}
                        </span>
                      </Card>
                    ))}
                  </Card>
                )}
              </div>

              {/* Company dropdown */}
              <div className="relative" ref={companyDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("Select Company")}
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  onClick={() =>
                    setIsCompanyDropdownOpen(!isCompanyDropdownOpen)
                  }
                >
                  {selectedCompany || t("select_a_company")}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                {isCompanyDropdownOpen && (
                  <Card className="absolute z-10 w-full mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg">
                    {["Grain Technik"].map((company) => (
                      <Card
                        key={company}
                        className="flex items-center p-2 m-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => {
                          setSelectedCompany(company);
                          setIsCompanyDropdownOpen(false);
                        }}
                      >
                        <img
                          src="/images/1200.jpg"
                          alt={company}
                          className="w-10 h-10 object-cover rounded mr-3"
                        />
                        <span className="text-sm text-gray-800 dark:text-gray-100">
                          {company}
                        </span>
                      </Card>
                    ))}
                  </Card>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {filteredDevices.map((device, index) => {
                const key = deviceNameToStatusKey[device.name];
                const deviceStatus = status?.[key] || {};
                const isMachineRunning = deviceStatus.machineStatus ?? false;
                const isInternetConnected = deviceStatus.internetStatus ?? false;
                const isCoolingWorking = deviceStatus.coolingStatus ?? false;

                return (
                  <Card
                    key={index}
                    className="device-card p-6 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-800"
                  >
                    <img
                      src={device.image}
                      alt={device.name}
                      className="w-full h-32 object-cover rounded mb-4"
                    />
                    <h3 className="text-md font-bold text-black dark:text-white">
                      {device.name}
                    </h3>
                
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Company: Grain Technik
                    </p>

                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Machine Status
                        </p>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isMachineRunning ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Internet Status
                        </p>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isInternetConnected ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Cooling Status
                        </p>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isCoolingWorking ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMore(device.name)}
                      >
                        {t("view_more")}
                      </Button>
                      <Button variant="outline" size="sm">
                        {t("download_files")}
                      </Button>
                    </div>
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
