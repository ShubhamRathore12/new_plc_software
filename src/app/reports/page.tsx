"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DatePicker, Spin, message } from "antd";
import type { DatePickerProps } from "antd";
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
import { toast } from "sonner";

const { RangePicker } = DatePicker;

// All available device names
const allDevices = [
  "GTPL-122-gT-1000T-S7-1200",
  "GTPL-118-gT-80E-P-S7-200",
  "GTPL-108-gT-40E-P-S7-200",
  "GTPL-109-gT-40E-P-S7-200",
  "GTPL-110-gT-40E-P-S7-200",
  "GTPL-111-gT-80E-P-S7-200",
  "GTPL-112-gT-80E-P-S7-200",
  "GTPL-113-gT-80E-P-S7-200",
  "GTPL-30-gT-180E-S7-1200",
  "GTPL-115-gT-180E-S7-1200",
  "GTPL-116-gT-240E-S7-1200",
  "GTPL-117-gT-320E-S7-1200",
  "GTPL-119-gT-180E-S7-1200",
  "GTPL-120-gT-180E-S7-1200",
  "GTPL-121-gT-1000T-S7-1200",
  "GTPL-124-GT-450T-S7-1200",
  "GTPL-131-GT-650T-S7-1200",
  "GTPL-132-GT-650T-S7-1200",
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
  "GTPL-30-gT-180E-S7-1200": "GTPL_114_GT_140E_S7_1200",
  "GTPL-115-gT-180E-S7-1200": "GTPL_115_GT_180E_S7_1200",
  "GTPL-116-gT-240E-S7-1200": "GTPL_116_GT_240E_S7_1200",
  "GTPL-117-gT-320E-S7-1200": "GTPL_117_GT_320E_S7_1200",
  "GTPL-119-gT-180E-S7-1200": "GTPL_119_GT_180E_S7_1200",
  "GTPL-120-gT-180E-S7-1200": "GTPL_120_GT_180E_S7_1200",
  "GTPL-121-gT-1000T-S7-1200": "GTPL_121_GT1000T",
  "GTPL-124-GT-450T-S7-1200": "GTPL_124_GT_450T_S7_1200",
  "GTPL-131-GT-650T-S7-1200": "GTPL_131_GT_650T_S7_1200",
  "GTPL-132-GT-650T-S7-1200": "GTPL_132_GT300AP",
  "GTPL-118-gT-80E-P-S7-200": "kabomachinedatasmart200",
};

// All available table names (keep as reference)
const ALLOWED_TABLES = [
  "GTPL_108_gT_40E_P_S7_200_Germany",
  "GTPL_109_gT_40E_P_S7_200_Germany",
  "GTPL_110_gT_40E_P_S7_200_Germany",
  "GTPL_111_gT_80E_P_S7_200_Germany",
  "GTPL_112_gT_80E_P_S7_200_Germany",
  "GTPL_113_gT_80E_P_S7_200_Germany",
  "kabomachinedatasmart200",
  "GTPL_114_GT_140E_S7_1200",
  "GTPL_115_GT_180E_S7_1200",
  "GTPL_119_GT_180E_S7_1200",
  "GTPL_120_GT_180E_S7_1200",
  "GTPL_116_GT_240E_S7_1200",
  "GTPL_117_GT_320E_S7_1200",
  "GTPL_121_GT1000T",
  "gtpl_122_s7_1200_01",
  "GTPL_124_GT_450T_S7_1200",
  "GTPL_131_GT_650T_S7_1200",
  "GTPL_132_GT_650T_S7_1200"
] as const;

