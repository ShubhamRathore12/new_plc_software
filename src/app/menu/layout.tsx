"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Menu, Plus, Minus } from "lucide-react";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { MonitoringProvider } from "@/app/context/monitoring-context";
import Sidebar from "@/components/layout/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Header from "@/components/layout/header";
 // Import the Header component

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [zoomLevel, setZoomLevel] = useState(1);

  const SidebarContent = (
    <div className="relative h-full bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />
    </div>
  );

  return (
    <MonitoringProvider>
      <div className="flex h-screen bg-background dark:bg-black">
        {/* Mobile Sidebar */}
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              {SidebarContent}
            </SheetContent>
          </Sheet>
        ) : (
          <div className="w-64 shrink-0">{SidebarContent}</div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-2 overflow-auto relative h-screen">
          {/* Header Component */}
          <Header /> {/* Add the Header component here */}
          {/* Zoom Controls - Responsive & Always on Top */}
          <div
            className={`fixed flex flex-col items-center space-y-2 p-3 rounded-lg z-50 shadow-lg ${
              isMobile
                ? "bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-700"
                : "top-4 right-4 bg-gray-800"
            }`}
          >
            <button
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 2))}
              className="text-white"
            >
              <Plus className="h-5 w-5" />
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 1))}
              className="text-white"
            >
              <Minus className="h-5 w-5" />
            </button>
          </div>
          {/* Content with Zoom Effect */}
          <div
            className="relative transform transition-transform origin-top-left md:p-4"
            style={{
              transform: `scale(${zoomLevel}) translateX(${
                (zoomLevel - 1) * 256
              }px)`,
            }}
          >
            {children}
            <footer className="mt-6 text-center text-sm text-muted-foreground">
              © 2023, powered by Faction Labs
            </footer>
          </div>
        </main>
      </div>
    </MonitoringProvider>
  );
}
