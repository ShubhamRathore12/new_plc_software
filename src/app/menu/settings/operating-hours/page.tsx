"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function OperatingHoursPage() {
  const [hours, setHours] = useState(1234)
  const [minutes, setMinutes] = useState(45)

  return (
    <div className="flex flex-col min-h-screen">


      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">OPERATING HOURS</h1>
          <p className="text-muted-foreground">System runtime tracking</p>
        </div>

        <Card className="max-w-md mx-auto">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hours" className="text-right font-medium">
                  HOURS
                </Label>
                <Input
                  id="hours"
                  type="number"
                  value={hours}
                  onChange={(e) => setHours(Number.parseInt(e.target.value) || 0)}
                  className="col-span-2"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="minutes" className="text-right font-medium">
                  MINUTES
                </Label>
                <div className="flex items-center gap-2 col-span-2">
                  <span>:</span>
                  <Input
                    id="minutes"
                    type="number"
                    value={minutes}
                    onChange={(e) => setMinutes(Number.parseInt(e.target.value) || 0)}
                    readOnly
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline">BACK</Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">RESET</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Reset Operating Hours</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to reset the operating hours counter? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          setHours(0)
                          setMinutes(0)
                        }}
                      >
                        Reset
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

   
    </div>
  )
}

