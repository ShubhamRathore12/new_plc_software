"use client";

import { useState } from "react";
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

export default function AutoPage() {
  const router = useRouter();
  const { auto } = useParams();
  const { data, isConnected, error, formatValue } = useAutoData(auto as string);

  const isRunning = !!data?.AUTO_PROCESS_PB;
  const isAutoAeration = !!data?.AUTO_AERATION_ENA;

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
              SR. NO. GTPL-{auto == "S7-1200" ? "075" : "109"} |{" "}
              {formatValue(data?.AI_RH_Analog_Scale, "%")} RH |{" "}
              {formatValue(data?.AI_Pa_Analog_Scale, " Pa")}
            </p>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
              <div className="relative w-full h-full">
                <Home data={data} formatValue={formatValue} />
              </div>
            </AnimatedContainer>

            <AnimatedContainer className="space-y-6" delay={2}>
              <Card>
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
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Temperature</h2>
                  <div className="space-y-2">
                    {[
                      [
                        "TH (Supply Air)",
                        formatValue(
                          data?.AI_TH_Act || data?.AFTER_HEATER_TEMP_Th,
                          "°C"
                        ),
                      ],
                      [
                        "T0 (After Heat)",
                        formatValue(
                          data?.AI_AIR_OUTLET_TEMP || data?.AIR_OUTLET_TEMP,
                          "°C"
                        ),
                      ],
                      [
                        "T1 (Cold Air)",
                        formatValue(
                          data?.AI_COLD_AIR_TEMP || data?.T1_SET_POINT,
                          "°C"
                        ),
                      ],
                      [
                        "T2 (Ambient)",
                        formatValue(
                          data?.AI_AMBIANT_TEMP || data?.AMBIENT_AIR_TEMP_T2,
                          "°C"
                        ),
                      ],
                      [
                        "TH - T1",
                        formatValue(
                          (data?.AI_TH_Act || 0) -
                            (data?.AI_COLD_AIR_TEMP || 0),
                          "°C"
                        ),
                      ],
                      [
                        "HTR",
                        formatValue(
                          data?.Value_to_Display_HEATER ||
                            data?.AFTER_HEAT_VALVE_RPM,
                          "%"
                        ),
                      ],
                      [
                        "AHT",
                        formatValue(data?.Value_to_Display_AHT_VALE_OPEN, "%"),
                      ],
                      [
                        "HGS",
                        formatValue(
                          data?.Value_to_Display_HOT_GAS_VALVE_OPEN ||
                            data?.HOT_GAS_VALVE_RPM,
                          "%"
                        ),
                      ],
                      [
                        "BLOWER",
                        formatValue(
                          data?.Value_to_Display_EVAP_ACT_SPEED ||
                            data?.BLOWER_RPM,
                          "%"
                        ),
                      ],
                      [
                        "COMP",
                        `HP ${formatValue(
                          data?.AI_COND_PRESSURE || data?.HP
                        )} LP ${formatValue(
                          data?.AI_SUC_PRESSURE ||
                            data?.LP ||
                            data?.COMPRESSOR_TIME
                        )}`,
                      ],
                      [
                        "COND",
                        formatValue(
                          data?.Value_to_Display_COND_ACT_SPEED ||
                            data?.CONDENSER_RPM,
                          "%"
                        ),
                      ],
                      [
                        "Mode Status",
                        formatValue(
                          data?.mode_status || data?.mode_status,
                          "%"
                        ),
                      ],
                      [
                        "Water Pressure",
                        formatValue(
                          data?.water_pressure || data?.water_pressure,
                          "%"
                        ),
                      ],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between">
                        <span>{label}</span>
                        <span className="font-medium">{val}</span>
                      </div>
                    ))}
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

                {auto === "S7-700" && (
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
