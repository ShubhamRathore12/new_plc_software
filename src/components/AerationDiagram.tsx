"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import Gtpl141PulseCard from "@/components/gtpl141/Gtpl141PulseCard";
import { machineHasHeater, pickReading, readAeration } from "@/lib/aerationReadings";
import {
  isGtpl141,
  requestGtpl141Edit,
  telemetryValue,
} from "@/lib/gtpl141Control";

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
const DESIGN_H = 720;

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

  // Some machines (e.g. 650T) have no RH sensor, so humidity resolves to
  // undefined. In that case the RH readout is hidden rather than showing "--".
  const hasRh =
    humidity !== null && humidity !== undefined && String(humidity) !== "";

  // The supply sensor reads "after the heater" (TH) only on machines that have
  // a heater; machines without one read the air outlet (T0). This is a property
  // of the machine, not of the screen, so it is independent of `heated`.
  const hasHeater = machineHasHeater(machineName);

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

  // Air only moves through the duct while the blower turns.
  const flowing = blowerOn;

  const fmtNum = (v: unknown) => {
    const n = parseFloat(String(v));
    return isNaN(n) ? "--" : String(Math.round(n * 10) / 10);
  };
  const spinDur = (pct: number) => {
    const clamped = Math.min(Math.max(pct, 1), 100);
    return `${(2 - (clamped / 100) * 1.6).toFixed(2)}s`;
  };

  // ── duct routing (same layout language as AutoDiagram1) ─────────────────
  // ambient intake (right) -> blower -> up and over -> (heater) -> silo (left)
  const HEATER_X = 530; // heater coil left edge; its nubs sit at x 560
  const PIPES = [
    // ambient intake louvre into blower side
    "M 1150 467 H 963",
    ...(heated
      ? [
          // blower top outlet over to heater top
          "M 848 380 V 252 H 560 V 278",
          // heater bottom back to silo lower port
          "M 560 563 V 572 H 280 V 508 H 223",
        ]
      : [
          // blower straight over to silo upper port
          "M 848 380 V 252 H 310 L 268 470 H 223",
        ]),
  ];

  const SensorBadge = ({
    label,
    value,
    color,
    bg,
    border,
  }: {
    label: string;
    value: string;
    color: string;
    bg: string;
    border: string;
  }) => (
    <div
      className="px-2.5 py-1 rounded text-sm font-bold whitespace-nowrap"
      style={{ backgroundColor: bg, border: `1.5px dashed ${border}`, color }}
    >
      {label} :&nbsp;<span>{value}</span>
    </div>
  );

  // Centrifugal blower, same drawing as AutoDiagram1.
  const BlowerSVG = ({ spinning }: { spinning: boolean }) => (
    <svg width="170" height="175" viewBox="0 0 170 175">
      <defs>
        <radialGradient id="aerBlwCasing" cx="38%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#eef0f3" />
          <stop offset="60%" stopColor="#cfd4da" />
          <stop offset="100%" stopColor="#9aa2ad" />
        </radialGradient>
        <radialGradient id="aerBlwInner" cx="45%" cy="42%" r="65%">
          <stop offset="0%" stopColor="#f6f7f9" />
          <stop offset="100%" stopColor="#d7dbe0" />
        </radialGradient>
      </defs>
      <rect x="24" y="0" width="42" height="10" rx="2" fill="#b6bcc6" stroke="#9aa2ad" />
      <rect x="33" y="8" width="24" height="46" fill="#cfd4da" stroke="#9aa2ad" />
      <rect x="34" y="148" width="18" height="12" fill="#b6bcc6" stroke="#9aa2ad" />
      <rect x="118" y="148" width="18" height="12" fill="#b6bcc6" stroke="#9aa2ad" />
      <rect x="22" y="158" width="140" height="11" rx="2" fill="#8d99a6" />
      <path
        d="M 100 37 L 48 48 Q 30 52 30 68 L 30 126 Q 30 142 48 146 L 100 153 Z"
        fill="url(#aerBlwCasing)"
        stroke="#9aa2ad"
        strokeWidth="2"
      />
      <circle cx="100" cy="95" r="58" fill="url(#aerBlwCasing)" stroke="#9aa2ad" strokeWidth="2.5" />
      <circle cx="100" cy="95" r="44" fill="url(#aerBlwInner)" stroke="#b6bcc6" strokeWidth="1.5" />
      <g
        className="aer-spin"
        style={{
          transformOrigin: "100px 95px",
          animation: spinning
            ? `aerSpin ${spinDur(blowerPct > 0 ? blowerPct : 50)} linear infinite`
            : "none",
        }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path
            key={a}
            d="M100 95 Q 111 74 99 58 Q 85 73 93 91 Z"
            fill={spinning ? "#3b5b8f" : "#5b6470"}
            stroke="#454c56"
            strokeWidth="0.8"
            transform={`rotate(${a} 100 95)`}
          />
        ))}
        <circle cx="100" cy="95" r="9" fill="#454c56" />
        <circle cx="97" cy="92" r="2.5" fill="#b6bcc6" opacity="0.8" />
      </g>
    </svg>
  );

  // Duct heater coil, same drawing as AutoDiagram1; greyed out while off.
  const HeaterCoilSVG = ({ w, h, on }: { w: number; h: number; on: boolean }) => {
    const bars = 7;
    const innerTop = 16;
    const innerH = h - 32;
    const step = innerH / bars;
    const xl = 22;
    const xr = w - 22;
    const r = step / 2;
    let d = `M ${xl} ${innerTop}`;
    for (let i = 0; i < bars; i++) {
      d +=
        i % 2 === 0
          ? ` H ${xr} A ${r} ${r} 0 0 1 ${xr} ${innerTop + (i + 1) * step}`
          : ` H ${xl} A ${r} ${r} 0 0 0 ${xl} ${innerTop + (i + 1) * step}`;
    }
    d += bars % 2 === 0 ? ` H ${xr}` : ` H ${xl}`;
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <linearGradient id="aerHtrGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="45%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <rect
          x="2"
          y="10"
          width={w - 4}
          height={h - 20}
          fill="url(#aerHtrGrad)"
          stroke="#111827"
          strokeWidth="2.5"
          style={{ filter: on ? "none" : "grayscale(0.85) brightness(1.1)" }}
        />
        <path
          className="aer-glow"
          d={d}
          fill="none"
          stroke="#6b7280"
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.85"
          style={{ animation: on ? "aerGlow 1.8s ease-in-out infinite" : "none" }}
        />
        <rect x={w / 2 - 4} y="0" width="8" height="11" fill="#374151" />
        <rect x={w / 2 - 4} y={h - 11} width="8" height="11" fill="#374151" />
      </svg>
    );
  };

  // Corrugated flat-bottom grain silo, same drawing as AutoDiagram1.
  const SiloSVG = () => (
    <svg width="180" height="270" viewBox="0 0 180 270">
      <defs>
        <linearGradient id="aerSiloBody" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9aa5b1" />
          <stop offset="30%" stopColor="#e8ecf0" />
          <stop offset="55%" stopColor="#f4f6f8" />
          <stop offset="100%" stopColor="#8d99a6" />
        </linearGradient>
      </defs>
      <polygon points="90,6 12,58 168,58" fill="#6b7280" stroke="#4b5563" strokeWidth="1.5" />
      {[-64, -50, -36, -22, -10, 10, 22, 36, 50, 64].map((dx) => (
        <line key={dx} x1="90" y1="8" x2={90 + dx} y2="57" stroke="#9ca3af" strokeWidth="0.8" opacity="0.8" />
      ))}
      <rect x="85" y="0" width="10" height="8" rx="1.5" fill="#d1d5db" stroke="#6b7280" strokeWidth="0.8" />
      <rect x="20" y="58" width="140" height="190" fill="url(#aerSiloBody)" stroke="#6b7280" strokeWidth="1.8" />
      {Array.from({ length: 23 }).map((_, i) => (
        <line key={i} x1="20" y1={64 + i * 8} x2="160" y2={64 + i * 8} stroke="#8d99a6" strokeWidth="1" opacity="0.7" />
      ))}
      <rect x="158" y="134" width="20" height="13" rx="1.5" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
      <rect x="158" y="172" width="20" height="13" rx="1.5" fill="#9ca3af" stroke="#6b7280" strokeWidth="1" />
      <rect x="14" y="246" width="152" height="6" rx="1" fill="#6b7280" />
    </svg>
  );

  // Ambient air intake louvre.
  const IntakeSVG = () => (
    <svg width="70" height="120" viewBox="0 0 70 120">
      <rect x="2" y="2" width="66" height="116" rx="4" fill="#eef2f6" stroke="#6b7280" strokeWidth="2" />
      {[20, 38, 56, 74, 92].map((y) => (
        <line key={y} x1="10" y1={y} x2="60" y2={y + 6} stroke="#9aa5b1" strokeWidth="4" strokeLinecap="round" />
      ))}
    </svg>
  );

  const g141 = isGtpl141(machineName);

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
        {/* ---------- ducting (behind everything) ---------- */}
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
              stroke={heaterOn && i === 2 ? "#E8785F" : "#F19E8B"}
              strokeWidth="3.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray="10 7"
              style={{ animation: flowing ? "aerFlow 1.2s linear infinite" : "none" }}
            />
          ))}
        </svg>

        {/* ---------- title ---------- */}
        <div className="absolute z-10" style={{ left: 45, top: 30 }}>
          <div className="text-xs font-bold tracking-[0.2em] text-gray-500 uppercase">
            {title ?? (heated ? "Aeration with heating" : "Aeration without heating")}
          </div>
          {machineName && (
            <div className="mt-1 font-mono text-xs font-semibold text-gray-400">
              {machineName}
            </div>
          )}
        </div>

        {/* ---------- set points ---------- */}
        {g141 ? (
          <Gtpl141AerationSetpoints data={data} heated={heated} />
        ) : (
          <div className="absolute z-10" style={{ left: 340, top: 30 }}>
            <div className="text-sm font-bold text-gray-800 mb-2">Set points</div>
            <div className="flex flex-col gap-2">
              {[
                `Duration = ${durationSet ?? "--"} h`,
                `Delta = ${deltaSet ?? "--"} °C`,
                `Mode = ${continuous ? "CONTINUOUS" : "TIMED"}`,
              ].map((t) => (
                <div
                  key={t}
                  className="bg-white border border-gray-300 rounded px-3 py-1.5 text-sm font-bold text-gray-900 shadow-sm min-w-[150px]"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------- tower lamp status ---------- */}
        <div
          className="absolute z-10 bg-gray-50 border border-gray-200 rounded-md px-4 py-2 text-sm font-bold text-gray-800"
          style={{ left: 600, top: 30 }}
        >
          TOWER LAMP STATUS
        </div>
        <div
          className="absolute z-10 rounded-md p-2 flex flex-row gap-1.5"
          style={{ left: 628, top: 76, backgroundColor: "#eceef1", border: "1px solid #d7dade" }}
        >
          <div className="w-10 h-10 rounded-sm" style={{ backgroundColor: redOn ? "#ef4444" : "#dcdfe4" }} />
          <div className="w-10 h-10 rounded-sm" style={{ backgroundColor: yellowOn ? "#eab308" : "#dcdfe4" }} />
          <div className="w-10 h-10 rounded-sm" style={{ backgroundColor: greenOn ? "#16a34a" : "#dcdfe4" }} />
        </div>

        {/* ---------- silo ---------- */}
        <div className="absolute z-10" style={{ left: 45, top: 330 }}>
          <SiloSVG />
        </div>
        <div
          className="absolute z-10 bg-gray-50 border border-gray-200 rounded-md px-4 py-1 text-sm font-bold text-gray-800"
          style={{ left: 100, top: 606 }}
        >
          SILO
        </div>

        {/* ---------- supply air temperature into the silo ---------- */}
        <div className="absolute z-10" style={{ left: heated ? 300 : 330, top: heated ? 584 : 210 }}>
          <SensorBadge
            label={hasHeater ? "TH" : "T0"}
            value={formatValue(supply, "°C")}
            color="#c2410c"
            bg="#fdece4"
            border="#f5a274"
          />
        </div>

        {/* ---------- heater coil (with-heating only) ---------- */}
        {heated && (
          <>
            <div className="absolute z-10" style={{ left: HEATER_X, top: 278 }}>
              <HeaterCoilSVG w={60} h={285} on={heaterOn} />
            </div>
            <div
              className="absolute z-10 flex flex-col items-center gap-2"
              style={{ left: 430, top: 380 }}
            >
              <span className="text-base font-bold text-gray-800">HEATER</span>
              <div className="bg-white border border-gray-400 rounded-sm px-3 py-1 text-base font-bold text-gray-900 flex items-center gap-2">
                <span>HTR</span>
                <span>{fmtNum(heaterRaw)} %</span>
              </div>
              <span
                className={`text-white text-xs font-bold px-2.5 py-0.5 rounded ${
                  heaterOn ? "bg-green-600" : "bg-red-500"
                }`}
              >
                {heaterOn ? "ON" : "OFF"}
              </span>
            </div>
          </>
        )}

        {/* ---------- blower ---------- */}
        <div className="absolute z-10" style={{ left: 803, top: 382 }}>
          <BlowerSVG spinning={blowerOn} />
        </div>
        <div
          className="absolute z-10 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 text-gray-800 flex items-center justify-center gap-4"
          style={{ left: 803, top: 578, width: 170 }}
        >
          <span className="text-base font-bold">Blower</span>
          <span className="text-base font-bold">{fmtNum(blowerRaw)} %</span>
        </div>

        {/* ---------- ambient intake + readings ---------- */}
        <div className="absolute z-10" style={{ left: 1150, top: 407 }}>
          <IntakeSVG />
        </div>
        <div
          className="absolute z-10 bg-gray-50 border border-gray-200 rounded-md px-3 py-1 text-sm font-bold text-gray-800"
          style={{ left: 1128, top: 540 }}
        >
          AMBIENT AIR
        </div>
        <div className="absolute z-10 flex flex-col gap-2" style={{ left: 1250, top: 420 }}>
          <SensorBadge
            label="T2"
            value={formatValue(ambient, "°C")}
            color="#1d4ed8"
            bg="#e0f2fe"
            border="#38bdf8"
          />
          {hasRh && (
            <SensorBadge
              label="RH"
              value={formatValue(humidity, "%")}
              color="#1d4ed8"
              bg="#e0f2fe"
              border="#38bdf8"
            />
          )}
        </div>

        {/* ---------- run status panel ---------- */}
        <div
          className="absolute z-10 bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex flex-col gap-2"
          style={{ left: 1078, top: 160, width: 305 }}
        >
          <div className="text-sm font-bold text-gray-800">AERATION STATUS</div>
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-1.5">
            <span className="text-sm font-bold text-gray-700">Blower</span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                blowerOn ? "bg-green-600 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              {blowerOn ? "RUNNING" : "IDLE"}
            </span>
          </div>
          <div className="flex items-center justify-between bg-white border border-gray-300 rounded px-3 py-1.5">
            <span className="text-sm font-bold text-gray-700">Running time</span>
            <span className="text-sm font-bold text-gray-900">
              {runHours ?? "--"} h {runMinutes ?? "--"} min
            </span>
          </div>
        </div>

        {/* ---------- legend ---------- */}
        <div
          className="absolute z-10 flex gap-10 text-sm font-bold text-gray-900"
          style={{ left: 280, top: 645 }}
        >
          <div className="space-y-1">
            <div>T2 = Ambient Air Temperature</div>
            <div>
              {hasHeater ? "TH = Air Temperature After Heater" : "T0 = Air Outlet Temperature"}
            </div>
          </div>
          <div className="space-y-1">
            {hasRh && <div>RH = Relative Humidity</div>}
            {heated && <div>HTR = Heater Output</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/** GTPL-141 only: actual setpoints from the RB_* readback columns, each with an
 *  edit button, plus this screen's Start/Stop. Both open the controls panel's
 *  confirmation dialogs, so every safety check still applies. */
function Gtpl141AerationSetpoints({ data, heated }: { data: any; heated: boolean }) {
  const boolText = (v: unknown) => (v === null ? "--" : v ? "ON" : "OFF");
  const numText = (v: unknown, unit: string) => (v === null ? "--" : `${v} ${unit}`);
  const rows = [
    ...(heated
      ? [
          {
            tag: "Set_TH_for_heating_mode",
            label: "Heating TH",
            text: numText(telemetryValue(data, "Set_TH_for_heating_mode"), "°C"),
          },
        ]
      : []),
    {
      tag: "Continuous_mode",
      label: "Continuous mode",
      text: boolText(telemetryValue(data, "Continuous_mode")),
    },
    {
      tag: "Set_Run_Duration",
      label: "Run duration",
      text: numText(telemetryValue(data, "Set_Run_Duration"), "h"),
    },
  ];
  const start = heated ? "Aeration_start_with_WH" : "Aeration_start_with_WOH";
  const stop = heated ? "Aeration_stop_with_WH" : "Aeration_stop_with_WOH";
  const group = heated ? "Aeration with heating" : "Aeration without heating";
  // Auto_mode / Manual_mode are plain status columns (no RB_ readback).
  const isOn = (v: unknown) => ["true", "1"].includes(String(v ?? "").trim().toLowerCase());
  const startConflict = isOn(data?.Auto_mode)
    ? "Auto mode"
    : isOn(data?.Manual_mode)
      ? "Manual mode"
      : null;
  return (
    // Same slot as the Auto diagram's set points (between title and tower lamp).
    <>
    <div className="absolute z-10 flex w-[250px] flex-col gap-1.5" style={{ left: 340, top: 30 }}>
      <div className="text-sm font-bold text-gray-800">Set points</div>
      <div className="flex flex-col gap-1.5">
      {rows.map((r) => (
        <div
          key={r.tag}
          className="flex items-center gap-1.5 rounded border border-gray-300 bg-white px-2 py-1 text-xs font-bold text-gray-900 shadow-sm"
        >
          <span>
            {r.label} = {r.text}
          </span>
          <button
            type="button"
            aria-label={`Edit ${r.label}`}
            title={`Edit ${r.label}`}
            onClick={() => requestGtpl141Edit(r.tag)}
            className="rounded border border-gray-300 p-0.5 text-gray-600 hover:bg-gray-100"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      </div>
    </div>
      <Gtpl141PulseCard
        title={group}
        label={group}
        start={start}
        stop={stop}
        startConflict={startConflict}
        // No running feedback: the heated/unheated aeration running tag is not
        // confirmed (handoff §8), so none is inferred from the command bits.
        // Above the silo, like the Auto diagram's card.
        className="absolute z-10 w-[220px]"
        style={{ left: 30, top: 110 }}
      />
    </>
  );
}
