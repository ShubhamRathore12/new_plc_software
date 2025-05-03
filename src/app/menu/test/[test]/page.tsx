"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { useAutoData } from "@/hooks/useAutoData";

export default function TestPage() {
  const router = useRouter();
  const { test } = useParams();
  const { data } = useAutoData(test as string);

  // Pull values from data or fallback to 0
  const [blowerSpeed, setBlowerSpeed] = useState(0);
  const [condFanSpeed, setCondFanSpeed] = useState(0);
  const [compStartDelay, setCompStartDelay] = useState(0);
  const [hotGasValve, setHotGasValve] = useState(0);
  const [afterHeatValve, setAfterHeatValve] = useState(0);
  const [heaterOutput, setHeaterOutput] = useState(0);
  const [solValve, setSolValve] = useState(false);

  const blowerRunning =
    data?.BLOWER_START_MANUAL_MOD && !data?.BLOWER_STOP_MANUAL_MODE;
  const condFanRunning =
    data?.COND_FAN_START_MANUAL_M && !data?.COND_FAN_STOP_MANUAL_M;
  const compRunning =
    data?.COMPRESSOR_START_MANUAL && !data?.COMPRESSOR_STOP_MANUAL;
  const hotGasRunning =
    data?.HOT_GAS_VALVE_START_MAN && !data?.HOT_GAS_VALVE_STOP_MAN;
  const ahtRunning = data?.AHT_START_MANUAL_MODE && !data?.AHT_STOP_MANUAL_MODE;
  const heaterRunning = data?.HEATER_START_MANUAL && !data?.HEATER_STOP_MANUAL;

  useEffect(() => {
    // Sync state with PLC data
    if (data?.BLOWER_SET_POINT_MANUAL_MODE != null)
      setBlowerSpeed(data.BLOWER_SET_POINT_MANUAL_MODE);
    if (data?.CONDN_FAN_SET_POINT_MANUAL != null)
      setCondFanSpeed(data.CONDN_FAN_SET_POINT_MANUAL);
    if (data?.DELAY_TIME != null) setCompStartDelay(data.DELAY_TIME);
    if (data?.HOT_GAS_VALVE_SET_POINT_MANUAL != null)
      setHotGasValve(data.HOT_GAS_VALVE_SET_POINT_MANUAL);
    if (data?.AFTER_HEAT_VALVE_SET_POINT_MANUAL != null)
      setAfterHeatValve(data.AFTER_HEAT_VALVE_SET_POINT_MANUAL);
    if (data?.MANUAL_Heater_Output != null)
      setHeaterOutput(data.MANUAL_Heater_Output);
  }, [data]);

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">TEST</h1>
            <p className="text-muted-foreground">System component testing</p>
          </AnimatedContainer>

          {/* BLOWER */}
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
                        onValueChange={(v) => setBlowerSpeed(v[0])}
                        max={100}
                        step={1}
                        disabled={!blowerRunning}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        disabled
                        variant={blowerRunning ? "secondary" : "default"}
                      >
                        START
                      </Button>
                      <Button className="flex-1" disabled variant="outline">
                        STOP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            {/* CONDENSER */}
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
                        onValueChange={(v) => setCondFanSpeed(v[0])}
                        max={100}
                        step={1}
                        disabled={!condFanRunning}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        disabled
                        variant={condFanRunning ? "secondary" : "default"}
                      >
                        START
                      </Button>
                      <Button className="flex-1" disabled variant="outline">
                        STOP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            {/* SOL VALVE */}
            <AnimatedContainer delay={3}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">SOL VALVE</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span>Valve Status</span>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={solValve}
                          onCheckedChange={setSolValve}
                        />
                        <span className="font-medium">
                          {solValve ? "ON" : "OFF"}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            {/* COMPRESSOR */}
            <AnimatedContainer delay={4}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">COMPRESSOR</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Label htmlFor="comp-delay">Start delay</Label>
                      <Input
                        id="comp-delay"
                        type="number"
                        value={compStartDelay}
                        onChange={(e) =>
                          setCompStartDelay(Number(e.target.value) || 0)
                        }
                        className="w-20"
                        min={0}
                        max={120}
                      />
                      <span>Second</span>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        disabled
                        variant={compRunning ? "secondary" : "default"}
                      >
                        START
                      </Button>
                      <Button className="flex-1" disabled variant="outline">
                        STOP
                      </Button>
                    </div>
                    <Button
                      className="w-full"
                      disabled={!compRunning}
                      variant="secondary"
                    >
                      COMP RESET
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>

          {/* HOT GAS, AFTERHEAT, HEATER */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <AnimatedContainer delay={1}>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6">HOT GAS VALVE</h2>
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <span>Speed</span>
                      <span className="font-medium">{hotGasValve}%</span>
                    </div>
                    <Slider
                      value={[hotGasValve]}
                      onValueChange={(v) => setHotGasValve(v[0])}
                      max={100}
                      step={1}
                      disabled={!hotGasRunning}
                    />
                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        disabled
                        variant={hotGasRunning ? "secondary" : "default"}
                      >
                        START
                      </Button>
                      <Button className="flex-1" disabled variant="outline">
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
                  <h2 className="text-xl font-semibold mb-6">
                    AFTERHEAT VALVE
                  </h2>
                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <span>Speed</span>
                      <span className="font-medium">{afterHeatValve}%</span>
                    </div>
                    <Slider
                      value={[afterHeatValve]}
                      onValueChange={(v) => setAfterHeatValve(v[0])}
                      max={100}
                      step={1}
                      disabled={!ahtRunning}
                    />
                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        disabled
                        variant={ahtRunning ? "secondary" : "default"}
                      >
                        START
                      </Button>
                      <Button className="flex-1" disabled variant="outline">
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
                  <h2 className="text-xl font-semibold mb-6">HEATER</h2>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Input
                        type="number"
                        value={heaterOutput}
                        onChange={(e) =>
                          setHeaterOutput(Number(e.target.value) || 0)
                        }
                        className="w-20"
                        min={0}
                        max={100}
                      />
                      <span>% Output</span>
                    </div>
                    <div className="flex gap-4">
                      <Button
                        className="flex-1"
                        disabled
                        variant={heaterRunning ? "secondary" : "default"}
                      >
                        ON
                      </Button>
                      <Button className="flex-1" disabled variant="outline">
                        OFF
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>

          {/* NAVIGATION */}
          <motion.div
            className="flex justify-between mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            <Button
              variant="outline"
              onClick={() => router.push(`/menu/${test}`)}
            >
              BACK
            </Button>
            <Button onClick={() => router.push(`/menu/auto/${test}`)}>
              NEXT
            </Button>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
