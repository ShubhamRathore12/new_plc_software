import Image from "next/image";
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
import Im from "../../../public/images/new1.png";
import Im1 from "../../../public/images/3.png";

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
  param?: any;
}

const TemperatureChart = ({
  detailed = false,
  param,
}: TemperatureChartProps) => {
  const data = useRef(generateTemperatureData());

  // Calculate current temperature as the last data point
  const currentTemp = Math.round(
    data.current[data.current.length - 1].temperature
  );

  return (
    <div className="h-full w-full">
      <Image
        src={param == "S7-1200" ? Im : Im1}
        alt="Image"
        width={1000}
        height={1000}
      />
    </div>
  );
};

export default TemperatureChart;
