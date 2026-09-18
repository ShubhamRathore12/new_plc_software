// "use client";

// import { useEffect, useState } from "react";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Check } from "lucide-react";
// import { useParams, useRouter } from "next/navigation";
// import { useAutoData } from "@/hooks/useAutoData";
// import { useLanguage } from "@/providers/language-provider";

// export default function DateTimePage() {
//   const [date, setDate] = useState({
//     year: new Date().getFullYear(),
//     month: new Date().getMonth() + 1,
//     day: new Date().getDate(),
//   });

//   const [time, setTime] = useState({
//     hours: new Date().getHours(),
//     minutes: new Date().getMinutes(),
//     seconds: new Date().getSeconds(),
//   });

//   const [loading, setLoading] = useState(false);
//   const dates = useParams();
//   const defaults = dates["date-time"];
//   const {t} = useLanguage()

//   const { data, isConnected, error, formatValue } = useAutoData(
//     defaults as string
//   );

//   const router = useRouter();

//   const {
//     AHT_PID_Config_OutputLowerLimit,
//     AHT_PID_Config_OutputUpperLimit,
//     AHT_PID_Input,
//     AHT_PID_Input_PER,
//     AHT_PID_ManualEnable,
//     AHT_PID_ManualValue,
//     AHT_PID_Output,
//     AHT_PID_Retain_CtrlParams_Gain,
//     AHT_PID_Retain_CtrlParams_Td,
//     AHT_PID_Retain_CtrlParams_Ti,
//     AHT_PID_ScaledInput,
//     AHT_PID_Setpoint,
//     AHT_VALVE,
//     AIR_OUTLET_TEMPERATURE,
//     AIR_OUTLET_TEMPERATURE_1,
//     AI_AIR_OUTLET_TEMP,
//     AI_AMBIANT_TEMP,
//     AI_COLD_AIR_TEMP,
//     AI_COND_PRESSURE,
//     AI_Pa_Analog_Scale,
//     AI_RH_Analog_Scale,
//     AI_SUC_PRESSURE,
//     AI_TH_Act,
//     AI_air_out_1,
//     AI_air_out_2,
//     AI_ambiant_1,
//     AI_ambiant_2,
//     AI_cold_air_1,
//     AI_cold_air_2,
//     AI_th2,
//     AI_th_1,
//     ALARM_DB_ALARM_SET_2,
//     ALARM_DB_ALARM_SET_3,
//     ALARM_DB_ALARM_SET_4,
//     AMBIENT_AIR_TEMPERATURE,
//     AMB_TEMP_HMI,
//     AUTO__COND_FAN_START,
//     BLOWER_PID_Config_OutputLowerLimit,
//     BLOWER_PID_Config_OutputUpperLimit,
//     BLOWER_PID_Input,
//     BLOWER_PID_ManualEnable,
//     BLOWER_PID_ManualValue,
//     BLOWER_PID_Output,
//     BLOWER_PID_Retain_CtrlParams_Gain,
//     BLOWER_PID_Retain_CtrlParams_Td,
//     BLOWER_PID_Retain_CtrlParams_Ti,
//     BLOWER_PID_ScaledInput,
//     BLOWER_PID_Setpoint,
//     BUZZER_ON,
//     COL_AIR_FAN_Hz,
//     CONDENSER_PRESSURE,
//     COND_FAN_Hz,
//     COND_PID_Config_OutputLowerLimit,
//     COND_PID_Config_OutputUpperLimit,
//     COND_PID_Output,
//     COND_PID_Output_PER,
//     COND_PID_Retain_CtrlParams_Gain,
//     COND_PID_Retain_CtrlParams_Td,
//     COND_PID_Retain_CtrlParams_Ti,
//     COND_PID_ScaledInput,
//     COND_PID_Setpoint,
//     Compressor_ON,
//     Compressor_Oil_too_low,
//     Condenser_Fan1_ON,
//     Condenser_Fan2_VFD_ON,
//     Condenser_fan2_ON,
//     Contact_Details_details_1,
//     Contact_Details_details_1_0,
//     Contact_Details_details_1_1,
//     Data_block_1_ALARM_SET_1,
//     EVP_PID_Output,
//     EVP_SPEED_ON_HMI_EVP_SPEED,
//     FAULTS,
//     FAULT_RESET,
//     FIX_OUTPUT_FOR_BLOWER,
//     HAETER_THYRISTOR_ON,
//     HEATING_MODE_Aeration_Start_PB_Visiblity_WH,
//     HEATING_MODE_Aeration_Start_With_WH,
//     HEATING_MODE_Aeration_Start_With_WOH,
//     HEATING_MODE_Aeration_Stop_PB_Visiblity_WH,
//     HEATING_MODE_Aeration_Stop_With_WH,
//     HEATING_MODE_Aeration_Stop_With_WOH,
//     HEATING_MODE_Aeration_with_Heating_ENABLE,
//     HEATING_MODE_Aeration_without_Heating_ENABLE,
//     HEATING_MODE_Areation_Start_PB_Visiblity_WOH,
//     HEATING_MODE_Areation_Stop_PB_Visiblity_WOH,
//     HEATING_MODE_Continuous_Mode,
//     HEATING_MODE_ENABLE_DISABLE,
//     HEATING_MODE_Remain_Time_to_Display,
//     HEATING_MODE_Remaing_Time_h,
//     HEATING_MODE_Remaing_Time_m,
//     HEATING_MODE_Remaing_Time_s,
//     HEATING_MODE_SET_TH_FOR_HEATING_MODE,
//     HEATING_MODE_Set_Run_Duration,
//     HMI_SETTINGS_BRIGHTNESS,
//     HOT_GAS_PID_Config_OutputLowerLimit,
//     HOT_GAS_PID_Config_OutputUpperLimit,
//     HOT_GAS_VALVE,
//     HP_HMI,
//     Heater_Config_OutputLowerLimit,
//     Heater_Config_OutputUpperLimit,
//     Heater_Output,
//     Heater_Retain_CtrlParams_Gain,
//     Heater_Retain_CtrlParams_Td,
//     Heater_Retain_CtrlParams_Ti,
//     I1_2_COMP_OVERLOAD,
//     IEC_Timer_0_DB_10_ET,
//     IEC_Timer_0_DB_10_PT,
//     IOS_IB0,
//     IOS_IB1,
//     IOS_IB2,
//     IOS_Q0_0,
//     IOS_Q2_0,
//     IOS_QB1,
//     LAN2_TOGGEL,
//     LAN_TOGGEL,
//     LIMITS_TO_REMEMBER_AHT_PID_MAX,
//     LIMITS_TO_REMEMBER_AHT_PID_MIN,
//     LIMITS_TO_REMEMBER_BLOWER_PID_MAX,
//     LIMITS_TO_REMEMBER_BLOWER_PID_MIN,
//     LIMITS_TO_REMEMBER_COND_PID_MAX,
//     LIMITS_TO_REMEMBER_COND_PID_MIN,
//     LIMITS_TO_REMEMBER_HEATER_PID_MAX,
//     LIMITS_TO_REMEMBER_HEATER_PID_MIN,
//     LIMITS_TO_REMEMBER_HOT_GAS_PID_MAX,
//     LIMITS_TO_REMEMBER_HOT_GAS_PID_MIN,
//     LOGDB_CSV_LOG_ACT_MIN,
//     LOGDB_CSV_LOG_ACT_SEC,
//     LOGDB_CSV_LOG_TIME,
//     LP_HMI,
//     MANUAL_AHT,
//     MANUAL_AHT_VLV_ON_OFF,
//     MANUAL_AUTO_MANUAL,
//     MANUAL_Buzzer_mute,
//     MANUAL_COMP_START_STOP,
//     MANUAL_COND_FAN2_STAR_STOP,
//     MANUAL_COND_START,
//     MANUAL_EVP_FAN_START,
//     MANUAL_FLD_VLV_ON_OFF,
//     MANUAL_HOT_GAS,
//     MANUAL_HOT_G_VLV_ON_OFF,
//     MANUAL_Heater_ON_OFF,
//     MANUAL_Heater_Output,
//     MANUAL_MNL_COND_1_START_STOP,
//     MANUAL_SET_PER_FOR_AFTR_HT_VLV,
//     MANUAL_SET_SPD_COND_FAN,
//     MANUAL_SET_SPD_EVP_FAN,
//     MANUAL_SOL_VALV_ON_OFF,
//     MANUAL_VLV_Y120_ON_OFF,
//     NORMAL_VALVE_AFTER_HEATER_VALVE,
//     NORMAL_VALVE_ROT_SPEED_COLD_AIR_FAN_1,
//     NORMAL_VALVE_ROT_SPEED_COND_FAN,
//     NORMAL_VAL_HOT_GAS_VALVE,
//     PID_Compact_1_Config_OutputLowerLimit,
//     PID_Compact_1_Config_OutputUpperLimit,
//     PID_Compact_1_Input,
//     PID_Compact_1_Input_PER,
//     PID_Compact_1_Output,
//     PID_Compact_1_Retain_CtrlParams_Cycle,
//     PID_Compact_1_Retain_CtrlParams_DWeighting,
//     PID_Compact_1_Retain_CtrlParams_Gain,
//     PID_Compact_1_Retain_CtrlParams_Gain_1,
//     PID_Compact_1_Retain_CtrlParams_PWeighting,
//     PID_Compact_1_Retain_CtrlParams_Td,
//     PID_Compact_1_Retain_CtrlParams_TdFiltRatio,
//     PID_Compact_1_Retain_CtrlParams_Td_1,
//     PID_Compact_1_Retain_CtrlParams_Ti,
//     PID_Compact_1_Retain_CtrlParams_Ti_1,
//     PID_Compact_1_ScaledInput,
//     PID_Compact_1_Setpoint,
//     PID_SETTINGS_ATH_OUT,
//     PID_SETTINGS_COND_OUT,
//     PID_SETTINGS_EVP_OUT,
//     PID_SETTINGS_HEATER_OUT,
//     PID_SETTINGS_HOTGAS_OUT,
//     PID_SETTINGS_HP_SET_FROM_HMI,
//     PID_SETTINGS_HP_SET_TO_PID,
//     PID_SETTINGS_LP_SET_FROM_HMI,
//     PID_SETTINGS_T0_INPUT,
//     PID_SETTINGS_T1_INPUT,
//     Q_0_5_COMP_RESET,
//     READ_TIME_Date_Time,
//     READ_TIME_Date_Time_DAY,
//     READ_TIME_Date_Time_HOUR,
//     READ_TIME_Date_Time_MINUTE,
//     READ_TIME_Date_Time_MONTH,
//     READ_TIME_Date_Time_SECOND,
//     READ_TIME_Date_Time_YEAR,
//     SETTINGS_ALL_STOP,
//     SETTINGS_COMP_AUTO_START_DELAY,
//     SETTINGS_Delta_T,
//     SETTINGS_HP_SET_POINT,
//     SETTINGS_LP_SET_POINT,
//     SETTINGS_MANUAL_COMP_START_VISIBLE,
//     SETTINGS_T1_REF_FR_T0,
//     SETTINGS_TH_SET_POINT,
//     SETTINGS_TIMER_TO_START_COMP,
//     SETTINGS_comp_reset_q0_5_from_hmi,
//     SET_POINT,
//     SET_TIME_Date_Time,
//     Value_to_Display_HEATER,
//     Value_to_Display_AHT_VALE_OPEN,
//     Value_to_Display_HOT_GAS_VALVE_OPEN,
//     Value_to_Display_COND_ACT_SPEED,
//     Value_to_Display_EVAP_ACT_SPEED,
//     SET_TIME_SET_MONTH,
//     SET_TIME_SET_YEAR,
//     SET_TIME_SET_DAY,
//     SET_TIME_SET_HOUR,
//     SET_TIME_SET_MINUTE,
//     SET_TIME_SET_SEC,
//   } = data || {};

