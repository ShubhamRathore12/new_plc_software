import { create } from "zustand";
import { apiRequest } from "@/lib/api";

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

interface MachineStatusStore {
  status: MachineStatus;
  isConnected: boolean;
  subscriberCount: number;
  _intervalRef: ReturnType<typeof setInterval> | null;
  subscribe: () => () => void;
  refresh: () => Promise<void>;
}

const POLL_INTERVAL = 18 * 1000;

const defaultStatus: MachineStatus = {
  overallMachineStatus: false,
  overallCoolingStatus: false,
  overallInternetStatus: false,
  lastUpdate: {},
  recordIds: {},
  dataChanged: {},
  machines: [],
};

export const useMachineStatusStore = create<MachineStatusStore>((set, get) => {
  const fetchData = async () => {
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

        set({
          status: {
            overallMachineStatus: allOnline,
            overallCoolingStatus: allCooling,
            overallInternetStatus: allInternet,
            lastUpdate,
            recordIds,
            dataChanged,
            machines,
          },
          isConnected: true,
        });
      } else {
        set({ isConnected: false });
      }
    } catch {
      set({ isConnected: false });
    }
  };

  const startPolling = () => {
    const state = get();
    if (state._intervalRef) return; // already polling
    fetchData();
    const id = setInterval(fetchData, POLL_INTERVAL);
    set({ _intervalRef: id });
  };

  const stopPolling = () => {
    const state = get();
    if (state._intervalRef) {
      clearInterval(state._intervalRef);
      set({ _intervalRef: null });
    }
  };

  return {
    status: defaultStatus,
    isConnected: false,
    subscriberCount: 0,
    _intervalRef: null,

    // Components call subscribe() on mount, unsubscribe on unmount.
    // Polling starts with the first subscriber, stops when the last leaves.
    subscribe: () => {
      const count = get().subscriberCount + 1;
      set({ subscriberCount: count });
      if (count === 1) startPolling();

      return () => {
        const newCount = get().subscriberCount - 1;
        set({ subscriberCount: newCount });
        if (newCount <= 0) {
          stopPolling();
          set({ subscriberCount: 0 });
        }
      };
    },

    refresh: fetchData,
  };
});
