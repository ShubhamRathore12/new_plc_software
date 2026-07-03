// DB column schemas for machine data tables (source: myshaa_kabu schema, 2026-07-01).
// Keyed by DB table name (matches DEVICE_TO_TABLE_MAP values in reports page).
// Used by the reports "View Schema" dialog to display each machine's columns.

export interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
}

const col = (name: string, type: string, nullable = true): SchemaColumn => ({
  name,
  type,
  nullable,
});

// ---- 300AP machines (GTPL_140 / GTPL_144 — identical structure) ----
const AP_300: SchemaColumn[] = [
  col("id", "int(11)", false),
  col("T2_1_ambient_temp", "double"),
  col("T2_2_ambient_temp", "double"),
  col("T1_1_cold_air_temp", "double"),
  col("T1_2_cold_air_temp", "double"),
  col("T0_1_air_outlet_temp", "double"),
  col("T0_2_air_outlet_temp", "double"),
  col("LP_value", "double"),
  col("HP_value", "double"),
  col("T2_temp_mean", "double"),
  col("T1_temp_mean", "double"),
  col("T0_temp_mean", "double"),
  col("Blower_speed", "double"),
  col("Hot_valve_speed", "double"),
  col("AHT_vale_speed", "double"),
  col("T1_set_point_in_grain_chilling_mode", "double"),
  col("Delta_T_set_point_in_grain_chilling_mode", "double"),
  col("T1_set_point_in_paddy_aeging_mode", "double"),
  col("Delta_T_set_point_paddy_aeging_mode", "double"),
  col("Compressor_timer", "double"),
  col("Aeration_duration_set", "int(11)"),
  col("Running_time_hour", "int(11)"),
  col("Running_time_minute", "int(11)"),
  col("HP_set_point", "double"),
  col("LP_set_point", "double"),
  col("Blower_speed_set_in_manual", "double"),
  col("Hot_gas_valve_set_in_manual", "double"),
  col("AHT_valve_set_in_manual", "double"),
  col("Running_hours", "int(11)"),
  col("Running_hours_min", "int(11)"),
  col("Grain_chilling_mode", "enum('True','False')"),
  col("Paddy_aeging_mode", "enum('True','False')"),
  col("Manual_mode", "enum('True','False')"),
  col("Aeration_mode", "enum('True','False')"),
  col("Auto_start", "enum('True','False')"),
  col("Auto_stop", "enum('True','False')"),
  col("Aeration_start", "enum('True','False')"),
  col("Aeration_stop", "enum('True','False')"),
  col("Continuous_mode", "enum('True','False')"),
  col("Compressor_circuit_breaker_I0_0", "enum('True','False')"),
  col("Compressor_module_feedback_error_I0_1", "enum('True','False')"),
  col("Compressor_in_operation_I0_2", "enum('True','False')"),
  col("Compressor_oil_low_I0_3", "enum('True','False')"),
  col("Blower_drive_fault_I0_4", "enum('True','False')"),
  col("Blower_drive_in_operation_I0_5", "enum('True','False')"),
  col("Blower_circuit_breaker_I0_6", "enum('True','False')"),
  col("Condenser_fan1_TOP_fault_I0_7", "enum('True','False')"),
  col("Condenser_fan1_circuit_breaker_I1_0", "enum('True','False')"),
  col("Spare_I1_1", "enum('True','False')"),
  col("Low_pressure_fault_I1_2", "enum('True','False')"),
  col("High_Pressure_Fault_I1_3", "enum('True','False')"),
  col("Start_stop_I1_4", "enum('True','False')"),
  col("Three_phase_monitor_fault_I2_0", "enum('True','False')"),
  col("Spare_I2_1", "enum('True','False')"),
  col("Cond_fan2_TOP_fault_I2_2", "enum('True','False')"),
  col("Spare_I2_3", "enum('True','False')"),
  col("Spare_I2_4", "enum('True','False')"),
  col("Cond_fan2_circuit_breaker_fault_I2_5", "enum('True','False')"),
  col("Compressor_on_Q0_0", "enum('True','False')"),
  col("Compressor_motor_reset_Q0_1", "enum('True','False')"),
  col("CR_valve_25_percent_on_Q0_2", "enum('True','False')"),
  col("CR_valve_50_percent_on_Q0_3", "enum('True','False')"),
  col("Solenoid_valve_on_Q0_4", "enum('True','False')"),
  col("Hot_gas_valve_on_Q0_5", "enum('True','False')"),
  col("After_heat_valve_on_Q0_6", "enum('True','False')"),
  col("Blower_drive_on_Q0_7", "enum('True','False')"),
  col("Collective_Trouble_Signal_Q1_0", "enum('True','False')"),
  col("Chiller_healthy_on_Q1_1", "enum('True','False')"),
  col("Spare_Q2_0", "enum('True','False')"),
  col("Condenser_fan1_on_Q2_1", "enum('True','False')"),
  col("CR_valve_75_percent_on_Q2_2", "enum('True','False')"),
  col("Chiller_Fault_Q2_3", "enum('True','False')"),
  col("Condenser_fan2_on_Q2_4", "enum('True','False')"),
  col("CR_valve_100_percent_on_Q2_5", "enum('True','False')"),
  col("Condenser_fan_speed", "double"),
  col("Condenser_fan_speed_set_in_manual", "double"),
  col("FAULT_CODE", "int(11)"),
  col("Compressor_circuit_breaker_fault", "enum('True','False')"),
  col("Oil_pressure_low", "enum('True','False')"),
  col("Blower_drive_fault", "enum('True','False')"),
  col("Blower_circuit_breaker_fault", "enum('True','False')"),
  col("Three_phase_monitor_fault", "enum('True','False')"),
  col("High_pressure_fault", "enum('True','False')"),
  col("Ambient_temp_lower_than_set_temp", "enum('True','False')"),
  col("Ambient_temp_over_45C", "enum('True','False')"),
  col("Compressor_module_feedback_error", "enum('True','False')"),
  col("Low_pressure_1_fault", "enum('True','False')"),
  col("Compressor_feedback_error", "enum('True','False')"),
  col("Low_pressure_2_fault", "enum('True','False')"),
  col("Ambient_temp_over_43C", "enum('True','False')"),
  col("Condenser_fan_2_TOP_fault", "enum('True','False')"),
  col("Condenser_fan_2_circuit_breaker_fault", "enum('True','False')"),
  col("Condenser_fan_1_circuit_breaker_fault", "enum('True','False')"),
  col("Condenser_fan_1_TOP_fault", "enum('True','False')"),
  col("Ambient_air_sensor_T2_1_open", "enum('True','False')"),
  col("Ambient_air_sensor_T2_1_short_circuit", "enum('True','False')"),
  col("Ambient_air_sensor_T2_2_open", "enum('True','False')"),
  col("Ambient_air_sensor_T2_2_short_circuit", "enum('True','False')"),
  col("Cold_air_sensor_T1_1_open", "enum('True','False')"),
  col("Cold_air_sensor_T1_1_short_circuit", "enum('True','False')"),
  col("Cold_air_sensor_T1_2_open", "enum('True','False')"),
  col("Cold_air_sensor_T1_2_short_circuit", "enum('True','False')"),
  col("Air_outlet_sensor_T0_1_open", "enum('True','False')"),
  col("Air_outlet_sensor_T0_1_short_circuit", "enum('True','False')"),
  col("Air_outlet_sensor_T0_2_open", "enum('True','False')"),
  col("Air_outlet_sensor_T0_2_short_circuit", "enum('True','False')"),
  col("created_at", "timestamp", false),
];

