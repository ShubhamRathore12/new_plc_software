import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { gsap } from "gsap";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

export const format = (value: any): string => {
  const num = Number(value);
  return isNaN(num) ? "--" : num.toFixed(2);
};
