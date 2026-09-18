"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";

import { useAutoData } from "@/hooks/useAutoData";
import { ConnectionStatus } from "@/components/ui/connection-status";
import Home from "@/components/aeration-control";
import useIsMobile from "@/hooks/useIsMobile";
import { useLanguage } from "@/providers/language-provider";
import AerationDiagram from "@/components/AerationDiagram";
import DiagramFrame from "@/components/DiagramFrame";
import AutoTelemetryPanel from "@/components/AutoTelemetryPanel";
import { ArrowLeft, Hash, Play, Square, Wind } from "lucide-react";
import { canStartAeration, readAeration } from "@/lib/aerationReadings";


export default function AerationWithoutHeatingPage() {
  const router = useRouter();
  const heat = useParams();
  const devices = heat["without-heating"];
  const {
    data,
    isConnected,
    telemetryState,
    lastUpdatedAt,
    isShowingStaleData,
    error,
    formatValue,
  } = useAutoData(
    devices as string
  );

  const {t} = useLanguage()

  // One reader for every measurement on this screen — the diagram below uses
  // the same one, so the two renderings cannot disagree (F-14).
  const readings = readAeration(data);
  const isRunning = readings.isRunning;
  const continuousMode = readings.continuousMode;

  // The field is an editable set-point: seeded from the PLC value, then owned
  // by the operator until the machine reports a new one. Previously `value`
  // was bound to the PLC reading while onChange wrote to unused local state,
  // so typing in the box did nothing.
  const [durationInput, setDurationInput] = useState<number | null>(null);
  useEffect(() => {
    setDurationInput(null);
  }, [devices]);
  const duration = durationInput ?? readings.durationHours;

  const startAllowed = canStartAeration({
    continuousMode,
    durationHours: duration,
  });

  const handleBack = () => {
    router.push(`/menu/${devices}`);
  };


  const isMobile = useIsMobile();


  // ── panel data ──────────────────────────────────────────────────────────
  const ambientRaw = readings.ambient;
  const supplyRaw = readings.supply;
  const humidityRaw = readings.humidity;
  const blowerRaw = readings.blower;

  const supplyLabel =
    devices === "GTPL-121-gT-1000T-S7-1200" ? t("T0") : t("TH");

  const temperatureRows = [
    {
      key: "supply",
      label: `${supplyLabel} (${t("After Heat")})`,
      value: formatValue(supplyRaw, "\u00b0C"),
    },
    {
      key: "ambient",
      label: t("Ambient(T2)"),
      value: formatValue(ambientRaw, "\u00b0C"),
    },
    {
      key: "humidity",
      label: t("RH"),
      value: formatValue(humidityRaw, "%"),
    },
  ];

  const meterRows = [
    {
      key: "blower",
      label: t("Blower"),
      value: formatValue(blowerRaw, "%"),
      percent: parseFloat(blowerRaw) || 0,
    },
  ];
  return (
    <PageTransition>
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        {/* Ambient ground - static, so it costs one paint and never repaints */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/4 h-96 w-96 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklch, var(--primary) 14%, transparent), transparent)",
            }}
          />
          <div
            className="absolute right-1/4 bottom-0 h-96 w-96 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, color-mix(in oklch, var(--chart-2) 13%, transparent), transparent)",
            }}
          />
        </div>

        <main className="relative z-10 w-full flex-1 px-4 py-8 md:px-8">
          <AnimatedContainer className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="plate text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Wind className="h-6 w-6" />
                </span>
                <div>
                  <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                    {t("Aeration Mode")}
                  </span>
                  {/* The selected mode stays in the heading — dropping it left
                      two different screens with the same title (F-14). */}
                  <h1 className="gradient-text text-3xl leading-tight font-semibold tracking-tight">
                    {t("AERATION")} — {t("Without Heating")}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="plate inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold">
                  <Hash className="text-muted-foreground h-3.5 w-3.5" />
                  <span className="text-muted-foreground tracking-[0.18em]">SR</span>
                  <span className="font-mono tracking-wider">{devices}</span>
                </span>
                {/* "LIVE" with no timestamp is unverifiable; this states the
                    lifecycle state and the age of the readings (F-16). */}
                <ConnectionStatus
                  state={telemetryState}
                  lastUpdatedAt={lastUpdatedAt}
                  isStale={isShowingStaleData}
                  error={error}
                />
                <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold tracking-[0.18em]">
                  {Boolean(continuousMode) ? "CONTINUOUS" : "TIMED"}
                </span>
              </div>
            </div>
            {error && (
              <div className="border-destructive/30 bg-destructive/10 text-destructive mt-4 rounded-lg border px-3 py-2 text-sm">
                {error}
              </div>
            )}
          </AnimatedContainer>

          {/* Diagram fills the width; readings and controls sit underneath */}
          <div className="space-y-6">
            <AnimatedContainer delay={1}>
              <DiagramFrame
                label="Process Diagram"
                machine={devices as string}
                live={isConnected}
              >
                {isMobile ? (
                  <Home
                    data={data}
                    devices={devices}
                    heat={heat}
                    title="Aeration without heating"
                    formatValue={formatValue}
                  />
                ) : (
                  <AerationDiagram
                    data={data}
                    formatValue={formatValue}
                    machineName={devices as string}
                    heated={false}
                  />
                )}
              </DiagramFrame>
            </AnimatedContainer>

            <AnimatedContainer delay={2}>
              <AutoTelemetryPanel
                title={t("Temperature")}
                temperatures={temperatureRows}
                meters={meterRows}
                t={t}
              />
            </AnimatedContainer>

            <AnimatedContainer delay={3}>
              <div className="surface glow-edge relative overflow-hidden p-5">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, var(--primary), color-mix(in oklch, var(--chart-2) 80%, transparent), transparent)",
                  }}
                />

                <div className="mb-5 flex items-center gap-3">
                  <span className="plate text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                    <Wind className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-muted-foreground text-[10px] font-bold tracking-[0.22em] uppercase">
                      Control
                    </div>
                    <div className="text-base leading-tight font-semibold tracking-tight">
                      {t("Aeration Control")}
                    </div>
                  </div>
                </div>

                <div className="grid gap-x-8 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
                  <div className="space-y-4">
                    <div className="border-border/60 bg-background/40 flex items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5">
                      <Label
                        htmlFor="continuous-mode"
                        className="text-[13px] font-medium"
                      >
                        {t("Continuous Mode")}
                      </Label>
                      <Switch id="continuous-mode" checked={Boolean(continuousMode)} />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <Label
                        htmlFor="duration-set"
                        className="text-muted-foreground text-[13px] font-medium"
                      >
                        {t("Set Duration")}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          id="duration-set"
                          type="number"
                          aria-label={t("duration_hours")}
                          value={Number.isFinite(duration) ? duration : 0}
                          onChange={(e) =>
                            setDurationInput(Number.parseInt(e.target.value) || 0)
                          }
                          className="h-9 w-20 text-right font-mono"
                          min={0}
                          max={999}
                          step={1}
                        />
                        <span className="text-muted-foreground w-8 text-xs font-semibold">
                          {t("h")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-muted-foreground text-[10px] font-bold tracking-[0.22em] uppercase">
                      {t("Running Time")}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="plate rounded-lg px-3.5 py-3">
                        <div className="text-muted-foreground text-[10px] font-bold tracking-[0.18em] uppercase">
                          {t("h")}
                        </div>
                        <div className="mt-1 font-mono text-xl font-semibold tabular-nums">
                          {readings.runningHours ?? "--"}
                        </div>
                      </div>
                      <div className="plate rounded-lg px-3.5 py-3">
                        <div className="text-muted-foreground text-[10px] font-bold tracking-[0.18em] uppercase">
                          {t("min")}
                        </div>
                        <div className="mt-1 font-mono text-xl font-semibold tabular-nums">
                          {readings.runningMinutes ?? "--"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end gap-3">
                    {isRunning ? (
                      <Button
                        variant="destructive"
                        className="h-11 w-full gap-2 text-sm font-semibold"
                      >
                        <Square className="h-4 w-4" />
                        {t("Stop")}
                      </Button>
                    ) : (
                      <Button
                        className="sheen h-11 w-full gap-2 text-sm font-semibold"
                        disabled={!startAllowed}
                        aria-describedby={
                          startAllowed ? undefined : "aeration-start-hint"
                        }
                      >
                        <Play className="h-4 w-4" aria-hidden="true" />
                        {t("aeration_start")}
                      </Button>
                    )}

                    {!startAllowed && (
                      <p
                        id="aeration-start-hint"
                        className="text-muted-foreground text-xs"
                      >
                        {t("aeration_duration_required")}
                      </p>
                    )}

                    <Button
                      variant="outline"
                      className="group depth-lift h-11 w-full text-sm font-semibold"
                      onClick={handleBack}
                    >
                      <ArrowLeft className="h-4 w-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-x-0.5" />
                      {t("BACK")}
                    </Button>
                  </div>
                </div>
              </div>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
