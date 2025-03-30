"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PageTransition, AnimatedContainer } from "@/components/ui/animated-container"

export default function TestPage() {
  const router = useRouter()
  const [blowerSpeed, setBlowerSpeed] = useState(0)
  const [condFanSpeed, setCondFanSpeed] = useState(0)
  const [solValve, setSolValve] = useState(false)
  const [compStartDelay, setCompStartDelay] = useState(30)
  const [blowerRunning, setBlowerRunning] = useState(false)
  const [condFanRunning, setCondFanRunning] = useState(false)
  const [compRunning, setCompRunning] = useState(false)

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
      

        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">TEST</h1>
            <p className="text-muted-foreground">System component testing</p>
          </AnimatedContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedContainer delay={1}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">BLOWER</h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Speed</span>
                        <span className="font-medium">{blowerSpeed}%</span>
                      </div>
                      <Slider
                        value={[blowerSpeed]}
                        onValueChange={(value) => setBlowerSpeed(value[0])}
                        max={100}
                        step={1}
                        disabled={!blowerRunning}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        variant={blowerRunning ? "secondary" : "default"}
                        onClick={() => setBlowerRunning(true)}
                        disabled={blowerRunning}
                      >
                        START
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          setBlowerRunning(false)
                          setBlowerSpeed(0)
                        }}
                        disabled={!blowerRunning}
                      >
                        STOP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={2}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">COND FAN</h2>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Speed</span>
                        <span className="font-medium">{condFanSpeed}%</span>
                      </div>
                      <Slider
                        value={[condFanSpeed]}
                        onValueChange={(value) => setCondFanSpeed(value[0])}
                        max={100}
                        step={1}
                        disabled={!condFanRunning}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        variant={condFanRunning ? "secondary" : "default"}
                        onClick={() => setCondFanRunning(true)}
                        disabled={condFanRunning}
                      >
                        START
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => {
                          setCondFanRunning(false)
                          setCondFanSpeed(0)
                        }}
                        disabled={!condFanRunning}
                      >
                        STOP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={3}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">SOL VALVE</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span>Valve Status</span>
                      <div className="flex items-center gap-2">
                        <Switch checked={solValve} onCheckedChange={setSolValve} />
                        <span className="font-medium">{solValve ? "ON" : "OFF"}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={4}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">COMPRESSOR</h2>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="comp-delay">Comp start delay</Label>
                      <Input
                        id="comp-delay"
                        type="number"
                        value={compStartDelay}
                        onChange={(e) => setCompStartDelay(Number.parseInt(e.target.value) || 0)}
                        className="w-20"
                        min={0}
                        max={120}
                      />
                      <span>Second</span>
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        variant={compRunning ? "secondary" : "default"}
                        onClick={() => setCompRunning(true)}
                        disabled={compRunning}
                      >
                        START
                      </Button>
                      <Button
                        className="flex-1"
                        variant="outline"
                        onClick={() => setCompRunning(false)}
                        disabled={!compRunning}
                      >
                        STOP
                      </Button>
                    </div>

                    <Button variant="secondary" className="w-full" disabled={!compRunning}>
                      COMP RESET
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>

          <motion.div
            className="flex justify-between mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            <Button variant="outline" onClick={() => router.push("/")}>
              BACK
            </Button>
            <Button onClick={() => router.push("/auto")}>NEXT</Button>
          </motion.div>
        </main>

 
      </div>
    </PageTransition>
  )
}

