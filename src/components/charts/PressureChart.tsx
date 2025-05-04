// "use client";
// import { useEffect, useRef } from "react";
// import {
//   ResponsiveContainer,
//   AreaChart,
//   Area,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
// } from "recharts";
// import Im from "../../../public/images/1200auto-Photoroom new 1.png";
// import Im1 from "../../../public/images/5.png";
// import Image from "next/image";

// // Generate data for the pressure chart
// const generatePressureData = () => {
//   const data = [];
//   for (let i = 0; i < 24; i++) {
//     const hour = i % 12 === 0 ? 12 : i % 12;
//     const ampm = i < 12 ? "AM" : "PM";

//     data.push({
//       name: `${hour}${ampm}`,
//       pressure: 60 + Math.sin(i / 3) * 20 + Math.random() * 10,
//       safeLevel: 80,
//     });
//   }
//   return data;
// };

// interface PressureChartProps {
//   detailed?: boolean;
//   param?: any;
// }

// const PressureChart = ({ detailed = false, param }: PressureChartProps) => {
//   const data = useRef(generatePressureData());

//   return (
//     <div className="h-full w-full">
//       <Image
//         src={param == "S7-1200" ? Im : Im1}
//         alt="Image"
//         width={1000}
//         height={1000}
//       />
//     </div>
//   );
// };

// export default PressureChart;
"use client";

import { useEffect, useState } from "react";
import BlueprintScene from "../blueprint-scene";

export default function PressureChart() {
  // Only render the 3D scene on the client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#e6f0fa]">
      <BlueprintScene />
    </div>
  );
}
