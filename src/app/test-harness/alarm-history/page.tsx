"use client";

/**
 * Playwright-only harness for the alarm-history view (FaultLogsPaginated).
 *
 * The real screen lives behind auth, provider context and the machine menu, so
 * driving it end to end is brittle. This page mounts the component in isolation
 * for a machine supplied via `?machine=`, letting the test intercept the
 * primeosys backend call and assert the loading / empty / error / results
 * states directly.
 *
 * It is inert in production: NODE_ENV === "production" renders nothing, so even
 * though middleware leaves `/test-harness` unguarded there is nothing to
 * expose.
 */

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import FaultLogsPaginated from "@/components/FaultLogsPaginated";

function Harness() {
  const params = useSearchParams();
  const machine =
    params.get("machine") || "GTPL-159-gT-650T-S7-1200";
  return <FaultLogsPaginated machineName={machine} />;
}

export default function AlarmHistoryTestPage() {
  if (process.env.NODE_ENV === "production") return null;
  return (
    <Suspense fallback={null}>
      <Harness />
    </Suspense>
  );
}
