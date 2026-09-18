"use client";

import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Wind, Thermometer } from "lucide-react";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/providers/language-provider";

export default function AerationPage() {
  const router = useRouter();
  const { aerations } = useParams();
  const device = aerations?.toString();

  const [shouldRender, setShouldRender] = useState(true);
  const {t } = useLanguage()

  useEffect(() => {
    if (device === "GTPL-122-gT-1000T-S7-1200"|| device === "GTPL-139-gT-300AP-S7-1200" || device === "GTPL-142-gT-450AP-S7-1200" || device === "GTPL-143-gT-450AP-S7-1200" || device=== "GTPL-124-gT-450T-S7-1200" ||device === "GTPL-133-gT-650T-S7-1200" || device === "GTPL-154-gT-650T-S7-1200" || device === "GTPL-155-gT-650T-S7-1200" || device === "GTPL-081-gT-650T-S7-1200" || device === "GTPL-105-gT-650T-S7-1200" || device === "GTPL-131-gT-650T-S7-1200" || device === "GTPL-068-gT-650T-S7-1200" || device === "GTPL-104-gT-650T-S7-1200" || device === "GTPL-132-300-AP-S7-1200"|| device === "GTPL-137-gT-450T-S7-1200" || device === "GTPL-138-gT-450T-S7-1200" || device === "GTPL-136-gT-450AP" || device === "GTPL-134-gT-450T-S7-1200" || device === "GTPL-135-gT-450T-S7-1200" || device === "GTPL-145-gT-450T-S7-1200" || device === "GTPL-148-gT-450T-S7-1200" || device === "GTPL-061-gT-450T-S7-1200" || device === "GTPL-118-gT-60T-S7-200" || device === "GTPL-149-gT-60T-S7-1200" || device === "GTPL-121-gT-1000T-S7-1200" || device  === "GTPL-123-gT-450AP") {
      setShouldRender(false); // prevent cards from rendering
      router.replace(`/menu/aerations/without-heating/${device}`);
    }
  }, [device, router]);

  if (!shouldRender) return null;

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8 text-center">
            <h1 className="gradient-text mb-2 text-3xl font-semibold tracking-tight">{t("AERATION")}</h1>
            <p className="text-muted-foreground">{t("Select an aeration mode")}</p>
          </AnimatedContainer>

          <div className="stagger mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                key: "without",
                title: t("AERATION W/O HEATING"),
                desc: t("Standard aeration process without additional heating"),
                href: `/menu/aerations/without-heating/${device}`,
                heated: false,
              },
              {
                key: "with",
                title: t("AERATION WITH HEATING"),
                desc: t("Aeration process with additional heating"),
                href: `/menu/aerations/with-heating/${device}`,
                heated: true,
              },
            ].map((mode) => (
              <div key={mode.key} className="tilt">
                <Link
                  href={mode.href}
                  className="group tilt-face sheen glow-edge surface focus-visible:ring-ring/50 relative flex h-full w-full flex-col items-center gap-4 overflow-hidden p-8 text-center outline-none focus-visible:ring-2"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-70 transition-opacity duration-[var(--motion-medium)] group-hover:opacity-100"
                    style={{
                      background:
                        "radial-gradient(14rem 8rem at 50% -10%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 70%)",
                    }}
                  />

                  <span className="tilt-layer plate relative flex h-20 w-20 items-center justify-center rounded-2xl">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-[var(--motion-medium)] group-hover:opacity-100"
                      style={{
                        background:
                          "linear-gradient(145deg, color-mix(in oklch, var(--primary) 85%, transparent), color-mix(in oklch, var(--chart-2) 70%, transparent))",
                      }}
                    />
                    <Wind className="text-primary relative h-9 w-9 transition-colors duration-[var(--motion-medium)] group-hover:text-white" />
                    {mode.heated && (
                      <Thermometer className="text-destructive absolute -right-1.5 -bottom-1.5 h-6 w-6 drop-shadow" />
                    )}
                  </span>

                  <h2 className="tilt-layer text-lg font-semibold tracking-tight">
                    {mode.title}
                  </h2>
                  <p className="tilt-layer text-muted-foreground text-sm">
                    {mode.desc}
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
