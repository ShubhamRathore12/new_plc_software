import { backendJson } from "@/lib/backendApi";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await backendJson("/api/alldata/alldata");

    return NextResponse.json({ users: result.data || result });
  } catch (error: any) {
    console.error("GET error:", error?.message || error);
    return NextResponse.json(
      { message: "Failed to fetch data", error: error.message },
      { status: 500 }
    );
  }
}
