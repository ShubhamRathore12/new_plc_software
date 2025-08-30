import { useState, useEffect, useRef } from "react";
import { format } from "@/lib/utils";
import { useMachineStatusFeed } from "./useMachineStatusFeed";
import { apiRequest } from "@/lib/api";

interface AutoData {
  [key: string]: any;
}

export const useAutoData = (autoType: string) => {
  const { status } = useMachineStatusFeed();

    
  const [data, setData] = useState<AutoData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // AutoType → Table Name mapping
  const autoTypeToTableMap: Record<string, string> = {
    "GTPL-122-gT-1000T-S7-1200": "gtpl_122_s7_1200_01",
    "GTPL-118-gT-80E-P-S7-200": "kabomachinedatasmart200",
    "GTPL-108-gT-40E-P-S7-200": "GTPL_108_gT_40E_P_S7_200_Germany",
    "GTPL-109-gT-40E-P-S7-200": "GTPL_109_gT_40E_P_S7_200_Germany",
    "GTPL-110-gT-40E-P-S7-200": "GTPL_110_gT_40E_P_S7_200_Germany",
    "GTPL-111-gT-80E-P-S7-200": "GTPL_111_gT_80E_P_S7_200_Germany",
    "GTPL-112-gT-80E-P-S7-200": "GTPL_112_gT_80E_P_S7_200_Germany",
    "GTPL-113-gT-80E-P-S7-200": "GTPL_113_gT_80E_P_S7_200_Germany",
    "Gtpl-S7-1200-02": "gtpl_122_s7_1200_01",
    "GTPL-115-gT-180E-S7-1200" :  "GTPL_115_GT_180E_S7_1200",
   "GTPL-117-gT-320E-S7-1200" :"GTPL_117_GT_320E_S7_1200",
   "GTPL-116-gT-240E-S7-1200" :"GTPL_116_GT_240E_S7_1200",
   "GTPL-30-gT-180E-S7-1200":"GTPL_114_GT_140E_S7_1200",
   "GTPL-121-gT-1000T-S7-1200":"GTPL_121_GT1000T",
   "GTPL-119-gT-180E-S7-1200":"GTPL_119_GT_180E_S7_1200",
   "GTPL-120-gT-180E-S7-1200":'GTPL_120_GT_180E_S7_1200',
   "GTPL-124-GT-450T-S7-1200":"GTPL_124_GT_450T_S7_1200",
   "GTPL-131-GT-650T-S7-1200": "GTPL_131_GT_650T_S7_1200",
    "GTPL-132-GT-650T-S7-1200": "GTPL_132_GT_650T_S7_1200"
  };

  const deviceNameToStatusKey: Record<string, string> = {
    "GTPL-122-gT-1000T-S7-1200": "gtpl",
    "GTPL-118-gT-80E-P-S7-200": "kabo",
    "GTPL-108-gT-40E-P-S7-200": "gtpl_108",
    "GTPL-109-gT-40E-P-S7-200": "gtpl_109",
    "GTPL-110-gT-40E-P-S7-200": "gtpl_110",
    "GTPL-111-gT-80E-P-S7-200": "gtpl_111",
    "GTPL-112-gT-80E-P-S7-200": "gtpl_112",
    "GTPL-113-gT-80E-P-S7-200": "gtpl_113",
    "Gtpl-S7-1200-02": "gtpl_1200_02",
    "GTPL-115-gT-180E-S7-1200" : "gtpl_115",
    "GTPL-117-gT-320E-S7-1200":"gtpl_117",
     "GTPL-114-gT-140E-S7-1200":"gtpl_114",
     "GTPL-116-gT-240E-S7-1200":"gtpl_116",
     "GTPL-119-gT-180E-S7-1200":"gtpl_119",
     "GTPL-120-gT-180E-S7-1200":"gtpl_120",
     "GTPL-124-GT-450T-S7-1200":"gtpl_124",
     "GTPL-132-GT-650T-S7-1200":'gtpl_132',
     "GTPL-131-GT-650T-S7-1200":"gtpl_131"

    
    
  };

  const fetchData = async () => {
    const table = autoTypeToTableMap[autoType];
    const statusKey = deviceNameToStatusKey[autoType];


    
  const deviceStatus = statusKey ? (status as any)?.[statusKey] : {};

  
  
  const isMachineRunning = deviceStatus?.machineStatus ?? false;

    if (!table) {
      setError("❌ Unknown table mapping for device: " + autoType);
      console.error("No table mapping found for:", autoType);
      return;
    }

    try {
      const result = await apiRequest(
        `/api/fetchData?table=${encodeURIComponent(table)}`
      );

      if (result?.data) {
        setData([result.data]);
        setIsConnected(true);
        setError(null);
        setRetryCount(0);
      } else {
        throw new Error("Invalid response structure - no data property");
      }
    } catch (err: any) {
      console.error("❌ Polling error:", err.message || err);
      setIsConnected(false);
      setError(`Failed to fetch data: ${err.message}`);
      setRetryCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (autoType) {
      fetchData();
      intervalRef.current = setInterval(fetchData, 10000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoType, status]);

  const formatValue = (value: any, unit: string = "") => {
    if (value === undefined || value === null) return "--";
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return `${value}${unit}`;
    if (numericValue === 0) return `0${unit}`;

    const decimalPart = numericValue % 1;
    const roundedValue =
      decimalPart >= 0.5 ? Math.ceil(numericValue) : Math.floor(numericValue);

    return `${roundedValue}${unit}`;
  };

  return {
    data: data[0] || {},
    isConnected,
    error,
    retryCount,
    formatValue,
  };
};