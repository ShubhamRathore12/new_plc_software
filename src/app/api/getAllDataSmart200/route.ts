// app/api/export/route.ts
import { pool } from "@/lib/db";
import * as XLSX from "xlsx";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";
export const revalidate = 0;
// Maximum timeout for Vercel hobby plan (60 seconds max)
export const maxDuration = 60; // 60 seconds for hobby plan

const ALLOWED_TABLES = [
  "GTPL_108_gT_40E_P_S7_200_Germany",
  "GTPL_109_gT_40E_P_S7_200_Germany",
  "GTPL_110_gT_40E_P_S7_200_Germany",
  "GTPL_111_gT_80E_P_S7_200_Germany",
  "GTPL_112_gT_80E_P_S7_200_Germany",
  "GTPL_113_gT_80E_P_S7_200_Germany",
  "kabomachinedatasmart200",
  "GTPL_114_GT_140E_S7_1200",
  "GTPL_115_GT_180E_S7_1200",
  "GTPL_119_GT_180E_S7_1200",
  "GTPL_120_GT_180E_S7_1200",
  "GTPL_116_GT_240E_S7_1200",
  "GTPL_117_GT_320E_S7_1200",
  "GTPL_121_GT1000T",
  "gtpl_122_s7_1200_01",
  "GTPL_124_GT_450T_S7_1200",
  'GTPL_131_GT_650T_S7_1200',
  "GTPL_132_GT_650T_S7_1200"
] as const;

const PREFERRED_NUMERIC_ORDER = [
  "T2_1_ambient_temp","T2_2_ambient_temp","T2_temp_mean",
  "T1_1_cold_air_temp","T1_2_cold_air_temp","T1_temp_mean",
  "T0_1_air_outlet_temp","T0_2_air_outlet_temp","T0_temp_mean",
  "TH_1_supply_air_temp","TH_2_supply_air_temp","TH_temp_mean",
  "LP_value","HP_value","LP_set_point","HP_set_point",
  "T1_set_point","TH_T1_set_point","Compressor_timer","Delta_set_to_aeration","Aeration_duration_set",
  "Running_time_hour","Running_time_minute","Running_hours","Running_hours_min",
  "Blower_speed","Hot_valve_speed","AHT_vale_speed","AHT_valve_speed","Heater_speed","Cond_fan_speed",
  "Blower_speed_set_in_manual","Cond_fan_speed_set_in_manual","Hot_gas_valve_set_in_manual","AHT_valve_set_in_manual","Heater_set_in_manual",
  "Fault_code","FS","UF","RHP","BLWR_pct","RMR_pct","CNPR_pct","AHT_pct","HCSR_pct",
];

const PRETTY_HEADER_MAP: Record<string, string> = {
  id: "Record#",
  created_at: "Date & Time (IST)",
 
  T2_1_ambient_temp: "T2-1 Ambient Temp (°C)",
  T2_2_ambient_temp: "T2-2 Ambient Temp (°C)",
  T1_1_cold_air_temp: "T1-1 Cold Air Temp (°C)",
  T1_2_cold_air_temp: "T1-2 Cold Air Temp (°C)",
  T0_1_air_outlet_temp: "T0-1 Air Outlet Temp (°C)",
  T0_2_air_outlet_temp: "T0-2 Air Outlet Temp (°C)",
  TH_1_supply_air_temp: "TH-1 Supply Air Temp (°C)",
  TH_2_supply_air_temp: "TH-2 Supply Air Temp (°C)",
  T2_temp_mean: "T2 Mean Temp (°C)",
  T1_temp_mean: "T1 Mean Temp (°C)",
  T0_temp_mean: "T0 Mean Temp (°C)",
  TH_temp_mean: "TH Mean Temp (°C)",
  LP_value: "LP Value",
  HP_value: "HP Value",
  T1_set_point: "T1 Set Point",
  TH_T1_set_point: "TH-T1 Set Point",
  Compressor_timer: "Compressor Timer (s)",
  Delta_set_to_aeration: "Delta to Aeration",
  Aeration_duration_set: "Aeration Duration Set",
  Running_time_hour: "Running Hours",
  Running_time_minute: "Running Minutes",
  HP_set_point: "HP Set Point",
  LP_set_point: "LP Set Point",
  Blower_speed: "Blower Speed (%)",
  Hot_valve_speed: "Hot Valve Speed (%)",
  AHT_vale_speed: "AHT Valve Speed (%)",
  AHT_valve_speed: "AHT Valve Speed (%)",
  Heater_speed: "Heater Speed (%)",
  
  Fault_code: "Fault Code",
  Faults: "Faults",
};

