"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAutoData } from "@/hooks/useAutoData";
import { useParams, useRouter } from "next/navigation";

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
  ];

  const analogOutputs = [
    {  description: "Blower speed", value: "65", unit: "%" },
    {  description: "Cond. Fan speed", value: "55", unit: "%" },
    {  description: "Hot gas valve", value: "0", unit: "%" },
    {  description: "Afterheat valve", value: "42", unit: "%" },
    {  description: "Heater drive", value: "65", unit: "%" },
  ];

  // Machine-specific variable mappings
  const machineConfigs: Record<string, {
    inputs: Record<string, string>;
    outputs: Record<string, string>;
    displayName: string;
  }> = {
    "GTPL-115-gT-180E-S7-1200": {
      displayName: "GTPL-115-gT-180E-S7-1200",
      inputs: {
        AIW72: "LP_value",
        AIW74: "HP_value",
        AIW112: "T0_1_air_outlet_temp",
        AIW114: "T0_2_air_outlet_temp",
        AIW116: "T1_1_cold_air_temp",
        AIW118: "T1_2_cold_air_temp",
        AIW120: "T2_1_ambient_temp",
        AIW122: "T2_2_ambient_temp",
        AIW124: "TH_1_supply_air_temp",
        AIW126: "TH_2_supply_air_temp",
      },
      outputs: {
        AQW72: "Blower_speed",
        AQW74: "CONDENSER_RPM", // Keep existing if not specified
        AQW80: "Hot_valve_speed",
        AQW82: "AHT_vale_speed",
        AQW84: "Heater_speed",
      }
    },
    // Default/Legacy machine configuration
    "default": {
      displayName: "Default Machine",
      inputs: {
        AIW72: "LP",
        AIW74: "HP",
        AIW112: "AIR_OUTLET_TEMP",
        AIW114: "AIR_OUTLET_TEMP",
        AIW116: "COLD_AIR_TEMP_T1",
        AIW118: "COLD_AIR_TEMP_T1",
        AIW120: "AMBIENT_AIR_TEMP_T2",
        AIW122: "AMBIENT_AIR_TEMP_T2",
        AIW124: "AFTER_HEATER_TEMP_Th",
        AIW126: "AFTER_HEATER_TEMP_Th",
      },
      outputs: {
        AQW72: "BLOWER_RPM",
        AQW74: "CONDENSER_RPM",
        AQW80: "HOT_GAS_VALVE_RPM",
        AQW82: "AFTER_HEAT_VALVE_RPM",
        AQW84: "HEATER_DRIVE",
      }
    }
  };
 const router = useRouter();
  const { seaction } = useParams();
  const device = seaction?.toString();
  // Get current machine configuration
  const currentMachineConfig = machineConfigs[device || ""] || machineConfigs["default"];
  const analogInputValueMap = currentMachineConfig.inputs;
  const analogOutputValueMap = currentMachineConfig.outputs;

 
  
  // Added error handling for when device is undefined
  const { data, isConnected, error, formatValue } = useAutoData(
    device || ""
  );

 

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">ANALOG</h1>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">
            {currentMachineConfig.displayName}
          </h2>
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
                      {section.items.map((item) => {
                        const liveKey = analogInputValueMap[item.description];
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
                ))}

                {/* Analog Outputs */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold">Analog Output</h2>
                  <div className="space-y-2 pl-4">
                    {analogOutputs.map((item) => {
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
                className="flex-1"
                onClick={() => router.push(`/menu/inputs/${device || ""}`)}
              >
                INPUTS
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/menu/outputs/${device || ""}`)}
              >
                OUTPUTS
              </Button>
            </div>
          </CardContent>
            <Button
            variant="outline"
            onClick={() => router.push(`/menu/${device}`)}
          >
            BACK
          </Button>
        </Card>
      </main>
    </div>
  );
}