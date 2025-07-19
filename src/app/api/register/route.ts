import { NextResponse } from "next/server";
import { pool, ensureUserTableExists } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    accountType,
    firstName,
    lastName,
    username,
    email,
    phoneNumber,
    company,
    password,
    monitorAccess,
    location, // Add location to the destructured properties
  } = body;

  try {
    await ensureUserTableExists();

    // Check for duplicate username
    const [existingUser] = await pool.query(
      "SELECT * FROM kabu_users WHERE username = ?",
      [username]
    );

    if (Array.isArray(existingUser) && existingUser.length > 0) {
      return NextResponse.json(
        { message: "Username already exists. Please choose another." },
        { status: 409 }
      );
    }

    const monitorAccessStr = Array.isArray(monitorAccess)
      ? monitorAccess.join(",")
      : "";

      const locationStr = Array.isArray(location) 
  ? location.join(",")
  : "";

    await pool.query(
      `INSERT INTO kabu_users 
       (accountType, firstName, lastName, username, email, phoneNumber, company, password, monitorAccess, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // Add location to the query
      [
        accountType,
        firstName,
        lastName,
        username,
        email,
        phoneNumber,
        company,
        password,
        monitorAccessStr,
        locationStr, // Add location to the values
      ]
    );

    return NextResponse.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "Server error occurred." },
      { status: 500 }
    );
  }
}