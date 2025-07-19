"use client";

import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { useLanguage } from "@/providers/language-provider";
import { useDataStore } from "@/lib/store";

const allDevices = [
  { name: "GTPL-122-gT-1000T-S7-1200", location: "Noida---kanpur", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-1000T" },
  { name: "GTPL-118-gT-80E-P-S7-200", location: "Noida", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
  { name: "GTPL-108-gT-40E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-40E-P" },
  { name: "GTPL-109-gT-40E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-40E-P" },
  { name: "GTPL-110-gT-40E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-40E-P" },
  { name: "GTPL-111-gT-80E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
  { name: "GTPL-112-gT-80E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
  { name: "GTPL-113-gT-80E-P-S7-200", location: "Germany", image: "/images/200.jpg", plc: "S7-200", chillerModel: "gT-80E-P" },
  { name: "GTPL-114-gT-140E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-140E" },
  { name: "GTPL-115-gT-180E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-180E" },
  { name: "GTPL-116-gT-240E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-240E" },
  { name: "GTPL-117-gT-320E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-320E" },
  { name: "GTPL-119-gT-180E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-180E" },
  { name: "GTPL-120-gT-180E-S7-1200", location: "Germany", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-180E" },
  { name: "GTPL-121-gT-1000T-S7-1200", location: "Noida---kanpur", image: "/images/1200.jpg", plc: "S7-1200", chillerModel: "gT-1000T" },
];

export default function ActivityPanel() {
  const { t } = useLanguage();
  const { data } = useDataStore();
  const [visibleDevices, setVisibleDevices] = useState([]);

  useEffect(() => {
 

    const accessList = typeof data.monitorAccess === "string"
      ? data.monitorAccess.split(",").map((x:any) => x.trim())
      : Array.isArray(data.monitorAccess)
      ? data.monitorAccess.map((x:any) => x.trim())
      : [];

    const deviceAccessList = accessList.filter((item:any) => item.startsWith("GTPL-"));

    const filtered:any = allDevices.filter(
      (device) => !deviceAccessList.includes(device.name.trim())
    );

    

    setVisibleDevices(filtered);
  }, [data]);

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center space-x-2">
          <Circle className="h-5 w-5 text-emerald-500" />
          <h2 className="text-sm font-medium text-black dark:text-white">
            {t("device_activity")}
          </h2>
        </div>
        <div className="p-4 space-y-3">
          {visibleDevices.length > 0 ? (
            visibleDevices.map((device:any, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="h-2 w-2 mt-1 rounded-full bg-emerald-500" />
                <div>
                  <div className="text-sm font-medium text-black dark:text-white">
                    {device.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-300">
                    PLC: {device.plc} | Chiller: {device.chillerModel}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-gray-500 dark:text-gray-300">
              {t("no_devices_to_display") || "No devices to display."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
