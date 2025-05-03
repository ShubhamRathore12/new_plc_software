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
          id: "AIW72",
          description: "Suction pressure",
          value: "120",
          unit: "psi",
        },
        {
          id: "AIW74",
          description: "Discharge pressure",
          value: "240",
          unit: "psi",
        },
      ],
    },
    {
      section: "Analog Input (0-10V)",
      items: [
        {
          id: "AIW76",
          description: "Static pressure (SA)",
          value: "1200",
          unit: "Pa",
        },
        {
          id: "AIW66",
          description: "Hummidity of (SA)",
          value: "45",
          unit: "%",
        },
      ],
    },
    {
      section: "Analog Input (RTD type)",
      items: [
        {
          id: "AIW112",
          description: "T0 probe #1 (Afterheater)",
          value: "28.5",
          unit: "°C",
        },
        {
          id: "AIW114",
          description: "T0 probe #2 (Afterheater)",
          value: "28.3",
          unit: "°C",
        },
        {
          id: "AIW116",
          description: "T1 probe #1 (Cold Air)",
          value: "24.2",
          unit: "°C",
        },
        {
          id: "AIW118",
          description: "T1 probe #2 (Cold Air)",
          value: "24.1",
          unit: "°C",
        },
        {
          id: "AIW120",
          description: "T2 probe #1 (Ambient Air)",
          value: "30.0",
          unit: "°C",
        },
        {
          id: "AIW122",
          description: "T2 probe #2 (Ambient Air)",
          value: "30.1",
          unit: "°C",
        },
        {
          id: "AIW124",
          description: "TH probe #1 (Supply Air)",
          value: "32.4",
          unit: "°C",
        },
        {
          id: "AIW126",
          description: "TH probe #2 (Supply Air)",
          value: "32.5",
          unit: "°C",
        },
      ],
    },
  ];

  const analogOutputs = [
    { id: "AQW72", description: "Blower speed", value: "65", unit: "%" },
    { id: "AQW74", description: "Cond. Fan speed", value: "55", unit: "%" },
    { id: "AQW80", description: "Hot gas valve", value: "0", unit: "%" },
    { id: "AQW82", description: "Afterheat valve", value: "42", unit: "%" },
    { id: "AQW84", description: "Heater drive", value: "65", unit: "%" },
  ];

  const analogInputValueMap: Record<string, string> = {
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
  };

  const analogOutputValueMap: Record<string, string> = {
    AQW72: "BLOWER_RPM",
    AQW74: "CONDENSER_RPM",
    AQW80: "HOT_GAS_VALVE_RPM",
    AQW82: "AFTER_HEAT_VALVE_RPM",
    AQW84: "HEATER_DRIVE",
  };

  const router = useRouter();
  const { seaction } = useParams();
  const device = seaction?.toString();
  const { data, isConnected, error, formatValue } = useAutoData(
    device as string
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">ANALOG</h1>
          <p className="text-muted-foreground">Analog inputs and outputs</p>
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
                        const liveKey = analogInputValueMap[item.id];
                        const liveValue = liveKey ? data?.[liveKey] : undefined;

                        return (
                          <div
                            key={item.id}
                            className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50"
                          >
                            <div className="font-mono text-sm w-16">
                              {item.id}
                            </div>
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
                      const liveKey = analogOutputValueMap[item.id];
                      const liveValue = liveKey ? data?.[liveKey] : undefined;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 p-2 rounded-md hover:bg-muted/50"
                        >
                          <div className="font-mono text-sm w-16">
                            {item.id}
                          </div>
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
                onClick={() => router.push(`/menu/inputs/${device}`)}
              >
                INPUTS
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/menu/outputs/${device}`)}
              >
                OUTPUTS
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
