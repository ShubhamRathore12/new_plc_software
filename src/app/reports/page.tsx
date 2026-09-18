"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { DatePicker, Spin, message } from "antd";
import dayjs, { Dayjs } from "dayjs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useDataStore } from "@/lib/store";
import { useSession } from "@/providers/session-provider";
import { api } from "@/lib/apiClient";
import { normalizeMachineId } from "@/lib/session";
import { toast } from "sonner";
import { getSchemaForTable } from "@/lib/dbSchema";
import { getKabuColumnOrder } from "@/lib/kabuColumnOrder";
import {
  BarChart3,
  CalendarRange,
  Columns3,
  Download,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";

const { RangePicker } = DatePicker;

// All available device names
const allDevices = [
  "GTPL-122-gT-1000T-S7-1200",
  "GTPL-118-gT-60T-S7-200",
  "GTPL-108-gT-40E-P-S7-200",
  "GTPL-109-gT-40E-P-S7-200",
  "GTPL-110-gT-40E-P-S7-200",
  "GTPL-111-gT-80E-P-S7-200",
  "GTPL-112-gT-80E-P-S7-200",
  "GTPL-113-gT-80E-P-S7-200",
  "GTPL-030-gT-180E-S7-1200",
  "GTPL-115-gT-180E-S7-1200",
  "GTPL-116-gT-240E-S7-1200",
  "GTPL-117-gT-320E-S7-1200",
  "GTPL-119-gT-180E-S7-1200",
  "GTPL-120-gT-180E-S7-1200",
  "GTPL-121-gT-1000T-S7-1200",
  "GTPL-124-gT-450T-S7-1200",
  "GTPL-133-gT-650T-S7-1200",
  "GTPL-154-gT-650T-S7-1200",
  "GTPL-155-gT-650T-S7-1200",
  "GTPL-081-gT-650T-S7-1200",
  "GTPL-105-gT-650T-S7-1200",
  "GTPL-131-gT-650T-S7-1200",
  "GTPL-132-300-AP-S7-1200",
  "GTPL-134-gT-450T-S7-1200",
  "GTPL-135-gT-450T-S7-1200",
  "GTPL-145-gT-450T-S7-1200",
  "GTPL-148-gT-450T-S7-1200",
  "GTPL-149-gT-60T-S7-1200",
  "GTPL-136-gT-300AP-S7-1200",
  "GTPL-137-gT-450T-S7-1200",
  "GTPL-138-gT-450T-S7-1200",
  "GTPL-139-gT-300AP-S7-1200",
  "GTPL-144-gT-300AP-S7-1200",
  "GTPL-061-gT-450T-S7-1200",
  "GTPL-142-gT-450AP-S7-1200",
  "GTPL-123-gT-450AP",
  "GTPL-143-gT-450AP-S7-1200",
  "GTPL-068-gT-650T-S7-1200",
  "GTPL-104-gT-650T-S7-1200",
  "GTPL-044-GT-140E-S7-1200",
  "GTPL-156-gT-450T-S7-1200",
  "GTPL-157-gT-450T-S7-1200"
];

// Create a mapping from device name to table name
const DEVICE_TO_TABLE_MAP: Record<string, string> = {
  "GTPL-122-gT-1000T-S7-1200": "gtpl_122_s7_1200_01",
  // Note: Add this to ALLOWED_TABLES if needed
  "GTPL-108-gT-40E-P-S7-200": "GTPL_108_gT_40E_P_S7_200_Germany",
  "GTPL-109-gT-40E-P-S7-200": "GTPL_109_gT_40E_P_S7_200_Germany",
  "GTPL-110-gT-40E-P-S7-200": "GTPL_110_gT_40E_P_S7_200_Germany",
  "GTPL-111-gT-80E-P-S7-200": "GTPL_111_gT_80E_P_S7_200_Germany",
  "GTPL-112-gT-80E-P-S7-200": "GTPL_112_gT_80E_P_S7_200_Germany",
  "GTPL-113-gT-80E-P-S7-200": "GTPL_113_gT_80E_P_S7_200_Germany",
  "GTPL-030-gT-180E-S7-1200": "GTPL_114_GT_140E_S7_1200",
  "GTPL-115-gT-180E-S7-1200": "GTPL_115_GT_180E_S7_1200",
  "GTPL-116-gT-240E-S7-1200": "GTPL_116_GT_240E_S7_1200",
  "GTPL-117-gT-320E-S7-1200": "GTPL_117_GT_320E_S7_1200",
  "GTPL-119-gT-180E-S7-1200": "GTPL_119_GT_180E_S7_1200",
  "GTPL-120-gT-180E-S7-1200": "GTPL_120_GT_180E_S7_1200",
  "GTPL-121-gT-1000T-S7-1200": "GTPL_121_GT1000T",
  "GTPL-124-gT-450T-S7-1200": "GTPL_124_GT_450T_S7_1200",
  "GTPL-133-gT-650T-S7-1200": "GTPL_133_GT_650T_S7_1200",
  "GTPL-154-gT-650T-S7-1200": "GTPL_154_GT_650T_S7_1200",
  "GTPL-155-gT-650T-S7-1200": "GTPL_155_GT_650T_S7_1200",
  "GTPL-081-gT-650T-S7-1200": "GTPL_081_GT_650T_S7_1200",
  "GTPL-105-gT-650T-S7-1200": "GTPL_105_GT_650T_S7_1200",
  "GTPL-068-gT-650T-S7-1200": "GTPL_068_GT_650T_S7_1200",
  "GTPL-104-gT-650T-S7-1200": "GTPL_104_GT_650T_S7_1200",
  "GTPL-131-gT-650T-S7-1200": "GTPL_131_GT_650T_S7_1200",
  "GTPL-132-300-AP-S7-1200": "GTPL_132_GT300AP",
  "GTPL-118-gT-60T-S7-200": "GTPL_118_GT_60T_S7_1200",
  "GTPL-149-gT-60T-S7-1200": "GTPL_149_GT_60T_S7_1200",
  "GTPL-137-gT-450T-S7-1200": "GTPL_137_GT_450T_S7_1200",
  "GTPL-138-gT-450T-S7-1200": "GTPL_138_GT_450T_S7_1200",
  "GTPL-061-gT-450T-S7-1200": "GTPL_061_GT_450T_S7_1200",
 "GTPL-134-gT-450T-S7-1200":  "GTPL_134_GT_450T_S7_1200",
  "GTPL-135-gT-450T-S7-1200": "GTPL_135_GT_450T_S7_1200",
  "GTPL-145-gT-450T-S7-1200": "GTPL_145_GT_450T_S7_1200",
  "GTPL-148-gT-450T-S7-1200": "GTPL_148_GT_450T_S7_1200",
  "GTPL-136-gT-300AP-S7-1200": "GTPL_136_GT_450AP_S7_1200",
 
     "GTPL-139-gT-300AP-S7-1200": 'GTPL_139_GT300AP',
  "GTPL-144-gT-300AP-S7-1200": 'GTPL_144_GT_300AP_S7_1200',
  "GTPL-142-gT-450AP-S7-1200": "GTPL_142_GT_450AP_S7_1200",
  "GTPL-123-gT-450AP": "GTPL_123_GT_450AP_S7_1200",
  "GTPL-143-gT-450AP-S7-1200": "GTPL_143_GT_450AP_S7_1200",
  "GTPL-044-GT-140E-S7-1200": "GTPL_044_GT_140E_S7_1200",
  // Philippines silo chillers
  "GTPL-156-gT-450T-S7-1200": "GTPL_156_GT_450T_S7_1200",
  "GTPL-157-gT-450T-S7-1200": "GTPL_157_GT_450T_S7_1200",
};




// All available table names (keep as reference)
const ALLOWED_TABLES = [
  "GTPL_108_gT_40E_P_S7_200_Germany",
  "GTPL_109_gT_40E_P_S7_200_Germany",
  "GTPL_110_gT_40E_P_S7_200_Germany",
  "GTPL_111_gT_80E_P_S7_200_Germany",
  "GTPL_112_gT_80E_P_S7_200_Germany",
  "GTPL_113_gT_80E_P_S7_200_Germany",
  "GTPL_118_GT_60T_S7_1200",
  "GTPL_149_GT_60T_S7_1200",
  "GTPL_114_GT_140E_S7_1200",
  "GTPL_044_GT_140E_S7_1200",
  "GTPL_115_GT_180E_S7_1200",
  "GTPL_119_GT_180E_S7_1200",
  "GTPL_120_GT_180E_S7_1200",
  "GTPL_116_GT_240E_S7_1200",
  "GTPL_117_GT_320E_S7_1200",
  "GTPL_121_GT1000T",
  "gtpl_122_s7_1200_01",
  "GTPL_124_GT_450T_S7_1200",
  "GTPL_133_GT_650T_S7_1200",
  "GTPL_154_GT_650T_S7_1200",
  "GTPL_155_GT_650T_S7_1200",
  "GTPL_131_GT_650T_S7_1200",
  "GTPL_132_GT_650T_S7_1200",
  "GTPL_068_GT_650T_S7_1200",
  "GTPL_104_GT_650T_S7_1200",
  "GTPL_132_GT300AP",
  "GTPL_137_GT_450T_S7_1200",
  "GTPL_138_GT_450T_S7_1200",
  "GTPL_061_GT_450T_S7_1200",
   "GTPL_134_GT_450T_S7_1200",
  "GTPL_135_GT_450T_S7_1200",
  "GTPL_145_GT_450T_S7_1200",
  "GTPL_148_GT_450T_S7_1200",
  "GTPL_136_GT_450AP_S7_1200",
    'GTPL_139_GT300AP',
  "GTPL_142_GT_450AP_S7_1200",
  "GTPL_123_GT_450AP_S7_1200",
  "GTPL_143_GT_450AP_S7_1200",
  "GTPL_068_GT_650T_S7_1200",
  "GTPL_104_GT_650T_S7_1200",
  "GTPL_156_GT_450T_S7_1200",
  "GTPL_157_GT_450T_S7_1200"
] as const;

export default function TableWithDownload() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [pagination, setPagination] = useState<any>({
    page: 1,
    limit: 100,
    total: 0,
  });
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const { data: storeData } = useDataStore() as { data: any };

  // The session is the authoritative machine list — the server already scopes
  // it to this account, so nothing is filtered client-side here. The
  // monitorAccess grant below is only the fallback for backends that do not
  // serve /api/auth/session yet.
  const { session, machines: sessionMachines } = useSession();
  const serverScoped = session?.source === "server";

  const accessArray = (storeData?.user?.monitorAccess?.split(",") || [])
    .map((name: string) => name.trim().toLowerCase())
    .filter((name: string) => name.length > 0);

  const getFilteredDevices = () => {
    if (serverScoped) {
      // Map each assigned machine onto its catalogue name where one exists so
      // the table/schema lookups keep working; otherwise use the name as sent.
      return sessionMachines.map((m) => {
        const wanted = normalizeMachineId(m.machineName);
        return (
          allDevices.find(
            (deviceName) =>
              normalizeMachineId(deviceName) === wanted ||
              normalizeMachineId(DEVICE_TO_TABLE_MAP[deviceName] || "") ===
                normalizeMachineId(m.table)
          ) || m.machineName
        );
      });
    }

    // Legacy: monitorAccess lists machines to HIDE.
    if (accessArray.length === 0) {
      return allDevices;
    }

    const filtered = allDevices.filter((deviceName) => {
      return !accessArray.some((access: string) =>
        deviceName.toLowerCase().includes(access) ||
        (DEVICE_TO_TABLE_MAP[deviceName] || "").toLowerCase().includes(access)
      );
    });

    return filtered.length > 0 ? filtered : allDevices;
  };

  const filteredDevices = getFilteredDevices();

  // UPDATED: Initialize with first device from filtered list
  const [selectedDevice, setSelectedDevice] = useState<string>(filteredDevices[0] || "");

  // UPDATED: Effect to handle device selection when filtered devices change
  useEffect(() => {
    if (filteredDevices.length > 0) {
      // If no device is selected or current device is not in filtered list
      if (!selectedDevice || !filteredDevices.includes(selectedDevice)) {
        setSelectedDevice(filteredDevices[0]);
      }
    } else {
      // No devices available, clear selection
      setSelectedDevice("");
    }
  }, [filteredDevices, selectedDevice]);

  // Function to validate date range (max 3 days)
  const validateDateRange = (dates: [Dayjs, Dayjs] | null): boolean => {
    if (!dates || !dates[0] || !dates[1]) return true;

    const [startDate, endDate] = dates;
    const daysDifference = endDate.diff(startDate, 'day');

    if (daysDifference > 3) {
      toast.error(
        "Please select a date range of maximum 3 days. Higher date ranges may result in large amounts of data.",

      );
      return false;
    }

    return true;
  };

  // Fetch data directly from Go backend
  const fetchData = async (
    deviceName: string,
    range?: [Dayjs, Dayjs] | null,
    pageOverride?: number
  ) => {
    const tableName = DEVICE_TO_TABLE_MAP[deviceName];
    if (!tableName) {
      console.error("No table mapping found for device:", deviceName);
      return;
    }

    setLoading(true);
    try {
      const page = pageOverride ?? pagination.page ?? 1;
      const params = new URLSearchParams({
        table: tableName,
        page: String(page),
      });

      if (range && range[0] && range[1]) {
        params.set("fromDate", range[0].format("YYYY-MM-DD"));
        params.set("toDate", range[1].format("YYYY-MM-DD"));
      }

      const res = await api(`/api/reports?${params.toString()}`);
      const json: any = await res.json();

      setData(json?.data || []);
      setPagination({
        page: json.page || 1,
        limit: json.limit || 100,
        total: json.total || 0,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setData([]);
      setPagination((p: any) => ({ ...p, total: 0 }));
      message.error("Failed to fetch data. Please try again.");
    }
    setLoading(false);
  };

  // Download Excel directly from Go backend
  const downloadAllData = async () => {
    if (!dateRange) return;

    if (!validateDateRange(dateRange)) {
      return;
    }

    const tableName = DEVICE_TO_TABLE_MAP[selectedDevice];
    if (!tableName) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      const [startDate, endDate] = dateRange;
      const params = new URLSearchParams({
        table: tableName,
        fromDate: startDate.format("YYYY-MM-DD"),
        toDate: endDate.format("YYYY-MM-DD"),
        limit: "50000",
      });

      const response = await api(`/api/export/excel?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Download failed (HTTP ${response.status})`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      const contentLength = parseInt(
        response.headers.get("Content-Length") || "0",
        10
      );
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        if (contentLength > 0) {
          setDownloadProgress(
            Math.round((receivedLength / contentLength) * 100)
          );
        } else {
          // Estimate progress when Content-Length is unknown
          setDownloadProgress(Math.min(95, Math.round(receivedLength / 1024)));
        }
      }

      const blob = new Blob(chunks as BlobPart[], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${selectedDevice}_export.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      message.success("Excel data downloaded successfully!");
    } catch (err) {
      console.error("Download error:", err);
      message.error(
        err instanceof Error
          ? err.message
          : "An error occurred while downloading the data."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Download CSV directly from Go backend
  const downloadAllDataCSV = async () => {
    if (!dateRange) return;

    if (!validateDateRange(dateRange)) {
      return;
    }

    const tableName = DEVICE_TO_TABLE_MAP[selectedDevice];
    if (!tableName) return;

    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      const [startDate, endDate] = dateRange;
      const params = new URLSearchParams({
        table: tableName,
        fromDate: startDate.format("YYYY-MM-DD"),
        toDate: endDate.format("YYYY-MM-DD"),
      });

      const response = await api(`/api/export?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`CSV download failed (HTTP ${response.status})`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      const contentLength = parseInt(
        response.headers.get("Content-Length") || "0",
        10
      );
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        if (contentLength > 0) {
          setDownloadProgress(
            Math.round((receivedLength / contentLength) * 100)
          );
        } else {
          setDownloadProgress(Math.min(95, Math.round(receivedLength / 1024)));
        }
      }

      const blob = new Blob(chunks as BlobPart[], { type: "text/csv;charset=utf-8" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${selectedDevice}_export.csv`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      message.success("CSV data downloaded successfully!");
    } catch (err) {
      console.error("Download CSV error:", err);
      message.error(
        err instanceof Error
          ? err.message
          : "An error occurred while downloading the CSV data."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  // Fetch data whenever device, date range, or page changes
  useEffect(() => {
    if (selectedDevice) {
      fetchData(selectedDevice, dateRange, pagination.page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDevice, dateRange, pagination.page]);

  const handleDateChange: any = (dates: any) => {
    // Reset to page 1 whenever date filter toggles
    setPagination((p: any) => ({ ...p, page: 1 }));

    if (dates && dates[0] && dates[1]) {
      const dateRangeToValidate: [Dayjs, Dayjs] = [dates[0], dates[1]];

      // Validate the date range
      if (validateDateRange(dateRangeToValidate)) {
        setDateRange(dateRangeToValidate);
      } else {
        // Don't set the date range if validation fails
        setDateRange(null);
        return;
      }
    } else {
      setDateRange(null);
    }
  };

  const downloadExcel = () => {
    if (!data.length) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${selectedDevice}_data.xlsx`);
    message.success("Excel file downloaded successfully!");
  };

  // Machines that physically have a heater (reference: auto screen HTR config).
  // Heater column hidden for every other device, and for any S7-200 device.
  const HEATER_DEVICES = [
    "GTPL-030-gT-180E-S7-1200",
    "GTPL-115-gT-180E-S7-1200",
    "GTPL-116-gT-240E-S7-1200",
    "GTPL-117-gT-320E-S7-1200",
    "GTPL-119-gT-180E-S7-1200",
    "GTPL-120-gT-180E-S7-1200",
  ];
  const showHeater =
    HEATER_DEVICES.includes(selectedDevice) && !selectedDevice.endsWith("200");

  const rawKeys = data.length ? Object.keys(data[0]) : [];

  // Drop heater columns when this machine has no heater
  const keys = showHeater
    ? rawKeys
    : rawKeys.filter((k) => !k.toLowerCase().includes("heater"));

  // Get KABU column order for this table (highest priority)
  const tableName = DEVICE_TO_TABLE_MAP[selectedDevice];
  const kabuColumnOrder = getKabuColumnOrder(tableName);

  // Column schema for the selected machine's DB table (for the "View Schema"
  // dialog AND fallback column ordering).
  const schemaCols = getSchemaForTable(tableName);

  // Map lowercased column name -> its exact position and casing in the DB table,
  // so the report shows columns in the same order/name as they exist in the DB.
  const schemaIndex: Record<string, number> = {};
  const schemaName: Record<string, string> = {};
  schemaCols?.forEach((c, i) => {
    schemaIndex[c.name.toLowerCase()] = i;
    schemaName[c.name.toLowerCase()] = c.name;
  });

  const sortedKeys = [...keys].sort((a: string, b: string) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();

    // FIRST PRIORITY: Use KABU column order if available
    if (kabuColumnOrder) {
      const kabuIndexA = kabuColumnOrder.findIndex(col => col.toLowerCase() === aLower);
      const kabuIndexB = kabuColumnOrder.findIndex(col => col.toLowerCase() === bLower);
      const aIdx = kabuIndexA >= 0 ? kabuIndexA : Infinity;
      const bIdx = kabuIndexB >= 0 ? kabuIndexB : Infinity;
      if (aIdx !== bIdx) return aIdx - bIdx;
      // If both not in KABU order, continue to next sort rule
    }

    // SECOND PRIORITY: When a DB schema exists, order columns exactly as they
    // appear in the table (schema position). Columns not present in the schema
    // (e.g. id, created_on) fall through to the priority/alpha rules below.
    if (schemaCols) {
      const aIdx = schemaIndex[aLower] ?? Infinity;
      const bIdx = schemaIndex[bLower] ?? Infinity;
      if (aIdx !== bIdx) return aIdx - bIdx;
    }

    // THIRD PRIORITY: Define priority order for specific fields
    // Temperature columns must group right after created_on (incl. TH/supply-air
    // variants) so they never fall to the end of the table.
    const priorityOrder: Record<string, number> = {
      'id': 0,
      'created_on': 1,
      'created_at': 1,
      'th_temp_mean': 2,
      'after_heater_temp_th': 2,
      't0_1_air_outlet_temp': 3,
      't0_2_air_outlet_temp': 4,
      't0_set_point': 5,
      't0_temp_mean': 6,
      't1_1_cold_air_temp': 7,
      't1_2_cold_air_temp': 8,
      't1_temp_mean': 9,
      't2_1_ambient_temp': 10,
      't2_2_ambient_temp': 11,
      't2_temp_mean': 12,
    };

    const aPriority = priorityOrder[aLower] ?? Infinity;
    const bPriority = priorityOrder[bLower] ?? Infinity;

    // If both have priority, sort by priority
    if (aPriority !== Infinity || bPriority !== Infinity) {
      if (aPriority !== bPriority) return aPriority - bPriority;
    }

    // FALLBACK: Rest in alphabetical order
    return aLower.localeCompare(bLower);
  });

  // Display the exact DB column name (schema casing) when known.
  const displayColName = (key: string) => schemaName[key.toLowerCase()] ?? key;

  const disabledDate = (current: Dayjs) => {
    const today = dayjs();
    const fiveDaysAgo = today.subtract(60, 'day');

    // Disable future dates (after today) and dates older than 60 days ago
    return current && (current.isAfter(today, 'day') || current.isBefore(fiveDaysAgo, 'day'));
  };

  return (
    <DashboardLayout>
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-56"
          style={{
            background:
              "radial-gradient(40rem 16rem at 14% 0%, color-mix(in oklch, var(--primary) 13%, transparent), transparent 70%), radial-gradient(32rem 14rem at 88% 4%, color-mix(in oklch, var(--chart-2) 11%, transparent), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-[1800px] space-y-5 pt-4 pb-10">
          {/* ── Header ───────────────────────────────────────────────── */}
          <header className="animate-fade-in-up flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                <BarChart3 className="h-3.5 w-3.5" />
                Reports
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                Machine data explorer
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Query logged telemetry and export it as Excel or CSV.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="surface min-w-[6.5rem] px-3.5 py-2.5">
                <p className="text-muted-foreground text-[11px] font-medium">
                  Records
                </p>
                <p className="tabular text-xl font-semibold">
                  {pagination.total?.toLocaleString?.() ?? 0}
                </p>
              </div>
              <div className="surface min-w-[6.5rem] px-3.5 py-2.5">
                <p className="text-muted-foreground text-[11px] font-medium">
                  Columns
                </p>
                <p className="tabular text-xl font-semibold">
                  {sortedKeys.length}
                </p>
              </div>
            </div>
          </header>

          {/* ── Toolbar ──────────────────────────────────────────────── */}
          <div className="surface animate-fade-in-up relative z-30 flex flex-wrap items-center gap-3 p-3">
            <Select
              value={selectedDevice}
              onValueChange={(deviceName: string) => setSelectedDevice(deviceName)}
            >
              <SelectTrigger className="h-10 w-full sm:w-[300px]">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent>
                {filteredDevices.map((deviceName) => (
                  <SelectItem key={deviceName} value={deviceName}>
                    {deviceName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <RangePicker
              disabledDate={disabledDate}
              onChange={handleDateChange}
              className="gt-range h-10 w-full sm:w-[290px]"
              format="YYYY-MM-DD"
              placeholder={["Start Date", "End Date"]}
            />

            <div className="ml-auto flex flex-wrap gap-2">
              <Button
                onClick={downloadExcel}
                disabled={
                  !data.length || loading || storeData?.user?.firstName === "Prosafe"
                }
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileSpreadsheet className="h-4 w-4" />
                )}
                Excel
              </Button>
              <Button
                onClick={downloadAllData}
                disabled={
                  !dateRange || isDownloading || storeData?.user?.firstName === "Prosafe"
                }
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Full range
              </Button>
              <Button
                onClick={downloadAllDataCSV}
                disabled={
                  !dateRange || isDownloading || storeData?.user?.firstName === "Prosafe"
                }
                variant="outline"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                CSV
              </Button>
              <Button
                onClick={() => setSchemaOpen(true)}
                disabled={!schemaCols}
                variant="outline"
              >
                <Columns3 className="h-4 w-4" />
                Schema
              </Button>
            </div>
          </div>

        {/* Schema / Column View Dialog */}
        <Dialog open={schemaOpen} onOpenChange={setSchemaOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedDevice} — {DEVICE_TO_TABLE_MAP[selectedDevice]} (
                {schemaCols?.length ?? 0} columns)
              </DialogTitle>
            </DialogHeader>
            {schemaCols ? (
              <Table className="border border-gray-300">
                <TableHeader>
                  <TableRow>
                    <TableHead className="border border-gray-300 bg-gray-100 font-semibold text-sm p-2">
                      Column Name
                    </TableHead>
                    <TableHead className="border border-gray-300 bg-gray-100 font-semibold text-sm p-2">
                      Type
                    </TableHead>
                    <TableHead className="border border-gray-300 bg-gray-100 font-semibold text-sm p-2">
                      Nullable
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schemaCols.map((c) => (
                    <TableRow key={c.name}>
                      <TableCell className="border border-gray-300 text-sm p-2 font-mono">
                        {c.name}
                      </TableCell>
                      <TableCell className="border border-gray-300 text-sm p-2">
                        {c.type}
                      </TableCell>
                      <TableCell className="border border-gray-300 text-sm p-2">
                        {c.nullable ? "YES" : "NO"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-sm text-gray-500 py-6 text-center">
                No schema available for this machine.
              </p>
            )}
          </DialogContent>
        </Dialog>

        {/* Date Range Info */}
          {dateRange && (
            <div className="border-primary/25 bg-primary/8 animate-fade-in flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl border px-4 py-3">
              <CalendarRange className="text-primary h-4 w-4 shrink-0" />
              <p className="text-sm font-medium">
                {dateRange[0].format("YYYY-MM-DD")} → {dateRange[1].format("YYYY-MM-DD")}
                <span className="text-muted-foreground ml-2 font-normal">
                  {dateRange[1].diff(dateRange[0], "day") + 1} day
                  {dateRange[1].diff(dateRange[0], "day") !== 0 ? "s" : ""}
                </span>
              </p>
              <p className="text-muted-foreground ml-auto text-xs">
                Maximum range is 3 days to keep exports manageable.
              </p>
            </div>
          )}

        {/* Download Progress Dialog */}
        <Dialog open={isDownloading} onOpenChange={setIsDownloading}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Downloading Data</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Progress value={downloadProgress} className="w-full" />
                <span className="ml-2 text-sm font-medium text-gray-700">{downloadProgress}%</span>
              </div>
              <p className="text-center text-sm text-gray-500">
                Downloading {selectedDevice} data...
                {downloadProgress < 100 ? " Please wait" : " Complete!"}
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Table */}
          {loading ? (
            <div className="surface flex h-64 items-center justify-center">
              <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div
              id="table-container"
              className="surface relative z-0 max-h-[70vh] overflow-auto p-0"
            >
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    {sortedKeys.map((key) => (
                      <TableHead key={key} className="text-center">
                        {displayColName(key)}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={sortedKeys.length || 1}
                        className="text-muted-foreground py-14 text-center text-sm"
                      >
                        No records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {sortedKeys.map((key) => (
                          <TableCell
                            key={key}
                            className="tabular text-center text-xs"
                            title={String(row[key])}
                          >
                            {typeof row[key] === "boolean"
                              ? row[key]
                                ? "True"
                                : "False"
                              : String(row[key])}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}

        {/* Pagination */}
          {pagination.total > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-muted-foreground text-sm">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (pagination.page > 1) {
                    setPagination((prev: any) => ({ ...prev, page: prev.page - 1 }));
                  }
                }}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (pagination.page * pagination.limit < pagination.total) {
                    setPagination((prev: any) => ({ ...prev, page: prev.page + 1 }));
                  }
                }}
                disabled={pagination.page * pagination.limit >= pagination.total}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        </div>
      </div>
    </DashboardLayout>
  );
}