//   return (
//     <div className="flex flex-col min-h-screen">
//       <main className="flex-1 container py-8">
//         <div className="mb-8">
//           <h1 className="gradient-text mb-2 text-3xl font-semibold tracking-tight">
//             SET PLC DATE & TIME
//           </h1>
//           <p className="text-muted-foreground">
//             Configure system date and time
//           </p>
//         </div>

//         <Card className="max-w-md mx-auto">
//           <CardContent className="p-6">
//             <div className="space-y-8">
//               <div>
//                 <h2 className="text-lg font-semibold mb-4">Set Date:</h2>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="year">Year</Label>
//                     <Input
//                       id="year"
//                       type="number"
//                       value={READ_TIME_Date_Time_YEAR || data?.W_YY}
//                       onChange={(e) =>
//                         setDate({
//                           ...date,
//                           year: Number.parseInt(e.target.value) || 0,
//                         })
//                       }
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="month">Month</Label>
//                     <Input
//                       id="month"
//                       type="number"
//                       value={READ_TIME_Date_Time_MONTH || data?.W_MM}
//                       onChange={(e) =>
//                         setDate({
//                           ...date,
//                           month: Number.parseInt(e.target.value) || 0,
//                         })
//                       }
//                       min={1}
//                       max={12}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="day">Day</Label>
//                     <Input
//                       id="day"
//                       type="number"
//                       value={READ_TIME_Date_Time_DAY || data?.W_DD}
//                       onChange={(e) =>
//                         setDate({
//                           ...date,
//                           day: Number.parseInt(e.target.value) || 0,
//                         })
//                       }
//                       min={1}
//                       max={31}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h2 className="text-lg font-semibold mb-4">Set Time:</h2>
//                 <div className="grid grid-cols-3 gap-4">
//                   <div>
//                     <Label htmlFor="hours">HH</Label>
//                     <Input
//                       id="hours"
//                       type="number"
//                       value={READ_TIME_Date_Time_HOUR || data?.W_HR}
//                       onChange={(e) =>
//                         setTime({
//                           ...time,
//                           hours: Number.parseInt(e.target.value) || 0,
//                         })
//                       }
//                       min={0}
//                       max={23}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="minutes">MM</Label>
//                     <Input
//                       id="minutes"
//                       type="number"
//                       value={READ_TIME_Date_Time_MINUTE || data?.W_MIN}
//                       onChange={(e) =>
//                         setTime({
//                           ...time,
//                           minutes: Number.parseInt(e.target.value) || 0,
//                         })
//                       }
//                       min={0}
//                       max={59}
//                     />
//                   </div>
//                   <div>
//                     <Label htmlFor="seconds">SS</Label>
//                     <Input
//                       id="seconds"
//                       type="number"
//                       value={READ_TIME_Date_Time_SECOND || data?.W_SEC}
//                       onChange={(e) =>
//                         setTime({
//                           ...time,
//                           seconds: Number.parseInt(e.target.value) || 0,
//                         })
//                       }
//                       min={0}
//                       max={59}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-between">
//                 <Button
//                   variant="outline"
//                   onClick={() => router.push(`/menu/settings/${defaults}`)}
//                 >
//                   BACK
//                 </Button>
//                 <Button>
//                   <Check className="mr-2 h-4 w-4" />
//                   SET
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useAutoData } from "@/hooks/useAutoData";
import { useLanguage } from "@/providers/language-provider";

