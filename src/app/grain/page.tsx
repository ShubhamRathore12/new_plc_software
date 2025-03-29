"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Fan, Thermometer, Power, ArrowLeft } from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";
import { Modal } from "@/components/ui/modal";

export default function GrainTechnikPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [temperatures, setTemperatures] = useState({
    t0: 13.9,
    t1: 11.0,
    t2: 33.0,
  });
  const [blowerPower, setBlowerPower] = useState(75);
  const [fanStatuses, setFanStatuses] = useState([true, true, true, true]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".grain-element", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleConfigureClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div
        ref={containerRef}
        className="flex-1 p-6 bg-white dark:bg-black min-h-screen"
      >
        <Card className="max-w-6xl mx-auto bg-white dark:bg-black dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center grain-element">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-black dark:text-white">
                GRAIN TECHNIK
              </h1>
              <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm text-black dark:text-white">
                GTPL-053
              </div>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300">
              {new Date().toLocaleString()}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Silo and Controls */}
            <div className="grain-element">
              <div className="relative h-96 bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                {/* Silo Visualization */}
                <div className="absolute left-1/2 -translate-x-1/2 w-40 h-80 bg-gradient-to-b from-gray-300 dark:from-gray-700 to-gray-400 dark:to-gray-600 rounded-t-3xl">
                  <div className="absolute -left-24 top-1/3 flex items-center gap-2">
                    <span className="text-sm font-medium text-black dark:text-white">
                      T0
                    </span>
                    <div className="bg-white dark:bg-black p-2 rounded shadow-sm text-black dark:text-white">
                      {temperatures.t0}°C
                    </div>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-3 w-full max-w-[200px]">
                  <Button
                    className={
                      isRunning
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    }
                    onClick={() => setIsRunning(!isRunning)}
                  >
                    {isRunning ? "AUTO STOP" : "AUTO START"}
                  </Button>
                  <Button variant="secondary" onClick={handleConfigureClick}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Configure Devices
                  </Button>
                </div>
              </div>
            </div>

            {/* Middle Column - Temperature and Flow */}
            <div className="space-y-6 grain-element">
              <Card className="p-4 bg-white dark:bg-black dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4 text-black dark:text-white">
                  Temperature Control
                </h3>
                <div className="space-y-4">
                  <TemperatureDisplay
                    label="T0 = Supply Air Temp."
                    value={temperatures.t0}
                  />
                  <TemperatureDisplay
                    label="T1 = Cold Air Temp."
                    value={temperatures.t1}
                  />
                  <TemperatureDisplay
                    label="T2 = Ambient Air Temp."
                    value={temperatures.t2}
                  />
                </div>
              </Card>

              <Card className="p-4 bg-white dark:bg-black dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4 text-black dark:text-white">
                  Blower Status
                </h3>
                <div className="relative w-32 h-32 mx-auto">
                  <div className="absolute inset-0 rounded-full border-8 border-green-200" />
                  <div
                    className="absolute inset-0 rounded-full border-8 border-green-500"
                    style={{
                      clipPath: `polygon(0 0, 100% 0, 100% ${blowerPower}%, 0 ${blowerPower}%)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-black dark:text-white">
                      {blowerPower}%
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Fan Controls */}
            <div className="grain-element">
              <Card className="p-4 h-full bg-white dark:bg-black dark:border-gray-700">
                <h3 className="text-lg font-medium mb-4 text-black dark:text-white">
                  Fan Controls
                </h3>
                <div className="space-y-6">
                  {fanStatuses.map((status, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="font-medium text-black dark:text-white">
                        Fan {index + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            status ? "bg-green-500" : "bg-gray-300"
                          }`}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newStatuses = [...fanStatuses];
                            newStatuses[index] = !newStatuses[index];
                            setFanStatuses(newStatuses);
                          }}
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6 bg-white dark:bg-black">
          <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
            Configure Devices
          </h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                Device Name
              </label>
              <input
                type="text"
                className="border rounded p-2 w-full bg-white dark:bg-black text-black dark:text-white"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-black dark:text-white">
                Settings
              </label>
              <input
                type="text"
                className="border rounded p-2 w-full bg-white dark:bg-black text-black dark:text-white"
              />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
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
