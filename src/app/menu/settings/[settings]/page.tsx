"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Settings2, Clock, Sliders, Timer, Database } from "lucide-react";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useParams();
  const device = searchParams["settings"];
  const settingsItems = [
    { icon: Settings2, title: "DEFAULTS", path: "defaults" },
    { icon: Clock, title: "DATE & TIME", path: "date-time" },
    // ...(device !== "S7-1200"
    //   ? [{ icon: Sliders, title: "PID", path: "pid" }]
    //   : []),
    { icon: Timer, title: "OPERATING HOURS", path: "operating-hours" },
    { icon: Database, title: "DATA LOG", path: "data-log" },
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

  const handleNavigate = (path: string) => {
    if (device) {
      router.push(`/menu/settings/${path}/${device}`);
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">SETTINGS</h1>
            <p className="text-muted-foreground">Configure system settings</p>
          </AnimatedContainer>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {settingsItems.map((item) => (
              <motion.div
                key={item.title}
                className="cursor-pointer"
                onClick={() => handleNavigate(item.path)}
              >
                <Card className="transition-all hover:shadow-md hover:border-primary/50 h-full">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      <item.icon className="h-12 w-12 mb-4 text-primary" />
                    </motion.div>
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
