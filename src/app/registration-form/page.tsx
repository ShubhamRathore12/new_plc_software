"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Select from "react-select";
import { useLanguage } from "@/providers/language-provider";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDataStore } from "@/lib/store";
import { ALL_DEVICE_NAMES } from "@/lib/machineRegistry";

// Zod Schema
const formSchema = z
  .object({
    accountType: z.enum(["manufacturer", "customer"], {
      required_error: "Please select an account type.",
    }),
    firstName: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastName: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    username: z.string().min(3, {
      message: "Username must be at least 3 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phoneNumber: z.string().min(10, {
      message: "Phone number must be at least 10 digits.",
    }),
    company: z.string().min(1, {
      message: "Please select a company.",
    }),
    locations: z.array(z.string()).min(1, {
      message: "Please select at least one location.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    monitorAccess: z.array(z.string()).min(1, {
      message: "Please select at least one monitor access option.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (
        data.accountType === "manufacturer" ||
        data.accountType === "customer"
      ) {
        return !!data.email;
      }
      return true;
    },
    {
      message: "Email is required",
      path: ["email"],
    }
  )
  .refine(
    (data) => {
      if (
        data.accountType === "manufacturer" ||
        data.accountType === "customer"
      ) {
        return data.monitorAccess && data.monitorAccess.length > 0;
      }
      return true;
    },
    {
      message: "Select at least one monitor access option",
      path: ["monitorAccess"],
    }
  )
  .refine(
    (data) => {
      if (
        data.accountType === "manufacturer" ||
        data.accountType === "customer"
      ) {
        return data.locations && data.locations.length > 0;
      }
      return true;
    },
    {
      message: "Select at least one location",
      path: ["locations"],
    }
  );

type FormSchemaType = z.infer<typeof formSchema>;

interface UserData {
  id: number;
  accountType: "manufacturer" | "customer";
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phoneNumber: string;
  company: string;
  created_at: string;
  monitorAccess?: string | any;
}

interface StoreData {
  user?: UserData;
}

const formatText = (text: string) => {
  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Custom styles for react-select to match modern theme
const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    background: "rgb(249, 250, 251)",
    borderColor: state.isFocused ? "rgb(99, 102, 241)" : "rgb(229, 231, 235)",
    borderRadius: "0.75rem",
    minHeight: "42px",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : "none",
    "&:hover": { borderColor: "rgb(99, 102, 241)" },
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: "0.75rem",
    overflow: "hidden",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "rgb(99, 102, 241)"
      : state.isFocused
      ? "rgb(238, 242, 255)"
      : "transparent",
    color: state.isSelected ? "white" : "rgb(55, 65, 81)",
    "&:active": { backgroundColor: "rgb(199, 210, 254)" },
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: "rgb(238, 242, 255)",
    borderRadius: "0.5rem",
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: "rgb(67, 56, 202)",
    fontWeight: 500,
    fontSize: "0.8rem",
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: "rgb(99, 102, 241)",
    "&:hover": { backgroundColor: "rgb(199, 210, 254)", color: "rgb(67, 56, 202)" },
    borderRadius: "0 0.5rem 0.5rem 0",
  }),
};