type TableName = typeof ALLOWED_TABLES[number];

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
  const { data: storeData } = useDataStore() as { data: any };

  // UPDATED: Get access array and handle empty/null cases
  const accessArray = (storeData?.user?.monitorAccess?.split(",") || [])
    .map((name: string) => name.trim().toLowerCase())
    .filter((name: string) => name.length > 0); // Remove empty strings

  // UPDATED: Get filtered devices with fallback to show all devices
  const getFilteredDevices = () => {
    // If accessArray is empty, show all devices
    if (accessArray.length === 0) {
      return allDevices;
    }

    // Filter devices based on access permissions
    const filtered = allDevices.filter((deviceName) => {
      // Hide devices that match any value in accessArray (case-insensitive)
      return !accessArray.some((access: string) => 
        deviceName.toLowerCase().includes(access) ||
        (DEVICE_TO_TABLE_MAP[deviceName] || "").toLowerCase().includes(access)
      );
    });

    // FALLBACK: If filtering results in no devices, show all devices
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

  // CHANGED: fetchData now decides endpoint based on dateRange
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
      let url: string;

      if (range && range[0] && range[1]) {
        // DATE SELECTED -> keep existing API
        const [startDate, endDate] = range;
        url = `/api/getAllDataSmart200?table=${encodeURIComponent(tableName)}&fromDate=${startDate.format(
          "YYYY-MM-DD"
        )}&toDate=${endDate.format("YYYY-MM-DD")}`;
      } else {
        // NO DATE -> use getReport (hardcoded 100 rows) and pass page
        const page = pageOverride ?? pagination.page ?? 1;
        url = `/api/getReports?table=${encodeURIComponent(tableName)}&page=${page}`;
      }

      const res = await fetch(url);
      const json: any = await res.json();

      setData(json?.data || []);
      setPagination({
        page: json.page || 1,
        limit: json.limit || (range ? 1000 : 100), // expect 100 from getReport, big limit when date-selected
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

  // Keep your downloadAllData as-is
  const downloadAllData = async () => {
    if (!dateRange) return;
    
    // Validate date range before downloading
    if (!validateDateRange(dateRange)) {
      return;
    }

    const tableName = DEVICE_TO_TABLE_MAP[selectedDevice];
    if (!tableName) return;
    
    setIsDownloading(true);
    setDownloadProgress(0);
    try {
      const [startDate, endDate] = dateRange;
      const url = `/api/getAllDataSmart200?table=${encodeURIComponent(
        tableName
      )}&fromDate=${startDate.format("YYYY-MM-DD")}&toDate=${endDate.format(
        "YYYY-MM-DD"
      )}&downloadAll=true`;

      const response = await fetch(url);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Download failed");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");
      const contentLength = parseInt(response.headers.get("Content-Length") || "0", 10);
      let receivedLength = 0;
      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedLength += value.length;
        if (contentLength > 0) {
          setDownloadProgress(Math.round((receivedLength / contentLength) * 100));
        }
      }

      const blob = new Blob(chunks);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${selectedDevice}_export.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      message.success("Data downloaded successfully!");
    } catch (err) {
      console.error("Download error:", err);
      message.error(err instanceof Error ? err.message : "An error occurred while downloading the data.");
    } finally {
      setIsDownloading(false);
    }
  };

  // CHANGED: also react to pagination.page when NO date
  useEffect(() => {
    if (selectedDevice) {
      if (dateRange) {
        fetchData(selectedDevice, dateRange);
      } else {
        fetchData(selectedDevice, null, pagination.page);
      }
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

  const downloadPDF = async () => {
    const input = document.getElementById("table-container");
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${selectedDevice}_data.pdf`);
    message.success("PDF file downloaded successfully!");
  };

  const keys = data.length ? Object.keys(data[0]) : [];

  const disabledDate = (current: Dayjs) => {
    const today = dayjs();
    const fiveDaysAgo = today.subtract(60, 'day');
    
    // Disable future dates (after today) and dates older than 60 days ago
    return current && (current.isAfter(today, 'day') || current.isBefore(fiveDaysAgo, 'day'));
  };

  return (
    <DashboardLayout>
      <div className="p-4">
        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Select value={selectedDevice} onValueChange={(deviceName: string) => setSelectedDevice(deviceName)}>
              <SelectTrigger className="w-[300px]">
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
              className="w-[300px]" 
              format="YYYY-MM-DD"
              placeholder={['Start Date', 'End Date']}
            />
          </div>

          <div className="flex gap-2 ml-auto">
            <Button
              onClick={downloadExcel}
              disabled={!data.length || loading || storeData?.user?.firstName === "Prosafe"}
            >
              {loading && <Spin size="small" className="mr-2" />}
              Download Excel
            </Button>
            <Button
              onClick={downloadAllData}
              disabled={!dateRange || isDownloading || storeData?.user?.firstName === "Prosafe"}
            >
              {isDownloading && <Spin size="small" className="mr-2" />}
              Download All (Date Range)
            </Button>
          </div>
        </div>

        {/* Date Range Info */}
        {dateRange && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Selected Date Range:</strong> {dateRange[0].format("YYYY-MM-DD")} to {dateRange[1].format("YYYY-MM-DD")} 
              ({dateRange[1].diff(dateRange[0], 'day') + 1} day{dateRange[1].diff(dateRange[0], 'day') !== 0 ? 's' : ''})
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Maximum allowed range is 3 days to manage data volume effectively.
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
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div id="table-container" className="border rounded-md overflow-x-auto">
            <Table className="min-w-full border border-gray-300">
              <TableHeader>
                <TableRow className="border-b border-gray-300">
                  {keys.map((key) => (
                    <TableHead
                      key={key}
                      className="border border-gray-300 bg-gray-100 text-center font-semibold text-sm p-2 whitespace-nowrap"
                    >
                      {key}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={keys.length || 1} className="text-center py-10 text-gray-500 text-sm">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, rowIndex) => (
                    <TableRow key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50">
                      {keys.map((key) => (
                        <TableCell
                          key={key}
                          className="border border-gray-300 text-center text-sm p-2 whitespace-nowrap overflow-hidden text-ellipsis"
                          title={String(row[key])}
                        >
                          {typeof row[key] === "boolean" ? (row[key] ? "True" : "False") : String(row[key])}
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
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} records
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (pagination.page > 1) {
                    const newPage = pagination.page - 1;
                    setPagination((prev: any) => ({ ...prev, page: newPage }));
                    if (!dateRange) fetchData(selectedDevice, null, newPage);
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
                    const newPage = pagination.page + 1;
                    setPagination((prev: any) => ({ ...prev, page: newPage }));
                    if (!dateRange) fetchData(selectedDevice, null, newPage);
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
    </DashboardLayout>
  );
}