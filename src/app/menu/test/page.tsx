"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";

export default function TestPage() {
  const router = useRouter();
  const [blowerSpeed, setBlowerSpeed] = useState(0);
  const [condFanSpeed, setCondFanSpeed] = useState(0);
  const [solValve, setSolValve] = useState(false);
  const [compStartDelay, setCompStartDelay] = useState(30);
  const [blowerRunning, setBlowerRunning] = useState(false);
  const [condFanRunning, setCondFanRunning] = useState(false);
  const [compRunning, setCompRunning] = useState(false);

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
    SET_TIME_SET_MINUTE,
    SET_TIME_SET_HOUR,
  } = data?.[0] || {};

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">TEST</h1>
            <p className="text-muted-foreground">System component testing</p>
          </AnimatedContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedContainer delay={1}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">BLOWER</h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Speed</span>
                        <span className="font-medium">
                          {MANUAL_SET_SPD_EVP_FAN}%
                        </span>
                      </div>
                      <Slider
                        value={[MANUAL_SET_SPD_EVP_FAN]}
                        onValueChange={(value) => setBlowerSpeed(value[0])}
                        max={100}
                        step={1}
                        disabled={!blowerRunning}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        variant={blowerRunning ? "secondary" : "default"}
                        onClick={() => setBlowerRunning(true)}
                        disabled={blowerRunning}
                      >
                        START
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          setBlowerRunning(false);
                          setBlowerSpeed(0);
                        }}
                        disabled={!blowerRunning}
                      >
                        STOP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">COND FAN</h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Speed</span>
                        <span className="font-medium">
                          {MANUAL_SET_SPD_COND_FAN}%
                        </span>
                      </div>
                      <Slider
                        value={[MANUAL_SET_SPD_COND_FAN]}
                        onValueChange={(value) => setCondFanSpeed(value[0])}
                        max={100}
                        step={1}
                        disabled={!condFanRunning}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        variant={condFanRunning ? "secondary" : "default"}
                        onClick={() => setCondFanRunning(true)}
                        disabled={condFanRunning}
                      >
                        START
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          setCondFanRunning(false);
                          setCondFanSpeed(0);
                        }}
                        disabled={!condFanRunning}
                      >
                        STOP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={3}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">SOL VALVE</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span>Valve Status</span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={solValve}
                          onCheckedChange={setSolValve}
                        />
                        <span className="font-medium">
                          {solValve ? "ON" : "OFF"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={4}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">COMPRESSOR</h2>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="comp-delay">Comp start delay</Label>
                      <Input
                        id="comp-delay"
                        type="number"
                        value={compStartDelay}
                        onChange={(e) =>
                          setCompStartDelay(
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20"
                        min={0}
                        max={120}
                      />
                      <span>Second</span>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        variant={compRunning ? "secondary" : "default"}
                        onClick={() => setCompRunning(true)}
                        disabled={compRunning}
                      >
                        START
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => setCompRunning(false)}
                        disabled={!compRunning}
                      >
                        STOP
                      </Button>
                    </div>

                    <Button
                      variant="secondary"
                      className="w-full"
                      disabled={!compRunning}
                    >
                      COMP RESET
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <AnimatedContainer delay={1}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">HOT GAS</h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Speed</span>
                        <span className="font-medium">{MANUAL_HOT_GAS}%</span>
                      </div>
                      <Slider
                        value={[MANUAL_HOT_GAS]}
                        onValueChange={(value) => setBlowerSpeed(value[0])}
                        max={100}
                        step={1}
                        disabled={!blowerRunning}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        variant={blowerRunning ? "secondary" : "default"}
                        onClick={() => setBlowerRunning(true)}
                        disabled={blowerRunning}
                      >
                        START
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          setBlowerRunning(false);
                          setBlowerSpeed(0);
                        }}
                        disabled={!blowerRunning}
                      >
                        STOP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">AHT VALVE</h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Speed</span>
                        <span className="font-medium">{MANUAL_AHT}%</span>
                      </div>
                      <Slider
                        value={[MANUAL_AHT]}
                        onValueChange={(value) => setCondFanSpeed(value[0])}
                        max={100}
                        step={1}
                        disabled={!condFanRunning}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        variant={condFanRunning ? "secondary" : "default"}
                        onClick={() => setCondFanRunning(true)}
                        disabled={condFanRunning}
                      >
                        START
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          setCondFanRunning(false);
                          setCondFanSpeed(0);
                        }}
                        disabled={!condFanRunning}
                      >
                        STOP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={4}>
              <Card>
                <CardContent className="p-6 ">
                  <h2 className="text-xl font-semibold mb-6">HEATER</h2>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Input
                        id="comp-delay"
                        type="number"
                        value={MANUAL_Heater_Output}
                        onChange={(e) =>
                          setCompStartDelay(
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        className="w-20"
                        min={0}
                        max={120}
                      />
                      <span>Second</span>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        variant={compRunning ? "secondary" : "default"}
                        onClick={() => setCompRunning(true)}
                        disabled={compRunning}
                      >
                        START
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => setCompRunning(false)}
                        disabled={!compRunning}
                      >
                        STOP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>

          <motion.div
            className="flex justify-between mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            <Button variant="outline" onClick={() => router.push("/")}>
              BACK
            </Button>
            <Button onClick={() => router.push("/auto")}>NEXT</Button>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
