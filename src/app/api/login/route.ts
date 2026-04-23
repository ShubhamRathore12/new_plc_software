import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/backendApi";
import { setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const backendRes = await backendFetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || "Invalid username or password" },
        { status: backendRes.status }
      );
    }

    // Build the frontend response with user data from Go backend
    const response = NextResponse.json({
      message: data.message || "Login successful",
      user: data.user,
    });

    // Set auth cookie using the token from Go backend
    if (data.token) {
      setAuthCookie(response, data.token);
    }

    return response;
  } catch (error) {
    console.error("Login error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Server error while logging in", error: errorMessage },
      { status: 500 }
    );
  }
}
