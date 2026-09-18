// "use client";

// import { useState, useRef, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import {
//   ChevronDown,
//   MapPin,
//   Building2,
//   Wifi,
//   Cpu,
//   Snowflake,
//   Download,

  
//   Eye,
//   Activity,
//   Signal,
// } from "lucide-react";
// import { useMediaQuery } from "../hooks/use-media-query";
// import DashboardLayout from "@/components/layout/dashboard-layout";
// import { useFieldVisibility } from "@/hooks/useFieldVisibility";
// import { useDataStore } from "@/lib/store";
// import { useLanguage } from "@/providers/language-provider";
// import { useMachineStatus } from "@/providers/machine-status-provider";
// import { useAutoData } from "@/hooks/useAutoData";

// // Define interfaces for type safety
// interface Device {
//   name: string;
//   location: string;
//   image: string;
//   plc: string;
//   chillerModel: string;
// }

// interface Location {
//   name: string;
//   image: string;
// }

// interface DeviceStatus {
//   machineStatus?: boolean;
//   internetStatus?: boolean;
//   condFanOn?: boolean;
// }

// export default function DevicesPage() {
//   const [selectedLocation, setSelectedLocation] = useState<string>("");
//   const [selectedCompany, setSelectedCompany] = useState<string>("");
//   const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
//   const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
//   const isMobile = useMediaQuery("(max-width: 768px)");
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const { t } = useLanguage();
//   const router = useRouter();

//   const locationDropdownRef = useRef<HTMLDivElement>(null);
//   const companyDropdownRef = useRef<HTMLDivElement>(null);

//   const { status, isLoading: statusLoading } = useMachineStatus();
//   const { data } = useDataStore();
//   const { showCompanyField } = useFieldVisibility(data);

//   // Parse monitorAccess - if "0" or empty, show all devices; otherwise filter by access
//   const monitorAccessValue = data?.user?.monitorAccess || "";
//   const accessArray = monitorAccessValue === "0" || monitorAccessValue === "" 
//     ? [] 
//     : monitorAccessValue.split(",").map((name: string) => name.trim().toLowerCase());
  
//   // Determine if we should show all devices (when monitorAccess is "0" or empty)
//   const showAllDevices = accessArray.length === 0;

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         locationDropdownRef.current &&
//         !locationDropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsLocationDropdownOpen(false);
//       }
//       if (
//         companyDropdownRef.current &&
//         !companyDropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsCompanyDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const allDevices: Device[] = [
//     {
//       name: "GTPL-030-gT-180E-S7-1200",
//       location: "Germany",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-140E",
//     },
//     {
//       name: "GTPL-061-gT-450T-S7-1200",
//       location: "Turkey",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-450T",
//     },
//     {
//       name: "GTPL-108-gT-40E-P-S7-200",
//       location: "Germany",
//       image: "/images/200.jpg",
//       plc: "S7-200",
//       chillerModel: "gT-40E-P",
//     },
//     {
//       name: "GTPL-109-gT-40E-P-S7-200",
//       location: "Germany",
//       image: "/images/200.jpg",
//       plc: "S7-200",
//       chillerModel: "gT-40E-P",
//     },
//     {
//       name: "GTPL-110-gT-40E-P-S7-200",
//       location: "Germany",
//       image: "/images/200.jpg",
//       plc: "S7-200",
//       chillerModel: "gT-40E-P",
//     },
//     {
//       name: "GTPL-111-gT-80E-P-S7-200",
//       location: "Germany",
//       image: "/images/200.jpg",
//       plc: "S7-200",
//       chillerModel: "gT-80E-P",
//     },
//     {
//       name: "GTPL-112-gT-80E-P-S7-200",
//       location: "Germany",
//       image: "/images/200.jpg",
//       plc: "S7-200",
//       chillerModel: "gT-80E-P",
//     },
//     {
//       name: "GTPL-113-gT-80E-P-S7-200",
//       location: "Germany",
//       image: "/images/200.jpg",
//       plc: "S7-200",
//       chillerModel: "gT-80E-P",
//     },
//     {
//       name: "GTPL-115-gT-180E-S7-1200",
//       location: "Germany",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-180E",
//     },
//     {
//       name: "GTPL-116-gT-240E-S7-1200",
//       location: "Germany",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-240E",
//     },
//     {
//       name: "GTPL-117-gT-320E-S7-1200",
//       location: "Germany",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-320E",
//     },
//     {
//       name: "GTPL-118-gT-60T-S7-200",
//       location: "Telangana",
//       image: "/images/200.jpg",
//       plc: "S7-200",
//       chillerModel: "gT-80E-P",
//     },
//     {
//       name: "GTPL-119-gT-180E-S7-1200",
//       location: "Germany",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-180E",
//     },
//     {
//       name: "GTPL-120-gT-180E-S7-1200",
//       location: "Germany",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-180E",
//     },
//     {
//       name: "GTPL-121-gT-1000T-S7-1200",
//       location: "kanpur",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-1000T",
//     },
//     {
//       name: "GTPL-122-gT-1000T-S7-1200",
//       location: "kanpur",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-1000T",
//     },
//     {
//       name: "GTPL-123-gT-450AP",
//       location: "Raichur, Karnataka",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gt-450AP",
//     },
//     {
//       name: "GTPL-124-gT-450T-S7-1200",
//       location: "Indonesia",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-240E",
//     },
//     {
//       name: "GTPL-131-gT-650T-S7-1200",
//       location: "Ganganagar, Rajasthan",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-240E",
//     },
//     {
//       name: "GTPL-132-300-AP-S7-1200",
//       location: "Salem (Tamil Nadu)",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-240E",
//     },
//     {
//       name: "GTPL-133-gT-650T-S7-1200",
//       location: "Vietnam",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-240E",
//     },
//     {
//       name: "GTPL-134-gT-450T-S7-1200",
//       location: "Kakinada (AP)",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-450T",
//     },
//     {
//       name: "GTPL-135-gT-450T-S7-1200",
//       location: "Bihar",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-450T",
//     },
//     {
//       name: "GTPL-136-gT-450AP",
//       location: "Srilanka",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-450AP",
//     },
//     {
//       name: "GTPL-137-gT-450T-S7-1200",
//       location: "Thailand",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-240E",
//     },
//     {
//       name: "GTPL-138-gT-450T-S7-1200",
//       location: "Thailand",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-240E",
//     },
//     {
//       name: "GTPL-139-gT-300AP-S7-1200",
//       location: "Pondicherry",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "GT-300AP",
//     },
//     {
//       name: "GTPL-142-gT-450AP-S7-1200",
//       location: "A.P.",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-450AP",
//     },
//     {
//       name: "GTPL-143-gT-450AP-S7-1200",
//       location: "A.P.",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-450AP",
//     },
//     {
//       name: "GTPL-144-gT-300AP-S7-1200",
//       location: "Tamil Nadu",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "GT-300AP",
//     },
//     {
//       name: "GTPL-145-gT-450T-S7-1200",
//       location: "Tamil Nadu",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-450T",
//     },
//   ].sort((a, b) => {
//     // Extract numeric part from machine names for proper sorting
//     const numA = parseInt(a.name.match(/\d+/)?.[0] || "0");
//     const numB = parseInt(b.name.match(/\d+/)?.[0] || "0");
//     return numA - numB;
//   });

