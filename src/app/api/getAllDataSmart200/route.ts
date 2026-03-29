// import { pool } from "@/lib/db";
// import * as XLSX from "xlsx";
// import type { RowDataPacket } from "mysql2";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;
// // Increased timeout for large exports (60s max on Vercel Pro)
// export const maxDuration = 60;

// const ALLOWED_TABLES = [
//   "GTPL_108_gT_40E_P_S7_200_Germany",
//   "GTPL_109_gT_40E_P_S7_200_Germany",
//   "GTPL_110_gT_40E_P_S7_200_Germany",
//   "GTPL_111_gT_80E_P_S7_200_Germany",
//   "GTPL_112_gT_80E_P_S7_200_Germany",
//   "GTPL_113_gT_80E_P_S7_200_Germany",
//   "GTPL_118_GT_60T_S7_1200",
//   "GTPL_114_GT_140E_S7_1200",
//   "GTPL_115_GT_180E_S7_1200",
//   "GTPL_119_GT_180E_S7_1200",
//   "GTPL_120_GT_180E_S7_1200",
//   "GTPL_116_GT_240E_S7_1200",
//   "GTPL_117_GT_320E_S7_1200",
//   "GTPL_121_GT1000T",
//   "gtpl_122_s7_1200_01",
//   "GTPL_124_GT_450T_S7_1200",
//   "GTPL_133_GT_650T_S7_1200",
//   "GTPL_132_GT_650T_S7_1200",
//   "GTPL_132_GT300AP"
// ] as const;

// const PREFERRED_NUMERIC_ORDER = [
//   "T2_1_ambient_temp","T2_2_ambient_temp","T2_temp_mean",
//   "T1_1_cold_air_temp","T1_2_cold_air_temp","T1_temp_mean",
//   "T0_1_air_outlet_temp","T0_2_air_outlet_temp","T0_temp_mean",
//   "TH_1_supply_air_temp","TH_2_supply_air_temp","TH_temp_mean",
//   "LP_value","HP_value","LP_set_point","HP_set_point",
//   "T1_set_point","TH_T1_set_point","Compressor_timer","Delta_set_to_aeration","Aeration_duration_set",
//   "Running_time_hour","Running_time_minute","Running_hours","Running_hours_min",
//   "Blower_speed","Hot_valve_speed","AHT_vale_speed","AHT_valve_speed","Heater_speed","Cond_fan_speed",
//   "Blower_speed_set_in_manual","Cond_fan_speed_set_in_manual","Hot_gas_valve_set_in_manual","AHT_valve_set_in_manual","Heater_set_in_manual",
//   "Fault_code","FS","UF","RHP","BLWR_pct","RMR_pct","CNPR_pct","AHT_pct","HCSR_pct",
// ];

// const PRETTY_HEADER_MAP: Record<string, string> = {
//   id: "Record#",
//   created_at: "Date & Time (IST)",

//   T2_1_ambient_temp: "T2-1 Ambient Temp (°C)",
//   T2_2_ambient_temp: "T2-2 Ambient Temp (°C)",
//   T1_1_cold_air_temp: "T1-1 Cold Air Temp (°C)",
//   T1_2_cold_air_temp: "T1-2 Cold Air Temp (°C)",
//   T0_1_air_outlet_temp: "T0-1 Air Outlet Temp (°C)",
//   T0_2_air_outlet_temp: "T0-2 Air Outlet Temp (°C)",
//   TH_1_supply_air_temp: "TH-1 Supply Air Temp (°C)",
//   TH_2_supply_air_temp: "TH-2 Supply Air Temp (°C)",
//   T2_temp_mean: "T2 Mean Temp (°C)",
//   T1_temp_mean: "T1 Mean Temp (°C)",
//   T0_temp_mean: "T0 Mean Temp (°C)",
//   TH_temp_mean: "TH Mean Temp (°C)",
//   LP_value: "LP Value",
//   HP_value: "HP Value",
//   T1_set_point: "T1 Set Point",
//   TH_T1_set_point: "TH-T1 Set Point",
//   Compressor_timer: "Compressor Timer (s)",
//   Delta_set_to_aeration: "Delta to Aeration",
//   Aeration_duration_set: "Aeration Duration Set",
//   Running_time_hour: "Running Hours",
//   Running_time_minute: "Running Minutes",
//   HP_set_point: "HP Set Point",
//   LP_set_point: "LP Set Point",
//   Blower_speed: "Blower Speed (%)",
//   Hot_valve_speed: "Hot Valve Speed (%)",
//   AHT_vale_speed: "AHT Valve Speed (%)",
//   AHT_valve_speed: "AHT Valve Speed (%)",
//   Heater_speed: "Heater Speed (%)",

//   Fault_code: "Fault Code",

//   Faults: "Faults",
// };

// const FAULT_PATTERNS = [
//   "fault","overheat","door_open","short_circuit","warning","top","protection","not_achieved",
// ];

