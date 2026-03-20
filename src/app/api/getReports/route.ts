import { pool } from "@/lib/db";
import { ALL_TABLE_NAMES } from "@/lib/machineRegistry";

const ALLOWED_TABLES = ALL_TABLE_NAMES;

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

    // If NO date filter -> hardcode limit to 100, allow ?page (defaults to 1)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = hasDateFilter ? undefined : 100; // hardcoded 100 when no dates
    const offset = hasDateFilter ? undefined : (page - 1) * (limit as number);

    // Build WHERE
    const whereClauses: string[] = [];
    const params: any[] = [];
    if (fromDate) {
      whereClauses.push("created_at >= ?");
      params.push(fromDate);
    }
    if (toDate) {
      whereClauses.push("created_at <= ?");
      params.push(toDate);
    }
    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Total count (for pagination UI)
    // - When date filter: count the filtered set
    // - When no date filter: count entire table
    const countSql = `SELECT COUNT(*) AS total FROM \`${table}\` ${whereSql}`;
    const [countRows]: any = await pool.query(countSql, params);
    const total = Array.isArray(countRows) && countRows[0]?.total ? Number(countRows[0].total) : 0;

    // Data query
    let dataSql = `SELECT * FROM \`${table}\` ${whereSql} ORDER BY id DESC`;
    const dataParams = [...params];

    if (!hasDateFilter) {
      // Hardcode 100 rows when no date range
      dataSql += ` LIMIT ? OFFSET ?`;
      dataParams.push(limit, offset);
    }
    const [rows] = await pool.query(dataSql, dataParams);

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
      page: hasDateFilter ? 1 : page,
      limit: hasDateFilter ? total : (limit as number),
      total,
      table,
      timestampColumn: "created_at",
      dateFilter: {
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
        applied: hasDateFilter,
      },
    });
  } catch (err: any) {
    // Table doesn't exist yet — return empty data instead of 500
    if (err?.errno === 1146) {
      return Response.json({ data: [], page: 1, limit: 0, total: 0, table: new URL(req.url).searchParams.get("table") });
    }
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
