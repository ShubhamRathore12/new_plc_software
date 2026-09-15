/**
 * GTPL-156 / GTPL-157 (gT-450T, Philippines silo chillers).
 *
 * The PLC I/O list (SILO analog/digital I/O config) names the signals slightly
 * differently from the columns the logger writes into
 * GTPL_156_GT_450T_S7_1200 / GTPL_157_GT_450T_S7_1200. Each row therefore
 * carries the PLC tag name plus the DB column(s) to read: `keys` is tried in
 * order, so the PLC name keeps working if the column is ever renamed to match.
 */

export interface IORow {
  /** PLC address, e.g. "I0.0" / "Q2.7" / "AIW72" */
  id: string;
  /** Human label shown in the UI */
  description: string;
  /** PLC tag name from the I/O list */
  tag: string;
  /** DB column candidates, tried in order */
  keys: string[];
}

export const GTPL_156_157_MACHINES = [
  "GTPL-156-gT-450T-S7-1200",
  "GTPL-157-gT-450T-S7-1200",
];

export const isGTPL156157 = (device?: string | null): boolean =>
  !!device && ["GTPL-156", "GTPL-157"].some((n) => device.includes(n));

/** Read the first key that exists on the row. */
export const pickTagValue = (data: any, keys: string[]): any => {
  if (!data) return undefined;
  for (const k of keys) {
    if (data[k] !== undefined && data[k] !== null) return data[k];
  }
  return undefined;
};

// ---------------------------------------------------------------------------
// Digital inputs
// ---------------------------------------------------------------------------
export const GTPL_156_157_DIGITAL_INPUT_ROWS: IORow[] = [
  { id: "I0.0", description: "Compressor circuit breaker", tag: "Compressor_circuit_breaker_I0_0", keys: ["Compressor_circuit_breaker_I0_0"] },
  { id: "I0.1", description: "Compressor motor overheat", tag: "Compressor_motor_overheat_I0_1", keys: ["Compressor_motor_overheat_I0_1"] },
  { id: "I0.2", description: "Compressor in operation", tag: "Compressor_in_operation_I0_2", keys: ["Compressor_in_operation_I0_2"] },
  { id: "I0.3", description: "Oil pressure low", tag: "Oil_pressure_low_I0_3", keys: ["Oil_pressure_low_I0_3", "Compressor_oil_low_I0_3"] },
  { id: "I0.4", description: "Blower drive fault", tag: "Blower_drive_fault_I0_4", keys: ["Blower_drive_fault_I0_4"] },
  { id: "I0.5", description: "Blower drive in operation", tag: "Blower_drive_in_operation_I0_5", keys: ["Blower_drive_in_operation_I0_5"] },
  { id: "I0.6", description: "Blower circuit breaker", tag: "Blower_circuit_breaker_I0_6", keys: ["Blower_circuit_breaker_I0_6"] },
  { id: "I0.7", description: "Cond fan 1 TOP", tag: "Cond_fan_1_TOP_I0_7", keys: ["Cond_fan_1_TOP_I0_7", "Condenser_fan1_TOP_fault_I0_7"] },
  { id: "I1.0", description: "Cond fan 1 circuit breaker", tag: "Cond_fan_1_circuit_breaker_I1_0", keys: ["Cond_fan_1_circuit_breaker_I1_0", "Condenser_fan1_circuit_breaker_I1_0"] },
  { id: "I1.1", description: "Spare", tag: "Spare_I1_1", keys: ["Spare_I1_1"] },
  { id: "I1.2", description: "Low pressure fault", tag: "Low_pressure_fault_I1_2", keys: ["Low_pressure_fault_I1_2"] },
  { id: "I1.3", description: "High pressure fault", tag: "High_pressure_fault_I1_3", keys: ["High_pressure_fault_I1_3", "High_Pressure_Fault_I1_3"] },
  { id: "I1.4", description: "Auto start enable", tag: "Auto_start_enable_I1_4", keys: ["Auto_start_enable_I1_4", "Start_stop_I1_4"] },
  { id: "I2.0", description: "Three phase monitor fault", tag: "Three_phase_monitor_fault_I2_0", keys: ["Three_phase_monitor_fault_I2_0"] },
  { id: "I2.2", description: "Cond fan 2 TOP", tag: "Cond_fan_2_TOP_I2_2", keys: ["Cond_fan_2_TOP_I2_2", "Cond_fan2_TOP_fault_I2_2"] },
  { id: "I2.3", description: "Cond fan 3 TOP", tag: "Cond_fan_3_TOP_I2_3", keys: ["Cond_fan_3_TOP_I2_3", "Cond_fan3_TOP_fault_I2_3"] },
  { id: "I2.4", description: "Cond fan 4 TOP", tag: "Cond_fan_4_TOP_I2_4", keys: ["Cond_fan_4_TOP_I2_4", "Cond_fan4_TOP_fault_I2_4"] },
  { id: "I2.5", description: "Cond fan 2 circuit breaker", tag: "Cond_fan_2_circuit_breaker_I2_5", keys: ["Cond_fan_2_circuit_breaker_I2_5", "Cond_fan2_circuit_breaker_fault_I2_5"] },
  { id: "I2.6", description: "Cond fan 3 circuit breaker", tag: "Cond_fan_3_circuit_breaker_I2_6", keys: ["Cond_fan_3_circuit_breaker_I2_6", "Cond_fan3_circuit_breaker_fault_I2_6"] },
  { id: "I2.7", description: "Cond fan 4 circuit breaker", tag: "Cond_fan_4_circuit_breaker_I2_7", keys: ["Cond_fan_4_circuit_breaker_I2_7", "Cond_fan4_circuit_breaker_fault_I2_7"] },
];

