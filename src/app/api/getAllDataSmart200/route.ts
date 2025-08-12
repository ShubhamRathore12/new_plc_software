// app/api/export/route.ts
import { pool } from "@/lib/db";
import * as XLSX from "xlsx";
import type { RowDataPacket } from "mysql2";

// Avoid cached/empty files in Next.js
export const dynamic = "force-dynamic";
export const revalidate = 0;
// Let this route run longer on Vercel (up to 60s on Pro/Team plans)
export const maxDuration = 60;

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
  AHT_vale_speed: "AHT Valve Speed (%)", // legacy spelling
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

/** Format a Date object into "YYYY-MM-DD HH:mm:ss" in Asia/Kolkata. */
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

/** Normalize created_at: keep strings as-is; convert Dates to IST string. */
function normalizeCreatedAt(raw: any): { full: string; date: string; time: string } {
  if (raw instanceof Date) {
    const s = formatInIST(raw);
    const [d, t] = s.split(" ");
    return { full: s, date: d, time: t ?? "" };
  }
  if (typeof raw === "string" && raw) {
    // Keep exact DB string (avoid timezone shift), trim to "YYYY-MM-DD HH:mm:ss"
    const s = raw.replace("T", " ").slice(0, 19);
    const [d, t] = s.split(" ");
    return { full: s, date: d ?? "", time: t ?? "" };
  }
  return { full: "", date: "", time: "" };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    // Pretty export by default; pass all=false for raw dump
    const all = searchParams.get("all") !== "false";
    // If filters return 0 rows, fallback to latest N rows automatically
    const FALLBACK_LIMIT = Number(searchParams.get("fallbackLimit") || 500);
    // Hard cap to prevent huge exports (can be overridden via ?limit=)
    const LIMIT = Number(searchParams.get("limit") || 5000);

    if (!table || !ALLOWED_TABLES.includes(table as any)) {
      return Response.json({ error: "Invalid or missing table name" }, { status: 400 });
    }

    // Build WHERE once; use for COUNT(*) and SELECT
    const params: any[] = [];
    const where: string[] = [];
    if (fromDate) {
      where.push(`created_at >= CONCAT(?, ' 00:00:00')`);
      params.push(fromDate);
    }
    if (toDate) {
      where.push(`created_at < DATE_ADD(CONCAT(?, ' 00:00:00'), INTERVAL 1 DAY)`);
      params.push(toDate);
    }

    const whereSql = where.length ? ` WHERE ${where.join(" AND ")}` : "";

    // COUNT first (fast if there's an index on created_at)
    const [countRows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt FROM \`${table}\`${whereSql}`,
      params
    );
    const cnt = (countRows[0] as { cnt: number }).cnt;

    // Main SELECT is always ordered + limited to keep execution predictable
    const [rowsRaw] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM \`${table}\`${whereSql} ORDER BY id DESC LIMIT ?`,
      [...params, LIMIT]
    );

    // Fallback to latest N if the filter returned nothing
    let rows: RowDataPacket[] = rowsRaw;
    let usedFallback = false;
    if (!Array.isArray(rows) || rows.length === 0) {
      const [fallbackRows] = await pool.query<RowDataPacket[]>(
        `SELECT * FROM \`${table}\` ORDER BY id DESC LIMIT ?`,
        [FALLBACK_LIMIT]
      );
      rows = fallbackRows;
      usedFallback = true;
    }

    // Normalize rows (convert nulls; leave other types)
    const normalized = Array.isArray(rows)
      ? (rows as any[]).map((r) => {
          const obj: Record<string, any> = {};
          for (const [k, v] of Object.entries(r)) {
            if (v === null || v === undefined) obj[k] = "";
            else obj[k] = v;
          }
          return obj;
        })
      : [];

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

    // Build note(s) to show in the sheet
    const limitedNote =
      cnt > LIMIT ? `Note: ${cnt} rows matched. Export limited to latest ${LIMIT} rows.` : undefined;

    const combinedNote = [
      usedFallback
        ? `Note: Your filters returned 0 rows. Showing latest ${FALLBACK_LIMIT} records instead.`
        : "",
      limitedNote || "",
    ]
      .filter(Boolean)
      .join("  ");

    if (all) {
      // Pretty mode (id, created_at (IST), Date, Time + ordered numeric + Faults)
      const prettyRows = normalized.map((r) => {
        const { full, date, time } = normalizeCreatedAt(r.created_at);

        const base: Record<string, any> = {
          id: (r as any).id ?? "",
          created_at: full,
          created_at_date: date,
          created_at_time: time,
        };

        const numericKeysInRow = Object.keys(r).filter((k) => {
          if (k === "id" || k === "created_at") return false;
          return toNum((r as any)[k]) !== "";
        });

        const ordered = [
          ...PREFERRED_NUMERIC_ORDER.filter((k) => numericKeysInRow.includes(k)),
          ...numericKeysInRow.filter((k) => !PREFERRED_NUMERIC_ORDER.includes(k)),
        ];

        ordered.forEach((k) => {
          if (k in r) base[k] = toNum((r as any)[k]);
        });

        const faults: string[] = [];
        for (const [k, v] of Object.entries(r)) {
          if (!looksLikeFaultKey(k)) continue;
          if (isTrueish(v)) faults.push(k.replace(/_/g, " "));
        }
        base["Faults"] = faults.join(", ");
        return base;
      });

      const fixed = ["id", "created_at", "created_at_date", "created_at_time"];
      const dynamic = normalized.length
        ? Array.from(
            new Set(
              prettyRows.flatMap((row) =>
                Object.keys(row).filter((k) => !fixed.includes(k) && k !== "Faults")
              )
            )
          )
        : [...PREFERRED_NUMERIC_ORDER];
      const headerKeys = [...fixed, ...dynamic, "Faults"];

      ws = XLSX.utils.json_to_sheet(
        prettyRows.length
          ? prettyRows
          : [Object.fromEntries(headerKeys.map((k) => [k, ""]))],
        { header: headerKeys }
      );
      finalizeSheet(ws, headerKeys, combinedNote || undefined);
    } else {
      // Raw dump, but ensure created_at is a stable IST/string (no timezone shifts)
      const rawRows = normalized.map((r) => {
        const { full } = normalizeCreatedAt((r as any).created_at);
        return { ...r, created_at: full };
      });

      if (rawRows.length) {
        ws = XLSX.utils.json_to_sheet(rawRows);
        const headerKeys = Object.keys(rawRows[0]);
        finalizeSheet(ws, headerKeys, combinedNote || undefined);
      } else {
        const headerKeys = ["id", "created_at"];
        ws = XLSX.utils.json_to_sheet(
          [Object.fromEntries(headerKeys.map((k) => [k, ""]))],
          { header: headerKeys }
        );
        finalizeSheet(ws, headerKeys, combinedNote || "No records for selected filters");
      }
    }

    XLSX.utils.book_append_sheet(wb, ws, "Data");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    const filename = `${searchParams.get("table")}_${new Date()
      .toISOString()
      .slice(0, 10)}.xlsx`;

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Content-Disposition",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message || "Internal error" },
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
