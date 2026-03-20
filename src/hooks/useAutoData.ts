import { useState, useEffect, useRef } from "react";
import { format } from "@/lib/utils";
import { useMachineStatusFeed } from "./useMachineStatusFeed";
import { apiRequest } from "@/lib/api";
import { DEVICE_TO_TABLE_MAP, DEVICE_TO_STATUS_KEY } from "@/lib/machineRegistry";

interface AutoData {
  [key: string]: any;
}

export const useAutoData = (autoType: string) => {
  const { status } = useMachineStatusFeed();

  const [data, setData] = useState<AutoData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Derived from centralized registry
  const autoTypeToTableMap = DEVICE_TO_TABLE_MAP;
  const deviceNameToStatusKey = DEVICE_TO_STATUS_KEY;

  const fetchData = async () => {
    const table = autoTypeToTableMap[autoType];
    const statusKey = deviceNameToStatusKey[autoType];

    // Find the device status in the machines array
    const deviceStatus = status.machines.find(
      (m) => m.machineName === statusKey
    );
    
    const isMachineRunning = deviceStatus?.machineStatus ?? false;

    // Only fetch data if machine is running, otherwise set data to empty
    if (!isMachineRunning) {
      setData([]);
      setIsConnected(false);
      setError(null);
      setRetryCount(0);
      return;
    }

    if (!table) {
      setError("❌ Unknown table mapping for device: " + autoType);
      console.error("No table mapping found for:", autoType);
      return;
    }

    try {
      const result = await apiRequest(
        `/api/fetchData?table=${encodeURIComponent(table)}`
      );

      if (result?.data) {
        setData([result.data]);
        setIsConnected(true);
        setError(null);
        setRetryCount(0);
      } else {
        throw new Error("Invalid response structure - no data property");
      }
    } catch (err: any) {
      console.error("❌ Polling error:", err.message || err);
      setIsConnected(false);
      setError(`Failed to fetch data: ${err.message}`);
      setRetryCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (autoType) {
      fetchData();
      intervalRef.current = setInterval(fetchData, 10000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoType, status]);

  const formatValue = (value: any, unit: string = "") => {
    if (value === undefined || value === null) return "--";
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return `${value}${unit}`;
    if (numericValue === 0) {
      if (unit.includes("°")) {
        return `0.00${unit}`;
      }
      if (unit.includes("bar")) {
        return `${numericValue.toFixed(1)}${unit}`;
      }
      return `0${unit}`;
    }

    if (unit.includes("°")) {
      return `${numericValue.toFixed(1)}${unit}`;
    }

    if (unit.includes("bar")) {
      return `${numericValue.toFixed(1)}${unit}`;
    }

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
