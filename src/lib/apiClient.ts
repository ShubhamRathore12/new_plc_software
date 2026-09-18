/**
 * Single API client for every call to the control backend.
 *
 * The auth cookie is HttpOnly / Secure / SameSite=None and the API lives on a
 * different site than the UI, so every request must opt in to sending it with
 * `credentials: "include"`. Scattered `fetch` calls miss that, which is why all
 * backend traffic is funnelled through here.
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://www.primeosys.com/backend";

/** Session missing, expired or revoked — route to login, never retry. */
export class SessionExpiredError extends Error {
  constructor(message = "Your session has expired. Please sign in again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

/** Signed in, but not entitled to the requested machine. Never retry, never
 *  silently substitute a different machine. */
export class ForbiddenError extends Error {
  constructor(message = "You do not have access to this device.") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/** Too many attempts — `retryAfter` is in seconds. */
export class RateLimitedError extends Error {
  retryAfter: number;
  constructor(retryAfter: number, message?: string) {
    super(
      message ??
        `Too many attempts. Try again in ${retryAfter} second${
          retryAfter === 1 ? "" : "s"
        }.`
    );
    this.name = "RateLimitedError";
    this.retryAfter = retryAfter;
  }
}

/** Any other non-2xx response. */
export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type SessionExpiredHandler = () => void | Promise<void>;

let sessionExpiredHandler: SessionExpiredHandler | null = null;

/** SessionProvider registers the real teardown (stores, caches, router). */
export function registerSessionExpiredHandler(handler: SessionExpiredHandler) {
  sessionExpiredHandler = handler;
  return () => {
    if (sessionExpiredHandler === handler) sessionExpiredHandler = null;
  };
}

let expiryInFlight = false;

/** Drop client state and route to login. Deduplicated: a burst of parallel
 *  requests failing at once must not fire several redirects. */
export async function handleSessionExpired(): Promise<void> {
  if (typeof window === "undefined" || expiryInFlight) return;
  expiryInFlight = true;
  try {
    if (sessionExpiredHandler) {
      await sessionExpiredHandler();
    } else {
      window.location.replace("/login?expired=1");
    }
  } finally {
    // Allow a later expiry (e.g. after signing back in) to be handled again.
    setTimeout(() => {
      expiryInFlight = false;
    }, 2000);
  }
}

async function readBody(res: Response): Promise<any> {
  const contentType = res.headers.get("Content-Type") || "";
  try {
    return contentType.includes("application/json")
      ? await res.json()
      : await res.text();
  } catch {
    return null;
  }
}

export type ApiOptions = RequestInit & {
  /** Skip the automatic logout/redirect on 401 (used by the session probe and
   *  by login itself, where a 401 is an answer rather than an expiry). */
  skipAuthRedirect?: boolean;
};

/**
 * Fetch against the backend with credentials attached and the auth-related
 * status codes turned into typed errors. Returns the raw Response so callers
 * can stream, read headers or parse as they need.
 */
export async function api(
  path: string,
  init: ApiOptions = {}
): Promise<Response> {
  const { skipAuthRedirect, headers, ...rest } = init;
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;

  const res = await fetch(url, {
    ...rest,
    credentials: "include", // required: cookie is cross-site
    headers: { "Content-Type": "application/json", ...(headers || {}) },
  });

  if (res.status === 401) {
    const body = await readBody(res);
    if (!skipAuthRedirect) await handleSessionExpired();
    throw new SessionExpiredError(body?.message);
  }

  if (res.status === 403) {
    const body = await readBody(res);
    throw new ForbiddenError(body?.message);
  }

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get("Retry-After") ?? 30);
    throw new RateLimitedError(
      Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : 30
    );
  }

  return res;
}

/**
 * Same as `api()` but against this app's own Next.js routes rather than the
 * control backend. Used for `/api/...` handlers served from this origin, which
 * return the same 401/403/429 contract through middleware.
 */
export async function siteApi(
  path: string,
  init: ApiOptions = {}
): Promise<Response> {
  const url =
    typeof window === "undefined"
      ? path
      : new URL(path, window.location.origin).toString();
  return api(url, init);
}

/** `api()` plus JSON parsing and a thrown ApiError on any other non-2xx. */
export async function apiJson<T = any>(
  path: string,
  init: ApiOptions = {}
): Promise<T> {
  const res = await api(path, init);
  const body = await readBody(res);

  if (!res.ok) {
    throw new ApiError(
      res.status,
      body?.message || res.statusText || `Request failed (${res.status})`,
      body
    );
  }

  return body as T;
}
