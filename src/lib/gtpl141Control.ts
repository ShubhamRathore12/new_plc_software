/**
 * GTPL-141 remote control — client side.
 *
 * The browser only talks to the Grain backend's /api/controls/gtpl-141/* routes.
 * The backend holds the HVAC integration token and builds the upstream request,
 * so nothing here carries a credential other than the user's own session cookie.
 *
 * Exact route segment match: never substring-match 14 / 114 / 141.
 */

import { API_BASE, handleSessionExpired } from "@/lib/apiClient";

export const GTPL141_DEVICE = "GTPL-141-gT-140E-S7-1200";
export const isGtpl141 = (device: unknown) => device === GTPL141_DEVICE;

export type SettingKind = "REAL" | "INT" | "BOOL";

export const GTPL141_SETTINGS: Record<
  string,
  { label: string; kind: SettingKind; unit?: string }
> = {
  T1_ref_from_T0: { label: "T1 reference from T0", kind: "REAL", unit: "°C" },
  Delta_T: { label: "Delta T setting", kind: "REAL", unit: "°C" },
  Duration_set_aeration: { label: "Aeration duration", kind: "INT" },
  Auto_aeration_enable: { label: "Automatic aeration enable", kind: "BOOL" },
  Auto_EN: { label: "Automatic mode selection", kind: "BOOL" },
  Set_TH_for_heating_mode: { label: "Heating temperature setting", kind: "REAL", unit: "°C" },
  Continuous_mode: { label: "Continuous mode selection", kind: "BOOL" },
  Set_Run_Duration: { label: "Set run duration", kind: "INT", unit: "h" },
  HP_set_from_HMI: { label: "High pressure setting", kind: "REAL" },
};

export type PulseGroup = "auto" | "wh" | "woh";

export const GTPL141_PULSE_GROUPS: Record<
  PulseGroup,
  { title: string; start: string; stop: string }
> = {
  auto: { title: "Auto", start: "Auto_start", stop: "Auto_stop" },
  wh: {
    title: "Aeration with heating",
    start: "Aeration_start_with_WH",
    stop: "Aeration_stop_with_WH",
  },
  woh: {
    title: "Aeration without heating",
    start: "Aeration_start_with_WOH",
    stop: "Aeration_stop_with_WOH",
  },
};

export const STATUS_LABELS: Record<string, string> = {
  queued: "Waiting for gateway",
  claimed: "Claimed once by gateway",
  write_completed: "S7 write acknowledged; awaiting independent readback",
  readback_verified: "Later fresh PLC sample matches requested setting",
  pulse_completed: "Pulse sent; command bit reset (not physical running confirmation)",
  rejected: "Rejected",
  expired: "Queue TTL elapsed before claim; not sent",
  cancelled: "Cancelled before claim; not sent",
  uncertain: "Outcome not established; local inspection required",
  reviewed: "Operator recorded local inspection (not automatic verification)",
  simulated: "Validation only, no PLC write",
};

const BLOCKING_STATUSES = new Set(["queued", "claimed", "write_completed", "uncertain"]);

