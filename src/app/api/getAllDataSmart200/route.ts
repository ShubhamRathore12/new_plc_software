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
];

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const table = searchParams.get("table") || "kabomachinedatasmart200";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 100; // Fixed limit to 500
    const offset = (page - 1) * limit;

    if (!ALLOWED_TABLES.includes(table)) {
      return new Response(
        JSON.stringify({
          error: "Invalid table name",
          allowedTables: ALLOWED_TABLES,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const [countResult]: any = await pool.query(
      `SELECT COUNT(*) as total FROM \`${table}\``
    );
    const total = countResult[0]?.total || 0;

    const [rows]: any = await pool.query(
      `SELECT * FROM \`${table}\` ORDER BY id DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    const response = {
      table,
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    console.error("DB fetch error:", err?.message || err);
    return new Response(JSON.stringify({ error: "Database error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
