"use client";

import { useEffect, useRef } from "react";
import { apiRequest } from "@/lib/api";

const NOTIFICATION_COOLDOWN = 60 * 60 * 1000; // 1 hour in milliseconds
const LOCAL_STORAGE_KEY = "faultNotificationTimestamps";

type Fault = {
  tag: string;
  description: string;
};

type FaultNotifierProps = {
  activeFaults: Fault[];
  machineName: string;
};

// Function to get timestamps from localStorage
const getStoredTimestamps = (): Record<string, number> => {
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Could not parse localStorage timestamps:", error);
    return {};
  }
};

// Function to set timestamps in localStorage
const setStoredTimestamps = (timestamps: Record<string, number>) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(timestamps));
  } catch (error) {
    console.error("Could not save timestamps to localStorage:", error);
  }
};

// Function to send the notification email
const sendNotificationEmail = async (machineName: string, fault: Fault) => {
  try {
    await apiRequest("/api/send-fault-email", {
      method: "POST",
      body: JSON.stringify({ machineName, fault }),
    });

    console.log(`Notification sent for fault: ${fault.tag}`);
    return true;
  } catch (error) {
    console.error("Failed to send notification email:", error);
    return false;
  }
};

export default function FaultNotifier({
  activeFaults,
  machineName,
}: FaultNotifierProps) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    // On initial mount, we don't want to send a flood of notifications.
    // We'll just update the timestamps for all current faults.
    if (isInitialMount.current) {
      const timestamps = getStoredTimestamps();
      const now = Date.now();
      activeFaults.forEach((fault) => {
        if (!timestamps[fault.tag]) {
          timestamps[fault.tag] = now;
        }
      });
      setStoredTimestamps(timestamps);
      isInitialMount.current = false;
      return;
    }

    // For subsequent updates, process faults
    const processFaults = async () => {
      const timestamps = getStoredTimestamps();
      const now = Date.now();
      let timestampsUpdated = false;

      for (const fault of activeFaults) {
        const lastNotified = timestamps[fault.tag];
        const shouldNotify =
          !lastNotified || now - lastNotified > NOTIFICATION_COOLDOWN;

        if (shouldNotify) {
          console.log(`Processing notification for fault: ${fault.tag}`);
          const success = await sendNotificationEmail(machineName, fault);
          if (success) {
            timestamps[fault.tag] = now;
            timestampsUpdated = true;
          }
        }
      }

      if (timestampsUpdated) {
        setStoredTimestamps(timestamps);
      }
    };

    if (activeFaults.length > 0 && machineName) {
      processFaults();
    }
  }, [activeFaults, machineName]);

  // This is a background component, so it renders nothing.
  return null;
}
