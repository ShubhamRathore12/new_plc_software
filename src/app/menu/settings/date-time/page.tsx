"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check } from "lucide-react"

export default function DateTimePage() {
  const [date, setDate] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  })

  const [time, setTime] = useState({
    hours: new Date().getHours(),
    minutes: new Date().getMinutes(),
    seconds: new Date().getSeconds(),
  })

  return (
    <div className="flex flex-col min-h-screen">
    

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">SET PLC DATE & TIME</h1>
          <p className="text-muted-foreground">Configure system date and time</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-4">Set Date:</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={date.year}
                      onChange={(e) => setDate({ ...date, year: Number.parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      type="number"
                      value={date.month}
                      onChange={(e) => setDate({ ...date, month: Number.parseInt(e.target.value) || 0 })}
                      min={1}
                      max={12}
                    />
                  </div>
                  <div>
                    <Label htmlFor="day">Day</Label>
                    <Input
                      id="day"
                      type="number"
                      value={date.day}
                      onChange={(e) => setDate({ ...date, day: Number.parseInt(e.target.value) || 0 })}
                      min={1}
                      max={31}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Set Time:</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="hours">HH</Label>
                    <Input
                      id="hours"
                      type="number"
                      value={time.hours}
                      onChange={(e) => setTime({ ...time, hours: Number.parseInt(e.target.value) || 0 })}
                      min={0}
                      max={23}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minutes">MM</Label>
                    <Input
                      id="minutes"
                      type="number"
                      value={time.minutes}
                      onChange={(e) => setTime({ ...time, minutes: Number.parseInt(e.target.value) || 0 })}
                      min={0}
                      max={59}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seconds">SS</Label>
                    <Input
                      id="seconds"
                      type="number"
                      value={time.seconds}
                      onChange={(e) => setTime({ ...time, seconds: Number.parseInt(e.target.value) || 0 })}
                      min={0}
                      max={59}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <Button variant="outline">BACK</Button>
                <Button>
                  <Check className="mr-2 h-4 w-4" />
                  SET
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

    </div>
  )
}

