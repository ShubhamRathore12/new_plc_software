// app/api/export/route.ts
import { pool } from "@/lib/db";
import * as XLSX from "xlsx";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";
export const revalidate = 0;
// Increased timeout for large exports (60s max on Vercel Pro)
export const maxDuration = 900; // 15 minutes for unlimited exports

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
  created_at_date: "Date",
  created_at_time: "Time",
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
  Cond_fan_speed: "Cond Fan Speed (%)",
  Blower_speed_set_in_manual: "Blower Speed (Manual)",
  Cond_fan_speed_set_in_manual: "Cond Fan Speed (Manual)",
  Hot_gas_valve_set_in_manual: "Hot Gas Valve (Manual)",
  AHT_valve_set_in_manual: "AHT Valve (Manual)",
  Heater_set_in_manual: "Heater (Manual)",
  Running_hours: "Total Running Hours",
  Running_hours_min: "Total Running Minutes",
  Fault_code: "Fault Code",
  UF: "UF*",
  RHP: "RHP",
  BLWR_pct: "BLWR%",
  RMR_pct: "RMR%",
  CNPR_pct: "CNPR%",
  AHT_pct: "AHT%",
  HCSR_pct: "HCSR%",
  FS: "FS",
  Faults: "Faults",
};

const FAULT_PATTERNS = [
  "fault","overheat","door_open","short_circuit","warning","top","protection","not_achieved",
];

// Optimized chunked processing for large datasets
const CHUNK_SIZE = 10000; // Process 10k rows at a time to manage memory

// No limits - allow any date range and unlimited records
const MAX_DATE_RANGE_DAYS = 365; // Allow up to 1 year
const MAX_RECORDS_LIMIT = Number.MAX_SAFE_INTEGER; // No record limit

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

