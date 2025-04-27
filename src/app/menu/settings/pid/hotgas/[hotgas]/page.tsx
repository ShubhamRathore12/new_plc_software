"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function AfterhotPage() {
  const [params, setParams] = useState({
    th: 32.5,
    set: 30.0,
    vlv: 42.0,
    outHigh: 100.0,
    outLow: 0.0,
    p: 1.5,
    ti: 120.0,
    td: 30.0,
  });

  const handleChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            AFTER HOT GAS
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor="th" className="font-medium">
                        TH
                      </Label>
                      <Input
                        id="th"
                        type="number"
                        value={params.th}
                        onChange={(e) =>
                          handleChange(
                            "th",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        step={0.1}
                        className="col-span-1"
                      />
                      <div>°C</div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor="set" className="font-medium">
                        SET
                      </Label>
                      <Input
                        id="set"
                        type="number"
                        value={params.set}
                        onChange={(e) =>
                          handleChange(
                            "set",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        step={0.1}
                        className="col-span-1"
                      />
                      <div>°C</div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor="vlv" className="font-medium">
                        VLV
                      </Label>
                      <Input
                        id="vlv"
                        type="number"
                        value={params.vlv}
                        onChange={(e) =>
                          handleChange(
                            "vlv",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        step={0.1}
                        className="col-span-1"
                      />
                      <div>%</div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor="out-high" className="font-medium">
                        OUT HIGH
                      </Label>
                      <Input
                        id="out-high"
                        type="number"
                        value={params.outHigh}
                        onChange={(e) =>
                          handleChange(
                            "outHigh",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        step={0.1}
                        className="col-span-1"
                      />
                      <div>%</div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor="out-low" className="font-medium">
                        OUT LOW
                      </Label>
                      <Input
                        id="out-low"
                        type="number"
                        value={params.outLow}
                        onChange={(e) =>
                          handleChange(
                            "outLow",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        step={0.1}
                        className="col-span-1"
                      />
                      <div>%</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor="p" className="font-medium">
                        P
                      </Label>
                      <Input
                        id="p"
                        type="number"
                        value={params.p}
                        onChange={(e) =>
                          handleChange(
                            "p",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        step={0.1}
                        className="col-span-1"
                      />
                      <div></div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor="ti" className="font-medium">
                        TI
                      </Label>
                      <Input
                        id="ti"
                        type="number"
                        value={params.ti}
                        onChange={(e) =>
                          handleChange(
                            "ti",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        step={0.1}
                        className="col-span-1"
                      />
                      <div>S</div>
                    </div>

                    <div className="grid grid-cols-3 items-center gap-2">
                      <Label htmlFor="td" className="font-medium">
                        TD
                      </Label>
                      <Input
                        id="td"
                        type="number"
                        value={params.td}
                        onChange={(e) =>
                          handleChange(
                            "td",
                            Number.parseFloat(e.target.value) || 0
                          )
                        }
                        step={0.1}
                        className="col-span-1"
                      />
                      <div>S</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col">
                  <div className="text-lg font-semibold mb-4">
                    Response Graph
                  </div>
                  <div className="flex-1 relative border rounded-md">
                    {/* Simple graph visualization */}
                    <div className="absolute inset-y-0 right-0 w-10 flex flex-col justify-between text-xs text-right pr-1">
                      <div>20</div>
                      <div>15</div>
                      <div>10</div>
                      <div>5</div>
                      <div>0</div>
                    </div>

                    <div className="absolute left-0 right-10 bottom-0 h-1/2 border-t border-dashed border-primary/30"></div>

                    <svg
                      className="absolute inset-0 w-full h-full"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,80 C10,70 20,60 30,40 C40,20 50,30 60,40 C70,50 80,45 90,40 C95,38 100,38 100,38"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                      />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-start mt-8">
          <Button
            variant="outline"
            onClick={() => router.push("/menu/settings/pid")}
          >
            BACK
          </Button>
        </div>
      </main>
    </div>
  );
}
