"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useMachineStatusStore } from "@/lib/machineStatusStore";

const POLL_INTERVAL = 60 * 1000; // check every minute
const NOTIFY_INTERVAL = 5 * 60 * 1000; // notify every 5 minutes

export default function FaultToastPoller() {
  const lastNotifiedRef = useRef<Record<string, number>>({});
  const machines = useMachineStatusStore((s) => s.status.machines);

  useEffect(() => {
    const checkFaults = async () => {
      if (!machines.length) return;

      await Promise.all(
        machines.map(async ({ machineName }) => {
          try {
            const resp = await fetch(
              `/api/check-faults?machineName=${encodeURIComponent(machineName)}`
            );
            const data = await resp.json();
            if (data.hasFaults && data.faults?.length > 0) {
              const now = Date.now();
              const last = lastNotifiedRef.current[machineName] || 0;
              if (now - last >= NOTIFY_INTERVAL) {
                const first = data.faults[0];
                const more =
                  data.faultCount > 1
                    ? ` (+${data.faultCount - 1} more)`
                    : "";
                toast.error(`Alarm on ${machineName}: ${first.tag}${more}`);
                lastNotifiedRef.current[machineName] = now;
              }
            } else {
              delete lastNotifiedRef.current[machineName];
            }
          } catch (err) {
            console.error("Fault check failed for", machineName, err);
          }
        })
      );
    };

    checkFaults();
    const id = setInterval(checkFaults, POLL_INTERVAL);
    return () => clearInterval(id);
  }, [machines]);

  return null;
}
