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

export default function AnalogPage() {
  const { seaction } = useParams()
  const device = seaction?.toString()
  
  // Check if current device is GTPL-137 or GTPL-138 (bar machines)
  const isBarMachine = device === "GTPL-137-GT-450T-S7-1200" || device === "GTPL-138-GT-450T-S7-1200"

  const analogInputs = [
    {
      section: "ANALOG INPUTS (4-20mA)",
      items: 
        (device === "GTPL-132-300-AP-S7-1200" || device === "GTPL-142-gT-450AP-S7-1200" || device === "GTPL-143-gT-450AP-S7-1200") 
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
          ],
    },
    {
      section: "ANALOG INPUTS (RTD Type)",
      items: 
        (device === "GTPL-132-300-AP-S7-1200" || device === "GTPL-142-gT-450AP-S7-1200" || device === "GTPL-143-gT-450AP-S7-1200") 
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
          ],
    },
  ]

  // Analog outputs will be dynamically populated from live data
  const analogOutputsTemplate = [
    { description: "Blower Speed", unit: "%" },
    { description: "Condenser fab speed", unit: "%" },
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
      "Condenser fab speed": "Cond_fan_speed",
      "Hot Gas Valve": "Hot_valve_speed",
      "Afterheat Valve": "AHT_valve_speed",
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
      "Blower speed": "Blower_speed",
      "Cond. Fan speed": "Condenser_fan_speed",
      "Hot gas valve": "Hot_valve_speed",
      "Afterheat valve": "AHT_vale_speed",
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
      "Condenser fab speed": "Cond_fan_speed",
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
      "Condenser fab speed": "Cond_fan_speed",
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

  const GTPL_136_config = {
    displayName: "GTPL-136 Machine",
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
      "Condenser fab speed": "Condenser_fan_speed",
      "Hot Gas Valve": "Hot_valve_speed",
      "Afterheat Valve": "AHT_valve_speed",
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
    "GTPL-115-gT-180E-S7-1200": sharedS7_1200_config,
    "GTPL-30-gT-180E-S7-1200": sharedS7_1200_config,
    "GTPL-119-gT-180E-S7-1200": sharedS7_1200_config,
    "GTPL-120-gT-180E-S7-1200": sharedS7_1200_config,
    "GTPL-116-gT-240E-S7-1200": sharedS7_1200_config,
    "GTPL-117-gT-320E-S7-1200": sharedS7_1200_config,
    "GTPL-124-GT-450T-S7-1200": sharedS7_1200_config,
    "GTPL-121-gT-1000T-S7-1200": sharedS7_1200_config,
    "GTPL-122-gT-1000T-S7-1200": sharedS7_1200_config,
    "GTPL-131-GT-650T-S7-1200": sharedS7_1200_config,
    "GTPL-132-300-AP-S7-1200": GTPL_132_config,

    "GTPL-136-gT-450AP": GTPL_136_config,
    "GTPL-137-GT-450T-S7-1200": GTPL_137_config,
    "GTPL-138-GT-450T-S7-1200": GTPL_138_config,
    "GTPL-061-gT-450T-S7-1200": GTPL_061_config,
    "GTPL-139-GT-300AP-S7-1200":GTPL_138_config,
    "GTPL-142-gT-450AP-S7-1200":GTPL_132_config,
    "GTPL-143-gT-450AP-S7-1200":GTPL_132_config,
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

  // Debug logging for GTPL-136
  useEffect(() => {
    if (device === "GTPL-136-gT-450AP" && data) {
      console.log("GTPL-136 Device detected:", device);
      console.log("Current config:", currentMachineConfig);
      console.log("Raw data received:", data);
      console.log("Looking for these fields:", analogInputValueMap);
      
      // Check specific fields
      Object.entries(analogInputValueMap).forEach(([description, fieldName]) => {
        console.log(`${description} -> ${fieldName}: ${data[fieldName]}`);
      });
    }
  }, [device, data, currentMachineConfig, analogInputValueMap])

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
    if (description.toLowerCase().includes('temp')) return <Thermometer className="w-4 h-4 text-orange-500" />
    if (description.toLowerCase().includes('speed') || description.toLowerCase().includes('valve')) return <Activity className="w-4 h-4 text-green-500" />
    return <Activity className="w-4 h-4 text-gray-500" />
  }

  const getValueColor = (value: string | number, unit: string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value
    if (unit === '°C') {
      if (numValue > 40) return 'text-red-500'
      if (numValue < 10) return 'text-blue-500'
      return 'text-green-500'
    }
    if (unit === 'psi' || unit === 'bar') {
      // For bar units, adjust thresholds (1 bar ≈ 14.5 psi)
      const threshold = unit === 'bar' ? 13.8 : 200  // 13.8 bar ≈ 200 psi
      if (numValue > threshold) return 'text-orange-500'
      return 'text-blue-500'
    }
    if (unit === '%') {
      if (numValue > 80) return 'text-red-500'
      if (numValue > 50) return 'text-yellow-500'
      return 'text-green-500'
    }
    return 'text-foreground'
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <main className="flex-1 container py-8" ref={containerRef}>
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ANALOG MONITORING
              </h1>
              <p className="text-muted-foreground mt-1">
                Real-time analog inputs and outputs • {currentMachineConfig.displayName}
                {!isConnected && (
                  <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full dark:bg-red-900 dark:text-red-300">
                    Disconnected
                  </span>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        <Card className="backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 border-0 shadow-2xl">
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
                    <div className="flex items-center gap-3 pb-3 border-b border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800">
                      <div className="w-2 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">{section.section}</h2>
                    </div>
                    <div className="grid gap-3">
                      {section.items
                        .filter((item) => {
                          if (device === "GTPL-124-GT-450T-S7-1200" || device === "GTPL-132-300-AP-S7-1200" || device === "GTPL-136-gT-450AP" || device === "GTPL-061-gT-450T-S7-1200" || device === "GTPL-142-gT-450AP-S7-1200" || device === "GTPL-143-gT-450AP-S7-1200") {
                            return !item.description.startsWith("TH probe")
                          }
                          if (device === "GTPL-121-gT-1000T-S7-1200" || device === "GTPL-122-gT-1000T-S7-1200" || device === "GTPL-131-GT-650T-S7-1200") {
                            return !item.description.startsWith("TH probe")
                          }
                          if (['118', '108', '109', '110', '111', '112', '113'].some(id => device?.includes(id))) {
                            return !item.description.startsWith("T0 probe #2 (Afterheater)") && !item.description.startsWith("T2 probe #2 (Ambient Air)") && !item.description.startsWith("TH probe #2 (Supply Air)") && !item.description.startsWith("T1 probe #2 (Cold Air)")
                          }
                          if (device === "GTPL-137-GT-450T-S7-1200" || device === "GTPL-138-GT-450T-S7-1200") {
                            return true;
                          }
                          return true
                        })
                        .map((item, itemIndex) => {
                          const liveKey = analogInputValueMap[item.description]
                          const liveValue = liveKey ? data?.[liveKey] : undefined
                          const convertedValue = convertToBarIfNecessary(liveValue, item.unit)
                          const displayUnit = isBarMachine && (item.unit === "psi" || item.unit.includes("psi")) ? "bar" : item.unit
                          const displayValue = formatValue(convertedValue, displayUnit) ?? formatValue(item.value, displayUnit)

                          return (
                            <div
                              key={item.description}
                              ref={addToRefs}
                              className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                            >
                              <div className="flex items-center gap-3">
                                {getIcon(item.description)}
                                <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                  {item.description}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-2xl font-bold ${getValueColor(displayValue, item.unit)} transition-colors`}>
                                  {displayValue}
                                </span>
                                {/* Only show unit separately if formatValue didn't include it */}
                                {displayValue && !displayValue.toString().includes(item.unit) && (
                                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                    {item.unit}
                                  </span>
                                )}
                                {liveValue && (
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
                                )}
                              </div>
                            </div>
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
                  <div className="flex items-center gap-3 pb-3 border-b border-gradient-to-r from-green-200 to-blue-200 dark:from-green-800 dark:to-blue-800">
                    <div className="w-2 h-6 bg-gradient-to-b from-green-500 to-blue-600 rounded-full"></div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">ANALOG OUTPUTS</h2>
                  </div>
                  <div className="grid gap-3">
                    {analogOutputsTemplate
                      .filter((item: { description: string; unit: string }) => {
                        // Check if this output exists in the current machine config
                        const liveKey = analogOutputValueMap[item.description];
                        if (!liveKey) return false;
                        
                        // For GTPL-132, GTPL-142, GTPL-143 - exclude Heater only
                        if (device === "GTPL-132-300-AP-S7-1200" || 
                            device === "GTPL-142-gT-450AP-S7-1200" || 
                            device === "GTPL-143-gT-450AP-S7-1200") {
                          if (item.description === "Heater") return false;
                          return true;
                        }
                        
                        // Apply existing filtering logic for other machines
                        if (device === "GTPL-124-GT-450T-S7-1200" ||
                          device === 'GTPL-121-gT-1000T-S7-1200' ||
                          device === 'GTPL-122-gT-1000T-S7-1200' ||
                          device === 'GTPL-131-GT-650T-S7-1200' ||
                          device === "GTPL-061-gT-450T-S7-1200" ||
                          (['118', '108', '109', '110', '111', '112', '113'].some(id => device?.includes(id)))) {
                          if (item.description === "Heater") return false;
                        }
                        if (device === "GTPL-124-GT-450T-S7-1200" ||
                          device === 'GTPL-121-gT-1000T-S7-1200' ||
                          device === 'GTPL-122-gT-1000T-S7-1200' ||
                          device === 'GTPL-131-GT-650T-S7-1200' ||
                          device === "GTPL-061-gT-450T-S7-1200" ||
                          (['118', '108', '109', '110', '111', '112', '113'].some(id => device?.includes(id)))) {
                          if (item.description === "Cond. Fan speed") return false;
                        }
                        if (device === "GTPL-137-GT-450T-S7-1200" || device === "GTPL-138-GT-450T-S7-1200" || device === "GTPL-139-GT-300AP-S7-1200") {
                          if (item.description === "Heater") return false;
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
                          <div
                            key={item.description}
                            ref={addToRefs}
                            className="group flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              {getIcon(item.description)}
                              <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                                {item.description}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-2xl font-bold ${getValueColor(displayValue, item.unit)} transition-colors`}>
                                {displayValue}
                              </span>
                              {/* Only show unit separately if formatValue didn't include it */}
                              {displayValue && !displayValue.toString().includes(item.unit) && (
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                  {item.unit}
                                </span>
                              )}
                              {liveValue !== undefined && liveValue !== null && (
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse ml-2"></div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </motion.div>
              </div>
            </ScrollArea>

            {/* Navigation Buttons */}
            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Button
                variant="outline"
                className="flex-1 h-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-800/30 dark:hover:to-purple-800/30 transition-all duration-300"
                onClick={() => router.push(`/menu/inputs/${device || ""}`)}
              >
                <Activity className="w-4 h-4 mr-2" />
                INPUTS
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-700 hover:from-green-100 hover:to-blue-100 dark:hover:from-green-800/30 dark:hover:to-blue-800/30 transition-all duration-300"
                onClick={() => router.push(`/menu/outputs/${device || ""}`)}
              >
                <Gauge className="w-4 h-4 mr-2" />
                OUTPUTS
              </Button>
            </motion.div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button
              variant="outline"
              className="w-full h-12 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 transition-all duration-300"
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
