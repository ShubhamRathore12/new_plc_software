import { machine } from "os";
import { getFaultColumnsFromSchema } from "@/lib/dbSchema";
import { getActiveFaultColumns, isActiveTag as isActiveFault } from "@/lib/faultConfig";

export const PAGE_SIZE = 200;

export interface TagData {
  tag: string;
  value: boolean | string | number | null | undefined;
  createdAt: string;
  created_at?: string;
}

export interface Stats {
  total: number;
  activeTags: number;
  faultTags: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginationInfo {
  total: number;
  totalPages: number;
  limit: number;
  page: number;
}

// ===== TAG LISTS =====
export const S7_200_TAGS = [
  "AFTER_HEAT_TEMP_MORE_THAN_50",
  "AFTER_HEAT_TEMP_SENSOR_TH_OPEN",
  "AFTER_HEAT_TEMP_SENSOR_TH_SHORT_CIRCUIT",
  "AIR_OUTLET_TEMP_SENSOR_T0_OPEN",
  "AIR_OUTLET_TEMP_SENSOR_T0_SHORT_CIRCUIT",
  "AMBIENT_TEMP_LESS_THAN_4",
  "AMBIENT_TEMP_LOW_THAN_SET_TEMP",
  "AMBIENT_TEMP_OVER_40",
  "AMBIENT_TEMP_OVER_43",
  "AMBIENT_TEMP_SENSOR_T2_OPEN",
  "AMBIENT_TEMP_SENSOR_T2_SHORT_CIRCUIT",
  "ANTI_FREEZE_PROTECTION",
  "BLOWER_CIRCUIT_BREAKER_FAULT",
  "BLOWER_DRIVE_FAULT",
  "C0ND_FAN_TOP",
  "COLD_AIR_TEMP_SENSOR_T1_OPEN",
  "COLD_AIR_TEMP_SENSOR_T1_SHORT_CIRCUIT",
  "COMPRESSOR_CIRCUIT_BREA_FAULT",
  "COND_FAN_CIRCUIT_BREAKE_FAULT",
  "CONDENSER_FAN_DOOR_OPEN",
  "HEATER_CIRCUIT_BREAKER_FAULT",
  "HEATER_RCCCB_TRIP_FAULT",
  "HEATER_TOP_FAULT",
  "HIGH_PRESSURE_FAULT",
  "HIGH_PRESSURE_FAULT_LOCKED",
  "HP_TRANSDUCEER_FAILURE",
  "LOW_PRESSURE_FAULT",
  "LOW_PRESSURE_FAULT_LOCKED",
  "LP_TRANSDUCER_FAILURE",
  "SET_POINT_NOT_ACHIEVED_IN_AERATION_MODE",
  "THREE_PHASE_MONITORING_FAULT",
];

export const S7_1200_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Oil_pressure_low",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Ambient_air_sensor_1open",
  "COND_FAN_OVERLOAD",
  "Three_phase_monitor_fault",
  "High_pressure_fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_over_50C",
  "COMP_MODULE_FEEDBACK_ERROR_Si_I1",
  "Low_pressure_1_fault",
  "COMP_FBK_ERROR",
  "Low_pressure_2_fault",
  "Ambient_temp_over_47C",
  "Condenser_fan_2_TOP_fault",
  "Condenser_fan_3_TOP_fault",
  "Condenser_fan_4_TOP_fault",
  "Condenser_fan_2_circuit_breaker_fault",
  "Condenser_fan_3_circuit_breaker_fault",
  "Condenser_fan_4_circuit_breaker_fault",
  "Condenser_fan_5_TOP_fault",
  "Condenser_fan_6_TOP_fault",
  "Condenser_fan_5_circuit_breaker_fault",
  "Condenser_fan_6_circuit_breaker_fault",
  "Condenser_fan_1_circuit_breaker_fault",
  "Condenser_fan_1_TOP_fault",
  "Ambient_air_sensor_1_short_circuit",
  "Ambient_air_sensor_2_open",
  "Ambient_air_sensor_2_short_circuit",
  "Cold_air_sensor_1_open",
  "Cold_air_sensor_1_short_circuit",
  "Cold_air_sensor_2_open",
  "Cold_air_sensor_2_short_circuit",
  "Air_outlet_sensor_1_open",
  "Air_outlet_sensor_1_short_circuit",
  "Air_outlet_sensor_2_open",
  "Air_outlet_sensor_2_short_circuit",
];

