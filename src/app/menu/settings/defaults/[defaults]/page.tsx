"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { useAutoData } from "../../../../../hooks/useAutoData";

export default function DefaultsPage() {
  const router = useRouter();
  const { defaults } = useParams();

  const { data, isConnected, error, formatValue } = useAutoData(
    defaults as string
  );

  const handleBack = () => {
    router.push("/menu");
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
    Value_to_Display_HEATER,
    Value_to_Display_AHT_VALE_OPEN,
    Value_to_Display_HOT_GAS_VALVE_OPEN,
    Value_to_Display_COND_ACT_SPEED,
    Value_to_Display_EVAP_ACT_SPEED,
  } = data || {};

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">DEFAULTS</h1>
            <p className="text-muted-foreground">System default parameters</p>
          </AnimatedContainer>

          <AnimatedContainer delay={1}>
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <motion.div
                    className="grid grid-cols-3 items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="t1" className="text-right font-medium">
                      T1
                    </Label>
                    <Input
                      id="t1"
                      type="number"
                      value={SETTINGS_T1_REF_FR_T0 || data?.T1_SET_POINT}
                      className="col-span-1"
                    />
                    <div>°C</div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-3 items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="th-t1" className="text-right font-medium">
                      TH-T1
                    </Label>
                    <Input
                      id="th-t1"
                      type="number"
                      value={SETTINGS_Delta_T || data?.Th_T1}
                      // onChange={(e) =>
                      //   setThT1(Number.parseInt(e.target.value) || 0)
                      // }
                      className="col-span-1"
                    />
                    <div>°C</div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-3 items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="delta-a" className="text-right font-medium">
                      Delta(A)
                    </Label>
                    <Input
                      id="delta-a"
                      type="number"
                      value={
                        HEATING_MODE_SET_TH_FOR_HEATING_MODE || data?.DELTA_SET
                      }
                      // onChange={(e) =>
                      //   setDeltaA(Number.parseInt(e.target.value) || 0)
                      // }
                      className="col-span-1"
                    />
                    <div>°C</div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-3 items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="hp" className="text-right font-medium">
                      HP
                    </Label>
                    <Input
                      id="hp"
                      type="number"
                      value={PID_SETTINGS_HP_SET_FROM_HMI || data?.HP_SET_POINT}
                      // onChange={(e) =>
                      //   setHp(Number.parseInt(e.target.value) || 0)
                      // }
                      className="col-span-1"
                    />
                    <div>psi</div>
                  </motion.div>

                  {defaults !== "S7-200" && (
                    <motion.div
                      className="grid grid-cols-3 items-center gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="lp" className="text-right font-medium">
                        LP
                      </Label>
                      <Input
                        id="lp"
                        type="number"
                        value={PID_SETTINGS_LP_SET_FROM_HMI}
                        // onChange={(e) =>
                        //   setLp(Number.parseInt(e.target.value) || 0)
                        // }
                        className="col-span-1"
                      />
                      <div>psi</div>
                    </motion.div>
                  )}

                  {defaults == "S7-200" && (
                    <motion.div
                      className="grid grid-cols-3 items-center gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="lp" className="text-right font-medium">
                        Auto Aeration
                      </Label>
                      <Input
                        id="lp"
                        type="number"
                        value={data?.AUTO_AEARATIO_TIME}
                        // onChange={(e) =>
                        //   setLp(Number.parseInt(e.target.value) || 0)
                        // }
                        className="col-span-1"
                      />
                      <div>psi</div>
                    </motion.div>
                  )}

                  <motion.div
                    className="flex justify-between pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/menu/${defaults}`)}
                    >
                      BACK
                    </Button>
                    <Button>SAVE</Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </main>
      </div>
    </PageTransition>
  );
}
