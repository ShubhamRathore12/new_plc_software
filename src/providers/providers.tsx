"use client";

import { type ReactNode } from "react";
import QueryProvider from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { LanguageProvider } from "./language-provider";
import { AppPerformanceProvider } from "./performance-provider";
import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner";

// Dynamically import RoutePrefetcher to avoid SSR issues
const RoutePrefetcher = dynamic(
  () => import("@/components/layout/RoutePrefetcher"),
  { ssr: false }
);

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <LanguageProvider>
        <AppPerformanceProvider>
          <ThemeProvider>
            {children}
            <RoutePrefetcher />
            <Toaster richColors />
          </ThemeProvider>
        </AppPerformanceProvider>
      </LanguageProvider>
    </QueryProvider>
  );
}
