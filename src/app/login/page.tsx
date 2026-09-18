"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  FileBarChart,
  Gauge,
  Loader2,
  Lock,
  MonitorIcon,
  ShieldCheck,
  User,
} from "lucide-react";
import { loginUser } from "@/lib/auth";
import { getLandingRoute } from "@/lib/machineAccess";
import { RateLimitedError } from "@/lib/apiClient";
import { useSession, CHANGE_PASSWORD_ROUTE } from "@/providers/session-provider";

import { useDataStore } from "@/lib/store";
import { useLanguage } from "@/providers/language-provider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [retryIn, setRetryIn] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const { setData, setLoading } = useDataStore();
  const { t } = useLanguage();
  const { refresh } = useSession();

  // Why the user is looking at this screen, when they did not come here of
  // their own accord.
  const notice = searchParams.get("passwordChanged")
    ? t("password_changed")
    : searchParams.get("expired")
      ? t("session_expired")
      : "";

  // Counts the Retry-After window down so a rate limit has a number on it.
  useEffect(() => {
    if (retryIn <= 0) return;
    const id = setInterval(() => setRetryIn((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [retryIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (retryIn > 0) return;

    // Validation is rendered by the app, not by the browser: native tooltips
    // follow the browser locale and appeared in German on an English UI (F-01).
    const errors: Record<string, string> = {};
    if (!username.trim()) errors.username = t("required_field");
    if (!password) errors.password = t("required_field");
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await loginUser(username, password);

      setData(data);
      setLoading(false);

      // The server decides what this account may see; ask it before routing.
      const session = await refresh();

      if (session?.mustChangePassword || data?.mustChangePassword) {
        router.replace(CHANGE_PASSWORD_ROUTE);
        return;
      }

      const next = searchParams.get("next");
      router.replace(
        next && next.startsWith("/") ? next : getLandingRoute(data?.user)
      );
    } catch (error) {
      if (error instanceof RateLimitedError) {
        setRetryIn(error.retryAfter);
        setError(
          t("too_many_attempts").replace("{{seconds}}", String(error.retryAfter))
        );
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(t("sign_in_failed"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background relative min-h-screen overflow-hidden">
      {/* Ambient field: static gradients + one slow drifting aurora layer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60rem 38rem at 12% -12%, color-mix(in oklch, var(--primary) 26%, transparent), transparent 62%), radial-gradient(52rem 34rem at 92% 108%, color-mix(in oklch, var(--chart-2) 22%, transparent), transparent 62%)",
        }}
      />
      <div aria-hidden className="login-aurora pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(70rem 40rem at 50% 30%, #000 20%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(70rem 40rem at 50% 30%, #000 20%, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-4 py-10 lg:grid-cols-2 lg:gap-16">
        {/* Brand side */}
        <section className="animate-fade-in-up hidden lg:block">
          <span className="border-primary/25 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.16em] uppercase">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure operator access
          </span>

          <h1 className="mt-5 text-5xl leading-[1.05] font-semibold tracking-tight">
            <span className="gradient-text">Grain Technik</span>
            <br />
            control platform
          </h1>

          <p className="text-muted-foreground mt-4 max-w-md text-base">
            Live chiller telemetry, fault history and reports for every machine
            in the fleet.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {[
              { icon: Activity, label: "Live status", hint: "18s refresh" },
              { icon: Gauge, label: "Telemetry", hint: "per machine" },
              { icon: FileBarChart, label: "Reports", hint: "Excel / CSV" },
            ].map(({ icon: Icon, label, hint }) => (
              <div key={label} className="tilt">
                <div className="tilt-face surface plate flex flex-col gap-1.5 p-3.5">
                  <Icon className="text-primary h-4 w-4" />
                  <span className="text-xs font-semibold">{label}</span>
                  <span className="text-muted-foreground text-[11px]">{hint}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Form side */}
        <section className="animate-fade-in-up mx-auto w-full max-w-md">
          <div className="glow-edge surface relative overflow-hidden p-7 shadow-[var(--shadow-lg)] sm:p-8">
            <span
              aria-hidden
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background:
                  "linear-gradient(90deg, transparent, var(--primary), color-mix(in oklch, var(--chart-2) 80%, transparent), transparent)",
              }}
            />

            <div className="flex flex-col items-center text-center">
              <span className="plate text-primary flex h-14 w-14 items-center justify-center rounded-2xl">
                <MonitorIcon className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">
                {t("Grain Technik")}
              </h2>
              <p className="text-muted-foreground mt-1.5 text-sm">
                {t("Enter your credentials to access the dashboard")}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
              {notice && !error && (
                <div
                  role="status"
                  className="border-primary/30 bg-primary/10 text-primary flex items-start gap-2 rounded-lg border p-3 text-sm"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{notice}</span>
                </div>
              )}
              {error && (
                <div
                  role="alert"
                  className="border-destructive/30 bg-destructive/10 text-destructive animate-fade-in flex items-start gap-2 rounded-lg border p-3 text-sm"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-xs font-semibold tracking-wide uppercase"
                >
                  {t("Username")}
                </Label>
                <div className="relative">
                  <User className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={t("your_username")}
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    aria-invalid={Boolean(fieldErrors.username)}
                    aria-describedby={
                      fieldErrors.username ? "username-error" : undefined
                    }
                    className="h-11 pl-9"
                  />
                </div>
                {fieldErrors.username && (
                  <p
                    id="username-error"
                    role="alert"
                    className="text-destructive text-xs"
                  >
                    {fieldErrors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-xs font-semibold tracking-wide uppercase"
                >
                  {t("Password")}
                </Label>
                <div className="relative">
                  <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={Boolean(fieldErrors.password)}
                    aria-describedby={
                      fieldErrors.password ? "password-error" : undefined
                    }
                    className="h-11 pr-10 pl-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? t("hide_password") : t("show_password")}
                    aria-pressed={showPassword}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2.5 -translate-y-1/2 transition-colors duration-[var(--motion-fast)]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p
                    id="password-error"
                    role="alert"
                    className="text-destructive text-xs"
                  >
                    {fieldErrors.password}
                  </p>
                )}
                {/* No self-service reset endpoint exists yet, so the screen says
                    how to get one rather than offering a dead link. */}
                <p className="text-muted-foreground text-xs">
                  {t("forgot_password")} {t("forgot_password_help")}
                </p>
              </div>

              <Button
                type="submit"
                size="lg"
                className="sheen mt-2 h-11 w-full text-sm font-semibold"
                disabled={isLoading || retryIn > 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    {t("Signing in...")}
                  </>
                ) : retryIn > 0 ? (
                  <>
                    {t("too_many_attempts").replace("{{seconds}}", String(retryIn))}
                  </>
                ) : (
                  <>
                    {t("Sign in")}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-muted-foreground mt-6 text-center text-xs">
              {t("footer_tagline")}
            </p>
          </div>
        </section>
      </div>

      <style jsx>{`
        .login-aurora {
          background:
            radial-gradient(
              28rem 20rem at 30% 20%,
              color-mix(in oklch, var(--chart-5) 20%, transparent),
              transparent 70%
            ),
            radial-gradient(
              26rem 18rem at 70% 70%,
              color-mix(in oklch, var(--chart-2) 18%, transparent),
              transparent 70%
            );
          filter: blur(10px);
          animation: auroraDrift 22s ease-in-out infinite alternate;
        }
        @keyframes auroraDrift {
          0% {
            transform: translate3d(-3%, -2%, 0) scale(1.05);
          }
          100% {
            transform: translate3d(3%, 2%, 0) scale(1.12);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .login-aurora {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

/** useSearchParams needs a Suspense boundary to prerender. */
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
