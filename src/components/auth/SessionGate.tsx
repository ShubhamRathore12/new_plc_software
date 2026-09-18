"use client";

import { usePathname } from "next/navigation";
import { Loader2, WifiOff } from "lucide-react";
import { isPublicRoute, useSession } from "@/providers/session-provider";

/**
 * Renders protected content only after `GET /api/auth/session` has confirmed a
 * session. Nothing below this is painted from cached or placeholder data — a
 * rendered shell behind a client-side redirect is what made a direct chiller
 * URL appear to work (S-01).
 */
export default function SessionGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "/";
  const { status, error } = useSession();

  if (isPublicRoute(pathname)) return <>{children}</>;

  if (status === "authenticated") return <>{children}</>;

  if (status === "loading") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex min-h-screen flex-col items-center justify-center gap-3"
      >
        <Loader2 className="text-primary h-6 w-6 animate-spin" />
        <p className="text-muted-foreground text-sm">Checking your session…</p>
      </div>
    );
  }

  // Anonymous: the provider is routing to /login. Show why if the reason was a
  // transport failure rather than a signed-out session.
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center"
    >
      {error ? (
        <>
          <WifiOff className="text-muted-foreground h-8 w-8" />
          <p className="text-sm font-medium">Cannot reach the server</p>
          <p className="text-muted-foreground max-w-sm text-xs">{error}</p>
        </>
      ) : (
        <Loader2 className="text-primary h-6 w-6 animate-spin" />
      )}
    </div>
  );
}