// // Optimized chunked processing for large datasets
// const CHUNK_SIZE = 10000; // Process 10k rows at a time to manage memory

// function isTrueish(v: any) {
//   if (typeof v === "boolean") return v;
//   if (typeof v === "string") return v.toLowerCase() === "true" || v === "1";
//   if (typeof v === "number") return v === 1;
//   return false;
// }

// function looksLikeFaultKey(k: string) {
//   const low = k.toLowerCase();
//   return FAULT_PATTERNS.some((p) => low.includes(p));
// }

// function toNum(v: any) {
//   if (v === null || v === undefined || v === "") return "";
//   const n = Number(v);
//   return Number.isFinite(n) ? n : "";
// }

// function formatDateTimeExact(v: Date): string {
//   // Format date exactly as YYYY-MM-DD HH:mm:ss without adding "T" or timezone conversion
//   const year = v.getFullYear();
//   const month = String(v.getMonth() + 1).padStart(2, "0");
//   const day = String(v.getDate()).padStart(2, "0");
//   const hours = String(v.getHours()).padStart(2, "0");
//   const minutes = String(v.getMinutes()).padStart(2, "0");
//   const seconds = String(v.getSeconds()).padStart(2, "0");
//   return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
// }

// function normalizeCreatedAt(raw: any): { full: string; date: string; time: string } {
//   if (raw instanceof Date) {
//     const s = formatDateTimeExact(raw);
//     const [d, t] = s.split(" ");
//     return { full: s, date: d, time: t ?? "" };
//   }
//   if (typeof raw === "string" && raw) {
//     const s = raw.replace("T", " ").slice(0, 19);
//     const [d, t] = s.split(" ");
//     return { full: s, date: d ?? "", time: t ?? "" };
//   }
//   return { full: "", date: "", time: "" };
// }

// // Process data in chunks to handle large datasets efficiently
// async function processDataInChunks(
//   table: string,
//   whereSql: string,
//   params: any[],
//   order: string,
//   effectiveLimit: number,
//   all: boolean
// ): Promise<any[]> {
//   const allProcessedRows: any[] = [];
//   let offset = 0;

//   while (offset < effectiveLimit) {
//     const currentChunkSize = Math.min(CHUNK_SIZE, effectiveLimit - offset);

//     const [chunkRows] = await pool.query<RowDataPacket[]>(
//       `SELECT * FROM \`${table}\`${whereSql} ORDER BY id ${order} LIMIT ? OFFSET ?`,
//       [...params, currentChunkSize, offset]
//     );

//     if (!Array.isArray(chunkRows) || chunkRows.length === 0) {
//       break;
//     }

//     // Normalize current chunk
//     const normalizedChunk = (chunkRows as any[]).map((r) => {
//       const obj: Record<string, any> = {};
//       for (const [k, v] of Object.entries(r)) {
//         if (v === null || v === undefined) obj[k] = "";
//         else if (v instanceof Date) {
//           // Format created_at and any Date fields exactly as stored, without timezone conversion or `T`
//           obj[k] = formatDateTimeExact(v);
//         } else {
//           obj[k] = v;
//         }
//       }
//       return obj;
//     });

//     // Process chunk based on format (pretty vs raw)
//     if (all) {
//       const prettyChunk = normalizedChunk.map((r) => {
//         const { full, date, time } = normalizeCreatedAt(r.created_at);
//         const base: Record<string, any> = {
//           id: r.id,
//           created_at: full,
//           created_at_date: date,
//           created_at_time: time,
//         };

//         const numericKeysInRow = Object.keys(r).filter((k) => {
//           if (k === "id" || k === "created_at") return false;
//           return toNum(r[k]) !== "";
//         });

//         const ordered = [
//           ...PREFERRED_NUMERIC_ORDER.filter((k) => numericKeysInRow.includes(k)),
//           ...numericKeysInRow.filter((k) => !PREFERRED_NUMERIC_ORDER.includes(k)),
//         ];

//         ordered.forEach((k) => {
//           if (k in r) base[k] = toNum(r[k]);
//         });

//         const faults: string[] = [];
//         for (const [k, v] of Object.entries(r)) {
//           if (!looksLikeFaultKey(k)) continue;
//           if (isTrueish(v)) faults.push(k.replace(/_/g, " "));
//         }
//         base["Faults"] = faults.join(", ");
//         return base;
//       });
//       allProcessedRows.push(...prettyChunk);
//     } else {
//       const rawChunk = normalizedChunk.map((r) => {
//         const { full } = normalizeCreatedAt(r.created_at);
//         return { ...r, created_at: full };
//       });
//       allProcessedRows.push(...rawChunk);
//     }

//     offset += currentChunkSize;

//     if (offset % (CHUNK_SIZE * 5) === 0) {
//       console.log(`Processed ${offset} / ${effectiveLimit} records`);
//     }
//   }

//   return allProcessedRows;
// }

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const table = searchParams.get("table");
//     const fromDate = searchParams.get("fromDate");
//     const toDate = searchParams.get("toDate");

