"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Wind, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { motion } from "framer-motion";

import { useAutoData } from "@/hooks/useAutoData";
import Home from "@/components/aeration-control";
import AerationwithHeating from "@/components/AerationwithHeating";
import useIsMobile from "@/hooks/useIsMobile";
import { useLanguage } from "@/providers/language-provider";

export default function AerationWithoutHeatingPage() {
  const router = useRouter();
  const heat = useParams();
  const devices = heat["without-heating"];
  const { data, isConnected, error, formatValue } = useAutoData(
    devices as string
  );

  const [duration, setDuration] = useState(12);
  const [runningHours, setRunningHours] = useState(0);
  const [runningMinutes, setRunningMinutes] = useState(0);
  const {t} = useLanguage()

  const isRunning =
    data?.AERATION_WITHOUT_HEATER_START || data?.Aeration_start == 1;
  const continuousMode = data?.CONTINUOUS_MODE || data?.Continuous_mode == 1;

  const handleBack = () => {
    router.push(`/menu/${devices}`);
  };

  const {
    AI_AMBIANT_TEMP,
    AI_COLD_AIR_TEMP,
    AI_TH_Act,
    AI_RH_Analog_Scale,
    HEATING_MODE_Continuous_Mode,
    Value_to_Display_EVAP_ACT_SPEED,
    Aeration_duration_set,
    Running_time_hour,
    Running_time_minute,
    Continuous_mode,
    Aeration_start,
    Aeration_stop,
  } = data || {};

  const isMobile = useIsMobile();

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {String(devices)?.endsWith("1200")
                ? t("AERATION")
                : t("AERATION W/O HEATING")}
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
              {isMobile ? (
                <Home
                  data={data}
                  devices={devices}
                  heat={heat}
                  title="AERATION W/O HEATING"
                  formatValue={formatValue}
                />
              ) : (
                <AerationwithHeating
                  data={data}
                  machineName={devices}
                  heat={heat}
                  title="AERATION W/O HEATING"
                  formatValue={formatValue}
                />
              )}
              {/* <Home
                data={data}
                devices={devices}
                heat={heat}
                title="AERATION W/O HEATING"
                formatValue={formatValue}
              /> */}
            </AnimatedContainer>

            <AnimatedContainer className="space-y-6" delay={2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {t("Aeration Control")}
                  </h2>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                      className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse" />
                        {t("CONTINUOUS MODE")}
                      </span>
                      <Switch
                        id="continuous-mode"
                        checked={continuousMode}
                        disabled
                      />
                    </motion.div>

                    {devices === "GTPL-115-gT-180E-S7-1200" ? null : (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
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
                            {t("Set Duration")}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={
                                data?.SET_DURATION || data?.Aeration_duration_set
                              }
                              onChange={(e) =>
                                setDuration(
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16"
                              min={1}
                              max={24}
                            />
                            <span>{t("h")}</span>
                          </div>
                        </div>
                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${Math.min(Math.max((duration / 24) * 100, 0), 100)}%`,
                            }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full shadow-lg"
                            style={{
                              boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)",
                            }}
                          />
                        </div>
                      </motion.div>
                    )}

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                            />
                          </svg>
                          {t("Running Time")}
                        </span>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={
                                data?.RUNNING_HOUR1 || data?.Running_time_hour
                              }
                              onChange={(e) =>
                                setRunningHours(
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16"
                              min={0}
                              max={23}
                            />
                            <span>{t("h")}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              value={
                                data?.RUNNING_MINUTE1 ||
                                data?.Running_time_minute
                              }
                              onChange={(e) =>
                                setRunningMinutes(
                                  Number.parseInt(e.target.value) || 0
                                )
                              }
                              className="w-16"
                              min={0}
                              max={59}
                            />
                            <span>{t("min")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              Math.min(
                                Math.max(
                                  ((runningHours * 60 + runningMinutes) /
                                    (24 * 60)) *
                                    100,
                                  0
                                ),
                                100
                              ) || 0
                            }%`,
                          }}
                          transition={{ duration: 1, delay: 0.6 }}
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 rounded-full shadow-lg"
                          style={{
                            boxShadow: "0 0 10px rgba(249, 115, 22, 0.5)",
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    {t("Temperature")}
                  </h2>
                  <div className="space-y-3">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.05 }}
                      className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse" />
                        {(
                          devices === "GTPL-124-GT-450T-S7-1200" ||
                          devices === "GTPL-122-gT-1000T-S7-1200" ||
                          devices === "GTPL-121-gT-1000T-S7-1200" ||
                          devices === "GTPL-132-300-AP-S7-1200" ||
                          devices === "GTPL-137-GT-450T-S7-1200" ||
                          devices === "GTPL-138-GT-450T-S7-1200" ||
                          devices === "GTPL-136-gT-450AP" ||
                          devices === "GTPL-134-gT-450T-S7-1200" ||
                          devices === "GTPL-135-gT-450T-S7-1200" ||
                          devices === "GTPL-145-gT-450T-S7-1200" ||
                          devices === "GTPL-148-gT-450T-S7-1200" ||
                          devices === "GTPL-061-gT-450T-S7-1200"
                        )
                          ? t("T0")
                          : t("TH")}{" "}
                        ({t("After Heat")})
                      </span>
                      <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {formatValue(
                          AI_TH_Act ||
                            data?.AFTER_HEATER_TEMP_Th ||
                            data?.Heater_speed ||
                            data?.TH_temp_mean ||
                            data?.T0_temp_mean,
                          "°C"
                        )}
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg"
                    >
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse" />
                        {t("Ambient(T2)")}
                      </span>
                      <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {formatValue(
                          AI_AMBIANT_TEMP ||
                            data?.AMBIENT_AIR_TEMP_T2 ||
                            data?.T2_temp_mean,
                          "°C"
                        )}
                      </span>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.15 }}
                      className="group"
                    >
                      {(() => {
                        const blowerValue =
                          Value_to_Display_EVAP_ACT_SPEED ??
                          data?.BLOWER_RPM ??
                          data?.Blower_speed;
                        const percentage =
                          parseFloat(blowerValue as any) || 0;

                        return (
                          <>
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
                                {t("Blower")}
                              </span>
                              <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                {formatValue(
                                  blowerValue !== undefined &&
                                    blowerValue !== null
                                    ? blowerValue
                                    : undefined,
                                  "%"
                                )}
                              </span>
                            </div>
                            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full shadow-lg"
                                style={{
                                  boxShadow:
                                    "0 0 10px rgba(168, 85, 247, 0.5)",
                                }}
                              />
                            </div>
                          </>
                        );
                      })()}
                    </motion.div>
                  </div>
                </CardContent>
              </Card>

              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.2 }}
              >
                {isRunning ? (
                  <Button variant="destructive" className="flex-1 gap-2">
                    <Timer className="h-4 w-4" />
                    AERATION STOP
                  </Button>
                ) : (
                  <Button className="flex-1 gap-2">
                    <Wind className="h-4 w-4" />
                    AERATION START
                  </Button>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.3 }}
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
