/**
 * CENTRALIZED MACHINE REGISTRY
 * =============================
 * Single source of truth for ALL machine data.
 * When adding a new machine, ONLY add an entry here.
 * All other files derive their data from this registry.
 */

import {
  S7_200_TAGS,
  S7_1200_TAGS,
  GPL_115_TAGS,
  GPL_117_TAGS,
  GPL_124_TAGS,
  GPL_132_TAGS,
  GTPL_137_TAGS,
  GTPL_138_TAGS,
  GTPL_145_TAGS,
  GTPL_148_TAGS,
  GTPL_134_135_TAGS,
  GTPL_139_TAGS,
  GTPL_137_OUTPUT_TAGS,
  GTPL_138_OUTPUT_TAGS,
  GTPL_145_OUTPUT_TAGS,
  GTPL_148_OUTPUT_TAGS,
} from "./machineConfig";

// ─── Types ──────────────────────────────────────────────

export interface MachineEntry {
  /** Display name / route key, e.g. "GTPL-137-GT-450T-S7-1200" */
  name: string;
  /** Database table name, e.g. "GTPL_137_GT_450T_S7_1200" */
  table: string;
  /** Status key used in status-public API, e.g. "GTPL_137" */
  statusKey: string;
  /** PLC type */
  type: "S7-200" | "S7-1200";
  /** Fault/input tag array */
  tags: string[];
  /** Output tag array (optional, pin-based machines) */
  outputTags?: string[];
  /** Device location for devices page */
  location: string;
  /** Device image path */
  image: string;
  /** Chiller model for devices page */
  chillerModel: string;

  // ─── Feature flags (used by AutoDiagram1, auto pages, etc.) ───
  /** Uses bar instead of psi for pressure display */
  isBarMachine?: boolean;
  /** Shows in the "special machine" list in AutoDiagram1 */
  isSpecialMachine?: boolean;
  /** Has HTR (heater) capability */
  isHTRMachine?: boolean;
  /** Has fan-specific rendering */
  isFanMachine?: boolean;
  /** Has CR valve outputs */
  hasCRValve?: boolean;
  /** Redirects to aeration-without-heating (no heating option) */
  aerationWithoutHeatingOnly?: boolean;
  /** Uses T0/TH labels instead of T0/T1 for aeration */
  usesT0THLabels?: boolean;
  /** Is a grain/paddy AP machine (shows grain+paddy menu instead of auto) */
  isGrainPaddyDevice?: boolean;
  /** Hides the aeration menu item */
  hideAeration?: boolean;
  /** Hides the "Delta A" setting in defaults */
  hideDeltaA?: boolean;
}

// ─── Machine Registry ───────────────────────────────────

