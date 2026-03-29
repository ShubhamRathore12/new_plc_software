"use client";

import React from "react";

export default function Home({ data, formatValue, machineName }: any) {
  // Lamp state
  const greenOn = data?.GREEN_LIGHT === "tr" || data?.GREEN_LIGHT === "tr";
  const redOn = data?.RED_LIGHT === "tr" || data?.RED_LIGHT === "tr";
  const yellowOn = data?.YELLOW_LIGHT === "tr" || data?.YELLOW_LIGHT === "tr";

  // Helper for lamp color
  const lampColor = (on: boolean, color: string) => (on ? color : "#d1d5db"); // gray-300

  // Hide RH and Pa blocks for GTPL-60-gT-60T-P-S7-200
  const showTopBlocks =
    machineName !== "GTPL-60-gT-60T-P-S7-200" &&
    machineName !== "GTPL-60-gT-60T-P-S7-200";

  console.log(machineName);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-center text-2xl font-bold mb-4">
          Process Flow Diagram
        </h1>
        <div className="relative w-full h-[600px] bg-white shadow-lg rounded-lg p-4">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 800 600"
            className="w-full h-full"
          >
            {/* Arrowhead Marker Definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="black" />
              </marker>
            </defs>

            {/* Silo */}
            <rect x="20" y="50" width="60" height="150" fill="pink" />
            <rect x="20" y="200" width="60" height="50" fill="gray" />
            <text x="40" y="230" fontSize="12" textAnchor="middle">
              SILO
            </text>

            {/* HTR Block with Zigzag */}
            {machineName !== "GTPL-122-gT-1000T-S7-1200" && ( 

              <>
            <rect x="150" y="100" width="50" height="100" fill="lightgray" />
            <path
              d="M150 120 H160 L165 130 H175 L180 120 H190 L195 130 H200 V180 H150 Z"
              fill="none"
              stroke="black"
              strokeWidth="1"
            /></>)}
          {machineName !== "GTPL-122-gT-1000T-S7-1200" && (
  <text x="175" y="90" fontSize="12" textAnchor="middle">
    HTR {formatValue(data.Value_to_Display_HEATER, "%")}
  </text>
)}


            {/* AHT Block with Zigzag (now lightgray, no label/value) */}
            <rect x="250" y="100" width="50" height="100" fill="lightgray" />
            <path
              d="M250 120 H260 L265 130 H275 L280 120 H290 L295 130 H300 V180 H250 Z"
              fill="none"
              stroke="black"
              strokeWidth="1"
            />

            {/* HGS Block with Zigzag (now lightgray, no label/value) */}
            <rect x="350" y="100" width="50" height="100" fill="lightgray" />
               {machineName !== "GTPL-122-gT-1000T-S7-1200" && <>   <path
              d="M350 120 H360 L365 130 H375 L380 120 H390 L395 130 H400 V180 H350 Z"
              fill="none"
              stroke="black"
              strokeWidth="1"
            />

   

            <text x="175" y="230" fontSize="12" textAnchor="middle">
              TH
            </text>
            <text x="175" y="250" fontSize="12" textAnchor="middle">
              {formatValue(data.AI_TH_Act || data?.AFTER_HEATER_TEMP_Th, "°C")}
            </text> </>}
         

            <text x="275" y="230" fontSize="12" textAnchor="middle">
              T0
            </text>
            <text x="275" y="250" fontSize="12" textAnchor="middle">
              {formatValue(
                data.AIR_OUTLET_TEMP || data?.T0_temp_mean,
                "°C"
              )}
            </text>

            <text x="375" y="230" fontSize="12" textAnchor="middle">
              T1
            </text>
            <text x="375" y="250" fontSize="12" textAnchor="middle">
              {formatValue(data?.COLD_AIR_TEMP_T1 || data?.T1_temp_mean, "°C")}
            </text>

            {/* T2 Block */}
            <rect x="450" y="150" width="80" height="150" fill="lightgray" />
            <path d="M450 150 H530 V225 L480 300 H450 Z" fill="lightgray" />
            <path
              d="M450 170 H460 L465 180 H475 L480 170 H490 L495 180 H505 L510 170 H520 V280 H450 Z"
              fill="none"
              stroke="black"
              strokeWidth="1"
            />
            <text x="490" y="190" fontSize="12" textAnchor="middle">
              T2
            </text>
            <text x="490" y="210" fontSize="12" textAnchor="middle">
              {formatValue(
                data?.T2_temp_mean || data?.AMBIENT_AIR_TEMP_T2
              ) || "N/A"}
            </text>

            {/* T1 = ### °C Box */}
            <rect x="600" y="50" width="100" height="40" fill="orange" />
            {machineName === "GTPL-122-gT-1000T-S7-1200" ?  <text x="650" y="75" fontSize="12" textAnchor="middle">
              T0 = {formatValue(data?.T0_temp_mean, "°C")}
            </text> : (
            <text x="650" y="75" fontSize="12" textAnchor="middle">
              T1 = {formatValue(data?.T1_SET_POINT, "°C")}
            </text>
            )
}
            {/* TH - T1 = ### °C Box */}
            <rect x="600" y="100" width="100" height="40" fill="orange" />
            {machineName === "GTPL-122-gT-1000T-S7-1200" ?    <text x="650" y="125" fontSize="12" textAnchor="middle">
              T Detla = {formatValue(data.Delta_T_set_point || data?.Th_T1, "°C")}
            </text> :
            <text x="650" y="125" fontSize="12" textAnchor="middle">
              TH - T1 = {formatValue(data.AI_TH_Act || data?.Th_T1, "°C")}
            </text>
}
            {/* ###% Box near COND */}
            <rect x="600" y="300" width="80" height="40" fill="lightgray" />
            <text x="640" y="325" fontSize="12" textAnchor="middle">
              {data?.COND_PID_Output_PER || data?.CONDENSER_RPM || "N/A"}%
            </text>

            {/* Blower Blocks (now show AHT and HGS values in the first two red blocks) */}
            {/* AHT label above first red block */}
            <text x="175" y="345" fontSize="12" textAnchor="middle" fill="#111">
              AHT
            </text>
            {/* HGS label above second red block */}
            <text x="275" y="345" fontSize="12" textAnchor="middle" fill="#111">
              HGS
            </text>
            <rect x="150" y="350" width="50" height="50" fill="red" />
            <rect x="250" y="350" width="50" height="50" fill="red" />
            <rect x="450" y="350" width="100" height="50" fill="red" />
            {/* AHT value in first red block */}
            <text x="175" y="380" fontSize="16" textAnchor="middle" fill="#111">
              {formatValue(
                data.Value_to_Display_AHT_VALE_OPEN ||
                  data.AFTER_HEAT_VALVE_RPM || data?.AHT_vale_speed,
                "%"
              )}
            </text>
            {/* HGS value in second red block */}
            <text x="275" y="380" fontSize="16" textAnchor="middle" fill="#111">
              {formatValue(
                data.Value_to_Display_HOT_GAS_VALVE_OPEN ||
                  data?.HOT_GAS_VALVE_RPM || data?.Hot_valve_speed,
                "%"
              )}
            </text>
            <rect x="450" y="350" width="100" height="50" fill="red" />
<text x="500" y="370" fontSize="12" textAnchor="middle" fill="#111">
  BLOWER
</text>
<text x="500" y="390" fontSize="16" textAnchor="middle" fill="#111">
  {formatValue(
    data?.Blower_speed || data?.BLOWER_RPM || data?.Value_to_Display_BLOWER,
    "%"
  )}
</text>

           

            {/* Condenser Block */}
            <rect x="600" y="150" width="80" height="200" fill="lightgray" />
            <path d="M600 150 H680 V250 L640 350 H600 Z" fill="lightgray" />
            <path
              d="M605 170 H615 L620 180 H630 L635 170 H645 L650 180 H660 L665 170 H675 V230 H605 Z"
              fill="none"
              stroke="black"
              strokeWidth="1"
            />
            <text x="640" y="200" fontSize="12" textAnchor="middle">
              COND
            </text>
            <text x="640" y="380" fontSize="12" textAnchor="middle">
              {formatValue(data.Value_to_Display_COND_ACT_SPEED, "%")}
            </text>

            {/* Compressor Value Block */}
            <rect x="600" y="410" width="80" height="40" fill="red" />
            <text x="640" y="435" fontSize="12" textAnchor="middle">
              COMP*
            </text>
            <text x="640" y="425" fontSize="12" textAnchor="middle">
              {formatValue(data?.COMPRESSOR_TIME || data?.Compressor_timer, "%")}
            </text>

            {/* HP and LP Separate Yellow Blocks */}
            <rect
              x="600"
              y="500"
              width="70"
              height="40"
              fill="#fde047"
              stroke="black"
              strokeWidth="1"
            />
            <text x="635" y="520" fontSize="14" textAnchor="middle" fill="#111">
              HP
            </text>
            <text x="635" y="530" fontSize="12" textAnchor="middle" fill="#111">
              {formatValue(
                data.AI_COND_PRESSURE || data?.HP || data?.COMPRESSOR_TIME || data?.HP_value
              )}
            </text>
            <rect
              x="680"
              y="500"
              width="70"
              height="40"
              fill="#fde047"
              stroke="black"
              strokeWidth="1"
            />
            <text x="715" y="520" fontSize="14" textAnchor="middle" fill="#111">
              LP
            </text>
            <text x="715" y="530" fontSize="12" textAnchor="middle" fill="#111">
              {formatValue(data.AI_SUC_PRESSURE || data?.LP || data?.LP_value)}
            </text>

            {/* Top Data Boxes with Dashed Border (conditionally rendered) */}
            {/* {showTopBlocks && (
              <>
                <rect
                  x="250"
                  y="20"
                  width="80"
                  height="40"
                  fill="lightgray"
                  stroke="black"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text x="290" y="45" fontSize="12" textAnchor="middle">
                  RH {data?.AI_RH_Analog_Scale || "N/A"}%
                </text>
                <rect
                  x="350"
                  y="20"
                  width="80"
                  height="40"
                  fill="lightgray"
                  stroke="black"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
                <text x="390" y="45" fontSize="12" textAnchor="middle">
                  {data?.AI_Pa_Analog_Scale || "N/A"} Pa
                </text>
              </>
            )} */}

            {/* Three Lamps at Left Bottom Corner */}
            <circle
              cx="60"
              cy="570"
              r="15"
              fill={lampColor(greenOn, "#22c55e")}
              stroke="#222"
              strokeWidth="2"
            />
            <circle
              cx="100"
              cy="570"
              r="15"
              fill={lampColor(redOn, "#ef4444")}
              stroke="#222"
              strokeWidth="2"
            />
            <circle
              cx="140"
              cy="570"
              r="15"
              fill={lampColor(yellowOn, "#eab308")}
              stroke="#222"
              strokeWidth="2"
            />
            <text x="60" y="595" fontSize="10" textAnchor="middle" fill="#222">
              Green
            </text>
            <text x="100" y="595" fontSize="10" textAnchor="middle" fill="#222">
              Red
            </text>
            <text x="140" y="595" fontSize="10" textAnchor="middle" fill="#222">
              Yellow
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
