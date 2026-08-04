// import Image from "next/image";
// import Fan1200 from "../../public/images/fan.jpg";
// import Fan from "../../public/images/fan.png";
// import Fan1 from "../../public/images/124.png";
// import { usePathname } from "next/navigation";

// import { useEffect, useState } from "react";

// export default function AutoDiagram1({
//   blower,
//   data,
//   formatValue,
//   machineName,
// }: any) {
//   const pathname = usePathname();
//   const isGrainChilling = pathname.includes("auto-grain");
//   const isPaddyChilling = pathname.includes("auto-paddy");
//   const getSiloColor = (temp: number) => {
//     return "#10b981"; // Green color
//   };

//   const status = {
//     TS1: 35,
//   };

//   const [compressorTime, setCompressorTime] = useState<number | null>(null);

//   useEffect(() => {
//     const rawValue = data?.COMPRESSOR_TIME || data?.Compressor_timer;
//     const parsed = parseFloat(rawValue);

//     if (!isNaN(parsed)) {
//       setCompressorTime(parsed);
//     }
//   }, [data?.COMPRESSOR_TIME, data?.Compressor_timer]);

//   useEffect(() => {
//     if (compressorTime === null) return;

//     const interval = setInterval(() => {
//       setCompressorTime((prev) => {
//         if (prev === null || prev <= 0) {
//           clearInterval(interval);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000); // decrement every second

//     return () => clearInterval(interval);
//   }, [compressorTime]);

//   // Helper function to check if a value represents "true"
//   const isTrueValue = (value: any) => {
//     if (!value) return false;
//     const normalizedValue = String(value).toLowerCase();
//     return (
//       normalizedValue === "true" ||
//       normalizedValue === "tr" ||
//       normalizedValue === "True"
//     );
//   };

//   // Green light conditions
//   const greenLightFields = [
//     "GREEN_LIGHT",
//     "Chiller_healthy_(Q1.1)",
//     "Chiller_healthy_on_Q1_1",
//     "Chiller_healthy_on",
//     "Chiller_healthy",
//   ];
// console.log('Chiller_fault_Q2_3 value:', data?.Chiller_Fault_Q2_3
// );
//   // Red light conditions
//  const redLightFields = [
//   "RED_LIGHT",
//   "Chiller_fault_Q2_3",   // lowercase version
//   "Chiller_Fault_Q2_3",   // uppercase version
//   "Chiller_fault_(Q2.3)",
//   "Chiller_Fault_on_Q2_0",
//   "Chiller_Fault_on",
//   "Chiller_Fault",
//   "chiller_fault",        // Add this if your data has this field too
// ];

//   // Yellow light conditions
//   const yellowLightFields = [
//     "YELLOW_LIGHT",
//     "System_warnning_(Q1.0)",
//     "Collective_Trouble_Signal_on_Q2_1",
//     "Collective_Trouble_Signal_on",
//     "Collective_Trouble_Signal",
//     "Collective_trouble_signal_Q1_0",

//   ];

//   // Check conditions
//   const greenOn = greenLightFields.some((field) => isTrueValue(data?.[field]));
//   const redOn = redLightFields.some((field) => isTrueValue(data?.[field]));
//   const yellowOn = yellowLightFields.some((field) =>
//     isTrueValue(data?.[field])
//   );

//   // Alternative: One-liner version if you prefer
//   const checkTrueValue = (val: any) =>
//     val && ["true", "tr", "True"].includes(String(val).toLowerCase());

//   const greenOnAlt = greenLightFields.some((field) =>
//     checkTrueValue(data?.[field])
//   );
//   const redOnAlt = redLightFields.some((field) =>
//     checkTrueValue(data?.[field])
//   );
//   const yellowOnAlt = yellowLightFields.some((field) =>
//     checkTrueValue(data?.[field])
//   );

//   // Helper for lamp color
//   const lampColor = (on: boolean, color: string) => (on ? color : "#d1d5db");

//   const isCompressorOn =
//     data?.COMPRESSOR_ON === "tr" ||
//     data?.Compressor_on_Q0_4 === "True" ||
//     data?.Compressor_start === "True" ||
//     data?.COMPRESSOR_ON === "True";

//   return (
//     <div className="w-full h-screen bg-gray-100 overflow-auto">
//       {/* Fixed container that maintains layout */}
//       <div
//         className="relative bg-gray-100"
//         style={{
//           minWidth: "1200px",
//           minHeight: "800px",
//           width: "max(100vw, 1200px)",
//           height: "max(100vh, 800px)",
//         }}
//       >
//         {/* Status Indicators - Fixed to container */}
//         <div className="absolute top-4 left-[30rem] flex gap-4 items-center z-10">
//           <div className="flex flex-col items-center">
//             <div
//               className="w-8 h-8 rounded-full border-2 border-gray-400"
//               style={{ backgroundColor: lampColor(greenOn, "#10b981") }}
//             ></div>
//             <span className="text-xs mt-1">Green</span>
//           </div>
//           <div className="flex flex-col items-center">
//             <div
//               className="w-8 h-8 rounded-full border-2 border-gray-600"
//               style={{ backgroundColor: lampColor(redOn, "#ef4444") }}
//             ></div>
//             <span className="text-xs mt-1">Red</span>
//           </div>
//           <div className="flex flex-col items-center">
//             <div
//               className="w-8 h-8 rounded-full border-2 border-gray-400"
//               style={{ backgroundColor: lampColor(yellowOn, "#eab308") }}
//             ></div>
//             <span className="text-xs mt-1">Yellow</span>
//           </div>
//         </div>

//         {/* Temperature Display Boxes - Fixed to container */}
//         <div className="absolute top-4 right-[35rem] space-y-2 z-10">
//           {[
//             "GTPL-122-gT-1000T-S7-1200",
//             "GTPL-121-gT-1000T-S7-1200",
//             "GTPL-124-gT-450T-S7-1200",
//             "GTPL-132-300-AP-S7-1200",
//           ].some((name) => machineName.includes(name)) ? (
//             <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
//               T0 ={" "}
//               {isGrainChilling
//                 ? formatValue(
//                     data?.T0_set_point ||
//                       data?.AIR_OUTLET_TEMP ||
//                       data?.T1_set_point_in_grain_chilling_mode,
//                     "°C"
//                   )
//                 : isPaddyChilling
//                   ? formatValue(
//                       data?.T0_set_point ||
//                         data?.AIR_OUTLET_TEMP ||
//                         data?.T1_set_point_in_paddy_aeging_mode,
//                       "°C"
//                     )
//                   : formatValue(
//                       data?.T0_set_point ||
//                         data?.AIR_OUTLET_TEMP ||
//                         data?.T1_set_point_in_paddy_aeging_mode,
//                       "°C"
//                     )}
//             </div>
//           ) : (
//             <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
//               T1 ={" "}
//               {formatValue(
//                 data?.T1_set_point ||
//                   data?.T1_temp_mean ||
//                   data?.T1_SET_POINT ||
//                   data?.Delta_T_set_point_paddy_aeging_mode,
//                 "°C"
//               )}
//             </div>
//           )}

//           {machineName.includes("GTPL-132-300-AP-S7-1200") ? (
//   <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
//     Delta T ={" "}
//     {formatValue(
//       data.Delta_T_set_point ||
//         data?.Th_T1 ||
//         data?.Delta_T_set_point_in_grain_chilling_mode ||
//         data?.Delta_T_set_point_paddy_aeging_mode,
//       "°C"
//     )}
//   </div>
// ) :[
//             "GTPL-122-gT-1000T-S7-1200",
//             "GTPL-121-gT-1000T-S7-1200",
//             "GTPL-124-gT-450T-S7-1200",

//           ].some((name) => machineName.includes(name)) ? (
//             <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
//               T Delta ={" "}
//               {isGrainChilling
//                 ? formatValue(
//                     data.Delta_T_set_point ||
//                       data?.Th_T1 ||
//                       data?.Delta_T_set_point_in_grain_chilling_mode,
//                     "°C"
//                   )
//                 : isPaddyChilling
//                   ? formatValue(
//                       data.Delta_T_set_point ||
//                         data?.Th_T1 ||
//                         data?.
// Delta_T_set_point_paddy_aeging_mode,
//                       "°C"
//                     )
//                   : formatValue(
//                       data.Delta_T_set_point ||
//                         data?.Th_T1 ||
//                         data?.Delta_T_set_point_in_grain_chilling_mode ||
//                         data?.
// Delta_T_set_point_paddy_aeging_mode,
//                       "°C"
//                     )}
//             </div>
//           ) : (
//             <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
//               TH - T1 ={" "}
//               {formatValue(
//                 data.AI_TH_Act || data?.Th_T1 || data?.TH_T1_set_point,
//                 "°C"
//               )}
//             </div>
//           )}
//         </div>

