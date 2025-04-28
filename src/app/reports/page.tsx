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
} from "@/components/ui/table"; // shadcn table
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function TableWithDownload() {
  const [data, setData] = useState<Record<string, any>[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/getAllData");
      const json = await res.json();
      setData(json);
    }
    fetchData();
  }, []);

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

  if (!data.length) {
    return <p>Loading data...</p>;
  }

  const keys = Object.keys(data[0]);

  return (
    <DashboardLayout>
      <div className="p-4">
        {/* Download Buttons */}
        <div className="flex gap-4 mb-4">
          <button
            onClick={downloadExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download Excel
          </button>
        </div>

        {/* Table */}
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
              {data.map((row, rowIndex) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
