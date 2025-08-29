import { pool } from "@/lib/db";

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
    const [countRows]:any = await pool.query(countSql, params);
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

    // Normalize rows (optional; keeps empty strings for nulls like your previous export)
    const data = (Array.isArray(rows) ? rows : []).map((row: any) => {
      const obj: Record<string, any> = {};
      for (const [k, v] of Object.entries(row)) {
        if (v === null || v === undefined) obj[k] = "";
        else if (v instanceof Date) {
          // Check if the table is for Germany machines or India machines
          const germanyTables = [
            "GTPL_108_gT_40E_P_S7_200_Germany",
            "GTPL_109_gT_40E_P_S7_200_Germany", 
            "GTPL_110_gT_40E_P_S7_200_Germany",
            "GTPL_111_gT_80E_P_S7_200_Germany",
            "GTPL_112_gT_80E_P_S7_200_Germany",
            "GTPL_113_gT_80E_P_S7_200_Germany",
            "GTPL_114_GT_140E_S7_1200",
            "GTPL_115_GT_180E_S7_1200",
            "GTPL_119_GT_180E_S7_1200",
            "GTPL_120_GT_180E_S7_1200",
            "GTPL_116_GT_240E_S7_1200",
            "GTPL_117_GT_320E_S7_1200",
            "GTPL_121_GT1000T",
            "GTPL_124_GT_450T_S7_1200",
            "GTPL_131_GT_650T_S7_1200",
            "GTPL_132_GT_650T_S7_1200"
          ];
          const isGermanyMachine = germanyTables.includes(table);
          
          if (isGermanyMachine) {
            // Convert to Germany time (3.5 hours behind India time)
            // India is UTC+5:30, so Germany is UTC+2:00 (5:30 - 3:30 = 2:00)
            const germanyTime = new Date(v.getTime() + (120 * 60000)); // add 2 hours (120 minutes)
            const germanyTimeString = germanyTime.toISOString().slice(0, 19).replace("T", " ");
            obj[k] = germanyTimeString;
          } else {
            // Convert to India time (IST: UTC+5:30)
            const indiaTime = new Date(v.getTime() + (330 * 60000)); // add 5.5 hours (330 minutes)
            const indiaTimeString = indiaTime.toISOString().slice(0, 19).replace("T", " ");
            obj[k] = indiaTimeString;
          }
        } else obj[k] = v;
      }
      return obj;
    });

    // Respond with JSON (200 even if empty so UI can show "No records")
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