export const GPL_115_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Condenser_fan_door_open",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Three_phase_monitor_fault",
  "Low_Pressure_Fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_Over_43C",
  "Compressor_motor_overheat",
  "Low_pressure_fault_Locked",
  "High_pressure_fault_Locked",
  "Ambient_temp_Over_40C",
  "Ambient_temp_Less_than_4C",
  "Cond_Fan_circuit_breaker_fault",
  "Cond_Fan_drive_fault",
  "Cond_Fan_TOP",
  "Ambient_Temp_Sensor_T2_1_Open",
  "Ambient_Temp_Sensor_T2_1_Short_Circuit",
  "Ambient_Temp_Sensor_T2_2_Open",
  "Ambient_Temp_Sensor_T2_2_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_1_Open",
  "Air_Outlet_Temp_Sensor_T0_1_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_2_Open",
  "Air_Outlet_Temp_Sensor_T0_2_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_1_Open",
  "Cold_Air_Temp_Sensor_T1_1_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_2_Open",
  "Cold_Air_Temp_Sensor_T1_2_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_1_Open",
  "Air_After_Heater_Temp_Sensor_TH_1_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_2_Open",
  "Air_After_Heater_Temp_Sensor_TH_2_Short_Circuit",
  "High_Pressure_Fault",
  "Heater_TOP_fault",
  "Heater_drive_Fault",
  "Heater_circuit_breaker_fault",
  "Heater_RCCB_fault",
  "Anti_Freeze_Protection",
  "TH_Temp_more_than_50C",
  "Delta_not_achieved_in_aeration_mode",
  "Warning_LP_transducer_failure",
  "Warning_HP_transducer_failure",
];

export const GPL_117_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Cond_fan1_circuit_breaker_fault_I2_2",
  "Condenser_fan1_door_open",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Heater_circuit_breaker_fault",
  "Three_phase_monitor_fault",
  "Low_Pressure_Fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_Over_43C",
  "Compressor_motor_overheat",
  "Heater_RCCB_fault",
  "Cond_Fan2_circuit_breaker_fault",
  "Low_pressure_fault_Locked",
  "Anti_Freeze_Protection",
  "High_pressure_fault_Locked",
  "Ambient_temp_Over_40C",
  "Ambient_temp_Less_than_4C",
  "Cond_Fan_1_TOP",
  "Cond_Fan1_circuit_breaker_fault",
  "Cond_Fan_drive_fault",
  "Cond_Fan_2_TOP",
  "Ambient_Temp_Sensor_T2_1_Open",
  "Ambient_Temp_Sensor_T2_1_Short_Circuit",
  "Ambient_Temp_Sensor_T2_2_Open",
  "Ambient_Temp_Sensor_T2_2_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_1_Open",
  "Air_Outlet_Temp_Sensor_T0_1_Short_Circuit",
  "Air_Outlet_Temp_Sensor_T0_2_Open",
  "Air_Outlet_Temp_Sensor_T0_2_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_1_Open",
  "Cold_Air_Temp_Sensor_T1_1_Short_Circuit",
  "Cold_Air_Temp_Sensor_T1_2_Open",
  "Cold_Air_Temp_Sensor_T1_2_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_1_Open",
  "Air_After_Heater_Temp_Sensor_TH_1_Short_Circuit",
  "Air_After_Heater_Temp_Sensor_TH_2_Open",
  "Air_After_Heater_Temp_Sensor_TH_2_Short_Circuit",
  "High_Pressure_Fault",
  "Comp_Oil_Low",
  "Heater_TOP_fault",
  "Heater_drive_Fault",
  "Condenser_fan2_door_open",
  "TH_Temp_more_than_50C",
  "Delta_not_achieved_in_aeration_mode",
  "Warning_LP_transducer_failure",
  "Warning_HP_transducer_failure",
];

export const GTPL_30_TAGS = [
  // same as in your source
  ...GPL_115_TAGS,
];

export const GPL_132_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Oil_pressure_low",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Three_phase_monitor_fault",
  "High_pressure_fault",
  "Ambient_temp_lower_than_set_temp.",
  "Ambient_temp_over_45°C",
  "Compressor_module_feedback_error",
  "Low_pressure_1_fault",
  "Compressor_feedback_error",
  "Low_pressure_2_fault",
  "Ambient_temp_over_43°C",
  "Condenser_fan_2_TOP_fault",
  "Condenser_fan_2_circuit_breaker_fault",
  "Condenser_fan_1_circuit_breaker_fault",
  "Condenser_fan_1_TOP_fault",
  "Ambient_air_sensor_T2_1_open",
  "Ambient_air_sensor_T2_1_short_circuit",
  "Ambient_air_sensor_T2_2_open",
  "Ambient_air_sensor_T2_2_short_circuit",
  "Cold_air_sensor_T1_1_open",
  "Cold_air_sensor_T1_1_short_circuit",
  "Cold air sensor T1_2 open",
  "Cold_air_sensor_T1_2_short_circuit",
  "Air_outlet_sensor_T0_1_open",
  "Air_outlet_sensor_T0_1_short_circuit",
  "Air_outlet_sensor_T0_2_open",
  "Air_outlet_sensor_T0_2_short_circuit",
];

