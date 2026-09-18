"use client";

import { AlertTriangle, Loader2, Radio, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { TelemetryState } from "@/hooks/useAutoData";
import { useLanguage } from "@/providers/language-provider";

interface ConnectionStatusProps {
  /** Lifecycle of the telemetry feed. "connecting" is not "disconnected". */
  state: TelemetryState;
  /** When the values on screen were read. Null before the first response. */
  lastUpdatedAt: Date | null;
  /** True when values are shown but are no longer known to be current. */
  isStale: boolean;
  error?: string | null;
  className?: string;
}

function formatAge(from: Date, now: number): string {
  const seconds = Math.max(0, Math.round((now - from.getTime()) / 1000));
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  return `${Math.round(minutes / 60)}h`;
}

/**
 * Data-freshness indicator (F-16).
 *
 * A screen labelled "Live" with no timestamp gives an operator no way to tell a
 * real zero from a reading that stopped arriving. This shows the lifecycle
 * state and the age of the values, and it sits in the page flow rather than
 * being pinned over the header (F-10).
 */
export function ConnectionStatus({
  state,
  lastUpdatedAt,
  isStale,
  error,
  className,
}: ConnectionStatusProps) {
  const { t } = useLanguage();
  const now = Date.now();

  const label =
    state === "connecting"
      ? t("connecting")
      : state === "reconnecting"
        ? t("connecting")
        : state === "machine-off"
          ? t("Machine off")
          : isStale
            ? t("stale_data")
            : t("live");

  const tone =
    state === "live" && !isStale
      ? "default"
      : state === "connecting" || state === "reconnecting"
        ? "secondary"
        : "destructive";

  const Icon =
    state === "connecting" || state === "reconnecting"
      ? Loader2
      : state === "machine-off"
        ? WifiOff
        : isStale
          ? AlertTriangle
          : Radio;

  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${className ?? ""}`}
      role="status"
      aria-live="polite"
    >
      <Badge variant={tone as any} className="flex items-center gap-2 px-3 py-1">
        <Icon
          className={`h-3.5 w-3.5 ${
            state === "connecting" || state === "reconnecting"
              ? "animate-spin"
              : ""
          }`}
          aria-hidden="true"
        />
        <span className="text-sm">{label}</span>
      </Badge>

      {/* The timestamp is the point: "Live" without one is unverifiable. */}
      <span className="text-muted-foreground text-xs">
        {t("last_update")}:{" "}
        {lastUpdatedAt ? (
          <time dateTime={lastUpdatedAt.toISOString()}>
            {lastUpdatedAt.toLocaleTimeString()} ({formatAge(lastUpdatedAt, now)})
          </time>
        ) : (
          t("never")
        )}
      </span>

      {error && state !== "live" && (
        <span className="text-destructive text-xs">{error}</span>
      )}
    </div>
  );
}
