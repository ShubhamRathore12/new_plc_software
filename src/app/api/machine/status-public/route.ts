import { NextResponse } from "next/server";
import { backendJson } from "@/lib/backendApi";

export async function GET() {
  try {
    const result = await backendJson("/api/machine/status-public");

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Error fetching machine statuses:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching machine statuses",
        error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
