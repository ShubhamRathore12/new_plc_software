"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useRouter } from "next/navigation";
import { useAutoData } from "@/hooks/useAutoData"; // Assuming this is the correct import path

export default function OutputsPage() {
  const router = useRouter();
  const { outputs } = useParams();
  const device = outputs?.toString();
  
  const { data, isConnected, error, formatValue } = useAutoData(device as string);

  // Define outputs configuration based on device type
  const getOutputsConfig = (deviceType: string) => {
    if (deviceType === "GTPL-122-gT-1000T-S7-1200") {
      return  [
        { id: "1", description: "Compressor Start", dataKey: "Compressor Start" },
        { id: "2", description: "Compressor Module Reset", dataKey: "Compressor Module Reset" },
        { id: "3", description: "CR Valve 25% ON", dataKey: "CR Valve 25% ON" },
        { id: "4", description: "CR Valve 50% ON", dataKey: "CR Valve 50% ON" },
        { id: "5", description: "Solenoid Valve ON", dataKey: "Solenoid Valve ON" },
        { id: "6", description: "Hot Gas Valve ON", dataKey: "Hot Gas Valve ON" },
        { id: "7", description: "AHT Valve ON", dataKey: "AHT Valve ON" },
        { id: "8", description: "Blower Drive Start", dataKey: "Blower Drive Start" },
        { id: "9", description: "System Warning", dataKey: "System Warning" },
        { id: "10", description: "Chiller Healthy", dataKey: "Chiller Healthy" },
        { id: "11", description: "Cond Fan 1 ON", dataKey: "Cond Fan 1 ON" },
        { id: "12", description: "CR Valve 75% ON", dataKey: "CR Valve 75% ON" },
        { id: "13", description: "Chiller Fault", dataKey: "Chiller Fault" },
        { id: "14", description: "Cond Fan 2 ON", dataKey: "Cond Fan 2 ON" },
        { id: "15", description: "Cond Fan 3 ON", dataKey: "Cond Fan 3 ON" },
        { id: "16", description: "Cond Fan 4 ON", dataKey: "Cond Fan 4 ON" },
        { id: "17", description: "CR Valve 100% ON", dataKey: "CR Valve 100% ON" },
        { id: "18", description: "Cond Fan 5 ON", dataKey: "Cond Fan 5 ON" },
        { id: "19", description: "Cond Fan 6 ON", dataKey: "Cond Fan 6 ON" },
      ];
      
    } 
    else if (deviceType === "GTPL-115-gT-180E-S7-1200" || deviceType === "GTPL-117-gT-320E-S7-1200") {
    return [
  { id: "1", description: "Blower drive", dataKey: "Blower_drive_on_Q0_0" },
  { id: "2", description: "Heater drive", dataKey: "Heater_drive_on_Q0_2" },
  { id: "3", description: "Condenser fan drive", dataKey: "Condenser_fan_drive_on_Q0_3" },
  { id: "4", description: "Compressor", dataKey: "Compressor_on_Q0_4" },
  { id: "5", description: "Compressor reset", dataKey: "Compressor_reset_on_Q0_5" },
  { id: "6", description: "Solenoid valve", dataKey: "Solenoid_valve_on_Q0_6" },
  { id: "7", description: "Hot gas valve", dataKey: "Hot_gas_valve_on_Q0_7" },
  { id: "8", description: "After heat motor valve", dataKey: "After_heat_motor_valve_on_Q1_0" },
  { id: "9", description: "Chiller healthy", dataKey: "Chiller_healthy_on_Q1_1" },
  { id: "10", description: "Chiller Fault", dataKey: "Chiller_Fault_on_Q2_0" },
  { id: "11", description: "Collective Trouble Signal", dataKey: "Collective_Trouble_Signal_on_Q2_1" },
  { id: "12", description: "Buzzer on", dataKey: "Buzzer_on_Q2_2" },
];

    }else if (deviceType === "GTPL-124-GT-450T-S7-1200") {
  return [
    { id: "1",  description: "Compressor",                 dataKey: "Compressor_on_Q0_0" },
    { id: "2",  description: "Compressor motor reset",     dataKey: "Compressor_motor_reset_Q0_1" },
    { id: "3",  description: "Spare",                      dataKey: "Spare_Q0_2" },
    { id: "4",  description: "Spare",                      dataKey: "Spare_Q0_3" },
    { id: "5",  description: "Solenoid valve",             dataKey: "Solenoid_valve_on_Q0_4" },
    { id: "6",  description: "Hot gas valve",              dataKey: "Hot_gas_valve_on_Q0_5" },
    { id: "7",  description: "After heat valve",           dataKey: "After_heat_valve_on_Q0_6" },
    { id: "8",  description: "Blower drive",               dataKey: "Blower_drive_on_Q0_7" },
    { id: "9",  description: "Collective trouble signal",  dataKey: "Collective_trouble_signal_Q1_0" },
    { id: "10", description: "Chiller healthy",            dataKey: "Chiller_healthy_on_Q1_1" },
    { id: "11", description: "Spare",                      dataKey: "Spare_Q2_0" },
    { id: "12", description: "Condenser fan 1",            dataKey: "Condenser_fan1_on_Q2_1" },
    { id: "13", description: "Spare",                      dataKey: "Spare_Q2_2" },
    { id: "14", description: "Chiller fault",              dataKey: "Chiller_fault_Q2_3" },
    { id: "15", description: "Condenser fan 2",            dataKey: "Condenser_fan2_on_Q2_4" },
    { id: "16", description: "Condenser fan 3",            dataKey: "Condenser_fan3_on_Q2_5" },
    { id: "17", description: "Condenser fan 4",            dataKey: "Condenser_fan4_on_Q2_6" },
  ];
}

    
    // Default fallback
    return [
      { id: "1", description: "Blower drive", dataKey: "Q0.0" },
      { id: "2", description: "Heater drive", dataKey: "Q0.2" },
      { id: "3", description: "Condenser fan drive", dataKey: "Q0.3" },
      { id: "4", description: "Compressor", dataKey: "Q0.4" },
      { id: "5", description: "Compressor reset", dataKey: "Q0.5" },
      { id: "6", description: "Solenoid valve", dataKey: "Q0.6" },
      { id: "7", description: "Hot gas valve", dataKey: "Q0.7" },
      { id: "8", description: "After heat motor valve", dataKey: "Q1.0" },
      { id: "9", description: "Chiller healthy", dataKey: "Q1.1" },
      { id: "10", description: "Chiller Fault", dataKey: "Q2.0" },
      { id: "11", description: "Collective Trouble Signal", dataKey: "Q2.1" },
      { id: "12", description: "Buzzer on", dataKey: "Q2.2" },
    ];
  };

  const outputsData = getOutputsConfig(device || "");

  // Function to get status from dynamic data
// Function to get status from dynamic data based on device type
const getStatus = (dataKey: string) => {
  if (!data) return false;
  const value = data[dataKey];

  // S7-200 uses "tr" and "fr" (as string flags)
  if (device === "GTPL-118-gT-80E-P-S7-200") {
    return value === "tr";
  }

  // S7-1200 uses boolean or number
  if (device === "GTPL-122-gT-1000T-S7-1200") {
    return value === "true" || value === 1 || value === "1" || value === true || value === "True";
  }
  // GPL-115 uses boolean or number
  if (device === "GTPL-115-gT-180E-S7-1200") {
    return value === true || value === 1 || value === "1" || value === "True" || value === "true";
  }
  // Default fallback
  return value === true || value === 1 || value === "1" || value === "tr"|| value === "True" || value === "true";
};

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">OUTPUTS</h1>
          <p className="text-muted-foreground">
            System output status {device && `- ${device}`}
          </p>
          {!isConnected && (
            <p className="text-red-500 text-sm mt-2">
              Connection lost - showing last known values
            </p>
          )}
          {error && (
            <p className="text-red-500 text-sm mt-2">
              Error: {error}
            </p>
          )}
        </div>

        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {outputsData.map((output) => {
                  const status = getStatus(output.dataKey);
                  const dataValue = data?.[output.dataKey];
                  return (
                    <div
                      key={output.id}
                      className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50"
                    >
                     
                      <div className="font-mono text-sm">{output.id}</div>
                      <div className="flex-1">{output.description}</div>
                      <div
                        className={`w-4 h-4 rounded-full ${
                          status
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

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
                onClick={() => router.push(`/menu/inputs/analog/${device}`)}
              >
                ANALOG
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