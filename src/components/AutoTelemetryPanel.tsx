"use client";

import { motion } from "framer-motion";
import { Gauge, Thermometer, Waves, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Readout = { key: string; label: string; value: string };
export type Meter = { key: string; label: string; value: string; percent: number };
export type Toggle = { key: string; label: string; on: boolean };

interface AutoTelemetryPanelProps {
  title: string;
  temperatures: Readout[];
  meters: Meter[];
  pressures?: { lpLabel: string; lp: string; hpLabel: string; hp: string };
  valves?: Toggle[];
  t: (key: string) => string;
}

const SEGMENTS = 28;

/** Splits "15.4°C" / "62 psi" / "0%" into figure + unit so the unit can sit quiet. */
function splitUnit(value: string): [string, string] {
  const m = value.match(/^(-?[\d.,]+|--)\s*(.*)$/);
  return m ? [m[1], m[2]] : [value, ""];
}

function SectionRule({
  icon: Icon,
  tone,
  children,
}: {
  icon: LucideIcon;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <Icon className={`h-3.5 w-3.5 ${tone}`} />
      <span className="text-[10px] font-bold tracking-[0.22em] uppercase">
        {children}
      </span>
      <span className="bg-border/70 h-px flex-1" />
    </div>
  );
}

/** Industrial LED bar: discrete segments read far better than a smooth fill. */
function SegmentMeter({ percent }: { percent: number }) {
  const clamped = Math.min(Math.max(percent, 0), 100);
  const lit = Math.round((clamped / 100) * SEGMENTS);

  return (
    <div className="flex h-3 items-stretch gap-[2px]">
      {Array.from({ length: SEGMENTS }, (_, i) => {
        const on = i < lit;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0.25, scaleY: 0.5 }}
            animate={{ opacity: on ? 1 : 0.22, scaleY: 1 }}
            transition={{ duration: 0.25, delay: on ? i * 0.012 : 0 }}
            className="flex-1 rounded-[1px]"
            style={{
              background: on
                ? `color-mix(in oklch, var(--chart-2) ${Math.round(
                    (i / SEGMENTS) * 100
                  )}%, var(--primary))`
                : "var(--border)",
              boxShadow: on
                ? "0 0 6px color-mix(in oklch, var(--primary) 55%, transparent)"
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}

function Figure({ value, className = "" }: { value: string; className?: string }) {
  const [figure, unit] = splitUnit(value);
  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {figure}
      {unit && (
        <span className="text-muted-foreground ml-1 text-[0.65em] font-semibold tracking-wide">
          {unit}
        </span>
      )}
    </span>
  );
}

export function AutoTelemetryPanel({
  title,
  temperatures,
  meters,
  pressures,
  valves,
  t,
}: AutoTelemetryPanelProps) {
  return (
    <div className="surface glow-edge relative overflow-hidden">
      {/* Instrument texture: fine grid + top hairline, both static */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--primary), color-mix(in oklch, var(--chart-2) 80%, transparent), transparent)",
        }}
      />

      <div className="relative p-5">
        {/* Panel identity strip */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="plate text-primary flex h-9 w-9 items-center justify-center rounded-lg">
              <Gauge className="h-4 w-4" />
            </span>
            <div>
              <div className="text-muted-foreground text-[10px] font-bold tracking-[0.22em] uppercase">
                Live telemetry
              </div>
              <div className="text-base leading-tight font-semibold tracking-tight">
                {title}
              </div>
            </div>
          </div>
          <span className="border-primary/30 bg-primary/10 text-primary rounded px-2 py-1 font-mono text-[10px] font-bold tracking-widest">
            RT
          </span>
        </div>

        <div className="mt-6 grid gap-x-8 gap-y-7 md:grid-cols-2 xl:grid-cols-3">

        {temperatures.length > 0 && (
          <section>
            <SectionRule icon={Thermometer} tone="text-warning">
              {t("Temperature")}
            </SectionRule>

            <div className="space-y-1.5">
              {temperatures.map((row, index) => (
                <motion.div
                  key={row.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                  className="group border-border/60 bg-background/40 hover:border-primary/40 relative flex items-center justify-between gap-3 overflow-hidden rounded-lg border py-2.5 pr-3.5 pl-4 transition-colors duration-[var(--motion-fast)]"
                >
                  {/* accent spine */}
                  <span
                    aria-hidden
                    className="bg-warning/70 absolute inset-y-0 left-0 w-[3px]"
                  />
                  <span className="text-muted-foreground text-[13px] font-medium">
                    {row.label}
                  </span>
                  <Figure value={row.value} className="text-lg font-semibold" />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {meters.length > 0 && (
          <section>
            <SectionRule icon={Zap} tone="text-primary">
              {t("Drives")}
            </SectionRule>

            <div className="space-y-3.5">
              {meters.map((meter, index) => (
                <motion.div
                  key={meter.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-muted-foreground text-[13px] font-medium">
                      {meter.label}
                    </span>
                    <Figure value={meter.value} className="text-sm font-bold" />
                  </div>
                  <SegmentMeter percent={meter.percent} />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {pressures && (
          <section className="self-start">
            <SectionRule icon={Waves} tone="text-primary">
              {t("Pressure")}
            </SectionRule>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: pressures.lpLabel, value: pressures.lp, accent: "var(--chart-2)" },
                { label: pressures.hpLabel, value: pressures.hp, accent: "var(--destructive)" },
              ].map((cell) => (
                <div
                  key={cell.label}
                  className="plate relative overflow-hidden rounded-lg px-3.5 py-3"
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[3px]"
                    style={{ background: cell.accent }}
                  />
                  <div className="text-muted-foreground text-[10px] font-bold tracking-[0.18em] uppercase">
                    {cell.label}
                  </div>
                  <Figure
                    value={cell.value}
                    className="mt-1 block text-xl font-semibold"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {valves && valves.length > 0 && (
          <section className="self-start md:col-span-2 xl:col-span-1">
            <SectionRule icon={Gauge} tone="text-primary">
              CR Valve
            </SectionRule>

            <div className="grid grid-cols-4 gap-2">
              {valves.map((valve) => (
                <div
                  key={valve.key}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border py-2.5 transition-colors duration-[var(--motion-fast)] ${
                    valve.on
                      ? "border-success/45 bg-success/12"
                      : "border-border/60 bg-background/40"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      valve.on
                        ? "pulse-dot bg-success"
                        : "bg-muted-foreground/40"
                    }`}
                  />
                  <span className="font-mono text-xs font-bold tabular-nums">
                    {valve.label}
                  </span>
                  <span
                    className={`text-[9px] font-bold tracking-widest ${
                      valve.on ? "text-success" : "text-muted-foreground/70"
                    }`}
                  >
                    {valve.on ? "ON" : "OFF"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
}

export default AutoTelemetryPanel;
