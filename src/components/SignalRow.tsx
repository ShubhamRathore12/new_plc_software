"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

interface SignalRowProps {
  /** PLC address, e.g. "I0.2" / "Q1.1". */
  id: string;
  description: string;
  /** True when the signal is in its alarm/energised state. */
  active: boolean;
  activeLabel?: string;
  idleLabel?: string;
  /** Alarm styling for faults, energised styling for outputs. */
  tone?: "fault" | "energised";
  index?: number;
}

/**
 * One digital IO line. Inputs and outputs render the same row so a fault reads
 * identically on both screens; only the tone and wording differ.
 */
export function SignalRow({
  id,
  description,
  active,
  activeLabel,
  idleLabel,
  tone = "fault",
  index = 0,
}: SignalRowProps) {
  const alarm = tone === "fault" && active;
  const energised = tone === "energised" && active;
  const lit = alarm || energised;

  const spine = alarm
    ? "var(--destructive)"
    : energised
      ? "var(--success)"
      : "var(--border)";

  // .surface is unlayered CSS, so it outranks Tailwind's layered border/bg
  // utilities. The alarm tint has to be inline to win the cascade.
  const stateStyle = alarm
    ? {
        borderColor: "color-mix(in oklch, var(--destructive) 45%, var(--border))",
        backgroundColor: "color-mix(in oklch, var(--destructive) 10%, var(--card))",
      }
    : energised
      ? {
          borderColor: "color-mix(in oklch, var(--success) 40%, var(--border))",
          backgroundColor: "color-mix(in oklch, var(--success) 8%, var(--card))",
        }
      : {};

  return (
    <div
      className="surface depth-lift relative flex items-center gap-4 overflow-hidden py-3 pr-4 pl-5"
      style={{ animationDelay: `${index * 0.03}s`, ...stateStyle }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: spine }}
      />

      <span className="plate flex h-11 w-14 shrink-0 items-center justify-center rounded-lg">
        <span
          className="font-mono text-xs font-bold tracking-wider"
          style={alarm ? { color: "var(--destructive)" } : undefined}
        >
          {id}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium"
          style={alarm ? { color: "var(--destructive)" } : undefined}
        >
          {description}
        </p>
        <p
          className="text-muted-foreground mt-1 flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase"
          style={alarm ? { color: "var(--destructive)" } : undefined}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              alarm
                ? "pulse-dot bg-destructive"
                : energised
                  ? "pulse-dot bg-success"
                  : "bg-muted-foreground/40"
            }`}
          />
          {lit
            ? (activeLabel ?? (tone === "fault" ? "Active alert" : "Energised"))
            : (idleLabel ?? (tone === "fault" ? "Normal" : "Off"))}
        </p>
      </div>

      <span
        className="border-border bg-muted/40 text-muted-foreground/60 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
        style={
          alarm
            ? {
                borderColor: "color-mix(in oklch, var(--destructive) 50%, transparent)",
                backgroundColor: "color-mix(in oklch, var(--destructive) 14%, transparent)",
                color: "var(--destructive)",
              }
            : energised
              ? {
                  borderColor: "color-mix(in oklch, var(--success) 45%, transparent)",
                  backgroundColor: "color-mix(in oklch, var(--success) 14%, transparent)",
                  color: "var(--success)",
                }
              : undefined
        }
      >
        {alarm ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
      </span>
    </div>
  );
}

export default SignalRow;

interface AnalogRowProps {
  description: string;
  value: string;
  unit: string;
  /** True when a live PLC value backs this reading, not a template default. */
  live?: boolean;
  icon?: React.ReactNode;
}

/** One analog reading: label left, figure right, unit kept quiet beside it. */
export function AnalogRow({
  description,
  value,
  unit,
  live = false,
  icon,
}: AnalogRowProps) {
  const showUnit = value && !value.toString().includes(unit);

  return (
    <div className="surface depth-lift relative flex items-center justify-between gap-3 overflow-hidden py-3 pr-4 pl-5">
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px]"
        style={{ background: live ? "var(--primary)" : "var(--border)" }}
      />

      <div className="flex min-w-0 items-center gap-2.5">
        {icon}
        <span className="truncate text-sm font-medium">{description}</span>
      </div>

      <div className="flex shrink-0 items-baseline gap-1.5">
        <span className="font-mono text-xl font-semibold tabular-nums">
          {value}
        </span>
        {showUnit && (
          <span className="text-muted-foreground text-xs font-semibold">
            {unit}
          </span>
        )}
        {live && (
          // The dot is explained by the legend on the page; it also carries its
          // own accessible name so it is not a green dot with no meaning (F-17).
          <span
            role="img"
            aria-label="Live value from the machine"
            title="Live value from the machine"
            className="pulse-dot bg-success ml-1.5 h-1.5 w-1.5 self-center rounded-full"
          />
        )}
      </div>
    </div>
  );
}