//     const all = searchParams.get("all") !== "false";

//     const DEFAULT_MAX_LIMIT = 300000;  // 3 lakh max for non-filtered queries
//     const FALLBACK_LIMIT = 100000;    // 1 lakh fallback when no data found

//     const userLimitStr = (searchParams.get("limit") || "").toLowerCase();
//     const hasDateFilter = !!(fromDate || toDate);
//     const order = (searchParams.get("order") || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";

//     if (!table || !ALLOWED_TABLES.includes(table as any)) {
//       return Response.json({ error: "Invalid or missing table name" }, { status: 400 });
//     }

//     const params: any[] = [];
//     const where: string[] = [];

//     console.log('Date filters received:', { fromDate, toDate });

//     if (fromDate) {
//       where.push(`DATE(created_at) >= ?`);
//       params.push(fromDate);
//     }
//     if (toDate) {
//       where.push(`DATE(created_at) <= ?`);
//       params.push(toDate);
//     }

//     const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";

//     console.log("Getting count...");
//     console.log("Where clause:", whereSql);
//     console.log("Parameters:", params);

//     const [countRows] = await pool.query<RowDataPacket[]>(
//       `SELECT COUNT(*) AS cnt FROM \`${table}\`${whereSql}`,
//       params
//     );
//     const totalCount = (countRows[0] as { cnt: number }).cnt;
//     console.log(`Total matching records: ${totalCount}`);

//     // Show date range of actual data if filtered
//     if (hasDateFilter && totalCount > 0) {
//       const [dateRangeRows] = await pool.query<RowDataPacket[]>(
//         `SELECT 
//           MIN(DATE(created_at)) as earliest_date,
//           MAX(DATE(created_at)) as latest_date,
//           MIN(created_at) as earliest_datetime,
//           MAX(created_at) as latest_datetime
//          FROM \`${table}\`${whereSql}`,
//         params
//       );
//       console.log('Actual date range in filtered data:', dateRangeRows[0]);
//     }

//     let effectiveLimit: number;

//     if (hasDateFilter) {
//       if (userLimitStr === "auto" || userLimitStr === "") {
//         effectiveLimit = totalCount;
//       } else if (userLimitStr) {
//         const parsed = Number(userLimitStr);
//         effectiveLimit = Number.isFinite(parsed) && parsed > 0
//           ? Math.min(parsed, totalCount, DEFAULT_MAX_LIMIT)
//           : totalCount;
//       } else {
//         effectiveLimit = totalCount;
//       }
//     } else {
//       if (userLimitStr === "auto" || userLimitStr === "") {
//         effectiveLimit = Math.min(totalCount, DEFAULT_MAX_LIMIT);
//       } else if (userLimitStr) {
//         const parsed = Number(userLimitStr);
//         effectiveLimit = Number.isFinite(parsed) && parsed > 0
//           ? Math.min(parsed, DEFAULT_MAX_LIMIT)
//           : Math.min(totalCount, DEFAULT_MAX_LIMIT);
//       } else {
//         effectiveLimit = Math.min(totalCount, DEFAULT_MAX_LIMIT);
//       }
//     }

//     console.log(`Processing ${effectiveLimit} records...`);

//     let processedRows = await processDataInChunks(
//       table,
//       whereSql,
//       params,
//       order,
//       effectiveLimit,
//       all
//     );

//     let usedFallback = false;
//     if (processedRows.length === 0 && !hasDateFilter) {
//       console.log("No data found, using fallback...");
//       processedRows = await processDataInChunks(
//         table,
//         "",
//         [],
//         "DESC",
//         FALLBACK_LIMIT,
//         all
//       );
//       usedFallback = true;
//     }

//     console.log(`Creating Excel with ${processedRows.length} rows...`);

//     const wb = XLSX.utils.book_new();
//     let ws: XLSX.WorkSheet;

//     const finalizeSheet = (ws: XLSX.WorkSheet, headerKeys: string[], addNote?: string) => {
//       const captions = headerKeys.map((k) => PRETTY_HEADER_MAP[k] ?? k);
//       XLSX.utils.sheet_add_aoa(ws, [captions], { origin: "A1" });
//       if (addNote) XLSX.utils.sheet_add_aoa(ws, [[addNote]], { origin: "A2" });

//       ws["!cols"] = captions.map((h) => ({ wch: Math.min(Math.max(12, h.length + 2), 36) }));

//       if (ws["!ref"]) {
//         const rng = XLSX.utils.decode_range(ws["!ref"]);

//         headerKeys.forEach((k, ci) => {
//           const isTempOrFloat =
//             /temp|value|uf|rhp/i.test(k) ||
//             ["T2_temp_mean", "T1_temp_mean", "T0_temp_mean", "TH_temp_mean"].includes(k);
//           const z = isTempOrFloat ? "0.00" : "0";

