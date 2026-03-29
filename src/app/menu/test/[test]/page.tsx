"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { useAutoData } from "@/hooks/useAutoData";
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Square,
  Gauge,
  Wind,
  Flame,
  Zap,
  Settings2,
  Activity,
  Power,
  Timer,
  Thermometer
} from "lucide-react";

export default function TestPage() {
  const router = useRouter();
  const { test } = useParams();
  const { data } = useAutoData(test as string);
  const [mounted, setMounted] = useState(false);

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
    setMounted(true);
    // Sync state with PLC data
    if (test === "GTPL-60-gT-60T-P-S7-200") {
      if (data?.Blower_speed_manual_set != null)
        setBlowerSpeed(data.Blower_speed_manual_set);
      if (data?.Condenser_fan_speed_set_in_manual != null)
        setCondFanSpeed(data.Condenser_fan_speed_set_in_manual);
      if (data?.Hot_gas_valve_manual_set != null)
        setHotGasValve(data.Hot_gas_valve_manual_set);
      if (data?.AHT_valve_manual_set != null)
        setAfterHeatValve(data.AHT_valve_manual_set);
    } else {
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
    }
  }, [data, test]);

  const ControlCard = ({
    title,
    icon: Icon,
    children,
    delay = 0,
    isRunning = false,
    gradient = "from-blue-500 to-purple-600"
  }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delay * 0.1 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-2 border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-blue-400 dark:hover:border-blue-500">
        {/* Animated gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        {/* Glowing border effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl" />

        <CardContent className="p-6 relative">
          {/* Header with icon */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {isRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
          </div>

          {children}
        </CardContent>

        {/* Bottom accent line */}
        <div className={`h-1 w-0 group-hover:w-full transition-all duration-700 bg-gradient-to-r ${gradient}`} />
      </Card>
    </motion.div>
  );

  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
          background: linear-gradient(
            to right,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.push(`/menu/${test}`)}
                  className="h-14 w-14 rounded-2xl border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:scale-110 hover:rotate-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <div className="flex-1">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text mb-2 animate-shimmer">
                    Component Testing
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 animate-pulse" />
                    Manual control and testing • {test}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Main Grid - First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* BLOWER */}
              <ControlCard
                title="BLOWER"
                icon={Wind}
                delay={1}
                isRunning={blowerRunning}
                gradient="from-cyan-500 to-blue-600"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Speed Control</span>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                        <Gauge className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {blowerSpeed || data?.Blower_speed_set_in_manual}%
                        </span>
                      </div>
                    </div>
                    <Slider
                      value={[blowerSpeed || data?.Blower_speed_set_in_manual]}
                      onValueChange={(v) => setBlowerSpeed(v[0])}
                      max={100}
                      step={1}
                      disabled={!blowerRunning}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant={blowerRunning ? "secondary" : "default"}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      START
                    </Button>
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant="outline"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      STOP
                    </Button>
                  </div>
                </div>
              </ControlCard>

              {/* CONDENSER FAN */}
              <ControlCard
                title="COND FAN"
                icon={Settings2}
                delay={2}
                isRunning={condFanRunning}
                gradient="from-indigo-500 to-purple-600"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Speed Control</span>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <Gauge className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {condFanSpeed || data?.Cond_fan_speed_set_in_manual}%
                        </span>
                      </div>
                    </div>
                    <Slider
                      value={[condFanSpeed || data?.CONDN_FAN_SET_POINT_MANUAL || data?.Cond_fan_speed_set_in_manual]}
                      onValueChange={(v) => setCondFanSpeed(v[0])}
                      max={100}
                      step={1}
                      disabled={!condFanRunning}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant={condFanRunning ? "secondary" : "default"}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      START
                    </Button>
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant="outline"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      STOP
                    </Button>
                  </div>
                </div>
              </ControlCard>

              {/* SOL VALVE */}
              <ControlCard
                title="SOL VALVE"
                icon={Zap}
                delay={3}
                isRunning={solValve}
                gradient="from-amber-500 to-orange-600"
              >
                <div className="space-y-6">
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant={solValve ? "secondary" : "default"}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      START
                    </Button>
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant="outline"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      STOP
                    </Button>
                  </div>
                </div>
              </ControlCard>

              {/* COMPRESSOR */}
              <ControlCard
                title="COMPRESSOR"
                icon={Power}
                delay={4}
                isRunning={compRunning}
                gradient="from-red-500 to-pink-600"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50">
                    <Timer className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <Label htmlFor="comp-delay" className="font-medium">Start delay</Label>
                    <Input
                      id="comp-delay"
                      type="number"
                      value={compStartDelay}
                      onChange={(e) =>
                        setCompStartDelay(Number(e.target.value) || 0)
                      }
                      className="w-20 h-10 text-center font-bold"
                      min={0}
                      max={120}
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Seconds</span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant={compRunning ? "secondary" : "default"}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      START
                    </Button>
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant="outline"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      STOP
                    </Button>
                  </div>
                  <Button
                    className="w-full h-12 font-semibold transition-all duration-300 hover:scale-105"
                    disabled={!compRunning}
                    variant="secondary"
                  >
                    <Settings2 className="h-5 w-5 mr-2" />
                    COMP RESET
                  </Button>
                </div>
              </ControlCard>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* HOT GAS VALVE */}
              <ControlCard
                title="HOT GAS VALVE"
                icon={Flame}
                delay={5}
                isRunning={hotGasRunning}
                gradient="from-orange-500 to-red-600"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Valve Position</span>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30">
                        <Gauge className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {hotGasValve || data?.Hot_gas_valve_set_in_manual}%
                        </span>
                      </div>
                    </div>
                    <Slider
                      value={[hotGasValve || data?.Hot_gas_valve_set_in_manual]}
                      onValueChange={(v) => setHotGasValve(v[0])}
                      max={100}
                      step={1}
                      disabled={!hotGasRunning}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant={hotGasRunning ? "secondary" : "default"}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      START
                    </Button>
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant="outline"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      STOP
                    </Button>
                  </div>
                </div>
              </ControlCard>

              {/* AFTERHEAT VALVE */}
              <ControlCard
                title="AFTERHEAT VALVE"
                icon={Thermometer}
                delay={6}
                isRunning={ahtRunning}
                gradient="from-pink-500 to-rose-600"
              >
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Valve Position</span>
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30">
                        <Gauge className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                          {afterHeatValve || data?.AHT_valve_set_in_manual}%
                        </span>
                      </div>
                    </div>
                    <Slider
                      value={[afterHeatValve || data?.AHT_valve_set_in_manual]}
                      onValueChange={(v) => setAfterHeatValve(v[0])}
                      max={100}
                      step={1}
                      disabled={!ahtRunning}
                      className="cursor-pointer"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant={ahtRunning ? "secondary" : "default"}
                    >
                      <Play className="h-5 w-5 mr-2" />
                      START
                    </Button>
                    <Button
                      className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                      disabled
                      variant="outline"
                    >
                      <Square className="h-5 w-5 mr-2" />
                      STOP
                    </Button>
                  </div>
                </div>
              </ControlCard>

              {/* HEATER - Conditional rendering */}
              {test !== "GTPL-132-300-AP-S7-1200" && (
                <ControlCard
                  title="HEATER"
                  icon={Flame}
                  delay={7}
                  isRunning={heaterRunning}
                  gradient="from-yellow-500 to-amber-600"
                >
                  <div className="space-y-6">
                    {test?.toString().endsWith('1200') && (
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50">
                        <Gauge className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                        <Input
                          type="number"
                          value={heaterOutput || data?.Heater_set_in_manual}
                          onChange={(e) =>
                            setHeaterOutput(Number(e.target.value) || 0)
                          }
                          className="w-20 h-10 text-center font-bold"
                          min={0}
                          max={100}
                        />
                        {!String(test).includes('200') && (
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">% Output</span>
                        )}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                        disabled
                        variant={heaterRunning ? "secondary" : "default"}
                      >
                        <Play className="h-5 w-5 mr-2" />
                        ON
                      </Button>
                      <Button
                        className="flex-1 h-12 font-semibold transition-all duration-300 hover:scale-105"
                        disabled
                        variant="outline"
                      >
                        <Square className="h-5 w-5 mr-2" />
                        OFF
                      </Button>
                    </div>
                  </div>
                </ControlCard>
              )}
            </div>

            {/* Navigation */}
            <motion.div
              className="flex justify-between gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Button
                variant="outline"
                onClick={() => router.push(`/menu/${test}`)}
                className="h-14 px-8 text-lg font-semibold border-2 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-300 hover:scale-105 group"
              >
                <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
                BACK
              </Button>
              <Button
                onClick={() => router.push(`/menu/auto/${test}`)}
                className="h-14 px-8 text-lg font-semibold transition-all duration-300 hover:scale-105 group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                NEXT
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </motion.div>
          </main>
        </div>
      </PageTransition>
    </>
  );
}
