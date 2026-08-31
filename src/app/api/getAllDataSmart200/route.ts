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

// const PREFERRED_NUMERIC_ORDER_ARR = [
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
//           ...PREFERRED_NUMERIC_ORDER_ARR.filter((k) => numericKeysInRow.includes(k)),
//           ...numericKeysInRow.filter((k) => !PREFERRED_NUMERIC_ORDER_ARR.includes(k)),
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
import { backendJson } from "@/lib/backendApi";
import * as XLSX from "xlsx";

export const dynamic = "force-dynamic";
export const revalidate = 0;
// Increased timeout for large exports (60s max on Vercel Pro)
export const maxDuration = 60;

// ── Machine 137/138 column definitions (matched to actual DB columns) ──
const GTPL_137_138_COLUMNS = {
  analogInputs: {
    label: "Analog Inputs",
    columns: {
      "T2_1_ambient_temp": "T2.1 Ambient Temp (°C)",
      "T2_2_ambient_temp": "T2.2 Ambient Temp (°C)",
      "T2_temp_mean": "T2 Mean Temp (°C)",
      "T1_1_cold_air_temp": "T1.1 Cold Air Temp (°C)",
      "T1_2_cold_air_temp": "T1.2 Cold Air Temp (°C)",
      "T1_temp_mean": "T1 Mean Temp (°C)",
      "T0_1_air_outlet_temp": "T0.1 Air Outlet Temp (°C)",
      "T0_2_air_outlet_temp": "T0.2 Air Outlet Temp (°C)",
      "T0_temp_mean": "T0 Mean Temp (°C)",
      "LP_value": "Suction Pressure LP (bar)",
      "HP_value": "Discharge Pressure HP (bar)",
      "LP_set_point": "LP Set Point",
      "HP_set_point": "HP Set Point",
    },
  },
  analogOutputs: {
    label: "Analog Outputs",
    columns: {
      "Blower_speed": "Blower Speed (%)",
      "Cond_fan_speed": "Condenser Fan Speed (%)",
      "Hot_valve_speed": "Hot Gas Valve (%)",
      "AHT_valve_speed": "Afterheat Valve (%)",
    },
  },
  aeration: {
    label: "Aeration & Settings",
    columns: {
      "T0_set_point": "T0 Set Point",
      "Delta_T_set_point": "Delta T Set Point",
      "Compressor_timer": "Compressor Timer (s)",
      "Aeration_duration_set": "Aeration Duration Set",
      "Running_time_hour": "Running Hours",
      "Running_time_minute": "Running Minutes",
      "Running_hours": "Running Hours Total",
      "Running_hours_min": "Running Hours Min",
      "FAULT_CODE": "Fault Code",
    },
  },
  modes: {
    label: "Operating Modes",
    columns: {
      "Auto_mode": "Auto Mode",
      "Manual_mode": "Manual Mode",
      "Aeration_mode": "Aeration Mode",
      "Auto_start": "Auto Start",
      "Auto_stop": "Auto Stop",
      "Aeration_start": "Aeration Start",
      "Aeration_stop": "Aeration Stop",
      "Continuous_mode": "Continuous Mode",
    },
  },
  faultInputs: {
    label: "Fault Inputs",
    columns: {
      "Compressor_circuit_breaker_I0_0": "Compressor Circuit Breaker (I0.0)",
      "Compressor_motor_overheat_I0_1": "Compressor Motor Overheat (I0.1)",
      "Compressor_in_operation_I0_2": "Compressor In Operation (I0.2)",
      "Compressor_oil_low_I0_3": "Compressor Oil Low (I0.3)",
      "Blower_drive_fault_I0_4": "Blower Drive Fault (I0.4)",
      "Blower_drive_in_operation_I0_5": "Blower Drive In Operation (I0.5)",
      "Blower_circuit_breaker_I0_6": "Blower Circuit Breaker (I0.6)",
      "Condenser_fan1_TOP_fault_I0_7": "Condenser Fan 1 TOP Fault (I0.7)",
      "Condenser_fan1_circuit_breaker_I1_0": "Condenser Fan 1 Circuit Breaker (I1.0)",
      "Spare_I1_1": "Spare (I1.1)",
      "Low_pressure_fault_I1_2": "Low Pressure Fault (I1.2)",
      "High_pressure_fault_I1_3": "High Pressure Fault (I1.3)",
      "Start_stop_I1_4": "Start/Stop (I1.4)",
      "Three_phase_monitor_fault_I2_0": "Three Phase Monitor Fault (I2.0)",
      "Spare_I2_1": "Spare (I2.1)",
      "Cond_fan2_TOP_fault_I2_2": "Condenser Fan 2 TOP Fault (I2.2)",
      "Cond_fan3_TOP_fault_I2_3": "Condenser Fan 3 TOP Fault (I2.3)",
      "Cond_fan4_TOP_fault_I2_4": "Condenser Fan 4 TOP Fault (I2.4)",
      "Cond_fan2_circuit_breaker_fault_I2_5": "Condenser Fan 2 CB Fault (I2.5)",
      "Cond_fan3_circuit_breaker_fault_I2_6": "Condenser Fan 3 CB Fault (I2.6)",
      "Cond_fan4_circuit_breaker_fault_I2_7": "Condenser Fan 4 CB Fault (I2.7)",
      // Additional fault columns in the table
      "Compressor_circuit_breaker_fault": "Compressor CB Fault",
      "Compressor_feedback_error": "Compressor Feedback Error",
      "Compressor_motor_winding_temp_high": "Motor Winding Temp High",
      "Oil_pressure_low": "Oil Pressure Low",
      "Blower_drive_fault": "Blower Drive Fault",
      "Blower_circuit_breaker_fault": "Blower CB Fault",
      "Three_phase_monitor_fault": "Three Phase Monitor Fault",
      "High_pressure_fault": "High Pressure Fault",
      "Low_pressure_1_fault": "Low Pressure 1 Fault",
      "Low_pressure_2_fault": "Low Pressure 2 Fault",
      "Ambient_temp_lower_than_set_temp": "Ambient Temp < Set Temp",
      "Ambient_temp_over_40C": "Ambient Temp > 40°C",
      "Ambient_temp_over_43C": "Ambient Temp > 43°C",
      "Condenser_fan1_TOP_fault": "Condenser Fan 1 TOP Fault",
      "Condenser_fan1_circuit_breaker_fault": "Condenser Fan 1 CB Fault",
      "Condenser_fan2_TOP_fault": "Condenser Fan 2 TOP Fault",
      "Condenser_fan2_circuit_breaker_fault": "Condenser Fan 2 CB Fault",
      "Condenser_fan3_TOP_fault": "Condenser Fan 3 TOP Fault",
      "Condenser_fan3_circuit_breaker_fault": "Condenser Fan 3 CB Fault",
      "Condenser_fan4_TOP_fault": "Condenser Fan 4 TOP Fault",
      "Condenser_fan4_circuit_breaker_fault": "Condenser Fan 4 CB Fault",
      "Ambient_air_sensor_T2_1_open": "T2.1 Sensor Open",
      "Ambient_air_sensor_T2_1_short_circuit": "T2.1 Sensor Short",
      "Ambient_air_sensor_T2_2_open": "T2.2 Sensor Open",
      "Ambient_air_sensor_T2_2_short_circuit": "T2.2 Sensor Short",
      "Cold_air_sensor_T1_1_open": "T1.1 Sensor Open",
      "Cold_air_sensor_T1_1_short_circuit": "T1.1 Sensor Short",
      "Cold_air_sensor_T1_2_open": "T1.2 Sensor Open",
      "Cold_air_sensor_T1_2_short_circuit": "T1.2 Sensor Short",
      "Air_outlet_sensor_T0_1_open": "T0.1 Sensor Open",
      "Air_outlet_sensor_T0_1_short_circuit": "T0.1 Sensor Short",
      "Air_outlet_sensor_T0_2_open": "T0.2 Sensor Open",
      "Air_outlet_sensor_T0_2_short_circuit": "T0.2 Sensor Short",
    },
  },
  digitalOutputs: {
    label: "Digital Outputs",
    columns: {
      "Compressor_on_Q0_0": "Compressor ON (Q0.0)",
      "Compressor_motor_reset_Q0_1": "Compressor Motor Reset (Q0.1)",
      "Spare_Q0_2": "Spare (Q0.2)",
      "Spare_Q0_3": "Spare (Q0.3)",
      "Solenoid_valve_on_Q0_4": "Solenoid Valve ON (Q0.4)",
      "Hot_gas_valve_on_Q0_5": "Hot Gas Valve ON (Q0.5)",
      "After_heat_valve_on_Q0_6": "Afterheat Valve ON (Q0.6)",
      "Blower_drive_on_Q0_7": "Blower Drive ON (Q0.7)",
      "Collective_Trouble_Signal_Q1_0": "Collective Trouble Signal (Q1.0)",
      "Chiller_healthy_on_Q1_1": "Chiller Healthy (Q1.1)",
      "Spare_Q2_0": "Spare (Q2.0)",
      "Condenser_fan1_on_Q2_1": "Condenser Fan 1 ON (Q2.1)",
      "Spare_Q2_2": "CR Valve / Spare (Q2.2)",
      "Chiller_Fault_Q2_3": "Chiller Fault (Q2.3)",
      "Condenser_fan2_on_Q2_4": "Condenser Fan 2 ON (Q2.4)",
      "Condenser_fan3_on_Q2_5": "Condenser Fan 3 ON (Q2.5)",
      "Condenser_fan4_on_Q2_6": "Condenser Fan 4 ON (Q2.6)",
    },
  },
};

