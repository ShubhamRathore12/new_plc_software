
import { pool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ALL_TABLE_NAMES_SET } from "@/lib/machineRegistry";

const allowedTables = ALL_TABLE_NAMES_SET;

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
    // Table doesn't exist yet in the database — return empty data instead of 500
    if (err?.errno === 1146) {
      return NextResponse.json({ table: req.nextUrl.searchParams.get("table"), data: null }, { status: 200 });
    }
    console.error("DB fetch error:", err?.message || err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
