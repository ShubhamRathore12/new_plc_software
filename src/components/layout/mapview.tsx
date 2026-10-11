"use client";

import { useEffect, useMemo, useRef, useState } from "react";
// Aliased to MapGL so it does not shadow the built-in `Map` constructor used
// below (new Map<...>()); importing it as `Map` broke marker grouping.
import {
  Map as MapGL,
  Marker,
  Popup,
  NavigationControl,
  type MapRef,
} from "@vis.gl/react-maplibre";
import type { StyleSpecification } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
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
  "noida---kanpur": [28.5355, 77.391],
  noida: [28.5355, 77.391],
  dharuhera: [28.205, 76.797],
  rajasthan: [27.0238, 74.2179],
  "ganga nagar": [29.9094, 73.88],
  "ganganagar, rajasthan": [29.9094, 73.88],
  "keshwana, rajasthan": [27.988, 76.38],
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

type MachineStatus = "running" | "idle" | "offline";

interface MachineMarker {
  name: string;
  location: string;
  locationKey: string;
  /** [lat, lng] — note MapLibre expects [lng, lat] when passed to the API. */
  position: [number, number];
  running: boolean;
  online: boolean;
  status: MachineStatus;
}

/**
 * Visual de-clustering only — NOT real GPS. Devices carry just a city/region
 * string, so machines sharing a location are fanned out in a small ring around
 * that city's coordinate so each one gets its own clickable pin.
 */
const spreadPosition = (
  [lat, lng]: [number, number],
  index: number,
  count: number
): [number, number] => {
  if (count <= 1) return [lat, lng];
  const radius = Math.min(0.15 + count * 0.015, 0.4); // degrees
  const angle = (2 * Math.PI * index) / count;
  // Longitude degrees shrink with latitude; compensate so the ring stays round.
  const lngScale = Math.cos((lat * Math.PI) / 180) || 1;
  return [
    lat + radius * Math.sin(angle),
    lng + (radius * Math.cos(angle)) / lngScale,
  ];
};

/** device name (GTPL-157-gT-450T-S7-1200) -> status feed key (GTPL_157) */
const toStatusKey = (deviceName: string): string => {
  const match = deviceName.match(/GTPL[-_]?(\d+)/i);
  if (!match) return deviceName;
  return `GTPL_${match[1].padStart(3, "0")}`;
};

/**
 * Keyless raster basemap style for MapLibre. CARTO's raster basemaps need no
 * token, unlike most vector styles, and render fine when the map is pitched
 * into 3D. A separate style per theme keeps the base clean under the pins.
 */
const buildStyle = (dark: boolean): StyleSpecification => {
  // Esri's canvas basemaps are free and keyless. CARTO's raster endpoint now
  // stamps "API KEY REQUIRED" across every tile, so we use Esri here just like
  // the previous Leaflet map did. The base is drawn clean and a separate
  // reference layer adds place labels on top.
  const ESRI = "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas";
  const base = dark ? "World_Dark_Gray_Base" : "World_Light_Gray_Base";
  const labels = dark ? "World_Dark_Gray_Reference" : "World_Light_Gray_Reference";
  const attribution = 'Tiles &copy; <a href="https://www.esri.com/">Esri</a>';
  return {
    version: 8,
    sources: {
      "esri-base": {
        type: "raster",
        tiles: [`${ESRI}/${base}/MapServer/tile/{z}/{y}/{x}`],
        tileSize: 256,
        attribution,
      },
      "esri-labels": {
        type: "raster",
        tiles: [`${ESRI}/${labels}/MapServer/tile/{z}/{y}/{x}`],
        tileSize: 256,
      },
    },
    layers: [
      { id: "esri-base", type: "raster", source: "esri-base" },
      { id: "esri-labels", type: "raster", source: "esri-labels" },
    ],
  };
};

