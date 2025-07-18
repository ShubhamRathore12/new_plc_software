"use client";

import { type ReactNode } from "react";
import { PerformanceProvider } from "../contexts/PerformanceContext";

interface PerformanceProviderProps {
  children: ReactNode;
}

export function AppPerformanceProvider({ children }: PerformanceProviderProps) {
  return (
    <PerformanceProvider>
      {children}
    </PerformanceProvider>
  );
}