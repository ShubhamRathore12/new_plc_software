export type MachineType = 'gtpl' | 'kabo' | 'unknown';

export interface MachineResponse {
  machineStatus: boolean;
  coolingStatus: boolean;
  internetStatus: boolean;
  machineType: string;
  priority: string;
  responseType: string;
  noNewData: boolean;
  recordId?: number;
  lastUpdate?: string;
  hasNewData?: boolean;
  idChanged?: boolean;
  createdOnChanged?:any;
  createdAtChanged?:any
}

export function hasTimestampChanged(newTimestamp: any, lastTimestamp: any): boolean {
  if (!lastTimestamp) return true;
  return new Date(newTimestamp).getTime() !== new Date(lastTimestamp).getTime();
}

export function hasIdChanged(currentId: number | undefined, previousId: number | null): boolean {
  // If we don't have a current ID, no change
  if (currentId === undefined) return false;
  
  // If this is the first run (no previous ID), consider it as new data
  if (previousId === null) return true;
  
  // Compare current ID with previous ID
  return currentId !== previousId;
}

export function getMachineSpecificResponse(
  machineType: MachineType,
  timestamp: string | Date,
  currentTime: Date,
  hasNewData: boolean
): MachineResponse {
  const timestampDate = new Date(timestamp);
  const fiveMinutesAgo = new Date(currentTime.getTime() - 5 * 60 * 1000);
  const oneMinuteAgo = new Date(currentTime.getTime() - 60 * 1000);
  const thirtySecondsAgo = new Date(currentTime.getTime() - 30 * 1000);

  const base = {
    machineStatus: timestampDate > fiveMinutesAgo,
    coolingStatus: timestampDate > oneMinuteAgo,
    internetStatus: timestampDate > thirtySecondsAgo,
    noNewData: !hasNewData,
  };

  switch (machineType) {
    case 'gtpl':
      return {
        ...base,
        machineType: 'GTPL_122_S7_1200_01',
        priority: 'high',
        responseType: 'gtpl_machine',
      };
    case 'kabo':
      return {
        ...base,
        machineType: 'KABO_MACHINE_SMART200',
        priority: 'medium',
        responseType: 'kabo_machine',
      };
    default:
      return {
        ...base,
        machineType: 'UNKNOWN',
        priority: 'low',
        responseType: 'unknown_machine',
      };
  }
}