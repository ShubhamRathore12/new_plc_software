// Utility functions for machine status checking

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

/**
 * Get machine status by device name
 * @param status - The machine status object from useMachineStatusFeed
 * @param deviceName - The device name to check status for
 * @param deviceNameToStatusKey - Mapping of device names to status keys
 * @returns The machine status object or undefined if not found
 */
export const getMachineStatus = (
  status: MachineStatus,
  deviceName: string,
  deviceNameToStatusKey: Record<string, string>
): { 
  machineStatus: boolean;
  internetStatus: boolean;
  coolingStatus: boolean;
  hasNewData: boolean;
} | undefined => {
  const statusKey = deviceNameToStatusKey[deviceName];
  if (!statusKey) {
    return undefined;
  }
  
  const deviceStatus = status.machines.find(
    (m: MachineDataEntry) => m.machineName === statusKey
  );
  
  return deviceStatus || undefined;
};

/**
 * Check if a machine is running
 * @param status - The machine status object from useMachineStatusFeed
 * @param deviceName - The device name to check
 * @param deviceNameToStatusKey - Mapping of device names to status keys
 * @returns True if machine is running, false otherwise
 */
export const isMachineRunning = (
  status: MachineStatus,
  deviceName: string,
  deviceNameToStatusKey: Record<string, string>
): boolean => {
  const machineStatus = getMachineStatus(status, deviceName, deviceNameToStatusKey);
  return machineStatus?.machineStatus ?? false;
};