// ---- 450T machines (GTPL_145) ----
const T_450_145: SchemaColumn[] = [
  col("id", "int(11)", false),
  col("T2_1_ambient_temp", "double"),
  col("T2_2_ambient_temp", "double"),
  col("T1_1_cold_air_temp", "double"),
  col("T1_2_cold_air_temp", "double"),
  col("T0_1_air_outlet_temp", "double"),
  col("T0_2_air_outlet_temp", "double"),
  col("LP_value", "double"),
  col("HP_value", "double"),
  col("T2_temp_mean", "double"),
  col("T1_temp_mean", "double"),
  col("T0_temp_mean", "double"),
  col("Blower_speed", "double"),
  col("Hot_valve_speed", "double"),
  col("AHT_vale_speed", "double"),
  col("T0_set_point", "double"),
  col("Delta_T_set_point", "double"),
  col("Compressor_timer", "double"),
  col("Aeration_duration_set", "int(11)"),
  col("Running_time_hour", "int(11)"),
  col("Running_time_minute", "int(11)"),
  col("HP_set_point", "double"),
  col("LP_set_point", "double"),
  col("Blower_speed_set_in_manual", "double"),
  col("Hot_gas_valve_set_in_manual", "double"),
  col("AHT_valve_set_in_manual", "double"),
  col("Running_hours", "int(11)"),
  col("Running_hours_min", "int(11)"),
  col("Auto_mode", "enum('True','False')"),
  col("Manual_mode", "enum('True','False')"),
  col("Aeration_mode", "enum('True','False')"),
  col("Auto_start", "enum('True','False')"),
  col("Auto_stop", "enum('True','False')"),
  col("Aeration_start", "enum('True','False')"),
  col("Aeration_stop", "enum('True','False')"),
  col("Continuous_mode", "enum('True','False')"),
  col("created_at", "timestamp", false),
];

