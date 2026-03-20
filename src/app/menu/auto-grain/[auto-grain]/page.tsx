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
import AutoDiagram1 from "@/components/AutoDiagram1";
import { useLanguage } from "@/providers/language-provider";
import { hasMachineFeature } from "@/lib/machineRegistry";

export default function AutoGrainPage() {
  const router = useRouter();
  const { "auto-grain": autoGrain } = useParams();
  const { data, isConnected, error, formatValue } = useAutoData(
    autoGrain as string
  );
  const { t } = useLanguage();

  const isRunning = !!data?.AUTO_PROCESS_PB;
  const isAutoAeration = !!data?.AUTO_AERATION_ENA;

  // Check if Grain_chilling_mode is active (handles both "true" and "True")
  const isGrainChillingMode = String(data?.Grain_chilling_mode)?.toLowerCase() === "true";

  // Derived from centralized registry
  const isBarMachine = hasMachineFeature(autoGrain as string, "isBarMachine");

  // Helper function to convert psi values to bar for display
  const convertPressureToBar = (value: any) => {
    if (isBarMachine) {
      if (value === undefined || value === null) return "--";
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return value;
      const barValue = numericValue * 0.0689476; // 1 psi = 0.0689476 bar
      return barValue;
    }
    return value;
  };

  const machineConfig = {
    "GTPL-132-300-AP-S7-1200": {
      serialNumber: "GTPL_132_GRAIN",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED :{key:'Condenser_fan_speed' ,label:'Cond. Fan'}

      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-136-gT-450AP": {
      serialNumber: "GTPL_136_GRAIN",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED :{key:'Condenser_fan_speed' ,label:'Cond. Fan'}

      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-139-GT-300AP-S7-1200": {
      serialNumber: "GTPL_139_GRAIN",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Condenser_fan_speed", label: "Cond. Fan" }
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-142-gT-450AP-S7-1200": {
      serialNumber: "GTPL_142_GRAIN",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Condenser_fan_speed", label: "Cond. Fan" }
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-123-GT-450AP": {
      serialNumber: "GTPL_123_GRAIN",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Condenser_fan_speed", label: "Cond. Fan" }
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-143-gT-450AP-S7-1200": {
      serialNumber: "GTPL_143_GRAIN",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Condenser_fan_speed", label: "Cond. Fan" }
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
  };

  const currentConfig =
    machineConfig[autoGrain as keyof typeof machineConfig] ||
    machineConfig["GTPL-132-300-AP-S7-1200"];

  const handleBack = () => router.push(`/menu/${autoGrain}`);

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
            <motion.h1 
              className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-3"
              animate={isGrainChillingMode ? {
                scale: [1, 1.05, 1],
                textShadow: [
                  '0 0 0px rgba(59, 130, 246, 0)',
                  '0 0 20px rgba(59, 130, 246, 0.8)',
                  '0 0 0px rgba(59, 130, 246, 0)'
                ]
              } : {
                scale: 1,
                textShadow: '0 0 0px rgba(156, 163, 175, 0)'
              }}
              transition={{
                duration: 2,
                repeat: isGrainChillingMode ? Infinity : 0,
                repeatType: "reverse"
              }}
            >
              {t("GRAIN CHILLING MODE")} - {t("AUTO")}
              <motion.div
                animate={isGrainChillingMode ? {
                  rotate: 360,
                  scale: [1, 1.2, 1]
                } : {
                  rotate: 0,
                  scale: 1
                }}
                transition={{
                  duration: isGrainChillingMode ? 3 : 0.5,
                  repeat: isGrainChillingMode ? Infinity : 0,
                  ease: "linear"
                }}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isGrainChillingMode 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : 'bg-gradient-to-r from-gray-400 to-gray-500'
                }`}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </motion.div>
            </motion.h1>
            <p className="text-muted-foreground">SR. NO. {autoGrain}</p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ 
                opacity: data?.Grain_chilling_mode !== undefined ? 1 : 0, 
                y: data?.Grain_chilling_mode !== undefined ? 0 : 10 
              }}
              className="mt-2 flex items-center gap-2 text-sm"
            >
              <motion.div
                animate={{ 
                  scale: isGrainChillingMode ? [1, 1.2, 1] : 1,
                  backgroundColor: isGrainChillingMode ? '#10b981' : '#ef4444'
                }}
                transition={{ 
                  duration: isGrainChillingMode ? 1 : 0.3, 
                  repeat: isGrainChillingMode ? Infinity : 0 
                }}
                className="w-2 h-2 rounded-full"
              />
              <span className={isGrainChillingMode ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {isGrainChillingMode ? 'Grain Chilling Mode Active' : 'Grain Chilling Mode Inactive'}
              </span>
            </motion.div>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
              <div className="relative w-full h-full">
                {isMobile ? (
                  <Home
                    data={data}
                    formatValue={formatValue}
                    machineName="GTPL-132-300-AP-S7-1200"
                  />
                ) : (
                  <AutoDiagram1
                    blower={Fan}
                    data={data}
                    formatValue={formatValue}
                    machineName="GTPL-132-300-AP-S7-1200"
                  />
                )}
              </div>
            </AnimatedContainer>

            <AnimatedContainer className="space-y-6" delay={2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {t("Temperature")} - {t("Grain Chilling")}
                  </h2>

                  <div className="space-y-3">
                    {Object.entries(currentConfig.temperatureSensors).map(
                      ([key, sensor], index) => {
                        const value = data?.[sensor.key];
                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg"
                          >
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse" />
                              {t(sensor.label)}
                            </span>
                            <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                              {formatValue(value, "°C")}
                            </span>
                          </motion.div>
                        );
                      }
                    )}

                    {Object.entries(currentConfig.controls).map(
                      ([key, control], index) => {
                        let value;
                        if (
                          data?.[control.key] !== undefined &&
                          data?.[control.key] !== null
                        ) {
                          value = data[control.key];
                        }

                        const percentage = parseFloat(value) || 0;

                        return (
                          <motion.div
                            key={key}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.4,
                              delay:
                                (Object.keys(currentConfig.temperatureSensors)
                                  .length +
                                  index) *
                                0.05,
                            }}
                            className="group"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-purple-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                  />
                                </svg>
                                {t(control.label)}
                              </span>
                              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {formatValue(value, "%")}
                              </span>
                            </div>
                            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{
                                  duration: 1,
                                  delay:
                                    (Object.keys(
                                      currentConfig.temperatureSensors
                                    ).length +
                                      index) *
                                      0.05 +
                                    0.3,
                                }}
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full shadow-lg"
                                style={{
                                  boxShadow:
                                    "0 0 10px rgba(168, 85, 247, 0.5)",
                                }}
                              />
                            </div>
                          </motion.div>
                        );
                      }
                    )}

                    {/* Improved HP/LP Display with Pressure Conversion */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-700 hover:shadow-lg transition-all duration-300"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                        {t("LP")}
                      </span>
                      <span className="font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                        {(() => {
                          const lpValue = data?.[currentConfig.compressor.lp];
                          const convertedValue = convertPressureToBar(lpValue);
                          return formatValue(
                            convertedValue !== undefined && convertedValue !== null ? convertedValue : undefined,
                            isBarMachine ? " bar" : "psi"
                          );
                        })()}
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-700 hover:shadow-lg transition-all duration-300"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                        {t("HP")}
                      </span>
                      <span className="font-bold text-lg bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                        {(() => {
                          const hpValue = data?.[currentConfig.compressor.hp];
                          const convertedValue = convertPressureToBar(hpValue);
                          return formatValue(
                            convertedValue !== undefined && convertedValue !== null ? convertedValue : undefined,
                            isBarMachine ? " bar" : "psi"
                          );
                        })()}
                      </span>
                    </motion.div>

                    {/* CR Valve Status — derived from centralized registry */}
                    {hasMachineFeature(autoGrain as string, "hasCRValve") && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.8 }}
                          className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                            CR Valve 25%
                          </span>
                          <span className={`font-bold text-lg ${data?.CR_valve_25_percent_on_Q0_2 ? "text-green-600" : "text-red-600"}`}>
                            {String(data?.CR_valve_25_percent_on_Q0_2)?.toLowerCase() === "true" ? "ON" : "OFF"}
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.85 }}
                          className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                            CR Valve 50%
                          </span>
                          <span className={`font-bold text-lg ${data?.CR_valve_50_percent_on_Q0_3 ? "text-green-600" : "text-red-600"}`}>
                            {String(data?.CR_valve_50_percent_on_Q0_3)?.toLowerCase() === "true" ? "ON" : "OFF"}
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.9 }}
                          className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                            CR Valve 75%
                          </span>
                          <span className={`font-bold text-lg ${data?.CR_valve_75_percent_on_Q2_2 ? "text-green-600" : "text-red-600"}`}>
                            {String(data?.CR_valve_75_percent_on_Q2_2)?.toLowerCase() === "true" ? "ON" : "OFF"}
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.95 }}
                          className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                            CR Valve 100%
                          </span>
                          <span className={`font-bold text-lg ${data?.CR_valve_100_percent_on_Q2_5 ? "text-green-600" : "text-red-600"}`}>
                            {String(data?.CR_valve_100_percent_on_Q2_5)?.toLowerCase() === "true" ? "ON" : "OFF"}
                          </span>
                        </motion.div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Grain-specific controls */}

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
                  {t("BACK")}
                </Button>
              </motion.div>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
