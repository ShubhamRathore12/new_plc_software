// app/devices/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronDown, Plus, Minus, Sun, Moon } from "lucide-react";
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function DevicesPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCompany, setSelectedCompany] = useState<string>("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [zoomLevel, setZoomLevel] = useState(1);

  const router = useRouter();

  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const companyDropdownRef = useRef<HTMLDivElement>(null);

  const locations = [
    {
      name: "Location 1",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
    {
      name: "Location 2",
      image: "https://images.unsplash.com/photo-1506260408121-e353d10b87c7",
    },
    {
      name: "Location 3",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    },
  ];

  const companies = [
    {
      name: "Company A",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    },
    {
      name: "Company B",
      image: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9",
    },
    {
      name: "Company C",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
  ];

  const devices = [
    {
      name: "gT-40E",
      status: "Device status",
      image: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    },
    {
      name: "gT-80E",
      status: "Device status",
      image: "https://images.unsplash.com/photo-1519125323398-675f1f8d0d07",
    },
    {
      name: "gT-180E",
      status: "Device status",
      image: "https://images.unsplash.com/photo-1522202176988-66273c697b20",
    },
    {
      name: "gT-200E",
      status: "Device status",
      image: "https://images.unsplash.com/photo-1531266752426-a1d7a0e2f16a",
    },
    {
      name: "gT-300E",
      status: "Device status",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
    {
      name: "gT-400E",
      status: "Device status",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    },
    {
      name: "gT-500E",
      status: "Device status",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d",
    },
    {
      name: "gT-600E",
      status: "Device status",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    },
    {
      name: "gT-700E",
      status: "Device status",
      image: "https://images.unsplash.com/photo-1593642634315-48f5414c3ad9",
    },
    {
      name: "gT-800E",
      status: "Device status",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    },
  ];

  // useEffect(() => {
  //   router.push("/aeration");
  // }, [router]);

  // Function to handle navigation to the Aeration page
  const handleViewMore = (deviceName: string) => {
    router.push("/aeration");
  };

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
              Devices Overview
            </h1>

            <div className="flex space-x-4 mb-6">
              <div className="flex-1 relative" ref={locationDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Location
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  onClick={() =>
                    setIsLocationDropdownOpen(!isLocationDropdownOpen)
                  }
                >
                  {selectedLocation || "Select a location"}
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

              <div className="flex-1 relative" ref={companyDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Company
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-between bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  onClick={() =>
                    setIsCompanyDropdownOpen(!isCompanyDropdownOpen)
                  }
                >
                  {selectedCompany || "Select a company"}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
                {isCompanyDropdownOpen && (
                  <Card className="absolute z-10 w-full mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-lg">
                    {companies.map((company) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {device.status}
                  </p>
                  <div className="mt-4 flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewMore(device.name)}
                    >
                      View More
                    </Button>
                    <Button variant="outline" size="sm">
                      Download Files
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
