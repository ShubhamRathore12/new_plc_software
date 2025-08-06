"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { DatePicker, Spin } from "antd";
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

const { RangePicker } = DatePicker;

// All available table names
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
] as const;

// Display name mapping
const TABLE_DISPLAY_NAMES: Record<string, string> = {
  "GTPL_108_gT_40E_P_S7_200_Germany": "GTPL-108-gT-40E-P-S7-200-Germany",
  "GTPL_109_gT_40E_P_S7_200_Germany": "GTPL-109-gT-40E-P-S7-200-Germany",
  "GTPL_110_gT_40E_P_S7_200_Germany": "GTPL-110-gT-40E-P-S7-200-Germany",
  "GTPL_111_gT_80E_P_S7_200_Germany": "GTPL-111-gT-80E-P-S7-200-Germany",
  "GTPL_112_gT_80E_P_S7_200_Germany": "GTPL-112-gT-80E-P-S7-200-Germany",
  "GTPL_113_gT_80E_P_S7_200_Germany": "GTPL-113-gT-80E-P-S7-200-Germany",
  "kabomachinedatasmart200": "Kabo Machine Data Smart 200",
  "GTPL_114_GT_140E_S7_1200": "GTPL-30-gT-180E-S7-1200",
  "GTPL_115_GT_180E_S7_1200": "GTPL-115-GT-180E-S7-1200",
  "GTPL_119_GT_180E_S7_1200": "GTPL-119-GT-180E-S7-1200",
  "GTPL_120_GT_180E_S7_1200": "GTPL-120-GT-180E-S7-1200",
  "GTPL_116_GT_240E_S7_1200": "GTPL-116-GT-240E-S7-1200",
  "GTPL_117_GT_320E_S7_1200": "GTPL-117-GT-320E-S7-1200",
  "GTPL_121_GT1000T": "GTPL-121-GT1000T",
  "gtpl_122_s7_1200_01": "GTPL-122-S7-1200-01",
};

type TableName = typeof ALLOWED_TABLES[number];

interface Pagination {
  page: number;
  limit: number;
  total: number;
}

interface ApiResponse {
  data: Record<string, any>[];
  page: number;
  limit: number;
  total: number;
  table: string;
  timestampColumn?: string | null;
  dateFilter: {
    fromDate?: string;
    toDate?: string;
    applied: boolean;
  };
}

export default function TableWithDownload() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [selectedTable, setSelectedTable] = useState<TableName>(ALLOWED_TABLES[0]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 1000,
    total: 0,
  });
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const { data:storeData } = useDataStore() as { data: any };

  const fetchData = async (table: TableName, dateRange?: [Dayjs, Dayjs] | null) => {
    setLoading(true);
    try {
      let url = `/api/getAllDataSmart200?table=${encodeURIComponent(table)}`;
      
      if (dateRange) {
        const [startDate, endDate] = dateRange;
        url += `&fromDate=${startDate.format('YYYY-MM-DD')}&toDate=${endDate.format('YYYY-MM-DD')}`;
      }

      const res = await fetch(url);
      const json: ApiResponse = await res.json();
      
      setData(json?.data || []);
      setPagination({
        page: json.page || 1,
        limit: json.limit || 1000,
        total: json.total || 0,
      });
    } catch (err) {
      console.error("Fetch error:", err);
      setData([]);
    }
    setLoading(false);
  };

const downloadAllData = async () => {
  if (!dateRange) return;

  setIsDownloading(true);
  setDownloadProgress(0);

  try {
    const [startDate, endDate] = dateRange;
    const url = `/api/getAllDataSmart200?table=${encodeURIComponent(selectedTable)}&fromDate=${startDate.format('YYYY-MM-DD')}&toDate=${endDate.format('YYYY-MM-DD')}&downloadAll=true`;

    const response = await fetch(url);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Download failed");
    }

    // Get the reader for streaming the response
    const reader = response.body?.getReader();
    if (!reader) throw new Error("No reader available");

    // Get content length for progress calculation
    const contentLength = parseInt(response.headers.get('Content-Length') || '0', 10);
    let receivedLength = 0;
    let chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      receivedLength += value.length;
      
      // Update progress
      if (contentLength > 0) {
        const progress = Math.round((receivedLength / contentLength) * 100);
        setDownloadProgress(progress);
      }
    }

    // Combine chunks
    const blob = new Blob(chunks);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${selectedTable}_export.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

  } catch (err) {
    console.error("Download error:", err);
    alert(err instanceof Error ? err.message : 'An error occurred while downloading the data.');
  } finally {
    setIsDownloading(false);
  }
};

  useEffect(() => {
    fetchData(selectedTable, dateRange);
  }, [selectedTable, dateRange]);

  const handleDateChange = (
    dates: [Dayjs | null, Dayjs | null] | null,
    dateStrings: [string, string]
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange(null);
    }
  };

  const downloadExcel = () => {
    if (!data.length) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${selectedTable}_data.xlsx`);
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
    pdf.save(`${selectedTable}_data.pdf`);
  };

  const keys = data.length ? Object.keys(data[0]) : [];

  return (
    <DashboardLayout>
      <div className="p-4">
        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-4 items-start md:items-center">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <Select
              value={selectedTable}
              onValueChange={(value: TableName) => setSelectedTable(value)}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a table" />
              </SelectTrigger>
              <SelectContent>
                {ALLOWED_TABLES.map(table => (
                  <SelectItem key={table} value={table}>
                    {TABLE_DISPLAY_NAMES[table] || table}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <RangePicker
              onChange={handleDateChange}
              className="w-[300px]"
              format="YYYY-MM-DD"
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
            {/* <Button
              variant="outline"
              onClick={downloadPDF}
              disabled={!data.length || loading}
            >
              {loading && <Spin size="small" className="mr-2" />}
              Download PDF
            </Button> */}
            <Button
              onClick={downloadAllData}
              disabled={!dateRange || isDownloading ||  storeData?.user?.firstName === "Prosafe"}
            >
              {isDownloading && <Spin size="small" className="mr-2" />}
              Download All (Date Range)
            </Button>
          </div>
        </div>

        {/* Download Progress Dialog */}
    {/* Download Progress Dialog */}
<Dialog open={isDownloading} onOpenChange={setIsDownloading}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Downloading Data</DialogTitle>
    </DialogHeader>
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Progress value={downloadProgress} className="w-full" />
        <span className="ml-2 text-sm font-medium text-gray-700">
          {downloadProgress}%
        </span>
      </div>
      <p className="text-center text-sm text-gray-500">
        Downloading {TABLE_DISPLAY_NAMES[selectedTable] || selectedTable} data...
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
          <div
            id="table-container"
            className="border rounded-md overflow-x-auto"
          >
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
                    <TableCell
                      colSpan={keys.length || 1}
                      className="text-center py-10 text-gray-500 text-sm"
                    >
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, rowIndex) => (
                    <TableRow
                      key={rowIndex}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {keys.map((key) => (
                        <TableCell
                          key={key}
                          className="border border-gray-300 text-center text-sm p-2 whitespace-nowrap overflow-hidden text-ellipsis"
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
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
              {pagination.total} records
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  if (pagination.page > 1) {
                    setPagination(prev => ({ ...prev, page: prev.page - 1 }));
                    fetchData(selectedTable, dateRange);
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
                    setPagination(prev => ({ ...prev, page: prev.page + 1 }));
                    fetchData(selectedTable, dateRange);
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