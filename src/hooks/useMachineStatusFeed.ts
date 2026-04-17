import { useEffect } from "react";
import { useMachineStatusStore } from "@/lib/machineStatusStore";

/**
 * Hook that provides machine status data from a single shared polling instance.
 * All components using this hook share the same API calls — no duplicate polling.
 */
export const useMachineStatusFeed = () => {
  const { status, isConnected, subscribe, refresh } = useMachineStatusStore();

  useEffect(() => {
    const unsubscribe = subscribe();
    return unsubscribe;
  }, [subscribe]);

  return {
    status,
    isConnected,
    messages: [] as { message: string; type: string; timestamp: string }[],
    stopPolling: () => {},
    startPolling: () => {},
    refresh,
  };
};
