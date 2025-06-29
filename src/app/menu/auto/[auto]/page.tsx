"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { ConnectionStatus } from "@/components/ui/connection-status";
import Home from "@/components/diagram-controls";
import { useAutoData } from "@/hooks/useAutoData";
import AutoDiagram from "@/components/AutoDiagram";
import HVACDashboard from "../../../../components/AutoDiagram";
import Fan from "../../../../../public/images/fan.png";
import useIsMobile from "@/hooks/useIsMobile";
import MobileAutoDiagram from "@/components/MobileAutoDiagram";

export default function AutoPage() {
  const router = useRouter();
  const { auto } = useParams();
  const { data, isConnected, error, formatValue } = useAutoData(auto as string);

  const isRunning = !!data?.AUTO_PROCESS_PB;
  const isAutoAeration = !!data?.AUTO_AERATION_ENA;

  // Configuration for different machines
  const commonS7_200Config = {
    temperatureSensors: {
      TH: { key: "AFTER_HEATER_TEMP_Th", label: "Supply Air(TH)" },
      T0: { key: "AIR_OUTLET_TEMP", label: "After Heat(T0)" },
      T1: { key: "COLD_AIR_TEMP_T1", label: "Cold Air(T1)" },
      T2: { key: "AMBIENT_AIR_TEMP_T2", label: "Ambient(T2)" },
    },
    controls: {
      HTR: { key: "AFTER_HEAT_VALVE_RPM", label: "Heater" },
      AHT: { key: "AFTER_HEAT_VALVE_RPM", label: "After Heat(AHT)" },
      HGS: { key: "HOT_GAS_VALVE_RPM", label: "Hot Gas(HGS)" },
      BLOWER: { key: "BLOWER_RPM", label: "Blower" },
      COND: { key: "CONDENSER_RPM", label: "Condenser" },
    },
    compressor: {
      time: "COMPRESSOR_TIME",
      hp: "HP",
      lp: "LP",
    },
  };

  const machineConfig = {
    "GTPL-122-gT-1000T-S7-1200": {
      serialNumber: "GTPL_122_S7_1200",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        T0SP: { key: "T0_set_point", label: "After Heat(T0 Sp)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        "Delta T": { key: "Delta_T_set_point", label: "Delta T" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-114-gT-140E-S7-1200": {
      serialNumber: "GTPL_114",
      ...commonS7_200Config,
    },
    "GTPL-115-gT-180E-S7-1200": {
      serialNumber: "GTPL_115",
      ...commonS7_200Config,
    },
    "GTPL-116-gT-240E-S7-1200": {
      serialNumber: "GTPL_116",
      ...commonS7_200Config,
    },
    "GTPL-117-gT-320E-S7-1200": {
      serialNumber: "GTPL_117",
      ...commonS7_200Config,
    },
    "GTPL-119-gT-180E-S7-1200": {
      serialNumber: "GTPL_119",
      ...commonS7_200Config,
    },
    "GTPL-120-gT-180E-S7-1200": {
      serialNumber: "GTPL_120",
      ...commonS7_200Config,
    },
    "GTPL-121-gT-1000T-S7-1200": {
      serialNumber: "GTPL_121",
      ...commonS7_200Config,
    },
    "GTPL-118-gT-80E-P-S7-200": {
      serialNumber: "GTPL-109",
      ...commonS7_200Config,
    },
    "GTPL-108-gT-40E-P-S7-200": {
      serialNumber: "GTPL_108",
      ...commonS7_200Config,
    },
    "GTPL-109-gT-40E-P-S7-200": {
      serialNumber: "GTPL_109",
      ...commonS7_200Config,
    },
    "GTPL-110-gT-40E-P-S7-200": {
      serialNumber: "GTPL_110",
      ...commonS7_200Config,
    },
    "GTPL-111-gT-80E-P-S7-200": {
      serialNumber: "GTPL_111",
      ...commonS7_200Config,
    },
    "GTPL-112-gT-80E-P-S7-200": {
      serialNumber: "GTPL_112",
      ...commonS7_200Config,
    },
    "GTPL-113-gT-80E-P-S7-200": {
      serialNumber: "GTPL_113",
      ...commonS7_200Config,
    },
    "Gtpl-S7-1200-02": {
      serialNumber: "GTOL-1023",
      temperatureSensors: {
        TH: { key: "AI_TH_Act", label: "Supply Air" },
        T0: { key: "AI_AIR_OUTLET_TEMP", label: "After Heat" },
        T1: { key: "AI_COLD_AIR_TEMP", label: "Cold Air" },
        T2: { key: "AI_AMBIANT_TEMP", label: "Ambient" },
      },
      controls: {
        HTR: { key: "Value_to_Display_HEATER", label: "Heater" },
        AHT: { key: "Value_to_Display_AHT_VALE_OPEN", label: "After Heat" },
        HGS: { key: "Value_to_Display_HOT_GAS_VALVE_OPEN", label: "Hot Gas" },
        BLOWER: { key: "Value_to_Display_EVAP_ACT_SPEED", label: "Blower" },
        COND: { key: "Value_to_Display_COND_ACT_SPEED", label: "Condenser" },
      },
      compressor: {
        time: "COMPRESSOR_TIME",
        hp: "AI_COND_PRESSURE",
        lp: "AI_SUC_PRESSURE",
      },
    },
  };

  const currentConfig =
    machineConfig[auto as keyof typeof machineConfig] ||
    machineConfig["GTPL-122-gT-1000T-S7-1200"];

  const handleBack = () => router.push(`/menu/${auto}`);

  const handleStart = async () => {
    await fetch("/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "START", tag: "AUTO_PROCESS_PB" }),
    });
  };

  const handleStop = async () => {
    await fetch("/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "STOP", tag: "AUTO_PROCESS_STOP_PB" }),
    });
  };

  const handleToggleAutoAeration = async (checked: boolean) => {
    await fetch("/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: checked ? "ENABLE" : "DISABLE",
        tag: "AUTO_AERATION_ENA",
      }),
    });
  };

  const isMobile = useIsMobile();

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <ConnectionStatus isConnected={isConnected} error={error} />
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              SELECT AUTO
            </h1>
            <p className="text-muted-foreground">
              SR. NO. {auto} | {formatValue(data?.AI_RH_Analog_Scale, "%")} RH |{" "}
              {formatValue(data?.AI_Pa_Analog_Scale, " Pa")}
            </p>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
              <div className="relative w-full h-full">
                {/* <Home
                  data={data}
                  formatValue={formatValue}
                  machineName={auto}
                /> */}
                {isMobile ? (
                  <MobileAutoDiagram
                    blower={Fan}
                    data={data}
                    formatValue={formatValue}
                    machineName={auto}
                  />
                ) : (
                  <HVACDashboard
                    blower={Fan}
                    data={data}
                    formatValue={formatValue}
                    machineName={auto}
                  />
                )}
              </div>
            </AnimatedContainer>

            <AnimatedContainer className="space-y-6" delay={2}>
              {/* <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">System Status</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Heater</span>
                      <span className="text-sm font-medium">%</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: 2.2 }}
                    >
                      <Progress value={90} className="h-2" />
                    </motion.div>
                    <Badge>{isRunning ? "Running" : "Stopped"}</Badge>
                  </div>
                </CardContent>
              </Card> */}

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Temperature</h2>
                  <div className="space-y-2">
                    {Object.entries(currentConfig.temperatureSensors).map(
                      ([key, sensor]) => (
                        <div key={key} className="flex justify-between">
                          <span>{sensor.label}</span>
                          <span className="font-medium">
                            {formatValue(data?.[sensor.key], "°C")}
                          </span>
                        </div>
                      )
                    )}
                    {/* <div className="flex justify-between">
                      <span>TH - T1</span>
                      <span className="font-medium">
                        {formatValue(data.AI_TH_Act || data?.Th_T1, "°C")}
                      </span>
                    </div> */}
                    {Object.entries(currentConfig.controls).map(
                      ([key, control]) => (
                        <div key={key} className="flex justify-between">
                          <span>{control.label}</span>
                          <span className="font-medium">
                            {formatValue(data?.[control.key], "%")}
                          </span>
                        </div>
                      )
                    )}
                    <div className="flex justify-between">
                      <span className="font-medium">
                        HP {formatValue(data?.[currentConfig.compressor.hp])} LP{" "}
                        {formatValue(data?.[currentConfig.compressor.lp])}
                      </span>
                    </div>

                    {/* <div className="flex justify-between">
                      <span>Mode Status</span>
                      <span className="font-medium">
                        {formatValue(data?.mode_status, "%")}
                      </span>
                    </div> */}
                    {/* <div className="flex justify-between">
                      <span>Water Pressure</span>
                      <span className="font-medium">
                        {formatValue(data?.water_pressure, "%")}
                      </span>
                    </div> */}
                  </div>
                </CardContent>
              </Card>

              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.6 }}
              >
                {!isRunning ? (
                  <Button className="flex-1" onClick={handleStart}>
                    START
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleStop}
                  >
                    STOP
                  </Button>
                )}

                {auto === "Gtpl-S7-1200-02" && (
                  <div className="flex items-center gap-2">
                    <Switch
                      id="auto-aeration"
                      checked={isAutoAeration}
                      onCheckedChange={handleToggleAutoAeration}
                    />
                    <label htmlFor="auto-aeration" className="text-sm">
                      Auto Aeration
                    </label>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.7 }}
              >
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleBack}
                >
                  BACK
                </Button>
              </motion.div>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
