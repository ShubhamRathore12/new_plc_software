"use client";
import { useEffect, useRef } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Generate data for the pressure chart
const generatePressureData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";

    data.push({
      name: `${hour}${ampm}`,
      pressure: 60 + Math.sin(i / 3) * 20 + Math.random() * 10,
      safeLevel: 80,
    });
  }
  return data;
};

interface PressureChartProps {
  detailed?: boolean;
}

const PressureChart = ({ detailed = false }: PressureChartProps) => {
  const data = useRef(generatePressureData());

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={detailed ? 300 : 100}>
        <AreaChart
          data={data.current}
          margin={{
            top: 5,
            right: 5,
            left: detailed ? 0 : -30,
            bottom: detailed ? 5 : -10,
          }}
        >
          {detailed && <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />}
          {detailed && <XAxis dataKey="name" tick={{ fontSize: 10 }} />}
          {detailed && <YAxis tick={{ fontSize: 10 }} />}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "4px",
              fontSize: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          {detailed && <Legend />}
          <defs>
            <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="pressure"
            stroke="#2563eb"
            strokeWidth={2}
            fill="url(#pressureGradient)"
            animationDuration={1000}
          />
          {detailed && (
            <Area
              type="monotone"
              dataKey="safeLevel"
              stroke="#10b981"
              strokeWidth={1}
              strokeDasharray="5 5"
              fill="none"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {!detailed && (
        <div>
          <div className="flex justify-between mb-1">
            <div className="text-xs text-gray-500">MODERATE</div>
            <div className="text-lg font-bold">75%</div>
          </div>
          <div className="flex gap-0.5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-sm ${
                  i < 11 ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"
                }`}
              ></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PressureChart;
