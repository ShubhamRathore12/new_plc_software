import { pool } from "@/lib/db";

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

// Function to check for faults and send to API
async function checkFaultsAndNotify(record: any) {
  const activeFaults = [];
  
  // Check each S7_200_TAG for true values
  for (const tag of S7_200_TAGS) {
    if (record[tag] === true || record[tag] === 1 || record[tag] === "tr") {
      activeFaults.push(tag);
    }
  }
  
  // If faults found, send to API
  if (activeFaults.length > 0) {
    try {
      const faultData = {
        recordId: record.id,
        machineName: record.machine_name,
        timestamp: new Date().toISOString(),
        activeFaults: activeFaults,
        recordData: record
      };
      
      // Replace with your actual API endpoint
      const response = await fetch('YOUR_API_ENDPOINT_HERE', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(faultData)
      });
      
      if (!response.ok) {
        console.error('Failed to send fault data to API:', response.statusText);
      } else {
        console.log('Fault data sent successfully:', activeFaults);
      }
    } catch (error) {
      console.error('Error sending fault data to API:', error);
    }
  }
  
  return activeFaults;
}

// Function to get previous records for fault analysis
async function getPreviousRecords(currentRecordId: number, machineName: string, limit: number = 10) {
  try {
    const [rows]: any = await pool.query(
      `SELECT * FROM kabomachinedatasmart200 
       WHERE machine_name = ? AND id < ? 
       ORDER BY id DESC 
       LIMIT ?`,
      [machineName, currentRecordId, limit]
    );
    return rows;
  } catch (error) {
    console.error('Error fetching previous records:', error);
    return [];
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;
  const search = searchParams.get("search")?.trim() || "";
  const checkFaults = searchParams.get("checkFaults") === "true"; // Optional parameter to enable fault checking
  
  try {
    let whereClause = "";
    const values: any[] = [];
    
    // Adjust column name here based on your DB schema
    if (search) {
      whereClause = "WHERE machine_name LIKE ?";
      values.push(`%${search}%`);
    }
    
    // Count query
    const [[{ count }]]: any = await pool.query(
      `SELECT COUNT(*) AS count FROM kabomachinedatasmart200 ${whereClause}`,
      values
    );
    
    // Data query
    const [rows]: any = await pool.query(
      `SELECT * FROM kabomachinedatasmart200 ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );
    
    const total = Number(count);
    const totalPages = Math.ceil(total / limit);
    
    // Enhanced response with fault checking
    const enhancedData = [];
    
    for (const record of rows) {
      let faultInfo = null;
      let previousRecords = null;
      
      if (checkFaults) {
        // Check for faults in current record
        const activeFaults = await checkFaultsAndNotify(record);
        
        // If faults found, get previous records
        if (activeFaults.length > 0) {
          previousRecords = await getPreviousRecords(record.id, record.machine_name);
        }
        
        faultInfo = {
          activeFaults,
          faultCount: activeFaults.length,
          previousRecords
        };
      }
      
      enhancedData.push({
        ...record,
        faultInfo
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
        faultCheckingEnabled: checkFaults,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: any) {
    console.error("DB fetch error:", err?.message || err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}