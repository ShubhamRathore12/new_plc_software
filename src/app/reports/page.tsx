"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DatePicker, Spin, message } from "antd";
import type { DatePickerProps } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSpreadsheet,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Database,
  Filter,
  FileDown,
  AlertCircle,
  Loader2,
} from "lucide-react";

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
import {
  ALL_DEVICE_NAMES,
  DEVICE_TO_TABLE_MAP,
  ALL_TABLE_NAMES,
} from "@/lib/machineRegistry";

const { RangePicker } = DatePicker;

// Derived from centralized registry — no manual updates needed
const allDevices = ALL_DEVICE_NAMES;
const ALLOWED_TABLES = ALL_TABLE_NAMES;

type TableName = string;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const tableRowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.02, duration: 0.3 },
  }),
};

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
    .filter((name: string) => name.length > 0);

  // UPDATED: Get filtered devices with fallback to show all devices
  const getFilteredDevices = () => {
    if (accessArray.length === 0) {
      return allDevices;
    }
    const filtered = allDevices.filter((deviceName) => {
      return !accessArray.some(
        (access: string) =>
          deviceName.toLowerCase().includes(access) ||
          (DEVICE_TO_TABLE_MAP[deviceName] || "").toLowerCase().includes(access)
      );
    });
    return filtered.length > 0 ? filtered : allDevices;
  };

  const filteredDevices = getFilteredDevices();

  const [selectedDevice, setSelectedDevice] = useState<string>(
    filteredDevices[0] || ""
  );

  useEffect(() => {
    if (filteredDevices.length > 0) {
      if (!selectedDevice || !filteredDevices.includes(selectedDevice)) {
        setSelectedDevice(filteredDevices[0]);
      }
    } else {
      setSelectedDevice("");
    }
  }, [filteredDevices, selectedDevice]);

  // Function to validate date range (max 3 days)
  const validateDateRange = (dates: [Dayjs, Dayjs] | null): boolean => {
    if (!dates || !dates[0] || !dates[1]) return true;
    const [startDate, endDate] = dates;
    const daysDifference = endDate.diff(startDate, "day");
    if (daysDifference > 3) {
      toast.error(
        "Please select a date range of maximum 3 days. Higher date ranges may result in large amounts of data."
      );
      return false;
    }
    return true;
  };

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
        const [startDate, endDate] = range;
        url = `/api/getAllDataSmart200?table=${encodeURIComponent(
          tableName
        )}&fromDate=${startDate.format("YYYY-MM-DD")}&toDate=${endDate.format(
          "YYYY-MM-DD"
        )}`;
      } else {
        const page = pageOverride ?? pagination.page ?? 1;
        url = `/api/getReports?table=${encodeURIComponent(
          tableName
        )}&page=${page}`;
      }

      const res = await fetch(url);
      const json: any = await res.json();

      setData(json?.data || []);
      setPagination({
        page: json.page || 1,
        limit: json.limit || (range ? 1000 : 100),
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

  const downloadAllData = async () => {
    if (!dateRange) return;
    if (!validateDateRange(dateRange)) return;

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
      message.error(
        err instanceof Error
          ? err.message
          : "An error occurred while downloading the data."
      );
    } finally {
      setIsDownloading(false);
    }
  };

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
    setPagination((p: any) => ({ ...p, page: 1 }));
    if (dates && dates[0] && dates[1]) {
      const dateRangeToValidate: [Dayjs, Dayjs] = [dates[0], dates[1]];
      if (validateDateRange(dateRangeToValidate)) {
        setDateRange(dateRangeToValidate);
      } else {
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
    const fiveDaysAgo = today.subtract(60, "day");
    return (
      current &&
      (current.isAfter(today, "day") || current.isBefore(fiveDaysAgo, "day"))
    );
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

  return (
    <DashboardLayout>
      <motion.div
        className="p-4 md:p-6 min-h-screen"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Reports
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View and export machine data records
              </p>
            </div>
          </div>
        </motion.div>

        {/* Filters Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Filters & Controls
            </span>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
            {/* Device Select */}
            <div className="flex-1 min-w-[250px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                Machine Device
              </label>
              <Select
                value={selectedDevice}
                onValueChange={(deviceName: string) =>
                  setSelectedDevice(deviceName)
                }
              >
                <SelectTrigger className="w-full h-10 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-400 transition-colors">
                  <div className="flex items-center gap-2">
                    <Search className="h-3.5 w-3.5 text-gray-400" />
                    <SelectValue placeholder="Select a device" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {filteredDevices.map((deviceName) => (
                    <SelectItem key={deviceName} value={deviceName}>
                      {deviceName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="min-w-[280px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                Date Range (max 3 days)
              </label>
              <RangePicker
                disabledDate={disabledDate}
                onChange={handleDateChange}
                className="w-full h-10 rounded-lg"
                format="YYYY-MM-DD"
                placeholder={["Start Date", "End Date"]}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={downloadExcel}
                  disabled={
                    !data.length ||
                    loading ||
                    storeData?.user?.firstName === "Prosafe"
                  }
                  variant="outline"
                  className="h-10 gap-2 rounded-lg border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="h-4 w-4" />
                  )}
                  Excel
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={downloadAllData}
                  disabled={
                    !dateRange ||
                    isDownloading ||
                    storeData?.user?.firstName === "Prosafe"
                  }
                  className="h-10 gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20"
                >
                  {isDownloading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileDown className="h-4 w-4" />
                  )}
                  Export All
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Date Range Info Badge */}
          <AnimatePresence>
            {dateRange && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>
                      {dateRange[0].format("MMM DD, YYYY")} &mdash;{" "}
                      {dateRange[1].format("MMM DD, YYYY")}
                    </strong>{" "}
                    ({dateRange[1].diff(dateRange[0], "day") + 1} day
                    {dateRange[1].diff(dateRange[0], "day") !== 0 ? "s" : ""})
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap items-center gap-4 mb-4"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
              {selectedDevice}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {pagination.total.toLocaleString()} total records
          </div>
          {!dateRange && (
            <div className="text-xs text-gray-400">
              Page {pagination.page} of {totalPages}
            </div>
          )}
        </motion.div>

        {/* Download Progress Dialog */}
        <Dialog open={isDownloading} onOpenChange={setIsDownloading}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-500 animate-bounce" />
                Downloading Data
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-2">
              <div className="relative">
                <Progress
                  value={downloadProgress}
                  className="w-full h-3 rounded-full"
                />
                <span className="absolute right-0 -top-5 text-xs font-semibold text-blue-600">
                  {downloadProgress}%
                </span>
              </div>
              <p className="text-center text-sm text-gray-500">
                Exporting <strong>{selectedDevice}</strong> data...
                {downloadProgress < 100 ? " Please wait" : " Complete!"}
              </p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Table Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Table Header Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Records
              </span>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full">
                {data.length} shown
              </span>
            </div>
          </div>

          {/* Table Content */}
          {loading ? (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full border-4 border-gray-200 dark:border-gray-700" />
                <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
              </div>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Loading data...
              </p>
            </motion.div>
          ) : data.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-20"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <AlertCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No records found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try selecting a different device or date range
              </p>
            </motion.div>
          ) : (
            <div id="table-container" className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    {keys.map((key) => (
                      <TableHead
                        key={key}
                        className="bg-gray-50 dark:bg-gray-800 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-3 whitespace-nowrap"
                      >
                        {key}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, rowIndex) => (
                    <motion.tr
                      key={rowIndex}
                      custom={rowIndex}
                      variants={tableRowVariants}
                      initial="hidden"
                      animate="visible"
                      className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                    >
                      {keys.map((key) => (
                        <TableCell
                          key={key}
                          className="text-center text-sm px-4 py-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300"
                          title={String(row[key])}
                        >
                          {typeof row[key] === "boolean" ? (
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                                row[key]
                                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
                              }`}
                            >
                              {row[key] ? "True" : "False"}
                            </span>
                          ) : (
                            String(row[key])
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        <AnimatePresence>
          {pagination.total > 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-between mt-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 px-5 py-3"
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Showing{" "}
                <strong className="text-gray-700 dark:text-gray-200">
                  {(pagination.page - 1) * pagination.limit + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-gray-700 dark:text-gray-200">
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.total
                  )}
                </strong>{" "}
                of{" "}
                <strong className="text-gray-700 dark:text-gray-200">
                  {pagination.total.toLocaleString()}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 rounded-lg"
                    onClick={() => {
                      if (pagination.page > 1) {
                        const newPage = pagination.page - 1;
                        setPagination((prev: any) => ({
                          ...prev,
                          page: newPage,
                        }));
                        if (!dateRange)
                          fetchData(selectedDevice, null, newPage);
                      }
                    }}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                </motion.div>

                <div className="flex items-center gap-1 px-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {pagination.page}
                  </span>
                  <span className="text-sm text-gray-400">/</span>
                  <span className="text-sm text-gray-500">{totalPages}</span>
                </div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 rounded-lg"
                    onClick={() => {
                      if (
                        pagination.page * pagination.limit <
                        pagination.total
                      ) {
                        const newPage = pagination.page + 1;
                        setPagination((prev: any) => ({
                          ...prev,
                          page: newPage,
                        }));
                        if (!dateRange)
                          fetchData(selectedDevice, null, newPage);
                      }
                    }}
                    disabled={
                      pagination.page * pagination.limit >= pagination.total
                    }
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </DashboardLayout>
  );
}
