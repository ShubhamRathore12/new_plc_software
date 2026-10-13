"use client";

/**
 * GTPL-141 Start/Stop card used on the Auto and both Aeration diagrams.
 *
 * It never calls the control API itself: clicks open the controls panel's
 * confirmation dialog (requestGtpl141Pulse), and lock reasons / command
 * progress come from the state that panel broadcasts. So every freshness,
 * gateway and reset-debt check from the handoff still applies, and the API is
 * polled once per page, not once per button.
 */

import { useEffect, useState, type CSSProperties } from "react";
import { Play, Square } from "lucide-react";
import {
  GTPL141_STATE_EVENT,
  getGtpl141State,
  requestGtpl141Pulse,
  type Gtpl141PanelState,
} from "@/lib/gtpl141Control";

function useGtpl141PanelState() {
  const [state, setState] = useState<Gtpl141PanelState | null>(() => getGtpl141State());
  useEffect(() => {
    const on = (e: Event) => setState((e as CustomEvent<Gtpl141PanelState>).detail);
    window.addEventListener(GTPL141_STATE_EVENT, on);
    return () => window.removeEventListener(GTPL141_STATE_EVENT, on);
  }, []);
  return state;
}

// Short labels for the card; the panel keeps the full wording.
const STEP: Record<string, { text: string; tone: "wait" | "ok" | "err" }> = {
  queued: { text: "Waiting for gateway…", tone: "wait" },
  claimed: { text: "Gateway sending to PLC…", tone: "wait" },
  write_completed: { text: "Written, awaiting reset…", tone: "wait" },
  pulse_completed: { text: "Pulse sent to PLC", tone: "ok" },
  rejected: { text: "Rejected", tone: "err" },
  expired: { text: "Expired, not sent", tone: "err" },
  cancelled: { text: "Cancelled, not sent", tone: "err" },
  uncertain: { text: "Outcome unknown, inspect PLC", tone: "err" },
  reviewed: { text: "Inspection recorded", tone: "ok" },
  simulated: { text: "Simulated only", tone: "err" },
};
const ACTIVE = new Set(["queued", "claimed", "write_completed", "uncertain"]);
/** A finished command's result stays visible this long. */
const RECENT_MS = 60_000;

const Spinner = () => (
  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
);

export default function Gtpl141PulseCard({
  title,
  label,
  start,
  stop,
  running,
  className = "",
  style,
}: {
  title: string;
  /** Prefix for the confirm dialog, e.g. "Auto" → "Auto: Start". */
  label: string;
  start: string;
  stop: string;
  /** Machine running feedback. Omit when no confirmed feedback tag exists. */
  running?: boolean | null;
  className?: string;
  style?: CSSProperties;
}) {
  const panel = useGtpl141PanelState();
  // Re-render each second so "recent" results age out.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const status =
    running === undefined
      ? null
      : running === null
        ? { text: "--", dot: "bg-gray-400", pill: "bg-slate-700/60 text-slate-300" }
        : running
          ? {
              text: "RUNNING",
              dot: "bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.8)] animate-pulse",
              pill: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/40",
            }
          : {
              text: "STOPPED",
              dot: "bg-slate-400",
              pill: "bg-slate-700/60 text-slate-300 ring-1 ring-slate-500/40",
            };

  const cmd = [start, stop]
    .map((t) => panel?.latestByTag[t])
    .filter((c): c is NonNullable<typeof c> => !!c)
    .sort((a, b) => Date.parse(b.created_at ?? "") - Date.parse(a.created_at ?? ""))[0];
  const sending =
    panel?.sendingTag === start || panel?.sendingTag === stop ? panel.sendingTag : null;
  const showCmd =
    cmd &&
    (ACTIVE.has(cmd.status) || now - Date.parse(cmd.updated_at ?? cmd.created_at ?? "") < RECENT_MS);
  const step = sending
    ? { text: "Sending…", tone: "wait" as const }
    : showCmd
      ? (STEP[cmd.status] ?? { text: cmd.status, tone: "wait" as const })
      : null;
  const stepTag = sending ?? (showCmd ? cmd.tag : null);

  // No panel state yet = control API not reached; keep buttons off until it is.
  const lock = panel ? panel.blocked : "Connecting to control service…";
  const startLock = lock ?? panel?.pulseBlock[start] ?? null;
  const stopLock = lock ?? panel?.pulseBlock[stop] ?? null;
  const note = step
    ? { text: `${stepTag === stop ? "Stop" : "Start"}: ${step.text}`, tone: step.tone }
    : startLock && startLock === stopLock
      ? { text: startLock, tone: "err" as const }
      : null;
  const noteCls =
    note?.tone === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : note?.tone === "err"
        ? "border-red-200 bg-red-50 text-red-700"
        : "border-blue-200 bg-blue-50 text-blue-700";

  // Raised industrial push-buttons: gradient face, bottom lip that sinks on press.
  const btn =
    "group relative flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-1.5 py-2 text-[11px] font-extrabold uppercase tracking-wide text-white transition-all duration-150 border-b-4 active:translate-y-0.5 active:border-b-2 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:saturate-50 disabled:opacity-60 disabled:active:translate-y-0 disabled:active:border-b-4";
  const startCls =
    "bg-gradient-to-b from-emerald-400 to-emerald-600 border-emerald-800 focus-visible:ring-emerald-400" +
    (running === true ? " shadow-[0_0_14px_2px_rgba(16,185,129,0.55)]" : " shadow-md");
  const stopCls =
    "bg-gradient-to-b from-rose-500 to-red-600 border-red-800 focus-visible:ring-red-400" +
    (running === false ? " shadow-[0_0_14px_2px_rgba(239,68,68,0.5)]" : " shadow-md");
  const waiting = (tag: string) => stepTag === tag && step?.tone === "wait";
  const icon = "flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/25";

  return (
    <div
      className={`overflow-hidden rounded-xl border border-slate-300 bg-gradient-to-b from-white to-slate-50 shadow-lg ${className}`}
      style={style}
    >
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-slate-800 to-slate-700 px-2.5 py-1.5">
        <span className="truncate text-[11px] font-bold uppercase tracking-widest text-white">
          {title}
        </span>
        {status && (
          <span
            className={`flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-wide ${status.pill}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.text}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 p-2">
        <div className="flex gap-1.5 rounded-lg bg-slate-200/70 p-1.5 shadow-inner">
          <button
            type="button"
            disabled={!!startLock}
            title={startLock ?? `${label}: Start`}
            className={`${btn} ${startCls}`}
            onClick={() => requestGtpl141Pulse(start, `${label}: Start`)}
          >
            <span className={icon}>
              {waiting(start) ? <Spinner /> : <Play className="h-2.5 w-2.5 fill-current" />}
            </span>
            Start
          </button>
          <button
            type="button"
            disabled={!!stopLock}
            title={stopLock ?? `${label}: Stop`}
            className={`${btn} ${stopCls}`}
            onClick={() => requestGtpl141Pulse(stop, `${label}: Stop`)}
          >
            <span className={icon}>
              {waiting(stop) ? <Spinner /> : <Square className="h-2.5 w-2.5 fill-current" />}
            </span>
            Stop
          </button>
        </div>
        {note && (
          <p
            role="status"
            title={note.text}
            className={`line-clamp-2 rounded-md border px-1.5 py-1 text-[10px] font-semibold leading-tight ${noteCls}`}
          >
            {note.text}
          </p>
        )}
      </div>
    </div>
  );
}
