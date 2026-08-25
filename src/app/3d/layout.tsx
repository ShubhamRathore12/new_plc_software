"use client";

import MachineAccessGuard from "@/components/MachineAccessGuard";

export default function ThreeDLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MachineAccessGuard>{children}</MachineAccessGuard>;
}
