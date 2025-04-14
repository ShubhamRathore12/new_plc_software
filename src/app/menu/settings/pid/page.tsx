"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Sliders } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";

export default function PidPage() {
  const router = useRouter();

  const pidItems = [
    { title: "AFTERHEAT", href: "/menu/settings/pid/afterheat", icon: Sliders },
    { title: "HOT GAS", href: "/menu/settings/pid/hotgas", icon: Sliders },
    { title: "CONDENSER", href: "/menu/settings/pid/condenser", icon: Sliders },
    { title: "BLOWER", href: "/menu/settings/pid/blower", icon: Sliders },
    { title: "HEATER", href: "/menu/settings/pid/heater", icon: Sliders },
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

  const handleBack = () => {
    router.push("/menu/settings");
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              PID TUNING
            </h1>
            <p className="text-muted-foreground">
              Select a system for PID tuning
            </p>
          </AnimatedContainer>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {pidItems.map((item, index) => (
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

          <motion.div
            className="flex justify-start mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <Button variant="outline" onClick={handleBack}>
              BACK
            </Button>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
