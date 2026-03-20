import { pool } from "@/lib/db";
import { MACHINE_REGISTRY } from "@/lib/machineRegistry";

// S7-200 specific tags
const S7_200_TAGS = [
  "AERATION_MODE_WITH_HEAT",
  "AERATION_MODE_WITHOUT_HEAT",
  "AERATION_WITH_HEATER_START",
  "AERATION_WITH_HEATER_STOP",
  "AERATION_WITHOUT_HEATER_START",
  "AERATION_WITHOUT_HEATER_STOP",
  "AFTER_HEAT_TEMP_MORE_THAN_50",
  "AFTER_HEAT_TEMP_SENSOR_TH_OPEN",
  "AFTER_HEAT_TEMP_SENSOR_TH_SHORT_CIRCUIT",
  "AFTER_HEAT_VALVE_ON",
  "AHT_START_MANUAL_MODE",
  "AHT_STOP_MANUAL_MODE",
  "AIR_OUTLET_TEMP_SENSOR_T0_OPEN",
  "AIR_OUTLET_TEMP_SENSOR_T0_SHORT_CIRCUIT",
  "AMBIENT_TEMP_LESS_THAN_4",
  "AMBIENT_TEMP_LOW_THAN_SET_TEMP",
  "AMBIENT_TEMP_OVER_40",
  "AMBIENT_TEMP_OVER_43",
  "AMBIENT_TEMP_SENSOR_T2_OPEN",
  "AMBIENT_TEMP_SENSOR_T2_SHORT_CIRCUIT",
  "ANTI_FREEZE_PROTECTION",
  "AUTO_AERATION_ENABLE",
  "AUTO_EN",
  "AUTO_PROCESS_PB",
  "AUTO_PROCESS_STOP_PB",
  "BLOWER_CIRCUIT_BREAKER_FAULT",
  "BLOWER_DRIVE_ENABLE",
  "BLOWER_DRIVE_FAULT",
  "BLOWER_DRIVE_ON",
  "BLOWER_START_MANUAL_MOD",
  "BLOWER_STOP_MANUAL_MODE",
  "BUZZER_ON",
  "C0ND_FAN_TOP",
  "COLD_AIR_TEMP_SENSOR_T1_OPEN",
  "COLD_AIR_TEMP_SENSOR_T1_SHORT_CIRCUIT",
  "COMPRESSOR_CIRCUIT_BREA_FAULT",
  "COMPRESSOR_ON",
  "COMPRESSOR_START_MANUAL",
  "COMPRESSOR_STOP_MANUAL",
  "COMPRESSOR_VISIBLE",
  "COND_FAN_CIRCUIT_BREAKE_FAULT",
  "cond_fan_on",
  "COND_FAN_START_MANUAL_M",
  "COND_FAN_STOP_MANUAL_M",
  "CONDENSER_FAN_DOOR_OPEN",
  "CONTINUOUS_MODE",
  "FAULT_RESET",

  "HEATER_CIRCUIT_BREAKER_FAULT",
  "HEATER_RCCCB_TRIP_FAULT",
  "HEATER_START_MANUAL",
  "HEATER_STOP_MANUAL",
  "HEATER_TOP_FAULT",
  "HIGH_PRESSURE_FAULT",
  "HIGH_PRESSURE_FAULT_LOCKED",
  "HOT_GAS_VALVE_ON",
  "HOT_GAS_VALVE_START_MAN",
  "HOT_GAS_VALVE_STOP_MAN",
  "HP_TRANSDUCEER_FAILURE",
  "LOW_PRESSURE_FAULT",
  "LOW_PRESSURE_FAULT_LOCKED",
  "LP_TRANSDUCER_FAILURE",
  "MANUAL_EN",
  "OPERATING_HOURS_RESET",
  "SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE",
  "SET_TIME",
  "THREE_PHASE_MONITORING_FAULT",
];

// S7-1200 specific tags
const S7_1200_TAGS = [
  "AUTO_PROCESS_PB",
  "AUTO_PROCESS_STOP_PB",
  "AUTO_AERATION_ENA",
  "AHT_vale_speed",
  "Hot_valve_speed",
  "Blower_speed",
  "Compressor_timer",
  "HP_value",
  "LP_value",
  "T0_temp_mean",
  "T0_set_point",
  "T1_temp_mean",
  "T2_temp_mean",
  "Delta_T_set_point",
  "AI_RH_Analog_Scale",
  "AI_Pa_Analog_Scale",
  "AFTER_HEATER_TEMP_Th",
  "AIR_OUTLET_TEMP",
  "COLD_AIR_TEMP_T1",
  "AMBIENT_AIR_TEMP_T2",
  "AFTER_HEAT_VALVE_RPM",
  "HOT_GAS_VALVE_RPM",
  "BLOWER_RPM",
  "CONDENSER_RPM",
  "COMPRESSOR_TIME",
  "HP",
  "LP",
  "AI_TH_Act",
  "AI_AIR_OUTLET_TEMP",
  "AI_COLD_AIR_TEMP",
  "AI_AMBIANT_TEMP",
  "Value_to_Display_HEATER",
  "Value_to_Display_AHT_VALE_OPEN",
  "Value_to_Display_HOT_GAS_VALVE_OPEN",
  "Value_to_Display_EVAP_ACT_SPEED",
  "Value_to_Display_COND_ACT_SPEED",
  "AI_COND_PRESSURE",
  "AI_SUC_PRESSURE",
];

