// import { NextResponse } from "next/server";
// import { query, ensureUserTableExists } from "@/lib/db";
// import jwt from "jsonwebtoken";

// // Secret key to sign JWT
// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Keep secret in env

// type User = {
//   accountType: string;
//   firstName: string;
//   lastName: string;
//   username: string;
//   email: string;
//   phoneNumber: string;
//   company: string;
//   password: string;
//   monitorAccess: string;
// };

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { username, password } = body;

//     await ensureUserTableExists();

//     const rows = await query<any>(
//       `SELECT * FROM kabu_users WHERE username = ? AND password = ?`,
//       [username, password]
//     );

//     if (!rows || rows.length === 0) {
//       return NextResponse.json(
//         { message: "Invalid username or password" },
//         { status: 401 }
//       );
//     }

//     const user = rows[0];

//     // Generate JWT token valid for 15 minutes
//     const token = jwt.sign(
//       {
//         username: user.username,
//         accountType: user.accountType,
//         userId: user.id, // optional, if you have an ID field
//       },
//       JWT_SECRET,
//       { expiresIn: "15m" }
//     );

//     // Set JWT in HTTP-only cookie
//     const response = NextResponse.json({
//       message: "Login successful",
//       user: {
//         ...user,
//         password: undefined, // remove password
//       },
//     });

//     response.cookies.set("auth_token", token, {
//       httpOnly: true,
//       // secure: process.env.NODE_ENV === "production", // true in production
//       sameSite: "lax",
//       maxAge: 15 * 60, // 15 minutes in seconds
//       path: "/dashboard",
//     });

//     return response;
//   } catch (error) {
//     console.error("Login error:", error);
//     return NextResponse.json(
//       { message: "Server error while logging in" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { signToken, setAuthCookie, type JWTPayload } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "Username and password are required" },
        { status: 400 }
      );
    }

    const rows = await query<{
      id: number;
      username: string;
      password: string;
      accountType: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      company: string;
      monitorAccess: string;
    }>(
      `SELECT id, username, password, accountType, firstName, lastName,
              email, phoneNumber, company, monitorAccess
       FROM kabu_users
       WHERE username = ?
       LIMIT 1`,
      [username]
    );

    if (!rows?.length) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const user = rows[0];

    // Plain text password comparison (no bcrypt)
    if (password !== user.password) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    const jwtPayload: JWTPayload = {
      userId: user.id,
      username: user.username,
      accountType: user.accountType,
    };

    const token = signToken(jwtPayload);

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        accountType: user.accountType,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        company: user.company,
        monitorAccess: user.monitorAccess,
      },
    });

    setAuthCookie(response, token);

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