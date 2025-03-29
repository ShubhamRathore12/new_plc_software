"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Fan,
  Timer,
  ArrowLeft,
  Menu,
  Power,
  Thermometer,
  Wind,
} from "lucide-react";
import { GrainMonitorData } from "../types/grain-monitor";
import { useMediaQuery } from "../hooks/use-media-query";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Input } from "@headlessui/react";

// Simulated API data for Grain Monitor
const mockData = {
  id: "GTPL-053",
  aht: 23,
  hgs: 0,
  temperatures: {
    t0: 13.9,
    t1: 11.0,
    t2: 33.0,
    deltaT: 3,
  },
  blowerSpeed: 75,
  fans: [true, true, true, true],
  compressor: {
    hp: 295,
    lp: 59,
  },
};

export default function AerationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const fanAnimation = useRef<gsap.core.Tween | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(1);
  const [runningTime, setRunningTime] = useState<{
    hours: number;
    minutes: number;
  }>({ hours: 0, minutes: 0 });
  const [temperature, setTemperature] = useState<{ t0: number; t2: number }>({
    t0: 26.0,
    t2: 32.9,
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("aeration"); // State for active tab
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Grain state variables
  const [isRunning, setIsRunning] = useState(false);
  const [temperatures, setTemperatures] = useState({
    t0: 13.9,
    t1: 11.0,
    t2: 33.0,
  });
  const [blowerPower, setBlowerPower] = useState(75);
  const [fanStatuses, setFanStatuses] = useState([true, true, true, true]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState<GrainMonitorData>(mockData);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => ({
        ...prev,
        temperatures: {
          ...prev.temperatures,
          t0: +(prev.temperatures.t0 + (Math.random() - 0.5)).toFixed(1),
          t1: +(prev.temperatures.t1 + (Math.random() - 0.5)).toFixed(1),
          t2: +(prev.temperatures.t2 + (Math.random() - 0.5)).toFixed(1),
        },
        blowerSpeed: Math.min(
          100,
          Math.max(0, prev.blowerSpeed + (Math.random() - 0.5) * 5)
        ),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".aeration-element", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (running) {
      fanAnimation.current = gsap.to(".fan-blade", {
        rotate: 360,
        duration: 2,
        repeat: -1,
        ease: "linear",
      });
    } else {
      if (fanAnimation.current) {
        fanAnimation.current.kill();
      }
    }
  }, [running]);

  const handleConfigureClick = () => {
    setIsModalOpen(true);
  };

  return <h1>Aeration</h1>;
}

function TemperatureDisplay({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-medium text-black dark:text-white">{label}</span>
      <div className="flex items-center gap-2">
        <Thermometer className="w-4 h-4 text-red-500" />
        <span className="text-black dark:text-white">{value}°C</span>
      </div>
    </div>
  );
}
