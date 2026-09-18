/**
 * Authenticated WebSocket client for `/ws`.
 *
 * The server rejects unauthenticated upgrades and validates `Origin`. The auth
 * cookie is `SameSite=None; Secure`, so the browser sends it on the upgrade
 * cross-site and no extra work is needed. Where the cookie cannot be relied on,
 * the token goes through the subprotocol handshake — never the query string,
 * which leaks into access logs, history and referrers.
 */

import { handleSessionExpired } from "@/lib/apiClient";

/** Close codes that mean "your session is gone" — reconnecting cannot help. */
const AUTH_CLOSE_CODES = new Set([1008, 4001, 4401, 4403]);

const MAX_BACKOFF_MS = 30_000;
const BASE_BACKOFF_MS = 1_000;

export type SocketState = "connecting" | "open" | "reconnecting" | "closed";

export type RealtimeSocketOptions = {
  /** Full ws:// or wss:// URL. */
  url: string;
  /** Optional bearer token, used only when the cookie is not usable. */
  token?: string | null;
  onMessage: (data: unknown) => void;
  onStateChange?: (state: SocketState) => void;
};

export type RealtimeSocketHandle = {
  close: () => void;
  readonly state: SocketState;
};

export function openRealtimeSocket({
  url,
  token,
  onMessage,
  onStateChange,
}: RealtimeSocketOptions): RealtimeSocketHandle {
  let socket: WebSocket | null = null;
  let attempt = 0;
  let closedByCaller = false;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;
  let state: SocketState = "connecting";

  const setState = (next: SocketState) => {
    state = next;
    onStateChange?.(next);
  };

  const connect = () => {
    if (closedByCaller) return;
    setState(attempt === 0 ? "connecting" : "reconnecting");

    // `['bearer', token]` is the handshake the server accepts; with the cookie
    // alone the protocol list is omitted entirely.
    socket = token
      ? new WebSocket(url, ["bearer", token])
      : new WebSocket(url);

    socket.onopen = () => {
      attempt = 0;
      setState("open");
    };

    socket.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data));
      } catch {
        onMessage(event.data);
      }
    };

    socket.onclose = (event) => {
      socket = null;
      if (closedByCaller) return;

      // Unauthenticated close: route to login instead of looping.
      if (AUTH_CLOSE_CODES.has(event.code)) {
        setState("closed");
        void handleSessionExpired();
        return;
      }

      attempt += 1;
      const delay = Math.min(
        MAX_BACKOFF_MS,
        BASE_BACKOFF_MS * 2 ** (attempt - 1)
      );
      setState("reconnecting");
      retryTimer = setTimeout(connect, delay);
    };

    socket.onerror = () => {
      // `onclose` always follows; backoff is handled there.
    };
  };

  connect();

  // Logout must not leave a socket open that was opened while authenticated.
  const onSessionEnded = () => handle.close();
  if (typeof window !== "undefined") {
    window.addEventListener("app:session-ended", onSessionEnded);
  }

  const handle: RealtimeSocketHandle = {
    close() {
      closedByCaller = true;
      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = null;
      socket?.close();
      socket = null;
      setState("closed");
      if (typeof window !== "undefined") {
        window.removeEventListener("app:session-ended", onSessionEnded);
      }
    },
    get state() {
      return state;
    },
  };

  return handle;
}
