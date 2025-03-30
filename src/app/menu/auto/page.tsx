"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";

export default function AutoPage() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              SELECT AUTO
            </h1>
            <p className="text-muted-foreground">
              SR. NO. GTPL-075 | 45% RH | 1200 Pa
            </p>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
              <div className="relative bg-muted rounded-lg p-6 h-[500px] overflow-hidden">
                {/* Silo */}
                <motion.div
                  className="absolute left-[10%] top-[10%] bottom-[20%] w-[20%] border-2 border-primary/70 rounded-lg flex flex-col"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex-1 bg-primary/10 rounded-t-md relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bold text-lg">SILO</span>
                    </div>
                  </div>
                  <div className="h-[30%] border-t-2 border-primary/70 flex items-center justify-center">
                    <span className="text-sm font-medium">T1 = 24 °C</span>
                  </div>
                </motion.div>

                {/* Heater */}
                <motion.div
                  className="absolute left-[40%] top-[20%] w-[15%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="text-center">
                    <div className="font-bold">HTR</div>
                    <div className="text-sm">65%</div>
                  </div>
                </motion.div>

                {/* Air Handling Unit */}
                <motion.div
                  className="absolute left-[60%] top-[20%] w-[15%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="text-center">
                    <div className="font-bold">AHT</div>
                    <div className="text-sm">42%</div>
                  </div>
                </motion.div>

                {/* Heat Gas System */}
                <motion.div
                  className="absolute left-[80%] top-[20%] w-[15%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="text-center">
                    <div className="font-bold">HGS</div>
                    <div className="text-sm">78%</div>
                  </div>
                </motion.div>

                {/* Blower */}
                <motion.div
                  className="absolute left-[40%] top-[50%] w-[20%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="text-center">
                    <div className="font-bold">BLOWER</div>
                  </div>
                </motion.div>

                {/* Compressor */}
                <motion.div
                  className="absolute left-[70%] bottom-[20%] w-[15%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <div className="text-center">
                    <div className="font-bold">COMP</div>
                    <div className="text-sm">HP 220 LP 40</div>
                  </div>
                </motion.div>

                {/* Condenser */}
                <motion.div
                  className="absolute left-[90%] bottom-[20%] w-[15%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="text-center">
                    <div className="font-bold">COND</div>
                    <div className="text-sm">55%</div>
                  </div>
                </motion.div>

                {/* Temperature Readings */}
                <motion.div
                  className="absolute left-[40%] top-[10%] flex flex-col gap-2 z-20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <Badge variant="outline" className="bg-background/80">
                    TH = 32 °C
                  </Badge>
                  <Badge variant="outline" className="bg-background/80">
                    T0 = 28 °C
                  </Badge>
                  <Badge variant="outline" className="bg-background/80">
                    T1 = 24 °C
                  </Badge>
                  <Badge variant="outline" className="bg-background/80">
                    T2 = 30 °C
                  </Badge>
                </motion.div>

                {/* Connection Lines */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-0"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <motion.path
                    d="M150,250 H300 V120 H350"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={isRunning ? "animate-pulse" : ""}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />
                  <motion.path
                    d="M425,120 H500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  />
                  <motion.path
                    d="M575,120 H650"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                  />
                  <motion.path
                    d="M400,180 V250"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                  />
                  <motion.path
                    d="M450,320 H600 V380"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                  />
                  <motion.path
                    d="M675,380 H750"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 2 }}
                  />
                </svg>

                {/* Air Flow Animation */}
                {isRunning && (
                  <>
                    <motion.div
                      className="absolute left-[35%] top-[40%] opacity-70 z-20"
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
                    <motion.div
                      className="absolute left-[55%] top-[40%] opacity-70 z-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                    >
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-ping"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-ping"
                          style={{ animationDelay: "0.3s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-ping"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="absolute left-[75%] top-[40%] opacity-70 z-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.7 }}
                    >
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-ping"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-ping"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-ping"
                          style={{ animationDelay: "0.6s" }}
                        ></div>
                      </div>
                    </motion.div>
                  </>
                )}
              </div>
            </AnimatedContainer>

            <AnimatedContainer className="space-y-6" delay={2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">System Status</h2>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Heater</span>
                        <span className="text-sm font-medium">65%</span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 2.2 }}
                      >
                        <Progress value={65} className="h-2" />
                      </motion.div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          Air Handling
                        </span>
                        <span className="text-sm font-medium">42%</span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 2.3 }}
                      >
                        <Progress value={42} className="h-2" />
                      </motion.div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Heat Gas</span>
                        <span className="text-sm font-medium">78%</span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 2.4 }}
                      >
                        <Progress value={78} className="h-2" />
                      </motion.div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Condenser</span>
                        <span className="text-sm font-medium">55%</span>
                      </div>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 0.5, delay: 2.5 }}
                      >
                        <Progress value={55} className="h-2" />
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Temperature</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>TH (Supply Air)</span>
                      <span className="font-medium">32 °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>T0 (After Heat)</span>
                      <span className="font-medium">28 °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>T1 (Cold Air)</span>
                      <span className="font-medium">24 °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>T2 (Ambient)</span>
                      <span className="font-medium">30 °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>TH - T1</span>
                      <span className="font-medium">8 °C</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.6 }}
              >
                {!isRunning ? (
                  <Button className="flex-1" onClick={handleStart}>
                    START
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleStop}
                  >
                    STOP
                  </Button>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.7 }}
              >
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleBack}
                >
                  BACK
                </Button>
              </motion.div>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
