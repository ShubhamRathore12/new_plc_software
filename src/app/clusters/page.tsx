// app/clusters/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card"; // Assuming you have a Card component
import { PlusCircle, Menu } from "lucide-react"; // Import icons
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function ClustersPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".cluster-card", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const clusters = [
    { id: 1, name: "Cluster 1", description: "Description for cluster 1" },
    { id: 2, name: "Cluster 2", description: "Description for cluster 2" },
    { id: 3, name: "Cluster 3", description: "Description for cluster 3" },
  ];

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50 dark:bg-black">
        {/* Hamburger Menu for Mobile */}

        {/* Sidebar for larger screens */}
        <div ref={containerRef} className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
            Clusters
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clusters.map((cluster) => (
              <Card
                key={cluster.id}
                className="cluster-card p-4 hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-lg font-semibold text-black dark:text-white">
                  {cluster.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cluster.description}
                </p>
              </Card>
            ))}
          </div>

          <button className="mt-6 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
            <PlusCircle className="w-4 h-4 inline" /> Add Cluster
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
