"use client";

import Link from "next/link";

import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="font-bold text-xl">Modern Dashboard</div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <motion.div
                className="flex flex-col justify-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Modern Dashboard for Your Application
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    A powerful and beautiful dashboard built with Next.js 15,
                    React 19, TypeScript, Tailwind CSS, Shadcn UI, Zustand,
                    Framer Motion, React Query, and GSAP.
                  </p>
                </div>
                <motion.div
                  className="flex flex-col gap-2 min-[400px]:flex-row"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <Link href="/dashboard">
                    <Button size="lg">Get Started</Button>
                  </Link>
                </motion.div>
              </motion.div>
              <motion.div
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div
                  className={`w-full h-full rounded-xl ${
                    theme === "dark" ? "bg-slate-900" : "bg-slate-100"
                  } flex items-center justify-center`}
                >
                  <div className="text-3xl font-bold">Dashboard Preview</div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 border-t px-4 py-6 lg:px-6">
        <div className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Modern Dashboard. All rights
          reserved.
        </div>
      </footer>
    </div>
  );
}