export const MACHINE_REGISTRY: MachineEntry[] = [
  // ─── S7-200 Machines ───
  {
    name: "GTPL-118-gT-80E-P-S7-200",
    table: "kabomachinedatasmart200",
    statusKey: "KABO_200",
    type: "S7-200",
    tags: S7_200_TAGS,
    location: "Noida",
    image: "/images/200.jpg",
    chillerModel: "gT-80E-P",
    isHTRMachine: true,
  },
  {
    name: "GTPL-108-gT-40E-P-S7-200",
    table: "GTPL_108_gT_40E_P_S7_200_Germany",
    statusKey: "GTPL_108",
    type: "S7-200",
    tags: S7_200_TAGS,
    location: "Germany",
    image: "/images/200.jpg",
    chillerModel: "gT-40E-P",
    isHTRMachine: true,
  },
  {
    name: "GTPL-109-gT-40E-P-S7-200",
    table: "GTPL_109_gT_40E_P_S7_200_Germany",
    statusKey: "GTPL_109",
    type: "S7-200",
    tags: S7_200_TAGS,
    location: "Germany",
    image: "/images/200.jpg",
    chillerModel: "gT-40E-P",
    isHTRMachine: true,
  },
  {
    name: "GTPL-110-gT-40E-P-S7-200",
    table: "GTPL_110_gT_40E_P_S7_200_Germany",
    statusKey: "GTPL_110",
    type: "S7-200",
    tags: S7_200_TAGS,
    location: "Germany",
    image: "/images/200.jpg",
    chillerModel: "gT-40E-P",
    isHTRMachine: true,
  },
  {
    name: "GTPL-111-gT-80E-P-S7-200",
    table: "GTPL_111_gT_80E_P_S7_200_Germany",
    statusKey: "GTPL_111",
    type: "S7-200",
    tags: S7_200_TAGS,
    location: "Germany",
    image: "/images/200.jpg",
    chillerModel: "gT-80E-P",
    isHTRMachine: true,
  },
  {
    name: "GTPL-112-gT-80E-P-S7-200",
    table: "GTPL_112_gT_80E_P_S7_200_Germany",
    statusKey: "GTPL_112",
    type: "S7-200",
    tags: S7_200_TAGS,
    location: "Germany",
    image: "/images/200.jpg",
    chillerModel: "gT-80E-P",
    isHTRMachine: true,
  },
  {
    name: "GTPL-113-gT-80E-P-S7-200",
    table: "GTPL_113_gT_80E_P_S7_200_Germany",
    statusKey: "GTPL_113",
    type: "S7-200",
    tags: S7_200_TAGS,
    location: "Germany",
    image: "/images/200.jpg",
    chillerModel: "gT-80E-P",
    isHTRMachine: true,
  },

  // ─── S7-1200 Machines ───
  {
    name: "GTPL-122-gT-1000T-S7-1200",
    table: "gtpl_122_s7_1200_01",
    statusKey: "GTPL_122_S7_1200",
    type: "S7-1200",
    tags: S7_1200_TAGS,
    location: "kanpur",
    image: "/images/1200.jpg",
    chillerModel: "gT-1000T",
    isSpecialMachine: true,
    isHTRMachine: true,
    isFanMachine: true,
    hasCRValve: true,
    aerationWithoutHeatingOnly: true,
    usesT0THLabels: true,
  },
  {
    name: "Gtpl-S7-1200-02",
    table: "gtpl_122_s7_1200_01",
    statusKey: "gtpl_1200_02",
    type: "S7-1200",
    tags: S7_1200_TAGS,
    location: "kanpur",
    image: "/images/1200.jpg",
    chillerModel: "gT-1000T",
  },
  {
    name: "GTPL-30-gT-180E-S7-1200",
    table: "GTPL_114_GT_140E_S7_1200",
    statusKey: "GTPL_114",
    type: "S7-1200",
    tags: GPL_115_TAGS,
    location: "Germany",
    image: "/images/1200.jpg",
    chillerModel: "gT-140E",
    isSpecialMachine: true,
    isHTRMachine: false,
    hideDeltaA: true,
  },
  {
    name: "GTPL-115-gT-180E-S7-1200",
    table: "GTPL_115_GT_180E_S7_1200",
    statusKey: "GTPL_115",
    type: "S7-1200",
    tags: GPL_115_TAGS,
    location: "Germany",
    image: "/images/1200.jpg",
    chillerModel: "gT-180E",
    isSpecialMachine: true,
    hideDeltaA: true,
  },
  {
    name: "GTPL-116-gT-240E-S7-1200",
    table: "GTPL_116_GT_240E_S7_1200",
    statusKey: "GTPL_116",
    type: "S7-1200",
    tags: S7_1200_TAGS,
    location: "Germany",
    image: "/images/1200.jpg",
    chillerModel: "gT-240E",
    isSpecialMachine: true,
    isFanMachine: true,
    hideDeltaA: true,
  },
  {
    name: "GTPL-117-gT-320E-S7-1200",
    table: "GTPL_117_GT_320E_S7_1200",
    statusKey: "GTPL_117",
    type: "S7-1200",
    tags: GPL_117_TAGS,
    location: "Germany",
    image: "/images/1200.jpg",
    chillerModel: "gT-320E",
    isSpecialMachine: true,
    isFanMachine: true,
    hideDeltaA: true,
  },
  {
    name: "GTPL-119-gT-180E-S7-1200",
    table: "GTPL_119_GT_180E_S7_1200",
    statusKey: "GTPL_119",
    type: "S7-1200",
    tags: S7_1200_TAGS,
    location: "Germany",
    image: "/images/1200.jpg",
    chillerModel: "gT-180E",
    isSpecialMachine: true,
    hideDeltaA: true,
  },
  {
    name: "GTPL-120-gT-180E-S7-1200",
    table: "GTPL_120_GT_180E_S7_1200",
    statusKey: "GTPL_120",
    type: "S7-1200",
    tags: S7_1200_TAGS,
    location: "Germany",
    image: "/images/1200.jpg",
    chillerModel: "gT-180E",
    isSpecialMachine: true,
    hideDeltaA: true,
  },
  {
    name: "GTPL-121-gT-1000T-S7-1200",
    table: "GTPL_121_GT1000T",
    statusKey: "GTPL_121",
    type: "S7-1200",
    tags: S7_1200_TAGS,
    location: "kanpur",
    image: "/images/1200.jpg",
    chillerModel: "gT-1000T",
    isSpecialMachine: true,
    isHTRMachine: true,
    isFanMachine: true,
    hasCRValve: true,
    usesT0THLabels: true,
  },
  {
    name: "GTPL-124-GT-450T-S7-1200",
    table: "GTPL_124_GT_450T_S7_1200",
    statusKey: "GTPL_124",
    type: "S7-1200",
    tags: GPL_124_TAGS,
    location: "Indonesia",
    image: "/images/1200.jpg",
    chillerModel: "gT-240E",
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    aerationWithoutHeatingOnly: true,
    usesT0THLabels: true,
  },
  {
    name: "GTPL-133-GT-650T-S7-1200",
    table: "GTPL_133_GT_650T_S7_1200",
    statusKey: "GTPL_131",
    type: "S7-1200",
    tags: GPL_124_TAGS,
    location: "Noida",
    image: "/images/1200.jpg",
    chillerModel: "gT-240E",
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    aerationWithoutHeatingOnly: true,
  },
  {
    name: "GTPL-132-300-AP-S7-1200",
    table: "GTPL_132_GT300AP",
    statusKey: "GTPL_132",
    type: "S7-1200",
    tags: GPL_132_TAGS,
    location: "Salem (Tamil Nadu)",
    image: "/images/1200.jpg",
    chillerModel: "gT-240E",
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    aerationWithoutHeatingOnly: true,
    usesT0THLabels: true,
    isGrainPaddyDevice: true,
  },
  {
    name: "GTPL-137-GT-450T-S7-1200",
    table: "GTPL_137_GT_450T_S7_1200",
    statusKey: "GTPL_137",
    type: "S7-1200",
    tags: GTPL_137_TAGS,
    outputTags: GTPL_137_OUTPUT_TAGS,
    location: "Thailand",
    image: "/images/1200.jpg",
    chillerModel: "gT-240E",
    isBarMachine: true,
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: false,
    aerationWithoutHeatingOnly: true,
    usesT0THLabels: true,
  },
  {
    name: "GTPL-138-GT-450T-S7-1200",
    table: "GTPL_138_GT_450T_S7_1200",
    statusKey: "GTPL_138",
    type: "S7-1200",
    tags: GTPL_138_TAGS,
    outputTags: GTPL_138_OUTPUT_TAGS,
    location: "Thailand",
    image: "/images/1200.jpg",
    chillerModel: "gT-240E",
    isBarMachine: true,
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: false,
    aerationWithoutHeatingOnly: true,
    usesT0THLabels: true,
  },
  {
    name: "GTPL-145-GT-450T-S7-1200",
    table: "GTPL_145_GT_450T_S7_1200",
    statusKey: "GTPL_145",
    type: "S7-1200",
    tags: GTPL_145_TAGS,
    outputTags: GTPL_145_OUTPUT_TAGS,
    location: "India",
    image: "/images/1200.jpg",
    chillerModel: "gT-450T",
    isBarMachine: true,
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    aerationWithoutHeatingOnly: true,
    usesT0THLabels: true,
  },
  {
    name: "GTPL-148-GT-450T-S7-1200",
    table: "GTPL_148_GT_450T_S7_1200",
    statusKey: "GTPL_148",
    type: "S7-1200",
    tags: GTPL_148_TAGS,
    outputTags: GTPL_148_OUTPUT_TAGS,
    location: "India",
    image: "/images/1200.jpg",
    chillerModel: "gT-450T",
    isBarMachine: true,
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    aerationWithoutHeatingOnly: true,
    usesT0THLabels: true,
  },
  {
    name: "GTPL-134-gT-450T-S7-1200",
    table: "GTPL_134_GT_450T_S7_1200",
    statusKey: "GTPL_134",
    type: "S7-1200",
    tags: GTPL_134_135_TAGS,
    location: "Kakinda (AP)",
    image: "/images/1200.jpg",
    chillerModel: "gT-450T",
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    aerationWithoutHeatingOnly: true,
    usesT0THLabels: true,
  },
  {
    name: "GTPL-135-gT-450T-S7-1200",
    table: "GTPL_135_GT_450T_S7_1200",
    statusKey: "GTPL_135",
    type: "S7-1200",
    tags: GTPL_134_135_TAGS,
    location: "Noida",
    image: "/images/1200.jpg",
    chillerModel: "gT-450T",
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    aerationWithoutHeatingOnly: true,
    usesT0THLabels: true,
  },
  {
    name: "GTPL-061-gT-450T-S7-1200",
    table: "GTPL_061_GT_450T_S7_1200",
    statusKey: "GTPL_061",
    type: "S7-1200",
    tags: GTPL_134_135_TAGS,
    location: "Turkey",
    image: "/images/1200.jpg",
    chillerModel: "gT-450T",
    isSpecialMachine: true,
    isHTRMachine: true,
    hideAeration: true,
  },
  {
    name: "GTPL-136-gT-450AP",
    table: "GTPL_136_GT_450AP_S7_1200",
    statusKey: "GTPL_136",
    type: "S7-1200",
    tags: GPL_132_TAGS,
    location: "Srilanka",
    image: "/images/1200.jpg",
    chillerModel: "gT-450AP",
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    aerationWithoutHeatingOnly: true,
    usesT0THLabels: true,
    isGrainPaddyDevice: true,
  },
  {
    name: "GTPL-139-GT-300AP-S7-1200",
    table: "GTPL_139_GT300AP",
    statusKey: "GTPL_139",
    type: "S7-1200",
    tags: GTPL_139_TAGS,
    location: "India",
    image: "/images/1200.jpg",
    chillerModel: "GT-300AP",
    isSpecialMachine: true,
    isHTRMachine: false,
    hasCRValve: true,
    usesT0THLabels: true,
    isGrainPaddyDevice: true,
  },
  {
    name: "GTPL-142-gT-450AP-S7-1200",
    table: "GTPL_142_GT_450AP_S7_1200",
    statusKey: "GTPL_142",
    type: "S7-1200",
    tags: GPL_132_TAGS,
    location: "India",
    image: "/images/1200.jpg",
    chillerModel: "gT-450AP",
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    usesT0THLabels: true,
    isGrainPaddyDevice: true,
  },
  {
    name: "GTPL-123-GT-450AP",
    table: "GTPL_123_GT_450AP_S7_1200",
    statusKey: "GTPL_123",
    type: "S7-1200",
    tags: GPL_132_TAGS,
    location: "India",
    image: "/images/1200.jpg",
    chillerModel: "gt-450AP",
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    usesT0THLabels: true,
    isGrainPaddyDevice: true,
  },
  {
    name: "GTPL-143-gT-450AP-S7-1200",
    table: "GTPL_143_GT_450AP_S7_1200",
    statusKey: "GTPL_143",
    type: "S7-1200",
    tags: GPL_132_TAGS,
    location: "India",
    image: "/images/1200.jpg",
    chillerModel: "gT-450AP",
    isSpecialMachine: true,
    isHTRMachine: true,
    hasCRValve: true,
    usesT0THLabels: true,
    isGrainPaddyDevice: true,
  },
];

