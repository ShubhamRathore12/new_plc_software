"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  Wind,
  AlertTriangle,
  Settings,
  ToggleLeft,
  ToggleRight,
  TestTube,
} from "lucide-react";
import { motion } from "framer-motion";
import { PageTransition } from "@/components/ui/animated-container";
import { Logo } from "@/components/logo";
import { useDataStore } from "@/lib/dataStore";

interface UserData {
  monitorAccess?: string; // Comma-separated items
}

interface StoreData {
  user?: UserData;
}

type MenuItem = {
  icon: React.ElementType;
  title: string;
  path: string;
};

export default function Home() {
  const router = useRouter();
  const [is3D, setIs3D] = useState(false);

  const { data } = useDataStore() as { data: StoreData };

  const { section } = useParams();
  const device = Array.isArray(section) ? section[0] : section?.toString();

  const [monitorAccessItems, setMonitorAccessItems] = useState<string[]>([]);

  useEffect(() => {
    if (typeof data?.user?.monitorAccess === "string") {
      const parsed = data.user.monitorAccess
        .split(",")
        .map((item) => item.trim().toLowerCase());
      setMonitorAccessItems(parsed);
    } else {
      setMonitorAccessItems([]);
    }
  }, [data?.user?.monitorAccess]);

  const handleToggle = (section: string | undefined |  any) => {
    if (!is3D) {
      setIs3D(true);
      if (section) {
        router.push(`/3d/${section}`);
      }
    } else {
      setIs3D(false);
    }
  };

  const menuItems: MenuItem[] = [
    { icon: Activity, title: "AUTO", path: "auto" },
    { icon: Wind, title: "AERATION", path: "aerations" },
    { icon: AlertTriangle, title: "FAULT", path: "fault" },
    { icon: Settings, title: "SETTINGS", path: "settings" },
    { icon: ToggleLeft, title: "INPUTS", path: "inputs" },
    { icon: ToggleRight, title: "OUTPUTS", path: "outputs" },
    { icon: TestTube, title: "TEST", path: "test" },
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

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          {/* Header */}
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
            <h1 className="text-3xl font-bold tracking-tight mb-2">{device}</h1>
            <p className="text-muted-foreground">Select an option to continue</p>

            <div className="absolute right-0 top-0 flex items-center space-x-2">
              <span className="text-sm font-medium text-muted-foreground">
                {is3D ? "3D" : "2D"}
              </span>
              <button
                onClick={() => handleToggle(section as any)}
                className="p-2 hover:opacity-75"
              >
                {is3D ? (
                  <ToggleRight className="h-6 w-6 text-primary" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-primary" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Menu Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {menuItems
              .filter(
                (item) => !monitorAccessItems.includes(item.path.toLowerCase())
              )
              .map((item) => (
                <motion.div key={item.title}>
                  <Card
                    onClick={() => router.push(`/menu/${item.path}/${device}`)}
                    className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full"
                  >
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      
                      <item.icon className="h-12 w-12 mb-4 text-primary" />
                      <h2 className="text-xl font-semibold">{item.title}</h2>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
