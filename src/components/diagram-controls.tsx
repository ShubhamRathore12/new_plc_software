"use client";

import { useState } from "react";

export default function Home({ data, formatValue }: any) {
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
            <rect x="150" y="100" width="50" height="100" fill="lightgray" />
            <path
              d="M150 120 H160 L165 130 H175 L180 120 H190 L195 130 H200 V180 H150 Z"
              fill="none"
              stroke="black"
              strokeWidth="1"
            />
            <text x="175" y="90" fontSize="12" textAnchor="middle">
              HTR {formatValue(data.Value_to_Display_HEATER, "%")}
            </text>

            {/* AHT Block with Zigzag */}
            <rect x="250" y="100" width="50" height="100" fill="lightgray" />
            <path
              d="M250 120 H260 L265 130 H275 L280 120 H290 L295 130 H300 V180 H250 Z"
              fill="none"
              stroke="black"
              strokeWidth="1"
            />
            <text x="275" y="90" fontSize="12" textAnchor="middle">
              AHT{" "}
              {formatValue(
                data.Value_to_Display_AHT_VALE_OPEN ||
                  data.AFTER_HEAT_VALVE_RPM,
                "%"
              )}
            </text>

            {/* HGS Block with Zigzag */}
            <rect x="350" y="100" width="50" height="100" fill="lightgray" />
            <path
              d="M350 120 H360 L365 130 H375 L380 120 H390 L395 130 H400 V180 H350 Z"
              fill="none"
              stroke="black"
              strokeWidth="1"
            />
            <text x="375" y="90" fontSize="12" textAnchor="middle">
              HGS{" "}
              {formatValue(
                data.Value_to_Display_HOT_GAS_VALVE_OPEN ||
                  data?.HOT_GAS_VALVE_RPM,
                "%"
              )}
            </text>

            {/* TH, T0, T1 Labels */}
            <text x="175" y="230" fontSize="12" textAnchor="middle">
              TH
            </text>
            <text x="175" y="250" fontSize="12" textAnchor="middle">
              {formatValue(data.AI_TH_Act || data?.AFTER_HEATER_TEMP_Th, "°C")}
            </text>

            <text x="275" y="230" fontSize="12" textAnchor="middle">
              T0
            </text>
            <text x="275" y="250" fontSize="12" textAnchor="middle">
              {formatValue(
                data.AI_AIR_OUTLET_TEMP || data?.AIR_OUTLET_TEMP,
                "°C"
              )}
            </text>

            <text x="375" y="230" fontSize="12" textAnchor="middle">
              T1
            </text>
            <text x="375" y="250" fontSize="12" textAnchor="middle">
              {formatValue(data.AI_COLD_AIR_TEMP || data?.T1_SET_POINT, "°C")}
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
                data?.AI_AMBIANT_TEMP || data?.AMBIENT_AIR_TEMP_T2
              ) || "N/A"}
            </text>

            {/* T1 = ### °C Box */}
            <rect x="600" y="50" width="100" height="40" fill="orange" />
            <text x="650" y="75" fontSize="12" textAnchor="middle">
              T1 ={" "}
              {formatValue(data.AI_COLD_AIR_TEMP || data?.T1_SET_POINT, "°C")}
            </text>

            {/* TH - T1 = ### °C Box */}
            <rect x="600" y="100" width="100" height="40" fill="orange" />
            <text x="650" y="125" fontSize="12" textAnchor="middle">
              TH - T1 = {formatValue(data.AI_TH_Act || data?.Th_T1, "°C")}
            </text>

            {/* ###% Box near COND */}
            <rect x="600" y="300" width="80" height="40" fill="lightgray" />
            <text x="640" y="325" fontSize="12" textAnchor="middle">
              {data?.COND_PID_Output_PER || data?.CONDENSER_RPM || "N/A"}%
            </text>

            {/* Blower Blocks */}
            <rect x="150" y="350" width="50" height="50" fill="red" />
            <rect x="250" y="350" width="50" height="50" fill="red" />
            <rect x="450" y="350" width="100" height="50" fill="red" />

            <text x="500" y="375" fontSize="12" textAnchor="middle">
              BLOWER
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

            {/* Text Value After Condenser */}
            <text x="640" y="380" fontSize="12" textAnchor="middle">
              {formatValue(data.Value_to_Display_COND_ACT_SPEED, "%")}
            </text>

            {/* Compressor */}
            <rect x="600" y="510" width="80" height="40" fill="red" />
            <text x="640" y="535" fontSize="12" textAnchor="middle">
              COMP*
            </text>

            {/* HP and LP Boxes */}
            <rect x="600" y="560" width="100" height="40" fill="white" />
            <text x="600" y="585" fontSize="12" textAnchor="middle">
              HP{" "}
              {formatValue(
                data.AI_COND_PRESSURE || data?.HP || data?.COMPRESSOR_TIME
              )}
            </text>

            <rect x="640" y="560" width="50" height="40" fill="white" />
            <text x="700" y="585" fontSize="12" textAnchor="middle">
              LP {formatValue(data.AI_SUC_PRESSURE || data?.LP)}
            </text>

            {/* Connecting Lines with Arrowheads */}
            <line
              x1="80"
              y1="200"
              x2="150"
              y2="150"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="200"
              y1="150"
              x2="250"
              y2="150"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="300"
              y1="150"
              x2="350"
              y2="150"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="400"
              y1="150"
              x2="450"
              y2="150"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="530"
              y1="225"
              x2="600"
              y2="225"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="640"
              y1="225"
              x2="640"
              y2="300"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />

            <line
              x1="150"
              y1="200"
              x2="150"
              y2="350"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="200"
              y1="350"
              x2="250"
              y2="350"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="300"
              y1="350"
              x2="450"
              y2="350"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
            <line
              x1="680"
              y1="350"
              x2="680"
              y2="510"
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />

            {/* Top Data Boxes with Dashed Border */}

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

            {/* SR. NO. GTPL-075 */}
          </svg>
        </div>
      </div>
    </div>
  );
}
