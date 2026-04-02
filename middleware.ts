// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const PUBLIC_PATHS = ["/", "/login", "/signup", "/about", "/api"];

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get("auth_token")?.value;
//   const { pathname } = request.nextUrl;

//   const isPublic = PUBLIC_PATHS.some(
//     (publicPath) =>
//       pathname === publicPath || pathname.startsWith(`${publicPath}/`)
//   );

//   if (isPublic) {
//     return NextResponse.next();
//   }

//   if (!token) {
//     const loginUrl = request.nextUrl.clone();
//     loginUrl.pathname = "/login";
//     return NextResponse.redirect(loginUrl);
//   }
//   return NextResponse.next();
// }


import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that DON'T require authentication
const PUBLIC_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/login",
  "/register",
  '/api/login'
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes through
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Only guard /api/* and /dashboard/* routes
  const isProtected =
    pathname.startsWith("/api/") || pathname.startsWith("/dashboard");

  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("auth_token")?.value;
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    // API routes → 401 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    // Page routes → redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Inject user info into request headers for downstream API routes
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", String(payload.userId));
  requestHeaders.set("x-username", payload.username);
  requestHeaders.set("x-account-type", payload.accountType);

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Protect dashboard routes
    "/dashboard/:path*",
    // Protect API routes EXCEPT login and logout
    "/api/:path*",
  ],
};