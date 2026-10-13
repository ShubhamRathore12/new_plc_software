"use client";

/**
 * GTPL-141 remote controls panel. Rendered only for GTPL-141.
 *
 * Every actual value shown comes from PLC readback; pending commands are shown
 * separately and never replace an actual value. Unmounting only stops polling —
 * no command is ever sent on a lifecycle event.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Pencil, Play, RotateCw, Square, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Capabilities,
  Command,
  ControlError,
  GTPL141_PULSE_GROUPS,
  GTPL141_SETTINGS,
  Latest,
  PulseGroup,
  STATUS_LABELS,
  controlApi,
  formatValue,
  globalBlockReason,
  newRequestId,
  pulseBlockReason,
  readbackValue,
  settingBlockReason,
  telemetryValue,
  GTPL141_EDIT_EVENT,
  GTPL141_PULSE_EVENT,
  publishGtpl141State,
} from "@/lib/gtpl141Control";

const PENDING_KEY = "gtpl141.pendingIntent";

type Intent = { body: string; tag: string; requestId: string };

/** Poll `fn` every `ms` while mounted, never overlapping. */
function usePoll<T>(fn: () => Promise<T>, ms: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);
  const run = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    try {
      setData(await fn());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      busy.current = false;
    }
  }, [fn]);
  useEffect(() => {
    run();
    const id = setInterval(() => {
      if (document.visibilityState === "visible") run();
    }, ms);
    return () => clearInterval(id);
  }, [run, ms]);
  return { data, error, refresh: run };
}

function readPending(): Intent | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as Intent) : null;
  } catch {
    return null;
  }
}
function writePending(i: Intent | null) {
  try {
    if (i) sessionStorage.setItem(PENDING_KEY, JSON.stringify(i));
    else sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* storage unavailable: pending identity stays in memory only */
  }
}

type EditState = {
  tag: string;
  expected: unknown;
  draft: string;
};

type PulseState = { tag: string; label: string };

