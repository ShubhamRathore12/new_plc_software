/**
 * Machine access rules — mirrors the monitorAccess logic used on the devices page.
 * "0" or empty  → user can see ALL machines
 * anything else → comma-separated list of the only machine names allowed
 */
export function parseMonitorAccess(monitorAccess?: string | null): {
  showAllDevices: boolean;
  accessSet: Set<string>;
} {
  const value = monitorAccess || "";
  const showAllDevices = value === "0" || value.trim() === "";

  return {
    showAllDevices,
    accessSet: showAllDevices
      ? new Set<string>()
      : new Set(
          value
            .split(",")
            .map((n) => n.trim().toLowerCase())
            .filter(Boolean)
        ),
  };
}

/** True when the user may open the given machine. */
export function hasMachineAccess(
  monitorAccess: string | null | undefined,
  deviceName: string | null | undefined
): boolean {
  if (!deviceName) return true; // route carries no machine → nothing to guard
  const { showAllDevices, accessSet } = parseMonitorAccess(monitorAccess);
  if (showAllDevices) return true;
  return accessSet.has(deviceName.trim().toLowerCase());
}

/** Pull the machine name out of a URL path, e.g. /menu/auto/GTPL-061-... */
export function getDeviceFromPath(pathname: string): string | null {
  const segment = pathname
    .split("/")
    .map((s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    })
    .find((s) => /^gtpl[-_]/i.test(s));

  return segment || null;
}

/**
 * Menu sections work the OPPOSITE way to machines: anything listed in
 * monitorAccess is HIDDEN from the menu (see /menu/[section]/page.tsx), so a
 * listed section must also be refused when its URL is typed by hand.
 */
const SECTION_ALIASES: Record<string, string> = {
  aeration: "aerations",
  analog: "inputs/analog",
  "grain chilling mode": "auto-grain",
  "paddy ageing mode": "auto-paddy",
};

/** Section paths reachable from the machine menu. */
const KNOWN_SECTIONS = [
  "auto",
  "auto-grain",
  "auto-paddy",
  "aerations",
  "fault",
  "settings",
  "inputs",
  "inputs/analog",
  "outputs",
  "test",
  "brightness",
];

/** The section a /menu/... URL points at, e.g. "inputs/analog" — null for the machine menu itself. */
export function getSectionFromPath(pathname: string): string | null {
  const segments = pathname
    .split("/")
    .map((s) => {
      try {
        return decodeURIComponent(s);
      } catch {
        return s;
      }
    })
    .filter(Boolean);

  const menuIndex = segments.indexOf("menu");
  if (menuIndex === -1) return null;

  // Everything between /menu and the machine name is the section path.
  const parts = segments
    .slice(menuIndex + 1)
    .filter((s) => !/^gtpl[-_]/i.test(s));

  if (parts.length === 0) return null;

  // Prefer the longest known match, e.g. "inputs/analog" over "inputs".
  const joined = parts.join("/").toLowerCase();
  return (
    KNOWN_SECTIONS.filter((s) => joined === s || joined.startsWith(`${s}/`)).sort(
      (a, b) => b.length - a.length
    )[0] || parts[0].toLowerCase()
  );
}

/** True when the user may open the given menu section. */
export function hasSectionAccess(
  monitorAccess: string | null | undefined,
  section: string | null | undefined
): boolean {
  if (!section) return true;
  const { showAllDevices, accessSet } = parseMonitorAccess(monitorAccess);
  if (showAllDevices) return true; // "0"/empty → nothing is restricted

  const blocked = new Set<string>();
  accessSet.forEach((entry) => {
    blocked.add(entry);
    if (SECTION_ALIASES[entry]) blocked.add(SECTION_ALIASES[entry]);
  });

  const target = section.toLowerCase();
  // "inputs" being blocked also blocks "inputs/analog".
  return ![...blocked].some((b) => target === b || target.startsWith(`${b}/`));
}

/** The machine names inside monitorAccess (it also carries blocked section names). */
export function getAllowedMachines(
  monitorAccess: string | null | undefined
): string[] {
  const { showAllDevices } = parseMonitorAccess(monitorAccess);
  if (showAllDevices) return [];
  // Keep the original casing — machine names are compared exactly downstream.
  return (monitorAccess || "")
    .split(",")
    .map((n) => n.trim())
    .filter((n) => /^gtpl[-_]/i.test(n));
}

/**
 * Where a user should land right after login.
 * monitorAccess decides first: a user restricted to a single machine goes
 * straight into that machine's menu, and any user with a machine list goes to
 * the devices overview — whatever their accountType says. Only users with no
 * machine restriction at all fall back to the accountType routing.
 */
export function getLandingRoute(user: {
  accountType?: string;
  monitorAccess?: string | null;
}): string {
  const machines = getAllowedMachines(user?.monitorAccess);

  if (machines.length === 1) {
    return `/menu/${encodeURIComponent(machines[0])}`;
  }
  if (machines.length > 1) {
    return "/devices";
  }

  return user?.accountType === "customer" ? "/devices" : "/dashboard";
}
