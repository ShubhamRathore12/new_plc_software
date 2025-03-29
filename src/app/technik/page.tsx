// app/technik/page.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Technik: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-black">
      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              GTPL-053
            </span>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              GRAIN TECHNIK
            </h1>
          </div>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            2023/10/27 16:59:05
          </span>
        </div>

        {/* Centered Cards */}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Left Section: Silo and Controls */}
          <div className="space-y-4">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Silo Control
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  SILO
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="success"
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    AUTO START
                  </Button>
                  <Button
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    AUTO STOP
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600"
                  >
                    BACK
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section: Readings */}
          <div className="space-y-4">
            {/* Temperature Readings */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Temperature Readings
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">
                    T0 (Supply Air Temp.)
                  </Label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    13.9°C
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">
                    T1 (Cold Air Temp.)
                  </Label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    11.0°C
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">
                    T2 (Ambient Air Temp.)
                  </Label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    33.0°C
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">
                    T0 (Total)
                  </Label>
                  <p className="text-lg font-semibold text-orange-500">14°C</p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">ΔT</Label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    3°C
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Humidity Readings */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Humidity Readings
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">
                    AHT
                  </Label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    23%
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">
                    HGS
                  </Label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    0%
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Blower Status */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Blower Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="text-gray-600 dark:text-gray-400">
                  Power
                </Label>
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  75%
                </p>
              </CardContent>
            </Card>

            {/* Fan Status */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Fan Status
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                {["FAN 1", "FAN 2", "FAN 3", "FAN 4"].map((fan, index) => (
                  <div key={index}>
                    <Label className="text-gray-600 dark:text-gray-400">
                      {fan}
                    </Label>
                    <p className="text-lg font-semibold text-green-500">ON</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Pressure Readings */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Pressure Readings
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">HP</Label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    295
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600 dark:text-gray-400">LP</Label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    59
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Temperature Definitions */}
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Definitions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  <li>T0 = SUPPLY AIR TEMP.</li>
                  <li>T1 = COLD AIR TEMP.</li>
                  <li>T2 = AMBIENT AIR TEMP.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Technik;