// ─── Derived lookup maps (auto-generated from registry) ─────

/** Map: device name → table name */
export const DEVICE_TO_TABLE_MAP: Record<string, string> = Object.fromEntries(
  MACHINE_REGISTRY.map((m) => [m.name, m.table])
);

/** Map: table name → status key */
export const TABLE_TO_STATUS_KEY: Record<string, string> = Object.fromEntries(
  MACHINE_REGISTRY.map((m) => [m.table, m.statusKey])
);

/** Map: device name → status key */
export const DEVICE_TO_STATUS_KEY: Record<string, string> = Object.fromEntries(
  MACHINE_REGISTRY.map((m) => [m.name, m.statusKey])
);

/** All unique table names (for API route validation) */
export const ALL_TABLE_NAMES: string[] = [
  ...new Set(MACHINE_REGISTRY.map((m) => m.table)),
];

/** All table names as a Set (for O(1) lookup) */
export const ALL_TABLE_NAMES_SET: Set<string> = new Set(ALL_TABLE_NAMES);

/** All device display names */
export const ALL_DEVICE_NAMES: string[] = MACHINE_REGISTRY.map((m) => m.name);

// ─── Feature flag helpers ───────────────────────────────

/** Get a machine entry by name (supports partial matching like the existing code) */
export function getMachineByName(name: string): MachineEntry | undefined {
  return MACHINE_REGISTRY.find((m) => name.includes(m.name) || m.name.includes(name));
}

