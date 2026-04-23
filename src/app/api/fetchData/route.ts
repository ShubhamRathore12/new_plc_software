import { NextRequest, NextResponse } from "next/server";
import { backendJson } from "@/lib/backendApi";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(req: NextRequest) {
  try {
    const table = req.nextUrl.searchParams.get("table");

    if (!table) {
      return NextResponse.json({ error: "Invalid or missing table name" }, { status: 400 });
    }

    const result = await backendJson(`/api/table?table=${encodeURIComponent(table)}`);

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to fetch data" }, { status: 400 });
    }

    return NextResponse.json({ table, data: result.data || null }, { status: 200 });
  } catch (err: any) {
    console.error("fetchData error:", err?.message || err);
    return NextResponse.json({ error: "Backend API error" }, { status: 500 });
  }
}
