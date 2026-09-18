/**
 * Authoritative session state.
 *
 * `GET /api/auth/session` is the only source of truth for "is this user signed
 * in" and "which machines may they open". Nothing here reads a localStorage
 * flag to make that decision — a client-side flag is what made typing a chiller
 * URL appear to work (S-01).
 */

import { ApiError, SessionExpiredError, apiJson } from "@/lib/apiClient";

export type SessionMachine = {
  /** Display identifier, e.g. "GTPL_121". */
  machineName: string;
  /** Data table the backend reads for this machine. */
  table: string;
};

export type SessionUser = {
  id: number;
  username: string;
  accountType: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type Session = {
  user: SessionUser;
  machines: SessionMachine[];
  mustChangePassword: boolean;
  /**
   * "server"  — `/api/auth/session` answered; `machines` is authoritative.
   * "legacy"  — backend predates the endpoint; `machines` is empty and callers
   *             fall back to the login payload's monitorAccess grant.
   */
  source: "server" | "legacy";
};

export type SessionState =
  | { status: "loading"; session: null }
  | { status: "authenticated"; session: Session }
  | { status: "anonymous"; session: null };

const SESSION_PATH = "/api/auth/session";

/** True when the backend has not shipped the session endpoint yet. */
function isMissingEndpoint(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 404 || error.status === 501);
}

/**
 * Build a session from the login response for backends that do not serve
 * `/api/auth/session` yet. Machines stay empty on purpose: the raw
 * `monitorAccess` grant is not a list of machine identifiers (§1.6), so callers
 * must keep using their existing grant-based filtering while `source` is
 * "legacy" rather than treating an empty list as "no machines".
 */
export function sessionFromLoginPayload(payload: any): Session | null {
  const user = payload?.user;
  if (!user) return null;

  return {
    user: {
      id: Number(user.id ?? user.userId ?? 0),
      username: String(user.username ?? ""),
      accountType: String(user.accountType ?? user.account_type ?? "user"),
      firstName: user.firstName ?? user.first_name,
      lastName: user.lastName ?? user.last_name,
      email: user.email,
    },
    machines: normalizeMachines(user.machines ?? payload.machines),
    mustChangePassword: Boolean(
      payload.mustChangePassword ?? user.mustChangePassword
    ),
    source: "legacy",
  };
}

function normalizeMachines(raw: any): SessionMachine[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((m: any) => ({
      machineName: String(m?.machineName ?? m?.machine_name ?? ""),
      table: String(m?.table ?? m?.tableName ?? m?.table_name ?? ""),
    }))
    .filter((m) => m.machineName || m.table);
}

/**
 * Ask the server who the caller is.
 *
 * Returns null when there is no session (401). Throws on transport failure so
 * the caller can distinguish "signed out" from "backend unreachable" and avoid
 * bouncing an operator to login over a dropped connection.
 *
 * `legacyPayload` is the persisted login response; it is used only when the
 * backend does not serve the endpoint yet.
 */
export async function fetchSession(
  legacyPayload?: any
): Promise<Session | null> {
  try {
    const body = await apiJson<any>(SESSION_PATH, {
      method: "GET",
      cache: "no-store",
      skipAuthRedirect: true,
    });

    if (!body?.success || !body?.user) return null;

    return {
      user: {
        id: Number(body.user.id),
        username: String(body.user.username ?? ""),
        accountType: String(body.user.accountType ?? "user"),
        firstName: body.user.firstName,
        lastName: body.user.lastName,
        email: body.user.email,
      },
      machines: normalizeMachines(body.machines),
      mustChangePassword: Boolean(body.mustChangePassword),
      source: "server",
    };
  } catch (error) {
    if (error instanceof SessionExpiredError) return null;
    if (isMissingEndpoint(error)) return sessionFromLoginPayload(legacyPayload);
    throw error;
  }
}

/** Machine identifiers arrive in several spellings — GTPL-122-gT-1000T-S7-1200,
 *  gtpl_122_s7_1200_01, GTPL_122. Compare on a normalized form. */
export function normalizeMachineId(value: string | null | undefined): string {
  if (!value) return "";
  const match = String(value).match(/gtpl[-_ ]?(\d{2,4})/i);
  return match ? `gtpl_${match[1]}` : String(value).trim().toLowerCase();
}

/** True when the session entitles the user to the given machine. */
export function sessionHasMachine(
  session: Session | null,
  machine: string | null | undefined
): boolean {
  if (!machine) return true; // route carries no machine — nothing to check
  if (!session) return false;
  // Legacy backends do not report the machine set; entitlement is enforced
  // server-side on every data call, and the grant-based check still applies.
  if (session.source === "legacy") return true;

  const wanted = normalizeMachineId(machine);
  return session.machines.some(
    (m) =>
      normalizeMachineId(m.machineName) === wanted ||
      normalizeMachineId(m.table) === wanted
  );
}
