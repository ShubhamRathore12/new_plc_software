import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows: any[] = await query(
      "SELECT * FROM GTPL_118_GT_60T_S7_1200 ORDER BY id DESC LIMIT 1"
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    console.error("DB fetch error:", err?.message || err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