export type Command = {
  id: string;
  tag: string;
  value: unknown;
  expected_value: unknown;
  status: string;
  detail?: unknown;
  kind?: string;
  reset_required?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ReadbackValue = { tag: string; label?: string; value: unknown; data_type?: string };

export type Latest = {
  /** Browser time when this response arrived (added client-side). */
  _fetchedAt?: number;
  machine?: { status?: string; connected?: boolean };
  plc_readback?: {
    status?: string;
    sampled_at?: string;
    received_at?: string;
    evaluated_at?: string;
    values?: ReadbackValue[];
  };
};

export type Capabilities = {
  mode?: string;
  live_tags?: string[];
  pulse_enabled?: boolean;
  pulse_ms?: number;
  gateway?: {
    state?: string;
    ready?: boolean;
    last_seen?: string;
    tags?: string[];
    pulse_values?: Record<string, unknown>;
    pulse_ms?: number;
  };
};

export class ControlError extends Error {
  status: number;
  code?: string;
  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function detailText(detail: unknown): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((d: any) => (typeof d === "string" ? d : d?.msg ?? JSON.stringify(d)))
      .join("; ");
  if (detail && typeof detail === "object") return JSON.stringify(detail);
  return "";
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}/api/controls/gtpl-141${path}`, {
    ...init,
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      // CSRF: the backend requires this custom header on writes.
      "X-Requested-With": "XMLHttpRequest",
    },
  });
  let body: any = null;
  try {
    body = await res.json();
  } catch {
    /* non-JSON */
  }
  if (res.status === 401) {
    // Only the Grain session can produce 401 here; upstream auth failures are 502.
    await handleSessionExpired();
  }
  if (!res.ok) {
    throw new ControlError(
      res.status,
      detailText(body?.detail) || body?.message || `Request failed (HTTP ${res.status})`,
      body?.code
    );
  }
  return body as T;
}

export const controlApi = {
  access: () => request<{ can_control: boolean; configured: boolean }>("/access"),
  latest: () =>
    request<Latest>("/latest").then((l) => ({ ...l, _fetchedAt: Date.now() })),
  capabilities: () => request<Capabilities>("/capabilities"),
  commands: () => request<Command[]>("/commands"),
  /** `body` is the frozen serialized intent; retries must resend it unchanged. */
  submit: (body: string) => request<Command>("/commands", { method: "POST", body }),
  cancel: (id: string) =>
    request<Command>(`/commands/${encodeURIComponent(id)}/cancel`, { method: "POST", body: "{}" }),
  review: (id: string, outcome: "requested_change_confirmed" | "different_state_confirmed") =>
    request<Command>(`/commands/${encodeURIComponent(id)}/review`, {
      method: "POST",
      body: JSON.stringify({ plc_inspected: true, outcome }),
    }),
};

// ── Freshness / gating ──────────────────────────────────────────────────────

function ageSeconds(iso: string | undefined, now: number): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isFinite(t) ? (now - t) / 1000 : null;
}

const inRange = (age: number | null, max: number) => age !== null && age >= -2 && age <= max;

export function readbackValue(latest: Latest | null, tag: string): unknown {
  const v = latest?.plc_readback?.values?.find((x) => x.tag === tag);
  return v === undefined ? null : v.value;
}

/**
 * Actual value from the machine telemetry row (the RB_* readback columns the
 * gateway uploads with every sample). Strings like "1", "0", "True", "3" are
 * normalized to the setting's type. Missing/empty stays null, never 0/false.
 */
export function telemetryValue(
  data: Record<string, unknown> | null | undefined,
  tag: string
): unknown {
  const raw = data?.[`RB_${tag}`];
  if (raw === null || raw === undefined || String(raw).trim() === "") return null;
  const kind = GTPL141_SETTINGS[tag]?.kind;
  const s = String(raw).trim();
  if (kind === "BOOL") {
    if (s === "1" || s.toLowerCase() === "true") return true;
    if (s === "0" || s.toLowerCase() === "false") return false;
    return null;
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** Global lock reason, or null when writes may be offered. */
export function globalBlockReason(args: {
  latest: Latest | null;
  caps: Capabilities | null;
  commands: Command[] | null;
  errors: string[];
  canControl: boolean | null;
  pendingSubmit: boolean;
  now: number;
}): string | null {
  const { latest, caps, commands, errors, canControl, pendingSubmit, now } = args;
  if (canControl === false) return "Your account is not permitted to control GTPL-141.";
  if (errors.length) return `Cannot validate machine state: ${errors[0]}`;
  if (!latest || !caps || !commands) return "Loading machine state…";
  if (pendingSubmit)
    return "A previous command's delivery is unresolved. Retry it or check the command history.";

  const rb = latest.plc_readback;
  if (latest.machine?.status !== "online") return "Machine is not online.";
  if (rb?.status !== "fresh") return `PLC readback is ${rb?.status ?? "unavailable"}.`;
  // Ages are measured on the server's clock (evaluated_at) plus the time since
  // this response arrived, so a skewed PC clock cannot fake staleness or
  // freshness. Falls back to the browser clock if evaluated_at is missing.
  const evalMs = rb.evaluated_at ? Date.parse(rb.evaluated_at) : NaN;
  const ref =
    Number.isFinite(evalMs) && latest._fetchedAt ? evalMs + (now - latest._fetchedAt) : now;
  const sampleAge = ageSeconds(rb.sampled_at, ref);
  const receivedAge = ageSeconds(rb.received_at, ref);
  if (!inRange(sampleAge, 15) || !inRange(receivedAge, 15))
    return `PLC readback is too old (${Math.round(Math.max(sampleAge ?? 99, receivedAge ?? 99))} s).`;

  if (caps.mode !== "live") return `Control mode is ${caps.mode ?? "unknown"}, not live.`;
  const gw = caps.gateway;
  if (!gw || gw.ready !== true || gw.state !== "ready")
    return gw?.state === "blocked"
      ? "Gateway is blocked; local gateway recovery is required."
      : `Gateway is ${gw?.state ?? "offline"}.`;
  if (!inRange(ageSeconds(gw.last_seen, now), 12)) return "Gateway heartbeat is stale.";

  const busy = commands.find((c) => BLOCKING_STATUSES.has(c.status) || c.reset_required);
  if (busy)
    return busy.reset_required
      ? "A pulse reset is still pending confirmation."
      : `Another command is ${STATUS_LABELS[busy.status]?.toLowerCase() ?? busy.status}.`;
  return null;
}

function tagWritable(caps: Capabilities, tag: string) {
  return !!caps.live_tags?.includes(tag) && !!caps.gateway?.tags?.includes(tag);
}

export function settingBlockReason(latest: Latest, caps: Capabilities, tag: string): string | null {
  if (!tagWritable(caps, tag))
    return tag === "Set_Run_Duration"
      ? "Awaiting updated gateway readback"
      : "This setting is not enabled for remote writes.";
  if (readbackValue(latest, tag) === null)
    return tag === "Set_Run_Duration"
      ? "Awaiting updated gateway readback"
      : "No actual PLC readback for this setting.";
  return null;
}

export function pulseBlockReason(caps: Capabilities, tag: string): string | null {
  if (!tagWritable(caps, tag)) return "This command is not enabled for remote writes.";
  if (caps.pulse_enabled !== true) return "Pulse commands are disabled.";
  if (typeof caps.pulse_ms !== "number" || caps.pulse_ms !== caps.gateway?.pulse_ms)
    return `Pulse timing mismatch (server ${caps.pulse_ms ?? "?"} ms, gateway ${caps.gateway?.pulse_ms ?? "?"} ms).`;
  if (caps.gateway?.pulse_values?.[tag] !== false) return "Command bit is not confirmed idle (False).";
  return null;
}

export function formatValue(v: unknown, unit?: string) {
  if (v === null || v === undefined) return "--";
  if (typeof v === "boolean") return v ? "ON" : "OFF";
  return unit ? `${v} ${unit}` : String(v);
}

export function newRequestId(): string {
  const c: Crypto = globalThis.crypto;
  if (typeof c.randomUUID === "function") return c.randomUUID();
  const b = c.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/**
 * Lets other views (e.g. the Auto process diagram) open the controls panel's
 * edit dialog, so every edit still goes through the same confirmation and
 * freshness checks.
 */
export const GTPL141_EDIT_EVENT = "gtpl141:edit";
export function requestGtpl141Edit(tag: string, value?: unknown) {
  window.dispatchEvent(new CustomEvent(GTPL141_EDIT_EVENT, { detail: { tag, value } }));
}

export const GTPL141_PULSE_EVENT = "gtpl141:pulse";
/** Ask the controls panel to open its Start/Stop confirmation for `tag`. */
export function requestGtpl141Pulse(tag: string, label: string) {
  window.dispatchEvent(new CustomEvent(GTPL141_PULSE_EVENT, { detail: { tag, label } }));
}


/**
 * Snapshot the controls panel broadcasts so diagram buttons can show lock
 * reasons and live command progress without polling the API a second time.
 */
export type Gtpl141PanelState = {
  /** Global lock (offline, stale readback, busy gateway, API error…), or null. */
  blocked: string | null;
  /** Per-pulse-tag lock reason, or null when that button may be offered. */
  pulseBlock: Record<string, string | null>;
  /** Newest command per tag from upstream history. */
  latestByTag: Record<string, Command>;
  /** Tag whose submit HTTP call is in flight, or whose delivery is unresolved. */
  sendingTag: string | null;
};
export const GTPL141_STATE_EVENT = "gtpl141:state";
let lastPanelState: Gtpl141PanelState | null = null;
export function publishGtpl141State(s: Gtpl141PanelState) {
  lastPanelState = s;
  window.dispatchEvent(new CustomEvent(GTPL141_STATE_EVENT, { detail: s }));
}
export function getGtpl141State() {
  return lastPanelState;
}