// Check if table is a 137/138 machine
function is137or138(table: string): boolean {
  return table === "GTPL_137_GT_450T_S7_1200" || table === "GTPL_138_GT_450T_S7_1200";
}

// Build professional Excel for 137/138 using exceljs
function build137_138Excel(rows: Record<string, unknown>[], timestampCol: string): Buffer {
  const workbook = XLSX.utils.book_new();

  const machineDataRows = rows.map((row) => {
    const timestampValue = row[timestampCol] || row.created_at || row.created_on;
    const { full, date, time } = normalizeCreatedAt(timestampValue);
    return {
      ...row,
      created_at: full,
      created_at_date: date,
      created_at_time: time,
    };
  });

  const machineDataSheet = XLSX.utils.json_to_sheet(machineDataRows);
  XLSX.utils.book_append_sheet(workbook, machineDataSheet, "Machine Data");

  const faultColumnMap = GTPL_137_138_COLUMNS.faultInputs.columns as Record<string, string>;
  const allFaultKeys = Object.keys(faultColumnMap).filter((key) =>
    rows.length > 0 ? key in rows[0] : false
  );
  const activeFaultRows = rows
    .map((row) => {
      const timestampValue = row[timestampCol] || row.created_at || row.created_on;
      const { date, time } = normalizeCreatedAt(timestampValue);
      const activeFaults = allFaultKeys
        .filter((faultKey) => isTrueish(row[faultKey]))
        .map((faultKey) => faultColumnMap[faultKey] || faultKey);
      if (activeFaults.length === 0) return null;
      return {
        id: row.id ?? "",
        created_at_date: date,
        created_at_time: time,
        active_faults: activeFaults.join(", "),
      };
    })
    .filter(Boolean) as Record<string, unknown>[];

  const faultSheet = XLSX.utils.json_to_sheet(
    activeFaultRows.length > 0 ? activeFaultRows : [{ note: "No active faults found." }]
  );
  XLSX.utils.book_append_sheet(workbook, faultSheet, "Active Faults");

  const digitalOutputColumnMap = GTPL_137_138_COLUMNS.digitalOutputs.columns as Record<string, string>;
  const outputKeys = Object.keys(digitalOutputColumnMap).filter((key) =>
    rows.length > 0 ? key in rows[0] : false
  );
  const digitalOutputRows = rows.map((row) => {
    const timestampValue = row[timestampCol] || row.created_at || row.created_on;
    const { date, time } = normalizeCreatedAt(timestampValue);
    const outputRow: Record<string, unknown> = {
      id: row.id ?? "",
      created_at_date: date,
      created_at_time: time,
    };
    for (const key of outputKeys) {
      outputRow[digitalOutputColumnMap[key] || key] = isTrueish(row[key]) ? "ON" : "OFF";
    }
    return outputRow;
  });
  const digitalOutputsSheet = XLSX.utils.json_to_sheet(digitalOutputRows);
  XLSX.utils.book_append_sheet(workbook, digitalOutputsSheet, "Digital Outputs");

  return XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
}

