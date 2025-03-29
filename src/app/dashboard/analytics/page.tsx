"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { useAnimateInView } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const lineData = [
  { name: "Jan", visitors: 2400, pageViews: 4000 },
  { name: "Feb", visitors: 1398, pageViews: 3000 },
  { name: "Mar", visitors: 9800, pageViews: 2000 },
  { name: "Apr", visitors: 3908, pageViews: 2780 },
  { name: "May", visitors: 4800, pageViews: 1890 },
  { name: "Jun", visitors: 3800, pageViews: 2390 },
  { name: "Jul", visitors: 4300, pageViews: 3490 },
];

const areaData = [
  { name: "Week 1", mobile: 4000, desktop: 2400, tablet: 1500 },
  { name: "Week 2", mobile: 3000, desktop: 1398, tablet: 1700 },
  { name: "Week 3", mobile: 2000, desktop: 9800, tablet: 1200 },
  { name: "Week 4", mobile: 2780, desktop: 3908, tablet: 2000 },
  { name: "Week 5", mobile: 1890, desktop: 4800, tablet: 1800 },
];

const barData = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const pieData = [
  { name: "Chrome", value: 58.9 },
  { name: "Firefox", value: 13.3 },
  { name: "Edge", value: 13.0 },
  { name: "Safari", value: 11.6 },
  { name: "Others", value: 3.2 },
];

const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];

export default function AnalyticsPage() {
  const { ref: areaRef, isInView: areaInView } = useAnimateInView();
  const { ref: barRef, isInView: barInView } = useAnimateInView();
  const { ref: pieRef, isInView: pieInView } = useAnimateInView();

  const areaChartRef = useRef(null);
  const barChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    if (areaChartRef.current && areaInView) {
      gsap.from(areaChartRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }

    if (barChartRef.current && barInView) {
      gsap.from(barChartRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }

    if (pieChartRef.current && pieInView) {
      gsap.from(pieChartRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, [areaInView, barInView, pieInView]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Analytics</h1>
      </motion.div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full max-w-md grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div ref={areaRef}>
            <Card ref={areaChartRef}>
              <CardHeader>
                <CardTitle>Site Traffic Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="pageViews"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="visitors" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <div ref={barRef}>
            <Card ref={barChartRef}>
              <CardHeader>
                <CardTitle>Page Traffic Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="pv" fill="#8884d8" />
                    <Bar dataKey="uv" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={areaRef}>
              <Card ref={areaChartRef}>
                <CardHeader>
                  <CardTitle>Device Traffic</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={areaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="mobile"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                      <Area
                        type="monotone"
                        dataKey="desktop"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                      />
                      <Area
                        type="monotone"
                        dataKey="tablet"
                        stackId="1"
                        stroke="#ffc658"
                        fill="#ffc658"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div ref={pieRef}>
              <Card ref={pieChartRef}>
                <CardHeader>
                  <CardTitle>Browser Share</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