// GTPL_148 = 145 + 2 extra fault columns
const T_450_148: SchemaColumn[] = [
  ...T_450_145.slice(0, T_450_145.length - 1), // all except created_at
  col("Discharge_pressure_high,_please_clean_the_air_filter", "enum('True','False')"),
  col("T0_temp_is_more_or_less_than_1C_from_the_set_temp", "enum('True','False')"),
  col("created_at", "timestamp", false),
];

// ---- 650T machines (GTPL_154 / GTPL_155 — identical structure) ----
const T_650: SchemaColumn[] = [
  col("id", "int(11)", false),
  col("T2_1_ambient_temp", "double"),
  col("T2_2_ambient_temp", "double"),
  col("T1_1_cold_air_temp", "double"),
  col("T1_2_cold_air_temp", "double"),
  col("T0_1_air_outlet_temp", "double"),
  col("T0_2_air_outlet_temp", "double"),
  col("LP_value", "double"),
  col("HP_value", "double"),
  col("T2_temp_mean", "double"),
  col("T1_temp_mean", "double"),
  col("T0_temp_mean", "double"),
  col("Blower_speed", "double"),
  col("Hot_valve_speed", "double"),
  col("AHT_vale_speed", "double"),
  col("T0_set_point", "double"),
  col("Delta_T_set_point", "double"),
  col("Compressor_timer", "double"),
  col("Aeration_duration_set", "int(11)"),
  col("Running_time_hour", "int(11)"),
  col("Running_time_minute", "int(11)"),
  col("HP_set_point", "double"),
  col("LP_set_point", "double"),
  col("Blower_speed_set_in_manual", "double"),
  col("Hot_gas_valve_set_in_manual", "double"),
  col("AHT_valve_set_in_manual", "double"),
  col("Running_hours", "int(11)"),
  col("Running_hours_min", "int(11)"),
  col("Auto_mode", "enum('True','False')"),
  col("Manual_mode", "enum('True','False')"),
  col("Aeration_mode", "enum('True','False')"),
  col("Auto_start", "enum('True','False')"),
  col("Auto_stop", "enum('True','False')"),
  col("Aeration_start", "enum('True','False')"),
  col("Aeration_stop", "enum('True','False')"),
  col("Continuous_mode", "enum('True','False')"),
  col("Compressor_circuit_breaker_I0_0", "enum('True','False')"),
  col("Comp_module_fdk_error_I0_1", "enum('True','False')"),
  col("Comp_in_operation_I0_2", "enum('True','False')"),
  col("Oil_level_I0_3", "enum('True','False')"),
  col("Blower_drive_I0_4", "enum('True','False')"),
  col("Blower_in_operation_I0_5", "enum('True','False')"),
  col("Blower_circuit_breaker_I0_6", "enum('True','False')"),
  col("Cond_fan_1_TOP_I0_7", "enum('True','False')"),
  col("Cond_fan_1_circuit_breaker_I1_0", "enum('True','False')"),
  col("Low_pressure_fault_I1_1", "enum('True','False')"),
  col("Compressor_OLR_trip_I1_2", "enum('True','False')"),
  col("High_pressure_fault_I1_3", "enum('True','False')"),
  col("Start_stop_switch_I1_4", "enum('True','False')"),
  col("Three_phase_monitoring_fault_I2_0", "enum('True','False')"),
  col("Cond_fan_2_TOP_I2_2", "enum('True','False')"),
  col("Cond_fan_3_TOP_I2_3", "enum('True','False')"),
  col("Cond_fan_4_TOP_I2_4", "enum('True','False')"),
  col("Cond_fan_2_circuit_breaker_I2_5", "enum('True','False')"),
  col("Cond_fan_3_circuit_breaker_I2_6", "enum('True','False')"),
  col("Cond_fan_4_circuit_breaker_I2_7", "enum('True','False')"),
  col("Cond_fan_5_TOP_I3_0", "enum('True','False')"),
  col("Cond_fan_6_TOP_I3_1", "enum('True','False')"),
  col("Cond_fan_5_circuit_breaker_I3_2", "enum('True','False')"),
  col("Cond_fan_6_circuit_breaker_I3_3", "enum('True','False')"),
  col("Compressor_start_Q0_0", "enum('True','False')"),
  col("Compressor_module_reset_Q0_1", "enum('True','False')"),
  col("CR_valve_25_percent_ON_Q0_2", "enum('True','False')"),
  col("CR_valve_50_percent_ON_Q0_3", "enum('True','False')"),
  col("Solenoid_valve_ON_Q0_4", "enum('True','False')"),
  col("Hot_gas_valve_ON_Q0_5", "enum('True','False')"),
  col("AHT_valve_ON_Q0_6", "enum('True','False')"),
  col("Blower_drive_Start_Q0_7", "enum('True','False')"),
  col("System_warnning_Q1_0", "enum('True','False')"),
  col("Chiller_healthy_Q1_1", "enum('True','False')"),
  col("Cond_fan_1_ON_Q2_1", "enum('True','False')"),
  col("CR_valve_75_percent_ON_Q2_2", "enum('True','False')"),
  col("Chiller_fault_Q2_3", "enum('True','False')"),
  col("Cond_fan_2_ON_Q2_4", "enum('True','False')"),
  col("Cond_fan_3_ON_Q2_5", "enum('True','False')"),
  col("Cond_fan_4_ON_Q2_6", "enum('True','False')"),
  col("CR_valve_100_percent_ON_Q2_7", "enum('True','False')"),
  col("Cond_fan_5_ON_Q3_0", "enum('True','False')"),
  col("Cond_fan_6_ON_Q3_1", "enum('True','False')"),
  col("FAULT_CODE", "int(11)"),
  col("created_at", "timestamp", false),
];

