import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-card/90 to-card/70 dark:from-card/80 dark:to-card/60",
        "text-card-foreground flex flex-col gap-6 rounded-2xl border border-border/50 p-6 shadow-lg",
        "transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1",
        "backdrop-blur-sm hover:backdrop-blur",
        "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-primary/10 before:to-secondary/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2",
        "has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        "animate-fade-in-up animate-duration-300",
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-xl font-bold tracking-tight text-transparent",
        "dark:from-foreground dark:to-foreground/90",
        "transition-all duration-300 hover:translate-x-1",
        className
      )}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        "text-muted-foreground/90 text-sm leading-relaxed",
        "transition-all duration-300 hover:translate-x-0.5",
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn(
        "animate-fade-in-up animate-duration-500 animate-delay-100",
        className
      )}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "mt-auto flex items-center [.border-t]:pt-6",
        "animate-fade-in-up animate-duration-500 animate-delay-200",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
