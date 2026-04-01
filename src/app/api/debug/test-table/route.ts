import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const tableName = searchParams.get("table") || "gtpl_122_s7_1200_01";

    console.log(`🔍 Testing table: ${tableName}`);

    // Test 1: Check if table exists
    const tableExists: any = await query(
      `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
      [tableName]
    );

    if (!tableExists || tableExists.length === 0) {
      return NextResponse.json({
        success: false,
        error: `Table '${tableName}' does not exist`,
        availableTables: await getAvailableTables(),
      });
    }

    // Test 2: Get row count
    const countResult: any = await query(
      `SELECT COUNT(*) as cnt FROM \`${tableName}\``
    );
    const rowCount = countResult[0]?.cnt || 0;

    // Test 3: Get latest record
    let latestRecord = null;
    if (rowCount > 0) {
      const latest: any = await query(
        `SELECT * FROM \`${tableName}\` ORDER BY id DESC LIMIT 1`
      );
      latestRecord = latest[0] || null;
    }

    // Test 4: Get column info
    const columns: any = await query(
      `SHOW COLUMNS FROM \`${tableName}\``
    );

    return NextResponse.json({
      success: true,
      table: tableName,
      exists: true,
      rowCount,
      hasData: rowCount > 0,
      columns: columns.map((c: any) => ({
        name: c.Field,
        type: c.Type,
        nullable: c.Null,
      })),
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

async function getAvailableTables() {
  try {
    const tables: any = await query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()"
    );
    return tables.map((t: any) => t.TABLE_NAME);
  } catch {
    return [];
  }
}
