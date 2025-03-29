// app/fault/page.tsx
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useRouter } from "next/navigation";
// Import the Sidebar

interface FaultLog {
  no: number;
  time: string;
  date: string;
  text: string;
}

const FaultLog: React.FC = () => {
  // Fault log data based on the image
  const faultLogs: FaultLog[] = [
    {
      no: 4,
      time: "16:48:26",
      date: "2023/10/27",
      text: "Blower circuit breaker fault",
    },
    {
      no: 23,
      time: "16:48:24",
      date: "2023/10/27",
      text: "Conder fan 4 circuit breaker fault",
    },
    {
      no: 22,
      time: "16:48:24",
      date: "2023/10/27",
      text: "Conder fan 3 circuit breaker fault",
    },
    {
      no: 1,
      time: "16:47:23",
      date: "2023/10/27",
      text: "Compressor circuit breaker fault",
    },
    {
      no: 23,
      time: "16:47:20",
      date: "2023/10/27",
      text: "Conder fan 4 circuit breaker fault",
    },
    {
      no: 22,
      time: "16:47:18",
      date: "2023/10/27",
      text: "Conder fan 3 circuit breaker fault",
    },
  ];

  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Main Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              FAULT LOG
            </h1>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              2023/10/27 16:48:33
            </span>
          </div>

          {/* Fault Log Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-800 dark:text-gray-100">
                    No.
                  </TableHead>
                  <TableHead className="text-gray-800 dark:text-gray-100">
                    Time
                  </TableHead>
                  <TableHead className="text-gray-800 dark:text-gray-100">
                    Date
                  </TableHead>
                  <TableHead className="text-gray-800 dark:text-gray-100">
                    Text
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {faultLogs.map((log) => (
                  <TableRow key={`${log.no}-${log.time}`}>
                    <TableCell className="text-gray-800 dark:text-gray-100">
                      {log.no}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-100">
                      {log.time}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-100">
                      {log.date}
                    </TableCell>
                    <TableCell className="text-gray-800 dark:text-gray-100">
                      {log.text}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Back Button */}
          <div className="mt-4">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-600"
              onClick={() => router.push("/menu")} // Navigate back to the menu page
            >
              BACK
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FaultLog;
