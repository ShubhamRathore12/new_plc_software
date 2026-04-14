"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
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
import { motion } from "framer-motion";
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

  const isGrainPaddyDevice = device === "GTPL-132-300-AP-S7-1200"  || device === "GTPL-136-gT-450AP" || device === 'GTPL-139-GT-300AP-S7-1200' || device === 'GTPL-144-GT-300AP-S7-1200' || device === 'GTPL-142-gT-450AP-S7-1200' || device === 'GTPL-123-GT-450AP' || device === 'GTPL-143-gT-450AP-S7-1200' || device === 'GTPL-121-gT-1000T-S7-1200' || device === 'GTPL-122-gT-1000T-S7-1200'  || device === 'GTPL-131-GT-650T-S7-1200' || device === 'GTPL-133-GT-650T-S7-1200' || device === 'GTPL-134-gT-450T-S7-1200' || device === 'GTPL-135-gT-450T-S7-1200' || device === 'GTPL-145-gT-450T-S7-1200' || device === 'GTPL-124-GT-450T-S7-1200'  ;
  const shouldHideAeration = false;
  const isS7200Device = ['108', '109', '110', '111', '112', '113'].some(code => device?.includes(`GTPL-${code}`));
  const showAnalogMenu = isS7200Device || ['GTPL-30-', 'GTPL-115-', 'GTPL-116-', 'GTPL-117-', 'GTPL-119-', 'GTPL-120-'].some(code => device?.includes(code));

  const getMenuItems = (): MenuItem[] => {
    if (isGrainPaddyDevice) {
      return [
        { 
          icon: Factory, 
          title: `Grain Chilling Mode`, 
          path: "auto-grain",
          gradient: "from-emerald-500 via-teal-500 to-green-600",
          iconColor: "text-emerald-500"
        },
        { 
          icon: Gauge, 
          title: `Paddy Ageing Mode`, 
          path: "auto-paddy",
          gradient: "from-amber-500 via-yellow-500 to-orange-600",
          iconColor: "text-amber-500"
        },
        { 
          icon: Wind, 
          title: t("aeration"), 
          path: "aerations",
          gradient: "from-sky-500 via-cyan-500 to-blue-600",
          iconColor: "text-sky-500"
        },
        { 
          icon: AlertTriangle, 
          title: t("fault"), 
          path: "fault",
          gradient: "from-red-500 via-orange-500 to-rose-600",
          iconColor: "text-red-500"
        },
        { 
          icon: Cog, 
          title: t("settings"), 
          path: "settings",
          gradient: "from-slate-500 via-zinc-500 to-gray-600",
          iconColor: "text-slate-500"
        },
        { 
          icon: Power, 
          title: t("inputs"), 
          path: "inputs",
          gradient: "from-violet-500 via-indigo-500 to-purple-600",
          iconColor: "text-violet-500"
        },
        { 
          icon: Zap, 
          title: t("outputs"), 
          path: "outputs",
          gradient: "from-fuchsia-500 via-pink-500 to-rose-600",
          iconColor: "text-fuchsia-500"
        },
        {
          icon: Activity,
          title: "Analog",
          path: "inputs/analog",
          gradient: "from-teal-500 via-emerald-500 to-green-600",
          iconColor: "text-teal-500"
        },
        {
          icon: Construction,
          title: t("test"),
          path: "test",
          gradient: "from-cyan-500 via-blue-500 to-indigo-600",
          iconColor: "text-cyan-500"
        },
      ];
    } else {
      const baseMenuItems: MenuItem[] = [
        {
          icon: Gauge,
          title: t("auto"),
          path: "auto",
          gradient: "from-indigo-500 via-blue-500 to-purple-600",
          iconColor: "text-indigo-500"
        },
        {
          icon: Wind,
          title: t("aeration"),
          path: "aerations",
          gradient: "from-sky-500 via-cyan-500 to-blue-600",
          iconColor: "text-sky-500"
        },
        {
          icon: AlertTriangle,
          title: t("fault"),
          path: "fault",
          gradient: "from-red-500 via-orange-500 to-rose-600",
          iconColor: "text-red-500"
        },
        {
          icon: Cog,
          title: t("settings"),
          path: "settings",
          gradient: "from-slate-500 via-zinc-500 to-gray-600",
          iconColor: "text-slate-500"
        },
        {
          icon: Power,
          title: t("inputs"),
          path: "inputs",
          gradient: "from-violet-500 via-indigo-500 to-purple-600",
          iconColor: "text-violet-500"
        },
        {
          icon: Zap,
          title: t("outputs"),
          path: "outputs",
          gradient: "from-fuchsia-500 via-pink-500 to-rose-600",
          iconColor: "text-fuchsia-500"
        },
        {
          icon: Construction,
          title: t("test"),
          path: "test",
          gradient: "from-cyan-500 via-blue-500 to-indigo-600",
          iconColor: "text-cyan-500"
        },
      ];

      // Add Analog menu item for machines that have analog screens
      if (showAnalogMenu) {
        baseMenuItems.splice(6, 0, {
          icon: Activity,
          title: "Analog",
          path: "inputs/analog",
          gradient: "from-teal-500 via-emerald-500 to-green-600",
          iconColor: "text-teal-500"
        });
      }

      if (shouldHideAeration) {
        return baseMenuItems.filter(item => item.path !== "aerations");
      }

      return baseMenuItems;
    }
  };

  const menuItems = getMenuItems();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <main className="flex-1 container py-8 max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-12 text-center relative"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <div className="flex justify-center mb-6">
              <Logo size="lg" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
              {t("MENU")}
            </h1>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
              {device}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("Select an option to continue")}
            </p>
          </motion.div>

          {/* Menu Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {menuItems.map((item, index) => {
              const pathMatch = monitorAccessItems.includes(item.path.toLowerCase());
              const titleMatch = monitorAccessItems.includes(item.title.toLowerCase());
              const isDisabled = pathMatch || titleMatch;
              const shouldHide = isDisabled;

              if (shouldHide) return null;

              return (
                <motion.div 
                  key={item.title}
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    onClick={() => {
                      if (!isDisabled) {
                        router.push(`/menu/${item.path}/${device}`);
                      }
                    }}
                    className={`group relative overflow-hidden h-full cursor-pointer border-2 transition-all duration-300 ${
                      isDisabled
                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                        : "hover:shadow-2xl hover:border-transparent bg-white dark:bg-gray-800"
                    }`}
                  >
                    {/* Full card animated gradient background on hover */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                    
                    {/* Animated gradient overlay with movement */}
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-20`}
                      animate={{
                        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />

                    {/* Animated shimmer effect */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100"
                      initial={{ x: "-100%" }}
                      whileHover={{
                        x: "100%",
                        transition: {
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "linear"
                        }
                      }}
                    >
                      <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
                    </motion.div>

                    {/* Animated border gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl`}></div>

                    <CardContent className="relative p-8 flex flex-col items-center text-center h-full justify-between z-10">
                      {/* Icon container */}
                      <div className="relative mb-6">
                        <motion.div 
                          className="relative bg-gray-50 dark:bg-gray-900 p-6 rounded-2xl group-hover:bg-white/90 dark:group-hover:bg-gray-800/90 transition-all duration-300 backdrop-blur-sm"
                          animate={{
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                            repeatType: "reverse"
                          }}
                        >
                          <motion.div
                            whileHover={{ 
                              rotate: 360,
                              scale: 1.2
                            }}
                            transition={{ 
                              duration: 0.6,
                              type: "spring",
                              stiffness: 200
                            }}
                          >
                            <item.icon className={`h-16 w-16 ${item.iconColor} group-hover:text-white transition-colors duration-300`} />
                          </motion.div>
                        </motion.div>

                        {/* Rotating glow ring */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-2xl blur-md opacity-0 group-hover:opacity-50`}
                          animate={{
                            rotate: [0, 360],
                            scale: [1, 1.1, 1]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear"
                          }}
                        />
                      </div>

                      {/* Title */}
                      <div className="flex-1 flex flex-col justify-center">
                        <motion.h2 
                          className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-white transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.title}
                        </motion.h2>
                      </div>

                      {/* Arrow indicator */}
                      <motion.div
                        className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ x: -10 }}
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      >
                        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-white">
                          <span>Open</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </motion.div>

                      {/* Floating particles */}
                      <motion.div
                        className="absolute top-4 right-4 w-3 h-3 bg-white/50 rounded-full"
                        animate={{
                          y: [-10, 10, -10],
                          x: [-5, 5, -5],
                          opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />
                      <motion.div
                        className="absolute bottom-4 left-4 w-2 h-2 bg-white/40 rounded-full"
                        animate={{
                          y: [10, -10, 10],
                          x: [5, -5, 5],
                          opacity: [0.2, 0.7, 0.2]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          repeatType: "reverse",
                          delay: 0.5
                        }}
                      />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}