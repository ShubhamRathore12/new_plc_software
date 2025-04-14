import { ensureUserTableExists, pool } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Step 1: Ensure the table exists
    await ensureUserTableExists();

    // Step 2: Fetch all users from the database (including password)
    const [rows] = await pool.query<any>(`SELECT * FROM kabu_users`);

    // Step 3: Return everything directly
    return NextResponse.json({ users: rows });
  } catch (error: any) {
    console.error(
      "GET error:",
      JSON.stringify(error, Object.getOwnPropertyNames(error))
    );
    return NextResponse.json(
      { message: "Failed to fetch users", error: error.message },
      { status: 500 }
    );
  }
}
