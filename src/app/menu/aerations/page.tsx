"use client";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Wind, Thermometer } from "lucide-react";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";

export default function AerationPage() {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">AERATION</h1>
            <p className="text-muted-foreground">Select an aeration mode</p>
          </AnimatedContainer>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <AnimatedContainer delay={1}>
              <Link href="/menu/aerations/without-heating" passHref>
                <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full">
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
                      AERATION W/O HEATING
                    </h2>
                    <p className="text-muted-foreground">
                      Standard aeration process without additional heating
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedContainer>

            <AnimatedContainer delay={2}>
              <Link href="/menu/aerations/with-heating" passHref>
                <Card className="transition-all hover:shadow-md hover:border-primary/50 cursor-pointer h-full">
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
                      AERATION WITH HEATING
                    </h2>
                    <p className="text-muted-foreground">
                      Enhanced aeration process with temperature control
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </AnimatedContainer>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
