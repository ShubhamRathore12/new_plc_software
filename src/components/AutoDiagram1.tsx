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
}: any) {
  const normalizedMachineName = (machineName || "").toUpperCase();
  const pathname = usePathname();
  const isGrainChilling = pathname.includes("auto-grain");
  const isPaddyChilling = pathname.includes("auto-paddy");

  // Scale the fixed 1200x800 canvas to fit container width → no horizontal scroll
  const DESIGN_W = 1200;
  const DESIGN_H = 800;
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

    "GTPL-030-gT-180E-S7-1200",
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
  ].some((name) => machineName.includes(name));

  // Number of condenser fans for this machine
  const fanCount = is6FanMachine
    ? 6
    : is4FanMachine
      ? 4
      : is2FanMachine
        ? 2
        : 1;

  // Per-fan run status from machine output tags.
  // Matches any key like Cond_fan_1_ON_Q2_1 / Condenser_fan1_on_Q2_1 for fan n.
  // Single-fan machines have no fan number in tag → use aggregate isCondenserFanOn.
  const condFanOn = (n: number): boolean => {
    if (fanCount <= 1) return isCondenserFanOn;
    if (!data) return false;
    for (const [k, v] of Object.entries(data)) {
      const kl = k.toLowerCase();
      if (!kl.includes("cond") || !kl.includes("fan")) continue;
      const m = kl.match(/fan[_ ]?(\d+)/);
      if (!m || parseInt(m[1], 10) !== n) continue;
      const on =
        v === true ||
        v === 1 ||
        v === "1" ||
        String(v).toLowerCase() === "true" ||
        String(v).toLowerCase() === "tr";
      if (on) return true;
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

  return (
    <div
      ref={wrapRef}
      className="w-full bg-gray-100 overflow-hidden"
      style={{ height: DESIGN_H * scale }}
    >
      {/* Animation keyframes for rotating/pulsing machinery */}
      <style>{`
        @keyframes acSpin { to { transform: rotate(360deg); } }
        @keyframes acPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        @keyframes acWobble { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
      `}</style>
      {/* Fixed 1200x800 canvas, scaled to fit width */}
      <div
        className="relative bg-gray-100"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* Status Indicators - Top Left */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-x-48 flex gap-4 items-center z-10">
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-400"
              style={{ backgroundColor: lampColor(greenOn, "#10b981") }}
            ></div>
            <span className="text-xs mt-1">Green</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-600"
              style={{ backgroundColor: lampColor(redOn, "#ef4444") }}
            ></div>
            <span className="text-xs mt-1">Red</span>
          </div>
          <div className="flex flex-col items-center">
            <div
              className="w-8 h-8 rounded-full border-2 border-gray-400"
              style={{ backgroundColor: lampColor(yellowOn, "#eab308") }}
            ></div>
            <span className="text-xs mt-1">Yellow</span>
          </div>
        </div>

        {/* Temperature Display Boxes - Top Right */}
        {/* <div className="absolute top-4 right-1/2 transform translate-x-1/2 translate-x-48 space-y-2 z-10">
          {machineName.includes("GTPL-061-gT-450T-S7-1200") ? (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T1 ={" "}
              {formatValue(
                data?.T1_set_point ||
                data?.T1_temp_mean ||
                data?.COLD_AIR_TEMP_T1 ||
                data?.T1_SET_POINT,
                "°C"
              )}
            </div>
          ) : isSpecialMachine ? (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T0 ={" "}
              {isGrainChilling
                ? formatValue(
                  data?.T0_set_point ||
                  data?.AIR_OUTLET_TEMP ||
                  data?.T1_set_point_in_grain_chilling_mode || data?.T0_set_point_in_grain_chilling_mode,
                  "°C"
                )
                : isPaddyChilling
                  ? formatValue(
                    data?.T0_set_point ||
                    data?.AIR_OUTLET_TEMP ||
                    data?.T1_set_point_in_paddy_aeging_mode || data?.T0_set_point_in_paddy_aeging_mode,
                    "°C"
                  )
                  : formatValue(
                    data?.T0_set_point ||
                    data?.AIR_OUTLET_TEMP ||
                    data?.T1_set_point_in_paddy_aeging_mode || data?.T0_temp_mean,
                    "°C"
                  )}
            </div>
          ) : (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T1 ={" "}
              {formatValue(
                data?.T1_set_point ||
                data?.T1_temp_mean ||
                data?.T1_SET_POINT ||
                data?.Delta_T_set_point_paddy_aeging_mode,
                "°C"
              )}
            </div>
          )}

          {isSpecialMachine ? (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T Delta ={" "}
              {isGrainChilling
                ? formatValue(
                  data.Delta_T_set_point ||
                  data?.Th_T1 ||
                  data?.Delta_T_set_point_in_grain_chilling_mode,
                  "°C"
                )
                : isPaddyChilling
                  ? formatValue(
                    data.Delta_T_set_point ||
                    data?.Th_T1 ||
                    data?.Delta_T_set_point_paddy_aeging_mode,
                    "°C"
                  )
                  : formatValue(
                    data.Delta_T_set_point ||
                    data?.Th_T1 ||
                    data?.Delta_T_set_point_in_grain_chilling_mode ||
                    data?.Delta_T_set_point_paddy_aeging_mode,
                    "°C"
                  )}
            </div>
          ) : machineName.includes("GTPL-061-gT-450T-S7-1200") ? (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T0 - T1 ={" "}
              {formatValue(
                data?.T0_T1_set_point || data?.AIR_OUTLET_TEMP || data?.COLD_AIR_TEMP_T1 || data?.T1_temp_mean,
                "°C"
              )}
            </div>
          ) : (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              TH - T1 ={" "}
              {formatValue(
                data.AI_TH_Act || data?.Th_T1 || data?.TH_T1_set_point,
                "°C"
              )}
            </div>
          )}
        </div> */}
        <div className="absolute top-4 right-1/2 transform translate-x-1/2 translate-x-48 space-y-2 z-10">
          {machineName.includes("GTPL-061-gT-450T-S7-1200") ? (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T1 ={" "}
              {data?.T1_set_point ||
                data?.T1_temp_mean ||
                data?.COLD_AIR_TEMP_T1 ||
                data?.T1_SET_POINT ||
                "N/A"}
              °C
            </div>
          ) : isSpecialMachine ? (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T0 ={" "}
              {isGrainChilling
                ? data?.T0_set_point ||
                  data?.AIR_OUTLET_TEMP ||
                  data?.T1_set_point_in_grain_chilling_mode ||
                  data?.T0_set_point_in_grain_chilling_mode ||
                  "N/A"
                : isPaddyChilling
                  ? data?.T0_set_point ||
                    data?.AIR_OUTLET_TEMP ||
                    data?.T1_set_point_in_paddy_aeging_mode ||
                    data?.T0_set_point_in_paddy_aeging_mode ||
                    "N/A"
                  : data?.T0_set_point ||
                    data?.AIR_OUTLET_TEMP ||
                    data?.T1_set_point_in_paddy_aeging_mode ||
                    data?.T0_temp_mean ||
                    "N/A"}
              °C
            </div>
          ) : (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T1 ={" "}
              {data?.T1_set_point ||
                data?.T1_temp_mean ||
                data?.T1_SET_POINT ||
                data?.Delta_T_set_point_paddy_aeging_mode ||
                "N/A"}
              °C
            </div>
          )}

          {isSpecialMachine ? (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T Delta ={" "}
              {isGrainChilling
                ? data.Delta_T_set_point ||
                  data?.Th_T1 ||
                  data?.Delta_T_set_point_in_grain_chilling_mode ||
                  "N/A"
                : isPaddyChilling
                  ? data.Delta_T_set_point ||
                    data?.Th_T1 ||
                    data?.Delta_T_set_point_paddy_aeging_mode ||
                    "N/A"
                  : data.Delta_T_set_point ||
                    data?.Th_T1 ||
                    data?.Delta_T_set_point_in_grain_chilling_mode ||
                    data?.Delta_T_set_point_paddy_aeging_mode ||
                    "N/A"}
              °C
            </div>
          ) : machineName.includes("GTPL-061-gT-450T-S7-1200") ? (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              T0 - T1 ={" "}
              {data?.T0_T1_set_point ||
                data?.AIR_OUTLET_TEMP ||
                data?.COLD_AIR_TEMP_T1 ||
                data?.T1_temp_mean ||
                "N/A"}
              °C
            </div>
          ) : (
            <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
              TH - T1 ={" "}
              {data.AI_TH_Act || data?.Th_T1 || data?.TH_T1_set_point || "N/A"}
              °C
            </div>
          )}
        </div>
        {/* Main Content Container - Centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[1200px] h-[600px] bg-gray-100">
            {/* SVG Container for Silo and Lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{ zIndex: 1 }}
              viewBox="0 0 1200 600"
              preserveAspectRatio="none"
            >
              {/* Animated Flow Defs */}
              <defs>
                <style>
                  {`
                    @keyframes flowForward {
                      from { stroke-dashoffset: 24; }
                      to { stroke-dashoffset: 0; }
                    }
                    @keyframes flowReverse {
                      from { stroke-dashoffset: 0; }
                      to { stroke-dashoffset: 24; }
                    }
                    .flow-line {
                      stroke: #ef4444;
                      stroke-width: 3;
                      fill: none;
                      stroke-dasharray: 12, 12;
                    }
                    .flow-line.active {
                      animation: flowForward 1s linear infinite;
                    }
                    .flow-line.active-reverse {
                      animation: flowReverse 1s linear infinite;
                    }
                    .flow-line.inactive {
                      stroke: #9ca3af;
                      stroke-dasharray: none;
                      stroke-width: 2;
                    }
                  `}
                </style>
                {/* Silo metallic (galvanised) gradient */}
                <linearGradient id="siloGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#94a3b8" />
                  <stop offset="30%" stopColor="#f1f5f9" />
                  <stop offset="55%" stopColor="#cbd5e1" />
                  <stop offset="100%" stopColor="#64748b" />
                </linearGradient>
                <linearGradient id="siloCap" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="50%" stopColor="#e2e8f0" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>
              </defs>

              {/* Silo — galvanised corrugated grain bin (conical roof + legs) */}
              <g>
                {/* conical roof */}
                <polygon
                  points="120,94 66,134 174,134"
                  fill="url(#siloCap)"
                  stroke="#475569"
                  strokeWidth="2"
                />
                {/* roof ridge lines */}
                <line x1="120" y1="94" x2="86" y2="134" stroke="#94a3b8" strokeWidth="1" />
                <line x1="120" y1="94" x2="120" y2="134" stroke="#94a3b8" strokeWidth="1" />
                <line x1="120" y1="94" x2="154" y2="134" stroke="#94a3b8" strokeWidth="1" />
                {/* roof cap / vent */}
                <rect x="113" y="86" width="14" height="9" rx="2" fill="#475569" />
                {/* eave ring */}
                <rect x="63" y="132" width="114" height="7" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                {/* body */}
                <rect x="66" y="139" width="108" height="129" fill="url(#siloGrad)" stroke="#475569" strokeWidth="2" />
                {/* corrugation ribs */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                  <line
                    key={i}
                    x1="66"
                    y1={148 + i * 10}
                    x2="174"
                    y2={148 + i * 10}
                    stroke="#64748b"
                    strokeWidth="1"
                    opacity="0.6"
                  />
                ))}
                {/* vertical seams */}
                <line x1="102" y1="139" x2="102" y2="268" stroke="#64748b" strokeWidth="0.6" opacity="0.5" />
                <line x1="138" y1="139" x2="138" y2="268" stroke="#64748b" strokeWidth="0.6" opacity="0.5" />
                {/* left gloss highlight */}
                <rect x="78" y="141" width="5" height="125" fill="#ffffff" opacity="0.35" />
                {/* ladder */}
                <line x1="158" y1="139" x2="158" y2="266" stroke="#475569" strokeWidth="1" />
                <line x1="164" y1="139" x2="164" y2="266" stroke="#475569" strokeWidth="1" />
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <line key={`r${i}`} x1="158" y1={150 + i * 17} x2="164" y2={150 + i * 17} stroke="#475569" strokeWidth="1" />
                ))}
                {/* base skirt + legs */}
                <rect x="62" y="266" width="116" height="8" fill="#475569" />
                <line x1="74" y1="274" x2="70" y2="300" stroke="#334155" strokeWidth="4" />
                <line x1="120" y1="274" x2="120" y2="300" stroke="#334155" strokeWidth="4" />
                <line x1="166" y1="274" x2="170" y2="300" stroke="#334155" strokeWidth="4" />
                {/* outlet stub to pipe (right) */}
                <rect x="174" y="172" width="18" height="14" fill="#94a3b8" stroke="#475569" strokeWidth="1" rx="1" />
                <text
                  x="120"
                  y="316"
                  textAnchor="middle"
                  className="text-sm font-bold fill-gray-800"
                >
                  SILO
                </text>
              </g>

              {/* Animated Connecting Lines - Top horizontal (Silo to Condenser) */}
              <line
                x1="200"
                y1="120"
                x2="800"
                y2="120"
                className={`flow-line ${isCompressorOn ? "active" : "inactive"}`}
              />
              {/* Silo outlet to top line */}
              <line
                x1="170"
                y1="180"
                x2="200"
                y2="120"
                className={`flow-line ${isCompressorOn ? "active" : "inactive"}`}
              />

              {/* Vertical drops from main line to thermometers */}
              {!isSpecialMachine &&
                machineName !== "GTPL-061-gT-450T-S7-1200" && (
                  <line
                    x1="280"
                    y1="120"
                    x2="280"
                    y2="150"
                    className={`flow-line ${isCompressorOn ? "active-reverse" : "inactive"}`}
                  />
                )}
              {/* T0 vertical drop - hidden for S7-200 machines and E-series 30/115-120 (no T0 sensor) */}
              {!isS7200Machine && !isNoT0Machine && (
                <line
                  x1="380"
                  y1="120"
                  x2="380"
                  y2="150"
                  className={`flow-line ${isCompressorOn ? "active-reverse" : "inactive"}`}
                />
              )}
              <line
                x1="480"
                y1="120"
                x2="480"
                y2="150"
                className={`flow-line ${isCompressorOn ? "active-reverse" : "inactive"}`}
              />

              {/* Connection to blower - top */}
              <line
                x1="800"
                y1="120"
                x2="800"
                y2="150"
                className={`flow-line ${isCompressorOn ? "active-reverse" : "inactive"}`}
              />
              {/* Connection to blower - bottom */}
              <line
                x1="800"
                y1="500"
                x2="800"
                y2="380"
                className={`flow-line ${isCompressorOn ? "active" : "inactive"}`}
              />

              {/* Lower horizontal line for HTR units */}
              <line
                x1="170"
                y1="400"
                x2="600"
                y2="400"
                className={`flow-line ${isCompressorOn ? "active" : "inactive"}`}
              />
              {/* Left vertical line (silo bottom to lower horizontal) */}
              <line
                x1="170"
                y1="240"
                x2="170"
                y2="400"
                className={`flow-line ${isCompressorOn ? "active-reverse" : "inactive"}`}
              />

              {/* Line to compressor */}
              <line
                x1="600"
                y1="400"
                x2="750"
                y2="500"
                className={`flow-line ${isCompressorOn ? "active" : "inactive"}`}
              />
            </svg>

            {/* TH Thermometer */}
            {!isSpecialMachine &&
              machineName !== "GTPL-061-gT-450T-S7-1200" && (
                <div
                  className="absolute"
                  style={{ left: "255px", top: "150px" }}
                >
                  <Thermo
                    label="TH"
                    tint="#ef4444"
                    display={(() => {
                      if (data.AI_TH_Act !== undefined && data.AI_TH_Act !== null)
                        return formatValue(data.AI_TH_Act, "°C");
                      if (
                        data?.AFTER_HEATER_TEMP_Th !== undefined &&
                        data?.AFTER_HEATER_TEMP_Th !== null
                      )
                        return formatValue(data?.AFTER_HEATER_TEMP_Th, "°C");
                      if (
                        data?.TH_temp_mean !== undefined &&
                        data?.TH_temp_mean !== null
                      )
                        return formatValue(data?.TH_temp_mean, "°C");
                      return formatValue(undefined, "°C");
                    })()}
                  />
                </div>
              )}

            {/* T0 Thermometer - hidden for S7-200 machines and E-series 30/115-120 (no T0 sensor) */}
            {!isS7200Machine && !isNoT0Machine && (
              <div className="absolute" style={{ left: "355px", top: "150px" }}>
                <Thermo
                  label="T0"
                  tint="#2563eb"
                  display={(() => {
                    if (machineName.includes("GTPL-118-gT-60T-S7-200")) {
                      if (
                        data?.T0_set_point !== undefined &&
                        data?.T0_set_point !== null
                      )
                        return formatValue(data?.T0_set_point, "°C");
                      if (
                        data?.T1_set_point !== undefined &&
                        data?.T1_set_point !== null
                      )
                        return formatValue(data?.T1_set_point, "°C");
                      if (
                        data?.T0_temp_mean !== undefined &&
                        data?.T0_temp_mean !== null
                      )
                        return formatValue(data?.T0_temp_mean, "°C");
                      return formatValue(undefined, "°C");
                    }
                    if (
                      data.AIR_OUTLET_TEMP !== undefined &&
                      data.AIR_OUTLET_TEMP !== null
                    )
                      return formatValue(data.AIR_OUTLET_TEMP, "°C");
                    if (
                      data?.T0_temp_mean !== undefined &&
                      data?.T0_temp_mean !== null
                    )
                      return formatValue(data?.T0_temp_mean, "°C");
                    return formatValue(undefined, "°C");
                  })()}
                />
              </div>
            )}

            {/* T1 Thermometer */}
            <div className="absolute" style={{ left: "455px", top: "150px" }}>
              <Thermo
                label="T1"
                tint="#0891b2"
                display={(() => {
                  if (
                    data?.COLD_AIR_TEMP_T1 !== undefined &&
                    data?.COLD_AIR_TEMP_T1 !== null
                  )
                    return formatValue(data?.COLD_AIR_TEMP_T1, "°C");
                  if (
                    data?.T1_temp_mean !== undefined &&
                    data?.T1_temp_mean !== null
                  )
                    return formatValue(data?.T1_temp_mean, "°C");
                  return formatValue(undefined, "°C");
                })()}
              />
            </div>

            {/* T2 Temperature Display */}
            <div
              className="absolute text-center"
              style={{ left: "560px", top: "150px" }}
            >
              <Thermo
                label="T2"
                tint="#16a34a"
                display={(() => {
                  if (
                    data?.T2_temp_mean !== undefined &&
                    data?.T2_temp_mean !== null
                  )
                    return formatValue(data?.T2_temp_mean, "°C");
                  if (
                    data?.AMBIENT_AIR_TEMP_T2 !== undefined &&
                    data?.AMBIENT_AIR_TEMP_T2 !== null
                  )
                    return formatValue(data?.AMBIENT_AIR_TEMP_T2, "°C");
                  return formatValue(undefined, "°C");
                })()}
              />
            </div>

            {/* HTR Units */}
            <div
              className={`absolute flex items-start z-10 ${
                isS7200Machine && isHTRMachine
                  ? "left-[260px] gap-[150px]"
                  : isHTRMachine
                    ? "left-[350px] gap-14"
                    : "left-[255px] gap-14"
              }`}
              style={{ top: "360px" }}
            >
              {!isHTRMachine && (
                <ValveUnit
                  label="HTR"
                  display={(() => {
                    if (
                      data.Value_to_Display_HEATER !== undefined &&
                      data.Value_to_Display_HEATER !== null
                    )
                      return formatValue(data.Value_to_Display_HEATER, "%");
                    if (
                      data?.Heater_speed !== undefined &&
                      data?.Heater_speed !== null
                    )
                      return formatValue(data?.Heater_speed, "%");
                    return formatValue(undefined, "%");
                  })()}
                />
              )}
              <ValveUnit
                label="AHT"
                display={(() => {
                  if (
                    data?.AHT_vale_speed !== undefined &&
                    data?.AHT_vale_speed !== null
                  )
                    return formatValue(data?.AHT_vale_speed, "%");
                  if (
                    data.Value_to_Display_AHT_VALE_OPEN !== undefined &&
                    data.Value_to_Display_AHT_VALE_OPEN !== null
                  )
                    return formatValue(data.Value_to_Display_AHT_VALE_OPEN, "%");
                  if (
                    data.AFTER_HEAT_VALVE_RPM !== undefined &&
                    data.AFTER_HEAT_VALVE_RPM !== null
                  )
                    return formatValue(data.AFTER_HEAT_VALVE_RPM, "%");
                  if (
                    data?.AHT_valve_speed !== undefined &&
                    data?.AHT_valve_speed !== null
                  )
                    return formatValue(data?.AHT_valve_speed, "%");
                  return formatValue(undefined, "%");
                })()}
              />
              <ValveUnit
                label="HGS"
                display={(() => {
                  if (
                    data.Value_to_Display_HOT_GAS_VALVE_OPEN !== undefined &&
                    data.Value_to_Display_HOT_GAS_VALVE_OPEN !== null
                  )
                    return formatValue(data.Value_to_Display_HOT_GAS_VALVE_OPEN, "%");
                  if (
                    data?.HOT_GAS_VALVE_RPM !== undefined &&
                    data?.HOT_GAS_VALVE_RPM !== null
                  )
                    return formatValue(data?.HOT_GAS_VALVE_RPM, "%");
                  if (
                    data?.Hot_valve_speed !== undefined &&
                    data?.Hot_valve_speed !== null
                  )
                    return formatValue(data?.Hot_valve_speed, "%");
                  return formatValue(undefined, "%");
                })()}
              />
            </div>

            {/* Blower Unit */}
            <div className="absolute" style={{ left: "730px", top: "470px" }}>
              <div className="text-black px-4 py-2 text-center rounded">
                {/* Industrial centrifugal (scroll) blower — 3D shaded */}
                <img
                  src={isBlowerOn ? "/blower%20on.jpeg" : "/blower%20off.jpeg"}
                  alt="Blower"
                  className="mx-auto"
                  style={{
                    width: 78,
                    height: 78,
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                    transformOrigin: "center",
                    animation: isBlowerOn
                      ? "acWobble 0.35s ease-in-out infinite"
                      : "none",
                    filter: isBlowerOn
                      ? "drop-shadow(0 0 5px rgba(34,197,94,0.55))"
                      : "none",
                  }}
                />
                <div className="text-xs font-bold mt-1">BLOWER</div>
                <div className="text-sm font-bold">
                  {(() => {
                    // Handle zero values correctly
                    if (
                      data?.Blower_speed !== undefined &&
                      data?.Blower_speed !== null
                    )
                      return formatValue(data?.Blower_speed, "%");
                    if (
                      data?.BLOWER_RPM !== undefined &&
                      data?.BLOWER_RPM !== null
                    )
                      return formatValue(data?.BLOWER_RPM, "%");
                    if (
                      data?.Value_to_Display_BLOWER !== undefined &&
                      data?.Value_to_Display_BLOWER !== null
                    )
                      return formatValue(data?.Value_to_Display_BLOWER, "%");
                    return formatValue(undefined, "%");
                  })()}
                </div>
              </div>
            </div>

            {/* Condenser Fan */}
            <div className="absolute" style={{ left: "780px", top: "150px" }}>
              {/* Finned condenser coil + mounted fans (reference style) */}
              <div className="relative flex items-start gap-2">
                {/* run status LED */}
                <div className="absolute -top-3 right-0 z-10">
                  <div
                    className={`w-3 h-3 rounded-full border border-slate-600 ${
                      isCondenserFanOn ? "bg-green-500" : "bg-red-500"
                    }`}
                  ></div>
                </div>

                {/* finned condenser coil (heat exchanger) */}
                <svg width="42" height="150" viewBox="0 0 42 150">
                  <defs>
                    <linearGradient id="coilG" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="45%" stopColor="#e2e8f0" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                    <pattern
                      id="coilHatch"
                      width="9"
                      height="9"
                      patternUnits="userSpaceOnUse"
                      patternTransform="rotate(45)"
                    >
                      <line x1="0" y1="0" x2="0" y2="9" stroke="#475569" strokeWidth="1" opacity="0.45" />
                    </pattern>
                  </defs>
                  {/* coil body + fin hatch */}
                  <rect x="4" y="8" width="34" height="134" rx="3" fill="url(#coilG)" stroke="#334155" strokeWidth="1.5" />
                  <rect x="4" y="8" width="34" height="134" rx="3" fill="url(#coilHatch)" />
                  {/* top / bottom manifolds */}
                  <rect x="2" y="3" width="38" height="7" rx="2" fill="#475569" />
                  <rect x="2" y="140" width="38" height="7" rx="2" fill="#475569" />
                  {/* header pipes */}
                  <rect x="18" y="0" width="6" height="4" fill="#334155" />
                  <rect x="18" y="146" width="6" height="4" fill="#334155" />
                </svg>

                {/* Animated fans in recessed mounts (2/4/6/1) */}
                <div
                  className="grid gap-2"
                  style={{
                    gridTemplateColumns:
                      fanCount >= 4 ? "repeat(2, 1fr)" : "repeat(1, 1fr)",
                  }}
                >
                  {Array.from({ length: fanCount }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 38% 32%, #475569, #0f172a)",
                        padding: "3px",
                        boxShadow: "inset 0 2px 6px rgba(0,0,0,0.75)",
                      }}
                    >
                      <FanSVG
                        size={fanCount >= 4 ? 44 : 58}
                        spinning={condFanOn(i + 1)}
                        duration={condPct > 0 ? spinDur(condPct) : "1.1s"}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -bottom-12 left-20 transform -translate-x-1/2 text-center">
                <div className="text-xs font-bold">Condensor</div>
                <div className="text-xs">
                  {(() => {
                    // Handle zero values correctly
                    if (
                      data?.Cond_fan_speed !== undefined &&
                      data?.Cond_fan_speed !== null
                    )
                      return formatValue(data?.Cond_fan_speed, "%");
                    if (
                      data?.Value_to_Display_COND_ACT_SPEED !== undefined &&
                      data?.Value_to_Display_COND_ACT_SPEED !== null
                    )
                      return formatValue(
                        data?.Value_to_Display_COND_ACT_SPEED,
                        "%",
                      );
                    if (
                      data?.CONDENSER_RPM !== undefined &&
                      data?.CONDENSER_RPM !== null
                    )
                      return formatValue(data?.CONDENSER_RPM, "%");
                    if (
                      data?.Condenser_fan_speed !== undefined &&
                      data?.Condenser_fan_speed !== null
                    )
                      return formatValue(data?.Condenser_fan_speed, "%");
                    return formatValue(undefined, "%");
                  })()}
                </div>
              </div>
            </div>

            {/* Compressor Unit */}
            <div className="absolute" style={{ left: "840px", top: "470px" }}>
              <div
                className="w-24 h-16 rounded relative"
                style={{
                  transformOrigin: "center",
                  animation: isCompressorOn
                    ? "acWobble 0.25s ease-in-out infinite"
                    : "none",
                }}
              >
                {/* Industrial reciprocating compressor image */}
                <img
                  src="/compressor%20off.jpeg"
                  alt="Compressor"
                  style={{
                    width: 100,
                    objectFit: "contain",
                    mixBlendMode: "multiply",
                    filter: isCompressorOn
                      ? "sepia(1) hue-rotate(65deg) saturate(3.2) brightness(1.05) drop-shadow(0 0 6px rgba(34,197,94,0.7))"
                      : "grayscale(0.15)",
                  }}
                />
              </div>
              <div className="absolute -bottom-8 bg-red-600 text-white px-2 py-1 text-center rounded text-xs left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <div className="font-bold">
                  <span className="flex items-center gap-1">
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isCompressorOn ? "bg-green-500" : "bg-red-500"
                      } shadow-sm`}
                    />
                    {isCompressorOn ? "ON" : "OFF"}
                  </span>
                </div>
              </div>
            </div>

            {/* Pressure Readings */}
            <div
              className="absolute flex gap-2 z-10"
              style={{ left: "965px", top: "500px" }}
            >
              <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                LP
                <br />
                {(() => {
                  const isBarMachine =
                    machineName === "GTPL-137-gT-450T-S7-1200" ||
                    machineName === "GTPL-138-gT-450T-S7-1200";

                  if (isBarMachine) {
                    if (
                      data.AI_SUC_PRESSURE !== undefined &&
                      data.AI_SUC_PRESSURE !== null
                    )
                      return formatValue(data.AI_SUC_PRESSURE, " bar");
                    if (data?.LP !== undefined && data?.LP !== null)
                      return formatValue(data?.LP, " bar");
                    if (data?.LP_value !== undefined && data?.LP_value !== null)
                      return formatValue(data?.LP_value, " bar");
                    return formatValue(undefined, " bar");
                  }

                  if (
                    data.AI_SUC_PRESSURE !== undefined &&
                    data.AI_SUC_PRESSURE !== null
                  )
                    return formatValue(data.AI_SUC_PRESSURE);
                  if (data?.LP !== undefined && data?.LP !== null)
                    return formatValue(data?.LP);
                  if (data?.LP_value !== undefined && data?.LP_value !== null)
                    return formatValue(data?.LP_value);
                  return formatValue(undefined);
                })()}
              </div>
              <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                HP
                <br />
                {(() => {
                  const isBarMachine =
                    machineName === "GTPL-137-gT-450T-S7-1200" ||
                    machineName === "GTPL-138-gT-450T-S7-1200";

                  if (isBarMachine) {
                    if (
                      data.AI_COND_PRESSURE !== undefined &&
                      data.AI_COND_PRESSURE !== null
                    )
                      return formatValue(data.AI_COND_PRESSURE, " bar");
                    if (data?.HP !== undefined && data?.HP !== null)
                      return formatValue(data?.HP, " bar");
                    if (
                      data?.COMPRESSOR_TIME !== undefined &&
                      data?.COMPRESSOR_TIME !== null
                    )
                      return formatValue(data?.COMPRESSOR_TIME, " bar");
                    if (data?.HP_value !== undefined && data?.HP_value !== null)
                      return formatValue(data?.HP_value, " bar");
                    if (
                      data?.Compressor_timer !== undefined &&
                      data?.Compressor_timer !== null
                    )
                      return formatValue(data?.Compressor_timer, " bar");
                    return formatValue(undefined, " bar");
                  }

                  if (
                    data.AI_COND_PRESSURE !== undefined &&
                    data.AI_COND_PRESSURE !== null
                  )
                    return formatValue(data.AI_COND_PRESSURE);
                  if (data?.HP !== undefined && data?.HP !== null)
                    return formatValue(data?.HP);
                  if (
                    data?.COMPRESSOR_TIME !== undefined &&
                    data?.COMPRESSOR_TIME !== null
                  )
                    return formatValue(data?.COMPRESSOR_TIME);
                  if (data?.HP_value !== undefined && data?.HP_value !== null)
                    return formatValue(data?.HP_value);
                  if (
                    data?.Compressor_timer !== undefined &&
                    data?.Compressor_timer !== null
                  )
                    return formatValue(data?.Compressor_timer);
                  return formatValue(undefined);
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
