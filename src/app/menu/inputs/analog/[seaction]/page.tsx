"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAutoData } from "@/hooks/useAutoData"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { motion } from "framer-motion"
import { Activity, Thermometer, Gauge } from "lucide-react"
import {
  GTPL_156_157_ANALOG_CONFIG,
  isGTPL156157,
} from "@/lib/gtpl156157Config"
import ScreenHeader from "@/components/ScreenHeader";
import { AnalogRow } from "@/components/SignalRow";

export default function AnalogPage() {
  const { seaction } = useParams()
  const device = seaction?.toString()
  
  // Check if current device is GTPL-137 or GTPL-138 (bar machines)
  const isBarMachine = device === "GTPL-137-gT-450T-S7-1200" || device === "GTPL-138-gT-450T-S7-1200"

  // GTPL-156 / 157 (Philippines silo) — extra silo static-pressure input, no TH probes
  const isSiloMachine = isGTPL156157(device)

  const analogInputs = [
    {
      section: "ANALOG INPUTS (4-20mA)",
      items: 
        (device === "GTPL-132-300-AP-S7-1200" || device === "GTPL-136-gT-450AP" || device === "GTPL-139-gT-300AP-S7-1200" || device === "GTPL-144-gT-300AP-S7-1200" || device === "GTPL-142-gT-450AP-S7-1200" || device === "GTPL-123-gT-450AP" || device === "GTPL-143-gT-450AP-S7-1200") 
        ? [
            {
              description: "Suction pressure",
              value: isBarMachine ? "8.3" : "120",
              unit: isBarMachine ? "bar" : "psi",
            },
            {
              description: "Discharge pressure",
              value: isBarMachine ? "16.5" : "240",
              unit: isBarMachine ? "bar" : "psi",
            },
          ]
        : [
            {
              description: "Suction Pressure",
              value: isBarMachine ? "8.3" : "120",
              unit: isBarMachine ? "bar" : "psi",
            },
            {
              description: "Discharge Pressure",
              value: isBarMachine ? "16.5" : "240",
              unit: isBarMachine ? "bar" : "psi",
            },
            ...(isSiloMachine
              ? [
                  {
                    description: "Static Pressure",
                    value: "0",
                    unit: "Pa",
                  },
                ]
              : []),
          ],
    },
    {
      section: "ANALOG INPUTS (RTD Type)",
      items: 
        (device === "GTPL-132-300-AP-S7-1200" || device === "GTPL-136-gT-450AP" || device === "GTPL-139-gT-300AP-S7-1200" || device === "GTPL-144-gT-300AP-S7-1200" || device === "GTPL-142-gT-450AP-S7-1200" || device === "GTPL-123-gT-450AP" || device === "GTPL-143-gT-450AP-S7-1200") 
        ? [
            {
              description: "T0 probe #1 (Afterheater)",
              value: "28.5",
              unit: "°C",
            },
            {
              description: "T0 probe #2 (Afterheater)",
              value: "28.3",
              unit: "°C",
            },
            {
              description: "T1 probe #1 (Cold Air)",
              value: "24.2",
              unit: "°C",
            },
            {
              description: "T1 probe #2 (Cold Air)",
              value: "24.1",
              unit: "°C",
            },
            {
              description: "T2 probe #1 (Ambient Air)",
              value: "30.0",
              unit: "°C",
            },
            {
              description: "T2 probe #2 (Ambient Air)",
              value: "30.1",
              unit: "°C",
            },
            {
              description: "TH probe #1 (Supply Air)",
              value: "32.0",
              unit: "°C",
            },
            {
              description: "TH probe #2 (Supply Air)",
              value: "32.2",
              unit: "°C",
            },
          ]
        : [
            {
              description: "T2.1 Ambient Temp",
              value: "30.0",
              unit: "°C",
            },
            {
              description: "T2.2 Ambient Temp",
              value: "30.1",
              unit: "°C",
            },
            {
              description: "T1.1 Cold Temp",
              value: "24.2",
              unit: "°C",
            },
            {
              description: "T1.2 Cold Temp",
              value: "24.1",
              unit: "°C",
            },
            {
              description: "T0.1 Air Outlet Temp",
              value: "28.5",
              unit: "°C",
            },
            {
              description: "T0.2 Air Outlet Temp",
              value: "28.3",
              unit: "°C",
            },
                {
              description: "TH.1 Supply Air",
              value: "32.0",
              unit: "°C",
            },
               {
              description: "TH.2 Supply Air",
              value: "32.2",
              unit: "°C",
            },
          ],
    },
  ]

  // Analog outputs will be dynamically populated from live data
  const analogOutputsTemplate = [
    { description: "Blower Speed", unit: "%" },
    { description: "Condenser fan speed", unit: "%" },
    { description: "Hot Gas Valve", unit: "%" },
    { description: "Afterheat Valve", unit: "%" },
    { description: "Heater", unit: "%" },
  ]

  const sharedS7_1200_config = {
    displayName: "S7-1200 Machine",
    inputs: {
      "Suction Pressure": "LP_value",
      "Discharge Pressure": "HP_value",
      "T2.1 Ambient Temp": "T2_1_ambient_temp",
      "T2.2 Ambient Temp": "T2_2_ambient_temp",
      "T1.1 Cold Temp": "T1_1_cold_air_temp",
      "T1.2 Cold Temp": "T1_2_cold_air_temp",
      "T0.1 Air Outlet Temp": "T0_1_air_outlet_temp",
      "T0.2 Air Outlet Temp": "T0_2_air_outlet_temp",
    },
    outputs: {
      "Blower Speed": "Blower_speed",
      "Condenser fan speed": "Cond_fan_speed",
      "Cond. Fan Speed": "Condenser_fan_speed",
      "Hot Gas Valve": "Hot_valve_speed",
      "Afterheat Valve": "AHT_valve_speed",
    },
  }
  // 650T machines send the afterheat tag as "AHT_vale_speed" (not "AHT_valve_speed").
  const shared650T_config = {
    ...sharedS7_1200_config,
    outputs: {
      ...sharedS7_1200_config.outputs,
      "Afterheat Valve": "AHT_vale_speed",
    },
  }
  const GTPL_132_config = {
    displayName: "S7-1200 Machine",
    inputs: {
      "Suction pressure": "LP_value",
      "Discharge pressure": "HP_value",
      "T0 probe #1 (Afterheater)": "T0_1_air_outlet_temp",
      "T0 probe #2 (Afterheater)": "T0_2_air_outlet_temp",
      "T1 probe #1 (Cold Air)": "T1_1_cold_air_temp",
      "T1 probe #2 (Cold Air)": "T1_2_cold_air_temp",
      "T2 probe #1 (Ambient Air)": "T2_1_ambient_temp",
      "T2 probe #2 (Ambient Air)": "T2_2_ambient_temp",
      "TH probe #1 (Supply Air)": "TH_1_supply_air_temp",
      "TH probe #2 (Supply Air)": "TH_2_supply_air_temp",
    },
    outputs: {
      "Blower Speed": "Blower_speed",
      "Condenser fan speed": "Condenser_fan_speed",
      "Cond. Fan Speed": "Cond_fan_speed",
      "Hot Gas Valve": "Hot_valve_speed",
      "Afterheat Valve": "AHT_valve_speed",
      "Heater": "Heater_speed",
    },
  }

  const GTPL_137_config = {
    displayName: "GTPL-137 Machine",
    inputs: {
      "Suction Pressure": "LP_value",
      "Discharge Pressure": "HP_value",
      "T2.1 Ambient Temp": "T2_1_ambient_temp",
      "T2.2 Ambient Temp": "T2_2_ambient_temp",
      "T1.1 Cold Temp": "T1_1_cold_air_temp",
      "T1.2 Cold Temp": "T1_2_cold_air_temp",
      "T0.1 Air Outlet Temp": "T0_1_air_outlet_temp",
      "T0.2 Air Outlet Temp": "T0_2_air_outlet_temp",
    },
    outputs: {
      "Blower Speed": "Blower_speed",
      "Condenser fan speed": "Cond_fan_speed",
      "Cond. Fan Speed": "Condenser_fan_speed",
      "Hot Gas Valve": "Hot_valve_speed",
      "Afterheat Valve": "AHT_valve_speed",
    },
  }

  const GTPL_138_config = {
    displayName: "GTPL-138 Machine",
    inputs: {
      "Suction Pressure": "LP_value",
      "Discharge Pressure": "HP_value",
      "T2.1 Ambient Temp": "T2_1_ambient_temp",
      "T2.2 Ambient Temp": "T2_2_ambient_temp",
      "T1.1 Cold Temp": "T1_1_cold_air_temp",
      "T1.2 Cold Temp": "T1_2_cold_air_temp",
      "T0.1 Air Outlet Temp": "T0_1_air_outlet_temp",
      "T0.2 Air Outlet Temp": "T0_2_air_outlet_temp",
    },
    outputs: {
      "Blower Speed": "Blower_speed",
      "Condenser fan speed": "Cond_fan_speed",
      "Cond. Fan Speed": "Condenser_fan_speed",
      "Hot Gas Valve": "Hot_valve_speed",
      "Afterheat Valve": "AHT_valve_speed",
    },
  }

  const GTPL_061_config = {
    displayName: "GTPL-061 Machine",
    inputs: {
      "Suction Pressure": "LP_value",
      "Discharge Pressure": "HP_value",
      "T2.1 Ambient Temp": "T2_1_ambient_temp",
      "T2.2 Ambient Temp": "T2_2_ambient_temp",
      "T1.1 Cold Temp": "T1_1_cold_air_temp",
      "T1.2 Cold Temp": "T1_2_cold_air_temp",
      "T0.1 Air Outlet Temp": "T0_1_air_outlet_temp",
      "T0.2 Air Outlet Temp": "T0_2_air_outlet_temp",
    
    },
    outputs: {
      "Blower Speed": "Blower_speed",
      "Hot Gas Valve": "Hot_valve_speed",
      "Afterheat Valve": "AHT_valve_speed",
    },
  }

  const GTPL_134_135_config = {
    displayName: "S7-1200 Machine",
    inputs: {
      "Suction Pressure": "LP_value",
      "Discharge Pressure": "HP_value",
      "T2.1 Ambient Temp": "T2_1_ambient_temp",
      "T2.2 Ambient Temp": "T2_2_ambient_temp",
      "T1.1 Cold Temp": "T1_1_cold_air_temp",
      "T1.2 Cold Temp": "T1_2_cold_air_temp",
      "T0.1 Air Outlet Temp": "T0_1_air_outlet_temp",
      "T0.2 Air Outlet Temp": "T0_2_air_outlet_temp",
    },
    outputs: {
      "Blower Speed": "Blower_speed",
      "Condenser fan speed": "Cond_fan_speed",
      "Cond. Fan Speed": "Condenser_fan_speed",
      "Hot Gas Valve": "Hot_valve_speed",
      "Afterheat Valve": "AHT_valve_speed",
    },
  }

  const GTPL_60_config = {
    displayName: "GTPL-60 Machine",
    inputs: {
      "Suction Pressure": "LP_value",
      "Discharge Pressure": "HP_value",
      "T2.1 Ambient Temp": "T2_ambient_temp",
      "T1.1 Cold Temp": "T1_cold_air_temp",
      "T0.1 Air Outlet Temp": "T0_air_outlet_temp",
    },
    outputs: {
      "Blower Speed": "Blower_speed",
      "Condenser fan speed": "Condenser_fan_speed",
      "Cond. Fan Speed": "Cond_fan_speed",
      "Hot Gas Valve": "Hot_valve_speed",
      "Afterheat Valve": "AHT_valve_speed",
    },
  }

  const S7_200_config = {
    displayName: "S7-200 Machine",
    inputs: {
      "Suction Pressure": "LP",
      "Discharge Pressure": "HP",
      "T2.1 Ambient Temp": "AMBIENT_AIR_TEMP_T2",
      "T2.2 Ambient Temp": "AMBIENT_AIR_TEMP_T2",
      "T1.1 Cold Temp": "COLD_AIR_TEMP_T1",
      "T1.2 Cold Temp": "COLD_AIR_TEMP_T1",
      "TH.1 Supply Air": "AFTER_HEATER_TEMP_Th",
      "TH.2 Supply Air": "AFTER_HEATER_TEMP_Th",
    },
    outputs: {
      "Blower Speed": "BLOWER_RPM",
      "Condenser fan speed": "CONDENSER_RPM",
      "Hot Gas Valve": "HOT_GAS_VALVE_RPM",
      "Afterheat Valve": "AFTER_HEAT_VALVE_RPM",
    },
  }

  const GTPL_30_config = {
    displayName: "S7-1200 Machine",
    inputs: {
      ...sharedS7_1200_config.inputs,
      "TH.1 Supply Air": "TH_1_supply_air_temp",
      "TH.2 Supply Air": "TH_2_supply_air_temp",
    },
    outputs: {
      ...sharedS7_1200_config.outputs,
      "Heater": "Heater_speed",
         "Afterheat Valve": "AHT_vale_speed",
    },
  }

  const machineConfigs: Record<
    string,
    {
      inputs: Record<string, string>
      outputs: Record<string, string>
      displayName: string
    }
  > = {
    "GTPL-115-gT-180E-S7-1200": GTPL_30_config,
    "GTPL-030-gT-180E-S7-1200": GTPL_30_config,
    "GTPL-044-GT-140E-S7-1200": GTPL_30_config,
    "GTPL-119-gT-180E-S7-1200": GTPL_30_config,
    "GTPL-120-gT-180E-S7-1200": GTPL_30_config,
    "GTPL-116-gT-240E-S7-1200": GTPL_30_config,
    "GTPL-117-gT-320E-S7-1200": GTPL_30_config,
    "GTPL-124-gT-450T-S7-1200": sharedS7_1200_config,
    "GTPL-121-gT-1000T-S7-1200": sharedS7_1200_config,
    "GTPL-122-gT-1000T-S7-1200": sharedS7_1200_config,
    "GTPL-133-gT-650T-S7-1200": shared650T_config,
    "GTPL-154-gT-650T-S7-1200": shared650T_config,
    "GTPL-155-gT-650T-S7-1200": shared650T_config,
    "GTPL-081-gT-650T-S7-1200": shared650T_config,
    "GTPL-105-gT-650T-S7-1200": shared650T_config,
    "GTPL-131-gT-650T-S7-1200": shared650T_config,
    "GTPL-068-gT-650T-S7-1200": shared650T_config,
    "GTPL-104-gT-650T-S7-1200": shared650T_config,
    "GTPL-132-300-AP-S7-1200": GTPL_132_config,

    "GTPL-156-gT-450T-S7-1200": GTPL_156_157_ANALOG_CONFIG,
    "GTPL-157-gT-450T-S7-1200": GTPL_156_157_ANALOG_CONFIG,
    "GTPL-134-gT-450T-S7-1200": GTPL_134_135_config,
    "GTPL-135-gT-450T-S7-1200": GTPL_134_135_config,
    "GTPL-145-gT-450T-S7-1200": GTPL_134_135_config,
    "GTPL-148-gT-450T-S7-1200": GTPL_134_135_config,
    "GTPL-136-gT-450AP": GTPL_132_config,
    "GTPL-137-gT-450T-S7-1200": GTPL_137_config,
    "GTPL-138-gT-450T-S7-1200": GTPL_138_config,
    "GTPL-061-gT-450T-S7-1200": GTPL_061_config,
    "GTPL-139-gT-300AP-S7-1200":GTPL_138_config,
    "GTPL-144-gT-300AP-S7-1200":GTPL_138_config,
    "GTPL-142-gT-450AP-S7-1200":GTPL_132_config,
    "GTPL-123-gT-450AP":GTPL_132_config,
    "GTPL-143-gT-450AP-S7-1200":GTPL_132_config,
    "GTPL-118-gT-60T-S7-200": GTPL_60_config,
    "GTPL-149-gT-60T-S7-1200": GTPL_60_config,
    "GTPL-108-gT-40E-P-S7-200": S7_200_config,
    "GTPL-109-gT-40E-P-S7-200": S7_200_config,
    "GTPL-110-gT-40E-P-S7-200": S7_200_config,
    "GTPL-111-gT-80E-P-S7-200": S7_200_config,
    "GTPL-112-gT-80E-P-S7-200": S7_200_config,
    "GTPL-113-gT-80E-P-S7-200": S7_200_config,
    default: {
      displayName: "Default Machine",
      inputs: {
        "Suction pressure": "LP",
        "Discharge pressure": "HP",
        "T0 probe #1 (Afterheater)": "AIR_OUTLET_TEMP",

        "T1 probe #1 (Cold Air)": "COLD_AIR_TEMP_T1",

        "T2 probe #1 (Ambient Air)": "AMBIENT_AIR_TEMP_T2",

        "TH probe #1 (Supply Air)": "AFTER_HEATER_TEMP_Th",

      },
      outputs: {
        "Blower speed": "BLOWER_RPM",
        "Cond. Fan speed": "Condenser_fan_speed",
        "Cond. Fan Speed": "Cond_fan_speed",
        "Hot gas valve": "HOT_GAS_VALVE_RPM",
        "Afterheat valve": "AFTER_HEAT_VALVE_RPM",
        "Heater": "Heater_speed",
      },
    },
  }

  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement[]>([])

  // Get current machine configuration
  const currentMachineConfig = machineConfigs[device || ""] || machineConfigs["default"]
  const analogInputValueMap = currentMachineConfig.inputs
  const analogOutputValueMap = currentMachineConfig.outputs

  // Added error handling for when device is undefined
  const { data, isConnected, error, formatValue } = useAutoData(device || "")

  // Helper function to convert psi values to bar for display
  const convertToBarIfNecessary = (value: any, unit: string = "") => {
    if (isBarMachine && (unit === "psi" || unit.includes("psi"))) {
      // Convert psi to bar (1 psi = 0.0689476 bar)
      if (value === undefined || value === null) return "--"
      const numericValue = parseFloat(value)
      if (isNaN(numericValue)) return value
      const barValue = numericValue * 0.0689476
      // Return the converted value, let the hook handle formatting
      return barValue
    }
    return value
  }

  // Debug logging for GTPL-136 and GTPL-30
  useEffect(() => {
    if ((device === "GTPL-136-gT-450AP" || device === "GTPL-030-gT-180E-S7-1200") && data) {
      console.log("Device detected:", device);
      console.log("Current config:", currentMachineConfig);
      console.log("Raw data received:", data);
      console.log("All available data fields:", Object.keys(data));
      console.log("Looking for input fields:", analogInputValueMap);
      console.log("Looking for output fields:", analogOutputValueMap);
      
      // Check specific fields
      Object.entries(analogInputValueMap).forEach(([description, fieldName]) => {
        console.log(`Input: ${description} -> ${fieldName}: ${data[fieldName]}`);
      });
      
      // Check output fields
      Object.entries(analogOutputValueMap).forEach(([description, fieldName]) => {
        console.log(`Output: ${description} -> ${fieldName}: ${data[fieldName]}`);
      });
    }
  }, [device, data, currentMachineConfig, analogInputValueMap, analogOutputValueMap])

  // GSAP animations
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
    }

    // Animate items with stagger
    if (itemsRef.current.length > 0) {
      gsap.fromTo(itemsRef.current,
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.3,
          ease: "power2.out"
        }
      )
    }
  }, [data])

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el)
    }
  }

  const getIcon = (description: string) => {
    if (description.toLowerCase().includes('pressure')) return <Gauge className="w-4 h-4 text-blue-500" />
    if (description.toLowerCase().includes('temp') || description.toLowerCase().includes('probe') || description.toLowerCase().includes('air')) return <Thermometer className="w-4 h-4 text-orange-500" />
    if (description.toLowerCase().includes('speed') || description.toLowerCase().includes('valve')) return <Activity className="w-4 h-4 text-green-500" />
    return <Activity className="w-4 h-4 text-gray-500" />
  }


  return (
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

      <main
        className="relative z-10 mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-8"
        ref={containerRef}
      >
        <div className="animate-fade-in-up">
          <ScreenHeader
            icon={Activity}
            eyebrow="Analog monitoring"
            title="Analog Signals"
            machine={device as string}
            connected={isConnected}
            onBack={() => router.push(`/menu/${device}`)}
          />
        </div>

        {/* Legend: the green dot had no explanation anywhere on the page (F-17). */}
        <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="bg-success h-1.5 w-1.5 rounded-full" aria-hidden="true" />
            Live value read from the machine
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--border)" }}
              aria-hidden="true"
            />
            Configured default — no live reading for this signal
          </span>
        </div>

        <Card className="surface glow-edge">
          <CardContent className="p-8">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-8">
                {/* Analog Inputs */}
                {analogInputs.map((section, sectionIndex) => (
                  <motion.div
                    key={section.section}
                    className="space-y-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="bg-primary h-3.5 w-[3px] rounded-full" />
                      <span className="text-[10px] font-bold tracking-[0.22em] uppercase">
                        {section.section}
                      </span>
                      <span className="bg-border/70 h-px flex-1" />
                    </div>
                    <div className="grid gap-3">
                      {section.items
                        .filter((item) => {
                          if (device === "GTPL-124-gT-450T-S7-1200" || device === "GTPL-132-300-AP-S7-1200" || device === "GTPL-136-gT-450AP" || device === "GTPL-139-gT-300AP-S7-1200" || device === "GTPL-144-gT-300AP-S7-1200" || device === "GTPL-142-gT-450AP-S7-1200" || device === "GTPL-123-gT-450AP" || device === "GTPL-143-gT-450AP-S7-1200") {
                            return !item.description.startsWith("TH probe")
                          }
                          if (device === "GTPL-121-gT-1000T-S7-1200" || device === "GTPL-122-gT-1000T-S7-1200" || device === "GTPL-133-gT-650T-S7-1200" || device === "GTPL-154-gT-650T-S7-1200" || device === "GTPL-155-gT-650T-S7-1200" || device === "GTPL-081-gT-650T-S7-1200" || device === "GTPL-105-gT-650T-S7-1200" || device === "GTPL-131-gT-650T-S7-1200" || device === "GTPL-068-gT-650T-S7-1200" || device === "GTPL-104-gT-650T-S7-1200" || device === "GTPL-061-gT-450T-S7-1200") {
                            return !item.description.startsWith("TH probe") && !item.description.startsWith("TH.")
                          }
                          if ([ '108', '109', '110', '111', '112', '113'].some(id => device?.includes(id))) {
                            return !item.description.includes("T0") && !item.description.includes("Air Outlet")
                          }
                          if (device === "GTPL-118-gT-60T-S7-200" || device === "GTPL-149-gT-60T-S7-1200") {
                            if (item.description.startsWith("TH")) return false;
                            return !item.description.includes(".2 ")
                          }
                          if (device === "GTPL-134-gT-450T-S7-1200" || device === "GTPL-135-gT-450T-S7-1200" || device === "GTPL-145-gT-450T-S7-1200" || device === "GTPL-148-gT-450T-S7-1200") {
                            // Show both .1 and .2 variants for T2, T1, T0; hide TH
                            return !item.description.startsWith("TH")
                          }
                          if (device === "GTPL-137-gT-450T-S7-1200" || device === "GTPL-138-gT-450T-S7-1200") {
                            return !item.description.startsWith("TH")
                          }
                          if (isSiloMachine) {
                            return !item.description.startsWith("TH")
                          }
                          return true
                        })
                        .map((item) => {
                          const liveKey = analogInputValueMap[item.description]
                          const liveValue = liveKey ? data?.[liveKey] : undefined
                          const convertedValue = convertToBarIfNecessary(liveValue, item.unit)
                          const displayUnit = isBarMachine && (item.unit === "psi" || item.unit.includes("psi")) ? "bar" : item.unit
                          const displayValue = formatValue(convertedValue, displayUnit) ?? formatValue(item.value, displayUnit)

                          return (
                            <AnalogRow
                              key={item.description}
                              description={item.description}
                              value={displayValue}
                              unit={displayUnit}
                              live={Boolean(liveValue)}
                              icon={getIcon(item.description)}
                            />
                          )
                        })}
                    </div>
                  </motion.div>
                ))}

                {/* Analog Outputs */}
                <motion.div
                  className="space-y-4 mt-8"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="bg-success h-3.5 w-[3px] rounded-full" />
                    <span className="text-[10px] font-bold tracking-[0.22em] uppercase">
                      Analog outputs
                    </span>
                    <span className="bg-border/70 h-px flex-1" />
                  </div>
                  <div className="grid gap-3">
                    {analogOutputsTemplate
                      .filter((item: { description: string; unit: string }) => {
                        // Check if this output exists in the current machine config
                        const liveKey = analogOutputValueMap[item.description];
                        if (!liveKey) return false;
                        
                        // For GTPL-123 - show only Blower, Condenser fan, AHT, Hot Gas (exclude Heater)
                        if (device === "GTPL-123-gT-450AP") {
                          if (item.description === "Heater") return false;
                          return true;
                        }
                        
                        // For grain/paddy AP machines - exclude Heater (no heater per spec)
                        if (device === "GTPL-132-300-AP-S7-1200" ||
                            device === "GTPL-136-gT-450AP" ||
                            device === "GTPL-144-gT-300AP-S7-1200" ||
                            device === "GTPL-142-gT-450AP-S7-1200" ||
                            device === "GTPL-143-gT-450AP-S7-1200") {
                          if (item.description === "Heater") return false;
                          return true;
                        }
                        
                        // Apply existing filtering logic for other machines
                        if (device === "GTPL-124-gT-450T-S7-1200" ||
                          device === 'GTPL-121-gT-1000T-S7-1200' ||
                          device === 'GTPL-122-gT-1000T-S7-1200' ||
                          device === 'GTPL-133-gT-650T-S7-1200' ||
                          device === 'GTPL-154-gT-650T-S7-1200' ||
                          device === 'GTPL-155-gT-650T-S7-1200' ||
                          device === 'GTPL-081-gT-650T-S7-1200' ||
                          device === 'GTPL-105-gT-650T-S7-1200' ||
                          device === 'GTPL-131-gT-650T-S7-1200' ||
                          device === 'GTPL-068-gT-650T-S7-1200' ||
                          device === 'GTPL-104-gT-650T-S7-1200' ||
                          device === "GTPL-061-gT-450T-S7-1200" ||
                          (['118', '149', '108', '109', '110', '111', '112', '113'].some(id => device?.includes(id)))) {
                          if (item.description === "Heater") return false;
                        }
                        if (device === "GTPL-124-gT-450T-S7-1200" ||
                          device === 'GTPL-121-gT-1000T-S7-1200' ||
                          device === 'GTPL-122-gT-1000T-S7-1200' ||
                          device === 'GTPL-133-gT-650T-S7-1200' ||
                          device === 'GTPL-154-gT-650T-S7-1200' ||
                          device === 'GTPL-155-gT-650T-S7-1200' ||
                          device === 'GTPL-081-gT-650T-S7-1200' ||
                          device === 'GTPL-105-gT-650T-S7-1200' ||
                          device === 'GTPL-131-gT-650T-S7-1200' ||
                          device === 'GTPL-068-gT-650T-S7-1200' ||
                          device === 'GTPL-104-gT-650T-S7-1200' ||
                          device === "GTPL-061-gT-450T-S7-1200" || device === "GTPL-134-gT-450T-S7-1200" || device === "GTPL-135-gT-450T-S7-1200" || device ===
                          "GTPL-145-gT-450T-S7-1200" || device === "GTPL-148-gT-450T-S7-1200") {
                          if (item.description === "Cond. Fan speed" || item.description === "Condenser fan speed") return false;
                        }
                        if (device === "GTPL-134-gT-450T-S7-1200" || device === "GTPL-135-gT-450T-S7-1200" || device === "GTPL-145-gT-450T-S7-1200" || device === "GTPL-148-gT-450T-S7-1200" || device === "GTPL-137-gT-450T-S7-1200" || device === "GTPL-138-gT-450T-S7-1200" || device === "GTPL-139-gT-300AP-S7-1200") {
                          if (item.description === "Heater") return false;
                        }
                        if (device === "GTPL-134-gT-450T-S7-1200") {
                          if (item.description === "Condenser fan speed") return false;
                        }
                        
                        // Make sure to return true if no exclusions apply
                        return true;
                      })
                      .map((item) => {
                        const liveKey = analogOutputValueMap[item.description];
                        const liveValue = liveKey ? data?.[liveKey] : undefined;
                        
                        // Use formatValue for proper formatting
                        const displayValue = formatValue(liveValue, item.unit);

                        return (
                          <AnalogRow
                            key={item.description}
                            description={item.description}
                            value={displayValue}
                            unit={item.unit}
                            live={liveValue !== undefined && liveValue !== null}
                            icon={getIcon(item.description)}
                          />
                        );
                      })}
                  </div>
                </motion.div>
              </div>
            </ScrollArea>

            <div className="border-border/70 mt-6 grid gap-3 border-t pt-5 md:grid-cols-2">
              <Button
                variant="outline"
                className="depth-lift h-12 text-sm font-semibold"
                onClick={() => router.push(`/menu/inputs/${device || ""}`)}
              >
                <Activity className="h-4 w-4" />
                INPUTS
              </Button>
              <Button
                variant="outline"
                className="depth-lift h-12 text-sm font-semibold"
                onClick={() => router.push(`/menu/outputs/${device || ""}`)}
              >
                <Gauge className="h-4 w-4" />
                OUTPUTS
              </Button>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button
              variant="outline"
              className="depth-lift h-12 w-full"
              onClick={() => router.push(`/menu/${device}`)}
            >
              ← BACK TO MENU
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
