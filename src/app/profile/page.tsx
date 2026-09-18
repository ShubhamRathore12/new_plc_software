"use client";

import Link from "next/link";
import { KeyRound, LogOut, Monitor, ShieldAlert, User } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/providers/language-provider";
import { useSession } from "@/providers/session-provider";

export default function ProfilePage() {
  const { t } = useLanguage();
  const { session, logout } = useSession();
  const user = session?.user;

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-2xl py-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("profile")}
        </h1>

        {session?.mustChangePassword && (
          <div
            role="alert"
            className="border-destructive/30 bg-destructive/10 text-destructive mt-4 flex items-start gap-2 rounded-lg border p-3 text-sm"
          >
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t("must_change_password")}</span>
          </div>
        )}

        <Card className="mt-6 p-6">
          <div className="flex items-center gap-3">
            <span className="bg-accent text-accent-foreground flex h-11 w-11 items-center justify-center rounded-full">
              <User className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-medium">{user?.username || "—"}</p>
              <p className="text-muted-foreground text-sm">
                {user?.accountType || "—"}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">{t("username")}</dt>
              <dd className="font-medium">{user?.username || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("Email")}</dt>
              <dd className="font-medium">{user?.email || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("first_name")}</dt>
              <dd className="font-medium">{user?.firstName || "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("last_name")}</dt>
              <dd className="font-medium">{user?.lastName || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">{t("monitor_access")}</dt>
              <dd className="font-medium">
                {session && session.machines.length > 0
                  ? session.machines.map((m) => m.machineName).join(", ")
                  : t("no_devices_to_display")}
              </dd>
            </div>
          </dl>
        </Card>

        <Card className="mt-4 divide-border divide-y p-0">
          <Link
            href="/profile/change-password"
            className="hover:bg-accent/50 flex items-center gap-3 p-4 text-sm font-medium"
          >
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            {t("change_password")}
          </Link>
        </Card>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
            {t("logout")}
          </Button>
          <Button
            variant="outline"
            onClick={() => logout({ allSessions: true })}
          >
            <Monitor className="mr-2 h-4 w-4" aria-hidden="true" />
            {t("logout_all_sessions")}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