// Keyed by DB table name (matches DEVICE_TO_TABLE_MAP values).
export const DB_SCHEMAS: Record<string, SchemaColumn[]> = {
  GTPL_140_GT_300AP_S7_1200: AP_300,
  GTPL_144_GT_300AP_S7_1200: AP_300,
  GTPL_145_GT_450T_S7_1200: T_450_145,
  GTPL_148_GT_450T_S7_1200: T_450_148,
  GTPL_154_GT_650T_S7_1200: T_650,
  GTPL_155_GT_650T_S7_1200: T_650,
};

export function getSchemaForTable(table?: string): SchemaColumn[] | undefined {
  if (!table) return undefined;
  return DB_SCHEMAS[table];
}

// Device (dash) name -> DB table name, for machines that have a schema here.
export const DEVICE_TO_SCHEMA_TABLE: Record<string, string> = {
  "GTPL-140-gT-300AP-S7-1200": "GTPL_140_GT_300AP_S7_1200",
  "GTPL-144-gT-300AP-S7-1200": "GTPL_144_GT_300AP_S7_1200",
  "GTPL-145-gT-450T-S7-1200": "GTPL_145_GT_450T_S7_1200",
  "GTPL-148-gT-450T-S7-1200": "GTPL_148_GT_450T_S7_1200",
  "GTPL-154-gT-650T-S7-1200": "GTPL_154_GT_650T_S7_1200",
  "GTPL-155-gT-650T-S7-1200": "GTPL_155_GT_650T_S7_1200",
};

