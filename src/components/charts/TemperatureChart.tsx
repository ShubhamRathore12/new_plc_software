import { useRef } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";

// Generate data for the temperature chart
const generateTemperatureData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const ampm = i < 12 ? "AM" : "PM";

    data.push({
      name: `${hour}${ampm}`,
      temperature: 65 + Math.sin(i / 2) * 10 + Math.random() * 5,
      optimalTemp: 72,
    });
  }
  return data;
};

interface TemperatureChartProps {
  detailed?: boolean;
}

const TemperatureChart = ({ detailed = false }: TemperatureChartProps) => {
  const data = useRef(generateTemperatureData());

  // Calculate current temperature as the last data point
  const currentTemp = Math.round(
    data.current[data.current.length - 1].temperature
  );

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height={detailed ? 300 : 100}>
        <LineChart
          data={data.current}
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
          {detailed && (
            <ReferenceLine y={72} stroke="#10b981" strokeDasharray="3 3" />
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "4px",
              fontSize: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          />
          {detailed && <Legend />}
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
            animationDuration={1000}
          />
          {detailed && (
            <Line
              type="monotone"
              dataKey="optimalTemp"
              stroke="#10b981"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {!detailed && (
        <div className="mt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="bg-red-500 w-2 h-2 rounded-full mr-1"></span>
              <span className="text-xs text-gray-500">CURRENT</span>
            </div>
            <div className="text-lg font-bold">{currentTemp}°C</div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full mt-1">
            <div
              className="bg-red-500 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, (currentTemp / 100) * 100)}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemperatureChart;
