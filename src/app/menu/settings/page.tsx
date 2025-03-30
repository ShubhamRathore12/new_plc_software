"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Settings2, Clock, Sliders, Timer, Database } from "lucide-react";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";

export default function SettingsPage() {
  const settingsItems = [
    { icon: Settings2, title: "DEFAULTS", href: "/menu/settings/defaults" },
    { icon: Clock, title: "DATE & TIME", href: "/menu/settings/date-time" },
    { icon: Sliders, title: "PID", href: "/menu/settings/pid" },
    {
      icon: Timer,
      title: "OPERATING HOURS",
      href: "/menu/settings/operating-hours",
    },
    { icon: Database, title: "DATA LOG", href: "/menu/settings/data-log" },
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
            {settingsItems.map((item, index) => (
              <motion.div key={item.title}>
                <Link href={item.href} passHref>
                  <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full">
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
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