export default function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useLanguage();
  const { data } = useDataStore() as { data: StoreData };

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

  useEffect(() => {
    const mockUserData: UserData = {
      id: 1,
      accountType: "manufacturer",
      firstName: "Narayan",
      lastName: "Singh",
      username: "Narayan12",
      email: "narayan@gmail.com",
      phoneNumber: "9999999999",
      company: "companyA",
      monitorAccess: 0,
      created_at: "2025-04-10T10:37:51.000Z",
    };
    setUserData(mockUserData);
  }, []);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: userData?.accountType || "manufacturer",
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      username: userData?.username || "",
      email: userData?.email || "",
      phoneNumber: userData?.phoneNumber || "",
      company: userData?.company || "",
      locations: [],
      password: "",
      confirmPassword: "",
      monitorAccess: [],
    },
  });

  const accountType = form.watch("accountType");

  async function onSubmit(values: FormSchemaType) {
    setIsLoading(true);
    try {
      const payload: any = {
        ...values,
        email: values.email,
        monitorAccess: values.monitorAccess || [],
        locations: values.locations || [],
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.status === 200 || response.status === 201) {
        toast.success("User created successfully!", {
          description: "The account has been registered.",
        });
        form.reset();
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const monitorOptions = [
    { value: "devices", label: formatText(t("devices")) },
    { value: "contacts", label: formatText(t("contacts")) },
    { value: "reports", label: formatText(t("reports")) },
    { value: "manufacturer", label: formatText(t("manufacturer")) },
    { value: "customer", label: formatText(t("customer")) },
    { value: "Registration", label: formatText(t("Registration")) },
    ...ALL_DEVICE_NAMES
      .filter((name) => name !== "Gtpl-S7-1200-02")
      .map((name) => ({ value: name, label: name })),
  ];

  const [companyOptions, setCompanyOptions] = useState([
    { value: t("Grain Technik"), label: t("Grain Technik") },
  ]);

  const [locationOptions, setLocationOptions] = useState([
    { value: t("Germany"), label: t("Germany") },
    { value: t("Noida---kanpur"), label: t("Noida---kanpur") },
    { value: t("Noida"), label: t("Noida") },
    { value: t("Indonesia"), label: t("Indonesia") },
    { value: t("Salem (Tamil Nadu)"), label: t("Salem (Tamil Nadu)") },
    { value: t("Thailand"), label: t("Thailand") },
    { value: t("Turkey"), label: t("Turkey") },
  ]);

  const getMonitorOptions = () => {
    const selectedCompany = form.watch("company");
    const selectedLocations = form.watch("locations") || [];

    const companySpecificOptions = selectedCompany
      ? [
          {
            value: `${selectedCompany}-overview`,
            label: `${selectedCompany} ${t("Overview")}`,
          },
          {
            value: `${selectedCompany}-devices`,
            label: `${selectedCompany} ${t("Devices")}`,
          },
          {
            value: `${selectedCompany}-reports`,
            label: `${selectedCompany} ${t("Reports")}`,
          },
        ]
      : [];

    const locationSpecificOptions = selectedLocations
      .map((location) => [
        {
          value: `${location}-monitoring`,
          label: `${location} ${t("Monitoring")}`,
        },
        {
          value: `${location}-dashboards`,
          label: `${location} ${t("Dashboards")}`,
        },
        {
          value: `${location}-notifications`,
          label: `${location} ${t("Notifications")}`,
        },
      ])
      .flat();

    return [
      ...monitorOptions,
      ...companySpecificOptions,
      ...locationSpecificOptions,
    ];
  };

  return (
    <DashboardLayout>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 py-8 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="w-full max-w-lg mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div
              className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/25 mb-4"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <UserPlus className="h-7 w-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatText(t("create_account"))}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formatText(t("fill_details_to_register"))}
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            {/* Account Type Tabs */}
            <motion.div
              variants={itemVariants}
              className="p-5 pb-0"
            >
              <Tabs
                value={accountType}
                onValueChange={(value) =>
                  form.setValue(
                    "accountType",
                    value as "manufacturer" | "customer",
                    { shouldValidate: true }
                  )
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700 rounded-xl p-1 h-11">
                  {!monitorAccessItems.includes("manufacturer") && (
                    <TabsTrigger
                      value="manufacturer"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 transition-all font-medium text-sm"
                    >
                      <Building2 className="h-4 w-4 mr-1.5" />
                      {formatText(t("manufacturer"))}
                    </TabsTrigger>
                  )}
                  {!monitorAccessItems.includes("customer") && (
                    <TabsTrigger
                      value="customer"
                      className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-600 transition-all font-medium text-sm"
                    >
                      <User className="h-4 w-4 mr-1.5" />
                      {formatText(t("customer"))}
                    </TabsTrigger>
                  )}
                </TabsList>
              </Tabs>
            </motion.div>

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="p-5 space-y-4"
              >
                {/* First & Last Name */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {formatText(t("first_name"))}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              className="pl-9 h-[42px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-black dark:text-white"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {formatText(t("last_name"))}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              className="pl-9 h-[42px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-black dark:text-white"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Username */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {formatText(t("username"))}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">@</span>
                            <Input
                              {...field}
                              className="pl-9 h-[42px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-black dark:text-white"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Email */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {formatText(t("email"))}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="email"
                              {...field}
                              className="pl-9 h-[42px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-black dark:text-white"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Phone */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {formatText(t("phone_number"))}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type="tel"
                              {...field}
                              className="pl-9 h-[42px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-black dark:text-white"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Company */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {formatText(t("company"))}
                        </FormLabel>
                        <FormControl>
                          <Select
                            options={companyOptions}
                            value={companyOptions.find(
                              (opt) => opt.value === field.value
                            )}
                            onChange={(selected) =>
                              field.onChange(selected?.value)
                            }
                            className="text-black"
                            classNamePrefix="react-select"
                            styles={selectStyles}
                            placeholder="Select company..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Locations */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="locations"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {formatText(t("locations"))}
                        </FormLabel>
                        <FormControl>
                          <Select
                            isMulti
                            options={locationOptions}
                            value={locationOptions.filter((opt) =>
                              field.value?.includes(opt.value)
                            )}
                            onChange={(selected) =>
                              field.onChange(selected.map((s) => s.value))
                            }
                            className="text-black"
                            classNamePrefix="react-select"
                            styles={selectStyles}
                            placeholder="Select locations..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Monitor Access */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="monitorAccess"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Shield className="h-3.5 w-3.5" />
                          {formatText(t("monitor_access"))}
                        </FormLabel>
                        <FormControl>
                          <Select
                            isMulti
                            options={getMonitorOptions()}
                            value={getMonitorOptions().filter((opt) =>
                              field.value?.includes(opt.value)
                            )}
                            onChange={(selected) =>
                              field.onChange(selected.map((s) => s.value))
                            }
                            className="text-black"
                            classNamePrefix="react-select"
                            styles={selectStyles}
                            placeholder="Select access permissions..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Divider */}
                <motion.div variants={itemVariants} className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-3 text-gray-400 font-medium tracking-wider">
                      Security
                    </span>
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {formatText(t("password"))}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              {...field}
                              className="pl-9 pr-10 h-[42px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-black dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                          {formatText(t("confirm_password"))}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                              className="pl-9 pr-10 h-[42px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-black dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Submit */}
                <motion.div variants={itemVariants} className="pt-2">
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="submit"
                      className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-blue-500/25 transition-all"
                      disabled={
                        isLoading ||
                        data?.user?.firstName === "Prosafe"
                      }
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          {formatText(t("registering"))}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          {formatText(t("register"))}
                        </span>
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
