"use client";

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
    if (device === "GTPL-122-gT-1000T-S7-1200" || device=== "GTPL-124-GT-450T-S7-1200" ||device === "GTPL-131-GT-650T-S7-1200" || device === "'GTPL-132-300-AP-S7-1200'") {
      setShouldRender(false); // prevent cards from rendering
      router.push(`/menu/aerations/without-heating/${device}`);
    }
  }, [device, router]);

  if (!shouldRender) return null;

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{t("AERATION")}</h1>
            <p className="text-muted-foreground">{t("Select an aeration mode")}</p>
          </AnimatedContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <AnimatedContainer delay={1}>
              <Card
                className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full"
                onClick={() =>
                  router.push(`/menu/aerations/without-heating/${device}`)
                }
              >
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <Wind className="h-16 w-16 mb-6 text-primary" />
                  </motion.div>
                  <h2 className="text-2xl font-semibold mb-4">
                    {t("AERATION W/O HEATING")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("Standard aeration process without additional heating")}
                  </p>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={2}>
              <Card
                className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full"
                onClick={() =>
                  router.push(`/menu/aerations/with-heating/${device}`)
                }
              >
                <CardContent className="p-8 flex flex-col items-center text-center h-full">
                  <motion.div
                    className="relative mb-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    }}
                  >
                    <Wind className="h-16 w-16 text-primary" />
                    <Thermometer className="h-8 w-8 text-red-500 absolute -bottom-2 -right-2" />
                  </motion.div>
                  <h2 className="text-2xl font-semibold mb-4">
                    {t("AERATION WITH HEATING")}
                  </h2>
                  <p className="text-muted-foreground">
                    {t("Enhanced aeration process with temperature control")}
                  </p>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
