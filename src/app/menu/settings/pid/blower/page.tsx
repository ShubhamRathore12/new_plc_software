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

export default function BlowerPidPage() {
  const router = useRouter();
  const [params, setParams] = useState({
    speed: 65.0,
    set: 60.0,
    outHigh: 100.0,
    outLow: 0.0,
    p: 1.2,
    ti: 90.0,
    td: 20.0,
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
              BLOWER PID TUNING
            </h1>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 items-center gap-2">
                        <Label htmlFor="speed" className="font-medium">
                          SPEED
                        </Label>
                        <Input
                          id="speed"
                          type="number"
                          value={params.speed}
                          onChange={(e) =>
                            handleChange(
                              "speed",
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
                      Blower Diagram
                    </div>
                    <div className="flex-1 relative border rounded-md p-4 bg-muted/30">
                      <motion.div
                        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32  flex items-center justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      >
                        <div className="text-center">
                          <div className="text-sm">{params.speed}%</div>
                        </div>
                      </motion.div>

                      {/* Animated air flow */}
                      <motion.div
                        className="absolute left-[70%] top-1/2 transform -translate-y-1/2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.7 }}
                      >
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-ping"
                            style={{ animationDelay: "0s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-ping"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-primary rounded-full animate-ping"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </motion.div>

                      {/* Connection line */}
                      <img src="https://www.revireo.com/wp-content/themes/revireo/assets/lp/blower-door/images/blower-animation.gif" />

                      <motion.path
                        d="M200,100 H300"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
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
