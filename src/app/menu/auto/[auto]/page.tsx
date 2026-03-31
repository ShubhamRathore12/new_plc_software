"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { ConnectionStatus } from "@/components/ui/connection-status";
import Home from "@/components/diagram-controls";
import { useAutoData } from "@/hooks/useAutoData";
import AutoDiagram from "@/components/AutoDiagram";
import HVACDashboard from "../../../../components/AutoDiagram";
import Fan from "../../../../../public/images/fan.png";
import useIsMobile from "@/hooks/useIsMobile";
import MobileAutoDiagram from "@/components/MobileAutoDiagram";
import AutoDiagram1 from "@/components/AutoDiagram1";
import { useLanguage } from "@/providers/language-provider";

export default function AutoPage() {
  const router = useRouter();
  const { auto } = useParams();
  const { data, isConnected, error, formatValue } = useAutoData(auto as string);
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
  const isBarMachine = auto === "GTPL-137-GT-450T-S7-1200" || auto === "GTPL-138-GT-450T-S7-1200";

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
      T0: { key: "AIR_OUTLET_TEMP", label: "After Heat(T0)" },
      T1: { key: "COLD_AIR_TEMP_T1", label: "Cold Air(T1)" },
      T2: { key: "AMBIENT_AIR_TEMP_T2", label: "Ambient(T2)" },
    },
    controls: {
      HTR: { key: "AFTER_HEAT_VALVE_RPM", label: "Heater" },
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
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
    "GTPL-30-gT-180E-S7-1200": {
      serialNumber: "GTPL_114",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        // T0SP: { key: "T0_set_point", label: "After Heat(T0 Sp)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },

        // "Delta T": { key: "Delta_T_set_point", label: "Delta T" },
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
    "GTPL-115-gT-180E-S7-1200": {
      serialNumber: "GTPL_115",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        // T0SP: { key: "T0_set_point", label: "After Heat(T0 Sp)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },

        // "Delta T": { key: "Delta_T_set_point", label: "Delta T" },
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
    "GTPL-116-gT-240E-S7-1200": {
      serialNumber: "GTPL_116",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        // T0SP: { key: "T0_set_point", label: "After Heat(T0 Sp)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },

        // "Delta T": { key: "Delta_T_set_point", label: "Delta T" },
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
    "GTPL-117-gT-320E-S7-1200": {
      serialNumber: "GTPL_117",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        // T0SP: { key: "T0_set_point", label: "After Heat(T0 Sp)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },

        // "Delta T": { key: "Delta_T_set_point", label: "Delta T" },
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
    "GTPL-119-gT-180E-S7-1200": {
      serialNumber: "GTPL_119",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        // T0SP: { key: "T0_set_point", label: "After Heat(T0 Sp)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        // "Delta T": { key: "Delta_T_set_point", label: "Delta T" },
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },

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
    "GTPL-120-gT-180E-S7-1200": {
      serialNumber: "GTPL_120",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        // T0SP: { key: "T0_set_point", label: "After Heat(T0 Sp)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
        TH: { key: "TH_temp_mean", label: "Supply Air(TH)" },

        // "Delta T": { key: "Delta_T_set_point", label: "Delta T" },
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

    "GTPL-121-gT-1000T-S7-1200": {
      serialNumber: "GTPL_121",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
      "GTPL-133-GT-650T-S7-1200": {
      serialNumber: "GTPL_132",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
      "GTPL-131-GT-650T-S7-1200": {
      serialNumber: "GTPL_131",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
    "GTPL-137-GT-450T-S7-1200": {
      serialNumber: "GTPL_137",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
    "GTPL-138-GT-450T-S7-1200": {
      serialNumber: "GTPL_138",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
    "GTPL-139-GT-300AP-S7-1200": {
      serialNumber: "GTPL_139",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
        T1: { key: "T1_temp_mean", label: "Cold Air(T1)" },
        T2: { key: "T2_temp_mean", label: "Ambient(T2)" },
      },
      controls: {
        AHT: { key: "AHT_vale_speed", label: "After Heat(AHT)" },
        HGS: { key: "Hot_valve_speed", label: "Hot Gas(HGS)" },
        BLOWER: { key: "Blower_speed", label: "Blower" },
        COND: { key: "Condenser_fan_speed", label: "Condenser Fan" },
      },
      pressures: {
        hp: "HP_value",
        lp: "LP_value",
      },
    },
    "GTPL-144-GT-300AP-S7-1200": {
      serialNumber: "GTPL_144_GT_300AP_S7_1200",
      temperatureSensors: {
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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
        T0: { key: "T0_temp_mean", label: "After Heat(T0)" },
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

  const currentConfig =
    machineConfig[auto as keyof typeof machineConfig] ||
    machineConfig["GTPL-122-gT-1000T-S7-1200"];

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

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <ConnectionStatus isConnected={isConnected} error={error} />
        <main className="flex-1 container py-8 relative z-10">
          <AnimatedContainer className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/50">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  {t("SELECT AUTO")}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    SR. NO. {auto}
                  </span>
                </p>
              </div>
            </motion.div>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
              <div className="relative w-full h-full">
                {/* <Home
                  data={data}
                  formatValue={formatValue}
                  machineName={auto}
                /> */}
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
                  />
                )}
              </div>
            </AnimatedContainer>

            <AnimatedContainer className="space-y-6" delay={2}>
              {/* <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">System Status</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Heater</span>
                      <span className="text-sm font-medium">%</span>
                    </div>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, delay: 2.2 }}
                    >
                      <Progress value={90} className="h-2" />
                    </motion.div>
                    <Badge>{isRunning ? "Running" : "Stopped"}</Badge>
                  </div>
                </CardContent>
              </Card> */}

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-2xl hover:shadow-3xl transition-all duration-500 overflow-hidden group">
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="p-6 relative">
                    {/* Heading with icon */}
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/50">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t("Temperature")}
                      </h2>
                    </div>

                    <div className="space-y-3">
                    {/* Temperature sensors */}
                    {Object.entries(currentConfig.temperatureSensors).map(([key, sensor], index) => {
                      const value = data?.[sensor.key];
                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                          className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 border border-gray-200/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 animate-pulse" />
                            {t(sensor.label)}
                          </span>
                          <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            {formatValue(value, "°C")}
                          </span>
                        </motion.div>
                      );
                    })}

                    {/* CR Valve Status for specific machines */}
                    {[
                      "GTPL-121-gT-1000T-S7-1200",
                      "GTPL-122-gT-1000T-S7-1200",
                      "GTPL-133-GT-650T-S7-1200",
                      "GTPL-131-GT-650T-S7-1200",
                      "GTPL-132-300-AP-S7-1200",
                      "GTPL-134-gT-450T-S7-1200",
                      "GTPL-135-gT-450T-S7-1200",
                      "GTPL-145-gT-450T-S7-1200",
                      "GTPL-136-gT-450AP",
                      "GTPL-139-GT-300AP-S7-1200",
                      "GTPL-142-gT-450AP-S7-1200",
                      "GTPL-123-GT-450AP",
                      "GTPL-143-gT-450AP-S7-1200",
                      "GTPL-061-gT-450T-S7-1200"
                    ].includes(auto as string) && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.25 }}
                          className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                            CR Valve 25% 
                          </span>
                          <span className={`font-bold text-lg ${cr25?.toLowerCase() === "true" ? "text-green-600" : "text-red-600"}`}>
                            {cr25?.toLowerCase() === "true" ? "ON" : "OFF"}
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                          className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                            CR Valve 50% 
                          </span>
                          <span className={`font-bold text-lg ${cr50?.toLowerCase() === "true" ? "text-green-600" : "text-red-600"}`}>
                            {cr50?.toLowerCase() === "true" ? "ON" : "OFF"}
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.35 }}
                          className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                            CR Valve 75% 
                          </span>
                          <span className={`font-bold text-lg ${cr75?.toLowerCase() === "true" ? "text-green-600" : "text-red-600"}`}>
                            {cr75?.toLowerCase() === "true" ? "ON" : "OFF"}
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.4 }}
                          className="group flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
                            CR Valve 100% 
                          </span>
                          <span className={`font-bold text-lg ${cr100?.toLowerCase() === "true" ? "text-green-600" : "text-red-600"}`}>
                            {cr100?.toLowerCase() === "true" ? "ON" : "OFF"}
                          </span>
                        </motion.div>
                      </>
                    )}

                    {/* Controls */}
                    {Object.entries(currentConfig.controls).map(([key, control], index) => {
                      // Example: don't show Heater if machine ends with 200
                      if (control.label === "Heater" && (auto as string)?.endsWith("200")) {
                        return null;
                      }

                      // Handle zero values correctly by checking for explicit undefined/null
                      let value;
                      if (data?.[control.key] !== undefined && data?.[control.key] !== null) {
                        value = data[control.key];
                      }

                      const percentage = parseFloat(value) || 0;

                      return (
                        <motion.div
                          key={key}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: (Object.keys(currentConfig.temperatureSensors).length + index) * 0.05 }}
                          className="group"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex items-center gap-2">
                              <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              {t(control.label)}
                            </span>
                            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {formatValue(value, "%")}
                            </span>
                          </div>
                          <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: (Object.keys(currentConfig.temperatureSensors).length + index) * 0.05 + 0.3 }}
                              className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full shadow-lg"
                              style={{
                                boxShadow: '0 0 10px rgba(168, 85, 247, 0.5)'
                              }}
                            />
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Compressor values */}
                    {['GTPL-120-gT-180E-S7-1200', 'GTPL-116-gT-240E-S7-1200', 'GTPL-115-gT-180E-S7-1200', 'GTPL-30-gT-180E-S7-1200', 'GTPL-116-gT-240E-S7-1200', 'GTPL-117-gT-320E-S7-1200', 'GTPL-119-gT-180E-S7-1200', 'GTPL-120-gT-180E-S7-1200',].includes(auto as string) &&
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                        className="group"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                            {t("Heater")}
                          </span>
                          <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            {(() => {
                              const heaterValue = data?.Heater_speed;
                              return formatValue(
                                heaterValue !== undefined && heaterValue !== null ? heaterValue : undefined,
                                "%"
                              );
                            })()}
                          </span>
                        </div>
                        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${parseFloat(data?.Heater_speed) || 0}%` }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 rounded-full shadow-lg"
                            style={{
                              boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)'
                            }}
                          />
                        </div>
                      </motion.div>
                    }

                    {/* Add bar values after HP and LP for machines 137 and 138 */}
                    {['GTPL-137-GT-450T-S7-1200', 'GTPL-138-GT-450T-S7-1200'].includes(auto as string) && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            {t("LP")}
                          </span>
                          <span className="font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            {(() => {
                              const lpValue = data?.[currentConfig.compressor.lp];
                              const convertedValue = convertPressureToBar(lpValue);
                              return formatValue(
                                convertedValue !== undefined && convertedValue !== null ? convertedValue : undefined,
                                isBarMachine ? " bar" : "psi"
                              );
                            })()}
                          </span>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                          className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            {t("HP")}
                          </span>
                          <span className="font-bold text-lg bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            {(() => {
                              const hpValue = data?.[currentConfig.compressor.hp];
                              const convertedValue = convertPressureToBar(hpValue);
                              return formatValue(
                                convertedValue !== undefined && convertedValue !== null ? convertedValue : undefined,
                                isBarMachine ? " bar" : "psi"
                              );
                            })()}
                          </span>
                        </motion.div>
                      </>
                    )}

                    {/* For other machines, show standard HP and LP */}
                    {!['GTPL-137-GT-450T-S7-1200', 'GTPL-138-GT-450T-S7-1200'].includes(auto as string) && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border border-cyan-200 dark:border-cyan-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            {t("LP")}
                          </span>
                          <span className="font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                            {(() => {
                              const lpValue = data?.[currentConfig.compressor.lp];
                              return formatValue(
                                lpValue !== undefined && lpValue !== null ? lpValue : undefined,
                                "psi"
                              );
                            })()}
                          </span>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                          className="flex justify-between items-center p-3 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-700 hover:shadow-lg transition-all duration-300"
                        >
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            {t("HP")}
                          </span>
                          <span className="font-bold text-lg bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                            {(() => {
                              const hpValue = data?.[currentConfig.compressor.hp];
                              return formatValue(
                                hpValue !== undefined && hpValue !== null ? hpValue : undefined,
                                "psi"
                              );
                            })()}
                          </span>
                        </motion.div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
              </motion.div>


              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.6 }}
              >
                {/* {!isRunning ? (
                  <Button className="flex-1" onClick={handleStart}>
                    {t("Start")}
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleStop}
                  >
                    {t("Stop")}
                  </Button>
                )} */}

                {auto === "Gtpl-S7-1200-02" && (
                  <div className="flex items-center gap-2">
                    <Switch
                      id="auto-aeration"
                      checked={isAutoAeration}
                      onCheckedChange={handleToggleAutoAeration}
                    />
                    <label htmlFor="auto-aeration" className="text-sm">
                      Auto Aeration
                    </label>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <Button
                  variant="outline"
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl group"
                  onClick={handleBack}
                >
                  <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  BACK
                </Button>
              </motion.div>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
