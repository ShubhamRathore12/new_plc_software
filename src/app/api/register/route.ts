import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendApi";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const backendRes = await backendFetch("/api/register", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    return NextResponse.json(
      { message: data.message || (backendRes.ok ? "User registered successfully" : "Registration failed") },
      { status: backendRes.status }
    );
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "Server error occurred." },
      { status: 500 }
    );
  }
}
