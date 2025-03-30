"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";

export default function InputsPage() {
  const inputs = [
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

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">INPUTS</h1>
          <p className="text-muted-foreground">System input status</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {inputs.map((input) => (
                  <div
                    key={input.id}
                    className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50"
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${
                        input.status
                          ? "bg-green-500"
                          : "border-2 border-muted-foreground"
                      }`}
                    ></div>
                    <div className="font-mono text-sm">{input.id}</div>
                    <div className="flex-1">{input.description}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-4 mt-6">
              <Link href="/menu/outputs" passHref>
                <Button variant="outline" className="flex-1">
                  OUTPUTS
                </Button>
              </Link>
              <Link href="/menu/inputs/analog" passHref>
                <Button variant="outline" className="flex-1">
                  ANALOG
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
