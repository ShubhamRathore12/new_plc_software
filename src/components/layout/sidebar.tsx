"use client";

import { MonitorIcon, LayoutDashboard, Users, Loader2 } from "lucide-react";
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
  { icon: Users, label: "users", href: "/users" },
];

// Items shown only to a specific account type, regardless of monitorAccess
const accountTypeOnlyItems: Record<string, string> = {
  users: "manufactura",
};

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebarStore();
  const { data } = useDataStore() as { data: StoreData };
  const { t, language } = useLanguage();
  const validMenuLabels = menuItems.map(item => item.label.toLowerCase());

  const [mounted, setMounted] = useState(false);
  const [monitorAccessItems, setMonitorAccessItems] = useState<string[]>([]);
  const [showAllItems, setShowAllItems] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  // Parse monitorAccess from data
  useEffect(() => {
    if (typeof data?.user?.monitorAccess === "string") {
      const monitorAccessValue = data.user.monitorAccess;
      
      // If monitorAccess is "0" or empty, show all items
      if (monitorAccessValue === "0" || monitorAccessValue === "") {
        setMonitorAccessItems([]);
        setShowAllItems(true);
      } else {
        // Otherwise, parse the access values
        const parsed = monitorAccessValue
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter((item) => validMenuLabels.includes(item));
        setMonitorAccessItems(parsed);
        setShowAllItems(false);
      }
    } else {
      setMonitorAccessItems([]);
      setShowAllItems(true);
    }
  }, [data?.user?.monitorAccess, language]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Clear navigating state when pathname changes (navigation completed)
  useEffect(() => {
    setNavigatingTo(null);
  }, [pathname]);

  if (!mounted) return null;

  const handleNavigation = (href: string) => {
    if (pathname === href || navigatingTo === href) return;
    setNavigatingTo(href);
    router.push(href);
  };

  return (
    <div className="bg-sidebar text-sidebar-foreground border-sidebar-border relative flex h-full min-h-screen w-64 flex-col border-r">
      <div className="border-sidebar-border/70 border-b px-5 py-4">
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

      <div className="flex-1 px-4 py-5">
        <div className="bg-sidebar-accent/60 mb-6 flex items-center gap-3 rounded-xl px-3 py-2.5">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold">
            {data?.user?.firstName?.charAt(0).toUpperCase() ?? "?"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {data?.user?.firstName ?? "—"}
            </p>
            <p className="text-sidebar-foreground/55 truncate text-xs capitalize">
              {data?.user?.accountType ?? ""}
            </p>
          </div>
        </div>

        <nav className="space-y-1.5" key={language}>
          {menuItems
            .filter(
              (item) => {
                // Account-type gated items ignore monitorAccess entirely
                const requiredAccountType = accountTypeOnlyItems[item.label];
                if (requiredAccountType) {
                  return data?.user?.accountType === requiredAccountType;
                }

                // If showAllItems is true (monitorAccess is "0" or empty), show all items
                // Otherwise, hide items that are NOT in monitorAccess
                const isHiddenByMonitorAccess = showAllItems 
                  ? false  // Show all when monitorAccess is "0" or empty
                  : !monitorAccessItems.includes(item.label.toLowerCase());
                
                // Hide overview for customer account type
                const isOverviewHiddenForCustomer = item.label === "overview" && data?.user?.accountType === "customer";
                
                return !isHiddenByMonitorAccess && !isOverviewHiddenForCustomer;
              }
            )
            .map((item, index) => {
              // Keep "devices" active when on /menu/... pages
              const active = pathname === item.href ||
                (item.href === "/devices" && pathname.startsWith("/menu"));
              const isNavigating = navigatingTo === item.href;
              return (
                <button
                  key={index}
                  onClick={() => handleNavigation(item.href)}
                  disabled={isNavigating}
                  className={cn(
                    "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium",
                    "transition-[background-color,color] duration-[var(--motion-fast)] ease-[var(--ease-out)]",
                    "focus-visible:ring-sidebar-ring/60 outline-none focus-visible:ring-2",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isNavigating && "opacity-70"
                  )}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "bg-sidebar-primary absolute top-1/2 left-0 h-5 w-[3px] -translate-y-1/2 rounded-r-full",
                      "transition-opacity duration-[var(--motion-fast)]",
                      active ? "opacity-0" : "opacity-0 group-hover:opacity-60"
                    )}
                  />
                  {isNavigating ? (
                    <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                  ) : (
                    <item.icon className="h-4 w-4 shrink-0" />
                  )}
                  <span className="truncate capitalize">{t(item.label)}</span>
                </button>
              );
            })}
        </nav>
      </div>

      <div className="border-sidebar-border/70 mt-auto border-t px-5 py-4">
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