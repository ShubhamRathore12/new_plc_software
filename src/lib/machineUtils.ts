export type MachineType =
  | "gtpl"
  | "kabo"
  | "GTPL_108"
  | "GTPL_109"
  | "GTPL_110"
  | "GTPL_111"
  | "GTPL_112"
  | "GTPL_113"
  | "GTPL_114"
  | "GTPL_115"
  | "GTPL_116"
  | "GTPL_117"
  | "GTPL_119"
  | "GTPL_120"
  | "GTPL_121"
  | "GTPL_122_S7_1200"
  | "KABO_200"
  | "unknown";

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
  createdOnChanged?: boolean;
  createdAtChanged?: boolean;
  condFanOn?: boolean;
  machineName?: string;
}

export function getMachineSpecificResponse(
  machineName: string,
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

  let priority = "low";
  let responseType = "unknown_machine";

  if (machineName.startsWith("GTPL_122")) {
    priority = "high";
    responseType = "gtpl_machine";
  } else if (machineName.startsWith("GTPL_")) {
    priority = "medium";
    responseType = "gtpl_machine";
  } else if (machineName === "KABO_200") {
    priority = "medium";
    responseType = "kabo_machine";
  }

  return {
    ...base,
    machineType: machineName,
    priority,
    responseType,
  };
}
