import { useState, useEffect, useRef, useCallback } from "react";
import { apiRequest } from "@/lib/api";

type MessageLog = {
  message: string;
  type: "info" | "error" | "warning" | "status";
  timestamp: string;
};

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

export const useMachineStatusFeed = () => {
  const [status, setStatus] = useState<MachineStatus>({
    overallMachineStatus: false,
    overallCoolingStatus: false,
    overallInternetStatus: false,
    lastUpdate: {},
    recordIds: {},
    dataChanged: {},
    machines: [],
  });

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addMessage = useCallback((msg: string, type: MessageLog["type"]) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages((prev) => [
      ...prev.slice(-9),
      { message: msg, type, timestamp },
    ]);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const result = await apiRequest("/api/machine/status-public");

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
        addMessage("Machine data updated", "status");
      } else {
        addMessage("Invalid machine data from API", "error");
        setIsConnected(false);
      }
    } catch (error) {
      addMessage("Error fetching machine data", "error");
      setIsConnected(false);
    }
  }, [addMessage]);

  const startPolling = useCallback(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 18 * 1000);
    addMessage("Polling started (6 second interval)", "info");
  }, [fetchData, addMessage]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsConnected(false);
      addMessage("Polling stopped", "warning");
    }
  }, [addMessage]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    startPolling();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startPolling]);

  return {
    status,
    isConnected,
    messages,
    stopPolling,
    startPolling,
    refresh,
  };
};
