"use client";

import { usePathname, useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useDataStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import {
  getDeviceFromPath,
  getSectionFromPath,
  hasMachineAccess,
  hasSectionAccess,
} from "@/lib/machineAccess";

/**
 * Blocks any /menu/... (or /3d/...) route whose machine is not in the user's
 * monitorAccess list — typing the URL by hand is not a way around it.
 */
export default function MachineAccessGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { data } = useDataStore() as { data: any };

  const device = getDeviceFromPath(pathname);
  const section = getSectionFromPath(pathname);
  const monitorAccess = data?.user?.monitorAccess;

  // While the user data has not loaded yet we cannot decide — render as-is.
  const userLoaded = Boolean(data?.user);
  const machineOk = hasMachineAccess(monitorAccess, device);
  const sectionOk = hasSectionAccess(monitorAccess, section);
  const allowed = !userLoaded || (machineOk && sectionOk);

  if (allowed) return <>{children}</>;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <ShieldAlert className="h-14 w-14 text-red-500" />
      <h1 className="text-2xl font-semibold">You do not have permission</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Your account is not allowed to view{" "}
        <strong>{!machineOk ? device : section}</strong>. Please contact your
        administrator if you need access to this {!machineOk ? "machine" : "page"}.
      </p>
      <Button onClick={() => router.push("/devices")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to my machines
      </Button>
    </div>
  );
}