// Timestamp columns are NOT faults — never list them.
const TIMESTAMP_COLS = new Set(["created_at", "created_on"]);
const isTimestamp = (n: string) => TIMESTAMP_COLS.has(n.toLowerCase());
const isBoolEnum = (t: string) => /enum\('True','False'\)/i.test(t);
const isInputBit = (n: string) => /_I\d+_\d+$/.test(n); // PLC input bit = fault source
const isOutputBit = (n: string) => /_Q\d+_\d+$/i.test(n); // PLC output = not a fault
const isModeOrStatus = (n: string) =>
  /(_mode$|^Auto_(start|stop|mode)|^Manual_mode|^Aeration_(mode|start|stop)|Continuous_mode|Grain_chilling_mode|Paddy_aeging_mode|healthy|in_operation|_ON_Q|System_warnning)/i.test(
    n
  );
const FAULT_KEYWORDS =
  /(fault|error|open|short|trip|high|low|over|below|above|freeze|winding|feedback|pressure|sensor|please_clean|more_or_less|less_than|not_achieved|overheat|overload|door_open|oil)/i;

/**
 * Fault columns to show for a machine, in schema order.
 * Rule (per user): after the FAULT_CODE column, list every column name
 * (excluding the timestamp). If no named fault columns follow FAULT_CODE
 * (e.g. 650T, where faults are PLC input bits), fall back to the boolean
 * input-bit / fault-keyword columns. created_at / created_on are excluded.
 */
export function getFaultColumnsFromSchema(
  deviceOrTable?: string
): string[] | undefined {
  if (!deviceOrTable) return undefined;
  const table = DEVICE_TO_SCHEMA_TABLE[deviceOrTable] || deviceOrTable;
  const schema = DB_SCHEMAS[table];
  if (!schema) return undefined;

  const fcIdx = schema.findIndex((c) => c.name.toUpperCase() === "FAULT_CODE");
  if (fcIdx !== -1) {
    const after = schema
      .slice(fcIdx + 1)
      .filter((c) => !isTimestamp(c.name) && isBoolEnum(c.type))
      .map((c) => c.name);
    if (after.length) return after;
  }

  // Fallback: boolean input-bit / fault-keyword columns, in schema order.
  return schema
    .filter(
      (c) =>
        isBoolEnum(c.type) &&
        !isTimestamp(c.name) &&
        !isOutputBit(c.name) &&
        !isModeOrStatus(c.name) &&
        (isInputBit(c.name) || FAULT_KEYWORDS.test(c.name))
    )
    .map((c) => c.name);
}