//   const filteredDevices = allDevices.filter((device) => {
//     // Location filtering - apply location filter only if monitorAccess has specific values
//     const matchesLocation = showAllDevices 
//       ? true // Show all locations when monitorAccess is "0" or empty
//       : selectedLocation === "" ||
//         selectedLocation === "All" ||
//         device.location === selectedLocation;

//     // Device restriction based on monitorAccess
//     // If showAllDevices is true, show all devices (no restriction)
//     // If monitorAccess has specific values, show ONLY those devices
//     const isIncluded = showAllDevices 
//       ? true  // Show all when monitorAccess is "0" or empty
//       : accessArray.includes(device.name.toLowerCase());

//     const shouldHideNoidaLocations =
//       data?.user?.firstName?.toLowerCase() === "carl" &&
//       (device.location === "Noida" || device.location === "Noida---kanpur");

//     const isTantikornUser = data?.user?.firstName?.toLowerCase() === "tantikorn";
//     const showOnlyThailand = isTantikornUser && device.location !== "Thailand";

//     return matchesLocation && isIncluded && !shouldHideNoidaLocations && !showOnlyThailand;
//   });

//   const locations: Location[] = [
//     { name: t("All"), image: "/images/1200.jpg" },
//     ...Array.from(new Set(allDevices.map((d) => d.location)))
//       .filter((loc) => {
//         // If monitorAccess is "0" or empty, show all locations
//         if (showAllDevices) {
//           // Apply only special user restrictions
//           if (data?.user?.firstName?.toLowerCase() === "carl" || data?.user?.firstName?.toLowerCase() === "Weinzierl") {
//             return loc !== "Noida" && loc !== "Noida---kanpur";
//           }
//           if (data?.user?.firstName?.toLowerCase() === "tantikorn") {
//             return loc === "Thailand";
//           }
//           return true;
//         }
        
//         // If monitorAccess has specific values, filter locations based on accessible devices
//         if (data?.user?.firstName?.toLowerCase() === "carl" || data?.user?.firstName?.toLowerCase() === "Weinzierl") {
//           return loc !== "Noida" && loc !== "Noida---kanpur";
//         }
//         if (data?.user?.firstName?.toLowerCase() === "tantikorn") {
//           return loc === "Thailand";
//         }
//         return true;
//       })
//       .map((loc) => ({
//         name: loc,
//         image: loc.includes("kanpur") ? "/images/1200.jpg" : "/images/200.jpg",
//       })),
//   ];