//         {/* Main Dashboard Content */}
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="relative w-full max-w-[1200px] h-[600px]">
//             {/* SVG Container for Silo and Lines */}
//             <svg
//               className="absolute inset-0 w-full h-full"
//               style={{ zIndex: 1 }}
//               viewBox="0 0 1200 600"
//               preserveAspectRatio="xMidYMid meet"
//             >
//               {/* Silo */}
//               <g>
//                 <ellipse
//                   cx="120"
//                   cy="120"
//                   rx="50"
//                   ry="20"
//                   fill={getSiloColor(status.TS1)}
//                   stroke="#6b7280"
//                   strokeWidth="2"
//                   opacity="0.8"
//                 />
//                 <rect
//                   x="70"
//                   y="120"
//                   width="100"
//                   height="150"
//                   fill={getSiloColor(status.TS1)}
//                   stroke="#6b7280"
//                   strokeWidth="2"
//                   opacity="0.8"
//                 />
//                 <ellipse
//                   cx="120"
//                   cy="270"
//                   rx="50"
//                   ry="20"
//                   fill={getSiloColor(status.TS1)}
//                   stroke="#6b7280"
//                   strokeWidth="2"
//                   opacity="0.9"
//                 />

//                 {/* Horizontal lines */}
//                 {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
//                   <line
//                     key={i}
//                     x1="72"
//                     y1={130 + i * 12}
//                     x2="168"
//                     y2={130 + i * 12}
//                     stroke="#9ca3af"
//                     strokeWidth="1"
//                     opacity="0.7"
//                   />
//                 ))}

//                 {/* Silo outlet */}
//                 <rect
//                   x="115"
//                   y="270"
//                   width="10"
//                   height="25"
//                   fill="#9ca3af"
//                   stroke="#6b7280"
//                   strokeWidth="1"
//                 />
//                 <text
//                   x="120"
//                   y="320"
//                   textAnchor="middle"
//                   className="text-sm font-bold fill-gray-800"
//                 >
//                   SILO
//                 </text>
//               </g>

//               {/* Connecting Lines */}
//               <line
//                 x1="200"
//                 y1="120"
//                 x2="800"
//                 y2="120"
//                 stroke="black"
//                 strokeWidth="2"
//               />
//               <line
//                 x1="170"
//                 y1="180"
//                 x2="200"
//                 y2="120"
//                 stroke="black"
//                 strokeWidth="2"
//               />

//               {/* Vertical drops from main line to thermometers */}
//               {![
//                 "GTPL-122-gT-1000T-S7-1200",
//                 "GTPL-121-gT-1000T-S7-1200",
//                 "GTPL-124-gT-450T-S7-1200",
//                 "GTPL-132-300-AP-S7-1200",
//               ].some((name) => machineName.includes(name)) && (
//                 <line
//                   x1="280"
//                   y1="120"
//                   x2="280"
//                   y2="150"
//                   stroke="black"
//                   strokeWidth="2"
//                 />
//               )}
//               <line
//                 x1="380"
//                 y1="120"
//                 x2="380"
//                 y2="150"
//                 stroke="black"
//                 strokeWidth="2"
//               />
//               <line
//                 x1="480"
//                 y1="120"
//                 x2="480"
//                 y2="150"
//                 stroke="black"
//                 strokeWidth="2"
//               />

//               {/* Connection to blower */}
//               <line
//                 x1="800"
//                 y1="120"
//                 x2="800"
//                 y2="150"
//                 stroke="black"
//                 strokeWidth="2"
//               />
//               <line
//                 x1="800"
//                 y1="500"
//                 x2="800"
//                 y2="380"
//                 stroke="black"
//                 strokeWidth="2"
//               />

//               {/* Lower horizontal line for HTR units */}
//               <line
//                 x1="170"
//                 y1="400"
//                 x2="600"
//                 y2="400"
//                 stroke="black"
//                 strokeWidth="2"
//               />
//               <line
//                 x1="170"
//                 y1="240"
//                 x2="170"
//                 y2="400"
//                 stroke="black"
//                 strokeWidth="2"
//               />

//               {/* Line to compressor */}
//               <line
//                 x1="600"
//                 y1="400"
//                 x2="750"
//                 y2="500"
//                 stroke="black"
//                 strokeWidth="2"
//               />
//             </svg>

//             {/* Thermometers - Fixed positioning */}
//             {![
//               "GTPL-122-gT-1000T-S7-1200",
//               "GTPL-121-gT-1000T-S7-1200",
//               "GTPL-124-gT-450T-S7-1200",
//               "GTPL-132-300-AP-S7-1200",
//             ].some((name) => machineName.includes(name)) && (
//               <div
//                 className="absolute z-10"
//                 style={{
//                   left: "calc(980px * 100% / 1200px)",
//                   top: "calc(270px * 100% / 600px)",
//                   transform: "translateX(535%)",
//                 }}
//               >
//                 <div className="w-12 mt-36 h-64 bg-pink-200 border-2 border-red-300 rounded-lg relative">
//                   <div className="absolute inset-1 bg-gradient-to-b from-transparent via-pink-300 to-red-400 rounded"></div>
//                   <div className="text-xs font-bold p-1 text-center w-full">
//                     TH
//                   </div>
//                   <div className="text-xs font-bold p-1 text-center w-full">
//                     {formatValue(
//                       data.AI_TH_Act ||
//                         data?.AFTER_HEATER_TEMP_Th ||
//                         data?.TH_temp_mean,
//                       "°C"
//                     )}
//                   </div>
//                   <div className="absolute bottom-1 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
//                   <div className="absolute bottom-4 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
//                   <div className="absolute bottom-7 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
//                   <div className="absolute bottom-10 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
//                   <div className="absolute bottom-14 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
//                   <div className="absolute bottom-18 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
//                   <div className="absolute bottom-22 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
//                   <div className="absolute bottom-14 left-1 right-1 h-2 bg-red-500 rounded-full"></div>
//                 </div>
//               </div>
//             )}

//             <div
//               className="absolute z-10"
//               style={{
//                 left: "calc(380px * 100% / 1200px)",
//                 top: "calc(150px * 100% / 600px)",
//                 transform: "translateX(745%)",
//               }}
//             >
//               <div className="w-12 mt-36 h-64 bg-blue-100 border-2 border-blue-300 rounded-lg relative">
//                 <div className="absolute inset-1 bg-gradient-to-b from-blue-200 to-blue-300 rounded">
//                   <div className="text-xs font-bold p-1 text-center">T0</div>
//                   <div className="text-xs p-1 text-center">
//                     {formatValue(
//                       data.AIR_OUTLET_TEMP || data?.T0_temp_mean,
//                       "°C"
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div
//               className="absolute z-10"
//               style={{
//                 left: "calc(480px * 100% / 1200px)",
//                 top: "calc(150px * 100% / 600px)",
//                 transform: "translateX(950%)",
//               }}
//             >
//               <div className="w-12 mt-36 h-64 bg-blue-100 border-2 border-blue-300 rounded-lg relative">
//                 <div className="absolute inset-1 bg-gradient-to-b from-blue-200 to-blue-300 rounded">
//                   <div className="text-xs font-bold p-1 text-center">T1</div>
//                   <div className="text-xs p-1 text-center">
//                     {formatValue(
//                       data?.COLD_AIR_TEMP_T1 ||
//                         data?.T1_temp_mean ||
//                         data?.T1_temp_mean,
//                       "°C"
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* T2 Temperature Display */}
//             <div
//               className="absolute z-10 mt-[15rem] ml-12"
//               style={{
//                 left: "calc(580px * 100% / 1200px)",
//                 top: "calc(200px * 100% / 600px)",
//                 transform: "translateX(1950%)",
//               }}
//             >
//               <div className="text-center">
//                 <div className="text-lg font-bold">T2</div>
//                 <div className="text-sm">
//                   {formatValue(
//                     data?.T2_temp_mean || data?.AMBIENT_AIR_TEMP_T2
//                   ) || "N/A"}
//                   °C
//                 </div>
//               </div>
//             </div>

