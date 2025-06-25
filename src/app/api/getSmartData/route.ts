import { pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows]: any[] = await pool.query(
      "SELECT * FROM kabomachinedatasmart200 ORDER BY id DESC LIMIT 1"
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    console.error("DB fetch error:", err?.message || err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
