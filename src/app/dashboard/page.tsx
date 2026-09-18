"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Activity, Gauge, Snowflake, Wifi } from "lucide-react";
import { useMachineStatus } from "@/providers/machine-status-provider";
import { ALL_DEVICES } from "@/lib/devices";

// Dynamically imported: leaflet and these panels are browser-only
const MapView = dynamic(() => import("@/components/layout/mapview"), {
  ssr: false,
  loading: () => <div className="skeleton h-[22rem] w-full md:h-[30rem]" />,
});
const ActivityPanel = dynamic(
  () => import("@/components/layout/activity-panel"),
  { ssr: false, loading: () => <div className="skeleton h-96 w-full" /> }
);

type Tone = "primary" | "success" | "warning" | "muted";

interface Kpi {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: Tone;
}

const toneClasses: Record<Tone, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/15 text-warning",
  muted: "bg-muted text-muted-foreground",
};

export default function Dashboard() {
  const { status, isLoading } = useMachineStatus();

  const kpis = useMemo<Kpi[]>(() => {
    const machines = status.machines;
    const running = machines.filter((m) => m.machineStatus).length;
    const online = machines.filter((m) => m.internetStatus).length;
    const cooling = machines.filter((m) => m.coolingStatus).length;
    const fleet = ALL_DEVICES.length;

    return [
      {
        label: "Machines running",
        value: String(running),
        hint: `of ${machines.length || fleet} reporting`,
        icon: Activity,
        tone: "success",
      },
      {
        label: "Cooling active",
        value: String(cooling),
        hint: running ? `${Math.round((cooling / Math.max(running, 1)) * 100)}% of running` : "none active",
        icon: Snowflake,
        tone: "primary",
      },
      {
        label: "Links online",
        value: String(online),
        hint: `${Math.max(machines.length - online, 0)} without link`,
        icon: Wifi,
        tone: (online === machines.length ? "success" : "warning") as Tone,
      },
      {
        label: "Fleet size",
        value: String(fleet),
        hint: "machines registered",
        icon: Gauge,
        tone: "muted",
      },
    ];
  }, [status.machines]);

  return (
    <div className="space-y-5 pt-2">
      {/* KPI row */}
      <div className="stagger grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map(({ label, value, hint, icon: Icon, tone }) => (
          <div key={label} className="surface flex items-center gap-3.5 p-4">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-muted-foreground truncate text-xs font-medium">
                {label}
              </p>
              {isLoading ? (
                <span className="skeleton mt-1 block h-6 w-10" />
              ) : (
                <p className="tabular text-2xl leading-tight font-semibold tracking-tight">
                  {value}
                </p>
              )}
              <p className="text-muted-foreground/80 truncate text-[11px]">
                {hint}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Map + activity */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="animate-fade-in">
          <MapView />
        </div>
        <div className="animate-fade-in">
          <ActivityPanel />
        </div>
      </div>
    </div>
  );
}
