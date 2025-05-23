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
import { useDataStore, useSidebarStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Img from "../../../public/logo.jpeg";
import { useLanguage } from "@/providers/language-provider";

const menuItems = [
  { icon: LayoutDashboard, label: "overview", href: "/dashboard" },
  { icon: MonitorIcon, label: "devices", href: "/devices" },
  { icon: Users, label: "contacts", href: "/contacts" },
  { icon: LayoutDashboard, label: "registration", href: "/registration-form" },
  { icon: LayoutDashboard, label: "reports", href: "/reports" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebarStore();
  const [mounted, setMounted] = useState(false);
  const { data } = useDataStore();
  const { t } = useLanguage();

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
          <Image src={Img} alt="logo" width={100} height={100} />
          <span className="font-semibold">Grain Technik</span>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-8 w-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-medium text-sm">
            {data?.user?.firstName?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <span className="text-sm">{data?.user?.firstName}</span>
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
                <span>{t(item.label)}</span>
              </button>
            );
          })}
        </nav>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Image src={Img} alt="logo" width={500} height={100} />
      </div>
    </div>
  );
}
