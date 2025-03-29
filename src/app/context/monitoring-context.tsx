"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface MonitoringContextType {
  selectedDevice: string | null;
  setSelectedDevice: (device: string | null) => void;
}

const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

export function MonitoringProvider({ children }: { children: ReactNode }) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  return (
    <MonitoringContext.Provider value={{ selectedDevice, setSelectedDevice }}>
      {children}
    </MonitoringContext.Provider>
  );
}

export function useMonitoring() {
  const context = useContext(MonitoringContext);
  if (context === undefined) {
    throw new Error("useMonitoring must be used within a MonitoringProvider");
  }
  return context;
}