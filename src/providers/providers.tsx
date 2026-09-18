"use client";

import { type ReactNode } from "react";
import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { LanguageProvider } from "./language-provider";
import { AppPerformanceProvider } from "./performance-provider";
import { MachineStatusProvider } from "./machine-status-provider";
import { SessionProvider } from "./session-provider";
import SessionGate from "@/components/auth/SessionGate";
import { MotionConfig } from "framer-motion";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";

// Dynamically import RoutePrefetcher to avoid SSR issues
const RoutePrefetcher = dynamic(
  () => import("@/components/layout/RoutePrefetcher"),
  { ssr: false },
);

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      {/* JS-driven animations follow the OS reduced-motion setting too; the CSS
          media query alone cannot reach framer-motion (F-03). */}
      <MotionConfig reducedMotion="user">
        <LanguageProvider>
          <AppPerformanceProvider>
            <ThemeProvider>
              <SessionProvider>
                <MachineStatusProvider>
                  <SessionGate>{children}</SessionGate>
                  <RoutePrefetcher />
                  <Toaster richColors />
                </MachineStatusProvider>
              </SessionProvider>
            </ThemeProvider>
          </AppPerformanceProvider>
        </LanguageProvider>
      </MotionConfig>
    </QueryProvider>
  );
}
