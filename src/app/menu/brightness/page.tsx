"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";

export default function BrightnessPage() {
  const router = useRouter();
  const [brightness, setBrightness] = useState(80);

  const handleSetBrightness = (level: number) => {
    setBrightness(level);
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              SCREEN BRIGHTNESS
            </h1>
            <p className="text-muted-foreground">Adjust display brightness</p>
          </AnimatedContainer>

          <AnimatedContainer delay={1}>
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <motion.div
                  className="flex justify-center mb-8"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: brightness / 100,
                  }}
                  transition={{
                    scale: { repeat: Number.POSITIVE_INFINITY, duration: 2 },
                    opacity: { duration: 0.5 },
                  }}
                >
                  <Sun className="h-24 w-24 text-primary" />
                </motion.div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-lg">Brightness</span>
                      <span className="text-lg font-medium">{brightness}%</span>
                    </div>
                    <Slider
                      value={[brightness]}
                      onValueChange={(value) => setBrightness(value[0])}
                      max={100}
                      step={1}
                      className="h-2"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleSetBrightness(25)}
                    >
                      Low
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleSetBrightness(50)}
                    >
                      Medium
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => handleSetBrightness(100)}
                    >
                      High
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>

          <motion.div
            className="flex justify-start mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
          >
            <Button variant="outline" onClick={() => router.push("/")}>
              BACK
            </Button>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}