const FAULT_PATTERNS = [
  "fault","overheat","door_open","short_circuit","warning","top","protection","not_achieved",
];

// Optimized chunk size for 60-second limit
const CHUNK_SIZE = 50000; // Process 50k rows at a time for maximum speed
const PROCESSING_TIMEOUT_MS = 45 * 1000; // 45 seconds timeout for processing (15s buffer)

function isTrueish(v: any) {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true" || v === "1";
  if (typeof v === "number") return v === 1;
  return false;
}

function looksLikeFaultKey(k: string) {
  const low = k.toLowerCase();
  return FAULT_PATTERNS.some((p) => low.includes(p));
}

function toNum(v: any) {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : "";
}

function formatInIST(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, p) => {
      if (p.type !== "literal") acc[p.type] = p.value;
      return acc;
    }, {});
  return `${parts.year}-${parts.month}-${parts.day} ${parts.hour}:${parts.minute}:${parts.second}`;
}

function normalizeCreatedAt(raw: any): { full: string; date: string; time: string } {
  if (raw instanceof Date) {
    const s = formatInIST(raw);
    const [d, t] = s.split(" ");
    return { full: s, date: d, time: t ?? "" };
  }
  if (typeof raw === "string" && raw) {
    const s = raw.replace("T", " ").slice(0, 19);
    const [d, t] = s.split(" ");
    return { full: s, date: d ?? "", time: t ?? "" };
  }
  return { full: "", date: "", time: "" };
}

// Optimized data processing with timeout handling
async function processDataInChunks(
  table: string,
  whereSql: string,
  params: any[],
  order: string,
  effectiveLimit: number,
  all: boolean
): Promise<any[]> {
  const startTime = Date.now();
  const allProcessedRows: any[] = [];
  let offset = 0;
  let processedCount = 0;

  console.log(`🚀 Starting chunked processing: ${effectiveLimit} records, chunk size: ${CHUNK_SIZE}`);

  try {
    while (offset < effectiveLimit) {
      // Check timeout
      if (Date.now() - startTime > PROCESSING_TIMEOUT_MS) {
        console.warn(`⏰ Processing timeout reached at ${processedCount} records`);
        break;
      }

      const currentChunkSize = Math.min(CHUNK_SIZE, effectiveLimit - offset);
      const chunkStartTime = Date.now();
      
      console.log(`📦 Processing chunk: ${offset + 1} to ${offset + currentChunkSize}`);

      const [chunkRows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM \`${table}\`${whereSql} ORDER BY id ${order} LIMIT ? OFFSET ?`,
        [...params, currentChunkSize, offset]
      );

      if (!Array.isArray(chunkRows) || chunkRows.length === 0) {
        console.log(`✅ No more data at offset ${offset}`);
        break;
      }

      // Fast normalization without deep processing
      const normalizedChunk = (chunkRows as any[]).map((r) => {
        const obj: Record<string, any> = {};
        for (const [k, v] of Object.entries(r)) {
          obj[k] = v ?? "";
        }
        return obj;
      });

      // Process chunk based on format (optimized)
      if (all) {
        const prettyChunk = normalizedChunk.map((r) => {
          const { full } = normalizeCreatedAt(r.created_at);
          const base: Record<string, any> = { created_at: full };

          // Fast numeric processing - only include existing keys
          const numericKeys = Object.keys(r).filter((k) => {
            if (k === "id" || k === "created_at") return false;
            const val = r[k];
            return val !== null && val !== undefined && val !== "" && !isNaN(Number(val));
          });

          // Apply preferred order only to existing keys
          const orderedKeys = [
            ...PREFERRED_NUMERIC_ORDER.filter((k) => numericKeys.includes(k)),
            ...numericKeys.filter((k) => !PREFERRED_NUMERIC_ORDER.includes(k)),
          ];

          orderedKeys.forEach((k) => {
            base[k] = toNum(r[k]);
          });

          // Fast fault processing
          const faults: string[] = [];
          for (const [k, v] of Object.entries(r)) {
            if (looksLikeFaultKey(k) && isTrueish(v)) {
              faults.push(k.replace(/_/g, " "));
            }
          }
          base["Faults"] = faults.join(", ");
          return base;
        });
        allProcessedRows.push(...prettyChunk);
      } else {
        const rawChunk = normalizedChunk.map((r) => {
          const { full } = normalizeCreatedAt(r.created_at);
          return { ...r, created_at: full };
        });
        allProcessedRows.push(...rawChunk);
      }

      offset += currentChunkSize;
      processedCount += chunkRows.length;

      const chunkTime = Date.now() - chunkStartTime;
      const avgTimePerRecord = chunkTime / chunkRows.length;
      const estimatedRemainingTime = ((effectiveLimit - processedCount) * avgTimePerRecord) / 1000;

      // Progress logging every 25k records for 60s window
      if (processedCount % 25000 === 0 || chunkRows.length < currentChunkSize) {
        console.log(`📊 Progress: ${processedCount}/${effectiveLimit} records (${Math.round((processedCount/effectiveLimit)*100)}%) - ETA: ${Math.round(estimatedRemainingTime)}s`);
      }

      // Force garbage collection hint for memory optimization
      if (processedCount % 50000 === 0 && global.gc) {
        global.gc();
      }
    }

    console.log(`✅ Processing complete: ${processedCount} records processed in ${(Date.now() - startTime) / 1000}s`);
    return allProcessedRows;

  } catch (error) {
    console.error(`❌ Error during chunk processing at offset ${offset}:`, error);
    throw error;
  }
}

