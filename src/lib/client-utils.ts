"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";

export function useAnimateInView(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    ...options,
  });

  return { ref, isInView };
}