// Function to calculate date difference in days
function getDateDifference(fromDate: string, toDate: string): number {
  const from = new Date(fromDate);
  const to = new Date(toDate);
  const timeDiff = to.getTime() - from.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Function to validate date range - no restrictions, just use what user provides
function validateAndAdjustDateRange(fromDate: string | null, toDate: string | null): {
  adjustedFromDate: string;
  adjustedToDate: string;
  isAdjusted: boolean;
  warningMessage?: string;
} {
  let adjustedFromDate: string;
  let adjustedToDate: string;
  let isAdjusted = false;
  let warningMessage: string | undefined;

  // If no dates provided, get ALL data (no date restriction)
  if (!fromDate && !toDate) {
    // Set very wide range to get all data
    adjustedFromDate = "2020-01-01"; // Start from 2020
    const today = new Date();
    adjustedToDate = today.toISOString().split('T')[0];
    isAdjusted = true;
    warningMessage = `No date range specified. Exporting ALL available data.`;
  }
  // If only fromDate provided, set toDate to today
  else if (fromDate && !toDate) {
    adjustedFromDate = fromDate;
    const today = new Date();
    adjustedToDate = today.toISOString().split('T')[0];
    isAdjusted = true;
    warningMessage = `Only start date provided. End date set to today.`;
  }
  // If only toDate provided, set fromDate to very early date
  else if (!fromDate && toDate) {
    adjustedToDate = toDate;
    adjustedFromDate = "2020-01-01";
    isAdjusted = true;
    warningMessage = `Only end date provided. Start date set to 2020-01-01.`;
  }
  // Both dates provided - use as is, no restrictions
  else {
    adjustedFromDate = fromDate!;
    adjustedToDate = toDate!;
    // No date range limits - accept any range
  }

  return {
    adjustedFromDate,
    adjustedToDate,
    isAdjusted,
    warningMessage
  };
}

// Process data in chunks to handle large datasets efficiently
async function processDataInChunks(
  table: string,
  whereSql: string,
  params: any[],
  order: string,
  effectiveLimit: number,
  all: boolean
): Promise<any[]> {
  const allProcessedRows: any[] = [];
  let offset = 0;

  console.log(`Starting chunked processing: ${effectiveLimit} total records, ${CHUNK_SIZE} per chunk`);

  while (offset < effectiveLimit) {
    const currentChunkSize = Math.min(CHUNK_SIZE, effectiveLimit - offset);
    
    console.log(`Processing chunk: ${offset + 1} to ${offset + currentChunkSize}`);
    
    const [chunkRows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM \`${table}\`${whereSql} ORDER BY created_at ${order} LIMIT ? OFFSET ?`,
      [...params, currentChunkSize, offset]
    );

    if (!Array.isArray(chunkRows) || chunkRows.length === 0) {
      console.log(`No more data found at offset ${offset}`);
      break;
    }

    console.log(`Retrieved ${chunkRows.length} rows in current chunk`);

    // Normalize current chunk
    const normalizedChunk = (chunkRows as any[]).map((r) => {
      const obj: Record<string, any> = {};
      for (const [k, v] of Object.entries(r)) {
        obj[k] = v ?? "";
      }
      return obj;
    });

    // Process chunk based on format (pretty vs raw)
    if (all) {
      const prettyChunk = normalizedChunk.map((r) => {
        const { full, date, time } = normalizeCreatedAt(r.created_at);
        const base: Record<string, any> = {
          id: r.id ?? "",
          created_at: full,
          created_at_date: date,
          created_at_time: time,
        };

        const numericKeysInRow = Object.keys(r).filter((k) => {
          if (k === "id" || k === "created_at") return false;
          return toNum(r[k]) !== "";
        });

        const ordered = [
          ...PREFERRED_NUMERIC_ORDER.filter((k) => numericKeysInRow.includes(k)),
          ...numericKeysInRow.filter((k) => !PREFERRED_NUMERIC_ORDER.includes(k)),
        ];

        ordered.forEach((k) => {
          if (k in r) base[k] = toNum(r[k]);
        });

        const faults: string[] = [];
        for (const [k, v] of Object.entries(r)) {
          if (!looksLikeFaultKey(k)) continue;
          if (isTrueish(v)) faults.push(k.replace(/_/g, " "));
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

    // Progress logging for large exports
    if (offset % (CHUNK_SIZE * 2) === 0 || offset >= effectiveLimit) {
      console.log(`Progress: ${offset} / ${effectiveLimit} records processed (${((offset/effectiveLimit)*100).toFixed(1)}%)`);
    }
  }

  console.log(`Chunked processing complete: ${allProcessedRows.length} total rows processed`);
  return allProcessedRows;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const fromDateParam = searchParams.get("fromDate");
    const toDateParam = searchParams.get("toDate");

    const all = searchParams.get("all") !== "false";
    const order = (searchParams.get("order") || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";

    if (!table || !ALLOWED_TABLES.includes(table as any)) {
      return Response.json({ error: "Invalid or missing table name" }, { status: 400 });
    }

    // Validate and adjust date range
    const { adjustedFromDate, adjustedToDate, isAdjusted, warningMessage } = 
      validateAndAdjustDateRange(fromDateParam, toDateParam);

    console.log(`Date range: ${adjustedFromDate} to ${adjustedToDate}`);
    if (isAdjusted && warningMessage) {
      console.log(`Date adjustment: ${warningMessage}`);
    }

    // Build WHERE clause with adjusted dates (inclusive of both start and end dates)
    const params: any[] = [];
    const where: string[] = [];
    
    where.push(`created_at >= CONCAT(?, ' 00:00:00')`);
    params.push(adjustedFromDate);
    
    where.push(`created_at <= CONCAT(?, ' 23:59:59')`);
    params.push(adjustedToDate);
    
    let whereSql = ` WHERE ${where.join(" AND ")}`;

    // Debug: Check what data exists in the table
    console.log("Checking date range in table...");
    const [dateRangeRows] = await pool.query<RowDataPacket[]>(
      `SELECT 
        MIN(created_at) as earliest_date, 
        MAX(created_at) as latest_date,
        COUNT(*) as total_records
       FROM \`${table}\``
    );
    const dateRange = dateRangeRows[0] as { earliest_date: Date; latest_date: Date; total_records: number };
    console.log(`Table ${table} contains:`);
    console.log(`- Earliest record: ${dateRange.earliest_date}`);
    console.log(`- Latest record: ${dateRange.latest_date}`);
    console.log(`- Total records: ${dateRange.total_records}`);
    console.log(`- Requested range: ${adjustedFromDate} to ${adjustedToDate}`);

    // Get total count for the date range
    console.log("Getting count for date range...");
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM \`${table}\`${whereSql}`,
      params
    );
    const totalCount = (countRows[0] as { cnt: number }).cnt;
    console.log(`Total matching records in ${MAX_DATE_RANGE_DAYS}-day range: ${totalCount}`);

    // For unlimited exports, use ALL available data in the date range
    let effectiveLimit = totalCount; // No artificial limits

    console.log(`Processing ALL ${effectiveLimit} records in date range (unlimited export)...`);

    // Process data in chunks
    let processedRows = await processDataInChunks(
      table,
      whereSql,
      params,
      order,
      effectiveLimit,
      all
    );

    console.log(`Creating Excel with ${processedRows.length} rows...`);

    // Create Excel workbook
    const wb = XLSX.utils.book_new();
    let ws: XLSX.WorkSheet;

    const finalizeSheet = (ws: XLSX.WorkSheet, headerKeys: string[], addNote?: string) => {
      const captions = headerKeys.map((k) => PRETTY_HEADER_MAP[k] ?? k);
      XLSX.utils.sheet_add_aoa(ws, [captions], { origin: "A1" });
      if (addNote) XLSX.utils.sheet_add_aoa(ws, [[addNote]], { origin: "A2" });

      ws["!cols"] = captions.map((h) => ({ wch: Math.min(Math.max(12, h.length + 2), 36) }));
      
      if (ws["!ref"]) {
        const rng = XLSX.utils.decode_range(ws["!ref"]);
        
        // Apply number formatting
        headerKeys.forEach((k, ci) => {
          const isTempOrFloat =
            /temp|value|uf|rhp/i.test(k) ||
            ["T2_temp_mean", "T1_temp_mean", "T0_temp_mean", "TH_temp_mean"].includes(k);
          const z = isTempOrFloat ? "0.00" : "0";
          
          for (let r = rng.s.r + 1; r <= rng.e.r; r++) {
            const addr = XLSX.utils.encode_cell({ r, c: ci });
            const cell = ws[addr];
            if (!cell) continue;
            if (typeof cell.v === "number") cell.z = z;
          }
        });

        const headRows = addNote ? 2 : 1;
        ws["!autofilter"] = {
          ref: XLSX.utils.encode_range({ r: 0, c: 0 }, { r: rng.e.r, c: rng.e.c }),
        };
        (ws as any)["!freeze"] = {
          xSplit: 0,
          ySplit: headRows,
          topLeftCell: headRows === 2 ? "A3" : "A2",
          state: "frozen",
        };
      }
    };

    // Generate status notes
    const notes = [];
    if (isAdjusted && warningMessage) {
      notes.push(warningMessage);
    }
    const daysDiff = Math.abs(getDateDifference(adjustedFromDate, adjustedToDate));
    notes.push(`Data exported for date range: ${adjustedFromDate} to ${adjustedToDate} (${daysDiff} days, unlimited)`);
    if (processedRows.length > 0) {
      notes.push(`ALL records exported: ${processedRows.length.toLocaleString()} out of ${totalCount.toLocaleString()} total`);
    }

    const combinedNote = notes.join(" | ");

    // Create worksheet based on format
    if (all && processedRows.length > 0) {
      const fixed = ["id", "created_at", "created_at_date", "created_at_time"];
      const dynamic = Array.from(
        new Set(
          processedRows.flatMap((row) =>
            Object.keys(row).filter((k) => !fixed.includes(k) && k !== "Faults")
          )
        )
      );
      const headerKeys = [...fixed, ...dynamic, "Faults"];

      ws = XLSX.utils.json_to_sheet(processedRows, { header: headerKeys });
      finalizeSheet(ws, headerKeys, combinedNote);
    } else if (processedRows.length > 0) {
      ws = XLSX.utils.json_to_sheet(processedRows);
      const headerKeys = Object.keys(processedRows[0]);
      finalizeSheet(ws, headerKeys, combinedNote);
    } else {
      // Empty sheet
      const headerKeys = ["id", "created_at"];
      ws = XLSX.utils.json_to_sheet(
        [Object.fromEntries(headerKeys.map((k) => [k, ""]))],
        { header: headerKeys }
      );
      finalizeSheet(ws, headerKeys, `No records found for date range: ${adjustedFromDate} to ${adjustedToDate}`);
    }

    XLSX.utils.book_append_sheet(wb, ws, "Data");

    console.log("Writing Excel file...");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    
    const recordCount = processedRows.length;
    const filename = `${table}_${adjustedFromDate}_to_${adjustedToDate}_${recordCount}records.xlsx`;

    console.log(`Export complete: ${filename}`);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Content-Disposition",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    console.error("Export error:", err);
    return Response.json(
      { 
        error: err.message || "Internal error",
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