export async function GET(req: Request) {
  const requestStartTime = Date.now();
  
  try {
    console.log(`🌟 Export API called at ${new Date().toISOString()}`);
    
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const all = searchParams.get("all") !== "false";
    
    // Aggressive limits for 60-second processing
    const MIN_LIMIT = 25000;   // 25k minimum (optimized for 60s)
    const MAX_LIMIT = 100000;  // 1 lakh maximum (ensures completion in 60s)
    const FALLBACK_LIMIT = MIN_LIMIT;

    const userLimitStr = (searchParams.get("limit") || "").toLowerCase();
    const hasDateFilter = !!(fromDate || toDate);
    const order = (searchParams.get("order") || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";

    console.log(`📋 Request params: table=${table}, fromDate=${fromDate}, toDate=${toDate}, hasDateFilter=${hasDateFilter}`);

    if (!table || !ALLOWED_TABLES.includes(table as any)) {
      return Response.json({ error: "Invalid or missing table name" }, { status: 400 });
    }

    // Build WHERE clause for date filtering
    const params: any[] = [];
    const where: string[] = [];
    
    if (fromDate) {
      where.push(`created_at >= ?`);
      params.push(`${fromDate} 00:00:00`);
      console.log(`📅 From date filter: ${fromDate} 00:00:00`);
    }
    
    if (toDate) {
      where.push(`created_at <= ?`);
      params.push(`${toDate} 23:59:59`);
      console.log(`📅 To date filter: ${toDate} 23:59:59`);
    }

    const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";
    console.log(`🔍 Final WHERE clause: ${whereSql}`);

    // Get total count with timeout
    console.log("🔢 Getting total count...");
    const countStartTime = Date.now();
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM \`${table}\`${whereSql}`,
      params
    );
    
    const totalCount = (countRows[0] as { cnt: number }).cnt;
    console.log(`📊 Count query completed in ${Date.now() - countStartTime}ms: ${totalCount} total records`);

    // Determine effective limit
    let effectiveLimit: number;
    if (hasDateFilter && totalCount > 0 && totalCount <= MAX_LIMIT) {
      effectiveLimit = totalCount;
      console.log(`🎯 Using all ${totalCount} records within date range`);
    } else if (userLimitStr === "auto") {
      effectiveLimit = Math.min(Math.max(totalCount, MIN_LIMIT), MAX_LIMIT);
    } else if (userLimitStr) {
      const parsed = Number(userLimitStr);
      effectiveLimit = Number.isFinite(parsed) && parsed > 0
        ? Math.min(Math.max(parsed, MIN_LIMIT), MAX_LIMIT)
        : MIN_LIMIT;
    } else {
      effectiveLimit = Math.min(Math.max(totalCount, MIN_LIMIT), MAX_LIMIT);
    }

    console.log(`⚡ Processing ${effectiveLimit} records (optimized for 60s limit)...`);

    // Process data in chunks with timeout handling
    let processedRows = await processDataInChunks(
      table,
      whereSql,
      params,
      order,
      effectiveLimit,
      all
    );

    // Fallback handling
    let usedFallback = false;
    if (processedRows.length === 0 && !hasDateFilter) {
      console.log("🔄 No data found, using fallback...");
      processedRows = await processDataInChunks(table, "", [], "DESC", FALLBACK_LIMIT, all);
      usedFallback = true;
    }

    console.log(`📝 Creating Excel workbook with ${processedRows.length} rows...`);
    const excelStartTime = Date.now();

    // Create Excel workbook with streaming approach
    const wb = XLSX.utils.book_new();
    let ws: XLSX.WorkSheet;

    const finalizeSheet = (ws: XLSX.WorkSheet, headerKeys: string[], addNote?: string) => {
      const captions = headerKeys.map((k) => PRETTY_HEADER_MAP[k] ?? k);
      XLSX.utils.sheet_add_aoa(ws, [captions], { origin: "A1" });
      if (addNote) XLSX.utils.sheet_add_aoa(ws, [[addNote]], { origin: "A2" });

      // Optimized column width calculation
      ws["!cols"] = captions.map((h) => ({ wch: Math.min(Math.max(12, h.length + 2), 30) }));
      
      if (ws["!ref"]) {
        const rng = XLSX.utils.decode_range(ws["!ref"]);
        
        // Simplified number formatting for performance
        headerKeys.forEach((k, ci) => {
          const isTempOrFloat = /temp|value|uf|rhp/i.test(k);
          const z = isTempOrFloat ? "0.00" : "0";
          
          // Apply formatting to a sample of cells to save time
          const maxFormatRows = Math.min(rng.e.r, 1000);
          for (let r = rng.s.r + 1; r <= maxFormatRows; r++) {
            const addr = XLSX.utils.encode_cell({ r, c: ci });
            const cell = ws[addr];
            if (cell && typeof cell.v === "number") cell.z = z;
          }
        });

        const headRows = addNote ? 2 : 1;
        ws["!autofilter"] = { ref: XLSX.utils.encode_range({ r: 0, c: 0 }, { r: rng.e.r, c: rng.e.c }) };
        (ws as any)["!freeze"] = {
          xSplit: 0,
          ySplit: headRows,
          topLeftCell: headRows === 2 ? "A3" : "A2",
          state: "frozen",
        };
      }
    };

    // Generate notes
    const notes = [];
    if (usedFallback) {
      notes.push(`No data found with filters. Showing latest ${FALLBACK_LIMIT} records.`);
    }
    if (hasDateFilter && processedRows.length === 0) {
      notes.push(`No records found for date range: ${fromDate || 'start'} to ${toDate || 'end'}.`);
    }
    if (totalCount > effectiveLimit) {
      notes.push(`${totalCount} total records found. Export limited to ${effectiveLimit} records (Vercel 60s limit).`);
    }
    if (hasDateFilter && processedRows.length > 0) {
      notes.push(`Date filter applied: ${processedRows.length} records from ${fromDate || 'start'} to ${toDate || 'end'}.`);
    }

    const combinedNote = notes.join(" ");

    // Create worksheet
    if (all && processedRows.length > 0) {
      const fixed = ["id", "created_at"];
      const dynamic = Array.from(
        new Set(processedRows.flatMap((row) => 
          Object.keys(row).filter((k) => !fixed.includes(k) && k !== "Faults")
        ))
      );
      const headerKeys = [...fixed, ...dynamic, "Faults"];

      ws = XLSX.utils.json_to_sheet(processedRows, { header: headerKeys });
      finalizeSheet(ws, headerKeys, combinedNote || undefined);
    } else if (processedRows.length > 0) {
      ws = XLSX.utils.json_to_sheet(processedRows);
      const headerKeys = Object.keys(processedRows[0]);
      finalizeSheet(ws, headerKeys, combinedNote || undefined);
    } else {
      const headerKeys = ["id", "created_at"];
      ws = XLSX.utils.json_to_sheet([Object.fromEntries(headerKeys.map((k) => [k, ""]))], { header: headerKeys });
      const emptyNote = hasDateFilter 
        ? `No records found for date range: ${fromDate || 'start'} to ${toDate || 'end'}`
        : "No records found";
      finalizeSheet(ws, headerKeys, emptyNote);
    }

    XLSX.utils.book_append_sheet(wb, ws, "Data");

    console.log(`📊 Excel creation completed in ${Date.now() - excelStartTime}ms`);
    console.log("💾 Writing Excel buffer...");
    
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer", compression: true });
    
    const recordCount = processedRows.length;
    const dateRangeStr = hasDateFilter 
      ? `_${fromDate || 'start'}_to_${toDate || 'end'}`
      : `_${new Date().toISOString().slice(0, 10)}`;
    const filename = `${table}${dateRangeStr}_${recordCount}records.xlsx`;

    const totalTime = (Date.now() - requestStartTime) / 1000;
    console.log(`🎉 Export completed successfully: ${filename} in ${totalTime}s`);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Content-Disposition",
        "Cache-Control": "no-store, max-age=0",
        "X-Export-Time": totalTime.toString(),
        "X-Record-Count": recordCount.toString(),
      },
    });

  } catch (err: any) {
    const errorTime = (Date.now() - requestStartTime) / 1000;
    console.error(`❌ Export failed after ${errorTime}s:`, err);
    
    return Response.json(
      { 
        error: err.message || "Export failed",
        duration: errorTime,
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}