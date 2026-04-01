import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Get all tables in the database
    const tables: any = await query(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = DATABASE()"
    );

    const tableNames = tables.map((t: any) => t.TABLE_NAME);
    console.log("📋 Available tables:", tableNames);

    // For each table, get row count
    const tableStats = await Promise.all(
      tableNames.map(async (tableName: string) => {
        try {
          const countResult: any = await query(
            `SELECT COUNT(*) as cnt FROM \`${tableName}\` LIMIT 1`
          );
          const count = countResult[0]?.cnt || 0;
          
          // Get latest record
          let latestRecord = null;
          if (count > 0) {
            const latest: any = await query(
              `SELECT * FROM \`${tableName}\` ORDER BY id DESC LIMIT 1`
            );
            latestRecord = latest[0] || null;
          }
          
          return {
            table: tableName,
            rowCount: count,
            hasData: count > 0,
            latestRecord: latestRecord ? { id: latestRecord.id, created_at: latestRecord.created_at || latestRecord.created_on } : null,
          };
        } catch (err: any) {
          return {
            table: tableName,
            error: err.message,
          };
        }
      })
    );

    return NextResponse.json({
      success: true,
      totalTables: tableNames.length,
      tables: tableStats,
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
