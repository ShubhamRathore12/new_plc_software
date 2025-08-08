export const PAGE_SIZE = 200;

export interface TagData {
  tag: string;
  value: boolean | string | number | null | undefined;
  createdAt: string;
}

export interface Stats {
  total: number;
  activeTags: number;
  faultTags: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginationInfo {
  total: number;
  totalPages: number;
  limit: number;
  page: number;
}

// ===== TAG LISTS =====
export const S7_200_TAGS = [
  "AFTER_HEAT_TEMP_MORE_THAN_50",
  "AFTER_HEAT_TEMP_SENSOR_TH_OPEN",
  "AFTER_HEAT_TEMP_SENSOR_TH_SHORT_CIRCUIT",
  "AIR_OUTLET_TEMP_SENSOR_T0_OPEN",
  "AIR_OUTLET_TEMP_SENSOR_T0_SHORT_CIRCUIT",
  "AMBIENT_TEMP_LESS_THAN_4",
  "AMBIENT_TEMP_LOW_THAN_SET_TEMP",
  "AMBIENT_TEMP_OVER_40",
  "AMBIENT_TEMP_OVER_43",
  "AMBIENT_TEMP_SENSOR_T2_OPEN",
  "AMBIENT_TEMP_SENSOR_T2_SHORT_CIRCUIT",
  "ANTI_FREEZE_PROTECTION",
  "BLOWER_CIRCUIT_BREAKER_FAULT",
  "BLOWER_DRIVE_FAULT",
  "C0ND_FAN_TOP",
  "COLD_AIR_TEMP_SENSOR_T1_OPEN",
  "COLD_AIR_TEMP_SENSOR_T1_SHORT_CIRCUIT",
  "COMPRESSOR_CIRCUIT_BREA_FAULT",
  "COND_FAN_CIRCUIT_BREAKE_FAULT",
  "CONDENSER_FAN_DOOR_OPEN",
  "HEATER_CIRCUIT_BREAKER_FAULT",
  "HEATER_RCCCB_TRIP_FAULT",
  "HEATER_TOP_FAULT",
  "HIGH_PRESSURE_FAULT",
  "HIGH_PRESSURE_FAULT_LOCKED",
  "HP_TRANSDUCEER_FAILURE",
  "LOW_PRESSURE_FAULT",
  "LOW_PRESSURE_FAULT_LOCKED",
  "LP_TRANSDUCER_FAILURE",
  "SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE",
  "THREE_PHASE_MONITORING_FAULT",
];

export const S7_1200_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Oil_pressure_low",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Ambient_air_sensor_1open",
  "COND_FAN_OVERLOAD",
  "Three_phase_monitor_fault",
  "High_pressure_fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_over_50C",
  "COMP_MODULE_FEEDBACK_ERROR_Si_I1",
  "Low_pressure_1_fault",
  "COMP_FBK_ERROR",
  "Low_pressure_2_fault",
  "Ambient_temp_over_47C",
  "Condenser_fan_2_TOP_fault",
  "Condenser_fan_3_TOP_fault",
  "Condenser_fan_4_TOP_fault",
  "Condenser_fan_2_circuit_breaker_fault",
  "Condenser_fan_3_circuit_breaker_fault",
  "Condenser_fan_4_circuit_breaker_fault",
  "Condenser_fan_5_TOP_fault",
  "Condenser_fan_6_TOP_fault",
  "Condenser_fan_5_circuit_breaker_fault",
  "Condenser_fan_6_circuit_breaker_fault",
  "Condenser_fan_1_circuit_breaker_fault",
  "Condenser_fan_1_TOP_fault",
  "Ambient_air_sensor_1_short_circuit",
  "Ambient_air_sensor_2_open",
  "Ambient_air_sensor_2_short_circuit",
  "Cold_air_sensor_1_open",
  "Cold_air_sensor_1_short_circuit",
  "Cold_air_sensor_2_open",
  "Cold_air_sensor_2_short_circuit",
  "Air_outlet_sensor_1_open",
  "Air_outlet_sensor_1_short_circuit",
  "Air_outlet_sensor_2_open",
  "Air_outlet_sensor_2_short_circuit",
];

export const GPL_115_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Condenser_fan_door_open",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Three_phase_monitor_fault",
  "Low_Pressure_Fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_Over_43C",
  "Compressor_motor_overheat",
  "Low_pressure_fault_Locked",
  "High_pressure_fault_Locked",
  "Ambient_temp_Over_40C",
  "Ambient_temp_Less_than_4C",
  "Cond_Fan_circuit_breaker_fault",
  "Cond_Fan_drive_fault",
  "Cond_Fan_TOP",
  "Ambient_Temp_Sensor_T2_1_Open",
  "Ambient_Temp_Sensor_T2_1_Short_Circuit",
  "Ambient_Temp_Sensor_T2_2_Open",
  "Ambient_Temp_Sensor_T2_2_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_1_Open",
  "Air_Outlet_Temp_Sensor_T0_1_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_2_Open",
  "Air_Outlet_Temp_Sensor_T0_2_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_1_Open",
  "Cold_Air_Temp_Sensor_T1_1_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_2_Open",
  "Cold_Air_Temp_Sensor_T1_2_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_1_Open",
  "Air_After_Heater_Temp_Sensor_TH_1_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_2_Open",
  "Air_After_Heater_Temp_Sensor_TH_2_Short_Circuit",
  "High_Pressure_Fault",
  "Heater_TOP_fault",
  "Heater_drive_Fault",
  "Heater_circuit_breaker_fault",
  "Heater_RCCB_fault",
  "Anti_Freeze_Protection",
  "TH_Temp_more_than_50C",
  "Delta_not_achieved_in_aeration_mode",
  "Warning_LP_transducer_failure",
  "Warning_HP_transducer_failure",
];

