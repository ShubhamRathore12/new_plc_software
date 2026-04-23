import { backendJson } from "@/lib/backendApi";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tableName = searchParams.get("table") || "gtpl_122_s7_1200_01";

    console.log(`Testing table: ${tableName}`);

    // Fetch latest record from Go backend
    const result = await backendJson(`/api/table?table=${encodeURIComponent(tableName)}`);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error || `Failed to fetch from table '${tableName}'`,
      });
    }

    const latestRecord = result.data;

    return NextResponse.json({
      success: true,
      table: tableName,
      exists: true,
      hasData: !!latestRecord,
      latestRecord: latestRecord ? {
        id: latestRecord.id,
        created_at: latestRecord.created_at,
        created_on: latestRecord.created_on,
        sampleFields: Object.keys(latestRecord).slice(0, 10),
      } : null,
    });
  } catch (err: any) {
    console.error("Debug error:", err);
    return NextResponse.json(
      {
        success: false,
        error: err.message,
      },
      { status: 500 }
    );
  }
}
