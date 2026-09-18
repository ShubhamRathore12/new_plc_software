"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SignalHigh, SignalZero } from "lucide-react";
import { useMachineStatus } from "@/providers/machine-status-provider";
import { useLanguage } from "@/providers/language-provider";
import { useDataStore } from "@/lib/store";
import { useSession } from "@/providers/session-provider";
import { normalizeMachineId } from "@/lib/session";

const allDevices = [
  { name: "GTPL-122-gT-1000T-S7-1200", location: "Noida---kanpur", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-1000T" },
  { name: "GTPL-118-gT-60T-S7-200", location: "Noida", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-60T" },
  { name: "GTPL-149-gT-60T-S7-1200", location: "Telangana", image: "/images/200.jpg", plc: "S7-1200", chillerModel: "gT-60T" },
  { name: "GTPL-108-gT-40E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-40E-P" },
  { name: "GTPL-109-gT-40E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-40E-P" },
  { name: "GTPL-110-gT-40E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-40E-P" },
  { name: "GTPL-111-gT-80E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
  { name: "GTPL-112-gT-80E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
  { name: "GTPL-113-gT-80E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
  { name: "GTPL-114-gT-140E-S7-1200", location: "Germany", image: "/images/300.jpeg", plc: "S7-1200", chillerModel: "gT-140E" },
  { name: "GTPL-115-gT-180E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-180E" },
  { name: "GTPL-116-gT-240E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-240E" },
  { name: "GTPL-117-gT-320E-S7-1200", location: "Germany", image: "/images/320.jpeg", plc: "S7-1200", chillerModel: "gT-320E" },
  { name: "GTPL-119-gT-180E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-180E" },
  { name: "GTPL-120-gT-180E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-180E" },
  { name: "GTPL-121-gT-1000T-S7-1200", location: "Noida---kanpur", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-1000T" },
  { name: "GTPL-030-gT-180E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-180E" },
  { name: "GTPL-061-gT-450T-S7-1200", location: "Turkey", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450T" },
  { name: "GTPL-124-gT-450T-S7-1200", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450T" },
  { name: "GTPL-134-gT-450T-S7-1200", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450T" },
  { name: "GTPL-135-gT-450T-S7-1200", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450T" },
  { name: "GTPL-137-gT-450T-S7-1200", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450T" },
  { name: "GTPL-138-gT-450T-S7-1200", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450T" },
  { name: "GTPL-145-gT-450T-S7-1200", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450T" },
  { name: "GTPL-148-gT-450T-S7-1200", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450T" },
  { name: "GTPL-133-gT-650T-S7-1200", location: "India", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
  { name: "GTPL-154-gT-650T-S7-1200", location: "India", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
  { name: "GTPL-155-gT-650T-S7-1200", location: "India", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
  { name: "GTPL-081-gT-650T-S7-1200", location: "India", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
  { name: "GTPL-105-gT-650T-S7-1200", location: "India", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
  { name: "GTPL-068-gT-650T-S7-1200", location: "India", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
  { name: "GTPL-104-gT-650T-S7-1200", location: "India", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
  { name: "GTPL-131-gT-650T-S7-1200", location: "India", image: "/images/650.jpeg", plc: "S7-1200", chillerModel: "gT-650T" },
  { name: "GTPL-132-300-AP-S7-1200", location: "India", image: "/images/300.jpeg", plc: "S7-1200", chillerModel: "gT-300AP" },
  { name: "GTPL-136-gT-450AP-S7-1200", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450AP" },
  { name: "GTPL-142-gT-450AP-S7-1200", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450AP" },
  { name: "GTPL-123-gT-450AP", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450AP" },
  { name: "GTPL-139-gT-300AP-S7-1200", location: "India", image: "/images/300.jpeg", plc: "S7-1200", chillerModel: "gT-300AP" },
  { name: "GTPL-143-gT-450AP-S7-1200", location: "India", image: "/images/450.jpeg", plc: "S7-1200", chillerModel: "gT-450AP" },
  { name: "GTPL-144-gT-300AP-S7-1200", location: "India", image: "/images/300.jpeg", plc: "S7-1200", chillerModel: "gT-300AP" },
];

export default function ActivityPanel() {
  const { t } = useLanguage();
  const { data } = useDataStore();
  const { status } = useMachineStatus();
  const [visibleDevices, setVisibleDevices] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [onlyRunning, setOnlyRunning] = useState(false);
  const { session, machines: sessionMachines } = useSession();
  const serverScoped = session?.source === "server";

  useEffect(() => {
    // The server scopes the session to this account's machines, so that list
    // is used as-is. The monitorAccess grant below is the fallback for
    // backends without the session endpoint.
    if (serverScoped) {
      setVisibleDevices(
        sessionMachines.map((machine) => {
          const wanted = normalizeMachineId(machine.machineName);
          return (
            allDevices.find(
              (device) => normalizeMachineId(device.name) === wanted
            ) ?? {
              name: machine.machineName,
              location: "",
              image: "/images/1200.jpg",
              plc: "",
              chillerModel: "",
            }
          );
        })
      );
      return;
    }

    const accessList =
      typeof data.monitorAccess === "string"
        ? data.monitorAccess.split(",").map((x: any) => x.trim())
        : Array.isArray(data.monitorAccess)
          ? data.monitorAccess.map((x: any) => x.trim())
          : [];

    const deviceAccessList = accessList.filter((item: any) =>
      item.startsWith("GTPL-")
    );

    setVisibleDevices(
      allDevices.filter(
        (device) => !deviceAccessList.includes(device.name.trim())
      )
    );
  }, [data, serverScoped, sessionMachines]);

  /** device name -> live feed entry (GTPL-157-... -> GTPL_157) */
  const statusFor = (deviceName: string) => {
    const match = deviceName.match(/GTPL[-_]?(\d+)/i);
    const key = match ? `GTPL_${match[1].padStart(3, "0")}` : deviceName;
    return status.machines.find((m) => m.machineName === key);
  };

  const rows = useMemo(() => {
    const term = query.trim().toLowerCase();
    return visibleDevices
      .map((device) => {
        const feed = statusFor(device.name);
        return {
          ...device,
          running: feed?.machineStatus ?? false,
          online: feed?.internetStatus ?? false,
          // Without this an operator cannot tell a machine that is genuinely
          // stopped from one that stopped reporting (F-11).
          lastSeen: feed?.lastUpdate ?? null,
        };
      })
      .filter((d) => (onlyRunning ? d.running : true))
      .filter(
        (d) =>
          !term ||
          d.name.toLowerCase().includes(term) ||
          d.location?.toLowerCase().includes(term) ||
          d.chillerModel?.toLowerCase().includes(term)
      )
      .sort((a, b) => Number(b.running) - Number(a.running));
  }, [visibleDevices, status.machines, query, onlyRunning]);

  const runningCount = rows.filter((r) => r.running).length;

  return (
    <section className="surface flex h-full flex-col overflow-hidden p-0">
      {/* Header */}
      <header className="border-border/70 flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="status-dot" data-live={runningCount > 0} />
          <h2 className="text-sm font-semibold tracking-tight capitalize">
            {t("device_activity")}
          </h2>
          <span className="bg-muted text-muted-foreground tabular rounded-full px-2 py-0.5 text-[11px] font-semibold">
            {runningCount}/{rows.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={onlyRunning}
            onClick={() => setOnlyRunning((v) => !v)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors duration-[var(--motion-fast)] ${
              onlyRunning
                ? "bg-success/15 text-success ring-success/25 ring-1"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            Running only
          </button>
          <div className="relative">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2" />
            <input
              id="activity-filter"
              aria-label={t("search")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter machines"
              className="border-border bg-background focus-visible:border-ring focus-visible:ring-ring/25 h-8 w-40 rounded-lg border pr-2 pl-7 text-xs outline-none focus-visible:ring-[3px] sm:w-52"
            />
          </div>
        </div>
      </header>

      {/* Legend: the dots meant nothing without one (F-11). */}
      <div className="text-muted-foreground border-border/70 flex flex-wrap items-center gap-4 border-b px-4 py-2 text-[11px]">
        <span className="flex items-center gap-1.5">
          <span className="status-dot" data-live={true} aria-hidden="true" />
          Running
        </span>
        <span className="flex items-center gap-1.5">
          <span className="status-dot" data-live={false} aria-hidden="true" />
          Stopped
        </span>
        <span className="flex items-center gap-1.5">
          <SignalHigh className="h-3.5 w-3.5" aria-hidden="true" />
          Reporting
        </span>
        <span className="flex items-center gap-1.5">
          <SignalZero className="h-3.5 w-3.5" aria-hidden="true" />
          No link
        </span>
      </div>

      {/* List */}
      <div className="max-h-[26rem] flex-1 overflow-y-auto p-2">
        {rows.length > 0 ? (
          <ul className="space-y-1">
            {rows.map((device: any, index: number) => (
              <li
                key={`${device.name}-${index}`}
                className="hover:bg-accent/60 group flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors duration-[var(--motion-fast)] [content-visibility:auto] [contain-intrinsic-size:auto_52px]"
              >
                <span className="status-dot" data-live={device.running} />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{device.name}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {[device.plc, device.chillerModel, device.location]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <p className="text-muted-foreground/80 truncate text-[11px]">
                    {t("last_update")}:{" "}
                    {device.lastSeen
                      ? new Date(device.lastSeen).toLocaleString()
                      : t("never")}
                  </p>
                </div>

                <span
                  className={`flex items-center gap-1 text-[11px] font-semibold ${
                    device.online ? "text-success" : "text-muted-foreground/60"
                  }`}
                  title={device.online ? "Online" : "No link"}
                >
                  {device.online ? (
                    <SignalHigh className="h-3.5 w-3.5" />
                  ) : (
                    <SignalZero className="h-3.5 w-3.5" />
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground p-6 text-center text-sm">
            {t("no_devices_to_display") || "No devices to display."}
          </p>
        )}
      </div>
    </section>
  );
}
