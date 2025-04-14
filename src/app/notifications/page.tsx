// app/notifications/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card } from "@/components/ui/card";
import { Bell, CheckCircle, Info, XCircle } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useMediaQuery } from "../hooks/use-media-query";

export default function NotificationPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Fetch data from API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch("/api/allData"); // Adjust API path if needed
        const data = await res.json();
        const users = data.users || [];

        // Convert users to notification format (example logic)
        const formatted = users.map((user: any, index: number) => ({
          id: user.id || index,
          message: `${user.username || user.email} joined recently`,
          time: "Just now",
          icon: <Bell className="w-5 h-5 text-blue-500" />,
        }));

        setNotifications(formatted);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  // GSAP animation
  useEffect(() => {
    if (!loading && notifications.length > 0) {
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
    }
  }, [loading, notifications]);

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50 dark:bg-black">
        <div ref={containerRef} className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
            Notifications
          </h1>

          {loading ? (
            <p className="text-gray-500 dark:text-gray-300">Loading...</p>
          ) : (
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
