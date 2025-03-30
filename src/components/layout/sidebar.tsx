"use client";

import {
  MonitorIcon,
  LayoutDashboard,
  Bell,
  Users,
  Zap,
  Layers,
  FileText,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useSidebarStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const menuItems = [
  { icon: MonitorIcon, label: "Overview", href: "/" },
  {
    icon: MapPin,
    label: "Monitoring Locations",
    href: "/monitoring-locations",
  },
  { icon: LayoutDashboard, label: "Dashboards", href: "/dashboard" },
  { icon: MonitorIcon, label: "Devices", href: "/devices" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
  { icon: Users, label: "Contacts", href: "/contacts" },
  { icon: Zap, label: "Triggers", href: "/triggers" },
  { icon: Layers, label: "Clusters", href: "/clusters" },
  { icon: FileText, label: "Reports", href: "/reports" },
  { icon: LayoutDashboard, label: "Registration", href: "/registration-form" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <div className="w-64 bg-[#1e293b] text-white min-h-screen dark:bg-gray-800 dark:text-white relative">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <MonitorIcon className="h-6 w-6" />
          <span className="font-semibold">Faction IO Sense</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-8 w-8 rounded-full bg-gray-400" />
          <span className="text-sm">Deepak Madan</span>
        </div>
        <nav className="space-y-1">
          {menuItems.map((item, index) => {
            const active = pathname === item.href;
            return (
              <button
                key={index}
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded text-sm w-full text-left",
                  active ? "bg-blue-600" : "hover:bg-gray-700"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="absolute bottom-4 left-4 text-xs text-gray-400">
        Faction Labs
      </div>
    </div>
  );
}