export default function Gtpl141Controls({
  pulses = [],
  settings = [],
  title = "Remote controls (GTPL-141)",
  telemetry,
  compact = false,
}: {
  pulses?: PulseGroup[];
  settings?: string[];
  title?: string;
  /** The page's live machine row; its RB_* columns are shown when the control
   *  service readback is not available. */
  telemetry?: Record<string, unknown> | null;
  /** Hide the Start/Stop and setpoint lists (the diagram shows them and opens
   *  this panel's dialogs); keep status, messages and recent commands. */
  compact?: boolean;
}) {
  const latestQ = usePoll(controlApi.latest, 6000);
  const capsQ = usePoll(controlApi.capabilities, 5000);
  const cmdsQ = usePoll(controlApi.commands, 3000);
  const [canControl, setCanControl] = useState<boolean | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [pending, setPending] = useState<Intent | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "err"; text: string } | null>(null);
  const [edit, setEdit] = useState<EditState | null>(null);
  const [pulse, setPulse] = useState<PulseState | null>(null);
  const [review, setReview] = useState<Command | null>(null);

  useEffect(() => {
    controlApi
      .access()
      .then((a) => setCanControl(a.can_control))
      .catch(() => setCanControl(null));
    setPending(readPending());
    // Freshness is recomputed every second so a stalled poll cannot leave
    // controls enabled.
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const latest = latestQ.data as Latest | null;
  const actualValue = (tag: string) => {
    const v = readbackValue(latest, tag);
    return v !== null && v !== undefined ? v : telemetryValue(telemetry, tag);
  };
  const caps = capsQ.data as Capabilities | null;
  const commands = (cmdsQ.data as Command[] | null) ?? null;

  // A pending intent is resolved once its request_id shows up in history.
  useEffect(() => {
    if (pending && commands?.some((c) => c.id === pending.requestId)) {
      setPending(null);
      writePending(null);
    }
  }, [pending, commands]);

  const errors = [
    latestQ.error && `readback: ${latestQ.error}`,
    capsQ.error && `capabilities: ${capsQ.error}`,
    cmdsQ.error && `command history: ${cmdsQ.error}`,
  ].filter(Boolean) as string[];

  const blocked = globalBlockReason({
    latest,
    caps,
    commands,
    errors,
    canControl,
    pendingSubmit: !!pending,
    now,
  });

  const send = async (intent: Intent) => {
    setSubmitting(true);
    setMessage(null);
    setPending(intent);
    writePending(intent);
    try {
      const res = await controlApi.submit(intent.body);
      setPending(null);
      writePending(null);
      setMessage({ tone: "ok", text: `Command accepted: ${STATUS_LABELS[res.status] ?? res.status}` });
    } catch (e) {
      const err = e as ControlError;
      // 503 / network: delivery unknown. Keep the identity so a retry reuses it.
      if (!(err instanceof ControlError) || err.status >= 500 || err.status === 429) {
        setMessage({
          tone: "err",
          text: `${err.message} Delivery is uncertain — retry the same request or check history.`,
        });
      } else {
        setPending(null);
        writePending(null);
        setMessage({ tone: "err", text: `HTTP ${err.status}: ${err.message}` });
      }
    } finally {
      setSubmitting(false);
      cmdsQ.refresh();
    }
  };

  const buildIntent = (tag: string, value: unknown, expected: unknown): Intent => {
    const requestId = newRequestId();
    return {
      tag,
      requestId,
      body: JSON.stringify({ request_id: requestId, tag, value, expected_value: expected }),
    };
  };

  // ── settings editing ──────────────────────────────────────────────────────
  const parseDraft = (kind: string, draft: string): { ok: boolean; value?: unknown; error?: string } => {
    if (kind === "BOOL") {
      if (draft === "true") return { ok: true, value: true };
      if (draft === "false") return { ok: true, value: false };
      return { ok: false, error: "Select ON or OFF." };
    }
    if (draft.trim() === "") return { ok: false, error: "Enter a value." };
    const n = Number(draft);
    if (!Number.isFinite(n)) return { ok: false, error: "Enter a number." };
    if (kind === "INT") {
      if (!Number.isInteger(n)) return { ok: false, error: "Enter a whole number." };
      if (n < -32768 || n > 32767) return { ok: false, error: "Outside PLC INT storage range." };
    }
    return { ok: true, value: n };
  };

  const editMeta = edit ? GTPL141_SETTINGS[edit.tag] : null;
  const editParsed = edit && editMeta ? parseDraft(editMeta.kind, edit.draft) : null;
  const openEdit = (tag: string, preset?: unknown) => {
    const meta = GTPL141_SETTINGS[tag];
    const actual = actualValue(tag);
    if (!meta || !settings.includes(tag)) return;
    if (canControl === false) {
      setMessage({ tone: "err", text: "Your account is not permitted to control GTPL-141." });
      return;
    }
    if (actual === null) {
      setMessage({ tone: "err", text: `${meta.label}: no actual PLC value yet, cannot edit.` });
      return;
    }
    // A preset (e.g. a diagram ON/OFF button) only pre-fills the dialog; the
    // operator still has to confirm.
    const draft =
      preset !== undefined ? String(preset) : meta.kind === "BOOL" ? "" : String(actual);
    setEdit({ tag, expected: actual, draft });
  };
  const pulsesRef = useRef(pulses);
  pulsesRef.current = pulses;
  const openEditRef = useRef(openEdit);
  openEditRef.current = openEdit;
  useEffect(() => {
    const onEdit = (e: Event) => {
      const { tag, value } = (e as CustomEvent<{ tag: string; value?: unknown }>).detail;
      openEditRef.current(tag, value);
    };
    const onPulse = (e: Event) => {
      const { tag, label } = (e as CustomEvent<{ tag: string; label: string }>).detail;
      const allowed = pulsesRef.current.some(
        (g) => GTPL141_PULSE_GROUPS[g].start === tag || GTPL141_PULSE_GROUPS[g].stop === tag
      );
      if (allowed) setPulse({ tag, label });
    };
    window.addEventListener(GTPL141_EDIT_EVENT, onEdit);
    window.addEventListener(GTPL141_PULSE_EVENT, onPulse);
    return () => {
      window.removeEventListener(GTPL141_EDIT_EVENT, onEdit);
      window.removeEventListener(GTPL141_PULSE_EVENT, onPulse);
    };
  }, []);

  const editCurrent = edit ? actualValue(edit.tag) : null;
  const editConflict = edit ? editCurrent !== edit.expected : false;
  const editRowBlock =
    edit && latest && caps ? settingBlockReason(latest, caps, edit.tag) : null;

  const pulseRowBlock = pulse && caps ? pulseBlockReason(caps, pulse.tag) : null;

  // ── review ────────────────────────────────────────────────────────────────
  const [reviewOutcome, setReviewOutcome] = useState<string>("");
  const [reviewChecked, setReviewChecked] = useState(false);
  const openReview = (c: Command) => {
    setReview(c);
    setReviewOutcome("");
    setReviewChecked(false);
  };
  const submitReview = async () => {
    if (!review) return;
    if (reviewOutcome !== "requested_change_confirmed" && reviewOutcome !== "different_state_confirmed") return;
    try {
      await controlApi.review(review.id, reviewOutcome);
      setMessage({ tone: "ok", text: "Inspection recorded." });
      setReview(null);
    } catch (e) {
      setMessage({ tone: "err", text: (e as Error).message });
    } finally {
      cmdsQ.refresh();
    }
  };

  const cancel = async (c: Command) => {
    try {
      await controlApi.cancel(c.id);
      setMessage({ tone: "ok", text: "Command cancelled before claim." });
    } catch (e) {
      setMessage({ tone: "err", text: (e as Error).message });
    } finally {
      cmdsQ.refresh();
    }
  };

  // Share lock/progress with the diagram's Start/Stop buttons.
  const allPulseTags = pulses.flatMap((g) => [
    GTPL141_PULSE_GROUPS[g].start,
    GTPL141_PULSE_GROUPS[g].stop,
  ]);
  const pulseBlockMap: Record<string, string | null> = {};
  for (const t of allPulseTags) pulseBlockMap[t] = caps ? pulseBlockReason(caps, t) : null;
  const latestByTag: Record<string, Command> = {};
  // History is newest first, so the first hit per tag wins.
  for (const c of commands ?? []) if (!latestByTag[c.tag]) latestByTag[c.tag] = c;
  const sendingTag = submitting || pending ? (pending?.tag ?? null) : null;
  const stateKey = JSON.stringify([blocked, pulseBlockMap, latestByTag, sendingTag]);
  useEffect(() => {
    publishGtpl141State({ blocked, pulseBlock: pulseBlockMap, latestByTag, sendingTag });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stateKey]);

  const rb = latest?.plc_readback;

  return (
    <section className="surface space-y-5 p-4 md:p-5" aria-label={title}>
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <span className="text-muted-foreground text-xs">
          Readback: {rb?.status ?? "--"}
          {rb?.sampled_at &&
            ` · ${new Date(rb.sampled_at).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })} IST`}
          {caps?.gateway && ` · Gateway: ${caps.gateway.state}`}
        </span>
      </header>

      {blocked && (
        <p role="status" className="border-warning/40 bg-warning/10 rounded-lg border px-3 py-2 text-sm">
          Controls locked: {blocked}
        </p>
      )}
      {message && (
        <p
          role="alert"
          className={`rounded-lg border px-3 py-2 text-sm ${
            message.tone === "ok"
              ? "border-success/40 bg-success/10"
              : "border-destructive/40 bg-destructive/10"
          }`}
        >
          {message.text}
        </p>
      )}
      {pending && (
        <div className="flex flex-wrap items-center gap-3 rounded-lg border px-3 py-2 text-sm">
          <span>
            Unresolved request for <b>{pending.tag}</b> ({pending.requestId.slice(0, 8)}…)
          </span>
          <Button size="sm" variant="outline" disabled={submitting} onClick={() => send(pending)}>
            <RotateCw className="h-3.5 w-3.5" /> Retry same request
          </Button>
        </div>
      )}

      {!compact && pulses.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {pulses.map((g) => {
            const grp = GTPL141_PULSE_GROUPS[g];
            return (
              <div key={g} className="plate space-y-3 rounded-xl p-3.5">
                <div className="text-muted-foreground text-[11px] font-bold tracking-[0.18em] uppercase">
                  {grp.title}
                </div>
                <div className="flex gap-2 [&>*]:flex-1">
                  {[
                    { tag: grp.start, label: "Start", icon: Play, variant: "default" as const },
                    { tag: grp.stop, label: "Stop", icon: Square, variant: "destructive" as const },
                  ].map((b) => {
                    const reason = blocked ?? (caps ? pulseBlockReason(caps, b.tag) : "Loading…");
                    return (
                      <div key={b.tag} className="space-y-1">
                        <Button
                          variant={b.variant}
                          className="h-11 w-full gap-2 font-semibold"
                          disabled={!!reason || submitting}
                          title={reason ?? `${grp.title}: ${b.label}`}
                          onClick={() => setPulse({ tag: b.tag, label: `${grp.title}: ${b.label}` })}
                        >
                          <b.icon className="h-4 w-4" aria-hidden /> {b.label}
                        </Button>
                        {reason && !blocked && (
                          <p className="text-muted-foreground text-[11px]">{reason}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!compact && settings.length > 0 && (
        <ul className="divide-border divide-y rounded-xl border">
          {settings.map((tag) => {
            const meta = GTPL141_SETTINGS[tag];
            if (!meta) return null;
            const actual = actualValue(tag);
            const reason = blocked ?? (latest && caps ? settingBlockReason(latest, caps, tag) : "Loading…");
            return (
              <li key={tag} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                <div className="min-w-0">
                  <div className="text-sm font-medium">{meta.label}</div>
                  {reason && !blocked && (
                    <div className="text-muted-foreground text-[11px]">{reason}</div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm tabular-nums">{formatValue(actual, meta.unit)}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    aria-label={`Edit ${meta.label}`}
                    title={`Edit ${meta.label}`}
                    // Opens even while locked: the dialog explains why it cannot
                    // be submitted yet instead of a silently disabled icon.
                    disabled={canControl === false || actual === null || submitting}
                    onClick={() => openEdit(tag)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="space-y-2">
        <div className="text-muted-foreground text-[11px] font-bold tracking-[0.18em] uppercase">
          Recent commands
        </div>
        {!commands?.length ? (
          <p className="text-muted-foreground text-xs">{cmdsQ.error ?? "No commands yet."}</p>
        ) : (
          <ul className="max-h-64 space-y-1.5 overflow-y-auto text-xs">
            {commands.slice(0, 8).map((c) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2">
                <div className="min-w-0">
                  <span className="font-mono">{c.tag}</span> → {formatValue(c.value)}
                  <div className="text-muted-foreground">
                    {STATUS_LABELS[c.status] ?? c.status}
                    {c.status === "rejected" && c.detail ? `: ${String(c.detail)}` : ""}
                    {c.reset_required ? " · reset pending" : ""}
                    {c.created_at &&
                      ` · ${new Date(c.created_at).toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" })}`}
                  </div>
                </div>
                {canControl && c.status === "queued" && (
                  <Button size="sm" variant="outline" onClick={() => cancel(c)}>
                    <X className="h-3.5 w-3.5" /> Cancel
                  </Button>
                )}
                {canControl && c.status === "uncertain" && (
                  <Button size="sm" variant="outline" onClick={() => openReview(c)}>
                    Record inspection
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Setting confirmation */}
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change {editMeta?.label}</DialogTitle>
            <DialogDescription>
              Actual PLC value when editing started: <b>{formatValue(edit?.expected, editMeta?.unit)}</b>
            </DialogDescription>
          </DialogHeader>
          {edit && editMeta && (
            <div className="space-y-3">
              {editMeta.kind === "BOOL" ? (
                <div className="grid grid-cols-2 gap-2" role="radiogroup">
                  {["true", "false"].map((v) => (
                    <Button
                      key={v}
                      role="radio"
                      aria-checked={edit.draft === v}
                      variant={edit.draft === v ? "default" : "outline"}
                      onClick={() => setEdit({ ...edit, draft: v })}
                    >
                      {v === "true" ? "ON" : "OFF"}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    inputMode="decimal"
                    step={editMeta.kind === "INT" ? 1 : "any"}
                    value={edit.draft}
                    onChange={(e) => setEdit({ ...edit, draft: e.target.value })}
                    aria-label={`New ${editMeta.label}`}
                  />
                  {editMeta.unit && <span className="text-muted-foreground text-sm">{editMeta.unit}</span>}
                </div>
              )}
              {editParsed && !editParsed.ok && edit.draft !== "" && (
                <p className="text-destructive text-xs">{editParsed.error}</p>
              )}
              {editParsed?.ok && (
                <p className="text-sm">
                  Requested: <b>{formatValue(editParsed.value, editMeta.unit)}</b>
                </p>
              )}
              {editConflict && (
                <p className="text-destructive text-sm">
                  The actual value changed to {formatValue(editCurrent, editMeta.unit)} (e.g. at the HMI).
                  Close and review the actual value before changing it.
                </p>
              )}
              {(blocked || editRowBlock) && (
                <p className="text-muted-foreground text-xs">Locked: {blocked ?? editRowBlock}</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)}>
              Cancel
            </Button>
            <Button
              disabled={
                !edit || !editParsed?.ok || editConflict || !!blocked || !!editRowBlock || submitting
              }
              onClick={() => {
                if (!edit || !editParsed?.ok) return;
                const intent = buildIntent(edit.tag, editParsed.value, edit.expected);
                setEdit(null);
                send(intent);
              }}
            >
              Confirm change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pulse confirmation */}
      <Dialog open={!!pulse} onOpenChange={(o) => !o && setPulse(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pulse?.label}</DialogTitle>
            <DialogDescription>
              Sends one momentary command to GTPL-141. The gateway resets the bit itself. A completed pulse
              does not confirm that the machine physically started or stopped.
            </DialogDescription>
          </DialogHeader>
          {(blocked || pulseRowBlock) && (
            <p className="text-muted-foreground text-xs">Locked: {blocked ?? pulseRowBlock}</p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPulse(null)}>
              Cancel
            </Button>
            <Button
              disabled={!pulse || !!blocked || !!pulseRowBlock || submitting}
              onClick={() => {
                if (!pulse) return;
                const intent = buildIntent(pulse.tag, true, false);
                setPulse(null);
                send(intent);
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspection review */}
      <Dialog open={!!review} onOpenChange={(o) => !o && setReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record local inspection</DialogTitle>
            <DialogDescription>
              {review?.tag} → {formatValue(review?.value)}. This records what you saw at the PLC/HMI; it does
              not resend or force any value.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 text-sm" role="radiogroup">
            {[
              ["requested_change_confirmed", "The requested change is confirmed at the PLC/HMI"],
              ["different_state_confirmed", "Actual state differs from the requested change"],
              ["unable_to_confirm", "I cannot confirm yet"],
            ].map(([v, label]) => (
              <label key={v} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="review-outcome"
                  checked={reviewOutcome === v}
                  onChange={() => {
                    setReviewOutcome(v);
                    setReviewChecked(false);
                  }}
                />
                {label}
              </label>
            ))}
            {reviewOutcome && reviewOutcome !== "unable_to_confirm" && (
              <label className="mt-3 flex items-center gap-2 font-medium">
                <input
                  type="checkbox"
                  checked={reviewChecked}
                  onChange={(e) => setReviewChecked(e.target.checked)}
                />
                I physically inspected the PLC/HMI
              </label>
            )}
            {reviewOutcome === "unable_to_confirm" && (
              <p className="text-muted-foreground text-xs">The command stays unresolved. Nothing is submitted.</p>
            )}
            {review?.reset_required && (
              <p className="text-muted-foreground text-xs">
                A pulse reset is still pending; review cannot clear it.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReview(null)}>
              Close
            </Button>
            <Button
              disabled={!reviewChecked || reviewOutcome === "" || reviewOutcome === "unable_to_confirm"}
              onClick={submitReview}
            >
              Record inspection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
