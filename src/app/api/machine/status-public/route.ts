// import { NextResponse } from "next/server";
// import { query } from "@/lib/db";
// import {
//   getMachineSpecificResponse,
//   MachineResponse,
// } from "@/lib/machineUtils";



// const MACHINE_TABLES: Record<string, string> = {
//   gtpl_122_s7_1200_01: "GTPL_122_S7_1200",
//   GTPL_118_GT_60T_S7_1200: "KABO_200",
//   GTPL_108_gT_40E_P_S7_200_Germany: "GTPL_108",
//   GTPL_109_gT_40E_P_S7_200_Germany: "GTPL_109",
//   GTPL_110_gT_40E_P_S7_200_Germany: "GTPL_110",
//   GTPL_111_gT_80E_P_S7_200_Germany: "GTPL_111",
//   GTPL_112_gT_80E_P_S7_200_Germany: "GTPL_112",
//   GTPL_113_gT_80E_P_S7_200_Germany: "GTPL_113",
//   GTPL_114_GT_140E_S7_1200: "GTPL_114",
//   GTPL_115_GT_180E_S7_1200: "GTPL_115",
//   GTPL_119_GT_180E_S7_1200: "GTPL_119",
//   GTPL_120_GT_180E_S7_1200: "GTPL_120",
//   GTPL_116_GT_240E_S7_1200: "GTPL_116",
//   GTPL_117_GT_320E_S7_1200: "GTPL_117",
//   GTPL_121_GT1000T: "GTPL_121",
//   GTPL_124_GT_450T_S7_1200: "GTPL_124",
//   GTPL_133_GT_650T_S7_1200: "GTPL_131",
//   GTPL_131_GT_650T_S7_1200: "GTPL_131",
//   GTPL_132_GT300AP: "GTPL_132",
//   GTPL_137_GT_450T_S7_1200: "GTPL_137",
//   GTPL_138_GT_450T_S7_1200: "GTPL_138",
//   GTPL_136_GT_450AP_S7_1200: "GTPL_136",
//   GTPL_134_GT_450T_S7_1200: "GTPL_134",
//   GTPL_135_GT_450T_S7_1200: "GTPL_135",
//   GTPL_145_GT_450T_S7_1200: "GTPL_145",
//   GTPL_061_GT_450T_S7_1200: "GTPL_061",
//   GTPL_139_GT300AP: "GTPL_139",
//   GTPL_144_GT_300AP_S7_1200: "GTPL_144_GT_300AP_S7_1200",
//   GTPL_142_GT_450AP_S7_1200: "GTPL_142",
//   GTPL_123_GT_450AP_S7_1200: "GTPL_123",
//   GTPL_143_GT_450AP_S7_1200: "GTPL_143",
// };

// // In-memory cache for last known state
// const previousState: Record<
//   string,
//   { id: number | null; timestamp: string | null }
// > = {};

// Object.keys(MACHINE_TABLES).forEach((table) => {
//   previousState[table] = { id: null, timestamp: null };
// });

// // Simple in-memory cache with TTL
// const cache: Record<string, { data: any; timestamp: number }> = {};
// const CACHE_TTL = 10000; // 10 seconds - increased for better cache hit rate

// async function queryWithCache(tableName: string) {
//   const now = Date.now();
//   const cached = cache[tableName];

//   if (cached && now - cached.timestamp < CACHE_TTL) {
//     // console.log(`✅ Cache hit for ${tableName}`);
//     return cached.data;
//   }

//   try {
//     // console.log(`🔍 Querying table: ${tableName}`);
//     const rows = await query<any>(
//       `SELECT * FROM \`${tableName}\` ORDER BY id DESC LIMIT 1`
//     );
    
//     // console.log(`📊 Query result for ${tableName}: ${rows?.length || 0} rows`);
//     // console.log(rows?.[0])
//     const data = rows?.[0] ?? null;

//     if (!data) {
//       console.warn(`⚠️ No data found in table ${tableName}`);
//     }

//     cache[tableName] = { data, timestamp: now };
//     return data;
//   } catch (error: any) {
//     console.error(`❌ Error querying ${tableName}:`, error.message);
//     cache[tableName] = { data: null, timestamp: now };
//     return null;
//   }
// }

// // Process queries sequentially with small batches to avoid connection exhaustion
// async function processMachinesInBatches(
//   entries: [string, string][],
//   batchSize: number = 5
// ) {
//   const results = [];

//   for (let i = 0; i < entries.length; i += batchSize) {
//     const batch = entries.slice(i, i + batchSize);
//     // console.log(`Processing batch ${Math.floor(i / batchSize) + 1} (${batch.length} machines)...`);
    
