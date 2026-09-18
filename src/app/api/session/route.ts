import { NextResponse } from "next/server";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth";

/**
 * Establishes the first-party session cookie after a successful login against
 * the control backend.
 *
 * The backend's own cookie is set on its domain and is not visible to this
 * app's middleware, so page-level gating needs a cookie of its own. The token
 * is handed over once, here, and written straight into an HttpOnly cookie — it
 * is never stored in localStorage, where any XSS on the page could read it.
 */
export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ message: "Token required" }, { status: 400 });
    }

    const response = NextResponse.json({ success: true });
    setAuthCookie(response, token);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

/** Drops the first-party cookie — called as part of the logout sequence. */
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  clearAuthCookie(response);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
