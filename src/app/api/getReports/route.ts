import { query } from "@/lib/db";

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
  'GTPL_144_GT_300AP_S7_1200',
  "GTPL_142_GT_450AP_S7_1200",
  "GTPL_123_GT_450AP_S7_1200",
  "GTPL_143_GT_450AP_S7_1200"
];

async function getTimestampColumn(table: string): Promise<'created_at' | 'created_on'> {
  try {
    const columns: any = await query(
      `SHOW COLUMNS FROM \`${table}\` WHERE Field IN ('created_at', 'created_on')`
    );
    if (Array.isArray(columns) && columns.length > 0) {
      const colName = columns[0].Field;
      return colName === 'created_on' ? 'created_on' : 'created_at';
    }
    return 'created_at';
  } catch (err) {
    console.error('Error detecting timestamp column:', err);
    return 'created_at';
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    if (!table || !ALLOWED_TABLES.includes(table)) {
      return Response.json({ error: "Invalid or missing table name" }, { status: 400 });
    }

    const hasDateFilter = !!(fromDate || toDate);

    // Detect which timestamp column this table uses
    const timestampCol = await getTimestampColumn(table);

    // Always paginate — 100 rows per page
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = 100;
    const offset = (page - 1) * limit;

    // Build WHERE — use index-friendly comparisons (no DATE() wrapper)
    const whereClauses: string[] = [];
    const params: any[] = [];
    if (fromDate) {
      whereClauses.push(`\`${timestampCol}\` >= ?`);
      params.push(`${fromDate} 00:00:00`);
    }
    if (toDate) {
      whereClauses.push(`\`${timestampCol}\` <= ?`);
      params.push(`${toDate} 23:59:59`);
    }
    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Total count (for pagination UI)
    const countSql = `SELECT COUNT(*) AS total FROM \`${table}\` ${whereSql}`;
    const countRows: any = await query(countSql, params);
    const total = Array.isArray(countRows) && countRows[0]?.total ? Number(countRows[0].total) : 0;

    // Data query — always paginated with LIMIT/OFFSET
    const dataSql = `SELECT * FROM \`${table}\` ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`;
    const dataParams = [...params, limit, offset];
    const rows = await query(dataSql, dataParams);

    // Normalize rows: Format dates exactly as stored, no timezone conversion, no "T"
    const data = (Array.isArray(rows) ? rows : []).map((row: any) => {
      const obj: Record<string, any> = {};
      for (const [k, v] of Object.entries(row)) {
        if (v === null || v === undefined) obj[k] = "";
        else if (v instanceof Date) {
          // Format as YYYY-MM-DD HH:mm:ss exactly without adding "T" or timezone shifts
          const year = v.getFullYear();
          const month = String(v.getMonth() + 1).padStart(2, "0");
          const day = String(v.getDate()).padStart(2, "0");
          const hours = String(v.getHours()).padStart(2, "0");
          const minutes = String(v.getMinutes()).padStart(2, "0");
          const seconds = String(v.getSeconds()).padStart(2, "0");
          obj[k] = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        } else {
          obj[k] = v;
        }
      }
      return obj;
    });

    return Response.json({
      data,
      page,
      limit,
      total,
      table,
      timestampColumn: timestampCol,
      dateFilter: {
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        applied: hasDateFilter,
      },
    });
  } catch (err: any) {
    return Response.json({ error: err?.message || "Internal error" }, { status: 500 });
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