//     const batchResults = await Promise.all(
//       batch.map(async ([tableName, machineName]) => {
//         try {
//           const record = await queryWithCache(tableName);
//           return { tableName, machineName, record };
//         } catch (error) {
//           console.error(`❌ Error fetching ${tableName}:`, error);
//           return { tableName, machineName, record: null };
//         }
//       })
//     );
//     results.push(...batchResults);
    
//     // Small delay between batches to avoid connection spikes
//     if (i + batchSize < entries.length) {
//       await new Promise(r => setTimeout(r, 100));
//     }
//   }

//   return results;
// }

// export async function GET() {
//   const currentTime = new Date();

//   try {
//     const entries = Object.entries(MACHINE_TABLES);
//     // console.log(`📊 Fetching status for ${entries.length} machines...`);
//     // console.log(`📋 Tables to query:`, entries.map(([table]) => table));

//     // Process in batches of 5 to avoid connection exhaustion
//     const results = await processMachinesInBatches(entries, 5);

//     const machines: MachineResponse[] = [];
//     let recordsFound = 0;
//     let recordsNull = 0;

//     for (const { tableName, machineName, record } of results) {
//       if (!record) {
//         recordsNull++;
//         // console.log(`⏭️  Skipping ${tableName} (${machineName}) - no data`);
//         continue;
//       }

//       recordsFound++;
//       const id = record.id || 0;
//       const timestamp = record.created_at || record.created_on || currentTime;
//       const isoTime = new Date(timestamp).toISOString();

//       const prev = previousState[tableName];
//       const normalizedTimestamp = new Date(timestamp).getTime();
//       const normalizedPrevTimestamp = prev.timestamp
//         ? new Date(prev.timestamp).getTime()
//         : null;

//       const idChanged = prev.id !== null ? id > prev.id : false;
//       const timeChanged =
//         normalizedPrevTimestamp !== null
//           ? normalizedTimestamp !== normalizedPrevTimestamp
//           : false;

//       const hasNewData = idChanged && timeChanged;

//       previousState[tableName] = { id, timestamp };

//       const baseResponse: MachineResponse = {
//         ...getMachineSpecificResponse(
//           machineName,
//           timestamp,
//           currentTime,
//           hasNewData
//         ),
//         recordId: id,
//         lastUpdate: isoTime,
//         hasNewData,
//         idChanged,
//         machineName,
//         createdAtChanged: timeChanged,
//         createdOnChanged: timeChanged,
//       };

//       const rawCondFan =
//         record?.COND_FAN_ON ||
//         record?.cond_fan_on ||
//         record?.Compressor_on_Q0_4;
//       if (rawCondFan !== undefined) {
//         const condFanOn =
//           rawCondFan === 1 ||
//           rawCondFan === "tr" ||
//           rawCondFan === "true" ||
//           rawCondFan === true ||
//           rawCondFan === "True";
//         baseResponse.condFanOn = condFanOn;
//       }

//       machines.push(baseResponse);
//     }

//     // console.log(`✅ Successfully fetched ${recordsFound} machine statuses (${recordsNull} tables with no data)`);

//     return NextResponse.json({
//       success: true,
//       message: "Machine statuses retrieved successfully",
//       data: machines,
//       timestamp: currentTime.toISOString(),
//       summary: {
//         totalTables: entries.length,
//         tablesWithData: recordsFound,
//         tablesWithoutData: recordsNull,
//       },
//     });
//   } catch (err: any) {
//     console.error("❌ Error fetching machine statuses:", err);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Error fetching machine statuses",
//         error:
//           process.env.NODE_ENV === "development"
//             ? err.message
//             : "Internal server error",
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getMachineSpecificResponse, MachineResponse } from "@/lib/machineUtils";

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
  GTPL_119_GT_180E_S7_1200: "GTPL_119",
  GTPL_120_GT_180E_S7_1200: "GTPL_120",
  GTPL_116_GT_240E_S7_1200: "GTPL_116",
  GTPL_117_GT_320E_S7_1200: "GTPL_117",
  GTPL_121_GT1000T: "GTPL_121",
  GTPL_124_GT_450T_S7_1200: "GTPL_124",
  GTPL_133_GT_650T_S7_1200: "GTPL_131",
  GTPL_131_GT_650T_S7_1200: "GTPL_131",
  GTPL_132_GT300AP: "GTPL_132",
  GTPL_137_GT_450T_S7_1200: "GTPL_137",
  GTPL_138_GT_450T_S7_1200: "GTPL_138",
  GTPL_136_GT_450AP_S7_1200: "GTPL_136",
  GTPL_134_GT_450T_S7_1200: "GTPL_134",
  GTPL_135_GT_450T_S7_1200: "GTPL_135",
  GTPL_145_GT_450T_S7_1200: "GTPL_145",
  GTPL_061_GT_450T_S7_1200: "GTPL_061",
  GTPL_139_GT300AP: "GTPL_139",
  GTPL_144_GT_300AP_S7_1200: "GTPL_144_GT_300AP_S7_1200",
  GTPL_142_GT_450AP_S7_1200: "GTPL_142",
  GTPL_123_GT_450AP_S7_1200: "GTPL_123",
  GTPL_143_GT_450AP_S7_1200: "GTPL_143",
};

