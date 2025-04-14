import { NextResponse } from "next/server";
import { pool, ensureUserTableExists } from "@/lib/db";
import jwt from "jsonwebtoken";

// Secret key to sign JWT
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Keep secret in env

type User = {
  accountType: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  company: string;
  password: string;
  monitorAccess: string;
};

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  try {
    await ensureUserTableExists();

    const [rows] = await pool.query<any>(
      `SELECT * FROM kabu_users WHERE username = ? AND password = ?`,
      [username, password]
    );

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Generate JWT token valid for 15 minutes
    const token = jwt.sign(
      {
        username: user.username,
        accountType: user.accountType,
        userId: user.id, // optional, if you have an ID field
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Set JWT in HTTP-only cookie
    const response = NextResponse.json({
      message: "Login successful",
      user: {
        ...user,
        password: undefined, // remove password
      },
    });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "lax",
      maxAge: 15 * 60, // 15 minutes in seconds
      path: "/dashboard",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Server error while logging in" },
      { status: 500 }
    );
  }
}
