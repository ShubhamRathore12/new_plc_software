import { useState, useEffect, useRef } from "react";
import { format } from "@/lib/utils";

interface AutoData {
  [key: string]: any;
}

export const useAutoData = (autoType: string) => {
  const [data, setData] = useState<AutoData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    let url = "";

    if (autoType === "GTPL-122-gT-1000T-S7-1200") {
      url = "https://grain-backend.onrender.com/api/ws/current-data";
    } else if (autoType === "GTPL-118-gT-80E-P-S7-200") {
      url = "https://grain-backend.onrender.com/api/alldata/alldata";
    } else if (autoType === "Gtpl-S7-1200-02") {
      url = "https://grain-backend.onrender.com/api/ws/current-data";
    } else {
      url = "/api/latest-data";
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! ${response.status}`);
      const result = await response.json();

      // Full structure

      if (result.success) {
        setData([result.data]);
        setIsConnected(true);
        setError(null);
        setRetryCount(0);
      } else {
        throw new Error("Invalid response structure");
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
    intervalRef.current = setInterval(fetchData, 5000); // poll every 5s

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoType]);

  const formatValue = (value: any, unit: string = "") => {
    if (value === undefined || value === null) return "--";

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return `${value}${unit}`;
    if (numericValue === 0) return `0${unit}`;

    // If decimal part is zero, show integer only
    const isWholeNumber = numericValue % 1 === 0;
    return `${isWholeNumber ? Math.floor(numericValue) : numericValue.toFixed(2)}${unit}`;
  };

  return {
    data: data[0] || {},
    isConnected,
    error,
    retryCount,
    formatValue,
  };
};
