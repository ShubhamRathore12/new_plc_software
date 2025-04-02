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

// import Dashboard3D from "@/components/Dashbaord3d";
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
            {/* Left Side: Pressure, Temperature, and Heat Chart */}
            <div className="space-y-4">
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
            </div>

            {/* Center: 3D Dashboard Visualization */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* <Dashboard3D /> */}
              </CardContent>
            </div>

            {/* Right Side: Boiler Chart and Metrics Panel */}
            <div className="space-y-4">
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
                </TabsContent>
                <TabsContent value="analytics">
                  <div className="space-y-4">
                    {/* Analytics content here */}
                  </div>
                </TabsContent>
                <TabsContent value="history">
                  <div className="space-y-4">{/* History content here */}</div>
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
