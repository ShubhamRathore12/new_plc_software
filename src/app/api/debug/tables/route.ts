import { backendJson } from "@/lib/backendApi";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Use Go backend health check to verify connectivity
    const health = await backendJson("/api/health");

    // Get machine status to see all available tables
    const machineStatus = await backendJson("/api/machine/status-public");

    const tables = Array.isArray(machineStatus.data)
      ? machineStatus.data.map((m: any) => ({
          table: m.tableName,
          machineName: m.machineName,
          hasData: true,
          lastUpdate: m.lastUpdate,
        }))
      : [];

    return NextResponse.json({
      success: true,
      totalTables: tables.length,
      backendHealth: health,
      tables,
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
