"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";

export default function HeaterPidPage() {
  const router = useRouter();
  const [params, setParams] = useState({
    power: 65.0,
    set: 60.0,
    temp: 32.5,
    outHigh: 100.0,
    outLow: 0.0,
    p: 2.0,
    ti: 180.0,
    td: 45.0,
  });

  const handleChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    router.push("/menu/settings/pid");
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              HEATER PID TUNING
            </h1>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 items-center gap-2">
                        <Label htmlFor="power" className="font-medium">
                          POWER
                        </Label>
                        <Input
                          id="power"
                          type="number"
                          value={params.power}
                          onChange={(e) =>
                            handleChange(
                              "power",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          step={0.1}
                          className="col-span-1"
                        />
                        <div>%</div>
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
                        <div>%</div>
                      </div>

                      <div className="grid grid-cols-3 items-center gap-2">
                        <Label htmlFor="temp" className="font-medium">
                          TEMP
                        </Label>
                        <Input
                          id="temp"
                          type="number"
                          value={params.temp}
                          onChange={(e) =>
                            handleChange(
                              "temp",
                              Number.parseFloat(e.target.value) || 0
                            )
                          }
                          step={0.1}
                          className="col-span-1"
                        />
                        <div>°C</div>
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
            </AnimatedContainer>

            <AnimatedContainer delay={2}>
              <Card className="h-full">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col">
                    <div className="text-lg font-semibold mb-4">
                      Heater Diagram
                    </div>
                    <div className="flex-1 relative border rounded-md p-4 bg-muted/30">
                      <motion.div
                        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32  rounded-lg bg-primary/10 flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <div className="text-center">
                          <div className="font-bold text-lg">HTR</div>
                          <div className="text-sm">{params.power}%</div>
                        </div>
                      </motion.div>

                      {/* Animated heat effect */}
                      <motion.div
                        className="absolute left-[30%] top-1/2 transform -translate-y-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                      >
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-red-500 rounded-full animate-ping"
                            style={{ animationDelay: "0s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-red-500 rounded-full animate-ping"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-red-500 rounded-full animate-ping"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </motion.div>

                      <motion.div
                        className="absolute right-[30%] top-1/2 transform -translate-y-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                      >
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-red-500 rounded-full animate-ping"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-red-500 rounded-full animate-ping"
                            style={{ animationDelay: "0.3s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-red-500 rounded-full animate-ping"
                            style={{ animationDelay: "0.5s" }}
                          ></div>
                        </div>
                      </motion.div>

                      {/* Temperature display */}
                      <motion.div
                        className="absolute top-[20%] right-[20%] bg-background/80 px-2 py-1 rounded-md border border-primary/30"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <span className="text-sm font-medium">
                          {params.temp} °C
                        </span>
                      </motion.div>

                      {/* Connection lines */}
                      <img src="https://media2.giphy.com/media/h2ZsdobWasbocct0OB/giphy.gif" />
                      <motion.path
                        d="M100,100 H160"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      />
                      <motion.path
                        d="M240,100 H300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>

          <motion.div
            className="flex justify-start mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.2 }}
          >
            <Button variant="outline" onClick={handleBack}>
              BACK
            </Button>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
