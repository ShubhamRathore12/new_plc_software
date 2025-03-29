// app/notifications/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
// Import the Sidebar component
import { Card } from "@/components/ui/card"; // Assuming you have a Card component
import { Bell, CheckCircle, Info, XCircle, Menu } from "lucide-react"; // Import icons
import { Button } from "@/components/ui/button"; // Import Button component
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet components
import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function NotificationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".notification-card", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const notifications = [
    {
      id: 1,
      message: "New user registered",
      time: "2 mins ago",
      icon: <Bell className="w-5 h-5 text-blue-500" />,
    },
    {
      id: 2,
      message: "Server maintenance scheduled",
      time: "1 hour ago",
      icon: <Info className="w-5 h-5 text-yellow-500" />,
    },
    {
      id: 3,
      message: "New comment on your post",
      time: "3 hours ago",
      icon: <CheckCircle className="w-5 h-5 text-green-500" />,
    },
    {
      id: 4,
      message: "Password changed successfully",
      time: "5 hours ago",
      icon: <XCircle className="w-5 h-5 text-red-500" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50 dark:bg-black">
        {/* Hamburger Menu for Mobile */}

        <div ref={containerRef} className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
            Notifications
          </h1>

          <div className="grid grid-cols-1 gap-6">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className="notification-card p-4 hover:shadow-xl transition-shadow transform hover:scale-105 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center mb-2">
                  {notification.icon}
                  <p className="text-lg ml-2 text-black dark:text-white">
                    {notification.message}
                  </p>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {notification.time}
                </span>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
