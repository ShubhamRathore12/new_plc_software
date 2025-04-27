"use client";

import { useEffect, useState } from "react";
import Sidebar from "./sidebar";
import StatsPanel from "./stats-panel";
import ActivityPanel from "./activity-panel";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Minus } from "lucide-react";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { MonitoringProvider } from "@/app/context/monitoring-context";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Header from "./header";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  const SidebarContent = (
    <div className="relative h-full bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />
    </div>
  );

  if (!mounted) return null; // Prevent hydration mismatch

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
        <main className="flex-1 p-4 md:p-2 overflow-auto relative h-screen -mt-2">
          <Header />
          {/* Zoom Controls */}
          <div
            className={`fixed flex flex-col items-center space-y-2 p-3 rounded-lg z-50 shadow-lg ${
              isMobile
                ? "bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-700"
                : "bottom-4 right-4 bg-gray-800"
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

          {/* Zoomable Content */}
          <div
            className="relative transform transition-transform origin-top-left h-full"
            style={{
              transform: `scale(${zoomLevel}) translateX(${
                (zoomLevel - 1) * 256
              }px)`,
            }}
          >
            {children}
            <footer className="mt-6 text-center text-sm text-muted-foreground mt-[10%]  bg-gray-50 dark:bg-black">
              © 2023, powered by Grain Technik
            </footer>
          </div>
        </main>
      </div>
    </MonitoringProvider>
  );
}