// ─── Per-table state tracking ────────────────────────────────────────────────
const previousState: Record<string, { id: number | null; timestamp: string | null }> = {};
Object.keys(MACHINE_TABLES).forEach((key) => {
  previousState[key] = { id: null, timestamp: null };
});

// ─── Per-table row cache (60 s TTL) ──────────────────────────────────────────
const rowCache: Record<string, { data: any; ts: number }> = {};
const ROW_CACHE_TTL = 60_000; // 60 seconds

// ─── Global response cache (stale-while-revalidate) ──────────────────────────
let globalCache: { response: any; ts: number } | null = null;
const GLOBAL_CACHE_TTL = 15_000; // serve stale up to 15 s while refreshing
let refreshing = false;

// ─── Fetch one table row, using row-level cache ───────────────────────────────
async function fetchRow(tableName: string): Promise<any> {
  const now = Date.now();
  const hit = rowCache[tableName];
  if (hit && now - hit.ts < ROW_CACHE_TTL) return hit.data;

  try {
    const rows = await query<any>(
      `SELECT * FROM \`${tableName}\` ORDER BY id DESC LIMIT 1`
    );
    const data = rows?.[0] ?? null;
    rowCache[tableName] = { data, ts: now };
    return data;
  } catch (err: any) {
    console.error(`❌ Error querying ${tableName}:`, err.message);
    rowCache[tableName] = { data: null, ts: now }; // cache the miss too
    return null;
  }
}

// ─── Build the full machines payload ─────────────────────────────────────────
async function buildPayload() {
  const currentTime = new Date();
  const entries = Object.entries(MACHINE_TABLES);

  // 🔥 All queries fire in parallel — no batching, no artificial delays
  const results = await Promise.allSettled(
    entries.map(async ([tableKey, machineName]) => {
      const record = await fetchRow(tableKey);
      return { tableKey, machineName, record };
    })
  );

  const machines: MachineResponse[] = [];
  let recordsFound = 0;
  let recordsNull = 0;

  for (const result of results) {
    if (result.status === "rejected") { recordsNull++; continue; }
    const { tableKey, machineName, record } = result.value;

    if (!record) { recordsNull++; continue; }
    recordsFound++;

    const id = record.id || 0;
    const timestamp = record.created_at || record.created_on || currentTime;
    const isoTime = new Date(timestamp).toISOString();

    const prev = previousState[tableKey];
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

    previousState[tableKey] = { id, timestamp };

    const baseResponse: MachineResponse = {
      ...getMachineSpecificResponse(machineName, timestamp, currentTime, hasNewData),
      recordId: id,
      lastUpdate: isoTime,
      hasNewData,
      idChanged,
      machineName,
      createdAtChanged: timeChanged,
      createdOnChanged: timeChanged,
    };

    const rawCondFan =
      record?.COND_FAN_ON ?? record?.cond_fan_on ?? record?.Compressor_on_Q0_4;
    if (rawCondFan !== undefined) {
      baseResponse.condFanOn =
        rawCondFan === 1 ||
        rawCondFan === "tr" ||
        rawCondFan === "true" ||
        rawCondFan === true ||
        rawCondFan === "True";
    }

    machines.push(baseResponse);
  }

  return {
    success: true,
    message: "Machine statuses retrieved successfully",
    data: machines,
    timestamp: currentTime.toISOString(),
    summary: {
      totalTables: entries.length,
      tablesWithData: recordsFound,
      tablesWithoutData: recordsNull,
    },
  };
}

// ─── Stale-while-revalidate helper ───────────────────────────────────────────
async function getPayload() {
  const now = Date.now();

  // Cache is fresh — return immediately
  if (globalCache && now - globalCache.ts < GLOBAL_CACHE_TTL) {
    return globalCache.response;
  }

  // Cache is stale but exists — return stale AND kick off background refresh
  if (globalCache && !refreshing) {
    refreshing = true;
    buildPayload()
      .then((payload) => {
        globalCache = { response: payload, ts: Date.now() };
      })
      .catch(console.error)
      .finally(() => { refreshing = false; });

    return globalCache.response; // serve stale instantly
  }

  // No cache yet (cold start) — must wait
  const payload = await buildPayload();
  globalCache = { response: payload, ts: Date.now() };
  return payload;
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const payload = await getPayload();
    return NextResponse.json(payload);
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