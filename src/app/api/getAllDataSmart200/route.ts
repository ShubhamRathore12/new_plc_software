import { pool } from "@/lib/db";
import * as XLSX from "xlsx";
export const runtime = 'nodejs';
export const maxDuration = 300; 
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
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return Response.json({ error: "Invalid or missing table name" }, { status: 400 });
    }

    // Base query
    let query = `SELECT * FROM \`${table}\``;
    const params: any[] = [];

    // Date filter if provided
    if (fromDate || toDate) {
      const conditions: string[] = [];
      if (fromDate) {
        conditions.push(`created_at >= ?`);
        params.push(fromDate);
      }
      if (toDate) {
        conditions.push(`created_at <= ?`);
        params.push(toDate);
      }
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    query += " ORDER BY id DESC";

    // Fetch data
    const [rows] = await pool.query(query, params);

    if (!Array.isArray(rows) || rows.length === 0) {
      return Response.json({ error: "No records found" }, { status: 404 });
    }

    // Convert data to Excel
    const processed = rows.map((row: any) => {
      const obj: any = {};
      for (const [k, v] of Object.entries(row)) {
        if (v === null || v === undefined) obj[k] = "";
        else if (v instanceof Date) obj[k] = v.toISOString().slice(0, 19).replace("T", " ");
        else obj[k] = String(v);
      }
      return obj;
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(processed);
    XLSX.utils.book_append_sheet(wb, ws, "Data");

    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
    const filename = `${table}_${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new Response(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return Response.json({ error: err.message || "Internal error" }, { status: 500 });
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