const ALLOWED_TABLES = [
  "GTPL_108_gT_40E_P_S7_200_Germany",
  "GTPL_109_gT_40E_P_S7_200_Germany",
  "GTPL_110_gT_40E_P_S7_200_Germany",
  "GTPL_111_gT_80E_P_S7_200_Germany",
  "GTPL_112_gT_80E_P_S7_200_Germany",
  "GTPL_113_gT_80E_P_S7_200_Germany",
  "GTPL_118_GT_60T_S7_1200",
  "GTPL_149_GT_60T_S7_1200",
  "GTPL_114_GT_140E_S7_1200",
  "GTPL_044_GT_140E_S7_1200",
  "GTPL_115_GT_180E_S7_1200",
  "GTPL_119_GT_180E_S7_1200",
  "GTPL_120_GT_180E_S7_1200",
  "GTPL_116_GT_240E_S7_1200",
  "GTPL_117_GT_320E_S7_1200",
  "GTPL_121_GT1000T",
  "gtpl_122_s7_1200_01",
  "GTPL_124_GT_450T_S7_1200",
  "GTPL_133_GT_650T_S7_1200",
  "GTPL_154_GT_650T_S7_1200",
  "GTPL_155_GT_650T_S7_1200",
  "GTPL_131_GT_650T_S7_1200",
  "GTPL_132_GT_650T_S7_1200",
  "GTPL_068_GT_650T_S7_1200",
  "GTPL_104_GT_650T_S7_1200",
  "GTPL_132_GT300AP",
  "GTPL_137_GT_450T_S7_1200",
  "GTPL_138_GT_450T_S7_1200",
  "GTPL_061_GT_450T_S7_1200",
    "GTPL_134_GT_450T_S7_1200",
  "GTPL_135_GT_450T_S7_1200",
  "GTPL_145_GT_450T_S7_1200",
  "GTPL_148_GT_450T_S7_1200",
    'GTPL_139_GT300AP',
  'GTPL_144_GT_300AP_S7_1200',
  "GTPL_142_GT_450AP_S7_1200",
  "GTPL_123_GT_450AP_S7_1200",
  "GTPL_143_GT_450AP_S7_1200"
] as const;

