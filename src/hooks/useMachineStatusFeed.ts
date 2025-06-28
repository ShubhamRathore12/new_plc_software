import { useState, useEffect, useRef, useCallback } from "react";

type MachineStatus = {
  machineStatus: boolean;
  coolingStatus: boolean;
  internetStatus: boolean;
  lastUpdate: {
    gtpl: string | null;
    kabo: string | null;
  };
  recordIds: {
    gtpl: number;
    kabo: number;
  };
  dataChanged: {
    gtpl: boolean;
    kabo: boolean;
  };
};

type MessageLog = {
  message: string;
  type: "info" | "error" | "warning" | "status";
  timestamp: string;
};

export const useMachineStatusFeed = () => {
  const [status, setStatus] = useState<MachineStatus>({
    machineStatus: false,
    coolingStatus: false,
    internetStatus: false,
    lastUpdate: { gtpl: null, kabo: null },
    recordIds: { gtpl: 0, kabo: 0 },
    dataChanged: { gtpl: false, kabo: false },
  });

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addMessage = useCallback((msg: string, type: MessageLog["type"]) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages((prev) => [...prev.slice(-9), { message: msg, type, timestamp }]);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/machine/status-public");
      const result = await res.json();

      if (result.success) {
        setStatus(result.data);
        setIsConnected(true);
        addMessage("Data updated successfully", "status");
      } else {
        addMessage("API call failed", "error");
        setIsConnected(false);
      }
    } catch (error) {
      addMessage("Error fetching data", "error");
      setIsConnected(false);
    }
  }, [addMessage]);

  const startPolling = useCallback(() => {
    // Initial fetch
    fetchData();
    
    // Set up interval for polling every 6 seconds
    intervalRef.current = setInterval(() => {
      fetchData();
    }, 6000);
    
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