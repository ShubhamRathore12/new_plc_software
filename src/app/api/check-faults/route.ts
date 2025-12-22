import { pool } from "@/lib/db";

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
  "GREEN_LIGHT",
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

// Machine configuration mapping
const MACHINE_CONFIG = {
  // S7-200 machines
  "GTPL-118-gT-80E-P-S7-200": {
    table: "kabomachinedatasmart200",
    tags: S7_200_TAGS,
    type: "S7-200"
  },
  "GTPL-108-gT-40E-P-S7-200": {
    table: "GTPL_108_gT_40E_P_S7_200_Germany",
    tags: S7_200_TAGS,
    type: "S7-200"
  },
  "GTPL-109-gT-40E-P-S7-200": {
    table: "GTPL_109_gT_40E_P_S7_200_Germany",
    tags: S7_200_TAGS,
    type: "S7-200"
  },
  "GTPL-110-gT-40E-P-S7-200": {
    table: "GTPL_110_gT_40E_P_S7_200_Germany",
    tags: S7_200_TAGS,
    type: "S7-200"
  },
  "GTPL-111-gT-80E-P-S7-200": {
    table: "GTPL_111_gT_80E_P_S7_200_Germany",
    tags: S7_200_TAGS,
    type: "S7-200"
  },
  "GTPL-112-gT-80E-P-S7-200": {
    table: "GTPL_112_gT_80E_P_S7_200_Germany",
    tags: S7_200_TAGS,
    type: "S7-200"
  },
  "GTPL-113-gT-80E-P-S7-200": {
    table: "GTPL_113_gT_80E_P_S7_200_Germany",
    tags: S7_200_TAGS,
    type: "S7-200"
  },
  
  // S7-1200 machines
  "GTPL-122-gT-1000T-S7-1200": {
    table: "gtpl_122_s7_1200_01",
    tags: S7_1200_TAGS,
    type: "S7-1200"
  },
  "Gtpl-S7-1200-02": {
    table: "gtpl_122_s7_1200_01",
    tags: S7_1200_TAGS,
    type: "S7-1200"
  },
  "GTPL-114-gT-140E-S7-1200": {
    table: "GTPL_114_GT_140E_S7_1200",
    tags: S7_1200_TAGS,
    type: "S7-1200"
  },
  "GTPL-115-gT-180E-S7-1200": {
    table: "GTPL_115_GT_180E_S7_1200",
    tags: S7_1200_TAGS,
    type: "S7-1200"
  },
  "GTPL-116-gT-240E-S7-1200": {
    table: "GTPL_116_GT_240E_S7_1200",
    tags: S7_1200_TAGS,
    type: "S7-1200"
  },
  "GTPL-117-gT-320E-S7-1200": {
    table: "GTPL_117_GT_320E_S7_1200",
    tags: S7_1200_TAGS,
    type: "S7-1200"
  },
  "GTPL-119-gT-180E-S7-1200": {
    table: "GTPL_119_GT_180E_S7_1200",
    tags: S7_1200_TAGS,
    type: "S7-1200"
  },
  "GTPL-120-gT-180E-S7-1200": {
    table: "GTPL_120_GT_180E_S7_1200",
    tags: S7_1200_TAGS,
    type: "S7-1200"
  },
  "GTPL-121-gT-1000T-S7-1200": {
    table: "GTPL_121_GT1000T",
    tags: S7_1200_TAGS,
    type: "S7-1200"
  },
  "GTPL-139-GT-300AP-S7-1200": {
    table: "GTPL_139_GT300AP",
    tags: S7_1200_TAGS,
    type: "S7-1200"
  }
};

// Function to check for faults based on machine type
function checkFaults(record: any, machineName: string) {
  const machineConfig = MACHINE_CONFIG[machineName as keyof typeof MACHINE_CONFIG];
  
  if (!machineConfig) {
    console.warn(`No configuration found for machine: ${machineName}`);
    return [];
  }
  
  const activeFaults = [];
  const tags = machineConfig.tags;
  
  // Check each tag for true values
  for (const tag of tags) {
    if (record[tag] === true || record[tag] === 1 || record[tag] === "tr") {
      activeFaults.push({
        tag,
        value: record[tag],
        machineType: machineConfig.type
      });
    }
  }
  
  return activeFaults;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const machineName = searchParams.get("machineName")?.trim() || "";
  
  try {
    // Get machine configuration
    const machineConfig = MACHINE_CONFIG[machineName as keyof typeof MACHINE_CONFIG];
    
    if (!machineConfig) {
      return new Response(
        JSON.stringify({ 
          error: `No configuration found for machine: ${machineName}`,
          availableMachines: Object.keys(MACHINE_CONFIG)
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    const table = machineConfig.table;
    
    // Get the latest record for the machine
    const [rows]: any = await pool.query(
      `SELECT * FROM \`${table}\` ORDER BY id DESC LIMIT 1`
    );
    
    if (rows.length === 0) {
      return new Response(
        JSON.stringify({
          machineName,
          machineType: machineConfig.type,
          table: machineConfig.table,
          faults: [],
          faultCount: 0,
          message: "No data found for this machine"
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    const latestRecord = rows[0];
    const activeFaults = checkFaults(latestRecord, machineName);
    
    return new Response(
      JSON.stringify({
        machineName,
        machineType: machineConfig.type,
        table: machineConfig.table,
        recordId: latestRecord.id,
        timestamp: latestRecord.created_on || latestRecord.created_at || new Date().toISOString(),
        faults: activeFaults,
        faultCount: activeFaults.length,
        hasFaults: activeFaults.length > 0,
        recordData: latestRecord
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Fault check error:", err?.message || err);
    return new Response(
      JSON.stringify({ 
        error: "Database error",
        message: err?.message || "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { machineName, recordData } = body;
    
    if (!machineName || !recordData) {
      return new Response(
        JSON.stringify({ 
          error: "Missing required fields: machineName and recordData"
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    const activeFaults = checkFaults(recordData, machineName);
    
    // If faults found, you can send notifications here
    if (activeFaults.length > 0) {
      // Example: Send email notification
      // await sendFaultNotification(machineName, activeFaults);
      
      console.log(`Faults detected for ${machineName}:`, activeFaults);
    }
    
    return new Response(
      JSON.stringify({
        machineName,
        faults: activeFaults,
        faultCount: activeFaults.length,
        hasFaults: activeFaults.length > 0,
        timestamp: new Date().toISOString()
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("Fault check error:", err?.message || err);
    return new Response(
      JSON.stringify({ 
        error: "Processing error",
        message: err?.message || "Unknown error"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
