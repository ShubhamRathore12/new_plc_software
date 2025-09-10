"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAutoData } from "@/hooks/useAutoData"
import { useParams, useRouter } from "next/navigation"

export default function AnalogPage() {
  const analogInputs = [
    {
      section: "Analog Input (4-20mA)",
      items: [
        {
          description: "Suction pressure",
          value: "120",
          unit: "psi",
        },
        {
          description: "Discharge pressure",
          value: "240",
          unit: "psi",
        },
      ],
    },
    {
      section: "Analog Input (RTD type)",
      items: [
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
          value: "32.4",
          unit: "°C",
        },
        {
          description: "TH probe #2 (Supply Air)",
          value: "32.5",
          unit: "°C",
        },
      ],
    },
  ]

  const analogOutputs = [
    { description: "Blower speed", value: "65", unit: "%" },
    { description: "Cond. Fan speed", value: "55", unit: "%" },
    { description: "Hot gas valve", value: "0", unit: "%" },
    { description: "Afterheat valve", value: "42", unit: "%" },
    { description: "Heater", value: "0", unit: "%" },
  ]

  const sharedS7_1200_config = {
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
      "Cond. Fan speed": "Cond_fan_speed",
      "Hot gas valve": "Hot_valve_speed",
      "Afterheat valve": "AHT_vale_speed",
      "Heater": "Heater_speed",
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
      "Cond. Fan speed": "Condenser_fan_speed", // Changed from "Cond_fan_speed" to "Condenser_fan_speed"
      "Hot gas valve": "Hot_valve_speed",
      "Afterheat valve": "AHT_vale_speed",
      "Heater": "Heater_speed",
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
      "GTPL-132-300-AP-300-S7-1200": GTPL_132_config,
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
  const { seaction } = useParams()
  const device = seaction?.toString()

  // Get current machine configuration
  const currentMachineConfig = machineConfigs[device || ""] || machineConfigs["default"]
  const analogInputValueMap = currentMachineConfig.inputs
  const analogOutputValueMap = currentMachineConfig.outputs

  // Added error handling for when device is undefined
  const { data, isConnected, error, formatValue } = useAutoData(device || "")

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">ANALOG</h1>
          <p className="text-muted-foreground">
            Analog inputs and outputs
            {!isConnected && " (Disconnected)"}
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-8">
                {/* Analog Inputs */}
                {analogInputs.map((section) => (
                  <div key={section.section} className="space-y-4">
                    <h2 className="text-lg font-semibold">{section.section}</h2>
                    <div className="space-y-2 pl-4">
                      {section.items
                        .filter((item) => {
                          // If machine is GTPL-124-GT-450T-S7-1200, remove TH probes
                          if (device === "GTPL-124-GT-450T-S7-1200" || device === "GTPL-132-300-AP-300-S7-1200") {
                            return !item.description.startsWith("TH probe")
                          } 
                             if (device === "GTPL-121-gT-1000T-S7-1200" || device === "GTPL-122-gT-1000T-S7-1200") {
                            return !item.description.startsWith("TH probe")
                          }  if (['118','108','109','110','111','112','113'].some(id => device?.includes(id))) {
                            return !item.description.startsWith("T0 probe #2 (Afterheater)") && !item.description.startsWith("T2 probe #2 (Ambient Air)") && !item.description.startsWith("TH probe #2 (Supply Air)") && !item.description.startsWith("T1 probe #2 (Cold Air)")
                          }
                          return true
                        })
                        .map((item) => {
                          const liveKey = analogInputValueMap[item.description]
                          const liveValue = liveKey ? data?.[liveKey] : undefined

                          return (
                            <div
                              key={item.description}
                              className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50"
                            >
                              <div className="flex-1">{item.description}</div>
                              <div className="font-medium text-right w-20">
                                {formatValue(liveValue) ?? item.value} {item.unit}
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                ))}

                {/* Analog Outputs */}
                <div className="space-y-4 mt-6">
                  <h2 className="text-lg font-semibold">Analog Output</h2>
                 <div className="space-y-2 pl-4">
  {analogOutputs
  .filter((item) => {
    // Filter out Heater for specific machines
    if (device === "GTPL-124-GT-450T-S7-1200" || 
        device === 'GTPL-121-gT-1000T-S7-1200' || 
        device === 'GTPL-122-gT-1000T-S7-1200' || 
        device === 'GTPL-131-GT-650T-S7-1200' || 
        device === 'GTPL-132-300-AP-300-S7-1200' ||
        (['118','108','109','110','111','112','113'].some(id => device?.includes(id)))) {
      if (item.description === "Heater") {
        return false; // Always filter out Heater for these machines
      }
    }
    
    // Filter out Cond. Fan speed for specific machines (but NOT for GTPL-132-300-AP-300-S7-1200)
    if (device === "GTPL-124-GT-450T-S7-1200" || 
        device === 'GTPL-121-gT-1000T-S7-1200' || 
        device === 'GTPL-122-gT-1000T-S7-1200' || 
        device === 'GTPL-131-GT-650T-S7-1200' ||
        (['118','108','109','110','111','112','113'].some(id => device?.includes(id)))) {
      if (item.description === "Cond. Fan speed") {
        return false; // Filter out Cond. Fan speed for these machines (excluding GTPL-132-300-AP-300-S7-1200)
      }
    }
    
    return true; // Show all other items
  })
  .map((item) => {
    const liveKey = analogOutputValueMap[item.description];
    const liveValue = liveKey ? data?.[liveKey] : undefined;
    
    return (
      <div
        key={item.description}
        className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50"
      >
        <div className="flex-1">{item.description}</div>
        <div className="font-medium text-right w-20">
          {formatValue(liveValue) ?? item.value} {item.unit}
        </div>
      </div>
    );
  })}
</div>
                </div>
              </div>
            </ScrollArea>

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => router.push(`/menu/inputs/${device || ""}`)}
              >
                INPUTS
              </Button>
              <Button
                variant="outline"
                className="flex-1 bg-transparent"
                onClick={() => router.push(`/menu/outputs/${device || ""}`)}
              >
                OUTPUTS
              </Button>
            </div>
          </CardContent>
          <Button variant="outline" onClick={() => router.push(`/menu/${device}`)}>
            BACK
          </Button>
        </Card>
      </main>
    </div>
  )
}
