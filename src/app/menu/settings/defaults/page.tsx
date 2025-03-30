"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { PageTransition, AnimatedContainer } from "@/components/ui/animated-container"

export default function DefaultsPage() {
  const router = useRouter()
  const [t1, setT1] = useState(24)
  const [thT1, setThT1] = useState(8)
  const [deltaA, setDeltaA] = useState(10)
  const [hp, setHp] = useState(220)
  const [lp, setLp] = useState(40)

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
     

        <main className="flex-1 container py-8">
          <AnimatedContainer className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">DEFAULTS</h1>
            <p className="text-muted-foreground">System default parameters</p>
          </AnimatedContainer>

          <AnimatedContainer delay={1}>
            <Card className="max-w-md mx-auto">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <motion.div
                    className="grid grid-cols-3 items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Label htmlFor="t1" className="text-right font-medium">
                      T1
                    </Label>
                    <Input
                      id="t1"
                      type="number"
                      value={t1}
                      onChange={(e) => setT1(Number.parseInt(e.target.value) || 0)}
                      className="col-span-1"
                    />
                    <div>°C</div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-3 items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label htmlFor="th-t1" className="text-right font-medium">
                      TH-T1
                    </Label>
                    <Input
                      id="th-t1"
                      type="number"
                      value={thT1}
                      onChange={(e) => setThT1(Number.parseInt(e.target.value) || 0)}
                      className="col-span-1"
                    />
                    <div>°C</div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-3 items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Label htmlFor="delta-a" className="text-right font-medium">
                      Delta(A)
                    </Label>
                    <Input
                      id="delta-a"
                      type="number"
                      value={deltaA}
                      onChange={(e) => setDeltaA(Number.parseInt(e.target.value) || 0)}
                      className="col-span-1"
                    />
                    <div>°C</div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-3 items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Label htmlFor="hp" className="text-right font-medium">
                      HP
                    </Label>
                    <Input
                      id="hp"
                      type="number"
                      value={hp}
                      onChange={(e) => setHp(Number.parseInt(e.target.value) || 0)}
                      className="col-span-1"
                    />
                    <div>psi</div>
                  </motion.div>

                  <motion.div
                    className="grid grid-cols-3 items-center gap-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label htmlFor="lp" className="text-right font-medium">
                      LP
                    </Label>
                    <Input
                      id="lp"
                      type="number"
                      value={lp}
                      onChange={(e) => setLp(Number.parseInt(e.target.value) || 0)}
                      className="col-span-1"
                    />
                    <div>psi</div>
                  </motion.div>

                  <motion.div
                    className="flex justify-between pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button variant="outline" onClick={() => router.push("/settings")}>
                      BACK
                    </Button>
                    <Button>SAVE</Button>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        </main>

     
      </div>
    </PageTransition>
  )
}

