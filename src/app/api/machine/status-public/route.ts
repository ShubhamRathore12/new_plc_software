import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import {
  getMachineSpecificResponse,
  MachineResponse,
} from "@/lib/machineUtils";
import { TABLE_TO_STATUS_KEY } from "@/lib/machineRegistry";

const MACHINE_TABLES: Record<string, string> = TABLE_TO_STATUS_KEY;

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
      try {
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
      } catch (tableErr: any) {
        // Skip tables that don't exist yet in the database — they'll work once created
        if (tableErr?.errno === 1146) continue;
        throw tableErr;
      }
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