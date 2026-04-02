"use client";

import { cn } from "@/lib/utils";
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
import { Sun, Moon, User, LogOut, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/providers/language-provider";
import { useState } from "react";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, clearUser } = useUserStore();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

    async function handleLogout() {
    try {
      setLoggingOut(true);

      const res = await fetch("/api/logout", {
        method: "POST",
      });

      if (!res.ok) throw new Error("Logout failed");

clearUser()
      router.push("/login"); 
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <header className="border-b sticky top-0 z-30 bg-background mb-4 md:p-0">
      <div className="flex h-16 items-center px-4 sm:px-6">
        <div className="ml-auto flex items-center space-x-4">
          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("language")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                {t("english")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("de")}>
                {t("german")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fr")}>
                {t("french")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("th")}>
                {t("thai")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("my_account")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>{t("profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
