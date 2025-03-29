import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { gsap } from "gsap";
import { useInView } from "framer-motion";
import { useRef } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function useAnimateInView(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    ...options,
  });

  return { ref, isInView };
}

export function animateElement(element: HTMLElement, props: any, options = {}) {
  return gsap.to(element, {
    ...props,
    ...options,
  });
}

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};
