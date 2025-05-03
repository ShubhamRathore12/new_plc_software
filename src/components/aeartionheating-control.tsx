"use client";

import { useState } from "react";

export default function Home({ data, devices, heat, title, formatValue }: any) {
  const {
    AI_th_1,
    AI_AMBIANT_TEMP,
    HEATING_MODE_Set_Run_Duration,
    HEATING_MODE_Remaing_Time_h,
    HEATING_MODE_Remaing_Time_m,
  } = data?.[0] || {};

  const deltaT =
    AI_th_1 && AI_AMBIANT_TEMP
      ? (parseFloat(AI_th_1) - parseFloat(AI_AMBIANT_TEMP)).toFixed(1)
      : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 flex items-center justify-center p-6">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
        <style>
          {`
            @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');
            svg text {
              font-family: 'Roboto', sans-serif;
            }
          `}
        </style>
        <div className="relative w-full h-[600px]">
          <svg width="100%" height="100%" viewBox="0 0 800 600">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#4B5563" />
              </marker>
              <linearGradient id="siloGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#A1A1AA" }} />
                <stop offset="100%" style={{ stopColor: "#6B7280" }} />
              </linearGradient>
              <linearGradient id="htrGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#E5E7EB" }} />
                <stop offset="100%" style={{ stopColor: "#D1D5DB" }} />
              </linearGradient>
            </defs>

            {/* Serial Number */}
            <text x="40" y="30" fontSize="16" fontWeight="700" fill="#1F2937">
              SR. NO: GTPL-{devices === "S7-1200" ? "085" : "109"}
            </text>

            {/* Silo */}
            <rect x="50" y="100" width="60" height="150" fill="url(#siloGradient)" />
            <rect x="50" y="250" width="60" height="50" fill="#6B7280" />
            <path d="M50 100 L80 50 L110 100 Z" fill="url(#siloGradient)" stroke="#4B5563" strokeWidth="1" />

            {/* TH */}
            <text x="130" y="150" fontSize="14" fontWeight="700" fill="#1F2937" textAnchor="middle">TH</text>
            <text x="130" y="170" fontSize="14" fontWeight="400" fill="#4B5563" textAnchor="middle">
              {formatValue(data?.AI_TH_Act || data?.AI_TH_Act || data?.AFTER_HEATER_TEMP_Th, "°C")}
            </text>

            {/* HTR & Delta(T) — Always Show */}
            <rect x="150" y="100" width="50" height="100" fill="url(#htrGradient)" />
            <path
              d="M150 120 H160 L165 130 H175 L180 120 H190 L195 130 H200 V180 H150 Z"
              fill="none"
              stroke="#4B5563"
              strokeWidth="1"
            />
            <text x="175" y="90" fontSize="12" fontWeight="700" fill="#1F2937" textAnchor="middle">HTR</text>
            <text x="540" y="100" fontSize="14" fontWeight="700" fill="#1F2937" textAnchor="middle">Delta(T)</text>
            <text x="540" y="120" fontSize="14" fontWeight="400" fill="#4B5563" textAnchor="middle">{data?.HEATING_MODE_SET_TH_FOR_HEATING_MODE || data?.DELTA_SET} °C</text>

            {/* Air Flow Arrows */}
            <polyline points="110,200 150,200 200,200 200,400 450,400" fill="none" stroke="#4B5563" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <polyline points="450,400 500,400 500,150 400,150" fill="none" stroke="#4B5563" strokeWidth="3" markerEnd="url(#arrowhead)" />
            <polyline points="450,400 200,400 200,180 130,180" fill="none" stroke="#10B981" strokeWidth="3" markerEnd="url(#arrowhead)" />

            {/* Blower */}
            <circle cx="450" cy="400" r="35" fill="#3B82F6" />
            <text x="450" y="450" fontSize="12" fontWeight="700" fill="#1F2937" textAnchor="middle">BLOWER</text>

            {/* T2 Sensor */}
            <rect x="510" y="140" width="60" height="30" fill="#BFDBFE" rx="5" />
            <text x="540" y="150" fontSize="14" fontWeight="700" fill="#1F2937" textAnchor="middle">T2</text>
            <text x="540" y="165" fontSize="14" fontWeight="400" fill="#4B5563" textAnchor="middle">
              {formatValue(data?.AI_AMBIANT_TEMP || data?.AMBIENT_AIR_TEMP_T2, "°C")}
            </text>

            {/* Set Duration */}
            <text x="540" y="180" fontSize="14" fontWeight="700" fill="#1F2937" textAnchor="middle">Set Duration</text>
            <text x="540" y="200" fontSize="14" fontWeight="400" fill="#4B5563" textAnchor="middle">
              { data?.HEATING_MODE_Continuous_Mode || data?.SET_DURATION || "N/A"} h
            </text>

            {/* Running Time */}
            <text x="200" y="300" fontSize="14" fontWeight="700" fill="#1F2937" textAnchor="middle">Running Time</text>
            <rect x="170" y="310" width="30" height="20" fill="#E5E7EB" rx="3" />
            <rect x="210" y="310" width="30" height="20" fill="#E5E7EB" rx="3" />
            <text x="185" y="325" fontSize="12" fontWeight="400" fill="#4B5563" textAnchor="middle">
              {data?.HEATING_MODE_Continuous_Mode || data?.RUNNING_HOUR1 || "N/A"}
            </text>
            <text x="225" y="325" fontSize="12" fontWeight="400" fill="#4B5563" textAnchor="middle">
              {HEATING_MODE_Remaing_Time_m || data?.RUNNING_MINUTE1 || "N/A"}
            </text>
            <text x="185" y="345" fontSize="10" fontWeight="700" fill="#6B7280" textAnchor="middle">HOURS</text>
            <text x="225" y="345" fontSize="10" fontWeight="700" fill="#6B7280" textAnchor="middle">MINUTES</text>

            {/* Blower % */}
            <rect x="420" y="410" width="30" height="20" fill="#E5E7EB" rx="3" />
            <text x="435" y="425" fontSize="12" fontWeight="400" fill="#4B5563" textAnchor="middle">
              {formatValue(data?.Value_to_Display_EVAP_ACT_SPEED || data?.BLOWER_RPM, "%")}
            </text>
            <text x="465" y="425" fontSize="12" fontWeight="400" fill="#4B5563" textAnchor="middle">%</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
