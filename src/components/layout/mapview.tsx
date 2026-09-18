"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { ALL_DEVICES } from "@/lib/devices";
import { useMachineStatus } from "@/providers/machine-status-provider";
import { useTheme } from "@/providers/theme-provider";

/** Approximate centre for every location string used by ALL_DEVICES. */
const LOCATION_COORDS: Record<string, [number, number]> = {
  germany: [51.1657, 10.4515],
  france: [46.6034, 1.8883],
  turkey: [38.9637, 35.2433],
  thailand: [15.87, 100.9925],
  indonesia: [-2.5489, 118.0149],
  philippines: [12.8797, 121.774],
  vietnam: [14.0583, 108.2772],
  srilanka: [7.8731, 80.7718],
  kanpur: [26.4499, 80.3319],
  "noida---kanpur": [28.5708, 77.321],
  noida: [28.5708, 77.321],
  dharuhera: [28.2044, 76.7981],
  rajasthan: [27.0238, 74.2179],
  "ganga nagar": [29.9038, 73.8772],
  "ganganagar, rajasthan": [29.9038, 73.8772],
  "keshwana, rajasthan": [27.6094, 76.3376],
  "tamil nadu": [11.1271, 78.6569],
  "salem (tamil nadu)": [11.6643, 78.146],
  pondicherry: [11.9416, 79.8083],
  "raichur, karnataka": [16.2076, 77.3463],
  telangana: [17.1232, 79.2088],
  "a.p.": [15.9129, 79.74],
  "kakinada (ap)": [16.9891, 82.2475],
  bihar: [25.0961, 85.3131],
  india: [22.9734, 78.6569],
};

type SiteStatus = "running" | "idle" | "offline";

interface Site {
  key: string;
  label: string;
  position: [number, number];
  total: number;
  running: number;
  offline: number;
  machines: { name: string; running: boolean; online: boolean }[];
  status: SiteStatus;
}

/** device name (GTPL-157-gT-450T-S7-1200) -> status feed key (GTPL_157) */
const toStatusKey = (deviceName: string): string => {
  const match = deviceName.match(/GTPL[-_]?(\d+)/i);
  if (!match) return deviceName;
  return `GTPL_${match[1].padStart(3, "0")}`;
};

