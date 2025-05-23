// app/devices/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, Plus, Minus, Sun, Moon } from "lucide-react";
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import Im from "../../../public/images/1200.jpg";
import Im1 from "../../../public/images/200.jpg";
import { useFieldVisibility } from "@/hooks/useFieldVisibility";
import { useDataStore } from "@/lib/store";
import { useLanguage } from "@/providers/language-provider";

export default function DevicesPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [zoomLevel, setZoomLevel] = useState(1);
  const { t } = useLanguage();

  const router = useRouter();

  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  const locations = [
    {
      name: "Location 1",
      image: "/images/1200.jpg",
    },
    {
      name: "Location 2",
      image: "/images/200.jpg",
    },
  ];

  const companies = [
    {
      name: "Company A",
      image: "/images/1200.jpg",
    },
    {
      name: "Company B",
      image: "/images/200.jpg",
    },
  ];

  const devices = [
    {
      name: "S7-1200",
      status: "device_status",
      image: "/images/1200.jpg",
    },
    {
      name: "S7-200",
      status: "device_status",
      image: "/images/200.jpg",
    },
    {
      name: "Test",
      status: "device_status",
      image: "/images/1200.jpg",
    },
    
    
  ];

  const handleViewMore = (deviceName: string) => {
    router.push(`/menu/${deviceName}`);
  };
  const { data } = useDataStore();
  const { showCompanyField } = useFieldVisibility(data);
  // console.log(data?.user?.company, "ji");
  const isMachineRunning = false; // your condition
  const isInternetConnected = false; // your condition
  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <div
          className="relative transform transition-transform origin-top-left"
          style={{
            transform: `scale(${zoomLevel}) translateX(${
              (zoomLevel - 1) * 256
            }px)`,
          }}
        >
          <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
              {t("Devices Overview")}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
                    {locations
                      .filter((company) => {
                        return company.name !== data?.user?.location;
                      })
                      .map((location) => (
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
                    {companies
                      .filter((company) => {
                        return company.name !== data?.user?.company;
                      })
                      .map((company) => (
                        <Card
                          key={company.name}
                          className="flex items-center p-2 m-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => {
                            setSelectedCompany(company.name);
                            setIsCompanyDropdownOpen(false);
                          }}
                        >
                          <img
                            src={company.image}
                            alt={company.name}
                            className="w-10 h-10 object-cover rounded mr-3"
                          />
                          <span className="text-sm text-gray-800 dark:text-gray-100">
                            {company.name}
                          </span>
                        </Card>
                      ))}
                  </Card>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {devices.map((device, index) => (
                <Card
                  key={index}
                  className="device-card p-6 hover:shadow-lg transition-all cursor-pointer bg-white dark:bg-gray-800"
                >
                  <img
                    src={device.image}
                    alt={device.name}
                    className="w-full h-32 object-cover rounded mb-4"
                  />
                  <h3 className="text-xl font-bold text-black dark:text-white">
                    {device.name}
                  </h3>
                  <div className="flex flex-col gap-2">
                    {/* Machine Status */}
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Machine Status
                      </p>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isMachineRunning ? "bg-green-500" : "bg-red-500"
                        }`}
                        aria-label={isMachineRunning ? "Running" : "Stopped"}
                        role="status"
                      />
                    </div>

                    {/* Internet Status */}
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Internet Status
                      </p>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isInternetConnected ? "bg-green-500" : "bg-red-500"
                        }`}
                        aria-label={
                          isInternetConnected ? "Connected" : "Disconnected"
                        }
                        role="status"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cooling Status
                      </p>
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          isInternetConnected ? "bg-green-500" : "bg-red-500"
                        }`}
                        aria-label={
                          isInternetConnected ? "Connected" : "Disconnected"
                        }
                        role="status"
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
