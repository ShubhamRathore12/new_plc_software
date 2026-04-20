import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "auth_token";

export type JWTPayload = {
  userId: number;
  username: string;
  accountType: string;
};

/** Sign a token and return it */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
}

/** Verify a token — returns payload or null */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/** Use inside any API route to get the current user.
 *  Returns the payload or sends a 401 and returns null. */
export function verifyAuth(
  req: NextRequest
): { payload: JWTPayload } | NextResponse {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json(
      { message: "Session expired. Please log in again." },
      { status: 401 }
    );
  }

  return { payload };
}

/** Attach JWT cookie to any NextResponse */
export function setAuthCookie(res: NextResponse, token: string): void {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60, // 15 minutes
    path: "/",       // available to ALL routes
  });
}

/** Clear the auth cookie (logout) */
export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
}

/** Client-side login function */
export async function loginUser(username: string, password: string) {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  return res.json();
}