// Deduplicated preferred order (used as a Set for O(1) lookups + ordered array)
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
  "T0_set_point", "Delta_T_set_point", "FAULT_CODE",
  "Auto_mode", "Manual_mode", "Aeration_mode", "Auto_start", "Auto_stop", "Aeration_start", "Aeration_stop", "Continuous_mode",
  "Compressor_circuit_breaker_I0_0", "Comp_module_fdk_error_I0_1", "Comp_in_operation_I0_2", "Oil_level_I0_3",
  "Blower_drive_I0_4", "Blower_in_operation_I0_5", "Blower_circuit_breaker_I0_6", "Cond_fan_1_TOP_I0_7",
  "Cond_fan_1_circuit_breaker_I1_0", "Low_pressure_fault_I1_1", "Compressor_OLR_trip_I1_2", "High_pressure_fault_I1_3",
  "Start_stop_switch_I1_4", "Three_phase_monitoring_fault_I2_0",
  "Cond_fan_2_TOP_I2_2", "Cond_fan_3_TOP_I2_3", "Cond_fan_4_TOP_I2_4",
  "Cond_fan_2_circuit_breaker_I2_5", "Cond_fan_3_circuit_breaker_I2_6", "Cond_fan_4_circuit_breaker_I2_7",
  "Cond_fan_5_TOP_I3_0", "Cond_fan_6_TOP_I3_1", "Cond_fan_5_circuit_breaker_I3_2", "Cond_fan_6_circuit_breaker_I3_3",
  "Compressor_start_Q0_0", "Compressor_module_reset_Q0_1",
  "CR_valve_25_percent_ON_Q0_2", "CR_valve_50_percent_ON_Q0_3",
  "Solenoid_valve_ON_Q0_4", "Hot_gas_valve_ON_Q0_5", "AHT_valve_ON_Q0_6", "Blower_drive_start_Q0_7",
  "System_warning_Q1_0", "Chiller_healthy_Q1_1",
  "Cond_fan_1_ON_Q2_1", "CR_valve_75_percent_ON_Q2_2", "Chiller_fault_Q2_3",
  "Cond_fan_2_ON_Q2_4", "Cond_fan_3_ON_Q2_5", "Cond_fan_4_ON_Q2_6", "CR_valve_100_percent_ON_Q2_7",
  "Cond_fan_5_ON_Q3_0", "Cond_fan_6_ON_Q3_1",
  "Compressor_circuit_breaker_fault", "Oil_pressure_low", "Blower_drive_fault", "Blower_circuit_breaker_fault",
  "Ambient_air_sensor_1open", "COND_FAN_OVERLOAD", "Three_phase_monitor_fault", "High_pressure_fault",
  "Ambient_temp_lower_than_set_temp", "Ambient_temp_over_50C",
  "COMP_MODULE_FEEDBACK_ERROR_Si_I1", "Low_pressure_1_fault", "COMP_FBK_ERROR", "Low_pressure_2_fault",
  "Ambient_temp_over_47C",
  "Condenser_fan_2_TOP_fault", "Condenser_fan_3_TOP_fault", "Condenser_fan_4_TOP_fault",
  "Condenser_fan_2_circuit_breaker_fault", "Condenser_fan_3_circuit_breaker_fault", "Condenser_fan_4_circuit_breaker_fault",
  "Condenser_fan_5_TOP_fault", "Condenser_fan_6_TOP_fault",
  "Condenser_fan_5_circuit_breaker_fault", "Condenser_fan_6_circuit_breaker_fault",
  "Condenser_fan_1_circuit_breaker_fault", "Condenser_fan_1_TOP_fault",
  "Ambient_air_sensor_1_short_circuit", "Ambient_air_sensor_2_open", "Ambient_air_sensor_2_short_circuit",
  "Cold_air_sensor_1_open", "Cold_air_sensor_1_short_circuit", "Cold_air_sensor_2_open", "Cold_air_sensor_2_short_circuit",
  "Air_outlet_sensor_1_open", "Air_outlet_sensor_1_short_circuit", "Air_outlet_sensor_2_open", "Air_outlet_sensor_2_short_circuit",
];
const PREFERRED_NUMERIC_SET = new Set(PREFERRED_NUMERIC_ORDER);

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

