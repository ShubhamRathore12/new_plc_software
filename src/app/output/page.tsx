// app/output/page.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Sidebar from "@/components/dashboard/sidebar"; // Import the Sidebar

const Outputs: React.FC = () => {
  // Output data based on the image
  const outputsLeft = [
    { id: "Q0.0", label: "Compressor on", status: true },
    { id: "Q0.1", label: "Reset compressor module", status: false },
    { id: "Q0.2", label: "Spare", status: true },
    { id: "Q0.3", label: "Spare", status: true },
    { id: "Q0.4", label: "Solenoid valve on", status: true },
    { id: "Q0.5", label: "Hot gas valve on", status: true },
    { id: "Q0.6", label: "AHT valve", status: true },
    { id: "Q0.7", label: "Blower drive on signal", status: true },
  ];

  const outputsRight = [
    { id: "Q1.0", label: "Collective trouble signal", status: true },
    { id: "Q1.1", label: "Chiller healthy", status: true },
    { id: "Q2.1", label: "Cond. fan 1 on", status: true },
    { id: "Q2.2", label: "Spare", status: true },
    { id: "Q2.3", label: "Chiller fault", status: true },
    { id: "Q2.4", label: "Cond. fan 2 on", status: true },
    { id: "Q2.5", label: "Cond. fan 3 on", status: true },
    { id: "Q2.6", label: "Cond. fan 4 on", status: true },
    { id: "Q2.7", label: "Spare", status: true },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            OUTPUTS
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            2023/10/27 16:51:26
          </span>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column: Q0.0 to Q0.7 */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Outputs (Q0.0 - Q0.7)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {outputsLeft.map((output) => (
                <div
                  key={output.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      output.status ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <Label className="text-gray-600 dark:text-gray-400">
                    {output.id}
                  </Label>
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    {output.label}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Right Column: Q1.0 to Q2.7 */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Outputs (Q1.0 - Q2.7)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {outputsRight.map((output) => (
                <div
                  key={output.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <div
                    className={`w-4 h-4 rounded-full ${
                      output.status ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <Label className="text-gray-600 dark:text-gray-400">
                    {output.id}
                  </Label>
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    {output.label}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-start space-x-2 mt-4">
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            BACK
          </Button>
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
          >
            ANALOG
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Outputs;