export default function MapView() {
  const { status } = useMachineStatus();
  const { theme } = useTheme();
  const [isDark, setIsDark] = useState(false);
  const [active, setActive] = useState<MachineMarker | null>(null);
  const mapRef = useRef<MapRef | null>(null);

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

  const markers = useMemo<MachineMarker[]>(() => {
    // Group by location first so machines at the same city can be fanned out.
    const byLocation = new Map<string, typeof ALL_DEVICES>();
    for (const device of ALL_DEVICES) {
      const key = device.location.trim().toLowerCase();
      if (!LOCATION_COORDS[key]) continue;
      const group = byLocation.get(key);
      if (group) group.push(device);
      else byLocation.set(key, [device]);
    }

    const result: MachineMarker[] = [];
    for (const [key, devices] of byLocation) {
      const base = LOCATION_COORDS[key];
      devices.forEach((device, i) => {
        const feed = status.machines.find(
          (m) => m.machineName === toStatusKey(device.name)
        );
        const running = feed?.machineStatus ?? false;
        const online = feed?.internetStatus ?? false;
        result.push({
          name: device.name,
          location: device.location,
          locationKey: key,
          position: spreadPosition(base, i, devices.length),
          running,
          online,
          status: running ? "running" : !online ? "offline" : "idle",
        });
      });
    }
    return result;
  }, [status.machines]);

  // Summary counts come from the live feed — the same source the dashboard KPI
  // uses — so the overlay never disagrees with the "machines running" tile.
  // (The map can only *draw* devices that resolve to a coordinate, but the
  // headline numbers must reflect the whole fleet, not just the mappable
  // subset, otherwise a running machine without coords makes 11 read as 10.)
  const totals = useMemo(
    () => ({
      machines: status.machines.length || markers.length,
      running: status.machines.filter((m) => m.machineStatus).length,
      sites: new Set(markers.map((m) => m.locationKey)).size,
    }),
    [status.machines, markers]
  );

  // Open framed on the fleet's centre of mass rather than a fixed ocean point,
  // so the India-heavy fleet isn't pushed off to the edge. Computed once for
  // the initial view; the user can then pan/rotate/pitch freely.
  const fleetCenter = useMemo<[number, number]>(() => {
    if (markers.length === 0) return [20, 78];
    const sum = markers.reduce(
      (acc, m) => [acc[0] + m.position[0], acc[1] + m.position[1]],
      [0, 0]
    );
    return [sum[0] / markers.length, sum[1] / markers.length];
  }, [markers]);

  // Swap the basemap when the theme flips without tearing down the map.
  const mapStyle = useMemo(() => buildStyle(isDark), [isDark]);

  return (
    <div className="border-border/70 bg-card relative flex flex-col overflow-hidden rounded-xl border xl:h-full">
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

      <div className="h-[22rem] w-full md:h-[30rem] xl:h-full xl:min-h-0 xl:flex-1">
        <MapGL
          ref={mapRef}
          reuseMaps
          mapStyle={mapStyle}
          // 3D: open pitched and let the user tilt/rotate. dragRotate +
          // pitchWithRotate make it a true 3D-navigable map, not a flat raster.
          initialViewState={{
            // MapLibre uses [lng, lat]; our coords are stored [lat, lng].
            longitude: fleetCenter[1],
            latitude: fleetCenter[0],
            zoom: 3.5,
            pitch: 55,
            bearing: -17,
          }}
          minZoom={2}
          maxPitch={75}
          dragRotate
          pitchWithRotate
          attributionControl={{ compact: true }}
          style={{ width: "100%", height: "100%" }}
        >
          <NavigationControl
            position="bottom-right"
            showCompass
            visualizePitch
          />

          {markers.map((m) => (
            <Marker
              key={m.name}
              longitude={m.position[1]}
              latitude={m.position[0]}
              anchor="center"
              onClick={(e) => {
                // Keep the click from falling through to the map (which would
                // close the popup we are about to open).
                e.originalEvent.stopPropagation();
                setActive(m);
              }}
            >
              <span className="gt-marker" role="button" aria-label={m.name}>
                <span className="gt-marker__halo" data-status={m.status} />
                <span className="gt-marker__pin" data-status={m.status} />
              </span>
            </Marker>
          ))}

          {active && (
            <Popup
              longitude={active.position[1]}
              latitude={active.position[0]}
              anchor="bottom"
              offset={16}
              closeButton={false}
              onClose={() => setActive(null)}
              className="gt-popup"
            >
              <span className="block text-sm font-semibold">{active.name}</span>
              <span className="mt-0.5 block text-xs opacity-70">
                {active.location}
              </span>
              <span className="mt-2 flex items-center gap-1.5 text-xs">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{
                    background: active.running
                      ? "var(--success)"
                      : "var(--muted-foreground)",
                  }}
                />
                {active.running ? "Running" : "Stopped"} ·{" "}
                {active.online ? "Online" : "Offline"}
              </span>
            </Popup>
          )}
        </MapGL>
      </div>

      <style jsx global>{`
        /* The marker element is placed by MapLibre (translate on the wrapping
           .maplibregl-marker); we only lay out the pin/halo inside a fixed
           34×34 box so they stay glued to the anchor through pan/zoom/pitch. */
        .gt-marker {
          position: relative;
          display: block;
          width: 34px;
          height: 34px;
        }
        .gt-marker__pin {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 2;
          display: grid;
          place-items: center;
          width: 26px;
          height: 26px;
          border-radius: 9999px;
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
          top: 50%;
          left: 50%;
          width: 34px;
          height: 34px;
          transform: translate(-50%, -50%);
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
            transform: translate(-50%, -50%) scale(0.85);
            opacity: 0.45;
          }
          70%,
          100% {
            transform: translate(-50%, -50%) scale(1.7);
            opacity: 0;
          }
        }
        /* Match MapLibre chrome to the app theme */
        .maplibregl-map {
          background: var(--muted);
          font-family: var(--font-geist-sans), system-ui, sans-serif;
        }
        .maplibregl-popup-content {
          background: var(--popover);
          color: var(--popover-foreground);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          padding: 0.75rem 0.9rem;
        }
        .maplibregl-popup-anchor-bottom .maplibregl-popup-tip {
          border-top-color: var(--popover);
        }
        .maplibregl-popup-anchor-top .maplibregl-popup-tip {
          border-bottom-color: var(--popover);
        }
        .maplibregl-ctrl-group {
          background: var(--card);
          border: 1px solid var(--border);
        }
        .maplibregl-ctrl-group button + button {
          border-top: 1px solid var(--border);
        }
        .maplibregl-ctrl-group button span {
          filter: var(--maplibre-ctrl-filter, none);
        }
        .maplibregl-ctrl-attrib {
          background: color-mix(in oklch, var(--background) 75%, transparent);
          color: var(--muted-foreground);
          font-size: 10px;
        }
        .maplibregl-ctrl-attrib a {
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
