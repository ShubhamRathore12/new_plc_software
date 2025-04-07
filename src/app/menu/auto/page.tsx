"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { useDataStore } from "@/lib/store";
import { io } from "socket.io-client";

export default function AutoPage() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const { data, setData, loading, setLoading } = useDataStore();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true before the API call
      try {
        const res = await fetch("/api/getData");
        const result = await res.json();
        setData(result); // Update the store with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after the API call is done
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [setData, setLoading]);

  if (loading) return <div>Loading...</div>;

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleBack = () => {
    router.push("/");
  };

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
  } = data?.[0] || {};

  const systemData = {
    t0: data?.[0]?.t0 || 1, // AI_TH_Act value: "1"
    t1: data?.[0]?.t1 || 0, // AI_COLD_AIR_TEMP value: "0"
    t2: data?.[0]?.t2 || 1, // AI_AMBIANT_TEMP value: "1"
    hgs: data?.[0]?.hgs || 1, // HOT_GAS_VALVE value: "1"
    aht: data?.[0]?.aht || 0, // AHT_PID_Output value: "0"
    heater: data?.[0]?.heater || 1, // Heater_Output value: "1"
    blower: data?.[0]?.blower || 1, // BLOWER_PID_Output value: "1"
    condenser: data?.[0]?.condenser || 1, // COND_PID_Output value: "1"
    compressor: data?.[0]?.compressor || 1, // Compressor_ON value: "1"
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              SELECT AUTO
            </h1>
            <p className="text-muted-foreground">
              SR. NO. GTPL-075 | 45% RH | 1200 Pa
            </p>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
              <div className="relative bg-muted rounded-lg p-6 h-[500px] overflow-hidden">
                {/* Silo */}
                <motion.div
                  className="absolute left-[10%] top-[10%] bottom-[20%] w-[20%] border-2 border-primary/70 rounded-lg flex flex-col"
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
                    <span className="text-sm font-medium">
                      T1 = {AHT_PID_Config_OutputLowerLimit} °C
                    </span>
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
                    <div className="text-sm">{systemData?.aht}%</div>
                  </div>
                </motion.div>

                {/* Air Handling Unit */}
                <motion.div
                  className="absolute left-[60%] top-[20%] w-[15%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="text-center">
                    <div className="font-bold">AHT</div>
                    <div className="text-sm">{systemData?.aht}%</div>
                  </div>
                </motion.div>

                {/* Heat Gas System */}
                <motion.div
                  className="absolute left-[80%] top-[20%] w-[15%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="text-center">
                    <div className="font-bold">HGS</div>
                    <div className="text-sm">{systemData?.hgs}%</div>
                  </div>
                </motion.div>

                {/* Blower */}
                <motion.div
                  className="absolute left-[40%] top-[50%] w-[20%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="text-center">
                    <div className="font-bold">BLOWER</div>
                  </div>
                </motion.div>

                {/* Compressor */}
                <motion.div
                  className="absolute left-[70%] bottom-[20%] w-[15%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="text-center">
                    <div className="font-bold">COMP</div>
                    <div className="text-sm">HP 220 LP 40</div>
                  </div>
                </motion.div>

                {/* Condenser */}
                <motion.div
                  className="absolute left-[90%] bottom-[20%] w-[15%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="text-center">
                    <div className="font-bold">COND</div>
                    <div className="text-sm">{systemData?.hgs}%</div>
                  </div>
                </motion.div>

                {/* Temperature Readings */}
                <motion.div
                  className="absolute left-[40%] top-[10%] flex flex-col gap-2 z-20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Badge variant="outline" className="bg-background/80">
                    TH = {systemData?.t0} °C
                  </Badge>
                  <Badge variant="outline" className="bg-background/80">
                    T0 = {systemData?.t0} °C
                  </Badge>
                  <Badge variant="outline" className="bg-background/80">
                    T1 = {systemData?.t1} °C
                  </Badge>
                  <Badge variant="outline" className="bg-background/80">
                    T2 = {systemData?.t2} °C
                  </Badge>
                </motion.div>

                {/* Connection Lines */}
                {/* Add paths here */}
              </div>
            </AnimatedContainer>

            <AnimatedContainer className="space-y-6" delay={2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">System Status</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Heater</span>
                        <span className="text-sm font-medium">
                          {systemData?.aht}%
                        </span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 2.2 }}
                      >
                        <Progress value={systemData?.aht} className="h-2" />
                      </motion.div>
                    </div>

                    {/* Repeat for other values */}
                  </div>
                </CardContent>
              </Card>

              {/* Temperature Section */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Temperature</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>TH (Supply Air)</span>
                      <span className="font-medium">{systemData?.t0} °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>SYSTEMDATA?.T0 (After Heat)</span>
                      <span className="font-medium">{systemData?.t0} °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>T1 (Cold Air)</span>
                      <span className="font-medium">{systemData?.t1} °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>T2 (Ambient)</span>
                      <span className="font-medium">{systemData?.t2} °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TH - T1</span>
                      <span className="font-medium">
                        {systemData?.t0 - systemData?.t1} °C
                      </span>
                    </div>
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