// ---------------------------------------------------------------------------
// Digital outputs
// ---------------------------------------------------------------------------
export const GTPL_156_157_DIGITAL_OUTPUT_ROWS: IORow[] = [
  { id: "Q0.0", description: "Compressor on", tag: "Compressor_on_Q0_0", keys: ["Compressor_on_Q0_0"] },
  { id: "Q0.1", description: "Compressor motor reset", tag: "Compressor_motor_reset_Q0_1", keys: ["Compressor_motor_reset_Q0_1"] },
  { id: "Q0.2", description: "CR valve 25%", tag: "CR_valve_25_percent_Q0_2", keys: ["CR_valve_25_percent_Q0_2", "CR_25_percent_ON_Q0_2"] },
  { id: "Q0.3", description: "CR valve 50%", tag: "CR_valve_50_percent_Q0_3", keys: ["CR_valve_50_percent_Q0_3", "CR_50_percent_ON_Q0_3"] },
  { id: "Q0.4", description: "Solenoid valve on", tag: "Solenoid_valve_on_Q0_4", keys: ["Solenoid_valve_on_Q0_4"] },
  { id: "Q0.5", description: "Hot gas valve on", tag: "Hot_gas_valve_on_Q0_5", keys: ["Hot_gas_valve_on_Q0_5"] },
  { id: "Q0.6", description: "After heat valve on", tag: "After_heat_valve_on_Q0_6", keys: ["After_heat_valve_on_Q0_6"] },
  { id: "Q0.7", description: "Blower drive on", tag: "Blower_drive_on_Q0_7", keys: ["Blower_drive_on_Q0_7"] },
  { id: "Q1.0", description: "Collective trouble signal", tag: "Collective_trouble_signal_Q1_0", keys: ["Collective_trouble_signal_Q1_0", "Collective_Trouble_Signal_Q1_0"] },
  { id: "Q1.1", description: "Chiller healthy on", tag: "Chiller_healthy_on_Q1_1", keys: ["Chiller_healthy_on_Q1_1"] },
  { id: "Q1.2", description: "Spare", tag: "Spare_Q1_2", keys: ["Spare_Q1_2", "Spare_Q2_0"] },
  { id: "Q2.1", description: "Condenser fan 1 on", tag: "Condenser_fan_1_on_Q2_1", keys: ["Condenser_fan_1_on_Q2_1", "Condenser_fan1_on_Q2_1"] },
  { id: "Q2.2", description: "CR valve 75% on", tag: "CR_valve_75_percent_on_Q2_2", keys: ["CR_valve_75_percent_on_Q2_2", "CR_75_percent_ON_Q2_2"] },
  { id: "Q2.3", description: "Chiller fault", tag: "Chiller_fault_Q2_3", keys: ["Chiller_fault_Q2_3", "Chiller_Fault_Q2_3"] },
  { id: "Q2.4", description: "Condenser fan 2 on", tag: "Condenser_fan_2_on_Q2_4", keys: ["Condenser_fan_2_on_Q2_4", "Condenser_fan2_on_Q2_4"] },
  { id: "Q2.5", description: "Condenser fan 3 on", tag: "Condenser_fan_3_on_Q2_5", keys: ["Condenser_fan_3_on_Q2_5", "Condenser_fan3_on_Q2_5"] },
  { id: "Q2.6", description: "Condenser fan 4 on", tag: "Condenser_fan_4_on_Q2_6", keys: ["Condenser_fan_4_on_Q2_6", "Condenser_fan4_on_Q2_6"] },
  { id: "Q2.7", description: "CR valve 100% on", tag: "CR_valve_100_percent_on_Q2_7", keys: ["CR_valve_100_percent_on_Q2_7", "CR_100_percent_ON_Q2_7"] },
];

