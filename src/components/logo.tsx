"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-12",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative aspect-square">
        <div
          className={cn("flex items-center justify-center", sizeClasses[size])}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <div
              className={cn(
                "rounded-full bg-primary/20",
                size === "sm"
                  ? "h-4 w-4"
                  : size === "md"
                  ? "h-6 w-6"
                  : "h-10 w-10"
              )}
            ></div>
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={cn(
                "rounded-full bg-primary",
                size === "sm"
                  ? "h-2 w-2"
                  : size === "md"
                  ? "h-4 w-4"
                  : "h-6 w-6"
              )}
            ></div>
          </div>
        </div>
      </div>
      <motion.span
        className={cn(
          "font-semibold",
          size === "sm" ? "text-base" : size === "md" ? "text-lg" : "text-2xl"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        grain TECHNIK
      </motion.span>
    </div>
  );
}
