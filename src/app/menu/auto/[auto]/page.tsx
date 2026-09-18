"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
import { ArrowLeft, Cpu, Hash, Radio } from "lucide-react";

export default function AutoPage() {
  const router = useRouter();
  const { auto } = useParams();
  const {
    data,
    isConnected,
    telemetryState,
    lastUpdatedAt,
    isShowingStaleData,
    error,
    formatValue,
  } = useAutoData(auto as string);
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

  // Check if current machine is GTPL-137 or GTPL-138 (bar machines)
  const isBarMachine = auto === "GTPL-137-gT-450T-S7-1200" || auto === "GTPL-138-gT-450T-S7-1200";

  // Helper function to convert psi values to bar for display
  const convertPressureToBar = (value: any) => {
    if (isBarMachine) {
      if (value === undefined || value === null) return "--";
      const numericValue = parseFloat(value);
      if (isNaN(numericValue)) return value;
      const barValue = numericValue // 1 psi = 0.0689476 bar
      return barValue;
    }
    return value;
  };

  // Configuration for different machines
  const commonS7_200Config = {
    temperatureSensors: {
      TH: { key: "AFTER_HEATER_TEMP_Th", label: "Supply Air(TH)" },
      T1: { key: "COLD_AIR_TEMP_T1", label: "Cold Air(T1)" },
      T2: { key: "AMBIENT_AIR_TEMP_T2", label: "Ambient(T2)" },
    },
    controls: {
      AHT: { key: "AFTER_HEAT_VALVE_RPM", label: "After Heat(AHT)" },
      HGS: { key: "HOT_GAS_VALVE_RPM", label: "Hot Gas(HGS)" },
      BLOWER: { key: "BLOWER_RPM", label: "Blower" },
      COND: { key: "CONDENSER_RPM", label: "Condenser" },
    },
    compressor: {
      time: "COMPRESSOR_TIME",
      hp: "HP",
      lp: "LP",
    },
  };

  const machineConfig = {
    "GTPL-122-gT-1000T-S7-1200": {
      serialNumber: "GTPL_122_S7_1200",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        // T0SP: { key: "T0_set_point", label: "After Heat(T0 Sp)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // "Delta T": { key: "Delta_T_set_point", label: "Delta T" },
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
    "GTPL-030-gT-180E-S7-1200": {
 serialNumber: "GTPL_114",
      temperatureSensors: {
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan Speed" },
        HTR: { key: "Heater_speed", label: "Heater" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-044-GT-140E-S7-1200": {
      serialNumber: "GTPL_044",
      temperatureSensors: {
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan Speed" },
        HTR: { key: "Heater_speed", label: "Heater" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-115-gT-180E-S7-1200": {
      serialNumber: "GTPL_115",
      temperatureSensors: {
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        // COND: { key: "Condenser_fan_speed", label: "Condenser" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan Speed" },
        HTR: { key: "Heater_speed", label: "Heater" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-116-gT-240E-S7-1200": {
      serialNumber: "GTPL_116",
      temperatureSensors: {
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Condenser" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan Speed" },
        HTR: { key: "Heater_speed", label: "Heater" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-117-gT-320E-S7-1200": {
      serialNumber: "GTPL_117",
      temperatureSensors: {
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Condenser" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan Speed" },
        HTR: { key: "Heater_speed", label: "Heater" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-119-gT-180E-S7-1200": {
      serialNumber: "GTPL_119",
      temperatureSensors: {
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Condenser" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan Speed" },
        HTR: { key: "Heater_speed", label: "Heater" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-120-gT-180E-S7-1200": {
      serialNumber: "GTPL_120",
      temperatureSensors: {
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        // COND: { key: "Condenser_fan_speed", label: "Condenser" },
        CONDENSORFANSPEED: { key: "Cond_fan_speed", label: "Cond. Fan Speed" },
        HTR: { key: "Heater_speed", label: "Heater" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },

    "GTPL-124-gT-450T-S7-1200": {
      serialNumber: "GTPL_124",
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
      serialNumber: "GTPL_121",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        // T0SP: { key: "T0_set_point", label: "After Heat(T0 Sp)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // "Delta T": { key: "Delta_T_set_point", label: "Delta T" },
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
    "GTPL-118-gT-60T-S7-200": {
      serialNumber: "GTPL_118",
      temperatureSensors: {
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        Grain_temp: { key: "Grain_temp", label: "Grain Temperature" },
      },
      controls: {
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Condenser Fan" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-149-gT-60T-S7-1200": {
      serialNumber: "GTPL_149",
      temperatureSensors: {
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
      },
      controls: {
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Condenser Fan" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-108-gT-40E-P-S7-200": {
      serialNumber: "GTPL_108",
      ...commonS7_200Config,
    },
    "GTPL-109-gT-40E-P-S7-200": {
      serialNumber: "GTPL_109",
      ...commonS7_200Config,
    },
    "GTPL-110-gT-40E-P-S7-200": {
      serialNumber: "GTPL_110",
      ...commonS7_200Config,
    },
    "GTPL-111-gT-80E-P-S7-200": {
      serialNumber: "GTPL_111",
      ...commonS7_200Config,
    },
    "GTPL-112-gT-80E-P-S7-200": {
      serialNumber: "GTPL_112",
      ...commonS7_200Config,
    },
    "GTPL-113-gT-80E-P-S7-200": {
      serialNumber: "GTPL_113",
      ...commonS7_200Config,
    },
    "GTPL-132-300-AP-S7-1200": {
      serialNumber: "GTPL_132",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Condenser Fan" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
      "GTPL-133-gT-650T-S7-1200": {
      serialNumber: "GTPL_132",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // Note: TH (Supply Air) is intentionally excluded for this machine
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
      serialNumber: "GTPL_154",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // Note: TH (Supply Air) is intentionally excluded for this machine
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
      serialNumber: "GTPL_155",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // Note: TH (Supply Air) is intentionally excluded for this machine
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
      serialNumber: "GTPL_081",
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
      serialNumber: "GTPL_105",
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
      serialNumber: "GTPL_068",
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
      serialNumber: "GTPL_104",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // Note: TH (Supply Air) is intentionally excluded for this machine
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
      "GTPL-131-gT-650T-S7-1200": {
      serialNumber: "GTPL_131",
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
    "GTPL-137-gT-450T-S7-1200": {
      serialNumber: "GTPL_137",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {

        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Cond_fan_speed", label: "Condenser Fan" }, // Added Condenser Fan
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-138-gT-450T-S7-1200": {
      serialNumber: "GTPL_138",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
               AHT: { key: "AHT_valve_speed", label: "After Heat(AHT)" },

        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Cond_fan_speed", label: "Condenser Fan" }, // Added Condenser Fan
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-134-gT-450T-S7-1200": {
      serialNumber: "GTPL_134",
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
      serialNumber: "GTPL_135",
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
      serialNumber: "GTPL_145",
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
    // Philippines silo chillers — note the misspelled AHT_vale_speed column
    "GTPL-156-gT-450T-S7-1200": {
      serialNumber: "GTPL_156",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Supply Air(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Cond. Fan Speed" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-157-gT-450T-S7-1200": {
      serialNumber: "GTPL_157",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Supply Air(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Cond. Fan Speed" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-148-gT-450T-S7-1200": {
      serialNumber: "GTPL_148",
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
    "GTPL-136-gT-450AP": {
      serialNumber: "GTPL_136",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Condenser Fan" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-143-gT-450AP-S7-1200": {
      serialNumber: "GTPL_143",
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
    "GTPL-139-gT-300AP-S7-1200": {
      serialNumber: "GTPL_139",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Condenser Fan" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-144-gT-300AP-S7-1200": {
      serialNumber: "GTPL_144_GT_300AP_S7_1200",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "Air Outlet(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Condenser Fan" },
      },
      compressor: {
        time: "Compressor_timer",
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-061-gT-450T-S7-1200": {
      serialNumber: "GTPL_061",
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
    "Gtpl-S7-1200-02": {
      serialNumber: "GTOL-1023",
      temperatureSensors: {
        TH: { key: "AI_TH_Act", label: "Supply Air" },
        T0: { key: "AI_AIR_OUTLET_TEMP", label: "After Heat" },
        T1: { key: "AI_COLD_AIR_TEMP", label: "Cold Air" },
        T2: { key: "AI_AMBIANT_TEMP", label: "Ambient" },
      },
      controls: {
        HTR: { key: "Value_to_Display_HEATER", label: "Heater" },
        AHT: { key: "Value_to_Display_AHT_VALE_OPEN", label: "After Heat" },
        HGS: { key: "Value_to_Display_HOT_GAS_VALVE_OPEN", label: "Hot Gas" },
        BLOWER: { key: "Value_to_Display_EVAP_ACT_SPEED", label: "Blower" },
        COND: { key: "Value_to_Display_COND_ACT_SPEED", label: "Condenser" },
      },
      compressor: {
        time: "COMPRESSOR_TIME",
        hp: "AI_COND_PRESSURE",
        lp: "AI_SUC_PRESSURE",
      },
    },

  };

  const baseConfig =
    machineConfig[auto as keyof typeof machineConfig] ||
    machineConfig["GTPL-122-gT-1000T-S7-1200"];

  // AP machines (300AP / 450AP) always show condenser fan speed, even if their
  // config (or the fallback config) has no condenser control.
  const currentConfig =
    (auto as string)?.includes("AP") &&
    !(baseConfig.controls as any).COND &&
    !(baseConfig.controls as any).CONDENSORFANSPEED
      ? ({
          ...baseConfig,
          controls: {
            ...baseConfig.controls,
            CONDENSORFANSPEED: {
              key: "Cond_fan_speed",
              label: "Cond. Fan Speed",
            },
          },
        } as typeof baseConfig)
      : baseConfig;

  const handleBack = () => router.push(`/menu/${auto}`);

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
    "GTPL-121-gT-1000T-S7-1200",
    "GTPL-122-gT-1000T-S7-1200",
    "GTPL-133-gT-650T-S7-1200",
    "GTPL-154-gT-650T-S7-1200",
    "GTPL-155-gT-650T-S7-1200",
    "GTPL-081-gT-650T-S7-1200",
    "GTPL-105-gT-650T-S7-1200",
    "GTPL-131-gT-650T-S7-1200",
    "GTPL-068-gT-650T-S7-1200",
    "GTPL-104-gT-650T-S7-1200",
    "GTPL-132-300-AP-S7-1200",
    "GTPL-134-gT-450T-S7-1200",
    "GTPL-135-gT-450T-S7-1200",
    "GTPL-145-gT-450T-S7-1200",
    "GTPL-148-gT-450T-S7-1200",
    "GTPL-136-gT-450AP",
    "GTPL-139-gT-300AP-S7-1200",
    "GTPL-142-gT-450AP-S7-1200",
    "GTPL-123-gT-450AP",
    "GTPL-143-gT-450AP-S7-1200",
    "GTPL-144-gT-300AP-S7-1200",
    "GTPL-061-gT-450T-S7-1200",
  ];

  const HEATER_SPEED_MACHINES = [
    "GTPL-120-gT-180E-S7-1200",
    "GTPL-116-gT-240E-S7-1200",
    "GTPL-115-gT-180E-S7-1200",
    "GTPL-030-gT-180E-S7-1200",
    "GTPL-117-gT-320E-S7-1200",
    "GTPL-119-gT-180E-S7-1200",
    "GTPL-044-GT-140E-S7-1200",
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

  const meterRows = Object.entries(currentConfig.controls)
    .filter(
      ([, control]: [string, any]) =>
        !(control.label === "Heater" && (auto as string)?.endsWith("200"))
    )
    .map(([key, control]: [string, any]) => {
      let value;
      if (hasVal(data?.[control.key])) {
        value = data[control.key];
      } else if (key === "COND" || key === "CONDENSORFANSPEED") {
        // Condenser field name varies by PLC - fall back across all variants.
        // GTPL-149 (60T) publishes Condenser_fan_speed.
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
    });

  if (HEATER_SPEED_MACHINES.includes(auto as string)) {
    meterRows.push({
      key: "HEATER_SPEED",
      label: t("Heater"),
      value: formatValue(data?.Heater_speed, "%"),
      percent: parseFloat(data?.Heater_speed) || 0,
    });
  }

  const pressureUnit = isBarMachine ? " bar" : "psi";
  const readPressure = (tagKey: string) => {
    const raw = data?.[tagKey];
    const converted = isBarMachine ? convertPressureToBar(raw) : raw;
    return formatValue(hasVal(converted) ? converted : undefined, pressureUnit);
  };

  const valveRows = CR_VALVE_MACHINES.includes(auto as string)
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
                  <Cpu className="h-6 w-6" />
                </span>
                <div>
                  <span className="text-muted-foreground text-[11px] font-semibold tracking-[0.18em] uppercase">
                    Auto mode
                  </span>
                  <h1 className="gradient-text text-3xl leading-tight font-semibold tracking-tight">
                    {t("SELECT AUTO")}
                  </h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="plate inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold">
                  <Hash className="text-muted-foreground h-3.5 w-3.5" />
                  <span className="text-muted-foreground tracking-[0.18em]">SR</span>
                  <span className="font-mono tracking-wider">{auto}</span>
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
                {isRunning && (
                  <span className="border-primary/30 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold">
                    <Radio className="h-3.5 w-3.5" />
                    RUNNING
                  </span>
                )}
              </div>
            </div>
          </AnimatedContainer>

          {/* Diagram scrolls in its own viewport; telemetry reads underneath it */}
          <div className="space-y-6">
            <AnimatedContainer delay={1}>
              <DiagramFrame
                label="Process Diagram"
                machine={auto as string}
                live={isConnected}
              >
                {isMobile ? (
                  <Home
                    data={data}
                    formatValue={formatValue}
                    machineName={auto}
                  />
                ) : (
                  <AutoDiagram1
                    blower={Fan}
                    data={data}
                    formatValue={formatValue}
                    machineName={auto}
                    config={currentConfig}
                  />
                )}
              </DiagramFrame>
            </AnimatedContainer>

            <AnimatedContainer className="space-y-5" delay={2}>
              <AutoTelemetryPanel
                title={t("System Status")}
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

              {auto === "Gtpl-S7-1200-02" && (
                <div className="surface flex items-center justify-between gap-3 px-4 py-3.5">
                  <label htmlFor="auto-aeration" className="text-sm font-medium">
                    {t("Auto Aeration")}
                  </label>
                  <Switch
                    id="auto-aeration"
                    checked={isAutoAeration}
                    onCheckedChange={handleToggleAutoAeration}
                  />
                </div>
              )}

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
