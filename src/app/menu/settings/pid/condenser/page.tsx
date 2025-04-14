"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import {
  PageTransition,
  AnimatedContainer,
} from "@/components/ui/animated-container";

export default function CondenserPidPage() {
  const router = useRouter();
  const imageRef = useRef<HTMLImageElement>(null);

  const [params, setParams] = useState({
    speed: 55.0,
    set: 50.0,
    outHigh: 100.0,
    outLow: 0.0,
    p: 1.8,
    ti: 150.0,
    td: 40.0,
  });

  const handleChange = (key: string, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleBack = () => {
    router.push("/menu/settings/pid");
  };

  // GSAP entry + pulse animation
  useEffect(() => {
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "power3.out" }
      );

      gsap.to(imageRef.current, {
        scale: 1.05,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: "sine.inOut",
      });
    }
  }, []);

  // GSAP glow effect based on speed
  useEffect(() => {
    if (imageRef.current) {
      const glow = (params.speed / 100) * 0.8 + 0.2;
      gsap.to(imageRef.current, {
        filter: `drop-shadow(0 0 ${glow * 20}px rgba(0, 100, 255, 0.7))`,
        duration: 0.5,
      });
    }
  }, [params.speed]);

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              CONDENSER PID TUNING
            </h1>
          </AnimatedContainer>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <AnimatedContainer className="lg:col-span-2" delay={1}>
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {["speed", "set", "outHigh", "outLow"].map((key) => (
                        <div
                          key={key}
                          className="grid grid-cols-3 items-center gap-2"
                        >
                          <Label htmlFor={key} className="font-medium">
                            {key.toUpperCase()}
                          </Label>
                          <Input
                            id={key}
                            type="number"
                            value={params[key as keyof typeof params]}
                            onChange={(e) =>
                              handleChange(key, parseFloat(e.target.value) || 0)
                            }
                            step={0.1}
                            className="col-span-1"
                          />
                          <div>%</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-3 items-center gap-2">
                        <Label htmlFor="p" className="font-medium">
                          P
                        </Label>
                        <Input
                          id="p"
                          type="number"
                          value={params.p}
                          onChange={(e) =>
                            handleChange("p", parseFloat(e.target.value) || 0)
                          }
                          step={0.1}
                          className="col-span-1"
                        />
                      </div>
                      <div className="grid grid-cols-3 items-center gap-2">
                        <Label htmlFor="ti" className="font-medium">
                          TI
                        </Label>
                        <Input
                          id="ti"
                          type="number"
                          value={params.ti}
                          onChange={(e) =>
                            handleChange("ti", parseFloat(e.target.value) || 0)
                          }
                          step={0.1}
                          className="col-span-1"
                        />
                        <div>S</div>
                      </div>
                      <div className="grid grid-cols-3 items-center gap-2">
                        <Label htmlFor="td" className="font-medium">
                          TD
                        </Label>
                        <Input
                          id="td"
                          type="number"
                          value={params.td}
                          onChange={(e) =>
                            handleChange("td", parseFloat(e.target.value) || 0)
                          }
                          step={0.1}
                          className="col-span-1"
                        />
                        <div>S</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer delay={2}>
              <Card className="h-full">
                <CardContent className="p-6 h-full">
                  <div className="h-full flex flex-col">
                    <div className="text-lg font-semibold mb-4">
                      Condenser Diagram
                    </div>
                    <div className="flex-1 relative border rounded-md p-4 bg-muted/30">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <img
                          ref={imageRef}
                          src="https://4.bp.blogspot.com/-C___MaTNAJ4/WJLuJ5pRivI/AAAAAAAAJ7o/2EOBFHuCSAA0zjnhVPrLQ1njBWy-4qVawCLcB/s1600/animation%2Bwater%2Bcooled%2Bcondensor.gif"
                          alt="Condenser"
                          className="w-32 h-32"
                        />
                        <div className="mt-2 text-sm font-bold bg-white/80 px-3 py-1 rounded shadow">
                          {params.speed}%
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>

          <motion.div
            className="flex justify-start mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 2.2 }}
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
