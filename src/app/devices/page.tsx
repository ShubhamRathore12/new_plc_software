// "use client";

// import { useState, useRef, useEffect } from "react";
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
// import { useMachineStatusFeed } from "@/hooks/useMachineStatusFeed";
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

//   const { status } = useMachineStatusFeed();
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
//       name: "GTPL-30-gT-180E-S7-1200",
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
//       name: "GTPL-123-GT-450AP",
//       location: "Raichur, Karnataka",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gt-450AP",
//     },
//     {
//       name: "GTPL-124-GT-450T-S7-1200",
//       location: "Indonesia",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-240E",
//     },
//     {
//       name: "GTPL-131-GT-650T-S7-1200",
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
//       name: "GTPL-133-GT-650T-S7-1200",
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
//       name: "GTPL-137-GT-450T-S7-1200",
//       location: "Thailand",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-240E",
//     },
//     {
//       name: "GTPL-138-GT-450T-S7-1200",
//       location: "Thailand",
//       image: "/images/1200.jpg",
//       plc: "S7-1200",
//       chillerModel: "gT-240E",
//     },
//     {
//       name: "GTPL-139-GT-300AP-S7-1200",
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
//       name: "GTPL-144-GT-300AP-S7-1200",
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
//     "GTPL-30-gT-180E-S7-1200": "GTPL_114",
//     "GTPL-115-gT-180E-S7-1200": "GTPL_115",
//     "GTPL-116-gT-240E-S7-1200": "GTPL_116",
//     "GTPL-117-gT-320E-S7-1200": "GTPL_117",
//     "GTPL-119-gT-180E-S7-1200": "GTPL_119",
//     "GTPL-120-gT-180E-S7-1200": "GTPL_120",
//     "GTPL-121-gT-1000T-S7-1200": "GTPL_121",
//     'GTPL-124-GT-450T-S7-1200': "GTPL_124",
//     "GTPL-133-GT-650T-S7-1200": "GTPL_131",
//     "GTPL-131-GT-650T-S7-1200": "GTPL_131",
//     "GTPL-132-300-AP-S7-1200": "GTPL_132",
//     "GTPL-136-gT-450AP": "GTPL_136",
//     "GTPL-137-GT-450T-S7-1200": "GTPL_137",
//     "GTPL-138-GT-450T-S7-1200": "GTPL_138",
//     "GTPL-134-gT-450T-S7-1200": "GTPL_134",
//     "GTPL-135-gT-450T-S7-1200": "GTPL_135",
//     "GTPL-145-gT-450T-S7-1200": "GTPL_145",
//     "GTPL-061-gT-450T-S7-1200": "GTPL_061",
//     "GTPL-139-GT-300AP-S7-1200": "GTPL_139",
//     "GTPL-144-GT-300AP-S7-1200": "GTPL_144_GT_300AP_S7_1200",
//     "GTPL-142-gT-450AP-S7-1200": "GTPL_142",
//     "GTPL-123-GT-450AP": "GTPL_123",
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

  // ─── monitorAccess logic ───────────────────────────────────────────────────
  // "0" or empty  → show ALL devices
  // any other value → comma-separated list of allowed machine names
  const monitorAccessValue = data?.user?.monitorAccess || "";
  const showAllDevices =
    monitorAccessValue === "0" || monitorAccessValue.trim() === "";

  // Lowercase set of allowed names (only used when showAllDevices === false)
  const accessSet = showAllDevices
    ? new Set<string>()
    : new Set(
        monitorAccessValue
          .split(",")
          .map((n: string) => n.trim().toLowerCase())
          .filter(Boolean)
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allDevices: Device[] = [
    {
      name: "GTPL-30-gT-180E-S7-1200",
      location: "Germany",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-140E",
    },
    {
      name: "GTPL-061-gT-450T-S7-1200",
      location: "Turkey",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
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
      name: "GTPL-118-gT-60T-S7-200",
      location: "Telangana",
      image: "/images/200.jpg",
      plc: "S7-200",
      chillerModel: "gT-80E-P",
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
      location: "kanpur",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-1000T",
    },
    {
      name: "GTPL-122-gT-1000T-S7-1200",
      location: "kanpur",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-1000T",
    },
    {
      name: "GTPL-123-GT-450AP",
      location: "Raichur, Karnataka",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gt-450AP",
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
      location: "Ganganagar, Rajasthan",
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
      name: "GTPL-133-GT-650T-S7-1200",
      location: "Vietnam",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-240E",
    },
    {
      name: "GTPL-134-gT-450T-S7-1200",
      location: "Kakinada (AP)",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
    {
      name: "GTPL-135-gT-450T-S7-1200",
      location: "Bihar",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
    {
      name: "GTPL-136-gT-450AP",
      location: "Srilanka",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-450AP",
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
    {
      name: "GTPL-139-GT-300AP-S7-1200",
      location: "Pondicherry",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "GT-300AP",
    },
    {
      name: "GTPL-142-gT-450AP-S7-1200",
      location: "A.P.",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-450AP",
    },
    {
      name: "GTPL-143-gT-450AP-S7-1200",
      location: "A.P.",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-450AP",
    },
    {
      name: "GTPL-144-GT-300AP-S7-1200",
      location: "Tamil Nadu",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "GT-300AP",
    },
    {
      name: "GTPL-145-gT-450T-S7-1200",
      location: "Tamil Nadu",
      image: "/images/1200.jpg",
      plc: "S7-1200",
      chillerModel: "gT-450T",
    },
  ].sort((a, b) => {
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

  // ─── Devices that the user is allowed to see (ignoring location dropdown) ──
  // Used BOTH for the device grid AND to derive which locations appear in the
  // dropdown.
  const accessibleDevices = allDevices.filter((device) => {
    if (!showAllDevices && !accessSet.has(device.name.toLowerCase())) return false;
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

  const deviceNameToStatusKey: Record<string, string> = {
    "GTPL-122-gT-1000T-S7-1200": "GTPL_122_S7_1200",
    "GTPL-118-gT-60T-S7-200": "KABO_200",
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
    "GTPL-124-GT-450T-S7-1200": "GTPL_124",
    "GTPL-133-GT-650T-S7-1200": "GTPL_131",
    "GTPL-131-GT-650T-S7-1200": "GTPL_131",
    "GTPL-132-300-AP-S7-1200": "GTPL_132",
    "GTPL-136-gT-450AP": "GTPL_136",
    "GTPL-137-GT-450T-S7-1200": "GTPL_137",
    "GTPL-138-GT-450T-S7-1200": "GTPL_138",
    "GTPL-134-gT-450T-S7-1200": "GTPL_134",
    "GTPL-135-gT-450T-S7-1200": "GTPL_135",
    "GTPL-145-gT-450T-S7-1200": "GTPL_145",
    "GTPL-061-gT-450T-S7-1200": "GTPL_061",
    "GTPL-139-GT-300AP-S7-1200": "GTPL_139",
    "GTPL-144-GT-300AP-S7-1200": "GTPL_144_GT_300AP_S7_1200",
    "GTPL-142-gT-450AP-S7-1200": "GTPL_142",
    "GTPL-123-GT-450AP": "GTPL_123",
    "GTPL-143-gT-450AP-S7-1200": "GTPL_143",
  };

  const handleViewMore = (deviceName: string) => {
    const key = deviceNameToStatusKey[deviceName];
    const deviceStatus = status.machines.find((m) => m.machineName === key);
    const machineStatusValue = deviceStatus?.machineStatus ?? false;
    const statusString = encodeURIComponent(
      JSON.stringify({ machineStatus: machineStatusValue })
    );
    router.push(`/menu/${deviceName}?status=${statusString}`);
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div
          className="relative transform transition-transform origin-top-left"
          style={{
            transform: `scale(${zoomLevel}) translateX(${(zoomLevel - 1) * 256}px)`,
          }}
        >
          <div className="flex-1 p-6 max-w-[1800px] mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                {t("Devices Overview")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {t("Monitor and manage your industrial devices")}
              </p>
            </div>

            {/* Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Location dropdown */}
              <div className="relative" ref={locationDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  {t("Select Location")}
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-between h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() =>
                    setIsLocationDropdownOpen(!isLocationDropdownOpen)
                  }
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    {selectedLocation || t("select_a_location")}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isLocationDropdownOpen ? "rotate-180" : ""}`}
                  />
                </Button>
                {isLocationDropdownOpen && (
                  <Card className="absolute z-20 w-full mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg">
                    {locations.map((location) => (
                      <div
                        key={location.name}
                        className="flex items-center p-3 m-2 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedLocation(location.name);
                          setIsLocationDropdownOpen(false);
                        }}
                      >
                        <img
                          src={location.image}
                          alt={location.name}
                          className="w-10 h-10 object-cover rounded-lg mr-3 border border-gray-200 dark:border-gray-600"
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-purple-600" />
                  {t("Select Company")}
                </label>
                <Button
                  variant="outline"
                  className="w-full justify-between h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 text-gray-900 dark:text-white shadow-sm hover:shadow-md transition-all duration-200"
                  onClick={() =>
                    setIsCompanyDropdownOpen(!isCompanyDropdownOpen)
                  }
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-purple-600" />
                    {selectedCompany || t("select_a_company")}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${isCompanyDropdownOpen ? "rotate-180" : ""}`}
                  />
                </Button>
                {isCompanyDropdownOpen && (
                  <Card className="absolute z-20 w-full mt-2 max-h-60 overflow-y-auto bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg">
                    {[t("Grain Technik")].map((company) => (
                      <div
                        key={company}
                        className="flex items-center p-3 m-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        onClick={() => {
                          setSelectedCompany(company);
                          setIsCompanyDropdownOpen(false);
                        }}
                      >
                        <img
                          src="/images/1200.jpg"
                          alt={company}
                          className="w-10 h-10 object-cover rounded-lg mr-3 border border-gray-200 dark:border-gray-600"
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

            {/* Device Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDevices.map((device: Device, index) => {
                const key = deviceNameToStatusKey[device.name];
                const deviceStatus = status.machines.find(
                  (m) => m.machineName === key
                );
                const isMachineRunning = deviceStatus?.machineStatus ?? false;
                const isInternetConnected =
                  deviceStatus?.internetStatus ?? false;
                const isCoolingWorking = deviceStatus?.coolingStatus ?? false;

                return (
                  <div key={index} className="group relative">
                    <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:border-transparent">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4 z-10">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                            isMachineRunning
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          <Activity className="h-3 w-3" />
                          {isMachineRunning ? t("Active") : t("InActive")}
                        </div>
                      </div>

                      {/* Device Image */}
                      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
                        <img
                          src={device.image}
                          alt={device.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"></div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 min-h-[3.5rem]">
                          {device.name}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                            <span className="truncate">{device.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Building2 className="h-4 w-4 text-purple-500 flex-shrink-0" />
                            <span className="truncate">
                              {selectedCompany || t("Grain Technik")}
                            </span>
                          </div>
                        </div>

                        {/* Status Grid */}
                        <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <div className="flex flex-col items-center gap-1">
                            <Cpu
                              className={`h-5 w-5 ${isMachineRunning ? "text-emerald-500" : "text-gray-400"}`}
                            />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {t("Machine")}
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <Wifi
                              className={`h-5 w-5 ${isInternetConnected ? "text-emerald-500" : "text-gray-400"}`}
                            />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {t("Internet")}
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <Snowflake
                              className={`h-5 w-5 ${isCoolingWorking ? "text-emerald-500" : "text-gray-400"}`}
                            />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {t("Cooling")}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                            onClick={() => handleViewMore(device.name)}
                          >
                            <Eye className="h-4 w-4" />
                            {t("view_more")}
                          </button>
                          <button className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors shadow-sm">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
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