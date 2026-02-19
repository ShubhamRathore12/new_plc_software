import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import {
  getMachineSpecificResponse,
  MachineResponse,
} from "@/lib/machineUtils";

const MACHINE_TABLES: Record<string, string> = {
  gtpl_122_s7_1200_01: "GTPL_122_S7_1200",
  kabomachinedatasmart200: "KABO_200",
  GTPL_108_gT_40E_P_S7_200_Germany: "GTPL_108",
  GTPL_109_gT_40E_P_S7_200_Germany: "GTPL_109",
  GTPL_110_gT_40E_P_S7_200_Germany: "GTPL_110",
  GTPL_111_gT_80E_P_S7_200_Germany: "GTPL_111",
  GTPL_112_gT_80E_P_S7_200_Germany: "GTPL_112",
  GTPL_113_gT_80E_P_S7_200_Germany: "GTPL_113",
  GTPL_114_GT_140E_S7_1200: "GTPL_114",
  GTPL_115_GT_180E_S7_1200: "GTPL_115",
  GTPL_119_GT_180E_S7_1200: "GTPL_119",
  GTPL_120_GT_180E_S7_1200: "GTPL_120",
  GTPL_116_GT_240E_S7_1200: "GTPL_116",
  GTPL_117_GT_320E_S7_1200: "GTPL_117",
  GTPL_121_GT1000T: "GTPL_121",
  GTPL_124_GT_450T_S7_1200: "GTPL_124",
  GTPL_131_GT_650T_S7_1200: "GTPL_131",
  GTPL_132_GT300AP: "GTPL_132",
  GTPL_137_GT_450T_S7_1200: "GTPL_137",
  GTPL_138_GT_450T_S7_1200: "GTPL_138",
  GTPL_136_GT_450AP_S7_1200: "GTPL_136",
  GTPL_134_GT_450T_S7_1200: "GTPL_134",
  GTPL_135_GT_450T_S7_1200: "GTPL_135",
  GTPL_061_GT_450T_S7_1200: "GTPL_061",
  GTPL_139_GT300AP:"GTPL_139",
  GTPL_142_GT_450AP_S7_1200: "GTPL_142",
  GTPL_123_GT_450AP_S7_1200: "GTPL_123",
  GTPL_143_GT_450AP_S7_1200: "GTPL_143"

};

// In-memory cache for last known state
const previousState: Record<
  string,
  { id: number | null; timestamp: string | null }
> = {};

Object.keys(MACHINE_TABLES).forEach((table) => {
  previousState[table] = { id: null, timestamp: null };
});

export async function GET() {
  const currentTime = new Date();
  const machines: MachineResponse[] = [];

  try {
    for (const [tableName, machineName] of Object.entries(MACHINE_TABLES)) {
      const [rows] = await pool.query<any[]>(
        `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 1`
      );
      const record = rows[0];
      if (!record) continue;

      const id = record.id || 0;
      const timestamp = record.created_at || record.created_on || currentTime;
      const isoTime = new Date(timestamp).toISOString();

      const prev = previousState[tableName];
      const normalizedTimestamp = new Date(timestamp).getTime();
      const normalizedPrevTimestamp = prev.timestamp
        ? new Date(prev.timestamp).getTime()
        : null;

      const idChanged = prev.id !== null ? id > prev.id : false;
      const timeChanged =
        normalizedPrevTimestamp !== null
          ? normalizedTimestamp !== normalizedPrevTimestamp
          : false;

      const hasNewData = idChanged && timeChanged;

      // Update memory cache
      previousState[tableName] = { id, timestamp };

      const baseResponse: MachineResponse = {
        ...getMachineSpecificResponse(
          machineName,
          timestamp,
          currentTime,
          hasNewData
        ),
        recordId: id,
        lastUpdate: isoTime,
        hasNewData,
        idChanged,
        machineName,
        // Add createdAtChanged and createdOnChanged for all machines
        createdAtChanged: timeChanged,
        createdOnChanged: timeChanged,
      };

      // Check for condenser fan status in all machines
      const rawCondFan = record?.COND_FAN_ON || record?.cond_fan_on || record?.Compressor_on_Q0_4;
      if (rawCondFan !== undefined) {
        const condFanOn = rawCondFan === 1 || rawCondFan === "tr" || rawCondFan === "true" || rawCondFan === true || rawCondFan === 'True';
        baseResponse.condFanOn = condFanOn;
      }

      machines.push(baseResponse);
    }

    return NextResponse.json({
      success: true,
      message: "Machine statuses retrieved successfully",
      data: machines,
      timestamp: currentTime.toISOString(),
    });
  } catch (err: any) {
    console.error("❌ Error fetching machine statuses:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching machine statuses",
        error:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Internal server error",
      },
      { status: 500 }
    );
  }
}