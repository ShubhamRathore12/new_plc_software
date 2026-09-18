"use client";

import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/lib/store";
import { Sun, Moon, User, LogOut, Globe, KeyRound, Monitor } from "lucide-react";
import Link from "next/link";
import { useLanguage, SUPPORTED_LANGUAGES } from "@/providers/language-provider";
import { useState } from "react";
import { useSession } from "@/providers/session-provider";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { clearUser } = useUserStore();
  const { language, setLanguage, t } = useLanguage();
  const { logout, session } = useSession();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout(allSessions = false) {
    try {
      setLoggingOut(true);
      clearUser();
      // Revokes server-side, closes live connections, clears every store and
      // cache, then replaces history so Back cannot return to a rendered
      // protected page (S-05).
      await logout({ allSessions });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  const isDark = theme === "dark";

  return (
    <header className="glass-bar sticky top-0 z-30 mb-4">
      <div className="flex h-14 items-center px-4 sm:px-6">
        <div className="ml-auto flex items-center gap-1">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={t("change_language")}>
                <Globe className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {SUPPORTED_LANGUAGES.map(({ code, label }) => (
                <DropdownMenuItem
                  key={code}
                  onClick={() => setLanguage(code)}
                  aria-current={language === code ? "true" : undefined}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={isDark ? t("switch_to_light_theme") : t("switch_to_dark_theme")}
            aria-pressed={isDark}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                aria-label={t("open_profile_menu")}
                className="bg-accent text-accent-foreground hover:bg-accent/80 relative h-8 w-8 rounded-full"
              >
                <User className="h-4 w-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                {session?.user.username || t("my_account")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>{t("profile")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/profile/change-password">
                  <KeyRound className="mr-2 h-4 w-4" aria-hidden="true" />
                  <span>{t("change_password")}</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleLogout(false)}
                disabled={loggingOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>{t("logout")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleLogout(true)}
                disabled={loggingOut}
                className="text-destructive focus:text-destructive cursor-pointer"
              >
                <Monitor className="mr-2 h-4 w-4" aria-hidden="true" />
                <span>{t("logout_all_sessions")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
