"use client";

import { useEffect, useRef, useState } from "react";
import { pickReading, readAeration } from "@/lib/aerationReadings";

interface AerationDiagramProps {
  data: any;
  formatValue: (value: any, unit?: string) => string;
  machineName?: string;
  /** With-heating variant draws the heater bank in the supply duct. */
  heated?: boolean;
  title?: string;
}

/** PLC tag names differ per machine, so every reading walks a list of candidates. */
const pick = pickReading;

const isTrue = (value: any) => {
  if (!value) return false;
  const v = String(value).toLowerCase();
  return v === "true" || v === "tr" || v === "1" || v === "on";
};

const num = (value: any) => {
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
};

// Fixed design canvas, scaled to whatever width the container offers.
const DESIGN_W = 1500;
const DESIGN_H = 640;

export default function AerationDiagram({
  data,
  formatValue,
  machineName,
  heated = false,
  title,
}: AerationDiagramProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / DESIGN_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ── readings ────────────────────────────────────────────────────────────
  // Same reader as the summary panel, so the diagram cannot disagree with it.
  const readings = readAeration(data);
  const ambient = readings.ambient;
  const supply = readings.supply;
  const humidity = readings.humidity;
  const blowerRaw = readings.blower;
  const heaterRaw = readings.heater;

  const blowerPct = num(blowerRaw);
  const heaterPct = num(heaterRaw);
  const blowerOn = blowerPct > 0;
  const heaterOn = heated && heaterPct > 0;
  const continuous = readings.continuousMode;

  const durationSet = pick(data, ["SET_DURATION", "Aeration_duration_set"]);
  const deltaSet = pick(data, ["DELTA_SET", "Delta_set_to_aeration"]);
  const runHours = pick(data, ["RUNNING_HOUR1", "Running_time_hour"]);
  const runMinutes = pick(data, ["RUNNING_MINUTE1", "Running_time_minute"]);

  const greenOn = isTrue(
    pick(data, ["GREEN_LIGHT", "Chiller_healthy_on_Q1_1", "Chiller_healthy"])
  );
  const redOn = isTrue(
    pick(data, ["RED_LIGHT", "Chiller_fault_Q2_3", "Chiller_Fault"])
  );
  const yellowOn = isTrue(
    pick(data, ["YELLOW_LIGHT", "System_warning_Q1_0", "Collective_Trouble_Signal"])
  );

  const lamp = (on: boolean, color: string) => (on ? color : "#d1d5db");

  // Air only moves through the duct while the blower turns.
  const flowing = blowerOn;

  // ── duct routing: intake -> blower -> heater -> silo -> exhaust ─────────
  const PIPES = [
    // ambient intake into blower
    "M 120 300 L 300 300",
    // blower to heater bank
    "M 430 300 L 620 300",
    // heater to silo inlet
    "M 760 300 L 1010 300",
    // silo outlet back up to exhaust stack
    "M 1240 300 L 1360 300 L 1360 140",
  ];

  const Chip = ({
    label,
    value,
    tone = "default",
  }: {
    label: string;
    value: string;
    tone?: "default" | "warm" | "cool";
  }) => (
    <div
      className="rounded border bg-white px-3 py-1.5 shadow-sm"
      style={{
        borderColor:
          tone === "warm" ? "#f0a68f" : tone === "cool" ? "#8ec5e8" : "#d1d5db",
      }}
    >
      <div className="text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </div>
      <div className="text-sm font-bold text-gray-900 tabular-nums">{value}</div>
    </div>
  );

  return (
    <div
      ref={wrapRef}
      className="w-full overflow-hidden bg-white"
      style={{ height: DESIGN_H * scale }}
    >
      <style>{`
        @keyframes aerSpin { to { transform: rotate(360deg); } }
        @keyframes aerFlow { to { stroke-dashoffset: -34; } }
        @keyframes aerGlow { 0%,100% { opacity: .55; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .aer-spin, .aer-flow, .aer-glow { animation: none !important; }
        }
      `}</style>

      <div
        className="relative bg-white"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {/* ---------- ducting behind everything ---------- */}
        <svg
          className="absolute inset-0"
          width={DESIGN_W}
          height={DESIGN_H}
          viewBox={`0 0 ${DESIGN_W} ${DESIGN_H}`}
          style={{ zIndex: 1 }}
        >
          {PIPES.map((d, i) => (
            <path
              key={i}
              className="aer-flow"
              d={d}
              fill="none"
              stroke={heaterOn && i >= 2 ? "#E8785F" : "#F19E8B"}
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="10 7"
              style={{ animation: flowing ? "aerFlow 1.2s linear infinite" : "none" }}
            />
          ))}

          {/* flow direction arrows */}
          {[
            [250, 300],
            [575, 300],
            [950, 300],
          ].map(([x, y]) => (
            <path
              key={`${x}-${y}`}
              d={`M ${x} ${y - 7} L ${x + 12} ${y} L ${x} ${y + 7} Z`}
              fill={flowing ? "#E8785F" : "#cbd5e1"}
            />
          ))}

          {/* ---------- silo ---------- */}
          <g>
            <ellipse cx="1125" cy="185" rx="115" ry="34" fill="#cfd6dd" stroke="#6b7280" strokeWidth="2" />
            <rect x="1010" y="185" width="230" height="230" fill="#dde3e9" stroke="#6b7280" strokeWidth="2" />
            <ellipse cx="1125" cy="415" rx="115" ry="34" fill="#cfd6dd" stroke="#6b7280" strokeWidth="2" />
            {/* grain fill */}
            <path d="M 1010 250 L 1240 250 L 1240 415 A 115 34 0 0 1 1010 415 Z" fill="#e8c887" opacity="0.85" />
            <ellipse cx="1125" cy="250" rx="115" ry="34" fill="#f0d59b" />
            {/* corrugation */}
            {[215, 245, 275, 305, 335, 365, 395].map((y) => (
              <line key={y} x1="1010" y1={y} x2="1240" y2={y} stroke="#9aa5b1" strokeWidth="1" opacity="0.5" />
            ))}
            {/* legs */}
            <rect x="1030" y="440" width="10" height="34" fill="#6b7280" />
            <rect x="1210" y="440" width="10" height="34" fill="#6b7280" />
            {/* inlet / outlet ports */}
            <rect x="995" y="288" width="18" height="24" rx="2" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
            <rect x="1237" y="288" width="18" height="24" rx="2" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
          </g>

          {/* ---------- exhaust stack ---------- */}
          <g>
            <rect x="1336" y="96" width="48" height="52" rx="4" fill="#cbd5e1" stroke="#6b7280" strokeWidth="2" />
            <path d="M 1330 96 L 1390 96 L 1360 68 Z" fill="#9ca3af" stroke="#6b7280" strokeWidth="2" />
            {flowing &&
              [0, 1, 2].map((i) => (
                <circle
                  key={i}
                  className="aer-glow"
                  cx={1352 + i * 8}
                  cy={54 - i * 10}
                  r={5 + i}
                  fill="#cbd5e1"
                  opacity="0.6"
                  style={{ animation: `aerGlow 2s ease-in-out ${i * 0.3}s infinite` }}
                />
              ))}
          </g>

          {/* ---------- ambient intake louvre ---------- */}
          <g>
            <rect x="60" y="250" width="60" height="100" rx="4" fill="#eef2f6" stroke="#6b7280" strokeWidth="2" />
            {[268, 286, 304, 322].map((y) => (
              <line key={y} x1="66" y1={y} x2="114" y2={y} stroke="#9aa5b1" strokeWidth="3" strokeLinecap="round" />
            ))}
          </g>

          {/* ---------- blower housing ---------- */}
          <g>
            <circle cx="365" cy="300" r="62" fill="#eef2f6" stroke="#6b7280" strokeWidth="2" />
            <circle cx="365" cy="300" r="46" fill="#f8fafc" stroke="#9aa5b1" strokeWidth="1.5" />
            <g
              className="aer-spin"
              style={{
                transformOrigin: "365px 300px",
                animation: blowerOn
                  ? `aerSpin ${Math.max(0.5, 2.4 - blowerPct / 60)}s linear infinite`
                  : "none",
              }}
            >
              {[0, 60, 120, 180, 240, 300].map((deg) => (
                <ellipse
                  key={deg}
                  cx="365"
                  cy="272"
                  rx="9"
                  ry="26"
                  fill={blowerOn ? "#5b8def" : "#b6c2cf"}
                  transform={`rotate(${deg} 365 300)`}
                />
              ))}
              <circle cx="365" cy="300" r="10" fill="#475569" />
            </g>
            <rect x="330" y="362" width="70" height="12" rx="2" fill="#6b7280" />
          </g>

          {/* ---------- heater bank (with-heating only) ---------- */}
          {heated && (
            <g>
              <rect
                x="620"
                y="238"
                width="140"
                height="124"
                rx="6"
                fill="#fdf3ef"
                stroke={heaterOn ? "#E8785F" : "#9aa5b1"}
                strokeWidth="2"
              />
              {[262, 286, 310, 334].map((y, i) => (
                <path
                  key={y}
                  className="aer-glow"
                  d={`M 634 ${y} q 12 -12 24 0 q 12 12 24 0 q 12 -12 24 0 q 12 12 24 0`}
                  fill="none"
                  stroke={heaterOn ? "#E8785F" : "#c7d0d9"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  style={{
                    animation: heaterOn
                      ? `aerGlow 1.8s ease-in-out ${i * 0.2}s infinite`
                      : "none",
                  }}
                />
              ))}
            </g>
          )}
        </svg>

        {/* ---------- title + tower lamp ---------- */}
        <div className="absolute z-10" style={{ left: 60, top: 40 }}>
          <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
            {title ?? (heated ? "Aeration with heating" : "Aeration without heating")}
          </div>
          {machineName && (
            <div className="mt-1 font-mono text-xs font-semibold text-gray-400">
              {machineName}
            </div>
          )}
        </div>

        <div className="absolute z-10" style={{ left: 620, top: 40 }}>
          <div className="mb-2 text-xs font-bold text-gray-700">TOWER LAMP STATUS</div>
          <div className="flex gap-2 rounded border border-gray-300 bg-gray-50 p-2">
            {[
              lamp(redOn, "#ef4444"),
              lamp(yellowOn, "#f59e0b"),
              lamp(greenOn, "#22c55e"),
            ].map((color, i) => (
              <span
                key={i}
                className="h-7 w-9 rounded"
                style={{
                  background: color,
                  boxShadow:
                    color === "#d1d5db"
                      ? "none"
                      : `0 0 10px ${color}aa, inset 0 1px 0 rgba(255,255,255,.5)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* ---------- set points ---------- */}
        <div className="absolute z-10 flex flex-col gap-2" style={{ left: 940, top: 40 }}>
          <div className="text-sm font-bold text-gray-800">Set points</div>
          <div className="min-w-[150px] rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm">
            Duration = {durationSet ?? "--"} h
          </div>
          <div className="min-w-[150px] rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm">
            Delta = {deltaSet ?? "--"} °C
          </div>
          <div className="min-w-[150px] rounded border border-gray-300 bg-white px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm">
            Mode = {continuous ? "CONTINUOUS" : "TIMED"}
          </div>
        </div>

        {/* ---------- readouts pinned to their equipment ---------- */}
        <div className="absolute z-10" style={{ left: 40, top: 380 }}>
          <Chip label="T2 ambient" value={formatValue(ambient, "°C")} tone="cool" />
        </div>

        <div className="absolute z-10" style={{ left: 40, top: 452 }}>
          <Chip label="RH" value={formatValue(humidity, "%")} tone="cool" />
        </div>

        <div className="absolute z-10" style={{ left: 300, top: 400 }}>
          <Chip label="Blower" value={formatValue(blowerRaw, "%")} />
        </div>

        {heated && (
          <div className="absolute z-10" style={{ left: 618, top: 388 }}>
            <Chip label="Heater" value={formatValue(heaterRaw, "%")} tone="warm" />
          </div>
        )}

        <div className="absolute z-10" style={{ left: 800, top: 232 }}>
          <Chip
            label={heated ? "TH supply air" : "T0 supply air"}
            value={formatValue(supply, "°C")}
            tone="warm"
          />
        </div>

        <div className="absolute z-10" style={{ left: 1040, top: 470 }}>
          <Chip
            label="Running time"
            value={`${runHours ?? "--"} h ${runMinutes ?? "--"} min`}
          />
        </div>

        {/* ---------- legend ---------- */}
        <div
          className="absolute z-10 text-[11px] leading-relaxed text-gray-500"
          style={{ left: 60, top: 530 }}
        >
          <div>T2 = Ambient Air Temperature</div>
          <div>{heated ? "TH = Air Temperature After Heater" : "T0 = Air Outlet Temperature"}</div>
          <div>RH = Relative Humidity</div>
        </div>

        {/* ---------- status strip ---------- */}
        <div
          className="absolute z-10 flex items-center gap-4"
          style={{ left: 620, top: 530 }}
        >
          <span className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: blowerOn ? "#22c55e" : "#cbd5e1" }}
            />
            BLOWER {blowerOn ? "RUNNING" : "IDLE"}
          </span>
          {heated && (
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: heaterOn ? "#E8785F" : "#cbd5e1" }}
              />
              HEATER {heaterOn ? "ON" : "OFF"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
