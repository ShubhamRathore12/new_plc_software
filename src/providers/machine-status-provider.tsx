"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  type ReactNode,
} from "react";
import { api, SessionExpiredError } from "@/lib/apiClient";
import { useSession } from "@/providers/session-provider";

const POLL_INTERVAL = 18 * 1000; // 18 seconds
/** A reading older than this is shown as stale rather than as live truth. */
export const STALE_AFTER_MS = 90 * 1000;

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

/** Connection lifecycle, so the UI can tell a reconnect from a fault (F-16). */
export type FeedState =
  | "idle"
  | "connecting"
  | "live"
  | "reconnecting"
  | "offline";

type MachineStatusContextType = {
  status: MachineStatus;
  /** @deprecated prefer `feedState` — a boolean cannot distinguish
   *  "connecting" from "disconnected". */
  isConnected: boolean;
  feedState: FeedState;
  isLoading: boolean;
  error: string | null;
  /** When the last successful response arrived; null before the first one. */
  lastUpdatedAt: Date | null;
  /** True once `lastUpdatedAt` is older than STALE_AFTER_MS. */
  isStale: boolean;
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
  feedState: "idle",
  isLoading: true,
  error: null,
  lastUpdatedAt: null,
  isStale: false,
  refresh: () => {},
});

export function MachineStatusProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<MachineStatus>(defaultStatus);
  const [feedState, setFeedState] = useState<FeedState>("idle");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasFetchedOnce = useRef(false);

  // Poll only while the server has confirmed a session: no calls on /login, and
  // polling stops the moment the session ends.
  const { status: sessionStatus } = useSession();
  const isAuthenticated = sessionStatus === "authenticated";

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    hasFetchedOnce.current = false;
  }, []);

  const fetchStatus = useCallback(async () => {
    setFeedState((prev) =>
      prev === "live" || prev === "reconnecting" ? "reconnecting" : "connecting"
    );
    try {
      const res = await api("/api/machine/status-public", {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();

      if (result.success && Array.isArray(result.data)) {
        // The server returns only the caller's assigned machines — no
        // client-side fleet filtering and no hardcoded machine list.
        const machines: MachineDataEntry[] = result.data.map((machine: any) => ({
          machineName: machine.machineName || machine.machineType,
          lastUpdate: machine.lastUpdate,
          recordId: machine.recordId,
          hasNewData: machine.hasNewData,
          machineStatus: machine.machineStatus,
          coolingStatus: machine.coolingStatus,
          internetStatus: machine.internetStatus,
        }));

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

        setFeedState("live");
        setLastUpdatedAt(new Date());
        setError(null);

        if (!hasFetchedOnce.current) {
          hasFetchedOnce.current = true;
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL);
        }
      } else {
        setError("Invalid data from API");
        setFeedState("offline");
      }
    } catch (err: any) {
      // A 401 has already routed to login; do not keep polling behind it.
      if (err instanceof SessionExpiredError) {
        stopPolling();
        return;
      }
      // Keep the last known values on screen — telemetry is never replaced
      // with zeros or N/A while reconnecting (F-16).
      setError(err.message || "Failed to fetch machine status");
      setFeedState(hasFetchedOnce.current ? "reconnecting" : "offline");
    } finally {
      setIsLoading(false);
    }
  }, [stopPolling]);

  const refresh = useCallback(() => {
    if (!isAuthenticated) return;
    fetchStatus();
  }, [fetchStatus, isAuthenticated]);

  // Fetch while signed in; tear everything down on logout.
  useEffect(() => {
    if (!isAuthenticated) {
      stopPolling();
      setStatus(defaultStatus);
      setFeedState("idle");
      setLastUpdatedAt(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    fetchStatus();
    return stopPolling;
  }, [isAuthenticated, fetchStatus, stopPolling]);

  // Logout and session expiry both broadcast this; stop the feed immediately.
  useEffect(() => {
    const onEnded = () => {
      stopPolling();
      setStatus(defaultStatus);
      setFeedState("idle");
      setLastUpdatedAt(null);
    };
    window.addEventListener("app:session-ended", onEnded);
    return () => window.removeEventListener("app:session-ended", onEnded);
  }, [stopPolling]);

  // Drives the "last update" label and the stale threshold.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 10 * 1000);
    return () => clearInterval(id);
  }, []);

  const isStale =
    lastUpdatedAt !== null && now - lastUpdatedAt.getTime() > STALE_AFTER_MS;

  // Stable context value: without this every provider render re-renders every
  // consumer, which on this app means every machine page on each 18s poll.
  const value = useMemo(
    () => ({
      status,
      isConnected: feedState === "live",
      feedState,
      isLoading,
      error,
      lastUpdatedAt,
      isStale,
      refresh,
    }),
    [status, feedState, isLoading, error, lastUpdatedAt, isStale, refresh]
  );

  return (
    <MachineStatusContext.Provider value={value}>
      {children}
    </MachineStatusContext.Provider>
  );
}

export function useMachineStatus() {
  return useContext(MachineStatusContext);
}
