"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OutputsPage() {
  const outputs = [
    { id: "Q0.0", description: "Blower drive", status: true },
    { id: "Q0.2", description: "Heater drive", status: false },
    { id: "Q0.3", description: "Condenser fan drive", status: true },
    { id: "Q0.4", description: "Compressor", status: true },
    { id: "Q0.5", description: "Compressor reset", status: false },
    { id: "Q0.6", description: "Solenoid valve", status: false },
    { id: "Q0.7", description: "Hot gas valve", status: false },
    { id: "Q1.0", description: "After heat motor valve", status: false },
    { id: "Q1.1", description: "Chiller healthy", status: true },
    { id: "Q2.0", description: "Chiller Fault", status: false },
    { id: "Q2.1", description: "Collective Trouble Signal", status: false },
    { id: "Q2.2", description: "Buzzer on", status: false },
  ];

  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">OUTPUTS</h1>
          <p className="text-muted-foreground">System output status</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <ScrollArea className="h-[600px] pr-4">
              <div className="space-y-2">
                {outputs.map((output) => (
                  <div
                    key={output.id}
                    className="flex items-center gap-4 p-3 rounded-md hover:bg-muted/50"
                  >
                    <div
                      className={`w-4 h-4 rounded-full ${
                        output.status
                          ? "bg-green-500"
                          : "border-2 border-muted-foreground"
                      }`}
                    ></div>
                    <div className="font-mono text-sm">{output.id}</div>
                    <div className="flex-1">{output.description}</div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="flex gap-4 mt-6">
              <Link href="/menu/inputs" passHref>
                <Button variant="outline" className="flex-1">
                  INPUTS
                </Button>
              </Link>
              <Link href="/menu/inputs/analog" passHref>
                <Button variant="outline" className="flex-1">
                  ANALOG
                </Button>
              </Link>
            </div>
          </CardContent>
          <Button variant="outline" onClick={() => router.push("/menu")}>
            BACK
          </Button>
        </Card>
      </main>
    </div>
  );
}
