"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export default function DataLogPage() {
  const [logInterval, setLogInterval] = useState(15)

  return (
    <div className="flex flex-col min-h-screen">


      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">LOGGING SETTING</h1>
          <p className="text-muted-foreground">Configure data logging parameters</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="log-interval" className="block mb-2">
                  Log interval (1 min to 60 min)
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="log-interval"
                    type="number"
                    value={logInterval}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value) || 1
                      setLogInterval(Math.min(Math.max(value, 1), 60))
                    }}
                    className="w-20"
                    min={1}
                    max={60}
                  />
                  <span>min</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>1 min</span>
                  <span>60 min</span>
                </div>
                <Slider
                  value={[logInterval]}
                  onValueChange={(value) => setLogInterval(value[0])}
                  min={1}
                  max={60}
                  step={1}
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline">BACK</Button>
                <Button>SAVE</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

 
    </div>
  )
}

