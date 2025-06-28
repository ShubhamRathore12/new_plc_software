import { useState, useEffect, useRef } from "react";
import { format } from "@/lib/utils";
import { useMachineStatusFeed } from "./useMachineStatusFeed";

interface AutoData {
  [key: string]: any;
}

export const useAutoData = (autoType: string) => {
  const { status } = useMachineStatusFeed();
  console.log(status);

  const [data, setData] = useState<AutoData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Device name to status key mapping
  const deviceNameToStatusKey: Record<string, string> = {
    "GTPL-122-gT-1000T-S7-1200": "gtpl",
    "GTPL-118-gT-80E-P-S7-200": "kabo",
  };

  const fetchData = async () => {
    let url = "";

    if (autoType === "GTPL-122-gT-1000T-S7-1200") {
      url = "/api/getData";
    } else if (autoType === "GTPL-118-gT-80E-P-S7-200") {
      url = "/api/getSmartData";
    } else if (autoType === "Gtpl-S7-1200-02") {
      url = "https://grain-backend-1.onrender.com/api/ws/current-data";
    } else {
      url = "/api/latest-data";
    }

    try {
      // Get machine status using the device mapping
      const key = deviceNameToStatusKey[autoType];
      const deviceStatus = key ? (status as Record<string, any>)?.[key] || {} : {};
      const isMachineRunning = deviceStatus.machineStatus ?? false;

      if (isMachineRunning) {
        // If machine is running, fetch actual data
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
        const result = await response.json();

        if (result) {
          setData([result?.[0]]);
          setIsConnected(true);
          setError(null);
          setRetryCount(0);
        } else {
          throw new Error("Invalid response structure");
        }
      } else {
        // If machine is not running, set default data to 0 and connected to false
        setData([{}]); // Set empty object or you can set specific default structure with 0 values
        setIsConnected(false);
        setError("Machine is not running");
        setRetryCount(0);
      }
    } catch (err: any) {
      setIsConnected(false);
      setError("Failed to fetch data");
      setRetryCount((prev) => prev + 1);
      console.error("❌ Polling error:", err.message || err);
    }
  };

  useEffect(() => {
    fetchData(); // fetch immediately on mount
    intervalRef.current = setInterval(fetchData, 10000); // poll every 10s

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoType, status]); // Added status as dependency

  const formatValue = (value: any, unit: string = "") => {
    if (value === undefined || value === null) return "--";

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return `${value}${unit}`;
    if (numericValue === 0) return `0${unit}`;

    const decimalPart = numericValue % 1;

    const roundedValue =
      decimalPart >= 0.5 ? Math.ceil(numericValue) : Math.floor(numericValue);

    return `${roundedValue}${unit}`;
  };

  return {
    data: data[0] || {},
    isConnected,
    error,
    retryCount,
    formatValue,
  };
};