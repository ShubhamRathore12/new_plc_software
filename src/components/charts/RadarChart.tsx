import { useRef } from "react";
import {
  ResponsiveContainer,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip,
} from "recharts";

// Generate data for the radar chart
const generateRadarData = () => {
  return [
    { subject: "Pressure", A: 80 + Math.random() * 20, B: 90, fullMark: 100 },
    {
      subject: "Temperature",
      A: 70 + Math.random() * 20,
      B: 85,
      fullMark: 100,
    },
    { subject: "Flow Rate", A: 85 + Math.random() * 15, B: 90, fullMark: 100 },
    { subject: "Efficiency", A: 65 + Math.random() * 25, B: 80, fullMark: 100 },
    { subject: "Power", A: 75 + Math.random() * 15, B: 85, fullMark: 100 },
    { subject: "Runtime", A: 90 + Math.random() * 10, B: 95, fullMark: 100 },
  ];
};

const RadarChart = () => {
  const data = useRef(generateRadarData());

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart
          cx="50%"
          cy="50%"
          outerRadius="80%"
          data={data.current}
        >
          <PolarGrid gridType="circle" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#888", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fontSize: 10 }}
          />
          <Radar
            name="Current"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.5}
            animationDuration={1000}
          />
          <Radar
            name="Optimal"
            dataKey="B"
            stroke="#10b981"
            fill="#10b981"
            fillOpacity={0.1}
            animationDuration={1000}
          />
          <Tooltip />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RadarChart;