const GPL_115_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Condenser_fan_door_open",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Heater_circuit_breaker_fault",
  "Three_phase_monitor_fault",
  "Low_Pressure_Fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_Over_43C",
  "Compressor_motor_overheat",
  "Heater_RCCB_fault",
  "Low_pressure_fault_Locked",
  "Anti_Freeze_Protection",
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
  "TH_Temp_more_than_50C",
  "Delta_not_achieved_in_aeration_mode",
  "Warning_LP_transducer_failure",
  "Warning_HP_transducer_failure"
];

const GPL_117_TAGS = [
  "Compressor_circuit_breaker_fault" ,
  "Condenser_fan1_door_open" ,
  "Blower_drive_fault" ,
  "Blower_circuit_breaker_fault" ,
  "Heater_circuit_breaker_fault" ,
  "Three_phase_monitor_fault" ,
  "Low_Pressure_Fault" ,
  "Ambient_temp_lower_than_set_temp" ,
   "Ambient_temp_Over_43C" ,
   "Compressor_motor_overheat" ,
   "Heater_RCCB_fault" ,
   "Cond_Fan2_circuit_breaker_fault" ,
   "Low_pressure_fault_Locked" ,
   "Anti_Freeze_Protection" ,
   "High_pressure_fault_Locked" ,
   "Ambient_temp_Over_40C" ,
   "Ambient_temp_Less_than_4C" ,
   "Cond_Fan_1_TOP" ,
   "Cond_Fan1_circuit_breaker_fault" ,
   "Cond_Fan_drive_fault" ,
   "Cond_Fan_2_TOP" ,
   "Ambient_Temp_Sensor_T2_1_Open" ,
   "Ambient_Temp_Sensor_T2_1_Short_Circuit" ,
   "Ambient_Temp_Sensor_T2_2_Open" ,
   "Ambient_Temp_Sensor_T2_2_Short_Circuit" ,
   "Air_Outlet_Temp_Sensor_T0_1_Open" ,
   "Air_Outlet_Temp_Sensor_T0_1_Short_Circuit" ,
   "Air_Outlet_Temp_Sensor_T0_2_Open" ,
   "Air_Outlet_Temp_Sensor_T0_2_Short_Circuit" ,
   "Cold_Air_Temp_Sensor_T1_1_Open" ,
   "Cold_Air_Temp_Sensor_T1_1_Short_Circuit" ,
   "Cold_Air_Temp_Sensor_T1_2_Open" ,
   "Cold_Air_Temp_Sensor_T1_2_Short_Circuit" ,
   "Air_After_Heater_Temp_Sensor_TH_1_Open" ,
   "Air_After_Heater_Temp_Sensor_TH_1_Short_Circuit" ,
   "Air_After_Heater_Temp_Sensor_TH_2_Open" ,
   "Air_After_Heater_Temp_Sensor_TH_2_Short_Circuit" ,
   "High_Pressure_Fault" ,
   "Comp_Oil_Low" ,
   "Heater_TOP_fault" ,
   "Heater_drive_Fault" ,
   "Condenser_fan2_door_open" ,
   "TH_Temp_more_than_50C" ,
   "Delta_not_achieved_in_aeration_mode" ,
   "Warning_LP_transducer_failure" ,
   "Warning_HP_transducer_failure" ,
];


// Derived from centralized registry — no manual updates needed
const MACHINE_CONFIG: Record<string, { table: string; tags: string[]; type: string }> = Object.fromEntries(
  MACHINE_REGISTRY.map((m) => [m.name, { table: m.table, tags: m.tags, type: m.type }])
);

// Optional alias mapping (e.g. "GPL-115" → "GTPL-115-gT-180E-S7-1200")
const MACHINE_NAME_ALIASES: Record<string, string> = {
  "GPL-115": "GTPL-115-gT-180E-S7-1200",
  "GPL-117" : "GTPL-117-gT-320E-S7-1200",
};

