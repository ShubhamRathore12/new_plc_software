"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldAlert,
  X,
} from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePassword } from "@/lib/auth";
import { RateLimitedError } from "@/lib/apiClient";
import {
  PASSWORD_RULES,
  failedPasswordRules,
} from "@/lib/passwordPolicy";
import { useLanguage } from "@/providers/language-provider";
import { useSession } from "@/providers/session-provider";
import { useDataStore } from "@/lib/store";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { session } = useSession();
  const { clearData } = useDataStore() as { clearData: () => void };

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [retryIn, setRetryIn] = useState(0);

  const username = session?.user.username;
  const failed = useMemo(
    () => failedPasswordRules(newPassword, username),
    [newPassword, username]
  );

  // Counts down the Retry-After window so the operator sees when they may try
  // again instead of only being told "too many attempts".
  useEffect(() => {
    if (retryIn <= 0) return;
    const id = setInterval(() => setRetryIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [retryIn]);

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!currentPassword) errors.currentPassword = t("required_field");
    if (!newPassword) errors.newPassword = t("required_field");
    else if (failed.length) errors.newPassword = t("password_does_not_meet_policy");
    if (newPassword !== confirmPassword)
      errors.confirmPassword = t("passwords_do_not_match");
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");
    if (retryIn > 0) return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      await changePassword(currentPassword, newPassword);

      // Drop the persisted login payload before leaving. On a backend without
      // /api/auth/session the session falls back to that payload, and the copy
      // sitting in localStorage still carries mustChangePassword for the
      // credential that was just rotated — which sent the user straight back
      // to this screen on the next sign-in.
      clearData();
      try {
        localStorage.removeItem("data-storage");
      } catch {
        /* storage can be unavailable — the server stays the source of truth */
      }

      // Every session is revoked server-side, so re-login is required.
      router.replace("/login?passwordChanged=1");
    } catch (error) {
      if (error instanceof RateLimitedError) {
        setRetryIn(error.retryAfter);
        setFormError(
          t("too_many_attempts").replace("{{seconds}}", String(error.retryAfter))
        );
      } else {
        setFormError(
          error instanceof Error ? error.message : t("change_password_failed")
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="mx-auto w-full max-w-lg py-6">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
          <KeyRound className="h-5 w-5" aria-hidden="true" />
          {t("change_password")}
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
          {/* noValidate: native tooltips follow the browser locale, which is how
              a German validation message ended up on an English UI (F-01).
              Validation below is rendered through the i18n layer instead. */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {formError && (
              <div
                role="alert"
                className="border-destructive/30 bg-destructive/10 text-destructive flex items-start gap-2 rounded-lg border p-3 text-sm"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="currentPassword">{t("current_password")}</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrent ? "text" : "password"}
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.currentPassword)}
                  aria-describedby={
                    fieldErrors.currentPassword ? "currentPassword-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  aria-label={showCurrent ? t("hide_password") : t("show_password")}
                  aria-pressed={showCurrent}
                  className="text-muted-foreground absolute inset-y-0 right-2 flex items-center"
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {fieldErrors.currentPassword && (
                <p
                  id="currentPassword-error"
                  role="alert"
                  className="text-destructive text-xs"
                >
                  {fieldErrors.currentPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">{t("new_password")}</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNew ? "text" : "password"}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  aria-invalid={Boolean(fieldErrors.newPassword)}
                  aria-describedby="password-policy"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  aria-label={showNew ? t("hide_password") : t("show_password")}
                  aria-pressed={showNew}
                  className="text-muted-foreground absolute inset-y-0 right-2 flex items-center"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>

              {/* The policy is stated up front, not only after a rejection. */}
              <ul id="password-policy" className="mt-2 space-y-1 text-xs">
                {PASSWORD_RULES.map((rule) => {
                  const ok = !failed.some((f) => f.id === rule.id);
                  return (
                    <li
                      key={rule.id}
                      className={
                        ok
                          ? "text-muted-foreground flex items-center gap-1.5"
                          : "flex items-center gap-1.5"
                      }
                    >
                      {newPassword && ok ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                      ) : (
                        <X className="text-muted-foreground h-3.5 w-3.5" aria-hidden="true" />
                      )}
                      {t(rule.labelKey)}
                    </li>
                  );
                })}
              </ul>

              {fieldErrors.newPassword && (
                <p role="alert" className="text-destructive text-xs">
                  {fieldErrors.newPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("confirm_password")}</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showNew ? "text" : "password"}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={
                  fieldErrors.confirmPassword ? "confirmPassword-error" : undefined
                }
              />
              {fieldErrors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  role="alert"
                  className="text-destructive text-xs"
                >
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={submitting || retryIn > 0}
            >
              {submitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              )}
              {retryIn > 0
                ? t("too_many_attempts").replace("{{seconds}}", String(retryIn))
                : t("change_password")}
            </Button>

            <p className="text-muted-foreground text-xs">
              {t("change_password_signs_out")}
            </p>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
}
