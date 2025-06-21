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

export const useMachineStatusFeed = (
  type: "sse" | "ws" = "ws" // you can switch between 'sse' and 'ws'
) => {
  const [status, setStatus] = useState<MachineStatus |  any>({
    machineStatus: false,
    coolingStatus: false,
    internetStatus: false,
    lastUpdate: { gtpl: null, kabo: null },
    recordIds: { gtpl: 0, kabo: 0 },
    dataChanged: { gtpl: false, kabo: false },
  });

  const [connection, setConnection] = useState<
    "connected" | "disconnected" | "error"
  >("disconnected");
  const [messages, setMessages] = useState<MessageLog[]>([]);
  const ref = useRef<EventSource | WebSocket | null>(null);

  const addMessage = useCallback((msg: string, type: MessageLog["type"]) => {
    const timestamp = new Date().toLocaleTimeString();
    setMessages((prev) => [...prev.slice(-9), { message: msg, type, timestamp }]);
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      const res = await fetch("https://grain-backend.onrender.com/api/machine/status/public");
      const result = await res.json();

      
      if (result.success) {
        setStatus(result.data);
     
        
        addMessage("Initial data fetched successfully", "info");
      } else {
        addMessage("Initial fetch failed", "error");
      }
    } catch {
      addMessage("Error fetching initial data", "error");
    }
  }, [addMessage]);

  // Connect to SSE
  const connectSSE = useCallback(() => {
    const source = new EventSource("https://grain-backend.onrender.com/api/machine/status/public");

    source.onopen = () => {
      setConnection("connected");
      addMessage("SSE Connected", "info");
    };

    source.addEventListener("connected", (event) => {
      const data = JSON.parse((event as MessageEvent).data);
      addMessage(`SSE says connected: ${data.status}`, "info");
    });

    source.addEventListener("update", (event) => {
      const parsed = JSON.parse((event as MessageEvent).data);
      setStatus(parsed);
      addMessage("SSE: Data updated", "status");
    });

    source.onerror = (event: Event) => {
      addMessage("SSE Error occurred", "error");
      source.close();
      setConnection("error");
    };

    ref.current = source;
  }, [addMessage]);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setConnection("connected");
      addMessage("WebSocket connected", "info");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "machine_status_update" || data.type === "machine_status_reset") {
          setStatus(data.data);
          addMessage("WebSocket: Status updated", "status");
        } else if (data.type === "machine_status_error") {
          addMessage(`WebSocket Error: ${data.data.message}`, "error");
        } else if (data.type === "connected") {
          addMessage("WebSocket connection established", "info");
        } else {
          addMessage("Unknown WebSocket message type", "warning");
        }
      } catch {
        addMessage("Failed to parse WebSocket message", "error");
      }
    };

    ws.onerror = () => {
      addMessage("WebSocket error occurred", "error");
      setConnection("error");
    };

    ws.onclose = () => {
      setConnection("disconnected");
      addMessage("WebSocket disconnected", "warning");

      // Auto-reconnect
      setTimeout(() => {
        if (ref.current?.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 5000);
    };

    ref.current = ws;
  }, [addMessage]);

  const disconnect = useCallback(() => {
    if (ref.current) {
      ref.current.close();
      ref.current = null;
      setConnection("disconnected");
      addMessage("Connection manually closed", "warning");
    }
  }, [addMessage]);

  useEffect(() => {
    fetchInitialData();
    if (type === "sse") connectSSE();
    else connectWebSocket();

    return () => {
      if (ref.current) ref.current.close();
    };
  }, [type, connectSSE, connectWebSocket, fetchInitialData]);

  return {
    status,
    connection,
    messages,
    disconnect,
    reconnect: type === "sse" ? connectSSE : connectWebSocket,
    refresh: fetchInitialData,
  };
};