//           for (let r = rng.s.r + 1; r <= rng.e.r; r++) {
//             const addr = XLSX.utils.encode_cell({ r, c: ci });
//             const cell = ws[addr];
//             if (!cell) continue;
//             if (typeof cell.v === "number") cell.z = z;
//           }
//         });

//         const headRows = addNote ? 2 : 1;
//         ws["!autofilter"] = {
//           ref: XLSX.utils.encode_range({ r: 0, c: 0 }, { r: rng.e.r, c: rng.e.c }),
//         };
//         (ws as any)["!freeze"] = {
//           xSplit: 0,
//           ySplit: headRows,
//           topLeftCell: headRows === 2 ? "A3" : "A2",
//           state: "frozen",
//         };
//       }
//     };

//     const notes = [];
//     if (usedFallback) {
//       notes.push(`No data found with your filters. Showing latest ${FALLBACK_LIMIT} records instead.`);
//     }
//     if (hasDateFilter && processedRows.length === 0) {
//       notes.push(`No records found for the selected date range: ${fromDate || 'beginning'} to ${toDate || 'end'}.`);
//     }
//     if (!hasDateFilter && totalCount > effectiveLimit) {
//       notes.push(`${totalCount} total records found. Export limited to ${effectiveLimit} records.`);
//     }
//     if (hasDateFilter && processedRows.length > 0) {
//       notes.push(`Found ${processedRows.length} records for date range: ${fromDate || 'beginning'} to ${toDate || 'end'}.`);
//     }

//     const combinedNote = notes.join(" ");

//     if (all && processedRows.length > 0) {
//       const fixed = ["id", "created_at", "created_at_date", "created_at_time"];
//       const dynamic = Array.from(
//         new Set(
//           processedRows.flatMap((row) =>
//             Object.keys(row).filter((k) => !fixed.includes(k) && k !== "Faults")
//           )
//         )
//       );
//       const headerKeys = [...fixed, ...dynamic, "Faults"];

//       ws = XLSX.utils.json_to_sheet(processedRows, { header: headerKeys });
//       finalizeSheet(ws, headerKeys, combinedNote || undefined);
//     } else if (processedRows.length > 0) {
//       ws = XLSX.utils.json_to_sheet(processedRows);
//       const headerKeys = Object.keys(processedRows[0]);
//       finalizeSheet(ws, headerKeys, combinedNote || undefined);
//     } else {
//       const headerKeys = ["id", "created_at"];
//       ws = XLSX.utils.json_to_sheet(
//         [Object.fromEntries(headerKeys.map((k) => [k, ""]))],
//         { header: headerKeys }
//       );
//       finalizeSheet(ws, headerKeys, hasDateFilter 
//         ? `No records found for date range: ${fromDate || 'beginning'} to ${toDate || 'end'}`
//         : "No records found for selected criteria"
//       );
//     }

//     XLSX.utils.book_append_sheet(wb, ws, "Data");

//     console.log("Writing Excel file...");
//     const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

//     const recordCount = processedRows.length;
//     const dateRange = hasDateFilter ? `_${fromDate || 'start'}_to_${toDate || 'end'}` : '';
//     const filename = `${table}${dateRange}_${new Date().toISOString().slice(0, 10)}_${recordCount}records.xlsx`;

//     console.log(`Export complete: ${filename}`);

//     return new Response(buffer, {
//       status: 200,
//       headers: {
//         "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//         "Content-Disposition": `attachment; filename="${filename}"`,
//         "Access-Control-Allow-Origin": "*",
//         "Access-Control-Expose-Headers": "Content-Disposition",
//         "Cache-Control": "no-store, max-age=0",
//       },
//     });
//   } catch (err: any) {
//     console.error("Export error:", err);
//     return Response.json(
//       { 
//         error: err.message || "Internal error",
//         details: process.env.NODE_ENV === 'development' ? err.stack : undefined
//       },
//       {
//         status: 500,
//         headers: {
//           "Access-Control-Allow-Origin": "*",
//           "Cache-Control": "no-store, max-age=0",
//         },
//       }
//     );
//   }
// }

// export async function OPTIONS() {
//   return new Response(null, {
//     status: 200,
//     headers: {
//       "Access-Control-Allow-Origin": "*",
//       "Access-Control-Allow-Methods": "GET, OPTIONS",
//       "Access-Control-Allow-Headers": "Content-Type",
//     },
//   });
// }
import { pool } from "@/lib/db";
import * as XLSX from "xlsx";
import type { RowDataPacket } from "mysql2";

export const dynamic = "force-dynamic";
export const revalidate = 0;
// Increased timeout for large exports (60s max on Vercel Pro)
export const maxDuration = 60;

