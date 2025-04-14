"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

export default function FaultPage() {
  const faultCodes = [
    { code: 0, description: "No fault" },
    { code: 1, description: "Compressor circuit breaker fault" },
    { code: 2, description: "Condenser fan door open" },
    { code: 3, description: "Blower drive fault" },
    { code: 4, description: "Blower circuit breaker fault" },
    { code: 6, description: "Heater circuit breaker fault" },
    { code: 7, description: "Three phase monitor fault" },
    { code: 8, description: "High Pressure 1 Fault" },
    { code: 9, description: "Ambient temp lower than set temp" },
    { code: 10, description: "Ambient temp. Over 43°C" },
    { code: 11, description: "Compressor motor overheat" },
    { code: 12, description: "Heater RCCB fault" },
    { code: 14, description: "Low Pressure 1 Fault" },
    { code: 15, description: "Anti Freeze Protection" },
    { code: 16, description: "Low Pressure 2 Fault" },
    { code: 17, description: "Ambient temp. Over 40°C" },
    { code: 18, description: "Ambient temp. Less than 4°C" },
    { code: 20, description: "Cond Fan circuit breaker fault" },
    { code: 21, description: "Cond Fan drive fault" },
    { code: 22, description: "Cond Fan TOP" },
    { code: 23, description: "Ambient Temp Sensor T2.1 Open" },
    { code: 24, description: "Ambient Temp Sensor T2.1 Short Circuit" },
    { code: 25, description: "Ambient Temp Sensor T2.2 Open" },
    { code: 26, description: "Ambient Temp Sensor T2.2 Short Circuit" },
    { code: 27, description: "Air Outlet Temp Sensor T0.1 Open" },
    { code: 28, description: "Air Outlet Temp Sensor 10.1 Short Circuit" },
    { code: 29, description: "Air Outlet Temp Sensor T0.2 Open" },
    { code: 30, description: "Air Outlet Temp Sensor T0.2 Short Circuit" },
    { code: 31, description: "Cold Air Temp Semsor T1.1 Open" },
    { code: 32, description: "Cold Air Temp Semsor T1.1 short circuit" },
    { code: 33, description: "Cold Air Temp Semsor T1.2 Open" },
    { code: 34, description: "Cold Air Temp Semsor T1.2 short circuit" },
    { code: 35, description: "Air After Heater Temp Sensor TH.1 Open" },
    {
      code: 36,
      description: "Air After Heater Temp Sensor TH.1 short circuit",
    },
    { code: 37, description: "Air After Heater Temp Sensor TH.2 Open" },
    {
      code: 38,
      description: "Air After Heater Temp Sensor TH.2 short circuit",
    },
    { code: 39, description: "High Pressure 2 Fault" },
    { code: 40, description: "Comp. Oil Low" },
    { code: 41, description: "Heater TOP fault" },
    { code: 42, description: "Heater drive Fault" },
    { code: 44, description: "TH Air After Heater Temp more than 50 °C" },
    { code: 45, description: "Delta value not achieved in aeration mode" },
  ];

  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">FAULT CODE</h1>
          <p className="text-muted-foreground">
            System fault codes and descriptions
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Code</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {faultCodes.map((fault) => (
                    <TableRow key={fault.code}>
                      <TableCell className="font-medium">
                        {fault.code}
                      </TableCell>
                      <TableCell>{fault.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>
          <Button variant="outline" onClick={() => router.push("/menu")}>
            BACK
          </Button>
        </Card>
      </main>
    </div>
  );
}