// Bigger chunks = fewer DB round trips = faster
const CHUNK_SIZE = 50000;

// Cache: pre-compute fault keys per table to avoid re-checking every row
const _faultKeyCache = new Map<string, string[]>();

function getFaultKeysForRow(keys: string[]): string[] {
  const cacheKey = keys.join(",");
  let cached = _faultKeyCache.get(cacheKey);
  if (cached) return cached;
  cached = keys.filter((k) => {
    const low = k.toLowerCase();
    return FAULT_PATTERNS.some((p) => low.includes(p));
  });
  _faultKeyCache.set(cacheKey, cached);
  return cached;
}

// Cache timestamp column per table
const _tsColCache = new Map<string, 'created_at' | 'created_on'>();

function detectTimestampColumn(row: any): 'created_at' | 'created_on' {
  if (row && 'created_on' in row && !('created_at' in row)) return 'created_on';
  return 'created_at';
}

async function getTimestampColumn(table: string): Promise<'created_at' | 'created_on'> {
  const cached = _tsColCache.get(table);
  if (cached) return cached;
  try {
    // Fetch a single row to detect timestamp column
    const result = await backendJson(`/api/table?table=${encodeURIComponent(table)}`);
    const col = detectTimestampColumn(result.data);
    _tsColCache.set(table, col);
    return col;
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
    table === "GTPL_148_GT_450T_S7_1200" ||
    table === "GTPL_136_GT_450AP_S7_1200" ||
    table === "GTPL_137_GT_450T_S7_1200" ||
    table === "GTPL_138_GT_450T_S7_1200" ||
    table === "GTPL_142_GT_450AP_S7_1200" ||
    table === "GTPL_123_GT_450AP_S7_1200" ||
    table === "GTPL_143_GT_450AP_S7_1200";
}

// Fast chunked processing — single pass, cached fault keys, Set lookups
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
  let faultKeys: string[] | null = null; // computed once from first chunk's keys
  const numericSetForRow = new Set<string>(); // reusable set

  while (offset < effectiveLimit) {
    const currentChunkSize = Math.min(CHUNK_SIZE, effectiveLimit - offset);
    const chunkPage = Math.floor(offset / currentChunkSize) + 1;

    const chunkParams = new URLSearchParams({
      table,
      page: String(chunkPage),
      limit: String(currentChunkSize),
    });
    if (params.length >= 1 && params[0]) chunkParams.set("from", String(params[0]));
    if (params.length >= 2 && params[1]) chunkParams.set("to", String(params[1]));

    const chunkResult = await backendJson(`/api/all700data/paginatedSmart200?${chunkParams.toString()}`);
    const chunkRows = Array.isArray(chunkResult.data) ? chunkResult.data : [];

    if (chunkRows.length === 0) break;

    const rows = chunkRows as any[];

    // Compute fault keys once from first row's keys
    if (faultKeys === null && rows.length > 0) {
      faultKeys = getFaultKeysForRow(Object.keys(rows[0]));
    }
    const fKeys = faultKeys!;

    // Single-pass: normalize + process each row in place
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];

      // Normalize values in place (avoid creating new object)
      for (const k of Object.keys(r)) {
        const v = r[k];
        if (v === null || v === undefined) r[k] = "";
        else if (v instanceof Date) r[k] = formatDateTimeExact(v);
      }

      if (all || isFullExport) {
        const tsVal = r[timestampCol] || r.created_at || r.created_on;
        const { full, date, time } = normalizeCreatedAt(tsVal);
        const base: Record<string, any> = {
          id: r.id,
          created_at: full,
          created_at_date: date,
          created_at_time: time,
        };

        if (isFullExport) {
          for (const k of Object.keys(r)) {
            if (k === "id" || k === timestampCol) continue;
            const numValue = toNum(r[k]);
            base[k] = numValue !== "" ? numValue : r[k];
          }
        } else {
          // Use reusable Set for O(1) lookups instead of array.includes()
          numericSetForRow.clear();
          for (const k of Object.keys(r)) {
            if (k === "id" || k === "created_at" || k === "created_on") continue;
            if (toNum(r[k]) !== "") numericSetForRow.add(k);
          }

          // Preferred order first, then remaining
          for (const k of PREFERRED_NUMERIC_ORDER) {
            if (numericSetForRow.has(k) && k in r) base[k] = toNum(r[k]);
          }
          for (const k of numericSetForRow) {
            if (!PREFERRED_NUMERIC_SET.has(k) && k in r) base[k] = toNum(r[k]);
          }
        }

        // Faults — use pre-computed fault keys
        const faults: string[] = [];
        for (const k of fKeys) {
          if (isTrueish(r[k])) faults.push(k.replace(/_/g, " "));
        }
        base["Faults"] = faults.length > 0 ? faults.join(", ") : "";

        allProcessedRows.push(base);
      } else {
        const tsVal = r[timestampCol] || r.created_at || r.created_on;
        const { full } = normalizeCreatedAt(tsVal);
        if (timestampCol === 'created_on' && r.created_on) {
          r.created_at = full;
          delete r.created_on;
        } else {
          r.created_at = full;
        }
        allProcessedRows.push(r);
      }
    }

    offset += currentChunkSize;
    if (offset % 100000 === 0) {
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
    const format = (searchParams.get("format") || "xlsx").toLowerCase();

    if (!table || !ALLOWED_TABLES.includes(table as any)) {
      return Response.json({ error: "Invalid or missing table name" }, { status: 400 });
    }

    if (!["xlsx", "csv"].includes(format)) {
      return Response.json({ error: "Invalid format. Use 'xlsx' or 'csv'" }, { status: 400 });
    }

    // Detect which timestamp column this table uses
    const timestampCol = await getTimestampColumn(table);
    console.log(`Table ${table} uses timestamp column: ${timestampCol}`);

    const params: any[] = [];
    const where: string[] = [];

    console.log('Date filters received:', { fromDate, toDate });

    // Use index-friendly comparisons (no DATE() wrapping = MySQL can use index)
    if (fromDate) {
      where.push(`\`${timestampCol}\` >= ?`);
      params.push(`${fromDate} 00:00:00`);
    }
    if (toDate) {
      where.push(`\`${timestampCol}\` <= ?`);
      params.push(`${toDate} 23:59:59`);
    }

    const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";

    console.log("Getting count...");
    console.log("Where clause:", whereSql);
    console.log("Parameters:", params);

    // Get total count from Go backend paginated endpoint
    const countParams = new URLSearchParams({ table, page: "1", limit: "1" });
    if (fromDate) countParams.set("from", `${fromDate} 00:00:00`);
    if (toDate) countParams.set("to", `${toDate} 23:59:59`);
    const countResult = await backendJson(`/api/all700data/paginatedSmart200?${countParams.toString()}`);
    const totalCount = countResult.total || 0;
    console.log(`Total matching records: ${totalCount}`);

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

    // ── Optimized path for machines 137/138 ──
    if (is137or138(table)) {
      console.log(`Using optimized 137/138 export for ${table}`);

      // Use SELECT * and filter columns in code (safe — avoids unknown column errors)
      const allRawRows: any[] = [];
      let offset = 0;

      while (offset < effectiveLimit) {
        const currentChunkSize = Math.min(CHUNK_SIZE, effectiveLimit - offset);
        const chunkPage = Math.floor(offset / currentChunkSize) + 1;
        const chunkParams = new URLSearchParams({
          table, page: String(chunkPage), limit: String(currentChunkSize),
        });
        if (fromDate) chunkParams.set("from", `${fromDate} 00:00:00`);
        if (toDate) chunkParams.set("to", `${toDate} 23:59:59`);

        const chunkResult = await backendJson(`/api/all700data/paginatedSmart200?${chunkParams.toString()}`);
        const chunkRows = Array.isArray(chunkResult.data) ? chunkResult.data : [];
        if (chunkRows.length === 0) break;

        // Normalize dates in chunk
        for (const r of chunkRows as any[]) {
          for (const [k, v] of Object.entries(r)) {
            if (v instanceof Date) (r as any)[k] = formatDateTimeExact(v as Date);
            else if (v === null || v === undefined) (r as any)[k] = "";
          }
        }
        allRawRows.push(...chunkRows);
        offset += currentChunkSize;
      }

      // ── CSV Export for 137/138 ──
      if (format === "csv") {
        console.log(`Creating CSV with ${allRawRows.length} rows for ${table}...`);

        const csvBuffer = XLSX.utils.sheet_to_csv(
          XLSX.utils.json_to_sheet(allRawRows)
        );

        const recordCount = allRawRows.length;
        const dateRange = hasDateFilter ? `_${fromDate || 'start'}_to_${toDate || 'end'}` : '';
        const filename = `${table}${dateRange}_${new Date().toISOString().slice(0, 10)}_${recordCount}records.csv`;

        console.log(`CSV Export complete: ${filename}`);

        return new Response(csvBuffer, {
          status: 200,
          headers: {
            "Content-Type": "text/csv;charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Expose-Headers": "Content-Disposition",
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }

      console.log(`Building lightweight Excel with ${allRawRows.length} rows for ${table}...`);
      const buffer = build137_138Excel(allRawRows, timestampCol);

      const recordCount = allRawRows.length;
      const dateRange = hasDateFilter ? `_${fromDate || 'start'}_to_${toDate || 'end'}` : '';
      const filename = `${table}${dateRange}_${new Date().toISOString().slice(0, 10)}_${recordCount}records.xlsx`;

      console.log(`Export complete: ${filename}`);

      return new Response(new Uint8Array(buffer), {
        status: 200,
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": String(buffer.length),
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Expose-Headers": "Content-Disposition",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    // ── CSV Export (lightweight, no memory issues) ──
    if (format === "csv") {
      console.log(`Using CSV export for ${table}`);

      const allRawRows: any[] = [];
      let offset = 0;

      while (offset < effectiveLimit) {
        const currentChunkSize = Math.min(CHUNK_SIZE, effectiveLimit - offset);
        const chunkPage = Math.floor(offset / currentChunkSize) + 1;
        const csvChunkParams = new URLSearchParams({
          table, page: String(chunkPage), limit: String(currentChunkSize),
        });
        if (fromDate) csvChunkParams.set("from", `${fromDate} 00:00:00`);
        if (toDate) csvChunkParams.set("to", `${toDate} 23:59:59`);

        const chunkResult = await backendJson(`/api/all700data/paginatedSmart200?${csvChunkParams.toString()}`);
        const chunkRows = Array.isArray(chunkResult.data) ? chunkResult.data : [];
        if (chunkRows.length === 0) break;

        for (const r of chunkRows as any[]) {
          for (const [k, v] of Object.entries(r)) {
            if (v instanceof Date) (r as any)[k] = formatDateTimeExact(v as Date);
            else if (v === null || v === undefined) (r as any)[k] = "";
          }
        }
        allRawRows.push(...chunkRows);
        offset += currentChunkSize;
      }

      console.log(`Creating CSV with ${allRawRows.length} rows...`);

      const csvBuffer = XLSX.utils.sheet_to_csv(
        XLSX.utils.json_to_sheet(allRawRows)
      );

      const recordCount = allRawRows.length;
      const dateRange = hasDateFilter ? `_${fromDate || 'start'}_to_${toDate || 'end'}` : '';
      const filename = `${table}${dateRange}_${new Date().toISOString().slice(0, 10)}_${recordCount}records.csv`;

      console.log(`CSV Export complete: ${filename}`);

      return new Response(csvBuffer, {
        status: 200,
        headers: {
          "Content-Type": "text/csv;charset=utf-8",
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Expose-Headers": "Content-Disposition",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    // ── Standard path for other machines ──
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
        error: err.message || "Internal error during Excel export",
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