export const GTPL_136_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Oil_pressure_low",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Three_phase_monitor_fault",
  "High_pressure_fault",
  "Ambient_temp_lower_than_set_temp",
  "Ambient_temp_over_43C",
  "Compressor_motor_winding_temp_high",
  "Low_pressure_1_fault",
  "Compressor_feedback_error",
  "Low_pressure_2_fault",
  "Ambient_temp_over_40C",
  "Condenser_fan2_TOP_fault",
  "Condenser_fan3_TOP_fault",
  "Condenser_fan4_TOP_fault",
  "Condenser_fan2_circuit_breaker_fault",
  "Condenser_fan3_circuit_breaker_fault",
  "Condenser_fan4_circuit_breaker_fault",
  "Condenser_fan1_circuit_breaker_fault",
  "Condenser_fan1_TOP_fault",
  "Ambient_air_sensor_T2_1_open",
  "Ambient_air_sensor_T2_1_short_circuit",
  "Ambient_air_sensor_T2_2_open",
  "Ambient_air_sensor_T2_2_short_circuit",
  "Cold_air_sensor_T1_1_open",
  "Cold_air_sensor_T1_1_short_circuit",
  "Cold_air_sensor_T1_2_open",
  "Cold_air_sensor_T1_2_short_circuit",
  "Air_outlet_sensor_T0_1_open",
  "Air_outlet_sensor_T0_1_short_circuit",
  "Air_outlet_sensor_T0_2_open",
  "Air_outlet_sensor_T0_2_short_circuit",
];

export const GTPL_134_135_TAGS = [
  "Compressor_circuit_breaker_fault",
  "Oil_pressure_low",
  "Blower_drive_fault",
  "Blower_circuit_breaker_fault",
  "Three_phase_monitor_fault",
  "High_pressure_fault",
  "Ambient_temp_below_set",
  "Ambient_temp_above_45",
  "Compressor_motor_temp_high",
  "Low_pressure_1_fault",
  "Compressor_feedback_error",
  "Low_pressure_2_fault",
  "Ambient_temp_above_43",
  "Cond_fan2_TOP_fault",
  "Cond_fan3_TOP_fault",
  "Cond_fan4_TOP_fault",
  "Cond_fan2_cb_fault",
  "Cond_fan3_cb_fault",
  "Cond_fan4_cb_fault",
  "Cond_fan1_cb_fault",
  "Cond_fan1_TOP_fault",
  "T2_1_sensor_open",
  "T2_1_sensor_short",
  "T2_2_sensor_open",
  "T2_2_sensor_short",
  "T1_1_sensor_open",
  "T1_1_sensor_short",
  "T1_2_sensor_open",
  "T1_2_sensor_short",
  "T0_1_sensor_open",
  "T0_1_sensor_short",
  "T0_2_sensor_open",
  "T0_2_sensor_short",
  "Tdelta_sensor_open",
  "Tdelta_sensor_short",
];

// 650T machines (GTPL_154/155 table structure) — fault columns are PLC input bits
export const GTPL_650T_TAGS = [
  "Compressor_circuit_breaker_I0_0",
  "Comp_module_fdk_error_I0_1",
  "Oil_level_I0_3",
  "Blower_drive_I0_4",
  "Blower_circuit_breaker_I0_6",
  "Cond_fan_1_TOP_I0_7",
  "Cond_fan_1_circuit_breaker_I1_0",
  "Low_pressure_fault_I1_1",
  "Compressor_OLR_trip_I1_2",
  "High_pressure_fault_I1_3",
  "Three_phase_monitoring_fault_I2_0",
  "Cond_fan_2_TOP_I2_2",
  "Cond_fan_3_TOP_I2_3",
  "Cond_fan_4_TOP_I2_4",
  "Cond_fan_2_circuit_breaker_I2_5",
  "Cond_fan_3_circuit_breaker_I2_6",
  "Cond_fan_4_circuit_breaker_I2_7",
  "Cond_fan_5_TOP_I3_0",
  "Cond_fan_6_TOP_I3_1",
  "Cond_fan_5_circuit_breaker_I3_2",
  "Cond_fan_6_circuit_breaker_I3_3",
];

