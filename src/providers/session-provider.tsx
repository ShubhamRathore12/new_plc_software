"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  API_BASE,
  registerSessionExpiredHandler,
} from "@/lib/apiClient";
import {
  fetchSession,
  sessionHasMachine,
  type Session,
  type SessionMachine,
  type SessionState,
} from "@/lib/session";
import { useDataStore } from "@/lib/store";

/** Routes that render without a session. Everything else is protected. */
const PUBLIC_PREFIXES = [
  "/login",
  "/register",
  "/registration-form",
  "/forgot-password",
];

/** Where a user with `mustChangePassword` is held until they rotate it. */
export const CHANGE_PASSWORD_ROUTE = "/profile/change-password";

export function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

type SessionContextValue = SessionState & {
  machines: SessionMachine[];
  /** Re-read `/api/auth/session`. */
  refresh: () => Promise<Session | null>;
  /** Full logout: revoke server-side, tear down live connections and state. */
  logout: (options?: { allSessions?: boolean }) => Promise<void>;
  /** True when the signed-in user may open this machine. */
  canAccessMachine: (machine: string | null | undefined) => boolean;
  /** Backend unreachable — distinct from "signed out". */
  error: string | null;
};

const SessionContext = createContext<SessionContextValue>({
  status: "loading",
  session: null,
  machines: [],
  refresh: async () => null,
  logout: async () => {},
  canAccessMachine: () => false,
  error: null,
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const queryClient = useQueryClient();
  const { clearData } = useDataStore() as {
    clearData: () => void;
  };

  const [state, setState] = useState<SessionState>({
    status: "loading",
    session: null,
  });
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef<Promise<Session | null> | null>(null);

  const refresh = useCallback(async (): Promise<Session | null> => {
    if (inFlight.current) return inFlight.current;

    const run = (async () => {
      try {
        // Read the payload straight out of the store, not from a ref updated
        // during render: login calls setData() and refresh() back to back in
        // one handler, so a render-synced copy is still the *previous* login
        // here. That stale copy kept sending a user who had just rotated an
        // admin-issued password back to the change-password screen.
        const session = await fetchSession(useDataStore.getState().data);
        setError(null);
        setState(
          session
            ? { status: "authenticated", session }
            : { status: "anonymous", session: null }
        );
        return session;
      } catch (err: any) {
        // Transport failure: do not sign an operator out over a dropped
        // connection — keep the current state and surface the problem.
        setError(err?.message || "Cannot reach the server");
        setState((prev) =>
          prev.status === "loading"
            ? { status: "anonymous", session: null }
            : prev
        );
        return null;
      } finally {
        inFlight.current = null;
      }
    })();

    inFlight.current = run;
    return run;
  }, []);

  /** Drop every trace of the signed-in user from this tab. */
  const clearClientState = useCallback(() => {
    queryClient.clear();
    clearData();
    setState({ status: "anonymous", session: null });
    try {
      localStorage.removeItem("data-storage");
      localStorage.removeItem("user-storage");
      sessionStorage.clear();
    } catch {
      /* storage can be unavailable — nothing else depends on it */
    }
  }, [queryClient, clearData]);

  const logout = useCallback(
    async ({ allSessions = false }: { allSessions?: boolean } = {}) => {
      // 1. Server-side revocation. Without this the token stays valid.
      try {
        await fetch(
          `${API_BASE}/api/auth/logout${allSessions ? "?all=true" : ""}`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch {
        /* revoke best-effort; local teardown still has to happen */
      }
      // Legacy same-origin session cookie set by this app's own API routes.
      try {
        await fetch("/api/logout", { method: "POST", credentials: "include" });
      } catch {
        /* ignore */
      }

      // 2. Close live connections — sockets and polls opened while
      //    authenticated stay open otherwise.
      window.dispatchEvent(new Event("app:session-ended"));

      // 3. Drop client state: stores, react-query cache, storage.
      clearClientState();

      // 4. Replace history so Back cannot return to a rendered protected page.
      router.replace("/login");
    },
    [clearClientState, router]
  );

  // A 401 from anywhere in the app lands here.
  useEffect(
    () =>
      registerSessionExpiredHandler(() => {
        window.dispatchEvent(new Event("app:session-ended"));
        clearClientState();
        router.replace("/login?expired=1");
      }),
    [clearClientState, router]
  );

  // Check the session on load and on every protected route entry.
  useEffect(() => {
    if (isPublicRoute(pathname)) {
      // Still resolve once so the login page knows whether to bounce forward.
      if (state.status === "loading") void refresh();
      return;
    }
    void refresh();
    // Re-checking per pathname is the point: a revoked session must not keep
    // rendering because the tab was already open.
  }, [pathname, refresh]); // eslint-disable-line react-hooks/exhaustive-deps

  // Anonymous on a protected route → login, with no protected paint first.
  useEffect(() => {
    if (state.status !== "anonymous") return;
    if (isPublicRoute(pathname)) return;
    router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [state.status, pathname, router]);

  // Admin-issued or legacy credential → hold the user on the rotation screen.
  useEffect(() => {
    if (state.status !== "authenticated") return;
    if (!state.session.mustChangePassword) return;
    if (pathname === CHANGE_PASSWORD_ROUTE) return;
    router.replace(CHANGE_PASSWORD_ROUTE);
  }, [state, pathname, router]);

  const canAccessMachine = useCallback(
    (machine: string | null | undefined) =>
      sessionHasMachine(state.session, machine),
    [state.session]
  );

  const value = useMemo<SessionContextValue>(
    () => ({
      ...state,
      machines: state.session?.machines ?? [],
      refresh,
      logout,
      canAccessMachine,
      error,
    }),
    [state, refresh, logout, canAccessMachine, error]
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
