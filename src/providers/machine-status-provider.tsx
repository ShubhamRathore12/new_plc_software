"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import Cookies from "js-cookie";
import { useDataStore } from "@/lib/store";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://www.primeosys.com/backend";

const POLL_INTERVAL = 18 * 1000; // 18 seconds

type MachineDataEntry = {
  machineName: string;
  lastUpdate: string;
  recordId: number;
  hasNewData: boolean;
  machineStatus: boolean;
  coolingStatus: boolean;
  internetStatus: boolean;
};

type MachineStatus = {
  overallMachineStatus: boolean;
  overallCoolingStatus: boolean;
  overallInternetStatus: boolean;
  lastUpdate: Record<string, string>;
  recordIds: Record<string, number>;
  dataChanged: Record<string, boolean>;
  machines: MachineDataEntry[];
};

type MachineStatusContextType = {
  status: MachineStatus;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
};

const defaultStatus: MachineStatus = {
  overallMachineStatus: false,
  overallCoolingStatus: false,
  overallInternetStatus: false,
  lastUpdate: {},
  recordIds: {},
  dataChanged: {},
  machines: [],
};

const MachineStatusContext = createContext<MachineStatusContextType>({
  status: defaultStatus,
  isConnected: false,
  isLoading: true,
  error: null,
  refresh: () => {},
});

export function MachineStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<MachineStatus>(defaultStatus);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasFetchedOnce = useRef(false);

  // Only poll while someone is logged in: no calls on /login, and polling stops
  // as soon as logout clears the session.
  const { data: storeData } = useDataStore() as { data: any };
  const isAuthenticated =
    !!storeData?.user || !!Cookies.get("auth_token");

  const fetchStatus = useCallback(async () => {
    try {
      const token = Cookies.get("auth_token");
      const res = await fetch(`${BACKEND_URL}/api/machine/status-public`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        const machines: MachineDataEntry[] = result.data.map(
          (machine: any) => ({
            machineName: machine.machineName || machine.machineType,
            lastUpdate: machine.lastUpdate,
            recordId: machine.recordId,
            hasNewData: machine.hasNewData,
            machineStatus: machine.machineStatus,
            coolingStatus: machine.coolingStatus,
            internetStatus: machine.internetStatus,
          })
        );

        const lastUpdate: Record<string, string> = {};
        const recordIds: Record<string, number> = {};
        const dataChanged: Record<string, boolean> = {};

        let allOnline = true;
        let allCooling = true;
        let allInternet = true;

        machines.forEach((m) => {
          lastUpdate[m.machineName] = m.lastUpdate;
          recordIds[m.machineName] = m.recordId;
          dataChanged[m.machineName] = m.hasNewData;
          allOnline &&= m.machineStatus;
          allCooling &&= m.coolingStatus;
          allInternet &&= m.internetStatus;
        });

        setStatus({
          overallMachineStatus: allOnline,
          overallCoolingStatus: allCooling,
          overallInternetStatus: allInternet,
          lastUpdate,
          recordIds,
          dataChanged,
          machines,
        });

        setIsConnected(true);
        setError(null);

        // Start polling only after first successful response
        if (!hasFetchedOnce.current) {
          hasFetchedOnce.current = true;
          startPolling();
        }
      } else {
        setError("Invalid data from API");
        setIsConnected(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch machine status");
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startPolling = useCallback(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL);
  }, [fetchStatus]);

  const refresh = useCallback(() => {
    if (!isAuthenticated) return;
    fetchStatus();
  }, [fetchStatus, isAuthenticated]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    hasFetchedOnce.current = false;
  }, []);

  // Fetch while logged in; tear everything down on logout
  useEffect(() => {
    if (!isAuthenticated) {
      stopPolling();
      setStatus(defaultStatus);
      setIsConnected(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    fetchStatus();
    return stopPolling;
  }, [isAuthenticated, fetchStatus, stopPolling]);

  return (
    <MachineStatusContext.Provider
      value={{ status, isConnected, isLoading, error, refresh }}
    >
      {children}
    </MachineStatusContext.Provider>
  );
}

export function useMachineStatus() {
  return useContext(MachineStatusContext);
}