const ALLOWED_TABLES = [
  "GTPL_108_gT_40E_P_S7_200_Germany",
  "GTPL_109_gT_40E_P_S7_200_Germany",
  "GTPL_110_gT_40E_P_S7_200_Germany",
  "GTPL_111_gT_80E_P_S7_200_Germany",
  "GTPL_112_gT_80E_P_S7_200_Germany",
  "GTPL_113_gT_80E_P_S7_200_Germany",
  "GTPL_118_GT_60T_S7_1200",
  "GTPL_114_GT_140E_S7_1200",
  "GTPL_115_GT_180E_S7_1200",
  "GTPL_119_GT_180E_S7_1200",
  "GTPL_120_GT_180E_S7_1200",
  "GTPL_116_GT_240E_S7_1200",
  "GTPL_117_GT_320E_S7_1200",
  "GTPL_121_GT1000T",
  "gtpl_122_s7_1200_01",
  "GTPL_124_GT_450T_S7_1200",
  "GTPL_133_GT_650T_S7_1200",
  "GTPL_131_GT_650T_S7_1200",
  "GTPL_132_GT_650T_S7_1200",
  "GTPL_132_GT300AP",
  "GTPL_137_GT_450T_S7_1200",
  "GTPL_138_GT_450T_S7_1200",
  "GTPL_061_GT_450T_S7_1200",
    "GTPL_134_GT_450T_S7_1200",
  "GTPL_135_GT_450T_S7_1200",
  "GTPL_145_GT_450T_S7_1200",
    'GTPL_139_GT300AP',
  "GTPL_142_GT_450AP_S7_1200",
  "GTPL_123_GT_450AP_S7_1200",
  "GTPL_143_GT_450AP_S7_1200"
] as const;

const PREFERRED_NUMERIC_ORDER = [
  "T2_1_ambient_temp", "T2_2_ambient_temp", "T2_temp_mean",
  "T1_1_cold_air_temp", "T1_2_cold_air_temp", "T1_temp_mean",
  "T0_1_air_outlet_temp", "T0_2_air_outlet_temp", "T0_temp_mean",
  "TH_1_supply_air_temp", "TH_2_supply_air_temp", "TH_temp_mean",
  "LP_value", "HP_value", "LP_set_point", "HP_set_point",
  "T1_set_point", "TH_T1_set_point", "Compressor_timer", "Delta_set_to_aeration", "Aeration_duration_set",
  "Running_time_hour", "Running_time_minute", "Running_hours", "Running_hours_min",
  "Blower_speed", "Hot_valve_speed", "AHT_vale_speed", "AHT_valve_speed", "Heater_speed", "Cond_fan_speed",
  "Blower_speed_set_in_manual", "Cond_fan_speed_set_in_manual", "Hot_gas_valve_set_in_manual", "AHT_valve_set_in_manual", "Heater_set_in_manual",
  "Fault_code", "FS", "UF", "RHP", "BLWR_pct", "RMR_pct", "CNPR_pct", "AHT_pct", "HCSR_pct",
  "T2_1_ambient_temp", "T2_2_ambient_temp", "T1_1_cold_air_temp", "T1_2_cold_air_temp", "T0_1_air_outlet_temp", "T0_2_air_outlet_temp", "LP_value", "HP_value", "T2_temp_mean", "T1_temp_mean", "T0_temp_mean", "Blower_speed", "Hot_valve_speed", "AHT_valve_speed", "T0_set_point", "Delta_T_set_point", "Compressor_timer", "Aeration_duration_set", "Running_time_hour", "Running_time_minute", "HP_set_point", "LP_set_point", "Blower_speed_set_in_manual", "Hot_gas_valve_set_in_manual", "AHT_valve_set_in_manual", "Running_hours", "Running_hours_min", "FAULT_CODE", "Auto_mode", "Manual_mode", "Aeration_mode", "Auto_start", "Auto_stop", "Aeration_start", "Aeration_stop", "Continuous_mode", "Compressor_circuit_breaker_I0_0", "Comp_module_fdk_error_I0_1", "Comp_in_operation_I0_2", "Oil_level_I0_3", "Blower_drive_I0_4", "Blower_in_operation_I0_5", "Blower_circuit_breaker_I0_6", "Cond_fan_1_TOP_I0_7", "Cond_fan_1_circuit_breaker_I1_0", "Low_pressure_fault_I1_1", "Compressor_OLR_trip_I1_2", "High_pressure_fault_I1_3", "Start_stop_switch_I1_4", "Three_phase_monitoring_fault_I2_0", "Cond_fan_2_TOP_I2_2", "Cond_fan_3_TOP_I2_3", "Cond_fan_4_TOP_I2_4", "Cond_fan_2_circuit_breaker_I2_5", "Cond_fan_3_circuit_breaker_I2_6", "Cond_fan_4_circuit_breaker_I2_7", "Cond_fan_5_TOP_I3_0", "Cond_fan_6_TOP_I3_1", "Cond_fan_5_circuit_breaker_I3_2", "Cond_fan_6_circuit_breaker_I3_3", "Compressor_start_Q0_0", "Compressor_module_reset_Q0_1", "CR_valve_25_percent_ON_Q0_2", "CR_valve_50_percent_ON_Q0_3", "Solenoid_valve_ON_Q0_4", "Hot_gas_valve_ON_Q0_5", "AHT_valve_ON_Q0_6", "Blower_drive_start_Q0_7", "System_warning_Q1_0", "Chiller_healthy_Q1_1", "Cond_fan_1_ON_Q2_1", "CR_valve_75_percent_ON_Q2_2", "Chiller_fault_Q2_3", "Cond_fan_2_ON_Q2_4", "Cond_fan_3_ON_Q2_5", "Cond_fan_4_ON_Q2_6", "CR_valve_100_percent_ON_Q2_7", "Cond_fan_5_ON_Q3_0", "Cond_fan_6_ON_Q3_1", "Compressor_circuit_breaker_fault", "Oil_pressure_low", "Blower_drive_fault", "Blower_circuit_breaker_fault", "Ambient_air_sensor_1open", "COND_FAN_OVERLOAD", "Three_phase_monitor_fault", "High_pressure_fault", "Ambient_temp_lower_than_set_temp", "Ambient_temp_over_50C", "COMP_MODULE_FEEDBACK_ERROR_Si_I1", "Low_pressure_1_fault", "COMP_FBK_ERROR", "Low_pressure_2_fault", "Ambient_temp_over_47C", "Condenser_fan_2_TOP_fault", "Condenser_fan_3_TOP_fault", "Condenser_fan_4_TOP_fault", "Condenser_fan_2_circuit_breaker_fault", "Condenser_fan_3_circuit_breaker_fault", "Condenser_fan_4_circuit_breaker_fault", "Condenser_fan_5_TOP_fault", "Condenser_fan_6_TOP_fault", "Condenser_fan_5_circuit_breaker_fault", "Condenser_fan_6_circuit_breaker_fault", "Condenser_fan_1_circuit_breaker_fault", "Condenser_fan_1_TOP_fault", "Ambient_air_sensor_1_short_circuit", "Ambient_air_sensor_2_open", "Ambient_air_sensor_2_short_circuit", "Cold_air_sensor_1_open", "Cold_air_sensor_1_short_circuit", "Cold_air_sensor_2_open", "Cold_air_sensor_2_short_circuit", "Air_outlet_sensor_1_open", "Air_outlet_sensor_1_short_circuit", "Air_outlet_sensor_2_open", "Air_outlet_sensor_2_short_circuit"

];