export default function DateTimePage() {
  // Seeded from the browser only until the PLC reading arrives; the effect
  // below replaces it, so the form opens on the machine's own clock rather
  // than on blank fields or on this computer's time (F-13).
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  });

  const [time, setTime] = useState({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
    seconds: new Date().getSeconds(),
  });

  const dates = useParams();
  const defaults = dates["date-time"];
  const { t } = useLanguage(); // translation hook

  const { data } = useAutoData(defaults as string);
  const router = useRouter();

  // Current PLC clock, as the machine reports it.
  const plcYear = data?.W_YY;
  const plcMonth = data?.W_MM;
  const plcDay = data?.W_DD;
  const plcHour = data?.W_HR;
  const plcMinute = data?.W_MIN;
  const plcSecond = data?.W_SEC;

  const hasPlcClock = [plcYear, plcMonth, plcDay].every(
    (v) => v !== undefined && v !== null && v !== ""
  );

  const pad = (v: any) => String(v ?? "--").padStart(2, "0");
  const plcClock = hasPlcClock
    ? `${plcYear}-${pad(plcMonth)}-${pad(plcDay)} ${pad(plcHour)}:${pad(
        plcMinute
      )}:${pad(plcSecond)}`
    : t("never");

  // Load the machine's clock into the form once it is known. `seeded` keeps a
  // later poll from overwriting what the operator is typing.
  const [seeded, setSeeded] = useState(false);
  useEffect(() => {
    if (seeded || !hasPlcClock) return;
    setDate({
      year: Number(plcYear) || new Date().getFullYear(),
      month: Number(plcMonth) || 1,
      day: Number(plcDay) || 1,
    });
    setTime({
      hours: Number(plcHour) || 0,
      minutes: Number(plcMinute) || 0,
      seconds: Number(plcSecond) || 0,
    });
    setSeeded(true);
  }, [seeded, hasPlcClock, plcYear, plcMonth, plcDay, plcHour, plcMinute, plcSecond]);

  /** Explicit action, never an implicit default: fills the form with this
   *  computer's time so the operator can see exactly what would be written. */
  const syncToBrowser = () => {
    const now = new Date();
    setDate({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
    });
    setTime({
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    });
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
    SET_TIME_SET_MONTH,
    SET_TIME_SET_YEAR,
    SET_TIME_SET_DAY,
    SET_TIME_SET_HOUR,
    SET_TIME_SET_MINUTE,
    SET_TIME_SET_SEC,
  } = data || {};

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="gradient-text mb-2 text-3xl font-semibold tracking-tight">
            {t("SET_PLC_DATE_TIME")}
          </h1>
          <p className="text-muted-foreground">
            {t("CONFIGURE_SYSTEM_DATE_TIME")}
          </p>
        </div>

        {/* The screen used to open blank, with no statement of what the machine
            currently believes the time to be, or in which zone (F-13). */}
        <Card className="max-w-md mx-auto mb-4">
          <CardContent className="p-4 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-muted-foreground">{t("plc_time")}</span>
              <span className="font-mono">{plcClock}</span>
            </div>
            <div className="text-muted-foreground mt-1 flex items-baseline justify-between gap-3 text-xs">
              <span>{t("timezone")}</span>
              <span>
                {"PLC local time - the machine does not report a zone"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="space-y-8">
              {/* Date section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">{t("SET_DATE")}</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year">{t("YEAR")}</Label>
                    <Input
                      id="year"
                      type="number"
                      required
                      min={2000}
                      max={2099}
                      value={date.year}
                      onChange={(e) =>
                        setDate({
                          ...date,
                          year: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="month">{t("MONTH")}</Label>
                    <Input
                      id="month"
                      type="number"
                      required
                      min={1}
                      max={12}
                      value={date.month}
                      onChange={(e) =>
                        setDate({
                          ...date,
                          month: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="day">{t("DAY")}</Label>
                    <Input
                      id="day"
                      type="number"
                      required
                      min={1}
                      max={31}
                      value={date.day}
                      onChange={(e) =>
                        setDate({
                          ...date,
                          day: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Time section */}
              <div>
                <h2 className="text-lg font-semibold mb-4">{t("SET_TIME")}</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="hours">{t("HOURS")}</Label>
                    <Input
                      id="hours"
                      type="number"
                      required
                      min={0}
                      max={23}
                      value={time.hours}
                      onChange={(e) =>
                        setTime({
                          ...time,
                          hours: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="minutes">{t("MINUTES")}</Label>
                    <Input
                      id="minutes"
                      type="number"
                      required
                      min={0}
                      max={59}
                      value={time.minutes}
                      onChange={(e) =>
                        setTime({
                          ...time,
                          minutes: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="seconds">{t("SECONDS")}</Label>
                    <Input
                      id="seconds"
                      type="number"
                      required
                      min={0}
                      max={59}
                      value={time.seconds}
                      onChange={(e) =>
                        setTime({
                          ...time,
                          seconds: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/menu/settings/${defaults}`)}
                >
                  {t("BACK")}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" type="button" onClick={syncToBrowser}>
                    {t("sync_to_browser_time")}
                  </Button>
                  <Button disabled aria-describedby="set-hint">
                    <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                    {t("SET")}
                  </Button>
                </div>
              </div>
              <p id="set-hint" className="text-muted-foreground text-xs">
                Writing the clock to the PLC is not enabled from the dashboard -
                set it at the machine.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