// ---------------------------------------------------------------------------
// Analog I/O
// ---------------------------------------------------------------------------
export const GTPL_156_157_ANALOG_INPUT_ROWS: IORow[] = [
  { id: "AIW72", description: "Suction pressure", tag: "Suction_pressure_AIW72", keys: ["Suction_pressure_AIW72", "LP_value"] },
  { id: "AIW74", description: "Discharge pressure", tag: "Discharge_pressure_AIW74", keys: ["Discharge_pressure_AIW74", "HP_value"] },
  { id: "AIW64", description: "Static pressure", tag: "Static_pressure_AIW64", keys: ["Static_pressure_AIW64", "Static_pressure"] },
  { id: "AIW112", description: "T0 probe #1 (Afterheater)", tag: "T0_probe_afterheater_AIW112", keys: ["T0_probe_afterheater_AIW112", "T0_1_air_outlet_temp"] },
  { id: "AIW114", description: "T0 probe #2 (Afterheater)", tag: "T0_probe_afterheater_2_AIW114", keys: ["T0_probe_afterheater_2_AIW114", "T0_2_air_outlet_temp"] },
  { id: "AIW116", description: "T1 probe #1 (Cold Air)", tag: "T1_probe_cold_air_AIW116", keys: ["T1_probe_cold_air_AIW116", "T1_1_cold_air_temp"] },
  { id: "AIW118", description: "T1 probe #2 (Cold Air)", tag: "T1_probe_cold_air_2_AIW118", keys: ["T1_probe_cold_air_2_AIW118", "T1_2_cold_air_temp"] },
  { id: "AIW120", description: "T2 probe #1 (Ambient Air)", tag: "T2_probe_ambient_air_AIW120", keys: ["T2_probe_ambient_air_AIW120", "T2_1_ambient_temp"] },
  { id: "AIW122", description: "T2 probe #2 (Ambient Air)", tag: "T2_probe_ambient_air_2_AIW122", keys: ["T2_probe_ambient_air_2_AIW122", "T2_2_ambient_temp"] },
];

export const GTPL_156_157_ANALOG_OUTPUT_ROWS: IORow[] = [
  { id: "AQW72", description: "Blower speed", tag: "Blower_speed_AQW72", keys: ["Blower_speed_AQW72", "Blower_speed"] },
  { id: "AQW80", description: "Hot gas valve", tag: "Hot_gas_valve_AQW80", keys: ["Hot_gas_valve_AQW80", "Hot_valve_speed"] },
  { id: "AQW82", description: "Afterheat valve", tag: "Afterheat_valve_AQW82", keys: ["Afterheat_valve_AQW82", "AHT_vale_speed", "AHT_valve_speed"] },
];