export const S7_200_MACHINES = [
  "GTPL-118-gT-60T-S7-200",
  "GTPL-108-gT-40E-P-S7-200",
  "GTPL-109-gT-40E-P-S7-200",
  "GTPL-110-gT-40E-P-S7-200",
  "GTPL-111-gT-80E-P-S7-200",
  "GTPL-112-gT-80E-P-S7-200",
  "GTPL-113-gT-80E-P-S7-200",
];

export function getTagsForMachine(machineName: string): string[] {
  // Prefer exact DB column names from the schema (in schema order) when
  // available — these match the real fault columns after FAULT_CODE.
  const fromSchema = getFaultColumnsFromSchema(machineName);
  if (fromSchema && fromSchema.length) return fromSchema;

  if (machineName === "GTPL-30-gT-180E-S7-1200") return GTPL_30_TAGS;
  if (
    machineName === "GTPL-115-gT-180E-P-S7-1200" ||
    machineName === "GTPL-114-gT-140E-P-S7-1200" ||
    machineName === "GTPL-119-gT-180E-S7-1200 " ||
    machineName === "GTPL-120-gT-180E-P-S7-1200"
  )
    return GPL_115_TAGS;
  if (
    machineName === "GTPL-117-gT-320E-S7-1200" ||
    machineName === "GTPL-116-gT-320E-S7-1200"
  )
    return GPL_117_TAGS;
  if (machineName === "GTPL-132-300-AP-S7-1200") return GPL_132_TAGS;
  if (machineName === "GTPL-136-gT-450AP") return GTPL_136_TAGS;
  if (machineName === "GTPL-134-gT-450T-S7-1200") return GTPL_134_135_TAGS;
  if (machineName === "GTPL-135-gT-450T-S7-1200") return GTPL_134_135_TAGS;
  if (machineName === "GTPL-145-gT-450T-S7-1200") return GTPL_134_135_TAGS;
  if (machineName === "GTPL-148-gT-450T-S7-1200") return GTPL_134_135_TAGS;
  // 300AP machines share the GTPL_132 (300AP) fault column set
  if (
    machineName === "GTPL-144-gT-300AP-S7-1200" ||
    machineName === "GTPL-139-gT-300AP-S7-1200" ||
    machineName === "GTPL-140-gT-300AP-S7-1200"
  )
    return GPL_132_TAGS;
  // 650T family shares the GTPL_154/155 input-bit fault columns
  if (
    machineName === "GTPL-154-gT-650T-S7-1200" ||
    machineName === "GTPL-155-gT-650T-S7-1200" ||
    machineName === "GTPL-133-gT-650T-S7-1200" ||
    machineName === "GTPL-131-gT-650T-S7-1200" ||
    machineName === "GTPL-081-gT-650T-S7-1200" ||
    machineName === "GTPL-105-gT-650T-S7-1200" ||
    machineName === "GTPL-068-gT-650T-S7-1200" ||
    machineName === "GTPL-104-gT-650T-S7-1200"
  )
    return GTPL_650T_TAGS;
  if (S7_200_MACHINES.includes(machineName)) return S7_200_TAGS;
  return S7_1200_TAGS;
}

export function extractTagDataFromRecords(
  dataArray: any[],
  machineName: string
): TagData[] {
  if (!Array.isArray(dataArray) || dataArray.length === 0) return [];
  
  // Use fault columns from the machine configuration (from database schema)
  const faultColumns = getActiveFaultColumns(machineName);
  const tags = faultColumns.length > 0 ? faultColumns : getTagsForMachine(machineName);
  
  const tagData: TagData[] = [];

  for (const record of dataArray) {
    if (!record || typeof record !== "object") continue;
    const timestamp =
      record.created_at ||
      record.createdAt ||
      record.created_on ||
      record.timestamp ||
      record.updated_at ||
      new Date().toISOString();

    // Normalized index of this record's real keys -> lets us match tags
    // regardless of case, punctuation, degree symbols, etc.
    const normIndex = buildNormalizedIndex(record as Record<string, any>);

    for (const tag of tags) {
      const value = getRecordValueForTag(record as any, tag, normIndex);
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        isTrueLike(value)
      ) {
        tagData.push({ tag, value, createdAt: timestamp });
      }
    }
  }

  return collapseRepeatsByWindow(tagData);
}

// Same fault logged every ~6s in DB. Collapse repeats of the same tag to one
// entry per DEDUP_WINDOW_MS (2 min). Keeps the newest occurrence in each window.
const DEDUP_WINDOW_MS = 2 * 60 * 1000;

