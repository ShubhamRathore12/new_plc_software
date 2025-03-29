// app/reports/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

import { Card } from "@/components/ui/card"; // Assuming you have a Card component
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { PlusCircle } from "lucide-react";

export default function ReportsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
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
      <div className="flex h-screen bg-gray-50 dark:bg-black">
        {/* Sidebar for larger screens */}
        <div ref={containerRef} className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
            Reports
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card
                key={report.id}
                className="report-card p-4 hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  {report.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {report.description}
                </p>
              </Card>
            ))}
          </div>

          <button className="mt-6 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            <PlusCircle className="w-4 h-4 inline" /> Add Report
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
