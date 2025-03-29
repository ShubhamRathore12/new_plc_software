// app/menu/page.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Sidebar from "@/components/dashboard/sidebar"; // Import the Sidebar

const Menu: React.FC = () => {
  // Navigation handlers (you can replace these with actual routes)
  const handleNavigation = (path: string) => {
    console.log(`Navigating to ${path}`);
    // router.push(path);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            MENU
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            2023/10/27 16:29:47
          </span>
        </div>

        {/* Main Content */}
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Control Menu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-semibold border-gray-300 dark:border-gray-600"
                  onClick={() => handleNavigation("/auto")}
                >
                  AUTO
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-semibold border-gray-300 dark:border-gray-600"
                  onClick={() => handleNavigation("/aeration")}
                >
                  AERATION
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-semibold border-gray-300 dark:border-gray-600"
                  onClick={() => handleNavigation("/fault")}
                >
                  FAULT
                </Button>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-semibold border-gray-300 dark:border-gray-600"
                  onClick={() => handleNavigation("/inputs")}
                >
                  INPUTS
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-lg font-semibold border-gray-300 dark:border-gray-600"
                  onClick={() => handleNavigation("/outputs")}
                >
                  OUTPUTS
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Button */}
        <div className="mt-4">
          <Button
            variant="outline"
            className="border-gray-300 dark:border-gray-600"
            onClick={() => handleNavigation("/")}
          >
            BACK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
