"use client";

import { ArrowLeft, Hash } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export type HeaderStat = { label: string; value: string | number; tone?: "default" | "success" | "warning" | "danger" };

interface ScreenHeaderProps {
  icon: LucideIcon;
  eyebrow: string;
  title: React.ReactNode;
  /** Machine serial, rendered as an instrument label. */
  machine?: string;
  connected?: boolean;
  onBack?: () => void;
  /** Extra chips rendered after the connection pill. */
  children?: React.ReactNode;
}

/**
 * The header every machine screen shares: identity on the left, live state on
 * the right. Keeping it in one place is what stops the screens from drifting
 * apart again.
 */
export function ScreenHeader({
  icon: Icon,
  eyebrow,
  title,
  machine,
  connected,
  onBack,
  children,
}: ScreenHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        {onBack && (
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            aria-label="Back"
            className="group depth-lift h-11 w-11 rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-x-0.5" />
          </Button>
        )}

        <span className="plate text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
          <Icon className="h-6 w-6" />
        </span>

        <div>
          <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
            {eyebrow}
          </span>
          <h1 className="gradient-text text-3xl leading-tight font-semibold tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        {machine && (
          <span className="plate inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold">
            <Hash className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-muted-foreground tracking-[0.18em]">SR</span>
            <span className="font-mono tracking-wider">{machine}</span>
          </span>
        )}

        {connected !== undefined && (
          <span
            className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
              connected
                ? "border-success/35 bg-success/10 text-success"
                : "border-destructive/35 bg-destructive/10 text-destructive"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                connected ? "pulse-dot bg-success" : "bg-destructive"
              }`}
            />
            <span className="font-mono tracking-[0.18em]">
              {connected ? "LIVE" : "OFFLINE"}
            </span>
          </span>
        )}

        {children}
      </div>
    </div>
  );
}

const TONES: Record<string, { text: string; spine: string }> = {
  default: { text: "text-primary", spine: "var(--primary)" },
  success: { text: "text-success", spine: "var(--success)" },
  warning: { text: "text-warning", spine: "var(--warning)" },
  danger: { text: "text-destructive", spine: "var(--destructive)" },
};

/** Counter tiles that sit under a screen header. */
export function StatStrip({
  stats,
}: {
  stats: { label: string; value: string | number; icon: LucideIcon; tone?: keyof typeof TONES }[];
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map(({ label, value, icon: Icon, tone = "default" }) => {
        const { text, spine } = TONES[tone] ?? TONES.default;
        return (
          <div
            key={label}
            className="surface depth-lift relative flex items-center gap-4 overflow-hidden p-4"
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-[3px]"
              style={{ background: spine }}
            />
            <span className={`plate flex h-11 w-11 items-center justify-center rounded-xl ${text}`}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-muted-foreground text-[10px] font-bold tracking-[0.18em] uppercase">
                {label}
              </div>
              <div className="font-mono text-2xl font-semibold tabular-nums">
                {value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ScreenHeader;
