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
//             "GTPL-124-GT-450T-S7-1200",
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
//             "GTPL-124-GT-450T-S7-1200",

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
//                 "GTPL-124-GT-450T-S7-1200",
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
//               "GTPL-124-GT-450T-S7-1200",
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
//                   "GTPL-124-GT-450T-S7-1200",
//                   "GTPL-118-gT-80E-P-S7-200",
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
//                 "GTPL-124-GT-450T-S7-1200",
//                 "GTPL-118-gT-80E-P-S7-200",
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
//                 {machineName.includes("GTPL-124-GT-450T-S7-1200") ? (
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

import { useEffect, useState } from "react";

export default function AutoDiagram1({
  blower,
  data,
  formatValue,
  machineName,
}: any) {
  const pathname = usePathname();
  const isGrainChilling = pathname.includes("auto-grain");
  const isPaddyChilling = pathname.includes("auto-paddy");
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
    'Chiller_healthy_Q1_1'
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
    'Chiller_fault_Q2_3'
  ];

  // Yellow light conditions
  const yellowLightFields = [
    "YELLOW_LIGHT",
    "System_warnning_(Q1.0)",
    "Collective_Trouble_Signal_on_Q2_1",
    "Collective_Trouble_Signal_on",
    "Collective_Trouble_Signal",
    "Collective_trouble_signal_Q1_0",
  ];

  // Check conditions
  const greenOn = greenLightFields.some((field) => isTrueValue(data?.[field]));
  const redOn = redLightFields.some((field) => isTrueValue(data?.[field]));
  const yellowOn = yellowLightFields.some((field) =>
    isTrueValue(data?.[field])
  );

  // Helper for lamp color
  const lampColor = (on: boolean, color: string) => (on ? color : "#d1d5db");

  const isCompressorOn =
    data?.COMPRESSOR_ON === "tr" ||
    data?.Compressor_on_Q0_4 === "True" ||
    data?.Compressor_start === "True" ||
    data?.COMPRESSOR_ON === "True" || data?.Compressor_on_Q0_0 === "True" || data?.Compressor_start_Q0_0 === "true"

  const isSpecialMachine = [
    "GTPL-122-gT-1000T-S7-1200",
    "GTPL-121-gT-1000T-S7-1200",
    "GTPL-124-GT-450T-S7-1200",
    "GTPL-137-GT-450T-S7-1200",
    "GTPL-138-GT-450T-S7-1200",
    "GTPL-136-gT-450AP",
    "GTPL-132-300-AP-S7-1200",
    "GTPL-142-gT-450AP-S7-1200",
    "GTPL-123-GT-450AP",
    "GTPL-143-gT-450AP-S7-1200",
    "GTPL-134-gT-450T-S7-1200",
    "GTPL-135-gT-450T-S7-1200",
    "GTPL-133-GT-650T-S7-1200"
    // "GTPL-061-gT-450T-S7-1200",
  ].some((name) => machineName.includes(name));

  const isHTRMachine = [
    "GTPL-122-gT-1000T-S7-1200",
    "GTPL-121-gT-1000T-S7-1200",
    "GTPL-124-GT-450T-S7-1200",
    "GTPL-118-gT-80E-P-S7-200",
    "GTPL-108-gT-40E-P-S7-200",
    "GTPL-109-gT-40E-P-S7-200",
    "GTPL-110-gT-40E-P-S7-200",
    "GTPL-111-gT-80E-P-S7-200",
    "GTPL-112-gT-80E-P-S7-200",
    "GTPL-113-gT-80E-P-S7-200",
    "GTPL-132-300-AP-S7-1200",
    "GTPL-142-gT-450AP-S7-1200",
    "GTPL-123-GT-450AP",
    "GTPL-143-gT-450AP-S7-1200",
    "GTPL-137-GT-450T-S7-1200",
    "GTPL-138-GT-450T-S7-1200",
    "GTPL-136-gT-450AP",
    "GTPL-134-gT-450T-S7-1200",
    "GTPL-135-gT-450T-S7-1200",
    "GTPL-061-gT-450T-S7-1200",
    'GTPL-133-GT-650T-S7-1200'


  ].some((name) => machineName.includes(name));


  const isBlowerOn = !!(
    data?.Blower_speed || data?.BLOWER_RPM || data?.Value_to_Display_BLOWER
  );

  const isCondFanOn = !!(
    data?.Cond_fan_speed || data?.Value_to_Display_COND_ACT_SPEED || data?.CONDENSER_RPM || data?.Condenser_fan_speed
  );

  return (
    <div className="w-full h-screen bg-gray-100 overflow-auto">
      {/* 3D Animation Keyframes */}
      <style>{`
        @keyframes spin3d {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes compressorPulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.92); }
        }
        @keyframes compressorShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-1px); }
          75% { transform: translateX(1px); }
        }
        @keyframes grainFlow {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
        @keyframes pipePulse {
          0%, 100% { stroke-opacity: 0.6; }
          50% { stroke-opacity: 1; }
        }
      `}</style>
      {/* Container with fixed aspect ratio */}
      <div className="relative w-full h-full min-w-[1200px] min-h-[800px]">
        {/* 3D Status Indicator Lights */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 -translate-x-48 flex gap-5 items-center z-10">
          {[
            { on: greenOn, color: "#10b981", glow: "rgba(16,185,129,0.6)", label: "Green" },
            { on: redOn, color: "#ef4444", glow: "rgba(239,68,68,0.6)", label: "Red" },
            { on: yellowOn, color: "#eab308", glow: "rgba(234,179,8,0.6)", label: "Yellow" },
          ].map((lamp) => (
            <div key={lamp.label} className="flex flex-col items-center">
              <div
                className="w-9 h-9 rounded-full"
                style={{
                  background: lamp.on
                    ? `radial-gradient(circle at 35% 35%, ${lamp.color}99, ${lamp.color})`
                    : "radial-gradient(circle at 35% 35%, #e5e7eb, #9ca3af)",
                  border: "2px solid #4b5563",
                  boxShadow: lamp.on
                    ? `0 0 12px ${lamp.glow}, inset 0 -3px 6px rgba(0,0,0,0.2), inset 0 2px 4px rgba(255,255,255,0.3)`
                    : "inset 0 -3px 6px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.2)",
                }}
              />
              <span className="text-xs mt-1 font-medium text-gray-600">{lamp.label}</span>
            </div>
          ))}
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
       data?.T1_SET_POINT || "N/A"}°C
    </div>
  ) : isSpecialMachine ? (
    <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
      T0 ={" "}
      {isGrainChilling
        ? data?.T0_set_point ||
          data?.AIR_OUTLET_TEMP ||
          data?.T1_set_point_in_grain_chilling_mode || 
          data?.T0_set_point_in_grain_chilling_mode || "N/A"
        : isPaddyChilling
          ? data?.T0_set_point ||
            data?.AIR_OUTLET_TEMP ||
            data?.T1_set_point_in_paddy_aeging_mode || 
            data?.T0_set_point_in_paddy_aeging_mode || "N/A"
          : data?.T0_set_point ||
            data?.AIR_OUTLET_TEMP ||
            data?.T1_set_point_in_paddy_aeging_mode || 
            data?.T0_temp_mean || "N/A"}°C
    </div>
  ) : (
    <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
      T1 ={" "}
      {data?.T1_set_point ||
       data?.T1_temp_mean ||
       data?.T1_SET_POINT ||
       data?.Delta_T_set_point_paddy_aeging_mode || "N/A"}°C
    </div>
  )}

  {isSpecialMachine ? (
    <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
      T Delta ={" "}
      {isGrainChilling
        ? data.Delta_T_set_point ||
          data?.Th_T1 ||
          data?.Delta_T_set_point_in_grain_chilling_mode || "N/A"
        : isPaddyChilling
          ? data.Delta_T_set_point ||
            data?.Th_T1 ||
            data?.Delta_T_set_point_paddy_aeging_mode || "N/A"
          : data.Delta_T_set_point ||
            data?.Th_T1 ||
            data?.Delta_T_set_point_in_grain_chilling_mode ||
            data?.Delta_T_set_point_paddy_aeging_mode || "N/A"}°C
    </div>
  ) : machineName.includes("GTPL-061-gT-450T-S7-1200") ? (
    <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
      T0 - T1 ={" "}
      {data?.T0_T1_set_point || 
       data?.AIR_OUTLET_TEMP || 
       data?.COLD_AIR_TEMP_T1 || 
       data?.T1_temp_mean || "N/A"}°C
    </div>
  ) : (
    <div className="bg-orange-400 text-white px-4 py-2 rounded text-sm font-bold">
      TH - T1 ={" "}
      {data.AI_TH_Act || 
       data?.Th_T1 || 
       data?.TH_T1_set_point || "N/A"}°C
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
              {/* 3D Silo */}
              <defs>
                <linearGradient id="siloBodyGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6ee7b7" />
                  <stop offset="30%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="70%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#047857" />
                </linearGradient>
                <linearGradient id="siloTopGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a7f3d0" />
                  <stop offset="100%" stopColor="#34d399" />
                </linearGradient>
                <linearGradient id="siloBotGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" />
                  <stop offset="100%" stopColor="#065f46" />
                </linearGradient>
                <linearGradient id="siloOutletGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#9ca3af" />
                  <stop offset="50%" stopColor="#6b7280" />
                  <stop offset="100%" stopColor="#4b5563" />
                </linearGradient>
                <filter id="siloShadow">
                  <feDropShadow dx="3" dy="3" stdDeviation="3" floodColor="#00000033" />
                </filter>
                {/* 3D Pipe gradients */}
                <linearGradient id="pipeHorizGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b0b0b0" />
                  <stop offset="20%" stopColor="#e0e0e0" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="80%" stopColor="#c0c0c0" />
                  <stop offset="100%" stopColor="#808080" />
                </linearGradient>
                <linearGradient id="pipeVertGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#b0b0b0" />
                  <stop offset="20%" stopColor="#e0e0e0" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="80%" stopColor="#c0c0c0" />
                  <stop offset="100%" stopColor="#808080" />
                </linearGradient>
                <linearGradient id="pipeDiagGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#c0c0c0" />
                  <stop offset="30%" stopColor="#e8e8e8" />
                  <stop offset="60%" stopColor="#d0d0d0" />
                  <stop offset="100%" stopColor="#909090" />
                </linearGradient>
                <filter id="pipeShadow">
                  <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#00000030" />
                </filter>
                {/* Pipe joint circle */}
                <radialGradient id="jointGrad">
                  <stop offset="0%" stopColor="#e0e0e0" />
                  <stop offset="50%" stopColor="#a0a0a0" />
                  <stop offset="100%" stopColor="#707070" />
                </radialGradient>
              </defs>
              <g filter="url(#siloShadow)">
                {/* Silo body - 3D cylinder */}
                <rect
                  x="70"
                  y="120"
                  width="100"
                  height="150"
                  fill="url(#siloBodyGrad)"
                  stroke="#047857"
                  strokeWidth="2"
                  rx="2"
                />
                {/* Silo top cap - 3D ellipse */}
                <ellipse
                  cx="120"
                  cy="120"
                  rx="50"
                  ry="20"
                  fill="url(#siloTopGrad)"
                  stroke="#047857"
                  strokeWidth="2"
                />
                {/* Inner top highlight */}
                <ellipse
                  cx="115"
                  cy="118"
                  rx="30"
                  ry="10"
                  fill="white"
                  opacity="0.15"
                />
                {/* Silo bottom cap */}
                <ellipse
                  cx="120"
                  cy="270"
                  rx="50"
                  ry="20"
                  fill="url(#siloBotGrad)"
                  stroke="#047857"
                  strokeWidth="2"
                />
                {/* Vertical highlight strip for 3D depth */}
                <rect
                  x="85"
                  y="122"
                  width="8"
                  height="146"
                  fill="white"
                  opacity="0.12"
                  rx="4"
                />

                {/* Grain level lines with animation */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
                  <line
                    key={i}
                    x1="74"
                    y1={132 + i * 12}
                    x2="166"
                    y2={132 + i * 12}
                    stroke="#065f46"
                    strokeWidth="1"
                    opacity="0.4"
                    style={{ animation: `grainFlow ${2 + i * 0.3}s ease-in-out infinite` }}
                  />
                ))}

                {/* 3D Silo outlet pipe */}
                <rect
                  x="113"
                  y="270"
                  width="14"
                  height="28"
                  fill="url(#siloOutletGrad)"
                  stroke="#4b5563"
                  strokeWidth="1.5"
                  rx="2"
                />
                {/* Outlet pipe highlight */}
                <rect
                  x="115"
                  y="272"
                  width="3"
                  height="24"
                  fill="white"
                  opacity="0.2"
                  rx="1"
                />

                {/* Silo label with background */}
                <rect x="95" y="306" width="50" height="18" fill="#065f46" rx="3" opacity="0.9" />
                <text
                  x="120"
                  y="319"
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="bold"
                >
                  SILO
                </text>
              </g>

              {/* ===== 3D Connecting Pipes ===== */}

              {/* Main horizontal pipe: silo to condenser */}
              <g filter="url(#pipeShadow)">
                <rect x="200" y="115" width="600" height="10" rx="3" fill="url(#pipeHorizGrad)" stroke="#6b7280" strokeWidth="0.8" />
              </g>
              {/* Joint at silo end */}
              <circle cx="200" cy="120" r="7" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="1" />
              {/* Joint at condenser end */}
              <circle cx="800" cy="120" r="7" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="1" />

              {/* Diagonal pipe: silo outlet to main line */}
              <g filter="url(#pipeShadow)">
                <line x1="170" y1="180" x2="200" y2="120" stroke="url(#pipeDiagGrad)" strokeWidth="10" strokeLinecap="round" />
                <line x1="170" y1="180" x2="200" y2="120" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
              </g>
              <circle cx="170" cy="180" r="6" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="1" />

              {/* Vertical drops from main line to thermometers */}
              {!isSpecialMachine && machineName !== "GTPL-061-gT-450T-S7-1200" && (
                <g filter="url(#pipeShadow)">
                  <rect x="275" y="120" width="10" height="30" rx="3" fill="url(#pipeVertGrad)" stroke="#6b7280" strokeWidth="0.8" />
                  <circle cx="280" cy="120" r="5" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="0.8" />
                  <circle cx="280" cy="150" r="5" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="0.8" />
                </g>
              )}
              <g filter="url(#pipeShadow)">
                <rect x="375" y="120" width="10" height="30" rx="3" fill="url(#pipeVertGrad)" stroke="#6b7280" strokeWidth="0.8" />
                <circle cx="380" cy="120" r="5" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="0.8" />
                <circle cx="380" cy="150" r="5" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="0.8" />
              </g>
              <g filter="url(#pipeShadow)">
                <rect x="475" y="120" width="10" height="30" rx="3" fill="url(#pipeVertGrad)" stroke="#6b7280" strokeWidth="0.8" />
                <circle cx="480" cy="120" r="5" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="0.8" />
                <circle cx="480" cy="150" r="5" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="0.8" />
              </g>

              {/* Vertical pipe: condenser down to blower top */}
              <g filter="url(#pipeShadow)">
                <rect x="795" y="120" width="10" height="30" rx="3" fill="url(#pipeVertGrad)" stroke="#6b7280" strokeWidth="0.8" />
                <circle cx="800" cy="150" r="5" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="0.8" />
              </g>
              {/* Vertical pipe: blower bottom connection */}
              <g filter="url(#pipeShadow)">
                <rect x="795" y="380" width="10" height="120" rx="3" fill="url(#pipeVertGrad)" stroke="#6b7280" strokeWidth="0.8" />
                <circle cx="800" cy="380" r="6" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="1" />
                <circle cx="800" cy="500" r="6" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="1" />
              </g>

              {/* Lower horizontal pipe for HTR units */}
              <g filter="url(#pipeShadow)">
                <rect x="170" y="395" width="430" height="10" rx="3" fill="url(#pipeHorizGrad)" stroke="#6b7280" strokeWidth="0.8" />
              </g>
              <circle cx="170" cy="400" r="6" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="1" />
              <circle cx="600" cy="400" r="6" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="1" />

              {/* Vertical pipe: silo bottom to lower horizontal */}
              <g filter="url(#pipeShadow)">
                <rect x="165" y="240" width="10" height="160" rx="3" fill="url(#pipeVertGrad)" stroke="#6b7280" strokeWidth="0.8" />
                <circle cx="170" cy="240" r="5" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="0.8" />
              </g>

              {/* Diagonal pipe: HTR line to compressor */}
              <g filter="url(#pipeShadow)">
                <line x1="600" y1="400" x2="750" y2="500" stroke="url(#pipeDiagGrad)" strokeWidth="10" strokeLinecap="round" />
                <line x1="600" y1="400" x2="750" y2="500" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
              </g>
              <circle cx="750" cy="500" r="6" fill="url(#jointGrad)" stroke="#6b7280" strokeWidth="1" />

              {/* ===== Gas Flow Animations ===== */}

              {/* FLOW 1: Silo -> Condenser (top pipe, left to right) */}
              {/* Path: Silo top (170,180) -> diagonal up (200,120) -> right along top pipe -> down to condenser (800,150) */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <circle key={`sc-${i}`} r="4" fill="#3b82f6" opacity="0.85">
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    begin={`${i * 0.5}s`}
                    path="M 170,180 L 200,120 L 800,120 L 800,150"
                  />
                  <animate attributeName="r" values="3;5;3" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1.5s" repeatCount="indefinite" />
                </circle>
              ))}
              {/* Glow trail: Silo -> Condenser */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <circle key={`sc-glow-${i}`} r="8" fill="#60a5fa" opacity="0.2">
                  <animateMotion
                    dur="4s"
                    repeatCount="indefinite"
                    begin={`${i * 0.5}s`}
                    path="M 170,180 L 200,120 L 800,120 L 800,150"
                  />
                </circle>
              ))}

              {/* FLOW 2: Blower -> Silo (bottom pipe, right to left) */}
              {/* Path: Blower (800,380) -> down to compressor (800,500) -> diagonal (750,500 -> 600,400) -> left along bottom pipe -> up to silo (170,240) */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <circle key={`bs-${i}`} r="4" fill="#f97316" opacity="0.85">
                  <animateMotion
                    dur="5s"
                    repeatCount="indefinite"
                    begin={`${i * 0.625}s`}
                    path="M 800,380 L 800,500 L 750,500 L 600,400 L 170,400 L 170,240"
                  />
                  <animate attributeName="r" values="3;5;3" dur="1.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1.8s" repeatCount="indefinite" />
                </circle>
              ))}
              {/* Glow trail: Blower -> Silo */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <circle key={`bs-glow-${i}`} r="8" fill="#fb923c" opacity="0.2">
                  <animateMotion
                    dur="5s"
                    repeatCount="indefinite"
                    begin={`${i * 0.625}s`}
                    path="M 800,380 L 800,500 L 750,500 L 600,400 L 170,400 L 170,240"
                  />
                </circle>
              ))}

              {/* Flow direction arrows: top pipe (Silo -> Condenser, left to right) */}
              {[0, 1, 2].map((i) => (
                <polygon key={`arrow-top-${i}`} points="0,-5 10,0 0,5" fill="#3b82f6" opacity="0.6">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${i * 1}s`}
                    path="M 250,120 L 750,120"
                  />
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" />
                </polygon>
              ))}
              {/* Flow direction arrows: bottom pipe (Blower -> Silo, right to left) */}
              {[0, 1, 2].map((i) => (
                <polygon key={`arrow-bot-${i}`} points="0,-5 -10,0 0,5" fill="#f97316" opacity="0.6">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    begin={`${i * 1}s`}
                    path="M 570,400 L 200,400"
                  />
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="1.5s" repeatCount="indefinite" />
                </polygon>
              ))}

            </svg>

            {/* 3D TH Thermometer */}
            {!isSpecialMachine && machineName !== "GTPL-061-gT-450T-S7-1200" && (
              <div className="absolute" style={{ left: "254px", top: "148px" }}>
                <div className="w-[56px] h-[244px] relative rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, #fecdd3 0%, #fda4af 25%, #fb7185 50%, #f43f5e 75%, #e11d48 100%)",
                    boxShadow: "4px 4px 12px rgba(0,0,0,0.25), inset 1px 1px 4px rgba(255,255,255,0.4), inset -2px -2px 6px rgba(0,0,0,0.15)",
                    border: "2px solid #be123c",
                  }}
                >
                  {/* Glass highlight */}
                  <div className="absolute top-0 left-0 w-[40%] h-full rounded-l-2xl"
                    style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 100%)" }}
                  />
                  {/* Mercury column */}
                  <div className="absolute bottom-2 left-[35%] w-[30%] rounded-full"
                    style={{
                      height: "65%",
                      background: "linear-gradient(90deg, #dc2626, #ef4444 40%, #fca5a5 60%, #ef4444 80%, #dc2626)",
                      boxShadow: "0 0 8px rgba(239,68,68,0.5)",
                    }}
                  />
                  {/* Mercury bulb */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, #fca5a5, #ef4444 50%, #dc2626)",
                      boxShadow: "0 0 10px rgba(239,68,68,0.6), inset 1px 1px 3px rgba(255,255,255,0.3)",
                    }}
                  />
                  {/* Scale marks */}
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="absolute right-1 h-[1px] w-3"
                      style={{ top: `${30 + i * 22}px`, background: "rgba(255,255,255,0.4)" }}
                    />
                  ))}
                  {/* Label */}
                  <div className="absolute top-2 left-0 right-0 text-center">
                    <span className="text-[11px] font-extrabold text-white drop-shadow-md">TH</span>
                  </div>
                  {/* Value */}
                  <div className="absolute top-8 left-0 right-0 text-center">
                    <span className="text-[10px] font-bold text-white drop-shadow-sm">
                      {(() => {
                        if (data.AI_TH_Act !== undefined && data.AI_TH_Act !== null) return formatValue(data.AI_TH_Act, "°C");
                        if (data?.AFTER_HEATER_TEMP_Th !== undefined && data?.AFTER_HEATER_TEMP_Th !== null) return formatValue(data?.AFTER_HEATER_TEMP_Th, "°C");
                        if (data?.TH_temp_mean !== undefined && data?.TH_temp_mean !== null) return formatValue(data?.TH_temp_mean, "°C");
                        return formatValue(undefined, "°C");
                      })()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 3D T0 Thermometer */}
            <div className="absolute" style={{ left: "354px", top: "148px" }}>
              <div className="w-[56px] h-[244px] relative rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #bfdbfe 0%, #93c5fd 25%, #60a5fa 50%, #3b82f6 75%, #2563eb 100%)",
                  boxShadow: "4px 4px 12px rgba(0,0,0,0.25), inset 1px 1px 4px rgba(255,255,255,0.4), inset -2px -2px 6px rgba(0,0,0,0.15)",
                  border: "2px solid #1d4ed8",
                }}
              >
                {/* Glass highlight */}
                <div className="absolute top-0 left-0 w-[40%] h-full rounded-l-2xl"
                  style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 100%)" }}
                />
                {/* Mercury column */}
                <div className="absolute bottom-2 left-[35%] w-[30%] rounded-full"
                  style={{
                    height: "55%",
                    background: "linear-gradient(90deg, #1d4ed8, #3b82f6 40%, #93c5fd 60%, #3b82f6 80%, #1d4ed8)",
                    boxShadow: "0 0 8px rgba(59,130,246,0.5)",
                  }}
                />
                {/* Mercury bulb */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #93c5fd, #3b82f6 50%, #1d4ed8)",
                    boxShadow: "0 0 10px rgba(59,130,246,0.6), inset 1px 1px 3px rgba(255,255,255,0.3)",
                  }}
                />
                {/* Scale marks */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="absolute right-1 h-[1px] w-3"
                    style={{ top: `${30 + i * 22}px`, background: "rgba(255,255,255,0.4)" }}
                  />
                ))}
                {/* Label */}
                <div className="absolute top-2 left-0 right-0 text-center">
                  <span className="text-[11px] font-extrabold text-white drop-shadow-md">T0</span>
                </div>
                {/* Value */}
                <div className="absolute top-8 left-0 right-0 text-center">
                  <span className="text-[10px] font-bold text-white drop-shadow-sm">
                    {(() => {
                      if (data.AIR_OUTLET_TEMP !== undefined && data.AIR_OUTLET_TEMP !== null) return formatValue(data.AIR_OUTLET_TEMP, "°C");
                      if (data?.T0_temp_mean !== undefined && data?.T0_temp_mean !== null) return formatValue(data?.T0_temp_mean, "°C");
                      return formatValue(undefined, "°C");
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* 3D T1 Thermometer */}
            <div className="absolute" style={{ left: "454px", top: "148px" }}>
              <div className="w-[56px] h-[244px] relative rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #a5f3fc 0%, #67e8f9 25%, #22d3ee 50%, #06b6d4 75%, #0891b2 100%)",
                  boxShadow: "4px 4px 12px rgba(0,0,0,0.25), inset 1px 1px 4px rgba(255,255,255,0.4), inset -2px -2px 6px rgba(0,0,0,0.15)",
                  border: "2px solid #0e7490",
                }}
              >
                {/* Glass highlight */}
                <div className="absolute top-0 left-0 w-[40%] h-full rounded-l-2xl"
                  style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 100%)" }}
                />
                {/* Mercury column */}
                <div className="absolute bottom-2 left-[35%] w-[30%] rounded-full"
                  style={{
                    height: "50%",
                    background: "linear-gradient(90deg, #0e7490, #06b6d4 40%, #67e8f9 60%, #06b6d4 80%, #0e7490)",
                    boxShadow: "0 0 8px rgba(6,182,212,0.5)",
                  }}
                />
                {/* Mercury bulb */}
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, #67e8f9, #06b6d4 50%, #0e7490)",
                    boxShadow: "0 0 10px rgba(6,182,212,0.6), inset 1px 1px 3px rgba(255,255,255,0.3)",
                  }}
                />
                {/* Scale marks */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="absolute right-1 h-[1px] w-3"
                    style={{ top: `${30 + i * 22}px`, background: "rgba(255,255,255,0.4)" }}
                  />
                ))}
                {/* Label */}
                <div className="absolute top-2 left-0 right-0 text-center">
                  <span className="text-[11px] font-extrabold text-white drop-shadow-md">T1</span>
                </div>
                {/* Value */}
                <div className="absolute top-8 left-0 right-0 text-center">
                  <span className="text-[10px] font-bold text-white drop-shadow-sm">
                    {(() => {
                      if (data?.COLD_AIR_TEMP_T1 !== undefined && data?.COLD_AIR_TEMP_T1 !== null) return formatValue(data?.COLD_AIR_TEMP_T1, "°C");
                      if (data?.T1_temp_mean !== undefined && data?.T1_temp_mean !== null) return formatValue(data?.T1_temp_mean, "°C");
                      return formatValue(undefined, "°C");
                    })()}
                  </span>
                </div>
              </div>
            </div>

            {/* 3D T2 Temperature Display */}
            <div className="absolute" style={{ left: "562px", top: "185px" }}>
              <div className="relative w-[72px] h-[72px] rounded-full"
                style={{
                  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 25%, #fbbf24 50%, #f59e0b 75%, #d97706 100%)",
                  boxShadow: "4px 4px 14px rgba(0,0,0,0.25), inset 1px 1px 5px rgba(255,255,255,0.5), inset -2px -2px 6px rgba(0,0,0,0.15)",
                  border: "2px solid #b45309",
                }}
              >
                {/* Glass highlight */}
                <div className="absolute top-1 left-1 w-[45%] h-[45%] rounded-full"
                  style={{ background: "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.5), transparent)" }}
                />
                {/* Label */}
                <div className="absolute top-2 left-0 right-0 text-center">
                  <span className="text-[11px] font-extrabold text-white drop-shadow-md">T2</span>
                </div>
                {/* Value */}
                <div className="absolute top-[22px] left-0 right-0 text-center">
                  <span className="text-[12px] font-bold text-white drop-shadow-sm">
                    {(() => {
                      if (data?.T2_temp_mean !== undefined && data?.T2_temp_mean !== null) return formatValue(data?.T2_temp_mean, "°C");
                      if (data?.AMBIENT_AIR_TEMP_T2 !== undefined && data?.AMBIENT_AIR_TEMP_T2 !== null) return formatValue(data?.AMBIENT_AIR_TEMP_T2, "°C");
                      return formatValue(undefined, "°C");
                    })()}
                  </span>
                </div>
                {/* Ambient icon ring */}
                <div className="absolute bottom-1.5 left-0 right-0 text-center">
                  <span className="text-[8px] font-semibold text-amber-900 opacity-60">AMBIENT</span>
                </div>
              </div>
            </div>

            {/* HTR Units */}
            <div className={`absolute flex gap-14 z-10 ${isHTRMachine ? 'left-[350px]' : 'left-[200px]'}`} style={{ top: "430px" }}>
              {!isHTRMachine && (
                <div className="bg-red-600 text-white px-3 py-4 text-center rounded">
                  <div className="text-xs font-bold">HTR</div>
                  <div className="text-sm font-bold">
                    {(() => {
                      // Handle zero values correctly
                      if (data.Value_to_Display_HEATER !== undefined && data.Value_to_Display_HEATER !== null) return formatValue(data.Value_to_Display_HEATER, "%");
                      if (data?.Heater_speed !== undefined && data?.Heater_speed !== null) return formatValue(data?.Heater_speed, "%");
                      return formatValue(undefined, "%");
                    })()}
                  </div>
                </div>
              )}
              <div className="bg-red-600 text-white px-3 py-4 text-center rounded">
                <div className="text-xs font-bold">AHT</div>
                <div className="text-sm font-bold">
                  {(() => {
                    // Handle zero values correctly
                    if (data?.AHT_vale_speed !== undefined && data?.AHT_vale_speed !== null) return formatValue(data?.AHT_vale_speed, "%");
                    if (data.Value_to_Display_AHT_VALE_OPEN !== undefined && data.Value_to_Display_AHT_VALE_OPEN !== null) return formatValue(data.Value_to_Display_AHT_VALE_OPEN, "%");
                    if (data.AFTER_HEAT_VALVE_RPM !== undefined && data.AFTER_HEAT_VALVE_RPM !== null) return formatValue(data.AFTER_HEAT_VALVE_RPM, "%");
                    if (data?.AHT_valve_speed !== undefined && data?.AHT_valve_speed !== null) return formatValue(data?.AHT_valve_speed, "%");
                    return formatValue(undefined, "%");
                  })()}
                </div>
              </div>
              <div className="bg-red-600 text-white px-3 py-4 text-center rounded">
                <div className="text-xs font-bold">HGS</div>
                <div className="text-sm font-bold">
                  {(() => {
                    // Handle zero values correctly
                    if (data.Value_to_Display_HOT_GAS_VALVE_OPEN !== undefined && data.Value_to_Display_HOT_GAS_VALVE_OPEN !== null) return formatValue(data.Value_to_Display_HOT_GAS_VALVE_OPEN, "%");
                    if (data?.HOT_GAS_VALVE_RPM !== undefined && data?.HOT_GAS_VALVE_RPM !== null) return formatValue(data?.HOT_GAS_VALVE_RPM, "%");
                    if (data?.Hot_valve_speed !== undefined && data?.Hot_valve_speed !== null) return formatValue(data?.Hot_valve_speed, "%");
                    return formatValue(undefined, "%");
                  })()}
                </div>
              </div>
            </div>

            {/* 3D Blower Unit */}
            <div className="absolute" style={{ left: "730px", top: "460px" }}>
              <div className="text-center">
                {/* 3D Blower Housing */}
                <div className="relative w-20 h-20 mx-auto">
                  {/* Housing body */}
                  <div className="absolute inset-0 rounded-full"
                    style={{
                      background: "radial-gradient(circle at 35% 35%, #e5e7eb, #9ca3af 40%, #6b7280 70%, #4b5563)",
                      boxShadow: "3px 4px 8px rgba(0,0,0,0.3), inset -2px -2px 6px rgba(0,0,0,0.2), inset 2px 2px 6px rgba(255,255,255,0.3)",
                      border: "2px solid #4b5563",
                    }}
                  />
                  {/* Spinning fan blades */}
                  <svg viewBox="0 0 80 80" className="absolute inset-0 w-full h-full"
                    style={{
                      animation: isBlowerOn ? "spin3d 0.8s linear infinite" : "none",
                    }}
                  >
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <line key={angle} x1="40" y1="40" x2={40 + 28 * Math.cos((angle * Math.PI) / 180)} y2={40 + 28 * Math.sin((angle * Math.PI) / 180)}
                        stroke={isBlowerOn ? "#3b82f6" : "#6b7280"} strokeWidth="5" strokeLinecap="round"
                      />
                    ))}
                    <circle cx="40" cy="40" r="8" fill={isBlowerOn ? "#2563eb" : "#6b7280"} stroke="#374151" strokeWidth="2" />
                    <circle cx="38" cy="38" r="3" fill="white" opacity="0.3" />
                  </svg>
                  {/* Status ring */}
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow ${isBlowerOn ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                </div>
                <div className="text-xs font-bold mt-2 bg-gray-700 text-white px-3 py-1 rounded-md shadow inline-block">BLOWER</div>
                <div className="text-sm font-bold mt-1">
                  {(() => {
                    if (data?.Blower_speed !== undefined && data?.Blower_speed !== null) return formatValue(data?.Blower_speed, "%");
                    if (data?.BLOWER_RPM !== undefined && data?.BLOWER_RPM !== null) return formatValue(data?.BLOWER_RPM, "%");
                    if (data?.Value_to_Display_BLOWER !== undefined && data?.Value_to_Display_BLOWER !== null) return formatValue(data?.Value_to_Display_BLOWER, "%");
                    return formatValue(undefined, "%");
                  })()}
                </div>
              </div>
            </div>

            {/* 3D Condenser Fan */}
            <div className="absolute" style={{ left: "780px", top: "150px" }}>
              {/* 3D Condenser Unit Housing */}
              <div className="w-14 h-56 relative rounded-lg overflow-visible"
                style={{
                  background: "linear-gradient(90deg, #fecdd3, #fda4af 30%, #f87171 60%, #ef4444 80%, #dc2626)",
                  boxShadow: "3px 3px 8px rgba(0,0,0,0.25), inset 1px 0 4px rgba(255,255,255,0.3)",
                  border: "2px solid #b91c1c",
                }}
              >
                {/* Top metallic cap */}
                <div className="absolute -top-1 left-0 right-0 h-3 rounded-t-lg"
                  style={{ background: "linear-gradient(180deg, #fecdd3, #f87171)", borderBottom: "1px solid #b91c1c" }}
                />
                {/* Vertical highlight strip */}
                <div className="absolute top-3 left-1 w-2 h-[90%] rounded-full bg-white opacity-15" />
                {/* Coil lines */}
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                  <div key={i} className="absolute left-1 right-1 h-[1px] bg-red-800 opacity-30"
                    style={{ top: `${20 + i * 22}px` }}
                  />
                ))}
                {/* Status LED */}
                <div className="absolute top-3 right-2">
                  <div className={`w-3 h-3 rounded-full shadow-inner ${isCondFanOn ? "bg-green-400 shadow-green-400/50" : "bg-red-700"}`}
                    style={{ boxShadow: isCondFanOn ? "0 0 6px #22c55e" : "inset 0 1px 2px rgba(0,0,0,0.3)" }}
                  />
                </div>
                {/* Bottom pipe */}
                <div className="absolute -bottom-1 left-0 right-0 h-4 rounded-b-lg"
                  style={{ background: "linear-gradient(180deg, #dc2626, #991b1b)" }}
                />
              </div>

              {/* 3D Spinning Fan beside condenser */}
              <div className="absolute left-16 top-14">
                <div className="relative w-24 h-24">
                  {/* Fan guard ring */}
                  <div className="absolute inset-0 rounded-full"
                    style={{
                      border: "3px solid #6b7280",
                      background: "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1), transparent)",
                      boxShadow: "2px 2px 6px rgba(0,0,0,0.2)",
                    }}
                  />
                  {/* Spinning blades */}
                  <svg viewBox="0 0 96 96" className="absolute inset-0 w-full h-full"
                    style={{
                      animation: isCondFanOn ? "spin3d 0.6s linear infinite" : "none",
                    }}
                  >
                    {[0, 72, 144, 216, 288].map((angle) => (
                      <path key={angle}
                        d={`M48,48 L${48 + 36 * Math.cos(((angle - 15) * Math.PI) / 180)},${48 + 36 * Math.sin(((angle - 15) * Math.PI) / 180)} A36,36 0 0,1 ${48 + 36 * Math.cos(((angle + 15) * Math.PI) / 180)},${48 + 36 * Math.sin(((angle + 15) * Math.PI) / 180)} Z`}
                        fill={isCondFanOn ? "#60a5fa" : "#9ca3af"}
                        stroke={isCondFanOn ? "#3b82f6" : "#6b7280"}
                        strokeWidth="1"
                        opacity="0.85"
                      />
                    ))}
                    {/* Center hub - 3D */}
                    <circle cx="48" cy="48" r="10" fill="#4b5563" stroke="#374151" strokeWidth="2" />
                    <circle cx="48" cy="48" r="6" fill="#6b7280" />
                    <circle cx="46" cy="46" r="2.5" fill="white" opacity="0.25" />
                  </svg>
                </div>
              </div>

              <div className="absolute -bottom-14 left-20 transform -translate-x-1/2 text-center">
                <div className="text-xs font-bold bg-gray-700 text-white px-2 py-0.5 rounded shadow inline-block">Condenser</div>
                <div className="text-xs font-semibold mt-0.5">
                  {(() => {
                    if (data?.Cond_fan_speed !== undefined && data?.Cond_fan_speed !== null) return formatValue(data?.Cond_fan_speed, "%");
                    if (data?.Value_to_Display_COND_ACT_SPEED !== undefined && data?.Value_to_Display_COND_ACT_SPEED !== null) return formatValue(data?.Value_to_Display_COND_ACT_SPEED, "%");
                    if (data?.CONDENSER_RPM !== undefined && data?.CONDENSER_RPM !== null) return formatValue(data?.CONDENSER_RPM, "%");
                    if (data?.Condenser_fan_speed !== undefined && data?.Condenser_fan_speed !== null) return formatValue(data?.Condenser_fan_speed, "%");
                    return formatValue(undefined, "%");
                  })()}
                </div>
              </div>
            </div>

            {/* 3D Compressor Unit */}
            <div className="absolute" style={{ left: "840px", top: "460px" }}>
              <div className="relative w-24 h-16"
                style={{
                  animation: isCompressorOn ? "compressorShake 0.15s ease-in-out infinite" : "none",
                }}
              >
                {/* 3D Compressor body */}
                <svg viewBox="0 0 96 64" className="w-full h-full">
                  <defs>
                    <linearGradient id="compBodyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d4d4d8" />
                      <stop offset="20%" stopColor="#a1a1aa" />
                      <stop offset="50%" stopColor="#71717a" />
                      <stop offset="80%" stopColor="#52525b" />
                      <stop offset="100%" stopColor="#3f3f46" />
                    </linearGradient>
                    <linearGradient id="compSideGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#52525b" />
                      <stop offset="100%" stopColor="#3f3f46" />
                    </linearGradient>
                    <filter id="compShadow">
                      <feDropShadow dx="2" dy="3" stdDeviation="2" floodColor="#00000044" />
                    </filter>
                  </defs>
                  <g filter="url(#compShadow)">
                    {/* Main body */}
                    <rect x="10" y="8" width="60" height="48" rx="6" fill="url(#compBodyGrad)" stroke="#3f3f46" strokeWidth="2" />
                    {/* Side panel 3D */}
                    <rect x="70" y="12" width="12" height="40" rx="2" fill="url(#compSideGrad)" stroke="#3f3f46" strokeWidth="1.5" />
                    {/* Top pipe inlet */}
                    <rect x="25" y="2" width="12" height="10" rx="2" fill="#71717a" stroke="#52525b" strokeWidth="1" />
                    <rect x="50" y="2" width="12" height="10" rx="2" fill="#71717a" stroke="#52525b" strokeWidth="1" />
                    {/* Highlight strip */}
                    <rect x="16" y="12" width="4" height="40" rx="2" fill="white" opacity="0.15" />
                    {/* Cooling fins */}
                    {[0, 1, 2, 3, 4].map((i) => (
                      <rect key={i} x="22" y={16 + i * 8} width="42" height="2" rx="1" fill="#52525b" opacity="0.4" />
                    ))}
                    {/* Motor circle */}
                    <circle cx="82" cy="32" r="6"
                      fill={isCompressorOn ? "#3b82f6" : "#71717a"}
                      stroke="#374151" strokeWidth="1.5"
                    >
                      {isCompressorOn && (
                        <animate attributeName="opacity" values="1;0.6;1" dur="0.5s" repeatCount="indefinite" />
                      )}
                    </circle>
                    <circle cx="81" cy="31" r="2" fill="white" opacity="0.2" />
                    {/* Base feet */}
                    <rect x="15" y="54" width="14" height="6" rx="2" fill="#3f3f46" />
                    <rect x="52" y="54" width="14" height="6" rx="2" fill="#3f3f46" />
                  </g>
                </svg>
              </div>
              <div className={`mt-1 text-center px-3 py-1 rounded-md text-xs font-bold text-white shadow-md ${isCompressorOn ? "bg-green-600" : "bg-red-600"}`}
                style={{ boxShadow: isCompressorOn ? "0 0 10px rgba(34,197,94,0.4)" : "0 2px 4px rgba(0,0,0,0.2)" }}
              >
                <span className="flex items-center justify-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${isCompressorOn ? "bg-green-300 animate-pulse" : "bg-red-300"}`} />
                  Compressor {isCompressorOn ? "ON" : "OFF"}
                </span>
              </div>
            </div>

            {/* Pressure Readings */}
            <div className="absolute flex gap-2 z-10" style={{ left: "850px", bottom: "0px" }}>
              <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                LP
                <br />
                {(() => {
                  const isBarMachine =
                    machineName === "GTPL-137-GT-450T-S7-1200" ||
                    machineName === "GTPL-138-GT-450T-S7-1200";

                  if (isBarMachine) {
                    if (data.AI_SUC_PRESSURE !== undefined && data.AI_SUC_PRESSURE !== null) return formatValue(data.AI_SUC_PRESSURE, " bar");
                    if (data?.LP !== undefined && data?.LP !== null) return formatValue(data?.LP, " bar");
                    if (data?.LP_value !== undefined && data?.LP_value !== null) return formatValue(data?.LP_value, " bar");
                    return formatValue(undefined, " bar");
                  }

                  if (data.AI_SUC_PRESSURE !== undefined && data.AI_SUC_PRESSURE !== null) return formatValue(data.AI_SUC_PRESSURE);
                  if (data?.LP !== undefined && data?.LP !== null) return formatValue(data?.LP);
                  if (data?.LP_value !== undefined && data?.LP_value !== null) return formatValue(data?.LP_value);
                  return formatValue(undefined);
                })()}
              </div>
              <div className="bg-yellow-400 text-black px-2 py-1 rounded text-xs font-bold">
                HP
                <br />
                {(() => {
                  const isBarMachine =
                    machineName === "GTPL-137-GT-450T-S7-1200" ||
                    machineName === "GTPL-138-GT-450T-S7-1200";

                  if (isBarMachine) {
                    if (data.AI_COND_PRESSURE !== undefined && data.AI_COND_PRESSURE !== null) return formatValue(data.AI_COND_PRESSURE, " bar");
                    if (data?.HP !== undefined && data?.HP !== null) return formatValue(data?.HP, " bar");
                    if (data?.COMPRESSOR_TIME !== undefined && data?.COMPRESSOR_TIME !== null) return formatValue(data?.COMPRESSOR_TIME, " bar");
                    if (data?.HP_value !== undefined && data?.HP_value !== null) return formatValue(data?.HP_value, " bar");
                    if (data?.Compressor_timer !== undefined && data?.Compressor_timer !== null) return formatValue(data?.Compressor_timer, " bar");
                    return formatValue(undefined, " bar");
                  }

                  if (data.AI_COND_PRESSURE !== undefined && data.AI_COND_PRESSURE !== null) return formatValue(data.AI_COND_PRESSURE);
                  if (data?.HP !== undefined && data?.HP !== null) return formatValue(data?.HP);
                  if (data?.COMPRESSOR_TIME !== undefined && data?.COMPRESSOR_TIME !== null) return formatValue(data?.COMPRESSOR_TIME);
                  if (data?.HP_value !== undefined && data?.HP_value !== null) return formatValue(data?.HP_value);
                  if (data?.Compressor_timer !== undefined && data?.Compressor_timer !== null) return formatValue(data?.Compressor_timer);
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