/** Pin with a soft halo — colour follows the site's live state. */
const buildIcon = (status: SiteStatus, count: number) =>
  L.divIcon({
    className: "gt-marker",
    html: `<span class="gt-marker__halo" data-status="${status}"></span>
           <span class="gt-marker__pin" data-status="${status}">${count}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -16],
  });

export default function MapView() {
  const { status } = useMachineStatus();
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);

  // `theme` can be "system"; read what the document actually resolved to
  useEffect(() => {
    const read = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [theme]);

  const sites = useMemo<Site[]>(() => {
    const byLocation = new Map<string, Site>();

    for (const device of ALL_DEVICES) {
      const key = device.location.trim().toLowerCase();
      const position = LOCATION_COORDS[key];
      if (!position) continue;

      const feed = status.machines.find(
        (m) => m.machineName === toStatusKey(device.name)
      );
      const running = feed?.machineStatus ?? false;
      const online = feed?.internetStatus ?? false;

      const existing = byLocation.get(key);
      if (existing) {
        existing.total += 1;
        existing.running += running ? 1 : 0;
        existing.offline += online ? 0 : 1;
        existing.machines.push({ name: device.name, running, online });
      } else {
        byLocation.set(key, {
          key,
          label: device.location,
          position,
          total: 1,
          running: running ? 1 : 0,
          offline: online ? 0 : 1,
          machines: [{ name: device.name, running, online }],
          status: "idle",
        });
      }
    }

    return Array.from(byLocation.values()).map((site) => ({
      ...site,
      status:
        site.running > 0
          ? "running"
          : site.offline === site.total
            ? "offline"
            : "idle",
    }));
  }, [status.machines]);

  const totals = useMemo(
    () =>
      sites.reduce(
        (acc, s) => ({
          sites: acc.sites + 1,
          machines: acc.machines + s.total,
          running: acc.running + s.running,
        }),
        { sites: 0, machines: 0, running: 0 }
      ),
    [sites]
  );

  // Esri's canvas basemaps are free and keyless, unlike CARTO's current
  // endpoint which stamps "API KEY REQUIRED" across every tile. Labels ship as
  // a separate reference layer, so the base stays clean under the markers.
  const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
  const tileUrl = isDark
    ? `${ESRI}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`
    : `${ESRI}/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}`;
  const labelUrl = isDark
    ? `${ESRI}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`
    : `${ESRI}/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}`;

  return (
    <div className="border-border/70 bg-card relative overflow-hidden rounded-xl border">
      {/* Overlay: live fleet summary */}
      <div className="pointer-events-none absolute top-3 left-3 z-[500] flex flex-wrap items-center gap-2">
        <span className="bg-background/85 border-border text-foreground flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-[var(--shadow-sm)] backdrop-blur">
          <span className="status-dot" data-live="true" />
          {totals.running} running
        </span>
        <span className="bg-background/85 border-border text-muted-foreground rounded-full border px-3 py-1.5 text-xs font-medium shadow-[var(--shadow-sm)] backdrop-blur">
          {totals.machines} machines · {totals.sites} sites
        </span>
      </div>

      {/* Overlay: legend */}
      <div className="bg-background/85 border-border text-muted-foreground pointer-events-none absolute right-3 bottom-8 z-[500] flex flex-col gap-1.5 rounded-lg border px-3 py-2 text-[11px] shadow-[var(--shadow-sm)] backdrop-blur">
        {[
          { label: "Running", cls: "bg-success" },
          { label: "Idle", cls: "bg-warning" },
          { label: "Offline", cls: "bg-muted-foreground/50" },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${item.cls}`} />
            {item.label}
          </span>
        ))}
      </div>

      <MapContainer
        center={[22, 60]}
        zoom={3}
        minZoom={2}
        scrollWheelZoom
        zoomControl={false}
        worldCopyJump
        className="h-[22rem] w-full md:h-[30rem]"
      >
        <TileLayer
          key={isDark ? "dark" : "light"}
          attribution='Tiles &copy; <a href="https://www.esri.com/">Esri</a>'
          url={tileUrl}
          maxZoom={16}
        />
        <TileLayer
          key={isDark ? "dark-labels" : "light-labels"}
          url={labelUrl}
          maxZoom={16}
        />
        <ZoomControl position="bottomright" />

        {sites.map((site) => (
          <Marker
            key={site.key}
            position={site.position}
            icon={buildIcon(site.status, site.total)}
          >
            <Popup className="gt-popup">
              <span className="block text-sm font-semibold">{site.label}</span>
              <span className="mt-0.5 block text-xs opacity-70">
                {site.running} of {site.total} running
              </span>
              <span className="mt-2 block max-h-32 space-y-1 overflow-y-auto">
                {site.machines.map((m) => (
                  <span key={m.name} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: m.running
                          ? "var(--success)"
                          : "var(--muted-foreground)",
                      }}
                    />
                    {m.name}
                  </span>
                ))}
              </span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .gt-marker {
          position: relative;
          display: grid;
          place-items: center;
        }
        .gt-marker__pin {
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          width: 26px;
          height: 26px;
          border-radius: 9999px;
          font: 600 11px/1 var(--font-geist-sans), system-ui, sans-serif;
          color: #fff;
          border: 2px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgb(0 0 0 / 0.35);
        }
        .gt-marker__pin[data-status="running"] {
          background: oklch(0.63 0.16 155);
        }
        .gt-marker__pin[data-status="idle"] {
          background: oklch(0.75 0.16 75);
        }
        .gt-marker__pin[data-status="offline"] {
          background: oklch(0.55 0.02 265);
        }
        .gt-marker__halo {
          position: absolute;
          inset: -6px;
          border-radius: 9999px;
          opacity: 0.35;
        }
        .gt-marker__halo[data-status="running"] {
          background: oklch(0.63 0.16 155);
          animation: gtPing 2.4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .gt-marker__halo[data-status="idle"] {
          background: oklch(0.75 0.16 75);
        }
        .gt-marker__halo[data-status="offline"] {
          background: transparent;
        }
        @keyframes gtPing {
          0% {
            transform: scale(0.85);
            opacity: 0.45;
          }
          70%,
          100% {
            transform: scale(1.7);
            opacity: 0;
          }
        }
        /* Match Leaflet chrome to the app theme */
        .leaflet-container {
          background: var(--muted);
          font-family: var(--font-geist-sans), system-ui, sans-serif;
        }
        .leaflet-popup-content-wrapper,
        .leaflet-popup-tip {
          background: var(--popover);
          color: var(--popover-foreground);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
        }
        .leaflet-popup-content {
          margin: 0.75rem 0.9rem;
        }
        .leaflet-bar a,
        .leaflet-bar a:hover {
          background: var(--card);
          color: var(--foreground);
          border-color: var(--border);
        }
        .leaflet-control-attribution {
          background: color-mix(in oklch, var(--background) 75%, transparent);
          color: var(--muted-foreground);
          font-size: 10px;
        }
        .leaflet-control-attribution a {
          color: var(--primary);
        }
        @media (prefers-reduced-motion: reduce) {
          .gt-marker__halo {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
