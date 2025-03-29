"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Plus, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/providers/theme-provider";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [splineApp, setSplineApp] = useState<any>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const onLoad = (splineApp: any) => {
    setSplineApp(splineApp);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-blue-50 dark:bg-black">
      {/* Left Sidebar */}

      {/* Main Content */}
      {/* Use responsive margin: no left margin on small screens, add it on large screens */}
      <div className="flex-1 lg:ml-16">
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-white dark:bg-black px-4 md:px-6">
          <div className="flex items-center">
            <ArrowLeft className="h-5 w-5 text-black dark:text-white" />
            <div className="flex items-center gap-4">
              <Button variant="outline">Dashboard</Button>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-black dark:text-white border-blue-200"
            >
              Full
            </Button>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {/* Responsive grid: 1 column on small screens, 4 columns on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-4">
              {/* Sessions By Device */}
              <Card className="bg-white/90 dark:bg-black/90 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Sessions By Device
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* ... your sessions content ... */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 bg-blue-500 rounded-sm"></div>
                          <span className="text-xs">66.6%</span>
                        </div>
                        <span className="text-xs text-green-500">+2%</span>
                      </div>
                      <div className="h-1 w-full rounded-full bg-blue-100 dark:bg-blue-800">
                        <div className="h-full w-[66.6%] rounded-full bg-blue-500"></div>
                      </div>
                    </div>
                    {/* ... additional sessions bars ... */}
                  </div>
                </CardContent>
              </Card>

              {/* Traffic Monitor */}
              <Card className="bg-white/90 dark:bg-black/90 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Traffic Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-blue-400 mb-1">INBOUND</div>
                      <div className="text-lg font-bold">180GB</div>
                    </div>
                    <div>
                      <div className="text-xs text-orange-400 mb-1">
                        OUTBOUND
                      </div>
                      <div className="text-lg font-bold text-orange-500">
                        597.1GB
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 h-16">
                    {/* Blue bars for inbound */}
                    <div className="flex-1 flex items-end gap-0.5">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const height = 30 + Math.random() * 70;
                        return (
                          <div
                            key={i}
                            className="flex-1 bg-blue-500 rounded-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                        );
                      })}
                    </div>
                    {/* Orange bars for outbound */}
                    <div className="flex-1 flex items-end gap-0.5">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const height = 30 + Math.random() * 70;
                        return (
                          <div
                            key={i}
                            className="flex-1 bg-orange-500 rounded-sm"
                            style={{ height: `${height}%` }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* USD/GBP */}
              <Card className="bg-white/90 dark:bg-black/90 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">
                      USD/GBP
                    </CardTitle>
                    <div className="text-xs text-green-500">+ 0.00%</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold mb-2">17.685</div>
                  <div className="relative h-16">
                    <svg
                      viewBox="0 0 100 30"
                      className="w-full h-full"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,15 Q10,10 20,15 T40,20 T60,10 T80,15 T100,5"
                        fill="none"
                        stroke="rgb(59, 130, 246)"
                        strokeWidth="1"
                      />
                      <circle cx="95" cy="5" r="1" fill="rgb(59, 130, 246)" />
                    </svg>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <div>0</div>
                    <div>5</div>
                    <div>10</div>
                    <div>15</div>
                    <div>20</div>
                    <div>25</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Middle Column (Globe) */}
            {/* On small screens, span full width; on large screens, span 2 columns */}
            <div className="col-span-1 lg:col-span-2">
              <Card className="bg-white/90 dark:bg-black/90 border-blue-200 dark:border-blue-800 h-full">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Visitors Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 relative">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-b-lg">
                    {loading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                        <div className="text-center">
                          <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                          <p className="text-sm text-muted-foreground">
                            Loading visualization...
                          </p>
                        </div>
                      </div>
                    )}
                    {/* Visualization component can be inserted here */}
                    {/* City markers */}
                    <div className="absolute top-1/4 left-1/4 z-10">
                      <div className="bg-yellow-500 w-3 h-3 rounded-full relative">
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-0.5 rounded whitespace-nowrap">
                          Mexico City
                        </div>
                      </div>
                    </div>
                    {/* Other markers… */}
                    <div className="absolute bottom-4 right-4 z-10 text-xs text-white/70">
                      BETWEEN SEP 9 - 27
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-4">
              {/* Pressure */}
              <Card className="bg-white/90 dark:bg-black/90 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pressure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-3">
                    <div className="flex justify-between mb-1">
                      <div className="text-xs text-gray-500">MODERATE</div>
                      <div className="text-lg font-bold">75%</div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-sm ${
                            i < 11
                              ? "bg-teal-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <div className="text-xs text-gray-500">MODERATE</div>
                      <div className="text-lg font-bold">60%</div>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 15 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-sm ${
                            i < 9
                              ? "bg-teal-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation Score */}
              <Card className="bg-white/90 dark:bg-black/90 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Recommendation score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-gray-500">POSITIVE</span>
                      </div>
                      <div className="text-sm font-medium">66.6%</div>
                    </div>
                    <div className="relative w-16 h-16">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#e2e8f0"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="3"
                          strokeDasharray="94.2"
                          strokeDashoffset="31.4"
                          transform="rotate(-90 18 18)"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                      <span className="text-xs text-gray-500">NEGATIVE</span>
                    </div>
                    <div className="text-sm font-medium">29.7%</div>
                  </div>
                </CardContent>
              </Card>

              {/* Visitors Stats */}
              <Card className="bg-white/90 dark:bg-black/90 border-blue-200 dark:border-blue-800">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">
                      Visitors stats
                    </CardTitle>
                    <div className="text-xs text-gray-500">
                      BETWEEN SEP 9 - 27
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold mb-2">186k</div>
                  <div className="flex items-end gap-0.5 h-20">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const height = 20 + Math.random() * 80;
                      const color =
                        i % 3 === 0 ? "bg-red-500" : "bg-orange-400";
                      return (
                        <div
                          key={i}
                          className={`flex-1 ${color} rounded-sm`}
                          style={{ height: `${height}%` }}
                        ></div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <div>0</div>
                    <div>5</div>
                    <div>10</div>
                    <div>15</div>
                    <div>20</div>
                    <div>25</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-4">
            <Card className="bg-white/90 dark:bg-black/90 border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm font-medium">
                    Visitors Stats
                  </CardTitle>
                  <div className="text-xs text-gray-500">
                    BETWEEN SEP 9 - 27
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 h-16">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const height = Math.max(
                      10,
                      100 - i * 3 - Math.random() * 10
                    );
                    return (
                      <div
                        key={i}
                        className="flex-1 bg-teal-500 rounded-sm"
                        style={{ height: `${height}%` }}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <div>D1</div>
                  <div>SH</div>
                  <div>C2</div>
                  <div>J1</div>
                  <div>K2</div>
                  <div>L1</div>
                  <div>M2</div>
                  <div>N1</div>
                  <div>O2</div>
                  <div>P1</div>
                  <div>Q2</div>
                  <div>R1</div>
                  <div>S2</div>
                  <div>T1</div>
                  <div>U2</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Radar Chart (Floating) */}
          <div className="fixed bottom-6 right-6 z-10">
            <Card className="bg-white/90 dark:bg-black/90 border-blue-200 dark:border-blue-800 w-48">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Visitors Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-500 mb-1">DIAGNOSTICS</div>
                <div className="relative h-32 w-full">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Background hexagon */}
                      <polygon
                        points="50,10 90,30 90,70 50,90 10,70 10,30"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="0.5"
                      />
                      <polygon
                        points="50,20 80,35 80,65 50,80 20,65 20,35"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="0.5"
                      />
                      <polygon
                        points="50,30 70,40 70,60 50,70 30,60 30,40"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="0.5"
                      />
                      {/* Data polygon */}
                      <polygon
                        points="50,15 85,40 70,75 30,75 15,40"
                        fill="rgba(56, 189, 248, 0.2)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      {/* Axes */}
                      <line
                        x1="50"
                        y1="10"
                        x2="50"
                        y2="90"
                        stroke="#e2e8f0"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="10"
                        y1="30"
                        x2="90"
                        y2="70"
                        stroke="#e2e8f0"
                        strokeWidth="0.5"
                      />
                      <line
                        x1="10"
                        y1="70"
                        x2="90"
                        y2="30"
                        stroke="#e2e8f0"
                        strokeWidth="0.5"
                      />
                      {/* Labels */}
                      <text
                        x="50"
                        y="5"
                        textAnchor="middle"
                        fontSize="6"
                        fill="currentColor"
                      >
                        COLD
                      </text>
                      <text
                        x="95"
                        y="30"
                        textAnchor="start"
                        fontSize="6"
                        fill="currentColor"
                      >
                        TESTS
                      </text>
                      <text
                        x="95"
                        y="75"
                        textAnchor="start"
                        fontSize="6"
                        fill="currentColor"
                      >
                        CONSULTATION
                      </text>
                      <text
                        x="50"
                        y="98"
                        textAnchor="middle"
                        fontSize="6"
                        fill="currentColor"
                      >
                        INJURY
                      </text>
                      <text
                        x="5"
                        y="75"
                        textAnchor="end"
                        fontSize="6"
                        fill="currentColor"
                      >
                        VIRUSES
                      </text>
                    </svg>
                  </div>
                  <div className="absolute bottom-0 right-0 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-xs">Index A</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
