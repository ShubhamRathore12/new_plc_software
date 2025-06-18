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

  const isGT80E = device === "GT80E-S7-200-smart1";
  const isGtpl122 = device === "Gtpl-122-S7-1200-01";
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

  const s7_1200_inputsData = [
    { id: "10.0", description: "Blower circuit breaker fault", status: false },
    { id: "10.1", description: "Blower drive fault", status: false },
    { id: "10.2", description: "Blower drive operation", status: true },
    { id: "10.4", description: "Heater drive fault", status: false },
    { id: "10.5", description: "Spare", status: false },
    { id: "10.6", description: "Condenser fan TOP fault", status: false },
    { id: "10.7", description: "Condenser fan drive fault", status: false },
    { id: "11.0", description: "Compressor oil low", status: false },
    {
      id: "11.1",
      description: "Compressor circuit breaker fault",
      status: false,
    },
    { id: "11.2", description: "Compressor motor overheat", status: false },
    { id: "11.3", description: "High pressure 1 fault", status: false },
    { id: "11.4", description: "High pressure 2 fault", status: false },
    { id: "12.0", description: "Three phase monitor fault", status: false },
    { id: "12.1", description: "Heater TOP fault", status: false },
    {
      id: "12.2",
      description: "Cond. fan circuit breaker fault",
      status: false,
    },
    { id: "12.3", description: "Heater circuit breaker fault", status: false },
    { id: "12.4", description: "Heater RCCB fault", status: false },
    { id: "12.5", description: "Condenser fan door open", status: false },
  ];

  const renderList = () => {
    if (isGT80E) {
      return s7_200_faultStatus.map((item) => {
        const isFault = item.status === "tr";

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
      return s7_1200_inputsData.map((input) => (
        <div
          key={input.id}
          className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50"
        >
          <div className="font-mono text-sm">{input.id}</div>
          <div className="flex-1">{input.description}</div>

          <div
            className={`w-4 h-4 rounded-full ${
              input.status ? "bg-green-500" : "border-2 border-muted-foreground"
            }`}
          ></div>
        </div>
      ));
    }

    // Default case - return empty array or some default content
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
