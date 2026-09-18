import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { api } from "@/lib/apiClient";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "auth_token";

/** Matches the backend's ACCESS_TOKEN_TTL (default 30 minutes). Expiry is a
 *  routine path now, not an error: it surfaces as a 401 and routes to login. */
export const ACCESS_TOKEN_TTL_SECONDS = 30 * 60;

export type JWTPayload = {
  userId: number;
  username: string;
  accountType: string;
};

/** Sign a token and return it */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL_SECONDS });
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
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
    path: "/",       // available to ALL routes
  });
}

/** Clear the auth cookie (logout) */
export function clearAuthCookie(res: NextResponse): void {
  res.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
}

/** Client-side login. The session lives in HttpOnly cookies — the token is
 *  handed to the first-party cookie route and never kept in JS storage. */
export async function loginUser(username: string, password: string) {
  // A 401 here means "wrong credentials", not "session expired", so the
  // automatic redirect is skipped.
  const res = await api("/api/login", {
    method: "POST",
    skipAuthRedirect: true,
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Establish the first-party cookie so page routes can be gated server-side
  // (middleware cannot see the backend's cross-site cookie).
  if (data.token) {
    await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: data.token }),
    }).catch(() => {
      /* page gating degrades to the session check; login still succeeded */
    });
  }

  return data;
}

/**
 * Rotate the password. All sessions are revoked and the cookie cleared by the
 * server, so the caller must send the user back to login afterwards.
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  const res = await api("/api/auth/change-password", {
    method: "POST",
    skipAuthRedirect: true,
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Could not change the password");
  }

  // The first-party cookie has to go too, or the page gate would keep letting
  // this browser through with a revoked session.
  await fetch("/api/session", { method: "DELETE" }).catch(() => {});

  return data;
}