//             {/* HTR Units */}
//             <div
//               className="absolute flex gap-14 z-10"
//               style={{
//                 left: "calc(200px * 100% / 1200px)",
//                 top: "calc(430px * 100% / 600px)",
//                 transform: [
//                   "GTPL-122-gT-1000T-S7-1200",
//                   "GTPL-121-gT-1000T-S7-1200",
//                   "GTPL-124-gT-450T-S7-1200",
//                   "GTPL-118-gT-60T-S7-200",
//                   "GTPL-108-gT-40E-P-S7-200",
//                   "GTPL-109-gT-40E-P-S7-200",
//                   "GTPL-110-gT-40E-P-S7-200",
//                   "GTPL-111-gT-80E-P-S7-200",
//                   "GTPL-112-gT-80E-P-S7-200",
//                   "GTPL-113-gT-80E-P-S7-200",
//                  GTPL-132-300-AP-S7-1200
//                 ].some((name) => machineName.includes(name))
//                   ? "translate(230%,650%)"
//                   : "translateY(620%)",
//               }}
//             >
//               {![
//                 "GTPL-122-gT-1000T-S7-1200",
//                 "GTPL-121-gT-1000T-S7-1200",
//                 "GTPL-124-gT-450T-S7-1200",
//                 "GTPL-118-gT-60T-S7-200",
//                 "GTPL-108-gT-40E-P-S7-200",
//                 "GTPL-109-gT-40E-P-S7-200",
//                 "GTPL-110-gT-40E-P-S7-200",
//                 "GTPL-111-gT-80E-P-S7-200",
//                 "GTPL-112-gT-80E-P-S7-200",
//                 "GTPL-113-gT-80E-P-S7-200",
//                GTPL-132-300-AP-S7-1200
//               ].some((name) => machineName.includes(name)) && (
//                 <div className="bg-red-600 text-white px-3 ml-64 py-4 text-center rounded">
//                   <div className="text-xs font-bold">HTR</div>
//                   <div className="text-sm font-bold">
//                     {formatValue(
//                       data.Value_to_Display_HEATER || data?.Heater_speed,
//                       "%"
//                     )}
//                   </div>
//                 </div>
//               )}
//               <div className="bg-red-600 text-white px-3 py-4 text-center rounded">
//                 <div className="text-xs font-bold">AHT</div>
//                 <div className="text-sm font-bold">
//                   {formatValue(
//                     data?.AHT_vale_speed ||
//                       data.Value_to_Display_AHT_VALE_OPEN ||
//                       data.AFTER_HEAT_VALVE_RPM ||
//                       data?.AHT_valve_speed,
//                     "%"
//                   )}
//                 </div>
//               </div>
//               <div className="bg-red-600 text-white px-3 py-4 text-center rounded">
//                 <div className="text-xs font-bold">HGS</div>
//                 <div className="text-sm font-bold">
//                   {formatValue(
//                     data.Value_to_Display_HOT_GAS_VALVE_OPEN ||
//                       data?.HOT_GAS_VALVE_RPM ||
//                       data?.Hot_valve_speed,
//                     "%"
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Blower Unit */}
//             <div
//               className="absolute z-10"
//               style={{
//                 left: "calc(800px * 100% / 1200px)",
//                 top: "calc(500px * 100% / 600px)",
//                 transform: "translate(750%)",
//               }}
//             >
//               <div className="text-black px-4 py-2 text-center rounded mt-112">
//                 <img
//                   src="https://www.thumbsfrog.com/1046553/pages/low-pressure-blower-image-1695819922-1046553.jpg"
//                   alt="Blower"
//                   className="w-16 h-16 object-contain mx-auto"
//                 />
//                 <div className="text-xs font-bold mt-1">BLOWER</div>
//                 <div className="text-sm font-bold">
//                   {formatValue(
//                     data?.Blower_speed ||
//                       data?.BLOWER_RPM ||
//                       data?.Value_to_Display_BLOWER ||
//                       data?.Blower_speed,
//                     "%"
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Condenser Fan */}
//             <div
//               className="absolute z-10"
//               style={{
//                 left: "calc(800px * 100% / 1200px)",
//                 top: "calc(150px * 100% / 600px)",
//                 transform: "translateX(1620%)",
//               }}
//             >
//               <div className="w-12 h-64 mt-36 bg-pink-200 border-2 border-red-300 rounded-lg relative">
//                 <div className="absolute bottom-1 left-1 right-1 h-3 bg-red-400 rounded-full"></div>
//                 <div className="absolute top-2 right-2">
//                   <div className="w-3 h-3 bg-red-500 rounded-full"></div>
//                 </div>

//                 {/* ✅ Ensure parent is relative and image wrapper is sized */}
//                 {machineName.includes("GTPL-124-gT-450T-S7-1200") ? (
//                   // Show Fan1 if machineName contains 124
//                   <div className="absolute left-16 top-[6rem] transform -translate-y-1/2">
//                     <div className="w-20 h-20 relative">
//                       <Image
//                         src={Fan1}
//                         alt="Fan1"
//                         fill
//                         className="object-contain"
//                       />
//                     </div>
//                   </div>
//                 ) : // Otherwise, same old logic
//                 [
//                     "GTPL-116-gT-240E-S7-1200",
//                     "GTPL-117-gT-320E-S7-1200",
//                     "GTPL-122-gT-1000T-S7-1200",
//                     "GTPL-121-gT-1000T-S7-1200",
//                   ].some((name) => machineName.includes(name)) ? (
//                   <>
//                     <div className="absolute left-16 top-[6rem] transform -translate-y-1/2">
//                       <div className="w-20 h-20 relative">
//                         <Image
//                           src={Fan1200}
//                           alt="Fan"
//                           fill
//                           className="object-contain"
//                         />
//                       </div>
//                     </div>
//                     {/* <div className="absolute left-16 top-[10rem] transform -translate-y-1/2">
//         <div className="w-20 h-20 relative">
//           <Image src={Fan} alt="Fan" fill className="object-contain" />
//         </div>
//       </div> */}
//                   </>
//                 ) : (
//                   <div className="absolute left-16 top-[6rem] transform -translate-y-1/2">
//                     <div className="w-20 h-20 relative">
//                       <Image
//                         src={Fan}
//                         alt="Fan"
//                         fill
//                         className="object-contain"
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <div className="absolute -bottom-12 left-20 transform -translate-x-1/2 text-center">
//                 <div className="text-xs font-bold">Condensor</div>
//                 <div className="text-xs">
//                   {formatValue(
//                     data?.Value_to_Display_COND_ACT_SPEED ||
//                       data?.CONDENSER_RPM ||
//                       data?.Cond_fan_speed ||
//                       data?.Condenser_fan_speed,
//                     "%"
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Compressor Unit */}
//             <div
//               className="absolute z-10"
//               style={{
//                 left: "calc(900px * 100% / 1200px)",
//                 top: "calc(500px * 100% / 600px)",
//                 transform: "translate(1050%)",
//               }}
//             >
//               <div className="w-20 h-12 rounded relative mt-[29rem]">
//                 <img
//                   src="https://tse2.mm.bing.net/th/id/OIP.I6O7E9W-F27nxBsa_GZ35wAAAA?r=0&w=370&h=370&rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3"
//                   className="w-40 h-20 object-contain"
//                   alt="Compressor"
//                 />
//               </div>
//               <div className="absolute -bottom-8 bg-red-600 text-white px-2 py-1 text-center rounded text-xs left-1/2 transform -translate-x-1/2">
//                 <div className="font-bold">
//                   <span className="flex items-center gap-1">
//                     <span
//                       className={`h-2 w-2 rounded-full ${
//                         isCompressorOn
//                           ? "bg-green-500 group-hover:bg-green-600"
//                           : "bg-red-500 group-hover:bg-red-600"
//                       } shadow-sm transition-colors duration-300`}
//                     />
//                     {isCompressorOn ? "ON" : "OFF"}
//                   </span>
//                 </div>
//               </div>
//             </div>

//             {/* Pressure Readings */}
//             <div
//               className="absolute flex gap-2 flex-row z-10 mt-[36rem] ml-[29.5rem]"
//               style={{
//                 right: "calc(200px * 100% / 1200px)",
//                 bottom: "calc(50px * 100% / 600px)",
//                 transform: "translate(520%)",
//               }}
//             >
//               <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
//                 LP
//                 <br />
//                 {formatValue(
//                   data.AI_SUC_PRESSURE || data?.LP || data?.LP_value
//                 )}
//               </div>
//               <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
//                 HP
//                 <br />
//                 {formatValue(
//                   data.AI_COND_PRESSURE ||
//                     data?.HP ||
//                     data?.COMPRESSOR_TIME ||
//                     data?.HP_value ||
//                     data?.Compressor_timer
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { usePathname } from "next/navigation";

import { useEffect, useRef, useState } from "react";

