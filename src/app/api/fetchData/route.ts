
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const allowedTables = new Set([
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
  "GTPL_132_GT300AP",
  "GTPL_137_GT_450T_S7_1200",
  "GTPL_138_GT_450T_S7_1200",
  "GTPL_136_GT_450AP_S7_1200",
  "GTPL_134_GT_450T_S7_1200",
  "GTPL_135_GT_450T_S7_1200",

  "GTPL_061_GT_450T_S7_1200"
]);

export async function GET(req: NextRequest) {
  try {
    const table = req.nextUrl.searchParams.get("table");

    if (!table || !allowedTables.has(table)) {
      return NextResponse.json({ error: "Invalid or missing table name" }, { status: 400 });
    }

    const [rows]: any[] = await pool.query(
      `SELECT * FROM \`${table}\` ORDER BY id DESC LIMIT 1`
    );

    return NextResponse.json({ table, data: rows?.[0] || null }, { status: 200 });
  } catch (err: any) {
    console.error("DB fetch error:", err?.message || err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
