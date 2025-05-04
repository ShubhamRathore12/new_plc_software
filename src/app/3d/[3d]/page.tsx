"use client";

import { useState, useEffect } from "react";
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
import { format } from "@/lib/utils";

import Dashboard3D from "@/components/Dashbaord3d";
import PressureChart from "@/components/charts/PressureChart";
import TemperatureChart from "@/components/charts/TemperatureChart";
import HeatChart from "@/components/charts/HeatChart";
import BoilerChart from "@/components/charts/BoilerChart";
import MetricsPanel from "@/components/MetriPanel";
import RadarChart from "@/components/charts/RadarChart";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAutoData } from "@/hooks/useAutoData";

const Index = () => {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();
  const [is3D, setIs3D] = useState(true); // toggle state

  const devices = useParams();
  const param = devices["3d"];

  const { data, isConnected, error, formatValue } = useAutoData(
    param as string
  );

  const {
    AI_TH_Act,
    AI_AIR_OUTLET_TEMP,
    AI_COLD_AIR_TEMP,
    AI_AMBIANT_TEMP,
    AI_COND_PRESSURE,
    AI_SUC_PRESSURE,
    Value_to_Display_HEATER,
    Value_to_Display_AHT_VALE_OPEN,
    Value_to_Display_HOT_GAS_VALVE_OPEN,
    Value_to_Display_EVAP_ACT_SPEED,
    Value_to_Display_COND_ACT_SPEED,
    SETTINGS_Delta_T: deltaTemp,
  } = data || {};

  const handleToggle = (param: any) => {
    if (!is3D) {
      setIs3D(true);
      // navigate to 3D screen
    } else {
      setIs3D(false);
      router.push(`/menu/${param}`);
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
          <button
            onClick={() => handleToggle(param)}
            className="p-2 hover:opacity-75"
          >
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
                    Auto
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
                    Aeration Wihthout Heating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TemperatureChart />
                </CardContent>
              </Card>

              {/* Heat Chart */}
              {/* <Card
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
              </Card> */}
            </div>

            {/* Center: 3D Dashboard Visualization */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 bg-white/90 dark:bg-gray-800/90 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  System Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <Dashboard3D />
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
                    Aeration With Heating
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
            <DialogContent className="sm:max-w-[800px] bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle>
                  {selectedChart === "pressure" && `Auto Mode - ${param}`}
                  {selectedChart === "temperature" &&
                    `Aeration Without Heating - ${param}`}
                  {selectedChart === "boiler" &&
                    `Aeration With Heating - ${param}`}
                </DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                {selectedChart === "pressure" && (
                  <div className="space-y-6">
                    {/* Temperature Values Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Temperature Readings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">TH (Supply Air)</span>
                              <span className="font-medium">
                                {formatValue(
                                  AI_TH_Act || data?.AFTER_HEATER_TEMP_Th
                                )}{" "}
                                °C
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">T0 (After Heat)</span>
                              <span className="font-medium">
                                {formatValue(
                                  AI_AIR_OUTLET_TEMP || data?.AIR_OUTLET_TEMP
                                )}{" "}
                                °C
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">T1 (Cold Air)</span>
                              <span className="font-medium">
                                {formatValue(
                                  AI_COLD_AIR_TEMP || data?.AIR_OUTLET_TEMP
                                )}{" "}
                                °C
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">T2 (Ambient)</span>
                              <span className="font-medium">
                                {formatValue(
                                  AI_AMBIANT_TEMP || data?.AMBIENT_AIR_TEMP_T2
                                )}{" "}
                                °C
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">TH - T1</span>
                              <span className="font-medium">
                                {formatValue(
                                  AI_TH_Act - AI_COLD_AIR_TEMP || data?.Th_T1
                                )}{" "}
                                °C
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">HTR</span>
                              <span className="font-medium">
                                {formatValue(Value_to_Display_HEATER)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">AHT</span>
                              <span className="font-medium">
                                {formatValue(
                                  Value_to_Display_AHT_VALE_OPEN ||
                                    data?.AFTER_HEAT_VALVE_RPM
                                )}
                                %
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">HGS</span>
                              <span className="font-medium">
                                {formatValue(
                                  Value_to_Display_HOT_GAS_VALVE_OPEN ||
                                    data?.HOT_GAS_VALVE_RPM
                                )}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* System Status Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">System Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">BLOWER</span>
                              <span className="font-medium">
                                {formatValue(
                                  Value_to_Display_EVAP_ACT_SPEED ||
                                    data?.BLOWER_RPM
                                )}
                                %
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">COND</span>
                              <span className="font-medium">
                                {formatValue(
                                  Value_to_Display_COND_ACT_SPEED ||
                                    data?.CONDENSER_RPM
                                )}
                                %
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">COMP</span>
                              <span className="font-medium">
                                HP {format(AI_COND_PRESSURE || data?.HP)} LP{" "}
                                {format(AI_SUC_PRESSURE || data?.LP)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Graph Section */}

                    <div className="flex justify-end">
                      <Button
                        onClick={() => router.push(`/menu/auto/${param}`)}
                      >
                        View Detailed Settings
                      </Button>
                    </div>
                  </div>
                )}
                {selectedChart === "temperature" && (
                  <div className="space-y-6">
                    {/* Temperature Values Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Temperature Readings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">T1 (Cold Air)</span>
                              <span className="font-medium">
                                {AI_COLD_AIR_TEMP} °C
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">T2 (Ambient)</span>
                              <span className="font-medium">
                                {AI_AMBIANT_TEMP || data?.AMBIENT_AIR_TEMP_T2}{" "}
                                °C
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">TH</span>
                              <span className="font-medium">
                                {AI_TH_Act || data?.AFTER_HEATER_TEMP_Th} °C
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">BLOWER</span>
                              <span className="font-medium">
                                {Value_to_Display_EVAP_ACT_SPEED ||
                                  data?.BLOWER_RPM}
                                %
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* System Status Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">System Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Aeration Mode</span>
                              <span className="font-medium">
                                Without Heating
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Device</span>
                              <span className="font-medium">{param}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button
                        onClick={() =>
                          router.push(
                            `/menu/aerations/without-heating/${param}`
                          )
                        }
                      >
                        View Detailed Settings
                      </Button>
                    </div>
                  </div>
                )}
                {selectedChart === "boiler" && (
                  <div className="space-y-6">
                    {/* Temperature Values Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          Temperature Readings
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">TH (Supply Air)</span>
                              <span className="font-medium">
                                {AI_TH_Act || data?.AFTER_HEATER_TEMP_Th} °C
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">T2 (Ambient)</span>
                              <span className="font-medium">
                                {AI_AMBIANT_TEMP || data?.AMBIENT_AIR_TEMP_T2}{" "}
                                °C
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Delta(A) Set</span>
                              <span className="font-medium">
                                {deltaTemp || data?.DELTA_SET} °C
                              </span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">BLOWER</span>
                              <span className="font-medium">
                                {Value_to_Display_EVAP_ACT_SPEED ||
                                  data?.BLOWER_RPM}
                                %
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">HTR</span>
                              <span className="font-medium">
                                {Value_to_Display_HEATER}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* System Status Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">System Status</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Aeration Mode</span>
                              <span className="font-medium">With Heating</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Device</span>
                              <span className="font-medium">{param}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-end">
                      <Button
                        onClick={() =>
                          router.push(`/menu/aerations/with-heating/${param}`)
                        }
                      >
                        View Detailed Settings
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </DashboardLayout>
  );
};

export default Index;
