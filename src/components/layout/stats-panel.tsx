"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Mail,
  Cpu,
  Users,
  Zap,
  LayoutGrid,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/providers/language-provider";

const stats = [
  { label: "sms", value: "0/50", used: 0, total: 50, icon: MessageSquare, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "email", value: "0/1000", used: 0, total: 1000, icon: Mail, color: "from-violet-500 to-purple-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
  { label: "device", value: "2/50", used: 2, total: 50, icon: Cpu, color: "from-emerald-500 to-green-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { label: "contact", value: "0/10", used: 0, total: 10, icon: Users, color: "from-rose-500 to-pink-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
  { label: "trigger", value: "0/500", used: 0, total: 500, icon: Zap, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
  { label: "dashboard_widget", value: "0/10", used: 0, total: 10, icon: LayoutGrid, color: "from-indigo-500 to-blue-500", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  { label: "report", value: "0/70", used: 0, total: 70, icon: FileText, color: "from-teal-500 to-emerald-500", bg: "bg-teal-50 dark:bg-teal-900/20" },
];

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: "easeOut" },
  }),
};

export default function StatsPanel() {
  const { t } = useLanguage();

  return (
    <div className="p-3 space-y-2">
      {stats.map((stat, index) => {
        const percentage = stat.total > 0 ? (stat.used / stat.total) * 100 : 0;
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.label}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.01, x: 2 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 transition-all"
          >
            {/* Icon */}
            <div className={`flex-shrink-0 p-2 ${stat.bg} rounded-lg`}>
              <div className={`bg-gradient-to-br ${stat.color} p-1.5 rounded-md`}>
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
            </div>

            {/* Label + Progress */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">
                  {t(stat.label)}
                </span>
                <span className="text-xs font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </span>
              </div>
              {/* Progress Bar */}
              <div className="h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(percentage, 2)}%` }}
                  transition={{ delay: 0.3 + index * 0.06, duration: 0.6, ease: "easeOut" }}
                  className={`h-full rounded-full bg-gradient-to-r ${stat.color}`}
                />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
