import { useState, useEffect, useCallback, useRef } from "react";
import { format } from "@/lib/utils";

interface AutoData {
  [key: string]: any;
}

export const useAutoData = (autoType: string) => {
  
  
  const [data, setData] = useState<AutoData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connectToEventSource = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close(); // Cleanup old connection
    }

    const url = autoType === "S7-1200" ? "/api/getData" : "/api/getDataSmart";
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      setError(null);
      setRetryCount(0);
    };

    eventSource.onmessage = (event) => {
      const newRow = JSON.parse(event.data);
      setData([newRow]);
    };

    eventSource.onerror = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      setIsConnected(false);
      setError("Connection lost. Attempting to reconnect...");
      setRetryCount((prev) => prev + 1);
    };
  }, [autoType, data]);

  // Initial connection
  useEffect(() => {
    connectToEventSource();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [connectToEventSource, data]);

  // Reconnect only if disconnected
  useEffect(() => {
    if (!isConnected && retryCount > 0) {
      const timer = setTimeout(() => {
        connectToEventSource();
      }, 5000); // Reconnect after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isConnected, retryCount, connectToEventSource, data]);

  const formatValue = (value: any, unit: string = "") => {
    if (value === undefined || value === null) return "--";
    return `${format(value)}${unit}`;
  };

  return {
    data: data[0] || {},
    isConnected,
    error,
    formatValue,
    retryCount,
  };
};
