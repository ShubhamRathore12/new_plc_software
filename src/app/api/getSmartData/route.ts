import { NextResponse } from "next/server";
import { backendJson } from "@/lib/backendApi";

export async function GET() {
  try {
    const result = await backendJson("/api/table?table=GTPL_118_GT_60T_S7_1200");

    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to fetch data" }, { status: 500 });
    }

    return NextResponse.json(result.data ? [result.data] : [], { status: 200 });
  } catch (err: any) {
    console.error("DB fetch error:", err?.message || err);
    return NextResponse.json({ error: "Backend API error" }, { status: 500 });
  }
}
