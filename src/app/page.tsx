"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Settings,
  Moon,
  Sun,
  ChevronDown,
  Thermometer,
  Gauge,
  Flame,
  Activity,
  BarChart3,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Dashboard3D from "@/components/Dashbaord3d";
import PressureChart from "@/components/charts/PressureChart";
import TemperatureChart from "@/components/charts/TemperatureChart";
import HeatChart from "@/components/charts/HeatChart";
import BoilerChart from "@/components/charts/BoilerChart";
import MetricsPanel from "@/components/MetriPanel";
import RadarChart from "@/components/charts/RadarChart";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useRouter } from "next/navigation";

const Index = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();
  const [is3D, setIs3D] = useState(true); // toggle state

  const handleToggle = () => {
    if (!is3D) {
      setIs3D(true);
      // navigate to 3D screen
    } else {
      setIs3D(false);
      router.push("/menu");
      // staying on 2D (menu) view
    }
  };

  const handleChartClick = (chartType: string) => {
    setSelectedChart(chartType);
    setOpenDialog(true);
  };

  return (
    <DashboardLayout>
      <div
        className={`min-h-screen flex flex-col bg-blue-50 dark:bg-gray-900 transition-colors duration-200 ${
          theme === "dark" ? "dark" : ""
        }`}
      >
        {/* Header */}
        <div className="absolute right-0 top-0 flex items-center space-x-2 mb-10">
          <span className="text-sm font-medium text-muted-foreground">
            {is3D ? "3D" : "2D"}
          </span>
          <button onClick={handleToggle} className="p-2 hover:opacity-75">
            {is3D ? (
              <ToggleRight className="h-6 w-6 text-primary" />
            ) : (
              <ToggleLeft className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>
        <main className="flex-1 p-4 md:p-6 mt-10">
          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pressure Chart */}
            <Card
              className="bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-800 cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handleChartClick("pressure")}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Gauge className="w-4 h-4 mr-2" />
                  Pressure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PressureChart />
              </CardContent>
            </Card>

            {/* Temperature Chart */}
            <Card
              className="bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-800 cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handleChartClick("temperature")}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Thermometer className="w-4 h-4 mr-2" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <TemperatureChart />
              </CardContent>
            </Card>

            {/* Heat Chart */}
            <Card
              className="bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-800 cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handleChartClick("heat")}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Flame className="w-4 h-4 mr-2" />
                  Heat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <HeatChart />
              </CardContent>
            </Card>

            {/* Boiler Chart */}
            <Card
              className="bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-800 cursor-pointer transform transition-all hover:scale-[1.02] hover:shadow-lg"
              onClick={() => handleChartClick("boiler")}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="w-4 h-4 mr-2" />
                  Boiler
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BoilerChart />
              </CardContent>
            </Card>

            {/* 3D Dashboard Visualization - spans 2 columns on larger screens */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Dashboard3D />
              </CardContent>
            </Card>

            {/* Metrics Panel */}
            <Card className="col-span-1 md:col-span-2 lg:col-span-2 bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  System Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MetricsPanel />
              </CardContent>
            </Card>
          </div>

          {/* Bottom bar with Radar Chart */}
          <div className="mt-4">
            <Card className="bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">
                    System Diagnostics
                  </CardTitle>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    LAST 24 HOURS
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[200px]">
                <RadarChart />
              </CardContent>
            </Card>
          </div>

          {/* Detail Dialog */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle>
                  {selectedChart === "pressure" && "Pressure Details"}
                  {selectedChart === "temperature" && "Temperature Details"}
                  {selectedChart === "heat" && "Heat Details"}
                  {selectedChart === "boiler" && "Boiler Details"}
                </DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                <TabsContent value="overview">
                  <div className="h-[300px]">
                    {selectedChart === "pressure" && <PressureChart detailed />}
                    {selectedChart === "temperature" && (
                      <TemperatureChart detailed />
                    )}
                    {selectedChart === "heat" && <HeatChart detailed />}
                    {selectedChart === "boiler" && <BoilerChart detailed />}
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        CURRENT
                      </div>
                      <div className="text-lg font-bold">
                        {selectedChart === "pressure" && "75%"}
                        {selectedChart === "temperature" && "72°C"}
                        {selectedChart === "heat" && "85%"}
                        {selectedChart === "boiler" && "Active"}
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        AVERAGE
                      </div>
                      <div className="text-lg font-bold">
                        {selectedChart === "pressure" && "68%"}
                        {selectedChart === "temperature" && "68°C"}
                        {selectedChart === "heat" && "76%"}
                        {selectedChart === "boiler" && "92%"}
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        STATUS
                      </div>
                      <div className="text-lg font-bold text-green-500">
                        Normal
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="analytics">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">
                          Performance Analysis
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          System is performing within optimal parameters with no
                          significant outliers.
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                        <h3 className="text-sm font-medium mb-2">
                          Efficiency Rating
                        </h3>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 h-2 rounded-full">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: "87%" }}
                            ></div>
                          </div>
                          <span className="ml-2 text-sm font-medium">87%</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-sm font-medium mb-2">
                        Recommendations
                      </h3>
                      <ul className="list-disc list-inside text-sm text-gray-500 dark:text-gray-400">
                        <li>Routine maintenance scheduled for next week</li>
                        <li>Consider optimizing afternoon heat cycle</li>
                        <li>Sensor calibration due in 14 days</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="history">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium">Historical Data</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          Day
                        </Button>
                        <Button variant="outline" size="sm">
                          Week
                        </Button>
                        <Button variant="outline" size="sm">
                          Month
                        </Button>
                      </div>
                    </div>
                    <div className="h-[200px]">
                      {/* For simplicity, we'll reuse the same charts */}
                      {selectedChart === "pressure" && (
                        <PressureChart detailed />
                      )}
                      {selectedChart === "temperature" && (
                        <TemperatureChart detailed />
                      )}
                      {selectedChart === "heat" && <HeatChart detailed />}
                      {selectedChart === "boiler" && <BoilerChart detailed />}
                    </div>
                    <div className="bg-blue-50 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        KEY EVENTS
                      </div>
                      <div className="text-sm">
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 py-2">
                          <span>Maintenance</span>
                          <span>2023-09-15</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 dark:border-gray-600 py-2">
                          <span>Calibration</span>
                          <span>2023-08-22</span>
                        </div>
                        <div className="flex justify-between py-2">
                          <span>System Upgrade</span>
                          <span>2023-07-03</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Index;
