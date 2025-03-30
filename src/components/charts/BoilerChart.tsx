"use client";
import { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Generate data for the boiler chart
const generateBoilerData = () => {
  const data = [];
  const baseEfficiency = 75 + Math.random() * 10;
  const basePressure = 60 + Math.random() * 15;

  for (let i = 0; i < 24; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";
    const timeOfDay = i;

    // Add some cyclical variation
    const timeEffect = Math.sin((timeOfDay / 24) * Math.PI * 2);
    const randomVariation = Math.random() * 5;

    data.push({
      name: `${hour}${ampm}`,
      efficiency: Math.min(
        100,
        Math.max(50, baseEfficiency + timeEffect * 10 + randomVariation)
      ),
      pressure: Math.min(
        100,
        Math.max(30, basePressure + timeEffect * 8 + randomVariation)
      ),
      temperature: Math.min(
        95,
        Math.max(60, 75 + timeEffect * 15 + randomVariation)
      ),
    });
  }

  return data;
};

interface BoilerChartProps {
  detailed?: boolean;
}

const BoilerChart = ({ detailed = false }: BoilerChartProps) => {
  const data = useRef(generateBoilerData());
  const [status, setStatus] = useState("Active");

  // Change status periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const statuses = ["Active", "Standby", "Active", "Active"];
      setStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Get the current efficiency value from the last data point
  const currentEfficiency = Math.round(
    data.current[data.current.length - 1].efficiency
  );

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={detailed ? 300 : 100}>
        <ComposedChart
          data={
            detailed
              ? data.current
              : data.current.slice(data.current.length - 8)
          }
          margin={{
            top: 5,
            right: 5,
            left: detailed ? 0 : -30,
            bottom: detailed ? 5 : -10,
          }}
        >
          {detailed && <CartesianGrid strokeDasharray="3 3" />}
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
          <Bar
            dataKey="pressure"
            fill="#3b82f6"
            animationDuration={1000}
            barSize={detailed ? 10 : 4}
          />
          <Line
            type="monotone"
            dataKey="efficiency"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          {detailed && (
            <Line
              type="monotone"
              dataKey="temperature"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>

      {!detailed && (
        <div className="mt-2 flex justify-between items-center">
          <div>
            <div className="text-xs text-gray-500">EFFICIENCY</div>
            <div className="text-lg font-bold">{currentEfficiency}%</div>
          </div>
          <div
            className={`px-2 py-1 rounded text-sm ${
              status === "Active"
                ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                : status === "Standby"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100"
                : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
            }`}
          >
            {status}
          </div>
        </div>
      )}
    </div>
  );
};

export default BoilerChart;
