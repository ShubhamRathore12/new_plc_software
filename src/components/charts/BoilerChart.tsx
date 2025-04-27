"use client";
import Image from "next/image";
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
import Im from "../../../public/images/new2.png";
import Im1 from "../../../public/images/4.png";

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
  param?: any;
}

const BoilerChart = ({ detailed = false, param }: BoilerChartProps) => {
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
      <Image
        src={param == "S7-1200" ? Im : Im1}
        alt="Image"
        width={1000}
        height={1000}
      />
    </div>
  );
};

export default BoilerChart;