/**
 * Analog page config. Labels must match the analog page's item templates, so
 * these use the page's wording while pointing at the same columns as the rows
 * above. "Static Pressure" is silo-only and is injected into the 4-20mA list.
 */
export const GTPL_156_157_ANALOG_CONFIG = {
  displayName: "GTPL-156 / 157 Silo Chiller",
  inputs: {
    "Suction Pressure": "LP_value",
    "Discharge Pressure": "HP_value",
    "Static Pressure": "Static_pressure",
    "T2.1 Ambient Temp": "T2_1_ambient_temp",
    "T2.2 Ambient Temp": "T2_2_ambient_temp",
    "T1.1 Cold Temp": "T1_1_cold_air_temp",
    "T1.2 Cold Temp": "T1_2_cold_air_temp",
    "T0.1 Air Outlet Temp": "T0_1_air_outlet_temp",
    "T0.2 Air Outlet Temp": "T0_2_air_outlet_temp",
  },
  outputs: {
    "Blower Speed": "Blower_speed",
    "Hot Gas Valve": "Hot_valve_speed",
    "Afterheat Valve": "AHT_vale_speed",
    "Condenser fan speed": "Condenser_fan_speed",
  },
};

// ---------------------------------------------------------------------------
// Fault tags (SILO fault list) -> DB fault columns
// ---------------------------------------------------------------------------
export const GTPL_156_157_FAULT_ROWS: IORow[] = [
  { id: "1", description: "Compressor circuit breaker fault", tag: "Compressor_circuit_breaker_fault", keys: ["Compressor_circuit_breaker_fault"] },
  { id: "2", description: "Oil pressure low", tag: "Oil_pressure_low", keys: ["Oil_pressure_low"] },
  { id: "3", description: "Blower drive fault", tag: "Blower_drive_fault", keys: ["Blower_drive_fault"] },
  { id: "4", description: "Blower circuit breaker fault", tag: "Blower_circuit_breaker_fault", keys: ["Blower_circuit_breaker_fault"] },
  { id: "5", description: "Ambient air sensor 1 open", tag: "Ambient_air_sensor_1_open", keys: ["Ambient_air_sensor_1_open", "Ambient_air_sensor_T2_1_open"] },
  { id: "6", description: "Condenser fan overload", tag: "COND_FAN_OVERLOAD", keys: ["COND_FAN_OVERLOAD", "Condenser_fan_1_TOP_fault"] },
  { id: "7", description: "Three phase monitor fault", tag: "Three_phase_monitor_fault", keys: ["Three_phase_monitor_fault"] },
  { id: "8", description: "High pressure fault", tag: "High_pressure_fault", keys: ["High_pressure_fault"] },
  { id: "9", description: "Ambient temp lower than set temp", tag: "Ambient_temp_lower_than_set_temp", keys: ["Ambient_temp_lower_than_set_temp"] },
  { id: "10", description: "Ambient temp over 50C", tag: "Ambient_temp_over_50C", keys: ["Ambient_temp_over_50C"] },
  { id: "11", description: "Compressor module feedback error", tag: "COMP_MODULE_FEEDBACK_ERROR_Si_I1", keys: ["COMP_MODULE_FEEDBACK_ERROR_Si_I1", "Compressor_feedback_error"] },
  { id: "12", description: "Low pressure 1 fault", tag: "Low_pressure_1_fault", keys: ["Low_pressure_1_fault"] },
  { id: "13", description: "Compressor feedback error", tag: "COMP_FBK_ERROR", keys: ["COMP_FBK_ERROR", "Compressor_feedback_error"] },
  { id: "14", description: "Low pressure 2 fault", tag: "Low_pressure_2_fault", keys: ["Low_pressure_2_fault"] },
  { id: "15", description: "Ambient temp over 43C", tag: "Ambient_temp_over_43C", keys: ["Ambient_temp_over_43C"] },
  { id: "16", description: "Condenser fan 2 TOP fault", tag: "Condenser_fan_2_TOP_fault", keys: ["Condenser_fan_2_TOP_fault"] },
  { id: "17", description: "Condenser fan 3 TOP fault", tag: "Condenser_fan_3_TOP_fault", keys: ["Condenser_fan_3_TOP_fault"] },
  { id: "18", description: "Condenser fan 4 TOP fault", tag: "Condenser_fan_4_TOP_fault", keys: ["Condenser_fan_4_TOP_fault"] },
  { id: "19", description: "Condenser fan 2 circuit breaker fault", tag: "Condenser_fan_2_circuit_breaker_fault", keys: ["Condenser_fan_2_circuit_breaker_fault"] },
  { id: "20", description: "Condenser fan 3 circuit breaker fault", tag: "Condenser_fan_3_circuit_breaker_fault", keys: ["Condenser_fan_3_circuit_breaker_fault"] },
  { id: "21", description: "Condenser fan 4 circuit breaker fault", tag: "Condenser_fan_4_circuit_breaker_fault", keys: ["Condenser_fan_4_circuit_breaker_fault"] },
  { id: "22", description: "Condenser fan 1 circuit breaker fault", tag: "Condenser_fan_1_circuit_breaker_fault", keys: ["Condenser_fan_1_circuit_breaker_fault"] },
  { id: "23", description: "Condenser fan 1 TOP fault", tag: "Condenser_fan_1_TOP_fault", keys: ["Condenser_fan_1_TOP_fault"] },
  { id: "24", description: "Ambient air sensor 1 short circuit", tag: "Ambient_air_sensor_1_short_circuit", keys: ["Ambient_air_sensor_1_short_circuit", "Ambient_air_sensor_T2_1_short_circuit"] },
  { id: "25", description: "Ambient air sensor 2 open", tag: "Ambient_air_sensor_2_open", keys: ["Ambient_air_sensor_2_open", "Ambient_air_sensor_T2_2_open"] },
  { id: "26", description: "Ambient air sensor 2 short circuit", tag: "Ambient_air_sensor_2_short_circuit", keys: ["Ambient_air_sensor_2_short_circuit", "Ambient_air_sensor_T2_2_short_circuit"] },
  { id: "27", description: "Cold air sensor 1 open", tag: "Cold_air_sensor_1_open", keys: ["Cold_air_sensor_1_open", "Cold_air_sensor_T1_1_open"] },
  { id: "28", description: "Cold air sensor 1 short circuit", tag: "Cold_air_sensor_1_short_circuit", keys: ["Cold_air_sensor_1_short_circuit", "Cold_air_sensor_T1_1_short_circuit"] },
  { id: "29", description: "Cold air sensor 2 open", tag: "Cold_air_sensor_2_open", keys: ["Cold_air_sensor_2_open", "Cold_air_sensor_T1_2_open"] },
  { id: "30", description: "Cold air sensor 2 short circuit", tag: "Cold_air_sensor_2_short_circuit", keys: ["Cold_air_sensor_2_short_circuit", "Cold_air_sensor_T1_2_short_circuit"] },
  { id: "31", description: "Air outlet sensor 1 open", tag: "Air_outlet_sensor_1_open", keys: ["Air_outlet_sensor_1_open", "Air_outlet_sensor_T0_1_open"] },
  { id: "32", description: "Air outlet sensor 1 short circuit", tag: "Air_outlet_sensor_1_short_circuit", keys: ["Air_outlet_sensor_1_short_circuit", "Air_outlet_sensor_T0_1_short_circuit"] },
  { id: "33", description: "Air outlet sensor 2 open", tag: "Air_outlet_sensor_2_open", keys: ["Air_outlet_sensor_2_open", "Air_outlet_sensor_T0_2_open"] },
  { id: "34", description: "Air outlet sensor 2 short circuit", tag: "Air_outlet_sensor_2_short_circuit", keys: ["Air_outlet_sensor_2_short_circuit", "Air_outlet_sensor_T0_2_short_circuit"] },
];

/** DB columns for the fault page's tag table / active-fault scan. */
export const GTPL_156_157_FAULT_COLUMNS = GTPL_156_157_FAULT_ROWS.map(
  (r) => r.keys[r.keys.length - 1]
);
