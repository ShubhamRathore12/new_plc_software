"use client";
import { useRef } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

// Generate data for the heat chart
const generateHeatData = () => {
  const data = [];
  for (let i = 0; i < 12; i++) {
    data.push({
      name: `Zone ${i + 1}`,
      heat: 50 + Math.random() * 35,
      threshold: 75,
    });
  }
  return data;
};

interface HeatChartProps {
  detailed?: boolean;
}

const HeatChart = ({ detailed = false }: HeatChartProps) => {
  const data = useRef(generateHeatData());

  // Get the average heat value across all zones
  const averageHeat = Math.round(
    data.current.reduce((sum, item) => sum + item.heat, 0) / data.current.length
  );

  // Calculate how many zones are above threshold
  const zonesAboveThreshold = data.current.filter(
    (item) => item.heat > item.threshold
  ).length;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={detailed ? 300 : 100}>
        <BarChart
          data={detailed ? data.current : data.current.slice(0, 6)}
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
            dataKey="heat"
            fill="#f97316"
            animationDuration={1000}
            barSize={detailed ? 20 : 8}
          />
          {detailed && (
            <Bar
              dataKey="threshold"
              fill="transparent"
              stroke="#dc2626"
              strokeWidth={1}
              strokeDasharray="5 5"
            />
          )}
        </BarChart>
      </ResponsiveContainer>

      {!detailed && (
        <div className="mt-2">
          <div className="flex justify-between">
            <div>
              <div className="text-xs text-gray-500">AVG HEAT</div>
              <div className="text-lg font-bold">{averageHeat}%</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">ZONES &gt; THRESHOLD</div>
              <div
                className={`text-lg font-bold ${
                  zonesAboveThreshold > 0 ? "text-red-500" : "text-green-500"
                }`}
              >
                {zonesAboveThreshold}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeatChart;
