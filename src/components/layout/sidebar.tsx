"use client";

import { MonitorIcon, LayoutDashboard, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useDataStore, useSidebarStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Img from "../../../public/logo.png";
import { useLanguage } from "@/providers/language-provider";

// Define types
interface UserData {
  monitorAccess?: string;
  firstName?: string;
  accountType?: string;
}

interface StoreData {
  user?: UserData;
}

// All menu items
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
  const { data } = useDataStore() as { data: StoreData };
  const { t, language } = useLanguage();

  const [mounted, setMounted] = useState(false);
  const [monitorAccessItems, setMonitorAccessItems] = useState<string[]>([]);

  // Parse monitorAccess from data
  useEffect(() => {
    if (typeof data?.user?.monitorAccess === "string") {
      const parsed = data.user.monitorAccess
        .split(",")
        .map((item) => item.trim().toLowerCase());
      setMonitorAccessItems(parsed);
    } else {
      setMonitorAccessItems([]);
    }
  }, [data?.user?.monitorAccess, language]);

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
          <Image 
            src={data?.user?.firstName === "Prosafe" 
              ? "https://tse4.mm.bing.net/th/id/OIP.ce32nMlZhhVQW72b6lMcawAAAA?rs=1&pid=ImgDetMain&o=7&rm=3"
              : Img} 
            alt="logo" 
            width={200} 
            height={200}
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/logo.jpeg';
            }}
          />
          <span className="font-semibold">{data?.user?.firstName === "Prosafe" ? "Prosafe":null}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center space-x-2 mb-6">
          <div className="h-8 w-8 rounded-full bg-gray-400 text-white flex items-center justify-center font-medium text-sm">
            {data?.user?.firstName?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <span className="text-sm">{data?.user?.firstName}</span>
        </div>

        <nav className="space-y-1" key={language}>
          {menuItems
            .filter(
              (item) => {
                // Hide items based on monitorAccess
                const isHiddenByMonitorAccess = monitorAccessItems.includes(item.label.toLowerCase());
                
                // Hide overview for customer account type
                const isOverviewHiddenForCustomer = item.label === "overview" && data?.user?.accountType === "customer";
                
                return !isHiddenByMonitorAccess && !isOverviewHiddenForCustomer;
              }
            )
            .map((item, index) => {
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
        {data?.user?.firstName === "Prosafe" 
              ?     <Image 
          src="https://tse4.mm.bing.net/th/id/OIP.ce32nMlZhhVQW72b6lMcawAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" 
          alt="logo" 
          width={200} 
          height={50}
          priority
        /> 
              :     <Image 
          src={Img} 
          alt="logo" 
          width={500} 
          height={100}
          priority
        />}
      </div>
    </div>
  );
}