//   const deviceNameToStatusKey: Record<string, string> = {
//     "GTPL-122-gT-1000T-S7-1200": "GTPL_122_S7_1200",
//     "GTPL-118-gT-60T-S7-200": "KABO_200",
//     "GTPL-108-gT-40E-P-S7-200": "GTPL_108",
//     "GTPL-109-gT-40E-P-S7-200": "GTPL_109",
//     "GTPL-110-gT-40E-P-S7-200": "GTPL_110",
//     "GTPL-111-gT-80E-P-S7-200": "GTPL_111",
//     "GTPL-112-gT-80E-P-S7-200": "GTPL_112",
//     "GTPL-113-gT-80E-P-S7-200": "GTPL_113",
//     "GTPL-030-gT-180E-S7-1200": "GTPL_114",
//     "GTPL-115-gT-180E-S7-1200": "GTPL_115",
//     "GTPL-116-gT-240E-S7-1200": "GTPL_116",
//     "GTPL-117-gT-320E-S7-1200": "GTPL_117",
//     "GTPL-119-gT-180E-S7-1200": "GTPL_119",
//     "GTPL-120-gT-180E-S7-1200": "GTPL_120",
//     "GTPL-121-gT-1000T-S7-1200": "GTPL_121",
//     'GTPL-124-gT-450T-S7-1200': "GTPL_124",
//     "GTPL-133-gT-650T-S7-1200": "GTPL_131",
//     "GTPL-131-gT-650T-S7-1200": "GTPL_131",
//     "GTPL-132-300-AP-S7-1200": "GTPL_132",
//     "GTPL-136-gT-450AP": "GTPL_136",
//     "GTPL-137-gT-450T-S7-1200": "GTPL_137",
//     "GTPL-138-gT-450T-S7-1200": "GTPL_138",
//     "GTPL-134-gT-450T-S7-1200": "GTPL_134",
//     "GTPL-135-gT-450T-S7-1200": "GTPL_135",
//     "GTPL-145-gT-450T-S7-1200": "GTPL_145",
//     "GTPL-061-gT-450T-S7-1200": "GTPL_061",
//     "GTPL-139-gT-300AP-S7-1200": "GTPL_139",
//     "GTPL-144-gT-300AP-S7-1200": "GTPL_144_GT_300AP_S7_1200",
//     "GTPL-142-gT-450AP-S7-1200": "GTPL_142",
//     "GTPL-123-gT-450AP": "GTPL_123",
//     "GTPL-143-gT-450AP-S7-1200": "GTPL_143"
//   };

//   const handleViewMore = (deviceName: string) => {
//     const key = deviceNameToStatusKey[deviceName];
//     const deviceStatus = status.machines.find(m => m.machineName === key);

//     const machineStatusValue = deviceStatus?.machineStatus ?? false;

//     const statusString = encodeURIComponent(JSON.stringify({ machineStatus: machineStatusValue }));

//     router.push(`/menu/${deviceName}?status=${statusString}`);
//   };

//   return (
//     <DashboardLayout>
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
//         <div
//           className="relative transform transition-transform origin-top-left"
//           style={{
//             transform: `scale(${zoomLevel}) translateX(${(zoomLevel - 1) * 256}px)`,
//           }}
//         >
//           <div className="flex-1 p-6 max-w-[1800px] mx-auto">
//             {/* Modern Header */}
//             <div className="mb-8">
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
//                 {t("Devices Overview")}
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400 text-lg">
//                 {t("Monitor and manage your industrial devices")}
//               </p>
//             </div>

//             {/* Elegant Dropdowns */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               {/* Location dropdown */}
//               <div className="relative" ref={locationDropdownRef}>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                   <MapPin className="h-4 w-4 text-indigo-600" />
//                   {t("Select Location")}
//                 </label>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-between h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-200"
//                   onClick={() =>
//                     setIsLocationDropdownOpen(!isLocationDropdownOpen)
//                   }
//                 >
//                   <span className="flex items-center gap-2">
//                     <MapPin className="h-4 w-4 text-indigo-600" />
//                     {selectedLocation || t("select_a_location")}
//                   </span>
//                   <ChevronDown
//                     className={`h-4 w-4 transition-transform duration-200 ${isLocationDropdownOpen ? "rotate-180" : ""}`}
//                   />
//                 </Button>
//                 {isLocationDropdownOpen && (
//                   <Card className="absolute z-20 w-full mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg">
//                     {locations.map((location) => (
//                       <div
//                         key={location.name}
//                         className="flex items-center p-3 m-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                         onClick={() => {
//                           setSelectedLocation(location.name);
//                           setIsLocationDropdownOpen(false);
//                         }}
//                       >
//                         <img
//                           src={location.image}
//                           alt={location.name}
//                           className="w-10 h-10 object-cover rounded-lg mr-3 border border-gray-200 dark:border-gray-600"
//                         />
//                         <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                           {location.name}
//                         </span>
//                       </div>
//                     ))}
//                   </Card>
//                 )}
//               </div>

