import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

/**
 * Two different guards live here, because two different things are being
 * protected:
 *
 *  - This app's own `/api/*` handlers talk to the database directly, so they
 *    require a token that verifies against JWT_SECRET. Failure is a 401.
 *  - Page routes are gated on the presence of the session cookie so a protected
 *    page is never *shipped* to an anonymous visitor. The authoritative check is
 *    still `GET /api/auth/session` (see SessionProvider/SessionGate) plus the
 *    control backend's own enforcement on every data call — the cookie that
 *    backend sets lives on its own domain and cannot be verified here.
 */

/** Routes that render or respond without a session. */
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/registration-form",
  "/forgot-password",
  "/api/auth/login",
  "/api/auth/register",
  "/api/login",
  "/api/logout",
  "/api/session",
  "/api/register",
];

/** Paths that are never guarded (static assets, framework internals). */
const UNGUARDED_PREFIXES = ["/_next", "/favicon", "/images", "/locales", "/logo"];

const COOKIE_NAME = "auth_token";

function isPublic(pathname: string): boolean {
  if (pathname === "/") return true; // redirects to /login
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (UNGUARDED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  if (isPublic(pathname)) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;

  // ── This app's own API handlers: strict verification, JSON 401 ─────────────
  if (pathname.startsWith("/api/")) {
    const payload = token ? verifyToken(token) : null;
    if (!payload) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-user-id", String(payload.userId));
    requestHeaders.set("x-username", payload.username);
    requestHeaders.set("x-account-type", payload.accountType);

    const res = NextResponse.next({ request: { headers: requestHeaders } });
    // Authenticated responses must not be replayable from the bfcache or a
    // shared cache after logout (S-05).
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  }

  // ── Protected pages: no session cookie, no page ───────────────────────────
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = `?next=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(loginUrl);
  }

  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}

export const config = {
  matcher: [
    /*
     * Every route except Next internals and static files. Protected pages are
     * guarded here rather than only in the client, because a client-side
     * redirect still ships the page.
     */
    "/((?!_next/static|_next/image|favicon.ico|images|locales|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|glb|mp4)$).*)",
  ],
};