function collapseRepeatsByWindow(entries: TagData[]): TagData[] {
  const parseTime = (v?: string) => {
    const t = v ? new Date(v).getTime() : NaN;
    return Number.isNaN(t) ? 0 : t;
  };

  // Sort each tag's entries newest-first, keep one per 2-min window.
  const byTag = new Map<string, TagData[]>();
  for (const e of entries) {
    const list = byTag.get(e.tag);
    if (list) list.push(e);
    else byTag.set(e.tag, [e]);
  }

  const kept = new Set<TagData>();
  for (const list of byTag.values()) {
    list.sort((a, b) => parseTime(b.createdAt) - parseTime(a.createdAt));
    let lastKept = Infinity;
    for (const e of list) {
      const t = parseTime(e.createdAt);
      if (lastKept - t >= DEDUP_WINDOW_MS || lastKept === Infinity) {
        kept.add(e);
        lastKept = t;
      }
    }
  }

  // Preserve original ordering of the incoming records.
  return entries.filter((e) => kept.has(e));
}

// Collapse a key to a comparable form: lowercase, alphanumerics only.
// "Ambient_temp_over_45°C" and "ambient temp over 45 c" both -> "ambienttempover45c"
export function normalizeKey(k: string): string {
  return k.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// normalized-key -> real record key
function buildNormalizedIndex(record: Record<string, any>): Record<string, string> {
  const idx: Record<string, string> = {};
  for (const realKey of Object.keys(record)) {
    const n = normalizeKey(realKey);
    if (!(n in idx)) idx[n] = realKey;
  }
  return idx;
}

// Try to resolve DB field names that may not match tag text exactly
function getRecordValueForTag(
  record: Record<string, any>,
  tag: string,
  normIndex?: Record<string, string>
) {
  const candidates = generateTagKeyCandidates(tag);
  // 1) exact key hits
  for (const key of candidates) {
    if (key in record) return record[key];
  }
  // 2) normalized (case/punctuation-insensitive) hits
  if (normIndex) {
    for (const key of candidates) {
      const real = normIndex[normalizeKey(key)];
      if (real !== undefined) return record[real];
    }
  }
  return undefined;
}

function generateTagKeyCandidates(tag: string): string[] {
  const originals: string[] = [tag];

  // Normalize spaces to underscores and collapse repeats
  const underscore = tag.replace(/\s+/g, "_");
  originals.push(underscore);

  // Remove degree symbol and variants of C
  const noDegree = underscore.replace(/[°º]/g, "");
  const cVariants = [noDegree.replace(/C/g, "C"), noDegree.replace(/C/g, "")];

  // Replace dots with underscores and strip trailing punctuation
  const dotToUnderscore = cVariants.map((t) =>
    t.replace(/[.]/g, "_").replace(/[_,.]+$/g, "")
  );

  // Ensure only [A-Za-z0-9_] and collapse multiple underscores
  const cleaned = dotToUnderscore.concat(originals).map((t) =>
    t
      .replace(/[^A-Za-z0-9_]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
  );

  // Lowercase and original case variants
  const withCase = Array.from(
    new Set(
      cleaned
        .concat(cleaned.map((t) => t.toLowerCase()))
        .concat(cleaned.map((t) => t.toUpperCase()))
    )
  );

  // Also try removing stray trailing characters like a final underscore
  const trimmed = withCase.map((t) => t.replace(/_+$/g, ""));

  // Deduplicate while preserving order
  const seen = new Set<string>();
  const result: string[] = [];
  for (const k of [tag, ...originals, ...cleaned, ...withCase, ...trimmed]) {
    if (!seen.has(k)) {
      seen.add(k);
      result.push(k);
    }
  }
  return result;
}

export function formatTagName(tag: string): string {
  return tag
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function getTagCategory(tag: string): "fault" {
  // can be extended later; currently everything is fault
  return "fault";
}

export function getTableNameForMachine(machineName: string): string {
  if (machineName === "GTPL-30-gT-180E-S7-1200") return "gplt_144";
  if (machineName === "GTPL-139-gT-300AP-S7-1200") return "GTPL_139_GT300AP";
  return "default_table";
}

export function getMachinePrefix(machineName: string): string {
  return machineName.split("-")[0];
}

// Helpers
export function isTrueLike(value: unknown): boolean {
  if (typeof value === "boolean") return value === true;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    return v === "true" || v === "tr" || v === "1" || v === "yes" || v === "on";
  }
  return false;
}
