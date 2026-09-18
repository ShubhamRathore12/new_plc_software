/**
 * One reader for the aeration screen's measurements.
 *
 * The process diagram and the summary panel used to resolve the same
 * measurement from two different candidate lists, so the same air temperature
 * could read TH 10.0 °C on the diagram and TH 0.0 °C in the summary (F-14).
 * Both now call this, so there is one value and one order of precedence.
 */

/** PLC tag names differ per machine, so every reading walks a candidate list. */
export function pickReading(data: any, keys: string[]): any {
  if (!data) return undefined;
  for (const key of keys) {
    const value = data[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

export function isTrueLikeFlag(value: any): boolean {
  if (!value) return false;
  const v = String(value).toLowerCase();
  return v === "true" || v === "tr" || v === "1" || v === "on";
}

export function toNumber(value: any): number {
  const n = parseFloat(value);
  return Number.isNaN(n) ? 0 : n;
}

const KEYS = {
  ambient: ["AMBIENT_AIR_TEMP_T2", "T2_temp_mean", "AI_AMBIANT_TEMP"],
  supply: ["AFTER_HEATER_TEMP_Th", "TH_temp_mean", "T0_temp_mean", "AI_TH_Act"],
  humidity: ["AI_RH_Analog_Scale", "RH_Analog_Scale", "RH"],
  blower: ["Value_to_Display_EVAP_ACT_SPEED", "Blower_speed", "BLOWER_RPM"],
  heater: ["Value_to_Display_HEATER", "Heater_speed", "HEATER"],
  continuous: ["CONTINUOUS_MODE", "Continuous_mode"],
  running: ["AERATION_WITHOUT_HEATER_START", "AERATION_WITH_HEATER_START", "Aeration_start"],
  durationSet: ["SET_DURATION", "Aeration_duration_set"],
  runningHours: ["RUNNING_HOUR1", "Running_time_hour"],
  runningMinutes: ["RUNNING_MINUTE1", "Running_time_minute"],
} as const;

export type AerationReadings = {
  ambient: any;
  supply: any;
  humidity: any;
  blower: any;
  heater: any;
  continuousMode: boolean;
  isRunning: boolean;
  /** Duration currently set on the PLC, in hours. */
  durationHours: number;
  runningHours: any;
  runningMinutes: any;
};

export function readAeration(data: any): AerationReadings {
  return {
    ambient: pickReading(data, [...KEYS.ambient]),
    supply: pickReading(data, [...KEYS.supply]),
    humidity: pickReading(data, [...KEYS.humidity]),
    blower: pickReading(data, [...KEYS.blower]),
    heater: pickReading(data, [...KEYS.heater]),
    continuousMode: isTrueLikeFlag(pickReading(data, [...KEYS.continuous])),
    isRunning: isTrueLikeFlag(pickReading(data, [...KEYS.running])),
    durationHours: toNumber(pickReading(data, [...KEYS.durationSet])),
    runningHours: pickReading(data, [...KEYS.runningHours]),
    runningMinutes: pickReading(data, [...KEYS.runningMinutes]),
  };
}

/**
 * A finite run needs a non-zero duration. Validated before the control is
 * enabled, rather than after the operator has submitted it.
 */
export function canStartAeration({
  continuousMode,
  durationHours,
  durationMinutes = 0,
}: {
  continuousMode: boolean;
  durationHours: number;
  durationMinutes?: number;
}): boolean {
  if (continuousMode) return true;
  return durationHours > 0 || durationMinutes > 0;
}
