"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Wind, Timer } from "lucide-react";
import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import Im from "../../../../../../public/images/new2.png";
import Im1 from "../../../../../../public/images/4.png";
import Image from "next/image";
import { format } from "@/lib/utils";
import { useAutoData } from "@/hooks/useAutoData"; // ✅ USE HOOK
import Home from "@/components/aeartionheating-control";


export default function AerationWithHeatingPage() {
  const router = useRouter();
  const heat = useParams();
  const devices = heat["with-heating"];

  const { data, isConnected, error, formatValue } = useAutoData(devices as string); // ✅ FETCH VIA HOOK

  const [isRunning, setIsRunning] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [runningTime, setRunningTime] = useState({ hours: 0, minutes: 0 });
  const [duration, setDuration] = useState(12);
  const [deltaTemp, setDeltaTemp] = useState(8);
  const [runningHours, setRunningHours] = useState(0);
  const [runningMinutes, setRunningMinutes] = useState(0);

  const {
    AI_RH_Analog_Scale,
    AI_AMBIANT_TEMP,
    AI_TH_Act,
    HEATING_MODE_SET_TH_FOR_HEATING_MODE,
    HEATING_MODE_Continuous_Mode,
    Value_to_Display_EVAP_ACT_SPEED,
    Value_to_Display_HEATER,
  } = data || {};

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isRunning) {
      interval = setInterval(() => {
        setRunningTime((prev) => {
          const newMinutes = prev.minutes + 1;
          if (newMinutes >= 60) {
            return { hours: prev.hours + 1, minutes: 0 };
          }
          return { ...prev, minutes: newMinutes };
        });
      }, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => {
    setIsRunning(false);
    setRunningTime({ hours: 0, minutes: 0 });
  };
  const handleBack = () => router.push(`/menu/${devices}`);

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              AERATION WITH HEATING
            </h1>
            {!isConnected && (
              <Badge variant="destructive">
                Disconnected from PLC – attempting reconnect...
              </Badge>
            )}
            {error && <Badge variant="destructive">{error}</Badge>}
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
            <Home
                data={data}
                devices={devices}
                heat={heat}
                title="AERATION W/O HEATING"
                formatValue={formatValue}
              />
            </AnimatedContainer>

            <AnimatedContainer className="space-y-6" delay={2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Aeration Control</h2>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="continuous-mode"
                        checked={continuousMode}
                        onCheckedChange={setContinuousMode}
                      />
                      <Label htmlFor="continuous-mode">CONTINUOUS MODE</Label>
                    </div>

                    {!continuousMode && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Label className="mb-2 block">Set Duration</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={ HEATING_MODE_Continuous_Mode}
                            onChange={(e) =>
                              setDuration(Number.parseInt(e.target.value) || 0)
                            }
                            className="w-16"
                            min={1}
                            max={24}
                          />
                          <span>h</span>
                        </div>
                      </motion.div>
                    )}

                    <div>
                      <Label className="mb-2 block">Delta(A)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={HEATING_MODE_SET_TH_FOR_HEATING_MODE}
                          onChange={(e) =>
                            setDeltaTemp(Number.parseInt(e.target.value) || 0)
                          }
                          className="w-16"
                          min={1}
                          max={15}
                        />
                        <span>°C</span>
                      </div>
                    </div>

                    <Label className="mb-2 block">Running Time</Label>
                    <div className="flex items-center space-x-4">
                      <Input
                        type="number"
                        value={data?.RUNNING_HOUR1||runningHours}
                        onChange={(e) =>
                          setRunningHours(Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16"
                        min={0}
                        max={23}
                      />
                      <span>h</span>
                      <Input
                        type="number"
                        value={data?.RUNNING_MINUTE1 ||runningMinutes}
                        onChange={(e) =>
                          setRunningMinutes(Number.parseInt(e.target.value) || 0)
                        }
                        className="w-16"
                        min={0}
                        max={59}
                      />
                      <span>min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Temperature</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>TH (Supply Air)</span>
                      <span className="font-medium">{formatValue(AI_TH_Act || data?.AFTER_HEATER_TEMP_Th, "°C")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>T2 (Ambient)</span>
                      <span className="font-medium">{formatValue(AI_AMBIANT_TEMP ||data?.AMBIENT_AIR_TEMP_T2, "°C")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>BLOWER</span>
                      <span className="font-medium">{formatValue(Value_to_Display_EVAP_ACT_SPEED, "%")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>HTR</span>
                      <span className="font-medium">{formatValue(Value_to_Display_HEATER, "%")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.2 }}
              >
                {!isRunning ? (
                  <Button className="flex-1 gap-2" onClick={handleStart}>
                    <Wind className="h-4 w-4" />
                    AERATION START
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={handleStop}
                  >
                    <Timer className="h-4 w-4" />
                    AERATION STOP
                  </Button>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.3 }}
              >
                <Button variant="outline" className="w-full" onClick={handleBack}>
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
