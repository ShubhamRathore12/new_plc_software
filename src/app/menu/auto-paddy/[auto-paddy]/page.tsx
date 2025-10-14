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

export default function AutoPaddyPage() {
  const router = useRouter();
  const { "auto-paddy": autoPaddy } = useParams();
  const { data, isConnected, error, formatValue } = useAutoData(
    autoPaddy as string
  );
  const { t } = useLanguage();

  const isRunning = !!data?.AUTO_PROCESS_PB;
  const isAutoAeration = !!data?.AUTO_AERATION_ENA;

 

  const machineConfig = {
    "GTPL-132-300-AP-S7-1200": {
      serialNumber: "GTPL_132_PADDY",
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
  };

  const currentConfig =
    machineConfig[autoPaddy as keyof typeof machineConfig] ||
    machineConfig["GTPL-132-300-AP-S7-1200"];

  const handleBack = () => router.push(`/menu/${autoPaddy}`);

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
              {t("PADDY AGEING MODE")} - {t("AUTO")}
            </h1>
            <p className="text-muted-foreground">SR. NO. {autoPaddy}</p>
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
                    {t("Temperature")} - {t("Paddy Chilling")}
                  </h2>

                  <div className="space-y-2">
                    {/* Temperature sensors */}
                    {Object.entries(currentConfig.temperatureSensors).map(
                      ([key, sensor]) => {
                        const value = data?.[sensor.key];
                        return (
                          <div key={key} className="flex justify-between">
                            <span>{t(sensor.label)}</span>
                            <span className="font-medium">
                              {formatValue(value, "°C")}
                            </span>
                          </div>
                        );
                      }
                    )}

                    {/* Controls */}
                    {Object.entries(currentConfig.controls).map(
                      ([key, control]) => {
                        return (
                          <div key={key} className="flex justify-between">
                            <span>{t(control.label)}</span>
                            <span className="font-medium">
                              {formatValue(data?.[control.key], "%")}
                            </span>
                          </div>
                        );
                      }
                    )}

                    {/* Compressor values */}
                    <div className="flex justify-between">
                      <span>{t("LP")}</span>
                      <span className="font-medium">
                        {formatValue(data?.[currentConfig.compressor.lp])}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span>{t("HP")}</span>
                      <span className="font-medium">
                        {formatValue(data?.[currentConfig.compressor.hp])}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Paddy-specific controls */}

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
