"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Activity,
  Wind,
  AlertTriangle,
  Settings,
  ToggleLeft,
  ToggleRight,
  TestTube,
  MonitorOff,
  ArrowRight,
  Gauge,
  Zap,
  Construction,
  Power,
  Cog,
  Factory,
} from "lucide-react";
import { PageTransition } from "@/components/ui/animated-container";
import { Logo } from "@/components/logo";
import { useDataStore } from "@/lib/dataStore";
import { useLanguage } from "@/providers/language-provider";

interface UserData {
  monitorAccess?: string;
}

interface StoreData {
  user?: UserData;
}

type MenuItem = {
  icon: React.ElementType | any;
  title: string;
  path: string;
  gradient: string;
  iconColor: string;
};

export default function Home() {
  const router = useRouter();
  const [is3D, setIs3D] = useState(false);

  const { data } = useDataStore() as { data: StoreData };
  const { t } = useLanguage();

  const { section } = useParams();
  const device = Array.isArray(section) ? section[0] : section?.toString();

  const [monitorAccessItems, setMonitorAccessItems] = useState<string[]>([]);

  useEffect(() => {
    if (typeof data?.user?.monitorAccess === "string") {
      const parsed = data.user.monitorAccess
        .split(",")
        .map((item) => item.trim().toLowerCase());
      setMonitorAccessItems(parsed);
    } else {
      setMonitorAccessItems([]);
    }
  }, [data?.user?.monitorAccess]);

  const handleToggle = (section: string | undefined | any) => {
    if (!is3D) {
      setIs3D(true);
      if (section) {
        router.push(`/3d/${section}`);
      }
    } else {
      setIs3D(false);
    }
  };

  const isGrainPaddyDevice =
    device === "GTPL-132-300-AP-S7-1200" ||
    device === "GTPL-136-gT-450AP" ||
    device === "GTPL-139-gT-300AP-S7-1200" ||
    device === "GTPL-144-gT-300AP-S7-1200" ||
    device === "GTPL-142-gT-450AP-S7-1200" ||
    device === "GTPL-123-gT-450AP" ||
    device === "GTPL-143-gT-450AP-S7-1200";
  // device === "GTPL-131-gT-650T-S7-1200" ||
  // device === "GTPL-133-gT-650T-S7-1200" ||
  // device === "GTPL-134-gT-450T-S7-1200" ||
  // device === "GTPL-135-gT-450T-S7-1200" ||
  // device === "GTPL-145-gT-450T-S7-1200";
  const shouldHideAeration = false;
  const isS7200Device = ["108", "109", "110", "111", "112", "113"].some(
    (code) => device?.includes(`GTPL-${code}`),
  );
  const showAnalogMenu =
    isS7200Device ||
    [
      "GTPL-30-",
      "GTPL-115-",
      "GTPL-116-",
      "GTPL-117-",
      "GTPL-119-",
      "GTPL-120-",
    ].some((code) => device?.includes(code));

  const getMenuItems = (): MenuItem[] => {
    if (isGrainPaddyDevice) {
      return [
        {
          icon: Factory,
          title: `Grain Chilling Mode`,
          path: "auto-grain",
          gradient: "from-emerald-500 via-teal-500 to-green-600",
          iconColor: "text-emerald-500",
        },
        {
          icon: Gauge,
          title: `Paddy Ageing Mode`,
          path: "auto-paddy",
          gradient: "from-amber-500 via-yellow-500 to-orange-600",
          iconColor: "text-amber-500",
        },
        {
          icon: Wind,
          title: t("aeration"),
          path: "aerations",
          gradient: "from-sky-500 via-cyan-500 to-blue-600",
          iconColor: "text-sky-500",
        },
        {
          icon: AlertTriangle,
          title: t("fault"),
          path: "fault",
          gradient: "from-red-500 via-orange-500 to-rose-600",
          iconColor: "text-red-500",
        },
        {
          icon: Cog,
          title: t("settings"),
          path: "settings",
          gradient: "from-slate-500 via-zinc-500 to-gray-600",
          iconColor: "text-slate-500",
        },
        {
          icon: Power,
          title: t("inputs"),
          path: "inputs",
          gradient: "from-violet-500 via-indigo-500 to-purple-600",
          iconColor: "text-violet-500",
        },
        {
          icon: Zap,
          title: t("outputs"),
          path: "outputs",
          gradient: "from-fuchsia-500 via-pink-500 to-rose-600",
          iconColor: "text-fuchsia-500",
        },
        {
          icon: Activity,
          title: "Analog",
          path: "inputs/analog",
          gradient: "from-teal-500 via-emerald-500 to-green-600",
          iconColor: "text-teal-500",
        },
        {
          icon: Construction,
          title: t("test"),
          path: "test",
          gradient: "from-cyan-500 via-blue-500 to-indigo-600",
          iconColor: "text-cyan-500",
        },
      ];
    } else {
      const baseMenuItems: MenuItem[] = [
        {
          icon: Gauge,
          title: t("auto"),
          path: "auto",
          gradient: "from-indigo-500 via-blue-500 to-purple-600",
          iconColor: "text-indigo-500",
        },
        {
          icon: Wind,
          title: t("aeration"),
          path: "aerations",
          gradient: "from-sky-500 via-cyan-500 to-blue-600",
          iconColor: "text-sky-500",
        },
        {
          icon: AlertTriangle,
          title: t("fault"),
          path: "fault",
          gradient: "from-red-500 via-orange-500 to-rose-600",
          iconColor: "text-red-500",
        },
        {
          icon: Cog,
          title: t("settings"),
          path: "settings",
          gradient: "from-slate-500 via-zinc-500 to-gray-600",
          iconColor: "text-slate-500",
        },
        {
          icon: Power,
          title: t("inputs"),
          path: "inputs",
          gradient: "from-violet-500 via-indigo-500 to-purple-600",
          iconColor: "text-violet-500",
        },
        {
          icon: Zap,
          title: t("outputs"),
          path: "outputs",
          gradient: "from-fuchsia-500 via-pink-500 to-rose-600",
          iconColor: "text-fuchsia-500",
        },
        {
          icon: Construction,
          title: t("test"),
          path: "test",
          gradient: "from-cyan-500 via-blue-500 to-indigo-600",
          iconColor: "text-cyan-500",
        },
      ];

      // Add Analog menu item for machines that have analog screens
      if (showAnalogMenu) {
        baseMenuItems.splice(6, 0, {
          icon: Activity,
          title: "Analog",
          path: "inputs/analog",
          gradient: "from-teal-500 via-emerald-500 to-green-600",
          iconColor: "text-teal-500",
        });
      }

      if (shouldHideAeration) {
        return baseMenuItems.filter((item) => item.path !== "aerations");
      }

      return baseMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <PageTransition>
      <div className="flex min-h-screen flex-col">
        <main className="container mx-auto max-w-7xl flex-1 py-8">
          {/* Header */}
          <div className="animate-fade-in-up mb-10 text-center">
            <div className="mb-5 flex justify-center">
              <Logo size="lg" />
            </div>
            <p className="text-muted-foreground text-xs font-semibold tracking-[0.18em] uppercase">
              {t("MENU")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {device}
            </h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {t("Select an option to continue")}
            </p>
          </div>

          {/* Menu Grid */}
          <div className="stagger grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {menuItems.map((item) => {
              const pathMatch = monitorAccessItems.includes(
                item.path.toLowerCase(),
              );
              const titleMatch = monitorAccessItems.includes(
                item.title.toLowerCase(),
              );
              if (pathMatch || titleMatch) return null;

              return (
                <div key={item.title} className="tilt">
                  <Link
                    href={`/menu/${item.path}/${device}`}
                    className="group tilt-face sheen glow-edge surface focus-visible:ring-ring/50 relative flex h-full w-full flex-col items-center gap-5 overflow-hidden p-6 text-center outline-none focus-visible:ring-2"
                  >
                    {/* Depth wash behind the icon */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-32 opacity-70 transition-opacity duration-[var(--motion-medium)] group-hover:opacity-100"
                      style={{
                        background: `radial-gradient(14rem 8rem at 50% -10%, color-mix(in oklch, var(--primary) 18%, transparent), transparent 70%)`,
                      }}
                    />

                    {/* Icon plate — floats forward on hover */}
                    <span className="tilt-layer plate relative flex h-20 w-20 items-center justify-center rounded-2xl">
                      <span
                        aria-hidden
                        className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-[var(--motion-medium)] group-hover:opacity-100"
                        style={{
                          background:
                            "linear-gradient(145deg, color-mix(in oklch, var(--primary) 85%, transparent), color-mix(in oklch, var(--chart-2) 70%, transparent))",
                        }}
                      />
                      <item.icon className="text-primary relative h-9 w-9 transition-colors duration-[var(--motion-medium)] group-hover:text-white" />
                    </span>

                    <span className="tilt-layer flex flex-1 flex-col items-center gap-1">
                      <span className="text-base font-semibold tracking-tight">
                        {item.title}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {device}
                      </span>
                    </span>

                    <span className="tilt-layer text-muted-foreground group-hover:text-primary flex items-center gap-1.5 text-sm font-medium transition-colors duration-[var(--motion-fast)]">
                      Open
                      <ArrowRight className="h-4 w-4 transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