const PRETTY_HEADER_MAP: Record<string, string> = {
  id: "Record#",
  created_at: "Date & Time (IST)",
  created_on: "Date & Time (IST)",

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
  "fault", "overheat", "door_open", "short_circuit", "warning", "top", "protection", "not_achieved",
];

// Optimized chunked processing for large datasets
const CHUNK_SIZE = 10000; // Process 10k rows at a time to manage memory

// Helper function to detect the timestamp column name for a table
async function getTimestampColumn(table: string): Promise<'created_at' | 'created_on'> {
  try {
    const [columns] = await pool.query<RowDataPacket[]>(
      `SHOW COLUMNS FROM \`${table}\` WHERE Field IN ('created_at', 'created_on')`
    );

    if (Array.isArray(columns) && columns.length > 0) {
      const colName = columns[0].Field;
      return colName === 'created_on' ? 'created_on' : 'created_at';
    }

    // Default fallback
    return 'created_at';
  } catch (err) {
    console.error('Error detecting timestamp column:', err);
    return 'created_at';
  }
}

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

function formatDateTimeExact(v: Date): string {
  // Format date exactly as YYYY-MM-DD HH:mm:ss without adding "T" or timezone conversion
  const year = v.getFullYear();
  const month = String(v.getMonth() + 1).padStart(2, "0");
  const day = String(v.getDate()).padStart(2, "0");
  const hours = String(v.getHours()).padStart(2, "0");
  const minutes = String(v.getMinutes()).padStart(2, "0");
  const seconds = String(v.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function normalizeCreatedAt(raw: any): { full: string; date: string; time: string } {
  if (raw instanceof Date) {
    const s = formatDateTimeExact(raw);
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

// Check if table is machine 121, 122, 061, 132, 134, 135, 136, 137, 138, 142, 123, or 143 (full column export)
function isFullColumnTable(table: string): boolean {
  return table === "GTPL_121_GT1000T" ||
    table === "gtpl_122_s7_1200_01" ||
    table === "GTPL_061_GT_450T_S7_1200" ||
    table === "GTPL_132_GT300AP" ||
    table === "GTPL_134_GT_450T_S7_1200" ||
    table === "GTPL_135_GT_450T_S7_1200" ||
    table === "GTPL_145_GT_450T_S7_1200" ||
    table === "GTPL_136_GT_450AP_S7_1200" ||
    table === "GTPL_137_GT_450T_S7_1200" ||
    table === "GTPL_138_GT_450T_S7_1200" ||
    table === "GTPL_142_GT_450AP_S7_1200" ||
    table === "GTPL_123_GT_450AP_S7_1200" ||
    table === "GTPL_143_GT_450AP_S7_1200";
}

// Process data in chunks to handle large datasets efficiently
async function processDataInChunks(
  table: string,
  whereSql: string,
  params: any[],
  order: string,
  effectiveLimit: number,
  all: boolean,
  timestampCol: string
): Promise<any[]> {
  const allProcessedRows: any[] = [];
  let offset = 0;
  const isFullExport = isFullColumnTable(table);

  while (offset < effectiveLimit) {
    const currentChunkSize = Math.min(CHUNK_SIZE, effectiveLimit - offset);

    const [chunkRows] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM \`${table}\`${whereSql} ORDER BY id ${order} LIMIT ? OFFSET ?`,
      [...params, currentChunkSize, offset]
    );

    if (!Array.isArray(chunkRows) || chunkRows.length === 0) {
      break;
    }

    // Normalize current chunk
    const normalizedChunk = (chunkRows as any[]).map((r) => {
      const obj: Record<string, any> = {};
      for (const [k, v] of Object.entries(r)) {
        if (v === null || v === undefined) obj[k] = "";
        else if (v instanceof Date) {
          // Format timestamp fields exactly as stored
          obj[k] = formatDateTimeExact(v);
        } else {
          obj[k] = v;
        }
      }
      return obj;
    });

    // Process chunk based on format (pretty vs raw) and table type
    if (all || isFullExport) {
      const prettyChunk = normalizedChunk.map((r) => {
        const timestampValue = r[timestampCol] || r.created_at || r.created_on;
        const { full, date, time } = normalizeCreatedAt(timestampValue);
        const base: Record<string, any> = {
          id: r.id,
          created_at: full,
          created_at_date: date,
          created_at_time: time,
        };

        if (isFullExport) {
          // For machines 121 and 122, include ALL columns with their raw values
          for (const [k, v] of Object.entries(r)) {
            if (k === "id" || k === timestampCol) continue; // Skip id and timestamp as they're already handled

            // Convert numeric values appropriately, but keep all data types
            const numValue = toNum(v);
            base[k] = numValue !== "" ? numValue : v;
          }
        } else {
          // Original logic for other machines
          const numericKeysInRow = Object.keys(r).filter((k) => {
            if (k === "id" || k === "created_at" || k === "created_on") return false;
            return toNum(r[k]) !== "";
          });

          const ordered = [
            ...PREFERRED_NUMERIC_ORDER.filter((k) => numericKeysInRow.includes(k)),
            ...numericKeysInRow.filter((k) => !PREFERRED_NUMERIC_ORDER.includes(k)),
          ];

          ordered.forEach((k) => {
            if (k in r) base[k] = toNum(r[k]);
          });
        }

        // Add faults for all machines
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
        const timestampValue = r[timestampCol] || r.created_at || r.created_on;
        const { full } = normalizeCreatedAt(timestampValue);
        // Normalize the output to always use 'created_at' for consistency
        const normalized = { ...r };
        if (timestampCol === 'created_on' && r.created_on) {
          normalized.created_at = full;
          delete normalized.created_on;
        } else {
          normalized.created_at = full;
        }
        return normalized;
      });
      allProcessedRows.push(...rawChunk);
    }

    offset += currentChunkSize;

    if (offset % (CHUNK_SIZE * 5) === 0) {
      console.log(`Processed ${offset} / ${effectiveLimit} records`);
    }
  }

  return allProcessedRows;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const all = searchParams.get("all") !== "false";

    const DEFAULT_MAX_LIMIT = 300000;  // 3 lakh max for non-filtered queries
    const FALLBACK_LIMIT = 100000;    // 1 lakh fallback when no data found

    const userLimitStr = (searchParams.get("limit") || "").toLowerCase();
    const hasDateFilter = !!(fromDate || toDate);
    const order = (searchParams.get("order") || "desc").toLowerCase() === "asc" ? "ASC" : "DESC";

    if (!table || !ALLOWED_TABLES.includes(table as any)) {
      return Response.json({ error: "Invalid or missing table name" }, { status: 400 });
    }

    // Detect which timestamp column this table uses
    const timestampCol = await getTimestampColumn(table);
    console.log(`Table ${table} uses timestamp column: ${timestampCol}`);

    const params: any[] = [];
    const where: string[] = [];

    console.log('Date filters received:', { fromDate, toDate });

    if (fromDate) {
      where.push(`DATE(${timestampCol}) >= ?`);
      params.push(fromDate);
    }
    if (toDate) {
      where.push(`DATE(${timestampCol}) <= ?`);
      params.push(toDate);
    }

    const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";

    console.log("Getting count...");
    console.log("Where clause:", whereSql);
    console.log("Parameters:", params);

    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM \`${table}\`${whereSql}`,
      params
    );
    const totalCount = (countRows[0] as { cnt: number }).cnt;
    console.log(`Total matching records: ${totalCount}`);

    // Show date range of actual data if filtered
    if (hasDateFilter && totalCount > 0) {
      const [dateRangeRows] = await pool.query<RowDataPacket[]>(
        `SELECT 
          MIN(DATE(${timestampCol})) as earliest_date,
          MAX(DATE(${timestampCol})) as latest_date,
          MIN(${timestampCol}) as earliest_datetime,
          MAX(${timestampCol}) as latest_datetime
         FROM \`${table}\`${whereSql}`,
        params
      );
      console.log('Actual date range in filtered data:', dateRangeRows[0]);
    }

    let effectiveLimit: number;

    if (hasDateFilter) {
      if (userLimitStr === "auto" || userLimitStr === "") {
        effectiveLimit = totalCount;
      } else if (userLimitStr) {
        const parsed = Number(userLimitStr);
        effectiveLimit = Number.isFinite(parsed) && parsed > 0
          ? Math.min(parsed, totalCount, DEFAULT_MAX_LIMIT)
          : totalCount;
      } else {
        effectiveLimit = totalCount;
      }
    } else {
      if (userLimitStr === "auto" || userLimitStr === "") {
        effectiveLimit = Math.min(totalCount, DEFAULT_MAX_LIMIT);
      } else if (userLimitStr) {
        const parsed = Number(userLimitStr);
        effectiveLimit = Number.isFinite(parsed) && parsed > 0
          ? Math.min(parsed, DEFAULT_MAX_LIMIT)
          : Math.min(totalCount, DEFAULT_MAX_LIMIT);
      } else {
        effectiveLimit = Math.min(totalCount, DEFAULT_MAX_LIMIT);
      }
    }

    console.log(`Processing ${effectiveLimit} records...`);

    let processedRows = await processDataInChunks(
      table,
      whereSql,
      params,
      order,
      effectiveLimit,
      all,
      timestampCol
    );

    let usedFallback = false;
    if (processedRows.length === 0 && !hasDateFilter) {
      console.log("No data found, using fallback...");
      processedRows = await processDataInChunks(
        table,
        "",
        [],
        "DESC",
        FALLBACK_LIMIT,
        all,
        timestampCol
      );
      usedFallback = true;
    }

    console.log(`Creating Excel with ${processedRows.length} rows...`);

    const wb = XLSX.utils.book_new();
    let ws: XLSX.WorkSheet;

    const finalizeSheet = (ws: XLSX.WorkSheet, headerKeys: string[], addNote?: string) => {
      const captions = headerKeys.map((k) => PRETTY_HEADER_MAP[k] ?? k);
      XLSX.utils.sheet_add_aoa(ws, [captions], { origin: "A1" });
      if (addNote) XLSX.utils.sheet_add_aoa(ws, [[addNote]], { origin: "A2" });

      ws["!cols"] = captions.map((h) => ({ wch: Math.min(Math.max(12, h.length + 2), 36) }));

      if (ws["!ref"]) {
        const rng = XLSX.utils.decode_range(ws["!ref"]);

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

    const notes = [];
    if (usedFallback) {
      notes.push(`No data found with your filters. Showing latest ${FALLBACK_LIMIT} records instead.`);
    }
    if (hasDateFilter && processedRows.length === 0) {
      notes.push(`No records found for the selected date range: ${fromDate || 'beginning'} to ${toDate || 'end'}.`);
    }
    if (!hasDateFilter && totalCount > effectiveLimit) {
      notes.push(`${totalCount} total records found. Export limited to ${effectiveLimit} records.`);
    }
    if (hasDateFilter && processedRows.length > 0) {
      notes.push(`Found ${processedRows.length} records for date range: ${fromDate || 'beginning'} to ${toDate || 'end'}.`);
    }

    const combinedNote = notes.join(" ");

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
      finalizeSheet(ws, headerKeys, combinedNote || undefined);
    } else if (processedRows.length > 0) {
      ws = XLSX.utils.json_to_sheet(processedRows);
      const headerKeys = Object.keys(processedRows[0]);
      finalizeSheet(ws, headerKeys, combinedNote || undefined);
    } else {
      const headerKeys = ["id", "created_at"];
      ws = XLSX.utils.json_to_sheet(
        [Object.fromEntries(headerKeys.map((k) => [k, ""]))],
        { header: headerKeys }
      );
      finalizeSheet(ws, headerKeys, hasDateFilter
        ? `No records found for date range: ${fromDate || 'beginning'} to ${toDate || 'end'}`
        : "No records found for selected criteria"
      );
    }

    XLSX.utils.book_append_sheet(wb, ws, "Data");

    console.log("Writing Excel file...");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    const recordCount = processedRows.length;
    const dateRange = hasDateFilter ? `_${fromDate || 'start'}_to_${toDate || 'end'}` : '';
    const filename = `${table}${dateRange}_${new Date().toISOString().slice(0, 10)}_${recordCount}records.xlsx`;

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