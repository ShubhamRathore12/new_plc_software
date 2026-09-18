"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import StatsPanel from "./stats-panel";
import ActivityPanel from "./activity-panel";
import { Button } from "@/components/ui/button";
import { Menu, Plus, Minus } from "lucide-react";
import { useMediaQuery } from "@/app/hooks/use-media-query";
import { MonitoringProvider } from "@/app/context/monitoring-context";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { cn } from "@/lib/utils";
import Header from "./header";
import { useLanguage } from "@/providers/language-provider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [zoomLevel, setZoomLevel] = useState(1);
  const { t } = useLanguage();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // The main element is the app's scroll container and it survives navigation,
  // so without this a new page opens at the previous page's offset and its
  // title is scrolled out of view (F-15). Browser back/forward restores its own
  // position, so only forward navigation is reset.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  const SidebarContent = (
    <div className="bg-sidebar relative h-full">
      <Sidebar />
    </div>
  );

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <MonitoringProvider>
      <div className="bg-background flex h-screen">
        {/* Mobile Sidebar */}
        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("open_menu")}
                className="bg-card/90 border-border fixed top-3 left-3 z-50 rounded-full border shadow-[var(--shadow-sm)] backdrop-blur"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
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
        <main ref={scrollRef} className="relative h-screen flex-1 overflow-auto">
          <Header />
          {/* Zoom Controls */}
          <div
            role="group"
            aria-label={t("page_zoom")}
            className={cn(
              "bg-card/90 text-foreground border-border fixed z-50 flex items-center gap-1 rounded-full border p-1 shadow-[var(--shadow-md)] backdrop-blur",
              isMobile
                ? "bottom-4 left-1/2 -translate-x-1/2"
                : "right-5 bottom-5 flex-col"
            )}
          >
            <button
              type="button"
              aria-label={t("zoom_in")}
              onClick={() => setZoomLevel((prev) => Math.min(prev + 0.1, 2))}
              className="hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
            <span
              aria-live="polite"
              className="tabular text-muted-foreground px-1 text-[11px] font-medium"
            >
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              type="button"
              aria-label={t("zoom_out")}
              onClick={() => setZoomLevel((prev) => Math.max(prev - 0.1, 1))}
              className="hover:bg-accent hover:text-accent-foreground flex h-8 w-8 items-center justify-center rounded-full transition-colors"
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Zoomable content.
             `zoom` reflows the content at the new scale, so nothing overflows
             sideways — unlike transform: scale(), which needed a translateX
             counter-hack and still clipped wide pages. */}
          <div
            className="relative flex min-h-[calc(100vh-3.5rem)] flex-col px-4 pb-6 md:px-6"
            style={{ zoom: zoomLevel }}
          >
            <div className="flex-1">{children}</div>
            <footer className="text-muted-foreground border-border/60 mt-10 border-t pt-4 text-center text-xs">
              {t("footer_powered_by")}
            </footer>
          </div>
        </main>
      </div>
    </MonitoringProvider>
  );
}
