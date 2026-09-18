"use client";

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Settings2, Clock, Timer, Database } from "lucide-react";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/providers/language-provider";
import ScreenHeader from "@/components/ScreenHeader";
import { SlidersHorizontal } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useParams();
  const { t } = useLanguage(); // translation hook
  const device = searchParams["settings"];

  const settingsItems = [
    { icon: Settings2, title: "DEFAULTS", path: "defaults" },
    { icon: Clock, title: "DATE_TIME", path: "date-time" },
    { icon: Timer, title: "OPERATING_HOURS", path: "operating-hours" },
    { icon: Database, title: "DATA_LOG", path: "data-log" },
  ].filter((item) => {
    if (String(device).includes("200") && item.title === "DATA_LOG") {
      return false;
    }
    return true;
  });

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
          <AnimatedContainer className="mb-8">
            <ScreenHeader
              icon={SlidersHorizontal}
              eyebrow={t("CONFIGURE_SYSTEM_SETTINGS")}
              title={t("SETTINGS")}
              machine={device as string}
              onBack={() => router.push(`/menu/${device}`)}
            />
          </AnimatedContainer>

          <div className="stagger mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {settingsItems.map((item) => (
              <div key={item.title} className="tilt">
                <Link
                  href={`/menu/settings/${item.path}/${device}`}
                  className="group tilt-face sheen glow-edge surface focus-visible:ring-ring/50 relative flex h-full w-full flex-col items-center gap-4 overflow-hidden p-6 text-center outline-none focus-visible:ring-2"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-28 opacity-70 transition-opacity duration-[var(--motion-medium)] group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(12rem 7rem at 50% -10%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 70%)",
                    }}
                  />
                  <span className="tilt-layer plate relative flex h-16 w-16 items-center justify-center rounded-2xl">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-[var(--motion-medium)] group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(145deg, color-mix(in oklch, var(--primary) 85%, transparent), color-mix(in oklch, var(--chart-2) 70%, transparent))",
                      }}
                    />
                    <item.icon className="text-primary relative h-7 w-7 transition-colors duration-[var(--motion-medium)] group-hover:text-white" />
                  </span>
                  <h2 className="tilt-layer text-base font-semibold tracking-tight">
                    {t(item.title)}
                  </h2>
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
