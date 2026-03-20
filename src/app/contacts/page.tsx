"use client";

import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { apiRequest } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  User,
  Mail,
  MessageSquare,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Headphones,
  Globe,
} from "lucide-react";

const Contact3D = dynamic(() => import("@/components/Contact3D"), {
  ssr: false,
});

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -2, transition: { duration: 0.25 } },
};

export default function ContactPage() {
  const { t } = useLanguage();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus("");

    try {
      const data = await apiRequest("/api/send-email", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (data && data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("error");
    } finally {
      setIsSending(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "Phone",
      value: "+91 98765 43210",
      color: "from-blue-500 to-cyan-500",
      bg: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      icon: Mail,
      label: "Email",
      value: "support@graintechnik.com",
      color: "from-violet-500 to-purple-500",
      bg: "bg-violet-50 dark:bg-violet-900/20",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "Noida, UP, India",
      color: "from-rose-500 to-pink-500",
      bg: "bg-rose-50 dark:bg-rose-900/20",
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon - Sat, 9AM - 6PM",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50 dark:bg-amber-900/20",
    },
  ];

  return (
    <DashboardLayout>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 p-4 md:p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <motion.div
              className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Headphones className="h-5 w-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("Contact Us")}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("Get in Touch")} — we&apos;d love to hear from you
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {/* Left: Contact Form */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Form Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {t("Send Message")}
                </h2>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Fill in the form below and we&apos;ll get back to you shortly
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={sendEmail} className="p-6 space-y-5">
              {/* Name Field */}
              <motion.div
                variants={itemVariants}
                className="space-y-1.5"
              >
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t("Name")}
                </label>
                <div className={`relative rounded-xl transition-all duration-300 ${
                  focusedField === "name" ? "ring-2 ring-blue-500/20" : ""
                }`}>
                  <User className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                    focusedField === "name" ? "text-blue-500" : "text-gray-400"
                  }`} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </motion.div>

              {/* Email Field */}
              <motion.div
                variants={itemVariants}
                className="space-y-1.5"
              >
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t("Email")}
                </label>
                <div className={`relative rounded-xl transition-all duration-300 ${
                  focusedField === "email" ? "ring-2 ring-blue-500/20" : ""
                }`}>
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors ${
                    focusedField === "email" ? "text-blue-500" : "text-gray-400"
                  }`} />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </motion.div>

              {/* Message Field */}
              <motion.div
                variants={itemVariants}
                className="space-y-1.5"
              >
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t("Message")}
                </label>
                <div className={`relative rounded-xl transition-all duration-300 ${
                  focusedField === "message" ? "ring-2 ring-blue-500/20" : ""
                }`}>
                  <MessageSquare className={`absolute left-3 top-3.5 h-4 w-4 transition-colors ${
                    focusedField === "message" ? "text-blue-500" : "text-gray-400"
                  }`} />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    required
                    rows={5}
                    placeholder="Tell us how we can help you..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <motion.button
                  type="submit"
                  disabled={isSending}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("Sending...")}
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {t("Send Message")}
                    </>
                  )}
                </motion.button>
              </motion.div>

              {/* Status Messages */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {t("Message sent successfully!")}
                      </span>
                    </div>
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-red-700 dark:text-red-300">
                        {t("Failed to send message. Try again later.")}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Right: 3D + Contact Info */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 space-y-5"
          >
            {/* 3D Globe Card */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden"
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-5 pt-4 pb-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Global Reach
                </span>
              </div>
              <div className="h-64 flex items-center justify-center">
                <Contact3D />
              </div>
            </motion.div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {contactInfo.map((info, index) => (
                <motion.div
                  key={info.label}
                  custom={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-center gap-3.5 cursor-default shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`p-2.5 rounded-xl ${info.bg}`}>
                    <div className={`bg-gradient-to-br ${info.color} p-2 rounded-lg`}>
                      <info.icon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t(info.label)}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {info.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Support Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-500/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <Headphones className="h-5 w-5" />
                <span className="font-semibold">Need Immediate Help?</span>
              </div>
              <p className="text-sm text-blue-100 mb-3">
                Our support team is available during working hours. Call us for urgent machine-related issues.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-blue-100 font-medium">Support team is online</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
