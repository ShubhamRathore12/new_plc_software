/**
 * Readable fault text (F-12).
 *
 * Fault rows arrive either as a human description ("Compressor circuit breaker
 * fault") or as a raw PLC tag ("FAULT_COMP_CB", "AHT_vale_speed"). Operators
 * were shown whichever came through. This turns both into a readable title plus
 * a recommended response, and keeps the raw tag as secondary detail for service.
 */

export type FaultDescription = {
  /** Readable one-line description. */
  title: string;
  /** What the operator should do about it. */
  response: string;
  /** The raw identifier, kept for service and support calls. */
  tag: string;
};

/** Matched in order; the first hit wins. */
const RESPONSES: Array<{ match: RegExp; response: string }> = [
  {
    match: /circuit ?breaker|_cb\b|mcb/i,
    response: "Check the breaker in the panel and reset it before restarting.",
  },
  {
    match: /high ?pressure|\bhp\b/i,
    response:
      "Check condenser airflow and cleanliness. Do not restart until the pressure has been checked.",
  },
  {
    match: /low ?pressure|\blp\b/i,
    response: "Check refrigerant charge and the evaporator. Call service if it repeats.",
  },
  {
    match: /three ?phase|phase ?monitor|voltage|supply/i,
    response: "Check the mains supply and phase sequence at the isolator.",
  },
  {
    match: /door/i,
    response: "Close and latch the panel or condenser door, then reset.",
  },
  {
    match: /blower|evap/i,
    response: "Check the blower drive and the air path for blockage.",
  },
  {
    match: /heater|aht|after ?heat/i,
    response: "Check the heater bank and its thermal protection.",
  },
  {
    match: /ambient/i,
    response:
      "Ambient conditions are outside the working range. Wait for conditions to change before restarting.",
  },
  {
    match: /compressor|comp\b/i,
    response: "Stop the machine and call service before restarting the compressor.",
  },
  {
    match: /sensor|temp|probe|rtd|pt100/i,
    response: "Check the sensor and its wiring; a reading may be missing or out of range.",
  },
  {
    match: /valve|vale/i, // "vale" is a live misspelling in the PLC tag names
    response: "Check the valve and its actuator feedback.",
  },
];

/** `AHT_vale_speed` → `AHT vale speed` → `Aht vale speed`. */
function humanizeTag(tag: string): string {
  const words = tag
    .replace(/[_-]+/g, " ")
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
  if (!words) return tag;
  return words.charAt(0).toUpperCase() + words.slice(1).toLowerCase();
}

/** True when the string looks like a PLC identifier rather than prose. */
function looksLikeTag(value: string): boolean {
  return !value.includes(" ") || /_/.test(value);
}

export function describeFaultTag(raw: string | null | undefined): FaultDescription {
  const tag = (raw ?? "").trim();
  if (!tag) {
    return {
      title: "Unnamed fault",
      response: "No description is available for this code. Contact service.",
      tag: "—",
    };
  }

  const title = looksLikeTag(tag) ? humanizeTag(tag) : tag;
  const matched = RESPONSES.find((entry) => entry.match.test(tag));

  return {
    title,
    response:
      matched?.response ??
      "Note the code and the time, then contact service if the fault persists.",
    tag,
  };
}
