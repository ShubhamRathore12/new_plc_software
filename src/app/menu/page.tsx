"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // for navigation
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import {
  Activity,
  Wind,
  AlertTriangle,
  Settings,
  ToggleLeft,
  ToggleRight,
  TestTube,
  Sun,
} from "lucide-react";

import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/animated-container";
import Header from "@/components/layout/header";
import { Logo } from "@/components/logo";
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function Home() {
  const router = useRouter();
  const [is3D, setIs3D] = useState(false); // toggle state

  const handleToggle = () => {
    if (!is3D) {
      setIs3D(true);
      router.push("/3doverview"); // navigate to 3D screen
    } else {
      setIs3D(false);
      // staying on 2D (menu) view
    }
  };

  const menuItems = [
    { icon: Activity, title: "AUTO", href: "menu/auto" },
    { icon: Wind, title: "AERATION", href: "menu/aerations" },
    { icon: AlertTriangle, title: "FAULT", href: "menu/fault" },
    { icon: Settings, title: "SETTINGS", href: "menu/settings" },
    { icon: ToggleLeft, title: "INPUTS", href: "menu/inputs" },
    { icon: ToggleRight, title: "OUTPUTS", href: "menu/outputs" },
    { icon: TestTube, title: "TEST", href: "menu/test" },
    // { icon: Sun, title: "SCREEN BRIGHTNESS", href: "menu/brightness" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          {/* Top header with logo, title, and toggle */}
          <motion.div
            className="mb-8 text-center relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-center mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">MENU</h1>
            <p className="text-muted-foreground">
              Select an option to continue
            </p>

            {/* Toggle switch at top-right */}
            <div className="absolute right-0 top-0 flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">
                {is3D ? "3D" : "2D"}
              </span>
              <button onClick={handleToggle} className="p-2 hover:opacity-75">
                {is3D ? (
                  <ToggleRight className="h-6 w-6 text-primary" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-primary" />
                )}
              </button>
            </div>
          </motion.div>

          {/* 2D Menu Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {menuItems.map((item, index) => (
              <motion.div key={item.title}>
                <Link href={item.href} passHref>
                  <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <item.icon className="h-12 w-12 mb-4 text-primary" />
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
