"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MonitorIcon } from "lucide-react";
import dynamic from "next/dynamic";

const ThreeBackground = dynamic(() => import("@/components/ThreeBackground"), {
  ssr: false,
});
import RedirectIfAuthenticated from "@/components/auth/RedirectIfAuthenticated";
import { useDataStore } from "@/lib/store";
import { useLanguage } from "@/providers/language-provider";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { data, setData, loading, setLoading } = useDataStore();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }
      setData(data);
      router.push("/dashboard");
      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <ThreeBackground />
      <div className="absolute inset-0 bg-black/70 z-10" />
      <Card className="w-full max-w-md mx-4 z-20">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <MonitorIcon className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">{t("Grain Technik")}</h2>
          <p className="text-sm text-muted-foreground">
            {t("Enter your credentials to access the dashboard")}
          </p>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">{t("Username")}</Label>
              <Input
                id="username"
                type="text"
                placeholder="your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("Password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-10" disabled={isLoading}>
              {isLoading ? t("Signing in...") : t("Sign in")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
