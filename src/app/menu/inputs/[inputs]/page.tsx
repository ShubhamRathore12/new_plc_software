"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams, useRouter } from "next/navigation";
import { useAutoData } from "@/hooks/useAutoData"; // adjust if path differs

export default function InputsPage() {
  const router = useRouter();
  const { inputs } = useParams();
  const device = inputs?.toString();

  const isGT80E = device === "GTPL-118-gT-80E-P-S7-200";
  const isGtpl122 = device === "GTPL-122-gT-1000T-S7-1200";
  const isGtpl1200_02 = device === "Gtpl-S7-1200-02";

  const { data, isConnected, error, formatValue } = useAutoData(
    device as string
  );

  const s7_200_faultStatus = [
    {
      id: "1",
      description: "Blower circuit breaker fault",
      status: data?.BLOWER_CIRCUIT_BREAKER_FAULT,
    },
    {
      id: "2",
      description: "Blower drive fault",
      status: data?.BLOWER_DRIVE_FAULT,
    },
    {
      id: "3",
      description: "Blower drive operation",
      status: data?.BLOWER_DRIVE_ON,
    },
    {
      id: "4",
      description: "Spare",
      status: data?.AFTER_HEAT_TEMP_MORE_THAN_50,
    },
    {
      id: "5",
      description: "Condenser fan overheat",
      status: data?.COND_FAN_MOTOR_OVERHEAT,
    },
    {
      id: "6",
      description: "Spare",
      status: data?.SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE,
    },
    {
      id: "7",
      description: "Compressor circuit breaker fault",
      status: data?.COMPRESSOR_CIRCUIT_BREA_FAULT,
    },
    {
      id: "8",
      description: "Low pressure fault",
      status: data?.LOW_PRESSURE_FAULT,
    },
    {
      id: "9",
      description: "High pressure fault",
      status: data?.HIGH_PRESSURE_FAULT,
    },
    {
      id: "10",
      description: "Three phase monitor fault",
      status: data?.THREE_PHASE_MONITORING_FAULT,
    },
    {
      id: "11",
      description: "Heater overheat",
      status: data?.HEATER_OVER_HEAT,
    },
    {
      id: "12",
      description: "Condenser fan circuit breaker fault",
      status: data?.COND_FAN_CIRCUIT_BREAKE_FAULT,
    },
    {
      id: "13",
      description: "Heater circuit breaker fault",
      status: data?.HEATER_CIRCUIT_BREAKER_FAULT,
    },
    {
      id: "14",
      description: "Heater RCCB fault",
      status: data?.HEATER_RCCCB_TRIP_FAULT,
    },
    {
      id: "15",
      description: "Condenser fan door open",
      status: data?.CONDENSER_FAN_DOOR_OPEN,
    },
  ];

  const s7_1200_faultStatus = [
    { id: "I0.0", description: "Compressor circuit breaker", status: data?.Compressor_circuit_breaker_ },
    { id: "I0.1", description: "Compressor module FDK error", status: data?.Comp_module_fdk_error_ },
    { id: "I0.2", description: "Compressor in operation", status: data?.Comp_in_operation_ },
    { id: "I0.3", description: "Oil level", status: data?.Oil_level_ },
    { id: "I0.4", description: "Blower drive", status: data?.Blower_drive_ },
    { id: "I0.5", description: "Blower in operation", status: data?.Blower_in_operation_ },
    { id: "I0.6", description: "Blower circuit breaker", status: data?.Blower_circuit_breaker_ },
    { id: "I0.7", description: "Condenser fan 1 TOP", status: data?.Cond_fan_1_TOP_ },
    { id: "I1.0", description: "Cond fan 1 circuit breaker", status: data?.Cond_fan_1_cir_cuit_breaker_ },
    { id: "I1.1", description: "Low pressure fault", status: data?.Low_pressure_fault_ },
    { id: "I1.2", description: "Compressor OLR trip", status: data?.Compressor_OLR_trip_ },
    { id: "I1.3", description: "High pressure fault", status: data?.High_pressure_fault_ },
    { id: "I1.4", description: "Start stop switch", status: data?.Start_stop_switch_ },
    { id: "I2.0", description: "Three phase monitoring fault", status: data?.Three_phase_monitoring_fault_ },
    { id: "I2.2", description: "Condenser fan 2 TOP", status: data?.Cond_fan_2_TOP_ },
    { id: "I2.3", description: "Condenser fan 3 TOP", status: data?.Cond_fan_3_TOP_ },
    { id: "I2.4", description: "Condenser fan 4 TOP", status: data?.Cond_fan_4_TOP_ },
    { id: "I2.5", description: "Cond fan 2 circuit breaker", status: data?.Cond_fan_2_circuit_breaker_ },
    { id: "I2.6", description: "Cond fan 3 circuit breaker", status: data?.Cond_fan_3_circuit_breaker_ },
    { id: "I2.7", description: "Cond fan 4 circuit breaker", status: data?.Cond_fan_4_circuit_breaker_ },
    { id: "I3.0", description: "Condenser fan 5 TOP", status: data?.Cond_fan_5_TOP_ },
    { id: "I3.1", description: "Condenser fan 6 TOP", status: data?.Cond_fan_6_TOP_ },
    { id: "I3.2", description: "Cond fan 5 circuit breaker", status: data?.Cond_fan_5_circuit_breaker_ },
    { id: "I3.3", description: "Cond fan 6 circuit breaker", status: data?.Cond_fan_6_circuit_breaker_ },
  ];
  

  const renderList = () => {
    if (isGT80E) {
      return s7_200_faultStatus.map((item) => {
        const isSpecialCase =
          item.status &&
          (item.description === "Condenser fan overheat" ||
            item.description === "Heater overheat");
    
        let isFault;
    
        if (isSpecialCase) {
          isFault = item.status === "fr"; // "fr" is fault here, so red
        } else {
          isFault = item.status === "tr"; // "tr" is fault for others
        }
    
        return (
          <div
            key={item.id}
            className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50"
          >
            <div className="font-mono text-sm">{item.id}</div>
            <div className="flex-1">{item.description}</div>
    
            <div
              className={`w-4 h-4 rounded-full ${
                isFault ? "bg-red-500" : "bg-green-500"
              }`}
            ></div>
          </div>
        );
      });
    }
    
  
    if (isGtpl122 || isGtpl1200_02) {
      return s7_1200_faultStatus.map((input) => {
        const isFault = input.status === "true"; // treat "true" string as fault
  
        return (
          <div
            key={input.id}
            className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50"
          >
            <div className="font-mono text-sm">{input.id}</div>
            <div className="flex-1">{input.description}</div>
  
            <div
              className={`w-4 h-4 rounded-full ${
                isFault ? "bg-red-500" : "bg-green-500"
              }`}
            ></div>
          </div>
        );
      });
    }
  
    return [];
  };
  

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">INPUTS</h1>
          <p className="text-muted-foreground">
            System input status for {device}
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">{renderList()}</div>
            </ScrollArea>

            <div className="flex gap-4 mt-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.push(`/menu/outputs/${device}`)}
              >
                OUTPUTS
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
