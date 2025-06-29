"use client";

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DashboardLayout from "@/components/layout/dashboard-layout";

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
];

export default function TableWithDownload() {
  const [data, setData] = useState<Record<string, any>[]>([]);
  const [selectedTable, setSelectedTable] = useState(ALLOWED_TABLES[0]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (table: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/getAllDataSmart200?table=${encodeURIComponent(table)}`
      );
      const json = await res.json();
      setData(json?.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(selectedTable);
  }, [selectedTable]);

  const downloadExcel = () => {
    if (!data.length) return;
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, "data.xlsx");
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
    pdf.save("data.pdf");
  };

  const keys = data.length ? Object.keys(data[0]) : [];

  return (
    <DashboardLayout>
      <div className="p-4">
        {/* Dropdown and Buttons */}
        <div className="flex gap-4 mb-4 items-center flex-wrap">
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="border px-4 py-2 rounded-md text-sm"
          >
            {ALLOWED_TABLES.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>

          <button
            onClick={downloadExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
          >
            Download Excel
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
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
      </div>
    </DashboardLayout>
  );
}