//               {/* Company dropdown */}
//               <div className="relative" ref={companyDropdownRef}>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
//                   <Building2 className="h-4 w-4 text-purple-600" />
//                   {t("Select Company")}
//                 </label>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-between h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-200"
//                   onClick={() =>
//                     setIsCompanyDropdownOpen(!isCompanyDropdownOpen)
//                   }
//                 >
//                   <span className="flex items-center gap-2">
//                     <Building2 className="h-4 w-4 text-purple-600" />
//                     {selectedCompany || t("select_a_company")}
//                   </span>
//                   <ChevronDown
//                     className={`h-4 w-4 transition-transform duration-200 ${isCompanyDropdownOpen ? "rotate-180" : ""}`}
//                   />
//                 </Button>
//                 {isCompanyDropdownOpen && (
//                   <Card className="absolute z-20 w-full mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg">
//                     {[t("Grain Technik")].map((company) => (
//                       <div
//                         key={company}
//                         className="flex items-center p-3 m-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
//                         onClick={() => {
//                           setSelectedCompany(company);
//                           setIsCompanyDropdownOpen(false);
//                         }}
//                       >
//                         <img
//                           src="/images/1200.jpg"
//                           alt={company}
//                           className="w-10 h-10 object-cover rounded-lg mr-3 border border-gray-200 dark:border-gray-600"
//                         />
//                         <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
//                           {company}
//                         </span>
//                       </div>
//                     ))}
//                   </Card>
//                 )}
//               </div>
//             </div>

//             {/* Modern Device Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredDevices.map((device: Device, index) => {
//                 const key = deviceNameToStatusKey[device.name];
//                 const deviceStatus = status.machines.find(
//                   (m) => m.machineName === key
//                 );
//                 const isMachineRunning = deviceStatus?.machineStatus ?? false;
//                 const isInternetConnected = deviceStatus?.internetStatus ?? false;
//                 const isCoolingWorking = deviceStatus?.hasNewData ?? false;

//                 return (
//                   <div
//                     key={index}
//                     className="group relative"
//                   >
//                     <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-transparent">
                      
//                       {/* Gradient overlay on hover */}
//                       <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      
//                       {/* Status Badge */}
//                       <div className="absolute top-4 right-4 z-10">
//                         <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
//                           isMachineRunning 
//                             ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" 
//                             : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
//                         }`}>
//                           <Activity className="h-3 w-3" />
//                           {isMachineRunning ? t("Active") : t("InActive")}
//                         </div>
//                       </div>

//                       {/* Device Image */}
//                       <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
//                         <img
//                           src={device.image}
//                           alt={device.name}
//                           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
//                         />
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
//                       </div>

//                       <div className="p-5">
//                         {/* Device Name */}
//                         <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem]">
//                           {device.name}
//                         </h3>

//                         {/* Location & Company */}
//                         <div className="space-y-2 mb-4">
//                           <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                             <MapPin className="h-4 w-4 text-indigo-500 flex-shrink-0" />
//                             <span className="truncate">{device.location}</span>
//                           </div>
//                           <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
//                             <Building2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
//                             <span className="truncate">{selectedCompany || t("Grain Technik")}</span>
//                           </div>
//                         </div>

//                         {/* Status Grid */}
//                         <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
//                           <div className="flex flex-col items-center gap-1">
//                             <Cpu className={`h-5 w-5 ${isMachineRunning ? "text-emerald-500" : "text-gray-400"}`} />
//                             <span className="text-xs text-gray-600 dark:text-gray-400">{t("Machine")}</span>
//                           </div>
//                           <div className="flex flex-col items-center gap-1">
//                             <Wifi className={`h-5 w-5 ${isInternetConnected ? "text-emerald-500" : "text-gray-400"}`} />
//                             <span className="text-xs text-gray-600 dark:text-gray-400">{t("Internet")}</span>
//                           </div>
//                           <div className="flex flex-col items-center gap-1">
//                             <Snowflake className={`h-5 w-5 ${isCoolingWorking ? "text-emerald-500" : "text-gray-400"}`} />
//                             <span className="text-xs text-gray-600 dark:text-gray-400">{t("Cooling")}</span>
//                           </div>
//                         </div>