export const GPL_117_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Cond_fan1_circuit_breaker_fault_I2_2",
  "Condenser_fan1_door_open",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Heater_circuit_breaker_fault",
  "Three_phase_monitor_fault",
  "Low_Pressure_Fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_Over_43C",
  "Compressor_motor_overheat",
  "Heater_RCCB_fault",
  "Cond_Fan2_circuit_breaker_fault",
  "Low_pressure_fault_Locked",
  "Anti_Freeze_Protection",
  "High_pressure_fault_Locked",
  "Ambient_temp_Over_40C",
  "Ambient_temp_Less_than_4C",
  "Cond_Fan_1_TOP",
  "Cond_Fan1_circuit_breaker_fault",
  "Cond_Fan_drive_fault",
  "Cond_Fan_2_TOP",
  "Ambient_Temp_Sensor_T2_1_Open",
  "Ambient_Temp_Sensor_T2_1_Short_Circuit",
  "Ambient_Temp_Sensor_T2_2_Open",
  "Ambient_Temp_Sensor_T2_2_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_1_Open",
  "Air_Outlet_Temp_Sensor_T0_1_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_2_Open",
  "Air_Outlet_Temp_Sensor_T0_2_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_1_Open",
  "Cold_Air_Temp_Sensor_T1_1_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_2_Open",
  "Cold_Air_Temp_Sensor_T1_2_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_1_Open",
  "Air_After_Heater_Temp_Sensor_TH_1_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_2_Open",
  "Air_After_Heater_Temp_Sensor_TH_2_Short_Circuit",
  "High_Pressure_Fault",
  "Comp_Oil_Low",
  "Heater_TOP_fault",
  "Heater_drive_Fault",
  "Condenser_fan2_door_open",
  "TH_Temp_more_than_50C",
  "Delta_not_achieved_in_aeration_mode",
  "Warning_LP_transducer_failure",
  "Warning_HP_transducer_failure",
];

export const GTPL_30_TAGS = [
  // same as in your source
  ...GPL_115_TAGS,
];

export const S7_200_MACHINES = [
  "GTPL-118-gT-80E-P-S7-200",
  "GTPL-108-gT-40E-P-S7-200",
  "GTPL-109-gT-40E-P-S7-200",
  "GTPL-110-gT-40E-P-S7-200",
  "GTPL-111-gT-80E-P-S7-200",
  "GTPL-112-gT-80E-P-S7-200",
  "GTPL-113-gT-80E-P-S7-200",
];

export function getTagsForMachine(machineName: string): string[] {
  if (machineName === "GTPL-30-gT-180E-S7-1200") return GTPL_30_TAGS;
  if (
    machineName === "GTPL-115-gT-180E-P-S7-1200" ||
    machineName === "GTPL-114-gT-140E-P-S7-1200" ||
    machineName === "GTPL-119-gT-180E-S7-1200 " ||
    machineName === "GTPL-120-gT-180E-P-S7-1200"
  )
    return GPL_115_TAGS;
  if (
    machineName === "GTPL-117-gT-320E-S7-1200" ||
    machineName === "GTPL-116-gT-320E-S7-1200"
  )
    return GPL_117_TAGS;
  if (S7_200_MACHINES.includes(machineName)) return S7_200_TAGS;
  return S7_1200_TAGS;
}

export function extractTagDataFromRecords(
  dataArray: any[],
  machineName: string
): TagData[] {
  if (!Array.isArray(dataArray) || dataArray.length === 0) return [];
  const tags = getTagsForMachine(machineName);
  const tagData: TagData[] = [];

  for (const record of dataArray) {
    if (!record || typeof record !== "object") continue;
    const timestamp =
      record.created_at ||
      record.createdAt ||
      record.created_on ||
      record.timestamp ||
      record.updated_at ||
      new Date().toISOString();

    for (const tag of tags) {
      const value = (record as any)[tag];
      if (value !== undefined && value !== null && value !== "") {
        tagData.push({ tag, value, createdAt: timestamp });
      }
    }
  }

  return tagData;
}

export function formatTagName(tag: string): string {
  return tag
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getTagCategory(tag: string): "fault" {
  // can be extended later; currently everything is fault
  return "fault";
}

export function getTableNameForMachine(machineName: string): string {
  if (machineName === "GTPL-30-gT-180E-S7-1200") return "gplt_144";
  return "default_table";
}

export function getMachinePrefix(machineName: string): string {
  return machineName.split("-")[0];
}