export default function AutoDiagram1({
  blower,
  data,
  formatValue,
  machineName,
  config,
}: any) {
  const normalizedMachineName = (machineName || "").toUpperCase();
  // AP machines (300AP / 450AP) — show condenser fan speed
  const isAPMachine = normalizedMachineName.includes("AP");
  const pathname = usePathname();
  const isGrainChilling = pathname.includes("auto-grain");
  const isPaddyChilling = pathname.includes("auto-paddy");

  // Scale the fixed 1500x760 canvas to fit container width → no horizontal scroll
  const DESIGN_W = 1500;
  const DESIGN_H = 760;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / DESIGN_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const getSiloColor = (temp: number) => {
    return "#10b981"; // Green color
  };

  const status = {
    TS1: 35,
  };

  const [compressorTime, setCompressorTime] = useState<number | null>(null);

  useEffect(() => {
    const rawValue = data?.COMPRESSOR_TIME || data?.Compressor_timer;
    const parsed = parseFloat(rawValue);

    if (!isNaN(parsed)) {
      setCompressorTime(parsed);
    }
  }, [data?.COMPRESSOR_TIME, data?.Compressor_timer]);

  useEffect(() => {
    if (compressorTime === null) return;

    const interval = setInterval(() => {
      setCompressorTime((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // decrement every second

    return () => clearInterval(interval);
  }, [compressorTime]);

  // Helper function to check if a value represents "true"
  const isTrueValue = (value: any) => {
    if (!value) return false;
    const normalizedValue = String(value).toLowerCase();
    return (
      normalizedValue === "true" ||
      normalizedValue === "tr" ||
      normalizedValue === "True"
    );
  };

  // Green light conditions
  const greenLightFields = [
    "GREEN_LIGHT",
    "Chiller_healthy_(Q1.1)",
    "Chiller_healthy_on_Q1_1",
    "Chiller_healthy_on",
    "Chiller_healthy",
    "Chiller_healthy_on_Q1_1",
    "Chiller_healthy_Q1_1",
    "Chiller_healthy_on_Q0_7",
    "Chiller_healthy_Q0_7",
  ];

  // Red light conditions
  const redLightFields = [
    "RED_LIGHT",
    "Chiller_fault_(Q2.3)",
    "Chiller_Fault_on_Q2_0",
    "Chiller_Fault_on",
    "Chiller_Fault",
    "Chiller_fault_Q2_3",
    "Chiller_Fault_Q2_3",
    "Chiller_fault_Q2_3",
    "Chiller_Fault_Q1_1",
  ];

  // Yellow light conditions
  const yellowLightFields = [
    "YELLOW_LIGHT",
    "System_warnning_(Q1.0)",
    "System_warning_Q1_0",
    "Collective_Trouble_Signal_on_Q2_1",
    "Collective_Trouble_Signal_on",
    "Collective_Trouble_Signal",
    "Collective_trouble_signal_Q1_0",
    "Collective_Trouble_Signal_Q0_6",
  ];

  // Check conditions
  const greenOn = greenLightFields.some((field) => isTrueValue(data?.[field]));
  const redOn = redLightFields.some((field) => isTrueValue(data?.[field]));
  const yellowOn = yellowLightFields.some((field) =>
    isTrueValue(data?.[field]),
  );

  // Helper for lamp color
  const lampColor = (on: boolean, color: string) => (on ? color : "#d1d5db");

  const isCompressorOn =
    isTrueValue(data?.COMPRESSOR_ON) ||
    isTrueValue(data?.Compressor_on_Q0_4) ||
    isTrueValue(data?.Compressor_start) ||
    isTrueValue(data?.Compressor_on_Q0_0) ||
    isTrueValue(data?.Compressor_start_Q0_0) ||
    isTrueValue(data?.Compressor_on_Q0_0) ||
    isTrueValue(data?.Compressor_start_Q0_0) ||
    isTrueValue(data?.Compressor_on_Q0_1) ||
    isTrueValue(data?.Compressor_start_Q0_1) ||
    isTrueValue(data?.Compressor_on) ||
    isTrueValue(data?.Comp_start);

  const isCondenserFanOn =
    isTrueValue(data?.Cond_fan_on) ||
    isTrueValue(data?.Condenser_fan_on) ||
    isTrueValue(data?.Cond_Fan_on) ||
    isTrueValue(data?.CONDENSER_FAN_ON) ||
    (data?.Cond_fan_speed !== undefined && data?.Cond_fan_speed !== null && parseFloat(data?.Cond_fan_speed) > 0) ||
    (data?.Condenser_fan_speed !== undefined && data?.Condenser_fan_speed !== null && parseFloat(data?.Condenser_fan_speed) > 0) ||
    (data?.CONDENSER_RPM !== undefined && data?.CONDENSER_RPM !== null && parseFloat(data?.CONDENSER_RPM) > 0) ||
    (data?.Value_to_Display_COND_ACT_SPEED !== undefined && data?.Value_to_Display_COND_ACT_SPEED !== null && parseFloat(data?.Value_to_Display_COND_ACT_SPEED) > 0);

  const isSpecialMachine = [
    "GTPL-122-gT-1000T-S7-1200",
    "GTPL-121-gT-1000T-S7-1200",
    "GTPL-124-gT-450T-S7-1200",
    "GTPL-137-gT-450T-S7-1200",
    "GTPL-138-gT-450T-S7-1200",
    "GTPL-136-gT-450AP",
    "GTPL-132-300-AP-S7-1200",
    "GTPL-142-gT-450AP-S7-1200",
    "GTPL-123-gT-450AP",
    "GTPL-143-gT-450AP-S7-1200",
    "GTPL-134-gT-450T-S7-1200",
    "GTPL-135-gT-450T-S7-1200",
    "GTPL-145-gT-450T-S7-1200",
    "GTPL-148-gT-450T-S7-1200",
    "GTPL-133-gT-650T-S7-1200",
    "GTPL-154-gT-650T-S7-1200",
    "GTPL-155-gT-650T-S7-1200",
    "GTPL-081-gT-650T-S7-1200",
    "GTPL-105-gT-650T-S7-1200",
    "GTPL-131-gT-650T-S7-1200",
    "GTPL-068-gT-650T-S7-1200",
    "GTPL-104-gT-650T-S7-1200",
    "GTPL-118-gT-60T-S7-200",
    // "GTPL-061-gT-450T-S7-1200",
  ].some((name) => machineName.includes(name));

  const isHTRMachine = [
    "GTPL-122-gT-1000T-S7-1200",
    "GTPL-121-gT-1000T-S7-1200",
    "GTPL-124-gT-450T-S7-1200",
    "GTPL-118-gT-60T-S7-200",
    "GTPL-108-gT-40E-P-S7-200",
    "GTPL-109-gT-40E-P-S7-200",
    "GTPL-110-gT-40E-P-S7-200",
    "GTPL-111-gT-80E-P-S7-200",
    "GTPL-112-gT-80E-P-S7-200",
    "GTPL-113-gT-80E-P-S7-200",
    "GTPL-132-300-AP-S7-1200",
    "GTPL-142-gT-450AP-S7-1200",
    "GTPL-123-gT-450AP",
    "GTPL-143-gT-450AP-S7-1200",
    "GTPL-137-gT-450T-S7-1200",
    "GTPL-138-gT-450T-S7-1200",
    "GTPL-136-gT-450AP",
    "GTPL-134-gT-450T-S7-1200",
    "GTPL-135-gT-450T-S7-1200",
    "GTPL-145-gT-450T-S7-1200",
    "GTPL-148-gT-450T-S7-1200",
    "GTPL-061-gT-450T-S7-1200",
    "GTPL-133-gT-650T-S7-1200",
    "GTPL-154-gT-650T-S7-1200",
    "GTPL-155-gT-650T-S7-1200",
    "GTPL-081-gT-650T-S7-1200",
    "GTPL-105-gT-650T-S7-1200",
    "GTPL-131-gT-650T-S7-1200",
    "GTPL-068-gT-650T-S7-1200",
    "GTPL-104-gT-650T-S7-1200",
  ].some((name) => machineName.includes(name));

  // Machines with 2 condenser fans
  const is2FanMachine = [
    "GTPL-116-gT-240E-S7-1200",
    "GTPL-117-gT-320E-S7-1200",
    "GTPL-132-300-AP-S7-1200",
    "GTPL-139-gT-300AP-S7-1200",
    "GTPL-144-gT-300AP-S7-1200",
  ].some((name) => normalizedMachineName.includes(name.toUpperCase()));

  // Machines with 4 condenser fans
  const is4FanMachine = [
    "GTPL-123-gT-450AP",
    "GTPL-136-gT-450AP",
    "GTPL-142-gT-450AP-S7-1200",
    "GTPL-143-gT-450AP-S7-1200",
    "GTPL-061-gT-450T-S7-1200",
    "GTPL-134-gT-450T-S7-1200",
    "GTPL-135-gT-450T-S7-1200",
    "GTPL-145-gT-450T-S7-1200",
    "GTPL-148-gT-450T-S7-1200",
    "GTPL-124-gT-450T-S7-1200",
    "GTPL-137-gT-450T-S7-1200",
    "GTPL-138-gT-450T-S7-1200",
  ].some((name) => normalizedMachineName.includes(name.toUpperCase())) ||
    normalizedMachineName.includes("GTPL-123") ||
    normalizedMachineName.includes("450AT") ||
    normalizedMachineName.includes("450AP");

  // Machines with 6 condenser fans
  const is6FanMachine = [
    "GTPL-121-gT-1000T-S7-1200",
    "GTPL-122-gT-1000T-S7-1200",
    "GTPL-131-gT-650T-S7-1200",
    "GTPL-133-gT-650T-S7-1200",
    "GTPL-154-gT-650T-S7-1200",
    "GTPL-155-gT-650T-S7-1200",
    "GTPL-081-gT-650T-S7-1200",
    "GTPL-105-gT-650T-S7-1200",
    "GTPL-068-gT-650T-S7-1200",
    "GTPL-104-gT-650T-S7-1200",
  ].some((name) => normalizedMachineName.includes(name.toUpperCase()));

  // S7-200 machines (GTPL-108 to 113) - no T0 sensor, 1 fan each
  const isS7200Machine = [
    "GTPL-108-gT-40E-P-S7-200",
    "GTPL-109-gT-40E-P-S7-200",
    "GTPL-110-gT-40E-P-S7-200",
    "GTPL-111-gT-80E-P-S7-200",
    "GTPL-112-gT-80E-P-S7-200",
    "GTPL-113-gT-80E-P-S7-200",
    "GTPL-115-gT-180E-S7-1200",
    "GTPL-119-gT-180E-S7-1200",
    "GTPL-120-gT-180E-S7-1200",
    "GTPL-044-GT-140E-S7-1200",
    "GTPL-30-gT-180E-S7-1200",
    "GTPL-118-gT-60T-S7-1200",
  ].some((name) => machineName.includes(name));

  // Machines with no T0 (Air Outlet) sensor — hide T0 thermometer, show only TH/T1/T2
  const isNoT0Machine = [
    "GTPL-30-gT-180E-S7-1200",
    "GTPL-115-gT-180E-S7-1200",
    "GTPL-116-gT-240E-S7-1200",
    "GTPL-117-gT-320E-S7-1200",
    "GTPL-119-gT-180E-S7-1200",
    "GTPL-120-gT-180E-S7-1200",
    "GTPL-044-GT-140E-S7-1200",
  ].some((name) => machineName.includes(name));

  // Number of condenser fans for this machine
  const fanCount = is6FanMachine
    ? 6
    : is4FanMachine
      ? 4
      : is2FanMachine
        ? 2
        : 1;

  // Per-fan run status — driven ONLY by the PLC output relay tag for that fan.
  // Output tag naming per machine family (from DATABASE_SCHEMA.md):
  //   650T  : Cond_fan_1_ON_Q2_1 ... Cond_fan_6_ON_Q3_1
  //   450T  : Condenser_fan1_on_Q2_1 ... Condenser_fan4_on_Q2_6
  //   300AP : Condenser_fan1_on_Q2_1 / Condenser_fan2_on_Q2_4 (or _Q2_3, _Q0_1)
  // Q address varies per machine → match by prefix up to "..._ON_Q".
  // Fault / TOP / breaker input bits (_Ix_x) never spin a fan.
  const COND_FAN_ON_PREFIXES = (n: number) => [
    `cond_fan_${n}_on_q`, // 650T style
    `condenser_fan${n}_on_q`, // 300AP / 450AP / 450T style (e.g., Condenser_fan1_on_Q2_1)
    `condenser_fan_${n}_on_q`,
    `cond_fan${n}_on_q`,
  ];

  const isTruthyTag = (v: any) =>
    v === true ||
    v === 1 ||
    v === "1" ||
    String(v).toLowerCase() === "true" ||
    String(v).toLowerCase() === "tr";

  const condFanOn = (n: number): boolean => {
    if (!data) return false;
    // Single-fan machines: dedicated single ON tags, else aggregate speed.
    if (fanCount <= 1) {
      for (const [k, v] of Object.entries(data)) {
        const kl = k.toLowerCase();
        if (
          kl === "cond_fan_on" ||
          kl.startsWith("condenser_fan_on_q") ||
          kl.startsWith("condenser_fan_drive_on_q")
        ) {
          return isTruthyTag(v);
        }
      }
      return isCondenserFanOn;
    }
    // Multi-fan: exact ON output tag for fan n. If tag exists → its value
    // decides (True = spin, False = stop). No tag → fan off.
    const prefixes = COND_FAN_ON_PREFIXES(n);
    for (const [k, v] of Object.entries(data)) {
      const kl = k.toLowerCase();
      if (prefixes.some((p) => kl.startsWith(p))) {
        return isTruthyTag(v);
      }
    }
    return false;
  };

  // Pick first defined numeric value from a list of data fields
  const pickNum = (...vals: any[]): number => {
    for (const v of vals) {
      if (v === undefined || v === null || v === "") continue;
      const n = parseFloat(String(v));
      if (!isNaN(n)) return n;
    }
    return 0;
  };

  const blowerPct = pickNum(
    data?.Blower_speed,
    data?.BLOWER_RPM,
    data?.Value_to_Display_BLOWER,
  );
  const condPct = pickNum(
    data?.Cond_fan_speed,
    data?.Value_to_Display_COND_ACT_SPEED,
    data?.CONDENSER_RPM,
    data?.Condenser_fan_speed,
  );
  const isBlowerOn = blowerPct > 0;

  // Higher % => faster spin. Returns CSS animation-duration.
  const spinDur = (pct: number): string => {
    if (pct <= 0) return "0s";
    const clamped = Math.min(Math.max(pct, 1), 100);
    return `${(2 - (clamped / 100) * 1.6).toFixed(2)}s`;
  };

  // Industrial axial condenser fan with 3D shading (spins when running)
  const FanSVG = ({
    size,
    spinning,
    duration,
  }: {
    size: number;
    spinning: boolean;
    duration: string;
  }) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        {/* 3D metallic shroud */}
        <radialGradient id="fanShroud" cx="38%" cy="34%" r="70%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="55%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </radialGradient>
        {/* recessed throat */}
        <radialGradient id="fanThroat" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#475569" />
        </radialGradient>
        {/* blade with light-to-dark shading for depth */}
        <linearGradient id="fanBlade" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={spinning ? "#60a5fa" : "#cbd5e1"} />
          <stop offset="100%" stopColor={spinning ? "#1d4ed8" : "#64748b"} />
        </linearGradient>
        <radialGradient id="fanHub" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        <filter id="fanShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1.5" dy="2" stdDeviation="1.8" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>
      {/* outer bevel ring (raised look) */}
      <circle cx="50" cy="50" r="48" fill="url(#fanShroud)" stroke="#475569" strokeWidth="1.5" filter="url(#fanShadow)" />
      <circle cx="50" cy="50" r="41" fill="url(#fanThroat)" stroke="#334155" strokeWidth="1" />
      <g
        style={{
          transformOrigin: "50px 50px",
          animation: spinning ? `acSpin ${duration} linear infinite` : "none",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <path
            key={i}
            d="M50 50 C 60 32, 70 24, 62 12 C 52 18, 45 32, 50 50 Z"
            fill="url(#fanBlade)"
            stroke="#0f172a"
            strokeWidth="0.5"
            transform={`rotate(${i * 72} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="10" fill="url(#fanHub)" stroke="#0f172a" strokeWidth="0.8" />
        <circle cx="46" cy="46" r="3" fill="#e2e8f0" opacity="0.6" />
      </g>
    </svg>
  );

  // 3D glass thermometer. Mercury height scales with temperature.
  const Thermo = ({
    label,
    display,
    tint = "#ef4444",
  }: {
    label: string;
    display: string;
    tint?: string;
  }) => {
    const n = parseFloat(String(display).replace(/[^0-9.\-]/g, ""));
    const pct = isNaN(n)
      ? 0
      : Math.min(100, Math.max(6, ((n + 10) / 70) * 100)); // -10..60°C -> %
    const topY = 118 - (pct / 100) * 92; // column top
    const uid = label; // gradient id namespace
    return (
      <div className="flex flex-col items-center">
        <svg width="44" height="150" viewBox="0 0 44 150">
          <defs>
            <linearGradient id={`glass${uid}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="45%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <radialGradient id={`bulb${uid}`} cx="38%" cy="35%" r="70%">
              <stop offset="0%" stopColor={tint} stopOpacity="0.9" />
              <stop offset="100%" stopColor={tint} />
            </radialGradient>
            <filter id={`sh${uid}`} x="-40%" y="-10%" width="180%" height="120%">
              <feDropShadow dx="1.5" dy="2" stdDeviation="1.6" floodColor="#000" floodOpacity="0.3" />
            </filter>
          </defs>
          {/* glass tube */}
          <rect x="15" y="8" width="14" height="112" rx="7" fill={`url(#glass${uid})`} stroke="#64748b" strokeWidth="1" filter={`url(#sh${uid})`} />
          {/* mercury column */}
          <rect x="18" y={topY} width="8" height={122 - topY} rx="4" fill={tint} />
          {/* bulb */}
          <circle cx="22" cy="128" r="12" fill={`url(#bulb${uid})`} stroke="#64748b" strokeWidth="1" />
          {/* pulsing glow when hot */}
          <circle cx="22" cy="128" r="12" fill={tint} opacity="0.35"
            style={{ transformOrigin: "22px 128px", animation: `acPulse 1.6s ease-in-out infinite` }} />
          {/* gloss highlight */}
          <rect x="17" y="12" width="3" height="104" rx="1.5" fill="#ffffff" opacity="0.5" />
        </svg>
        <div className="text-xs font-bold -mt-1">{label}</div>
        <div className="text-xs">{display}</div>
      </div>
    );
  };

  // 3D globe valve / actuator. Handwheel spins when open (value > 0).
  const ValveUnit = ({
    label,
    display,
  }: {
    label: string;
    display: string;
  }) => {
    const n = parseFloat(String(display).replace(/[^0-9.\-]/g, ""));
    const open = !isNaN(n) && n > 0;
    return (
      <div className="flex flex-col items-center">
        <img
          src="/valve.jpeg"
          alt={label}
          style={{
            width: 50,
            height: 58,
            objectFit: "contain",
            mixBlendMode: "multiply",
            transformOrigin: "center",
            filter: open
              ? "drop-shadow(0 0 5px rgba(34,197,94,0.6))"
              : "grayscale(1) brightness(0.9)",
            animation: open ? "acPulse 1.4s ease-in-out infinite" : "none",
          }}
        />
        <div className="text-xs font-bold -mt-1">{label}</div>
        <div className="text-sm font-bold">{display}</div>
      </div>
    );
  };


  // ---------- Reference (IOLens) UI value mapping — new tag names with legacy fallbacks ----------
  const pickVal = (...vals: any[]) => {
    for (const v of vals) {
      if (v !== undefined && v !== null && v !== "") return v;
    }
    return undefined;
  };

  const fmt = (v: any) =>
    v === undefined || v === null || v === "" ? "N/A" : formatValue(v);

  // Temperatures always 1 decimal — consistent across diagram + defaults
  const fmtTemp = (v: any) => {
    if (v === undefined || v === null || v === "") return "N/A";
    const n = parseFloat(String(v));
    if (isNaN(n)) return String(v);
    return n.toFixed(1);
  };

  // TS1 = supply air temp (air into silo), TC1 = cold air temp, TA1 = ambient temp
  // Fallback: calculate mean from individual sensors if mean column missing
  const calcMean = (a: any, b: any) => {
    const n1 = parseFloat(String(a));
    const n2 = parseFloat(String(b));
    if (!isNaN(n1) && !isNaN(n2)) return ((n1 + n2) / 2).toFixed(1);
    if (!isNaN(n1)) return n1;
    if (!isNaN(n2)) return n2;
    return undefined;
  };

  // Use config temperature sensor keys if provided, fallback to hardcoded
  const ts1Val = config?.temperatureSensors?.T0
    ? pickVal(data?.[config.temperatureSensors.T0.key], data?.TS1, data?.TS1_temp, data?.SPLY_AIR_TEMP, data?.AIR_OUTLET_TEMP, data?.T0_temp_mean, calcMean(data?.T0_1_air_outlet_temp, data?.T0_2_air_outlet_temp))
    : pickVal(data?.TS1, data?.TS1_temp, data?.SPLY_AIR_TEMP, data?.AIR_OUTLET_TEMP, data?.T0_temp_mean, calcMean(data?.T0_1_air_outlet_temp, data?.T0_2_air_outlet_temp));

  const tc1Val = config?.temperatureSensors?.T1
    ? pickVal(data?.[config.temperatureSensors.T1.key], data?.TC1, data?.TC1_temp, data?.COLD_AIR_TEMP_T1, data?.T1_temp_mean, calcMean(data?.T1_1_cold_air_temp, data?.T1_2_cold_air_temp))
    : pickVal(data?.TC1, data?.TC1_temp, data?.COLD_AIR_TEMP_T1, data?.T1_temp_mean, calcMean(data?.T1_1_cold_air_temp, data?.T1_2_cold_air_temp));

  const ta1Val = config?.temperatureSensors?.T2
    ? pickVal(data?.[config.temperatureSensors.T2.key], data?.TA1, data?.TA1_temp, data?.AMBIENT_AIR_TEMP_T2, data?.T2_temp_mean, calcMean(data?.T2_1_ambient_temp, data?.T2_2_ambient_temp))
    : pickVal(data?.TA1, data?.TA1_temp, data?.AMBIENT_AIR_TEMP_T2, data?.T2_temp_mean, calcMean(data?.T2_1_ambient_temp, data?.T2_2_ambient_temp));

  const htrPct = pickVal(
    data?.Value_to_Display_HEATER,
    data?.Heater_speed,
    data?.HTR,
    0,
  );
  const ahtPct = pickVal(
    data?.AHT_vale_speed,
    data?.Value_to_Display_AHT_VALE_OPEN,
    data?.AFTER_HEAT_VALVE_RPM,
    data?.AHT_valve_speed,
    0,
  );
  const hgsPct = pickVal(
    data?.Value_to_Display_HOT_GAS_VALVE_OPEN,
    data?.HOT_GAS_VALVE_RPM,
    data?.Hot_valve_speed,
    0,
  );
  const compPct = pickVal(
    data?.Compressor_speed,
    data?.COMP_SPEED,
    data?.Value_to_Display_COMP_SPEED,
    isCompressorOn ? 100 : 0,
  );
  const hpVal = pickVal(
    data?.AI_COND_PRESSURE,
    data?.HP,
    data?.HP_value,
    data?.Compressor_timer,
  );
  const lpVal = pickVal(data?.AI_SUC_PRESSURE, data?.LP, data?.LP_value);
  const pressureUnit =
    machineName === "GTPL-137-gT-450T-S7-1200" ||
    machineName === "GTPL-138-gT-450T-S7-1200"
      ? "bar"
      : "psi";

  // Set points — special machines run on T0 / Delta T, the rest on T1 / TH-T1
  const defTC1 = isSpecialMachine
    ? pickVal(
        data?.T0_set_point,
        isGrainChilling
          ? data?.T0_set_point_in_grain_chilling_mode
          : data?.T0_set_point_in_paddy_aeging_mode,
        data?.T0_set_point_in_grain_chilling_mode,
        data?.T0_set_point_in_paddy_aeging_mode,
        ts1Val,
      )
    : pickVal(
        data?.TC1_set_point,
        data?.T1_set_point,
        data?.T1_SET_POINT,
        isGrainChilling
          ? data?.T1_set_point_in_grain_chilling_mode
          : data?.T1_set_point_in_paddy_aeging_mode,
        data?.T1_set_point_in_grain_chilling_mode,
        data?.T1_set_point_in_paddy_aeging_mode,
      );
  const defTsTc1 = pickVal(
    data?.TS_TC1_set_point,
    data?.Delta_T_set_point,
    data?.TH_T1_set_point,
    data?.Th_T1,
    isGrainChilling
      ? data?.Delta_T_set_point_in_grain_chilling_mode
      : data?.Delta_T_set_point_paddy_aeging_mode,
    data?.Delta_T_set_point_in_grain_chilling_mode,
    data?.Delta_T_set_point_paddy_aeging_mode,
    data?.AI_TH_Act,
  );
  const setPoint1Label = isSpecialMachine ? "T0" : "T1";
  const setPoint2Label = isSpecialMachine ? "Delta T" : "TH-T1";
  const defHP = pickVal(data?.HP_set_point, data?.HP_set, data?.HP_default);
  const defLP = pickVal(data?.LP_set_point, data?.LP_set, data?.LP_default);
  const defBlower = pickVal(
    data?.Blower_set_point,
    data?.Blower_default,
    data?.Blower_speed,
    data?.BLOWER_RPM,
  );
  const defAeration = pickVal(
    data?.Aeration_fan_set_point,
    data?.Aeration_fan_speed,
    data?.AERATION_FAN,
    0,
  );

  const anyFlow = isCompressorOn || isBlowerOn;

  // CR valve tags — name variants differ per machine family (same resolution as [auto] page)
  const resolveCR = (keys: string[]): string | undefined => {
    if (!data) return undefined;
    for (const k of keys) {
      if (data[k] !== undefined) return String(data[k]);
    }
    return undefined;
  };
  const crValves = [
    { label: "CR 25%", val: resolveCR(["CR_valve_25_percent_ON_Q0_2", "CR_valve_25_percent_on_Q0_2", "CR_25_percent_ON_Q0_2", "CR_25%_ON_Q0_2", "CR_valve_25_on_Q0_2"]) },
    { label: "CR 50%", val: resolveCR(["CR_valve_50_percent_ON_Q0_3", "CR_valve_50_percent_on_Q0_3", "CR_50_percent_ON_Q0_3", "CR_50%_ON_Q0_3", "CR_valve_50_on_Q0_3"]) },
    { label: "CR 75%", val: resolveCR(["CR_valve_75_percent_ON_Q2_2", "CR_valve_75_percent_on_Q2_2", "CR_75_percent_ON_Q2_2", "CR valve 75% on_Q2_2", "CR_valve_75_on_Q2_2"]) },
    { label: "CR 100%", val: resolveCR(["CR_valve_100_percent_ON_Q2_7", "CR_valve_100_percent_on_Q2_7", "CR_100_percent_ON_Q2_7", "CR_valve_100_percent_on_Q2_5", "CR_100%_ON_Q2_7", "CR_valve_100_on_Q2_7"]) },
  ].filter((c) => c.val !== undefined);

  // GTPL-108..113 (40E/80E-P S7-200): no T0 on the coil, condenser fan speed
  // shown under the fans.
  const isPaddy200Machine = [
    "GTPL-108",
    "GTPL-109",
    "GTPL-110",
    "GTPL-111",
    "GTPL-112",
    "GTPL-113",
  ].some((n) => String(machineName).includes(n));

  // Heater coil (with TH, no HTR % box) — GTPL-108..113 plus
  // GTPL-115/116/117/119/120. Every other machine: no heater coil, no TH.
  const isHeaterCoilMachine = [
    "GTPL-115",
    "GTPL-116",
    "GTPL-117",
    "GTPL-119",
    "GTPL-120",
    "GTPL-044",
    "GTPL-30"
  ].some((n) => String(machineName).includes(n));
  const hasHeater = isPaddy200Machine || isHeaterCoilMachine;
  const thVal = config?.temperatureSensors?.TH
    ? data?.[config.temperatureSensors.TH.key]
    : pickVal(data?.AI_TH_Act, data?.AFTER_HEATER_TEMP_Th, data?.TH_temp_mean);

  // Two evaporator coils always: AHT coil (orange zigzag) + HGS coil (blue
  // zigzag). Temp label only when the machine has that sensor — heater
  // machines have no T0, so their AHT coil is unlabeled (per reference image).
  const evapCoils: {
    key: string;
    label?: string;
    value?: string;
    zig: string;
    box: string;
    pct: any;
  }[] = (() => {
    const ts: any = config?.temperatureSensors || {};
    const t0 = ts.T0;
    const t1 = ts.T1;
    return [
      {
        key: "AHT",
        label:
          isPaddy200Machine ? undefined : t0 ? "T0" : config ? undefined : "T0",
        value: isPaddy200Machine
          ? undefined
          : t0
            ? fmtTemp(data?.[t0.key] || ts1Val)
            : config
              ? undefined
              : fmtTemp(ts1Val),
        zig: "#f97316",
        box: "AHT",
        pct: ahtPct,
      },
      {
        key: "HGS",
        label: "T1",
        value: t1 ? fmtTemp(data?.[t1.key]) : fmtTemp(tc1Val),
        zig: "#2563eb",
        box: "HGS",
        pct: hgsPct,
      },
    ];
  })();

  // Salmon dashed process piping — exact reference-image pattern, right angles only:
  // top edge: silo top port -> short right -> straight up -> along the top ->
  //           straight down into the blower inlet flange
  // bottom edge: silo bottom port -> short right -> down -> along the bottom past
  //           the coils -> up -> into the flange from the left
  const PIPES = [
    // short stub right, then slanted rise to the top edge (chamfer, per image)
    "M 223 470 H 268 L 310 252 H 848 V 380",
    "M 223 508 H 280 V 572 H 745 V 392 H 826",
    // blower outlet -> compressor panel (T2 badge sits on this run)
    "M 963 467 H 1078",
    // condenser coil bottom -> compressor panel top
    "M 1241 388 V 422",
  ];

  const DefaultCell = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-1.5">
      <span className="text-sm font-bold text-gray-700">{label}</span>
      <span className="text-sm font-bold text-gray-900">{value}</span>
    </div>
  );

  const SensorBadge = ({
    label,
    value,
    color,
    bg,
    border,
  }: {
    label: string;
    value: string;
    color: string;
    bg: string;
    border: string;
  }) => (
    <div
      className="px-2.5 py-1 rounded text-sm font-bold whitespace-nowrap"
      style={{
        backgroundColor: bg,
        border: `1.5px dashed ${border}`,
        color,
      }}
    >
      {label} :&nbsp;<span>{value}</span>
    </div>
  );

  // Cross-hatched heat-exchanger coil with zigzag (evaporator / condenser)
  const CoilSVG = ({
    w,
    h,
    uid,
    zig = "#111827",
  }: {
    w: number;
    h: number;
    uid: string;
    zig?: string;
  }) => {
    const seg = 8;
    const pts: string[] = [];
    for (let i = 0; i <= seg; i++) {
      const y = 12 + ((h - 24) / seg) * i;
      const x = i === 0 || i === seg ? w / 2 : i % 2 ? w - 10 : 10;
      pts.push(`${x},${y}`);
    }
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <pattern
            id={`hatchA${uid}`}
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="7" stroke="#9ca3af" strokeWidth="1.3" />
          </pattern>
          <pattern
            id={`hatchB${uid}`}
            width="7"
            height="7"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-45)"
          >
            <line x1="0" y1="0" x2="0" y2="7" stroke="#b6bcc6" strokeWidth="1.1" />
          </pattern>
        </defs>
        <rect x="2" y="10" width={w - 4} height={h - 20} fill="#e8eaee" stroke="#9ca3af" strokeWidth="1.2" />
        <rect x="2" y="10" width={w - 4} height={h - 20} fill={`url(#hatchA${uid})`} />
        <rect x="2" y="10" width={w - 4} height={h - 20} fill={`url(#hatchB${uid})`} />
        <polyline points={pts.join(" ")} fill="none" stroke={zig} strokeWidth="2" strokeLinejoin="round" />
        <rect x={w / 2 - 4} y="0" width="8" height="11" fill="#374151" />
        <rect x={w / 2 - 4} y={h - 11} width="8" height="11" fill="#374151" />
      </svg>
    );
  };

  // Centrifugal blower (grey round casing, dark curved swirl impeller, pedestal) — per reference image
  const BlowerSVG = ({ spinning }: { spinning: boolean }) => (
    <svg width="170" height="175" viewBox="0 0 170 175">
      <defs>
        <radialGradient id="blwCasing" cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#eef0f3" />
          <stop offset="60%" stopColor="#cfd4da" />
          <stop offset="100%" stopColor="#9aa2ad" />
        </radialGradient>
        <radialGradient id="blwInner" cx="45%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#f6f7f9" />
          <stop offset="100%" stopColor="#d7dbe0" />
        </radialGradient>
      </defs>
      {/* inlet duct + flange collar (top-left) */}
      <rect x="24" y="0" width="42" height="10" rx="2" fill="#b6bcc6" stroke="#9aa2ad" />
      <rect x="33" y="8" width="24" height="46" fill="#cfd4da" stroke="#9aa2ad" />
      {/* base plate + feet */}
      <rect x="34" y="148" width="18" height="12" fill="#b6bcc6" stroke="#9aa2ad" />
      <rect x="118" y="148" width="18" height="12" fill="#b6bcc6" stroke="#9aa2ad" />
      <rect x="22" y="158" width="140" height="11" rx="2" fill="#8d99a6" />
      {/* scroll casing — volute body extends left, merges into round housing */}
      <path
        d="M 100 37 L 48 48 Q 30 52 30 68 L 30 126 Q 30 142 48 146 L 100 153 Z"
        fill="url(#blwCasing)"
        stroke="#9aa2ad"
        strokeWidth="2"
      />
      <circle cx="100" cy="95" r="58" fill="url(#blwCasing)" stroke="#9aa2ad" strokeWidth="2.5" />
      <circle cx="100" cy="95" r="44" fill="url(#blwInner)" stroke="#b6bcc6" strokeWidth="1.5" />
      {/* impeller — dark curved swirl blades */}
      <g
        style={{
          transformOrigin: "100px 95px",
          animation: spinning
            ? `acSpin ${spinDur(blowerPct > 0 ? blowerPct : 50)} linear infinite`
            : "none",
        }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path
            key={a}
            d="M100 95 Q 111 74 99 58 Q 85 73 93 91 Z"
            fill="#5b6470"
            stroke="#454c56"
            strokeWidth="0.8"
            transform={`rotate(${a} 100 95)`}
          />
        ))}
        <circle cx="100" cy="95" r="9" fill="#454c56" />
        <circle cx="97" cy="92" r="2.5" fill="#b6bcc6" opacity="0.8" />
      </g>
    </svg>
  );

  // Duct heater coil (HTR machines) — black frame, yellow→red gradient,
  // staggered grey element bars, per reference image
  const HeaterCoilSVG = ({ w, h }: { w: number; h: number }) => {
    const bars = 7;
    const innerTop = 16;
    const innerH = h - 32;
    const step = innerH / bars;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="htrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="45%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="10"
          width={w - 4}
          height={h - 20}
          fill="url(#htrGrad)"
          stroke="#111827"
          strokeWidth="2.5"
        />
        {/* serpentine element — one snaking path, per reference image */}
        <path
          d={(() => {
            const xl = 22;
            const xr = w - 22;
            const r = step / 2;
            let d = `M ${xl} ${innerTop}`;
            for (let i = 0; i < bars; i++) {
              if (i % 2 === 0) {
                d += ` H ${xr} A ${r} ${r} 0 0 1 ${xr} ${innerTop + (i + 1) * step}`;
              } else {
                d += ` H ${xl} A ${r} ${r} 0 0 0 ${xl} ${innerTop + (i + 1) * step}`;
              }
            }
            d += bars % 2 === 0 ? ` H ${xr}` : ` H ${xl}`;
            return d;
          })()}
          fill="none"
          stroke="#6b7280"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.85"
        />
        <rect x={w / 2 - 4} y="0" width="8" height="11" fill="#374151" />
        <rect x={w / 2 - 4} y={h - 11} width="8" height="11" fill="#374151" />
      </svg>
    );
  };

  // Corrugated flat-bottom grain silo with two right-side outlet ports
  const SiloSVG = () => (
    <svg width="180" height="270" viewBox="0 0 180 270">
      <defs>
        <linearGradient id="siloBodyRef" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9aa5b1" />
          <stop offset="30%" stopColor="#e8ecf0" />
          <stop offset="55%" stopColor="#f4f6f8" />
          <stop offset="100%" stopColor="#8d99a6" />
        </linearGradient>
      </defs>
      {/* conical roof */}
      <polygon points="90,6 12,58 168,58" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
      {[-64, -50, -36, -22, -10, 10, 22, 36, 50, 64].map((dx) => (
        <line key={dx} x1="90" y1="8" x2={90 + dx} y2="57" stroke="#9ca3af" strokeWidth="0.8" opacity="0.8" />
      ))}
      <rect x="85" y="0" width="10" height="8" rx="1.5" fill="#d1d5db" stroke="#6b7280" strokeWidth="0.8" />
      {/* corrugated shell */}
      <rect x="20" y="58" width="140" height="190" fill="url(#siloBodyRef)" stroke="#6b7280" strokeWidth="1.8" />
      {Array.from({ length: 23 }).map((_, i) => (
        <line key={i} x1="20" y1={64 + i * 8} x2="160" y2={64 + i * 8} stroke="#8d99a6" strokeWidth="1" opacity="0.7" />
      ))}
      {/* outlet ports (to piping) */}
      <rect x="158" y="134" width="20" height="13" rx="1.5" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
      <rect x="158" y="172" width="20" height="13" rx="1.5" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
      {/* base */}
      <rect x="14" y="246" width="152" height="6" rx="1" fill="#6b7280" />
    </svg>
  );

  return (
    <div
      ref={wrapRef}
      className="w-full bg-white overflow-hidden"
      style={{ height: DESIGN_H * scale }}
    >
      <style>{`
        @keyframes acSpin { to { transform: rotate(360deg); } }
        @keyframes acPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes acWobble { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
        @keyframes pipeFlow { to { stroke-dashoffset: -34; } }
      `}</style>
      {/* Fixed design canvas, scaled to container width */}
      <div
        className="relative bg-white"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* ---------- Process piping (behind everything) ---------- */}
        <svg
          className="absolute inset-0"
          width={DESIGN_W}
          height={DESIGN_H}
          viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}
          style={{ zIndex: 1 }}
        >
          {/* dashed salmon duct lines per reference image; dashes march when flow active */}
          {PIPES.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="#F19E8B"
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="10 7"
              style={{
                animation: anyFlow ? "pipeFlow 1.2s linear infinite" : "none",
              }}
            />
          ))}
        </svg>

        {/* ---------- Set points (top-left, per reference image) ---------- */}
        <div className="absolute z-10" style={{ left: 340, top: 30 }}>
          <div className="text-sm font-bold text-gray-800 mb-2">Set points</div>
          <div className="flex flex-col gap-2">
            <div className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm min-w-[120px]">
              {setPoint1Label} = {fmtTemp(defTC1)} °C
            </div>
            <div className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm min-w-[120px]">
              {setPoint2Label} = {fmtTemp(defTsTc1)} °C
            </div>
          </div>
        </div>

        {/* ---------- Tower lamp status (top-center, per reference image) ---------- */}
        <div
          className="absolute z-10 bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm font-bold text-gray-800"
          style={{ left: 600, top: 30 }}
        >
          TOWER LAMP STATUS
        </div>
        <div
          className="absolute z-10 rounded-md p-2 flex flex-row gap-1.5"
          style={{ left: 628, top: 76, backgroundColor: "#eceef1", border: "1px solid #d7dade" }}
        >
          <div className="w-10 h-10 rounded-sm" style={{ backgroundColor: redOn ? "#ef4444" : "#dcdfe4" }} />
          <div className="w-10 h-10 rounded-sm" style={{ backgroundColor: yellowOn ? "#eab308" : "#dcdfe4" }} />
          <div className="w-10 h-10 rounded-sm" style={{ backgroundColor: greenOn ? "#16a34a" : "#dcdfe4" }} />
        </div>

        {/* ---------- Condensing-unit dashed boundary ---------- */}
        <div
          className="absolute rounded-lg"
          style={{
            left: 760,
            top: 145,
            width: 640,
            height: 480,
            border: "1.5px dashed #cbd5e1",
            backgroundColor: "#fbfcfd",
            zIndex: 0,
          }}
        />

        {/* ---------- Silo + controls ---------- */}
        <div className="absolute z-10" style={{ left: 45, top: 330 }}>
          <SiloSVG />
        </div>
        <div
          className="absolute z-10 bg-gray-50 border border-gray-200 rounded-md px-4 py-1 text-sm font-bold text-gray-800"
          style={{ left: 100, top: 606 }}
        >
          SILO
        </div>

        {/* ---------- Coils row: heater (HTR machines only) + evaporator coils.
             HTR / AHT / HGS % boxes sit under their own coil, per reference image ---------- */}
        <div
          className="absolute z-10 flex items-start"
          style={{ left: hasHeater ? 285 : 335, top: 278, gap: hasHeater ? 14 : 40 }}
        >
          {hasHeater && (
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <span className="text-base font-bold text-gray-800 mb-1">
                  TH
                </span>
                <div className="bg-white border border-gray-400 rounded-sm px-3 py-1.5 text-base font-bold text-gray-900 min-w-[60px] text-center">
                  {fmtTemp(thVal)}
                </div>
              </div>
              <div className="flex flex-col items-center">
                <HeaterCoilSVG w={60} h={285} />
                {isHeaterCoilMachine && (
                  <div className="bg-white border border-gray-400 rounded-sm px-3 py-1 text-base font-bold text-gray-900 flex items-center gap-2 mt-5">
                    <span>HTR</span>
                    <span>{fmt(htrPct)} %</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {evapCoils.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              {s.label && (
                <div className="flex flex-col items-center">
                  <span className="text-base font-bold text-gray-800 mb-1">
                    {s.label}
                  </span>
                  <div className="bg-white border border-gray-400 rounded-sm px-3 py-1.5 text-base font-bold text-gray-900 min-w-[60px] text-center">
                    {s.value}
                  </div>
                </div>
              )}
              <div className="flex flex-col items-center">
                <CoilSVG w={hasHeater ? 56 : 64} h={285} uid={`evap${i}`} zig={s.zig} />
                <div className="bg-white border border-gray-400 rounded-sm px-3 py-1 text-base font-bold text-gray-900 flex items-center gap-2 mt-5">
                  <span>{s.box}</span>
                  <span>{fmt(s.pct)} %</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- Legend (bottom, per reference image) ---------- */}
        <div
          className="absolute z-10 flex gap-10 text-sm font-bold text-gray-900"
          style={{ left: 280, top: 645 }}
        >
          <div className="space-y-1">
            <div>T2 = Ambient Air Temperature</div>
            <div>T1 = Cold Air Temperature</div>
            <div>T0 = Air Outlet Temperature</div>
          </div>
          <div className="space-y-1">
            <div>AHT = Afterheat Valve</div>
            <div>HGS = Hot Gas Valve</div>
          </div>
        </div>

        {/* ---------- Blower ---------- */}
        <div className="absolute z-10" style={{ left: 803, top: 382 }}>
          <BlowerSVG spinning={isBlowerOn} />
        </div>
        <div
          className="absolute z-10 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-gray-800 flex items-center justify-center gap-4"
          style={{ left: 803, top: 578, width: 170 }}
        >
          <span className="text-base font-bold">Blower</span>
          <span className="text-base font-bold">{fmt(blowerPct)} %</span>
        </div>

        {/* T2 ambient badge (above blower→compressor pipe, from machine config) */}
        <div className="absolute z-10" style={{ left: 975, top: 428 }}>
          <SensorBadge
            label="T2"
            value={fmtTemp(
              config?.temperatureSensors?.T2
                ? data?.[config.temperatureSensors.T2.key]
                : ta1Val,
            )}
            color="#c2410c"
            bg="#fdece4"
            border="#f5a274"
          />
        </div>

        {/* ---------- Condenser coil + fan ---------- */}
        <div className="absolute z-10" style={{ left: 1215, top: 148 }}>
          <CoilSVG w={52} h={240} uid="cond" />
        </div>
        <div
          className="absolute z-10 bg-white border border-gray-200 rounded-md px-2 py-2 text-center flex flex-col"
          style={{ left: 1270, top: 148, width: 126, height: 240 }}
        >
          <div className="text-sm font-bold text-gray-800 leading-tight mb-1">
            CONDENSER
            <br />
            FAN
          </div>
          <div
            className="flex-1 grid justify-items-center items-center"
            style={{
              gridTemplateColumns: fanCount >= 4 ? "repeat(2, 1fr)" : "1fr",
            }}
          >
            {Array.from({ length: fanCount }).map((_, i) => (
              <FanSVG
                key={i}
                size={fanCount >= 4 ? 52 : fanCount === 2 ? 82 : 104}
                spinning={condFanOn(i + 1)}
                duration={condPct > 0 ? spinDur(condPct) : "1.1s"}
              />
            ))}
          </div>
        </div>
        {/* condenser fan speed — GTPL-108..113 + 115/116/117/119/120 + AP machines */}
        {(isPaddy200Machine || isHeaterCoilMachine || isAPMachine) && (
          <div
            className="absolute z-10 bg-white border border-gray-400 rounded-sm px-3 py-0.5 text-sm font-bold text-gray-900 text-center"
            style={{ left: 1290, top: 393 }}
          >
            {fmt(condPct)} %
          </div>
        )}

        {/* ---------- Compressor panel ---------- */}
        <div
          className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-sm p-3"
          style={{ left: 1078, top: 422, width: 305 }}
        >
          <span
            className={`absolute top-2 right-2 text-white text-xs font-bold px-2.5 py-0.5 rounded ${
              isCompressorOn ? "bg-green-600" : "bg-red-500"
            }`}
          >
            {isCompressorOn ? "ON" : "OFF"}
          </span>
          <div className="flex items-center gap-3 mt-1">
            <div className="flex flex-col items-center">
              <img
                src="/compressor%20off.jpeg"
                alt="Compressor"
                style={{
                  width: 140,
                  objectFit: "contain",
                  mixBlendMode: "multiply",
                  filter: isCompressorOn
                    ? "sepia(1) hue-rotate(65deg) saturate(3.2) brightness(1.05) drop-shadow(0 0 6px rgba(34,197,94,0.7))"
                    : "grayscale(1) brightness(0.95)",
                }}
              />
              <span className="text-sm font-bold text-gray-800 mt-1">
                COMPRESSOR
              </span>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="border border-gray-200 rounded px-3 py-1.5 bg-white">
                <div className="text-xs font-bold text-gray-700">HP</div>
                <div className="text-sm font-bold text-gray-900">
                  {fmt(hpVal)} {pressureUnit}
                </div>
              </div>
              <div className="border border-gray-200 rounded px-3 py-1.5 bg-white">
                <div className="text-xs font-bold text-gray-700">LP</div>
                <div className="text-sm font-bold text-gray-900">
                  {fmt(lpVal)} {pressureUnit}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- CR valve states (below compressor panel, per reference image) ---------- */}
        {crValves.length > 0 && (
          <div
            className="absolute z-10 grid grid-cols-2 gap-2"
            style={{ left: 1078, top: 604, width: 305 }}
          >
            {crValves.map((c) => (
              <div
                key={c.label}
                className="flex items-center justify-between bg-white border border-gray-300 rounded px-2.5 py-1.5 shadow-sm"
              >
                <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                  {c.label}
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    isTrueValue(c.val)
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {isTrueValue(c.val) ? "ON" : "OFF"}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
