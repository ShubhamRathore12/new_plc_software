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
import { useRouter } from "next/navigation";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";

export default function AerationWithHeatingPage() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [continuousMode, setContinuousMode] = useState(false);
  const [runningTime, setRunningTime] = useState({ hours: 0, minutes: 0 });
  const [duration, setDuration] = useState(12);
  const [deltaTemp, setDeltaTemp] = useState(8);
  const [data, setData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("/api/getData");

    eventSource.onmessage = (event) => {
      const newRow = JSON.parse(event.data);
      setData(() => [newRow]);
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [data, setLoading]);

  const {
    AHT_PID_Config_OutputLowerLimit,
    AHT_PID_Config_OutputUpperLimit,
    AHT_PID_Input,
    AHT_PID_Input_PER,
    AHT_PID_ManualEnable,
    AHT_PID_ManualValue,
    AHT_PID_Output,
    AHT_PID_Retain_CtrlParams_Gain,
    AHT_PID_Retain_CtrlParams_Td,
    AHT_PID_Retain_CtrlParams_Ti,
    AHT_PID_ScaledInput,
    AHT_PID_Setpoint,
    AHT_VALVE,
    AIR_OUTLET_TEMPERATURE,
    AIR_OUTLET_TEMPERATURE_1,
    AI_AIR_OUTLET_TEMP,
    AI_AMBIANT_TEMP,
    AI_COLD_AIR_TEMP,
    AI_COND_PRESSURE,
    AI_Pa_Analog_Scale,
    AI_RH_Analog_Scale,
    AI_SUC_PRESSURE,
    AI_TH_Act,
    AI_air_out_1,
    AI_air_out_2,
    AI_ambiant_1,
    AI_ambiant_2,
    AI_cold_air_1,
    AI_cold_air_2,
    AI_th2,
    AI_th_1,
    ALARM_DB_ALARM_SET_2,
    ALARM_DB_ALARM_SET_3,
    ALARM_DB_ALARM_SET_4,
    AMBIENT_AIR_TEMPERATURE,
    AMB_TEMP_HMI,
    AUTO__COND_FAN_START,
    BLOWER_PID_Config_OutputLowerLimit,
    BLOWER_PID_Config_OutputUpperLimit,
    BLOWER_PID_Input,
    BLOWER_PID_ManualEnable,
    BLOWER_PID_ManualValue,
    BLOWER_PID_Output,
    BLOWER_PID_Retain_CtrlParams_Gain,
    BLOWER_PID_Retain_CtrlParams_Td,
    BLOWER_PID_Retain_CtrlParams_Ti,
    BLOWER_PID_ScaledInput,
    BLOWER_PID_Setpoint,
    BUZZER_ON,
    COL_AIR_FAN_Hz,
    CONDENSER_PRESSURE,
    COND_FAN_Hz,
    COND_PID_Config_OutputLowerLimit,
    COND_PID_Config_OutputUpperLimit,
    COND_PID_Output,
    COND_PID_Output_PER,
    COND_PID_Retain_CtrlParams_Gain,
    COND_PID_Retain_CtrlParams_Td,
    COND_PID_Retain_CtrlParams_Ti,
    COND_PID_ScaledInput,
    COND_PID_Setpoint,
    Compressor_ON,
    Compressor_Oil_too_low,
    Condenser_Fan1_ON,
    Condenser_Fan2_VFD_ON,
    Condenser_fan2_ON,
    Contact_Details_details_1,
    Contact_Details_details_1_0,
    Contact_Details_details_1_1,
    Data_block_1_ALARM_SET_1,
    EVP_PID_Output,
    EVP_SPEED_ON_HMI_EVP_SPEED,
    FAULTS,
    FAULT_RESET,
    FIX_OUTPUT_FOR_BLOWER,
    HAETER_THYRISTOR_ON,
    HEATING_MODE_Aeration_Start_PB_Visiblity_WH,
    HEATING_MODE_Aeration_Start_With_WH,
    HEATING_MODE_Aeration_Start_With_WOH,
    HEATING_MODE_Aeration_Stop_PB_Visiblity_WH,
    HEATING_MODE_Aeration_Stop_With_WH,
    HEATING_MODE_Aeration_Stop_With_WOH,
    HEATING_MODE_Aeration_with_Heating_ENABLE,
    HEATING_MODE_Aeration_without_Heating_ENABLE,
    HEATING_MODE_Areation_Start_PB_Visiblity_WOH,
    HEATING_MODE_Areation_Stop_PB_Visiblity_WOH,
    HEATING_MODE_Continuous_Mode,
    HEATING_MODE_ENABLE_DISABLE,
    HEATING_MODE_Remain_Time_to_Display,
    HEATING_MODE_Remaing_Time_h,
    HEATING_MODE_Remaing_Time_m,
    HEATING_MODE_Remaing_Time_s,
    HEATING_MODE_SET_TH_FOR_HEATING_MODE,
    HEATING_MODE_Set_Run_Duration,
    HMI_SETTINGS_BRIGHTNESS,
    HOT_GAS_PID_Config_OutputLowerLimit,
    HOT_GAS_PID_Config_OutputUpperLimit,
    HOT_GAS_VALVE,
    HP_HMI,
    Heater_Config_OutputLowerLimit,
    Heater_Config_OutputUpperLimit,
    Heater_Output,
    Heater_Retain_CtrlParams_Gain,
    Heater_Retain_CtrlParams_Td,
    Heater_Retain_CtrlParams_Ti,
    I1_2_COMP_OVERLOAD,
    IEC_Timer_0_DB_10_ET,
    IEC_Timer_0_DB_10_PT,
    IOS_IB0,
    IOS_IB1,
    IOS_IB2,
    IOS_Q0_0,
    IOS_Q2_0,
    IOS_QB1,
    LAN2_TOGGEL,
    LAN_TOGGEL,
    LIMITS_TO_REMEMBER_AHT_PID_MAX,
    LIMITS_TO_REMEMBER_AHT_PID_MIN,
    LIMITS_TO_REMEMBER_BLOWER_PID_MAX,
    LIMITS_TO_REMEMBER_BLOWER_PID_MIN,
    LIMITS_TO_REMEMBER_COND_PID_MAX,
    LIMITS_TO_REMEMBER_COND_PID_MIN,
    LIMITS_TO_REMEMBER_HEATER_PID_MAX,
    LIMITS_TO_REMEMBER_HEATER_PID_MIN,
    LIMITS_TO_REMEMBER_HOT_GAS_PID_MAX,
    LIMITS_TO_REMEMBER_HOT_GAS_PID_MIN,
    LOGDB_CSV_LOG_ACT_MIN,
    LOGDB_CSV_LOG_ACT_SEC,
    LOGDB_CSV_LOG_TIME,
    LP_HMI,
    MANUAL_AHT,
    MANUAL_AHT_VLV_ON_OFF,
    MANUAL_AUTO_MANUAL,
    MANUAL_Buzzer_mute,
    MANUAL_COMP_START_STOP,
    MANUAL_COND_FAN2_STAR_STOP,
    MANUAL_COND_START,
    MANUAL_EVP_FAN_START,
    MANUAL_FLD_VLV_ON_OFF,
    MANUAL_HOT_GAS,
    MANUAL_HOT_G_VLV_ON_OFF,
    MANUAL_Heater_ON_OFF,
    MANUAL_Heater_Output,
    MANUAL_MNL_COND_1_START_STOP,
    MANUAL_SET_PER_FOR_AFTR_HT_VLV,
    MANUAL_SET_SPD_COND_FAN,
    MANUAL_SET_SPD_EVP_FAN,
    MANUAL_SOL_VALV_ON_OFF,
    MANUAL_VLV_Y120_ON_OFF,
    NORMAL_VALVE_AFTER_HEATER_VALVE,
    NORMAL_VALVE_ROT_SPEED_COLD_AIR_FAN_1,
    NORMAL_VALVE_ROT_SPEED_COND_FAN,
    NORMAL_VAL_HOT_GAS_VALVE,
    PID_Compact_1_Config_OutputLowerLimit,
    PID_Compact_1_Config_OutputUpperLimit,
    PID_Compact_1_Input,
    PID_Compact_1_Input_PER,
    PID_Compact_1_Output,
    PID_Compact_1_Retain_CtrlParams_Cycle,
    PID_Compact_1_Retain_CtrlParams_DWeighting,
    PID_Compact_1_Retain_CtrlParams_Gain,
    PID_Compact_1_Retain_CtrlParams_Gain_1,
    PID_Compact_1_Retain_CtrlParams_PWeighting,
    PID_Compact_1_Retain_CtrlParams_Td,
    PID_Compact_1_Retain_CtrlParams_TdFiltRatio,
    PID_Compact_1_Retain_CtrlParams_Td_1,
    PID_Compact_1_Retain_CtrlParams_Ti,
    PID_Compact_1_Retain_CtrlParams_Ti_1,
    PID_Compact_1_ScaledInput,
    PID_Compact_1_Setpoint,
    PID_SETTINGS_ATH_OUT,
    PID_SETTINGS_COND_OUT,
    PID_SETTINGS_EVP_OUT,
    PID_SETTINGS_HEATER_OUT,
    PID_SETTINGS_HOTGAS_OUT,
    PID_SETTINGS_HP_SET_FROM_HMI,
    PID_SETTINGS_HP_SET_TO_PID,
    PID_SETTINGS_LP_SET_FROM_HMI,
    PID_SETTINGS_T0_INPUT,
    PID_SETTINGS_T1_INPUT,
    Q_0_5_COMP_RESET,
    READ_TIME_Date_Time,
    READ_TIME_Date_Time_DAY,
    READ_TIME_Date_Time_HOUR,
    READ_TIME_Date_Time_MINUTE,
    READ_TIME_Date_Time_MONTH,
    READ_TIME_Date_Time_SECOND,
    READ_TIME_Date_Time_YEAR,
    SETTINGS_ALL_STOP,
    SETTINGS_COMP_AUTO_START_DELAY,
    SETTINGS_Delta_T,
    SETTINGS_HP_SET_POINT,
    SETTINGS_LP_SET_POINT,
    SETTINGS_MANUAL_COMP_START_VISIBLE,
    SETTINGS_T1_REF_FR_T0,
    SETTINGS_TH_SET_POINT,
    SETTINGS_TIMER_TO_START_COMP,
    SETTINGS_comp_reset_q0_5_from_hmi,
    SET_POINT,
    SET_TIME_Date_Time,
    Value_to_Display_HEATER,
    Value_to_Display_AHT_VALE_OPEN,
    Value_to_Display_HOT_GAS_VALVE_OPEN,
    Value_to_Display_COND_ACT_SPEED,
    Value_to_Display_EVAP_ACT_SPEED,
  } = data?.[0] || {};

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    let demoInterval: NodeJS.Timeout | undefined;

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

      demoInterval = setInterval(() => {
        setRunningTime((prev) => {
          if (prev.minutes >= 59) {
            return { hours: prev.hours + 1, minutes: 0 };
          }
          return { ...prev, minutes: prev.minutes + 1 };
        });
      }, 1000);

      return () => {
        if (interval) clearInterval(interval);
        if (demoInterval) clearInterval(demoInterval);
      };
    }

    return () => {
      if (interval) clearInterval(interval);
      if (demoInterval) clearInterval(demoInterval);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setRunningTime({ hours: 0, minutes: 0 });
  };

  const handleBack = () => {
    router.push("/menu");
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              AERATION WITH HEATING
            </h1>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
              <div className="relative bg-muted rounded-lg p-6 h-[500px] overflow-hidden">
                {/* Silo */}
                <motion.div
                  className="absolute left-[10%] top-[10%] bottom-[20%] w-[20%] border-2 border-primary/70 rounded-lg flex flex-col z-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex-1 bg-primary/10 rounded-t-md relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-lg">SILO</span>
                    </div>
                  </div>
                  <div className="h-[30%] border-t-2 border-primary/70 flex items-center justify-center">
                    <span className="text-sm font-medium">T1 = {AHT_PID_Config_OutputLowerLimit} °C</span>
                  </div>
                </motion.div>

                {/* Heater */}
                <motion.div
                  className="absolute left-[40%] top-[20%] w-[15%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="text-center">
                    <div className="font-bold">HTR</div>
                    <div className="text-sm">{Value_to_Display_HEATER}%</div>
                  </div>
                </motion.div>

                {/* Temperature Readings */}
                <motion.div
                  className="absolute right-[10%] top-[10%] flex flex-col gap-2 z-20"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Badge variant="outline" className="bg-background/80">
                    TH = {AI_TH_Act} °C
                  </Badge>
                  <Badge variant="outline" className="bg-background/80">
                    T2 = {AI_AMBIANT_TEMP} °C
                  </Badge>
                </motion.div>

                {/* Connection Lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-0"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M150,250 H300 V120 H350"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={isRunning ? "animate-pulse" : ""}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                  <motion.path
                    d="M425,120 H500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={isRunning ? "animate-pulse" : ""}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  />
                  <motion.path
                    d="M400,180 V250"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={isRunning ? "animate-pulse" : ""}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  />
                </svg>

                {/* Air Flow Animation */}
                {isRunning && (
                  <>
                    <motion.div
                      className="absolute left-[35%] top-[40%] opacity-70 z-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                    >
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-ping"
                          style={{ animationDelay: "0s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-ping"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-ping"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="absolute left-[55%] top-[40%] opacity-70 z-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                    >
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-red-500 rounded-full animate-ping"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-red-500 rounded-full animate-ping"
                          style={{ animationDelay: "0.3s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-red-500 rounded-full animate-ping"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </AnimatedContainer>

            <AnimatedContainer className="space-y-6" delay={2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Aeration Control
                  </h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="continuous-mode"
                          checked={continuousMode}
                          onCheckedChange={setContinuousMode}
                        />
                        <Label htmlFor="continuous-mode">CONTINUOUS MODE</Label>
                      </div>
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
                            value={HEATING_MODE_Continuous_Mode}
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

                    {isRunning && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Label className="mb-2 block">Running Time</Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-mono">
                            {String(HEATING_MODE_Continuous_Mode).padStart(
                              2,
                              "0"
                            )}
                          </span>
                          <span className="text-xl">h</span>
                          <span className="text-xl font-mono">
                            {String(HEATING_MODE_Continuous_Mode).padStart(
                              2,
                              "0"
                            )}
                          </span>
                          <span className="text-xl">min</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Temperature</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>TH (Supply Air)</span>
                      <span className="font-medium">{AI_TH_Act} °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>T2 (Ambient)</span>
                      <span className="font-medium">{AI_AMBIANT_TEMP} °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delta(A) Set</span>
                      <span className="font-medium">{deltaTemp} °C</span>
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