//                         {/* Action Buttons */}
//                         <div className="flex gap-2">
//                           <button
//                             className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
//                             onClick={() => handleViewMore(device.name)}
//                           >
//                             <Eye className="h-4 w-4" />
//                             {t("view_more")}
//                           </button>
//                           <button className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm">
//                             <Download className="h-4 w-4" />
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }


"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
  Search,
  LayoutGrid,
  Rows3,
  ArrowUpRight,
  Radio,
} from "lucide-react";
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useFieldVisibility } from "@/hooks/useFieldVisibility";
import { useDataStore } from "@/lib/store";
import { useLanguage } from "@/providers/language-provider";
import { useMachineStatus } from "@/providers/machine-status-provider";
import { useAutoData } from "@/hooks/useAutoData";
import { ALL_DEVICES } from "@/lib/devices";
import { useSession } from "@/providers/session-provider";
import { normalizeMachineId } from "@/lib/session";

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
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "running" | "offline">("all");
  const [density, setDensity] = useState<"grid" | "list">("grid");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [zoomLevel, setZoomLevel] = useState(1);
  const { t } = useLanguage();
  const router = useRouter();


  const { status, isLoading: statusLoading } = useMachineStatus();
  const { data } = useDataStore();
  const { showCompanyField } = useFieldVisibility(data);

  // ─── Which machines this account may open ──────────────────────────────────
  // The server scopes /api/auth/session to the caller's assigned machines, so
  // that list is authoritative and there is no client-side fleet filtering.
  // The monitorAccess grant below is only the fallback for backends that do
  // not serve the session endpoint yet — its values are not reliable machine
  // identifiers (it holds the literal "devices" on most accounts).
  const { session, machines: sessionMachines } = useSession();
  const serverScoped = session?.source === "server";

  const monitorAccessValue = data?.user?.monitorAccess || "";
  const showAllDevices =
    monitorAccessValue === "0" || monitorAccessValue.trim() === "";

  // Lowercase set of allowed names (legacy fallback only)
  const accessSet = showAllDevices
    ? new Set<string>()
    : new Set(
        monitorAccessValue
          .split(",")
          .map((n: string) => n.trim().toLowerCase())
          .filter(Boolean)
      );

  const allDevices: Device[] = [...ALL_DEVICES].sort((a, b) => {
    const numA = parseInt(a.name.match(/\d+/)?.[0] || "0");
    const numB = parseInt(b.name.match(/\d+/)?.[0] || "0");
    return numA - numB;
  });

  // ─── Special-user helpers ──────────────────────────────────────────────────
  const firstName = data?.user?.firstName?.toLowerCase() ?? "";
  const isCarl = firstName === "carl" || firstName === "weinzierl";
  const isTantikorn = firstName === "tantikorn";

  const applySpecialUserFilter = (device: Device) => {
    if (isCarl && (device.location === "Noida" || device.location === "Noida---kanpur"))
      return false;
    if (isTantikorn && device.location !== "Thailand") return false;
    return true;
  };

  const deviceNameToStatusKey: Record<string, string> = {
    "GTPL-122-gT-1000T-S7-1200": "GTPL_122",
    "GTPL-118-gT-60T-S7-200": "GTPL_118",
    "GTPL-149-gT-60T-S7-1200": "GTPL_149",
    "GTPL-108-gT-40E-P-S7-200": "GTPL_108",
    "GTPL-109-gT-40E-P-S7-200": "GTPL_109",
    "GTPL-110-gT-40E-P-S7-200": "GTPL_110",
    "GTPL-111-gT-80E-P-S7-200": "GTPL_111",
    "GTPL-112-gT-80E-P-S7-200": "GTPL_112",
    "GTPL-113-gT-80E-P-S7-200": "GTPL_113",
    "GTPL-030-gT-180E-S7-1200": "GTPL_114",
    "GTPL-044-GT-140E-S7-1200": "GTPL_044",
    "GTPL-115-gT-180E-S7-1200": "GTPL_115",
    "GTPL-116-gT-240E-S7-1200": "GTPL_116",
    "GTPL-117-gT-320E-S7-1200": "GTPL_117",
    "GTPL-119-gT-180E-S7-1200": "GTPL_119",
    "GTPL-120-gT-180E-S7-1200": "GTPL_120",
    "GTPL-121-gT-1000T-S7-1200": "GTPL_121",
    "GTPL-124-gT-450T-S7-1200": "GTPL_124",
    "GTPL-081-gT-650T-S7-1200": "GTPL_081",
    "GTPL-105-gT-650T-S7-1200": "GTPL_105",
    "GTPL-068-gT-650T-S7-1200": "GTPL_068",
    "GTPL-104-gT-650T-S7-1200": "GTPL_104",
    "GTPL-133-gT-650T-S7-1200": "GTPL_133",
    "GTPL-154-gT-650T-S7-1200": "GTPL_154",
    "GTPL-155-gT-650T-S7-1200": "GTPL_155",
    "GTPL-131-gT-650T-S7-1200": "GTPL_131",
    "GTPL-132-300-AP-S7-1200": "GTPL_132",
    "GTPL-136-gT-450AP": "GTPL_136",
    "GTPL-137-gT-450T-S7-1200": "GTPL_137",
    "GTPL-138-gT-450T-S7-1200": "GTPL_138",
    "GTPL-134-gT-450T-S7-1200": "GTPL_134",
    "GTPL-135-gT-450T-S7-1200": "GTPL_135",
    "GTPL-145-gT-450T-S7-1200": "GTPL_145",
    "GTPL-148-gT-450T-S7-1200": "GTPL_148",
    "GTPL-061-gT-450T-S7-1200": "GTPL_061",
    "GTPL-139-gT-300AP-S7-1200": "GTPL_139",
    "GTPL-144-gT-300AP-S7-1200": "GTPL_144",
    "GTPL-142-gT-450AP-S7-1200": "GTPL_142",
    "GTPL-123-gT-450AP": "GTPL_123",
    "GTPL-143-gT-450AP-S7-1200": "GTPL_143",
    "GTPL-156-gT-450T-S7-1200": "GTPL_156",
    "GTPL-157-gT-450T-S7-1200": "GTPL_157",
  };

  // ─── Devices that the user is allowed to see (ignoring location dropdown) ──
  // Used BOTH for the device grid AND to derive which locations appear in the
  // dropdown.
  const accessibleDevices: Device[] = serverScoped
    ? // Server-scoped: the session IS the list. Local metadata (location,
      // image, model) is decoration looked up by machine id; a machine the
      // catalogue does not know about is still shown, not hidden.
      sessionMachines.map((m) => {
        const wanted = normalizeMachineId(m.machineName);
        // Build a reverse map: status key → device name (e.g. "GTPL_114" → "GTPL-030-…")
        const reverseKey = Object.entries(deviceNameToStatusKey).find(
          ([, v]) => normalizeMachineId(v) === wanted
        );
        const known = allDevices.find(
          (d) =>
            normalizeMachineId(d.name) === wanted ||
            normalizeMachineId(d.name) === normalizeMachineId(m.table) ||
            (reverseKey && d.name === reverseKey[0])
        );
        return (
          known ?? {
            name: m.machineName,
            location: t("Unknown"),
            image: "/images/1200.jpg",
            plc: "",
            chillerModel: "",
          }
        );
      })
    : allDevices.filter((device) => {
        if (!showAllDevices && !accessSet.has(device.name.toLowerCase()))
          return false;
        return applySpecialUserFilter(device);
      });

  // ─── Location dropdown list ────────────────────────────────────────────────
  // Derived from accessible devices so only relevant locations appear.
  const locations: Location[] = [
    { name: t("All"), image: "/images/1200.jpg" },
    ...Array.from(new Set(accessibleDevices.map((d) => d.location))).map(
      (loc) => ({
        name: loc,
        image: loc.includes("kanpur") ? "/images/1200.jpg" : "/images/200.jpg",
      })
    ),
  ];

  // ─── Final filtered list shown in the grid ────────────────────────────────
  const filteredDevices = accessibleDevices.filter((device) => {
    if (
      selectedLocation &&
      selectedLocation !== t("All") &&
      device.location !== selectedLocation
    )
      return false;
    return true;
  });

  const handleViewMore = (deviceName: string) => {
    const key = deviceNameToStatusKey[deviceName];
    const deviceStatus = status.machines.find((m) => m.machineName === key);
    const machineStatusValue = deviceStatus?.machineStatus ?? false;
    const statusString = encodeURIComponent(
      JSON.stringify({ machineStatus: machineStatusValue })
    );
    router.push(`/menu/${deviceName}?status=${statusString}`);
  };

  // ─── Live status + client-side filtering ──────────────────────────────────
  type LiveDevice = Device & {
    running: boolean;
    online: boolean;
    cooling: boolean;
  };

  const decorated = useMemo<LiveDevice[]>(
    () =>
      filteredDevices.map((device: Device) => {
        const feed = status.machines.find(
          (m) => m.machineName === deviceNameToStatusKey[device.name]
        );
        return {
          ...device,
          running: feed?.machineStatus ?? false,
          online: feed?.internetStatus ?? false,
          cooling: feed?.coolingStatus ?? false,
        };
      }),
    [filteredDevices, status.machines]
  );

  const visibleDevices = useMemo(() => {
    const term = query.trim().toLowerCase();
    return decorated
      .filter((d) =>
        statusFilter === "all"
          ? true
          : statusFilter === "running"
            ? d.running
            : !d.online
      )
      .filter(
        (d) =>
          !term ||
          d.name.toLowerCase().includes(term) ||
          d.location.toLowerCase().includes(term) ||
          d.chillerModel.toLowerCase().includes(term) ||
          d.plc.toLowerCase().includes(term)
      )
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  }, [decorated, query, statusFilter]);

  const fleet = useMemo(
    () => ({
      total: decorated.length,
      running: decorated.filter((d) => d.running).length,
      offline: decorated.filter((d) => !d.online).length,
    }),
    [decorated]
  );

  const filterChips: { id: "all" | "running" | "offline"; label: string; count: number }[] = [
    { id: "all", label: t("All"), count: fleet.total },
    { id: "running", label: t("Active"), count: fleet.running },
    { id: "offline", label: "No link", count: fleet.offline },
  ];

  return (
    <DashboardLayout>
      <div className="relative">
        {/* Ambient glow — decorative, painted once, no animation */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-72"
          style={{
            background:
              "radial-gradient(48rem 20rem at 20% 0%, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%), radial-gradient(38rem 18rem at 85% 8%, color-mix(in oklch, var(--chart-2) 12%, transparent), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-[1800px] pt-4 pb-10">
          {/* ── Header ─────────────────────────────────────────────────── */}
          <header className="animate-fade-in-up mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                <Radio className="h-3.5 w-3.5" />
                {t("Devices Overview")}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                {t("Monitor and manage your industrial devices")}
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              {[
                { label: "Running", value: fleet.running, tone: "text-success" },
                { label: "No link", value: fleet.offline, tone: "text-warning" },
                { label: "Total", value: fleet.total, tone: "text-foreground" },
              ].map((stat) => (
                <div key={stat.label} className="surface min-w-[5.5rem] px-3.5 py-2.5">
                  <p className="text-muted-foreground text-[11px] font-medium">
                    {stat.label}
                  </p>
                  <p className={`tabular text-xl font-semibold ${stat.tone}`}>
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>
          </header>

          {/* ── Toolbar ────────────────────────────────────────────────── */}
          <div className="surface animate-fade-in-up relative z-40 mb-6 flex flex-wrap items-center gap-3 p-3">
            {/* Search */}
            <div className="relative min-w-[13rem] flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search machines, models, sites…"
                className="border-border bg-background/70 focus-visible:border-ring focus-visible:ring-ring/25 h-10 w-full rounded-lg border pr-3 pl-9 text-sm outline-none transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus-visible:ring-[3px]"
              />
            </div>

            {/* Status chips */}
            <div className="bg-muted/70 flex items-center gap-1 rounded-lg p-1">
              {filterChips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  aria-pressed={statusFilter === chip.id}
                  onClick={() => setStatusFilter(chip.id)}
                  className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-[background-color,color,box-shadow] duration-[var(--motion-fast)] ${
                    statusFilter === chip.id
                      ? "bg-card text-foreground shadow-[var(--shadow-sm)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {chip.label}
                  <span className="tabular opacity-60">{chip.count}</span>
                </button>
              ))}
            </div>

            {/* Location filter — a native select so the options carry real
                option semantics, a selected state and keyboard support. */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="location-filter"
                className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase"
              >
                {t("select_a_location")}
              </label>
              <div className="relative">
                <MapPin className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <select
                  id="location-filter"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="border-input bg-background h-10 min-w-[11rem] rounded-md border pr-8 pl-9 text-sm"
                >
                  <option value="">{t("All")}</option>
                  {locations
                    .filter((location) => location.name !== t("All"))
                    .map((location) => (
                      <option key={location.name} value={location.name}>
                        {t(location.name)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Company filter — native select, same reasoning as above. */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="company-filter"
                className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase"
              >
                {t("select_a_company")}
              </label>
              <div className="relative">
                <Building2 className="text-primary pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <select
                  id="company-filter"
                  value={selectedCompany}
                  onChange={(e) => setSelectedCompany(e.target.value)}
                  className="border-input bg-background h-10 min-w-[11rem] rounded-md border pr-8 pl-9 text-sm"
                >
                  <option value="">{t("All")}</option>
                  <option value={t("Grain Technik")}>{t("Grain Technik")}</option>
                </select>
              </div>
            </div>

            {/* Density toggle */}
            <div className="bg-muted/70 flex items-center gap-1 rounded-lg p-1">
              {[
                { id: "grid" as const, Icon: LayoutGrid },
                { id: "list" as const, Icon: Rows3 },
              ].map(({ id, Icon }) => (
                <button
                  key={id}
                  type="button"
                  aria-label={id === "grid" ? t("Grid view") : t("List view")}
                  aria-pressed={density === id}
                  onClick={() => setDensity(id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-md transition-[background-color,color] duration-[var(--motion-fast)] ${
                    density === id
                      ? "bg-card text-foreground shadow-[var(--shadow-sm)]"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Device grid ────────────────────────────────────────────── */}
          {visibleDevices.length === 0 ? (
            <div className="surface relative z-0 flex flex-col items-center justify-center gap-2 py-20 text-center">
              <Activity className="text-muted-foreground h-8 w-8" />
              <p className="text-sm font-medium">No machines match this view</p>
              <p className="text-muted-foreground text-xs">
                Clear the search or pick another location.
              </p>
            </div>
          ) : (
            <div
              className={
                density === "grid"
                  ? "stagger relative z-0 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                  : "stagger relative z-0 flex flex-col gap-3"
              }
            >
              {visibleDevices.map((device) => {
                const signals = [
                  { icon: Cpu, label: t("Machine"), on: device.running },
                  { icon: Wifi, label: t("Internet"), on: device.online },
                  { icon: Snowflake, label: t("Cooling"), on: device.cooling },
                ];

                if (density === "list") {
                  return (
                    <button
                      key={device.name}
                      type="button"
                      onClick={() => handleViewMore(device.name)}
                      className="group surface surface-interactive flex items-center gap-4 p-3.5 text-left"
                    >
                      <span className="status-dot" data-live={device.running} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold">
                          {device.name}
                        </span>
                        <span className="text-muted-foreground block truncate text-xs">
                          {device.location} · {device.plc} · {device.chillerModel}
                        </span>
                      </span>
                      <span className="hidden items-center gap-3 sm:flex">
                        {signals.map(({ icon: Icon, label, on }) => (
                          <Icon
                            key={label}
                            className={`h-4 w-4 ${on ? "text-success" : "text-muted-foreground/40"}`}
                          />
                        ))}
                      </span>
                      <ArrowUpRight className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                  );
                }

                return (
                  <article
                    key={device.name}
                    className="group surface surface-interactive relative flex flex-col overflow-hidden p-0 [content-visibility:auto] [contain-intrinsic-size:auto_420px]"
                  >
                    {/* Top hairline: brand gradient, brightens on hover */}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 top-0 z-10 h-px opacity-70 transition-opacity duration-[var(--motion-medium)] group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, var(--primary), color-mix(in oklch, var(--chart-2) 80%, transparent), transparent)",
                      }}
                    />

                    {/* Image */}
                    <div className="bg-muted relative h-44 overflow-hidden">
                      <img
                        src={device.image}
                        alt={device.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-[var(--motion-slow)] ease-[var(--ease-out)] group-hover:scale-[1.05]"
                      />
                      <span
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, color-mix(in oklch, var(--card) 92%, transparent), transparent 55%)",
                        }}
                      />

                      {/* Live chip */}
                      <span
                        className={`absolute top-3 right-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${
                          device.running
                            ? "bg-success/15 text-success ring-success/30 ring-1"
                            : "bg-background/70 text-muted-foreground ring-border ring-1"
                        }`}
                      >
                        <span className="status-dot" data-live={device.running} />
                        {device.running ? t("Active") : t("InActive")}
                      </span>

                      {/* PLC tag */}
                      <span className="bg-background/70 text-muted-foreground ring-border absolute bottom-3 left-3 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ring-1 backdrop-blur">
                        {device.plc}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-4">
                      <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold tracking-tight">
                        {device.name}
                      </h3>

                      <div className="text-muted-foreground mt-1.5 flex items-center gap-2 text-xs">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{device.location}</span>
                        <span className="opacity-40">·</span>
                        <span className="truncate">{device.chillerModel}</span>
                      </div>

                      {/* Signals */}
                      <div className="border-border/60 mt-4 grid grid-cols-3 overflow-hidden rounded-lg border">
                        {signals.map(({ icon: Icon, label, on }, i) => (
                          <div
                            key={label}
                            className={`flex flex-col items-center gap-1 py-2.5 ${
                              i < 2 ? "border-border/60 border-r" : ""
                            } ${on ? "bg-success/[0.06]" : ""}`}
                          >
                            <Icon
                              className={`h-4 w-4 ${on ? "text-success" : "text-muted-foreground/40"}`}
                            />
                            <span className="text-muted-foreground text-[10px] font-medium">
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleViewMore(device.name)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-[var(--shadow-sm)] transition-[background-color,box-shadow,transform] duration-[var(--motion-fast)] outline-none hover:shadow-[var(--shadow-md)] focus-visible:ring-2 active:scale-[0.98]"
                        >
                          <Eye className="h-4 w-4" />
                          {t("view_more")}
                        </button>
                        <button
                          aria-label="Download"
                          className="border-border hover:bg-accent hover:text-accent-foreground rounded-lg border p-2 transition-colors duration-[var(--motion-fast)]"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