// ------------------ Fault Check Utility ------------------

async function checkFaultsAndNotify(record: any, machineName: string) {
  const machineConfig = MACHINE_CONFIG[machineName as keyof typeof MACHINE_CONFIG];

  if (!machineConfig) return [];

  const activeFaults = [];
  const tags = machineConfig.tags;

  for (const tag of tags) {
    const value = record?.[tag];
    if (
      value === true ||
      value === 1 ||
      value === "tr" || value === "True" ||
      (typeof value === "string" && value.toLowerCase() === "true")
    ) {
      activeFaults.push({ tag, value, machineType: machineConfig.type });
    }
  }

  if (activeFaults.length > 0) {
    try {
      await fetch("YOUR_API_ENDPOINT_HERE", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recordId: record.id,
          machineName,
          machineType: machineConfig.type,
          table: machineConfig.table,
          timestamp: new Date().toISOString(),
          activeFaults,
          recordData: record,
        }),
      });
    } catch (err) {
      console.error("API push failed:", err);
    }
  }

  return activeFaults;
}

async function getPreviousRecords(currentRecordId: number, machineName: string, table: string, limit = 10) {
  try {
    const [rows]: any = await pool.query(
      `SELECT * FROM \`${table}\` WHERE id < ? ORDER BY id DESC LIMIT ?`,
      [currentRecordId, limit]
    );
    return rows || [];
  } catch (error) {
    console.error("DB fetch error:", error);
    return [];
  }
}

// ------------------ GET Handler ------------------

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  const rawMachineName = searchParams.get("machineName")?.trim() || "";
  const machineName = MACHINE_NAME_ALIASES[rawMachineName] || rawMachineName;
  const checkFaults = searchParams.get("checkFaults") === "true";
  const search = searchParams.get("search")?.trim() || "";

const machineConfig = MACHINE_CONFIG[machineName as keyof typeof MACHINE_CONFIG];


  if (!machineConfig) {
    return new Response(
      JSON.stringify({
        error: `No configuration found for machine: ${machineName}`,
        availableMachines: Object.keys(MACHINE_CONFIG),
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const table = machineConfig.table;
    const values: any[] = [];
    let whereClause = "";

    if (search) {
      // Search for matching tag names (not values) - filter tags that contain the search term
      const tags = machineConfig.tags;
      const matchingTags = tags.filter(tag => 
        tag.toLowerCase().includes(search.toLowerCase())
      );
      
      if (matchingTags.length > 0) {
        // Build conditions to find records where any matching tag is active
        const searchConditions = matchingTags.map(tag => {
          if (machineConfig.type === "S7-200") {
            return `(\`${tag}\` = 'tr' OR \`${tag}\` = 'True' OR \`${tag}\` = true OR \`${tag}\` = 1)`;
          } else {
            return `(\`${tag}\` = 'true' OR \`${tag}\` = 'True' OR \`${tag}\` = true OR \`${tag}\` = 1 OR \`${tag}\` = '1')`;
          }
        }).join(' OR ');
        
        whereClause = `WHERE (${searchConditions})`;
      } else {
        // No matching tags found, return empty results
        whereClause = "WHERE 1 = 0";
      }
    }

    const [[{ count }]]: any = await pool.query(
      `SELECT COUNT(*) AS count FROM \`${table}\` ${whereClause}`,
      values
    );

    const [result] = await pool.query(
      `SELECT * FROM \`${table}\` ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const rows = Array.isArray(result) ? result : [];
    const total = Number(count) || 0;
    const totalPages = Math.max(1, Math.ceil(total / limit));

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({
          data: [],
          total: 0,
          totalPages: 1,
          page,
          limit,
          message: `No records found for machine: ${machineName}`,
          machineName,
          machineType: machineConfig.type,
          table,
          faultCheckingEnabled: checkFaults,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const enhancedData = [];

  for (const record of rows as { id: number; [key: string]: any }[]) {
  let faultInfo = null;
  let previousRecords = null;

  if (checkFaults) {
    const activeFaults = await checkFaultsAndNotify(record, machineName);
    if (activeFaults.length > 0) {
      previousRecords = await getPreviousRecords(record.id, machineName, table);
    }

    faultInfo = {
      activeFaults,
      faultCount: activeFaults.length,
      machineType: machineConfig.type,
      previousRecords,
    };
  }

  enhancedData.push({
    ...record,
    faultInfo,
  });
}


    return new Response(
      JSON.stringify({
        data: enhancedData,
        total,
        totalPages,
        page,
        limit,
        search,
        machineName,
        machineType: machineConfig.type,
        table,
        faultCheckingEnabled: checkFaults,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("Unhandled error:", err.message || err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}