import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// ─── Machine table → display name mapping ───────────────────────────────────
// table name → machineName (must match frontend deviceNameToStatusKey values)
const MACHINE_TABLES: Record<string, string> = {
  gtpl_122_s7_1200_01: "GTPL_122_S7_1200",
  GTPL_118_GT_60T_S7_1200: "KABO_200",
  GTPL_108_gT_40E_P_S7_200_Germany: "GTPL_108",
  GTPL_109_gT_40E_P_S7_200_Germany: "GTPL_109",
  GTPL_110_gT_40E_P_S7_200_Germany: "GTPL_110",
  GTPL_111_gT_80E_P_S7_200_Germany: "GTPL_111",
  GTPL_112_gT_80E_P_S7_200_Germany: "GTPL_112",
  GTPL_113_gT_80E_P_S7_200_Germany: "GTPL_113",
  GTPL_114_GT_140E_S7_1200: "GTPL_114",
  GTPL_115_GT_180E_S7_1200: "GTPL_115",
  GTPL_116_GT_240E_S7_1200: "GTPL_116",
  GTPL_117_GT_320E_S7_1200: "GTPL_117",
  GTPL_119_GT_180E_S7_1200: "GTPL_119",
  GTPL_120_GT_180E_S7_1200: "GTPL_120",
  GTPL_121_GT1000T: "GTPL_121",
  GTPL_123_GT_450AP_S7_1200: "GTPL_123",
  GTPL_124_GT_450T_S7_1200: "GTPL_124",
  GTPL_131_GT_650T_S7_1200: "GTPL_131",
  GTPL_132_GT300AP: "GTPL_132",
  GTPL_133_GT_650T_S7_1200: "GTPL_131",
  GTPL_134_GT_450T_S7_1200: "GTPL_134",
  GTPL_135_GT_450T_S7_1200: "GTPL_135",
  GTPL_136_GT_450AP_S7_1200: "GTPL_136",
  GTPL_137_GT_450T_S7_1200: "GTPL_137",
  GTPL_138_GT_450T_S7_1200: "GTPL_138",
  GTPL_139_GT300AP: "GTPL_139",
  GTPL_142_GT_450AP_S7_1200: "GTPL_142",
  GTPL_143_GT_450AP_S7_1200: "GTPL_143",
  GTPL_144_GT_300AP_S7_1200: "GTPL_144_GT_300AP_S7_1200",
  GTPL_145_GT_450T_S7_1200: "GTPL_145",
  GTPL_061_GT_450T_S7_1200: "GTPL_061",
};

// ─── Determine machine status purely from timestamp freshness ───────────────
function getStatusFromTimestamp(timestamp: Date, currentTime: Date) {
  const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);
  const oneMinuteAgo = new Date(currentTime.getTime() - 60 * 1000);
  const thirtySecondsAgo = new Date(currentTime.getTime() - 30 * 1000);

  return {
    machineStatus: timestamp > fiveMinutesAgo,
    coolingStatus: timestamp > oneMinuteAgo,
    internetStatus: timestamp > thirtySecondsAgo,
  };
}

// ─── Fetch one table row ────────────────────────────────────────────────────
async function fetchRow(tableName: string): Promise<any> {
  try {
    const rows = await query<any>(
      `SELECT * FROM \`${tableName}\` ORDER BY id DESC LIMIT 1`
    );
    return rows?.[0] ?? null;
  } catch (err: any) {
    console.error(`Error querying ${tableName}:`, err.message);
    return null;
  }
}

// ─── Route handler ──────────────────────────────────────────────────────────
export async function GET() {
  try {
    const currentTime = new Date();
    const entries = Object.entries(MACHINE_TABLES);

    // Fire all queries in parallel
    const results = await Promise.allSettled(
      entries.map(async ([tableKey, machineName]) => {
        const record = await fetchRow(tableKey);
        return { tableKey, machineName, record };
      })
    );

    const machines: any[] = [];

    for (const result of results) {
      if (result.status === "rejected") continue;
      const { tableKey, machineName, record } = result.value;
      if (!record) continue;

      const id = record.id || 0;
      const timestamp = record.created_at || record.created_on || currentTime;
      const timestampDate = new Date(timestamp);
      const isoTime = timestampDate.toISOString();

      // Status determined purely by how recent the timestamp is
      const status = getStatusFromTimestamp(timestampDate, currentTime);

      const isGtpl = machineName.startsWith("GTPL");
      const priority = machineName.startsWith("GTPL_122") ? "high" : "medium";
      const responseType = isGtpl ? "gtpl_machine" : "kabo_machine";

      const entry: any = {
        ...status,
        machineType: machineName,
        priority,
        responseType,
        noNewData: false,
        lastUpdate: isoTime,
        hasNewData: false,
        idChanged: false,
        machineName,
        tableName: tableKey,
        createdAtChanged: false,
      };

      // Check condenser fan status if available
      const rawCondFan =
        record?.COND_FAN_ON ?? record?.cond_fan_on ?? record?.Compressor_on_Q0_4;
      if (rawCondFan !== undefined) {
        entry.condFanOn =
          rawCondFan === 1 ||
          rawCondFan === "tr" ||
          rawCondFan === "true" ||
          rawCondFan === true ||
          rawCondFan === "True";
      }

      machines.push(entry);
    }

    return NextResponse.json({
      success: true,
      message: "Machine status retrieved successfully",
      data: machines,
      timestamp: currentTime.toISOString(),
    });
  } catch (err: any) {
    console.error("Error fetching machine statuses:", err);
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
