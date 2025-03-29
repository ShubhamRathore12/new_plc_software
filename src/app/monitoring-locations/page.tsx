"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Thermometer, Wind, Gauge, Menu, Plus, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout"; // Import the DashboardLayout

export default function MonitoringPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [zoomLevel, setZoomLevel] = useState(1);

  const monitoringData = [
    {
      title: "Supply Air Temperature",
      value: "13.9°C",
      icon: Thermometer,
      color: "bg-blue-500",
    },
    {
      title: "Cold Air Temperature",
      value: "11.0°C",
      icon: Wind,
      color: "bg-cyan-500",
    },
    {
      title: "Ambient Air Temperature",
      value: "33.0°C",
      icon: Thermometer,
      color: "bg-orange-500",
    },
    {
      title: "Blower Status",
      value: "75%",
      icon: Gauge,
      color: "bg-green-500",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".monitoring-card", {
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: "power3.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <DashboardLayout>
      <div className="flex h-screen">
        <div
          ref={containerRef}
          className="flex-1 p-6 bg-gray-50 dark:bg-black min-h-screen"
        >
          <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
            Monitoring Location Overview
          </h1>

          <div
            className="relative transform transition-transform origin-top-left"
            style={{
              transform: `scale(${zoomLevel}) translateX(${
                (zoomLevel - 1) * 256
              }px)`,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {monitoringData.map((item, index) => (
                <Card
                  key={index}
                  className={`monitoring-card p-6 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800`}
                >
                  <div
                    className={`${item.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-black dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-2xl font-bold text-black dark:text-white">
                    {item.value}
                  </p>
                </Card>
              ))}
            </div>

            <div className="mt-8 monitoring-card">
              <Card className="p-6 bg-white dark:bg-gray-800">
                <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
                  System Status
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatusIndicator label="Compressor" status="active" />
                  <StatusIndicator label="Blower" status="active" />
                  <StatusIndicator label="Fan 1" status="active" />
                  <StatusIndicator label="Fan 2" status="active" />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatusIndicator({
  label,
  status,
}: {
  label: string;
  status: "active" | "inactive" | "warning";
}) {
  const colors = {
    active: "bg-green-500",
    inactive: "bg-gray-500",
    warning: "bg-yellow-500",
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className={`w-3 h-3 rounded-full ${colors[status]}`} />
      <span className="font-medium">{label}</span>
    </div>
  );
}
