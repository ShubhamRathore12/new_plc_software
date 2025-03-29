// app/reports/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import { Card } from "@/components/ui/card";
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { PlusCircle } from "lucide-react";

export default function ReportsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".report-card", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const reports = [
    {
      id: 1,
      title: "Monthly Sales Report",
      description: "Sales data for the month of January.",
    },
    {
      id: 2,
      title: "User Engagement Report",
      description: "Analysis of user engagement metrics.",
    },
    {
      id: 3,
      title: "System Performance Report",
      description: "Performance metrics for the last quarter.",
    },
  ];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black p-6">
        <div ref={containerRef} className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Reports
            </h1>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md">
              <PlusCircle className="w-5 h-5" /> Add Report
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="report-card p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                  {report.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {report.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