/** Check if a machine name has a specific feature flag */
export function hasMachineFeature(
  machineName: string,
  feature: keyof Pick<MachineEntry, "isBarMachine" | "isSpecialMachine" | "isHTRMachine" | "isFanMachine" | "hasCRValve" | "aerationWithoutHeatingOnly" | "usesT0THLabels" | "isGrainPaddyDevice" | "hideAeration" | "hideDeltaA">
): boolean {
  const machine = getMachineByName(machineName);
  return machine?.[feature] === true;
}

/** Get all machine names that have a specific feature flag */
export function getMachineNamesWithFeature(
  feature: keyof Pick<MachineEntry, "isBarMachine" | "isSpecialMachine" | "isHTRMachine" | "isFanMachine" | "hasCRValve" | "aerationWithoutHeatingOnly" | "usesT0THLabels" | "isGrainPaddyDevice" | "hideAeration" | "hideDeltaA">
): string[] {
  return MACHINE_REGISTRY.filter((m) => m[feature] === true).map((m) => m.name);
}

/** Get device info array for devices page (excludes alias entries like Gtpl-S7-1200-02) */
export function getDevicesForDisplay(): Array<{
  name: string;
  location: string;
  image: string;
  plc: string;
  chillerModel: string;
}> {
  return MACHINE_REGISTRY
    .filter((m) => m.name !== "Gtpl-S7-1200-02") // exclude aliases
    .map((m) => ({
      name: m.name,
      location: m.location,
      image: m.image,
      plc: m.type,
      chillerModel: m.chillerModel,
    }));
}
