"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Wind, Timer } from "lucide-react"
import { motion } from "framer-motion"
import { PageTransition, AnimatedContainer } from "@/components/ui/animated-container"

export default function AerationWithoutHeatingPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [continuousMode, setContinuousMode] = useState(false)
  const [runningTime, setRunningTime] = useState({ hours: 0, minutes: 0 })
  const [duration, setDuration] = useState(12)

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setRunningTime((prev) => {
          const newMinutes = prev.minutes + 1
          if (newMinutes >= 60) {
            return { hours: prev.hours + 1, minutes: 0 }
          }
          return { ...prev, minutes: newMinutes }
        })
      }, 60000) // Update every minute
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning])

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
    setRunningTime({ hours: 0, minutes: 0 })
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
    

        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">AERATION W/O HEATING</h1>
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

                {/* Blower */}
                <motion.div
                  className="absolute left-[40%] top-[40%] w-[20%] h-[15%] border-2 border-primary/70 rounded-lg bg-primary/10 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="text-center">
                    <div className="font-bold">BLOWER</div>
                    <div className="text-sm">65%</div>
                  </div>
                </motion.div>

                {/* Temperature Readings */}
                <motion.div
                  className="absolute right-[10%] top-[10%] flex flex-col gap-2 z-10"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <Badge variant="outline" className="bg-background/80">
                    T1 = 24 °C
                  </Badge>
                  <Badge variant="outline" className="bg-background/80">
                    T2 = 30 °C
                  </Badge>
                </motion.div>

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path
                    d="M150,250 H300 V250"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={isRunning ? "animate-pulse" : ""}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </svg>

                {/* Air Flow Animation */}
                {isRunning && (
                  <motion.div
                    className="absolute left-[35%] top-[50%] opacity-70"
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
                )}
              </div>
            </AnimatedContainer>

            <AnimatedContainer className="space-y-6" delay={2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Aeration Control</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch id="continuous-mode" checked={continuousMode} onCheckedChange={setContinuousMode} />
                        <Label htmlFor="continuous-mode">CONTINUOUS MODE</Label>
                      </div>
                    </div>

                    {!continuousMode && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Label className="mb-2 block">Set Duration</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={duration}
                            onChange={(e) => setDuration(Number.parseInt(e.target.value) || 0)}
                            className="w-16"
                            min={1}
                            max={24}
                          />
                          <span>h</span>
                        </div>
                      </motion.div>
                    )}

                    {isRunning && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Label className="mb-2 block">Running Time</Label>
                        <div className="flex items-center space-x-2">
                          <span className="text-xl font-mono">{String(runningTime.hours).padStart(2, "0")}</span>
                          <span className="text-xl">h</span>
                          <span className="text-xl font-mono">{String(runningTime.minutes).padStart(2, "0")}</span>
                          <span className="text-xl">min</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Temperature</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>T1 (Cold Air)</span>
                      <span className="font-medium">24 °C</span>
                    </div>
                    <div className="flex justify-between">
                      <span>T2 (Ambient)</span>
                      <span className="font-medium">30 °C</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.2 }}
              >
                {!isRunning ? (
                  <Button className="flex-1 gap-2" onClick={handleStart}>
                    <Wind className="h-4 w-4" />
                    AERATION START
                  </Button>
                ) : (
                  <Button variant="destructive" className="flex-1 gap-2" onClick={handleStop}>
                    <Timer className="h-4 w-4" />
                    AERATION STOP
                  </Button>
                )}
              </motion.div>
            </AnimatedContainer>
          </div>
        </main>

   
      </div>
    </PageTransition>
  )
}

