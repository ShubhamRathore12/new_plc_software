"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { ConnectionStatus } from "@/components/ui/connection-status";
import Home from "@/components/diagram-controls";
import { useAutoData } from "@/hooks/useAutoData";
import Fan from "../../../../../public/images/fan.png";
import useIsMobile from "@/hooks/useIsMobile";
import AutoDiagram1 from "@/components/AutoDiagram1";
import { useLanguage } from "@/providers/language-provider";
import AutoTelemetryPanel from "@/components/AutoTelemetryPanel";
import DiagramFrame from "@/components/DiagramFrame";
import { ArrowLeft, Hash, Snowflake } from "lucide-react";

export default function AutoPaddyPage() {
  const router = useRouter();
  const { "auto-paddy": autoPaddy } = useParams();
  const {
    data,
    isConnected,
    telemetryState,
    lastUpdatedAt,
    isShowingStaleData,
    error,
    formatValue,
  } = useAutoData(
    autoPaddy as string
  );
  const { t } = useLanguage();

  const isRunning = !!data?.AUTO_PROCESS_PB;
  const isAutoAeration = !!data?.AUTO_AERATION_ENA;
  
  // Dynamically resolve CR valve column names across different machines
  const resolveCR = (keys: string[]): string | undefined => {
    if (!data) return undefined;
    for (const k of keys) {
      if (data[k] !== undefined) return String(data[k]);
    }
    return undefined;
  };
  const cr25 = resolveCR(["CR_valve_25_percent_ON_Q0_2", "CR_valve_25_percent_on_Q0_2", "CR_25_percent_ON_Q0_2", "CR_25%_ON_Q0_2", "CR_valve_25_on_Q0_2"]);
  const cr50 = resolveCR(["CR_valve_50_percent_ON_Q0_3", "CR_valve_50_percent_on_Q0_3", "CR_50_percent_ON_Q0_3", "CR_50%_ON_Q0_3", "CR_valve_50_on_Q0_3"]);
  const cr75 = resolveCR(["CR_valve_75_percent_ON_Q2_2", "CR_valve_75_percent_on_Q2_2", "CR_75_percent_ON_Q2_2", "CR valve 75% on_Q2_2", "CR_valve_75_on_Q2_2"]);
  const cr100 = resolveCR(["CR_valve_100_percent_ON_Q2_7", "CR_valve_100_percent_on_Q2_7", "CR_100_percent_ON_Q2_7", "CR_valve_100_percent_on_Q2_5", "CR_100%_ON_Q2_7", "CR_valve_100_on_Q2_7"]);

  // Check if Paddy_ageing_mode is active (handles various boolean representations)
  const isPaddyAgeingMode = (() => {
    const value = data?.Paddy_ageing_mode;
    if (value === true || value === 1 || value === "1") return true;
    if (String(value)?.toLowerCase() === "true") return true;
    return false;
  })();

  // Check if Paddy_aeging_mode is active (handles various boolean representations)
  const isGrainChillingMode = (() => {
    const value = data?.Paddy_aeging_mode;
    if (value === true || value === 1 || value === "1") return true;
    if (String(value)?.toLowerCase() === "true") return true;
    return false;
  })();

  // Check if current machine is GTPL-137 or GTPL-138 (bar machines)
  const isBarMachine = autoPaddy === "GTPL-137-gT-450T-S7-1200" || autoPaddy === "GTPL-138-gT-450T-S7-1200";

  // Helper function to convert psi values to bar for display
  const convertPressureToBar = (value: any) => {
    if (isBarMachine) {
      if (value === undefined || value === null) return "--";
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return value;
      const barValue = numericValue * 0.0689476; // 1 psi = 0.0689476 bar
      return barValue;
    }
    return value;
  };

  const machineConfig = {
    "GTPL-132-300-AP-S7-1200": {
      serialNumber: "GTPL_132_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
           CONDENSORFANSPEED :{key:'Cond_fan_speed' ,label:'Cond. Fan'}

      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-136-gT-450AP": {
      serialNumber: "GTPL_136_GRAIN",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED :{key:'Cond_fan_speed' ,label:'Cond. Fan'}

      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-139-gT-300AP-S7-1200": {
      serialNumber: "GTPL_139_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan" }
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-144-gT-300AP-S7-1200": {
      serialNumber: "GTPL_144_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan" }
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-142-gT-450AP-S7-1200": {
      serialNumber: "GTPL_142_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan" }
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-123-gT-450AP": {
      serialNumber: "GTPL_123_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan" }
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-143-gT-450AP-S7-1200": {
      serialNumber: "GTPL_143_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan" }
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-118-gT-60T-S7-200": {
      serialNumber: "GTPL_118_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-149-gT-60T-S7-1200": {
      serialNumber: "GTPL_149_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-137-gT-450T-S7-1200": {
      serialNumber: "GTPL_137_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-138-gT-450T-S7-1200": {
      serialNumber: "GTPL_138_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-124-gT-450T-S7-1200": {
      serialNumber: "GTPL_124_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-121-gT-1000T-S7-1200": {
      serialNumber: "GTPL_121_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-122-gT-1000T-S7-1200": {
      serialNumber: "GTPL_122_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-061-gT-450T-S7-1200": {
      serialNumber: "GTPL_061_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-131-gT-650T-S7-1200": {
      serialNumber: "GTPL_131_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-133-gT-650T-S7-1200": {
      serialNumber: "GTPL_133_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-154-gT-650T-S7-1200": {
      serialNumber: "GTPL_154_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-155-gT-650T-S7-1200": {
      serialNumber: "GTPL_155_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-081-gT-650T-S7-1200": {
      serialNumber: "GTPL_081_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-105-gT-650T-S7-1200": {
      serialNumber: "GTPL_105_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-068-gT-650T-S7-1200": {
      serialNumber: "GTPL_068_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-104-gT-650T-S7-1200": {
      serialNumber: "GTPL_104_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-134-gT-450T-S7-1200": {
      serialNumber: "GTPL_134_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-135-gT-450T-S7-1200": {
      serialNumber: "GTPL_135_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-145-gT-450T-S7-1200": {
      serialNumber: "GTPL_145_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-148-gT-450T-S7-1200": {
      serialNumber: "GTPL_148_PADDY",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
  };

  const baseConfig =
    machineConfig[autoPaddy as keyof typeof machineConfig] ||
    machineConfig["GTPL-132-300-AP-S7-1200"];

  // AP machines (300AP / 450AP) always show condenser fan speed.
  const currentConfig =
    (autoPaddy as string)?.includes("AP") &&
    !(baseConfig.controls as any).COND &&
    !(baseConfig.controls as any).CONDENSORFANSPEED
      ? ({
          ...baseConfig,
          controls: {
            ...baseConfig.controls,
            CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan" },
          },
        } as typeof baseConfig)
      : baseConfig;

  const handleBack = () => router.push(`/menu/${autoPaddy}`);

  const handleStart = async () => {
    await fetch("/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "START", tag: "AUTO_PROCESS_PB" }),
    });
  };

  const handleStop = async () => {
    await fetch("/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ command: "STOP", tag: "AUTO_PROCESS_STOP_PB" }),
    });
  };

  const handleToggleAutoAeration = async (checked: boolean) => {
    await fetch("/api/control", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        command: checked ? "ENABLE" : "DISABLE",
        tag: "AUTO_AERATION_ENA",
      }),
    });
  };

  const isMobile = useIsMobile();

  const CR_VALVE_MACHINES = [
    "GTPL-132-300-AP-S7-1200",
    "GTPL-136-gT-450AP",
    "GTPL-139-gT-300AP-S7-1200",
    "GTPL-144-gT-300AP-S7-1200",
    "GTPL-143-gT-450AP-S7-1200",
    "GTPL-142-gT-450AP-S7-1200",
    "GTPL-123-gT-450AP",
  ];

  const isOn = (v: string | undefined) => v?.toLowerCase() === "true";
  const hasVal = (v: any) => v !== undefined && v !== null && v !== "";

  // ── panel data ──────────────────────────────────────────────────────────
  const temperatureRows = Object.entries(currentConfig.temperatureSensors).map(
    ([key, sensor]: [string, any]) => ({
      key,
      label: t(sensor.label),
      value: formatValue(data?.[sensor.key], "\u00b0C"),
    })
  );

  const meterRows = Object.entries(currentConfig.controls).map(
    ([key, control]: [string, any]) => {
      let value;
      if (hasVal(data?.[control.key])) {
        value = data[control.key];
      } else if (key === "COND" || key === "CONDENSORFANSPEED") {
        // Condenser field name varies by PLC - fall back across all variants.
        value = [
          data?.Condenser_fan_speed,
          data?.Cond_fan_speed,
          data?.Value_to_Display_COND_ACT_SPEED,
          data?.CONDENSER_RPM,
        ].find(hasVal);
      }
      return {
        key,
        label: t(control.label),
        value: formatValue(value, "%"),
        percent: parseFloat(value) || 0,
      };
    }
  );

  const pressureUnit = isBarMachine ? " bar" : "psi";
  const readPressure = (tagKey: string) => {
    const raw = data?.[tagKey];
    const converted = isBarMachine ? convertPressureToBar(raw) : raw;
    return formatValue(hasVal(converted) ? converted : undefined, pressureUnit);
  };

  const valveRows = CR_VALVE_MACHINES.includes(autoPaddy as string)
    ? [
        { key: "cr25", label: "25%", on: isOn(cr25) },
        { key: "cr50", label: "50%", on: isOn(cr50) },
        { key: "cr75", label: "75%", on: isOn(cr75) },
        { key: "cr100", label: "100%", on: isOn(cr100) },
      ]
    : undefined;

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

        <ConnectionStatus
          state={telemetryState}
          lastUpdatedAt={lastUpdatedAt}
          isStale={isShowingStaleData}
          error={error}
        />

        <main className="relative z-10 w-full flex-1 px-4 py-8 md:px-8">
          <AnimatedContainer className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="plate text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Snowflake className="h-6 w-6" />
                </span>
                <div>
                  <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                    Auto mode
                  </span>
                  <h1 className="gradient-text text-3xl leading-tight font-semibold tracking-tight">
                    {t("PADDY AGEING")}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="plate inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold">
                  <Hash className="text-muted-foreground h-3.5 w-3.5" />
                  <span className="text-muted-foreground tracking-[0.18em]">SR</span>
                  <span className="font-mono tracking-wider">{autoPaddy}</span>
                </span>
                <span
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                    isConnected
                      ? "border-success/35 bg-success/10 text-success"
                      : "border-destructive/35 bg-destructive/10 text-destructive"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isConnected ? "pulse-dot bg-success" : "bg-destructive"
                    }`}
                  />
                  <span className="font-mono tracking-[0.18em]">
                    {isConnected ? "LIVE" : "OFFLINE"}
                  </span>
                </span>
                {}
                <span
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                    isPaddyAgeingMode
                      ? "border-success/35 bg-success/10 text-success"
                      : "text-muted-foreground bg-muted/50"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isPaddyAgeingMode ? "pulse-dot bg-success" : "bg-muted-foreground/50"
                    }`}
                  />
                  {isPaddyAgeingMode ? "ACTIVE" : "INACTIVE"} {"AGEING"}
                </span>
                {}
                <span
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                    isGrainChillingMode
                      ? "border-success/35 bg-success/10 text-success"
                      : "text-muted-foreground bg-muted/50"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isGrainChillingMode ? "pulse-dot bg-success" : "bg-muted-foreground/50"
                    }`}
                  />
                  {isGrainChillingMode ? "ACTIVE" : "INACTIVE"} {"CHILLING"}
                </span>
              </div>
            </div>
          </AnimatedContainer>

          {/* Diagram scrolls in its own viewport; telemetry reads underneath it */}
          <div className="space-y-6">
            <AnimatedContainer delay={1}>
              <DiagramFrame
                label="Process Diagram"
                machine={autoPaddy as string}
                live={isConnected}
              >
                {isMobile ? (
                  <Home
                    data={data}
                    formatValue={formatValue}
                    machineName={autoPaddy}
                  />
                ) : (
                  <AutoDiagram1
                    blower={Fan}
                    data={data}
                    formatValue={formatValue}
                    machineName={autoPaddy}
                    config={currentConfig}
                  />
                )}
              </DiagramFrame>
            </AnimatedContainer>

            <AnimatedContainer className="space-y-5" delay={2}>
              <AutoTelemetryPanel
                title={t("Temperature")}
                temperatures={temperatureRows}
                meters={meterRows}
                pressures={{
                  lpLabel: t("LP"),
                  lp: readPressure(currentConfig.compressor.lp),
                  hpLabel: t("HP"),
                  hp: readPressure(currentConfig.compressor.hp),
                }}
                valves={valveRows}
                t={t}
              />

              <Button
                variant="outline"
                className="group depth-lift h-12 w-full text-sm font-semibold"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-[var(--motion-fast)] group-hover:-translate-x-0.5" />
                {t("BACK")}
              </Button>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
