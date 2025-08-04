"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Select from "react-select";
import { useLanguage } from "@/providers/language-provider";

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

export default function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
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

  // Example user data - in real app, this would come from an API
  useEffect(() => {
    // Simulate fetching user data
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
        email:values.email,
        monitorAccess: values.monitorAccess || [],
        locations: values.locations || [],
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      // toast.success("🎉 User created successfully!");
      if (response.status === 200 || response.status === 201) {
        toast.success("🎉 User created successfully!", {
          description: "The account has been registered.",
        });
        form.reset();
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      toast.error("❌ Registration failed", {
        description:
          error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  }
  const monitorOptions = [
    { value: "devices", label: formatText(t("devices")) },
    { value: "notifications", label: formatText(t("notifications")) },
    { value: "contacts", label: formatText(t("contacts")) },
    { value: "clusters", label: formatText(t("clusters")) },
    { value: "reports", label: formatText(t("reports")) },
    { value: "triggers", label: formatText(t("triggers")) },
    { value: "auto", label: formatText(t("auto")) },
    { value: "aeration", label: formatText(t("aeration")) },
    { value: "fault", label: formatText(t("fault")) },
    { value: "settings", label: formatText(t("settings")) },
    { value: "inputs", label: formatText(t("inputs")) },
    { value: "outputs", label: formatText(t("outputs")) },
    { value: "test", label: formatText(t("test")) },
    { value: "screen-brightness", label: formatText(t("screen_brightness")) },
    { value: "manufacturer", label: formatText(t("manufacturer")) },
    { value: "customer", label: formatText(t("customer")) },

    // ✅ Devices manually added here
    {
      value: "GTPL-122-gT-1000T-S7-1200",
      label: formatText("GTPL-122-gT-1000T-S7-1200"),
    },
    {
      value: "GTPL-118-gT-80E-P-S7-200",
      label: formatText("GTPL-118-gT-80E-P-S7-200"),
    },
    {
      value: "GTPL-108-gT-40E-P-S7-200",
      label: formatText("GTPL-108-gT-40E-P-S7-200"),
    },
    {
      value: "GTPL-109-gT-40E-P-S7-200",
      label: formatText("GTPL-109-gT-40E-P-S7-200"),
    },
    {
      value: "GTPL-110-gT-40E-P-S7-200",
      label: formatText("GTPL-110-gT-40E-P-S7-200"),
    },
    {
      value: "GTPL-111-gT-80E-P-S7-200",
      label: formatText("GTPL-111-gT-80E-P-S7-200"),
    },
    {
      value: "GTPL-112-gT-80E-P-S7-200",
      label: formatText("GTPL-112-gT-80E-P-S7-200"),
    },
    {
      value: "GTPL-113-gT-80E-P-S7-200",
      label: formatText("GTPL-113-gT-80E-P-S7-200"),
    },
    {
      value: "GTPL-114-gT-140E-S7-1200",
      label: formatText("GTPL-114-gT-140E-S7-1200"),
    },
    {
      value: "GTPL-115-gT-180E-S7-1200",
      label: formatText("GTPL-115-gT-180E-S7-1200"),
    },
    {
      value: "GTPL-116-gT-240E-S7-1200",
      label: formatText("GTPL-116-gT-240E-S7-1200"),
    },
    {
      value: "GTPL-117-gT-320E-S7-1200",
      label: formatText("GTPL-117-gT-320E-S7-1200"),
    },
    {
      value: "GTPL-119-gT-180E-S7-1200",
      label: formatText("GTPL-119-gT-180E-S7-1200"),
    },
    {
      value: "GTPL-120-gT-180E-S7-1200",
      label: formatText("GTPL-120-gT-180E-S7-1200"),
    },
    {
      value: "GTPL-121-gT-1000T-S7-1200",
      label: formatText("GTPL-121-gT-1000T-S7-1200"),
    },
  ];

  // Dynamic company and location options
  const [companyOptions, setCompanyOptions] = useState([
    { value: t("Grain Technik"), label: t("Grain Technik") },
  ]);

  const [locationOptions, setLocationOptions] = useState([
    { value: t("Germany"), label: t("Germany") },
    { value: t("Noida---kanpur"), label: t("Noida---kanpur") },
    { value: t("Noida"), label: t("Noida") },
  ]);

  // Update monitor options based on selected company and locations
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
      <div className="flex h-[52rem] bg-gray-50 dark:bg-black -mt-10">
        <div className="flex-1 p-6 h-screen mb-10">
          <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black dark:text-white">
                {formatText(t("create_account"))}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {formatText(t("fill_details_to_register"))}
              </p>
            </div>

            {/* Account Type Tabs */}
            <Tabs
              value={accountType}
     
              onValueChange={(value) =>
                form.setValue(
                  "accountType",
                  value as "manufacturer" | "customer",
                  {
                    shouldValidate: true,
                  }
                )
              }
              className="w-full mb-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                {!monitorAccessItems.includes("manufacturer") && (
                  <TabsTrigger value="manufacturer">
                    {formatText(t("manufacturer"))}
                  </TabsTrigger>
                )}
                {!monitorAccessItems.includes("customer") && (
                  <TabsTrigger value="customer">
                    {formatText(t("customer"))}
                  </TabsTrigger>
                )}
              </TabsList>
            </Tabs>

            {/* Form */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* First & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{formatText(t("first_name"))}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                          />
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
                        <FormLabel>{formatText(t("last_name"))}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Username */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatText(t("username"))}</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatText(t("email"))}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          {...field}
                          className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatText(t("phone_number"))}</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          {...field}
                          className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Company */}
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatText(t("company"))}</FormLabel>
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Locations */}
                <FormField
                  control={form.control}
                  name="locations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatText(t("locations"))}</FormLabel>
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Monitor Access */}
                <FormField
                  control={form.control}
                  name="monitorAccess"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatText(t("monitor_access"))}</FormLabel>
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatText(t("password"))}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{formatText(t("confirm_password"))}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          {...field}
                          className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button type="submit" className="w-full" disabled={isLoading || data?.user?.firstName === "Prosafe" }>
                  {isLoading
                    ? formatText(t("registering"))
                    : formatText(t("register"))}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
