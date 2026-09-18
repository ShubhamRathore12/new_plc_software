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
  FormDescription,
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
import { api } from "@/lib/apiClient";
import { UserPlus } from "lucide-react";
import { getDeviceLocations } from "@/lib/devices";

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
    // Matches the server policy in lib/passwordPolicy.ts.
    password: z
      .string()
      .min(12, { message: "Password must be at least 12 characters." })
      .regex(/[a-z]/i, { message: "Password must contain a letter." })
      .regex(/\d/, { message: "Password must contain a number." }),
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

      const BACKEND_URL =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://www.primeosys.com/backend";

      const response = await api("/api/register", {
        skipAuthRedirect: true,
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
    { value: "contacts", label: formatText(t("contacts")) },
    { value: "reports", label: formatText(t("reports")) },
    { value: "manufacturer", label: formatText(t("manufacturer")) },
    { value: "customer", label: formatText(t("customer")) },
    { value: "Registration", label: formatText(t("Registration")) },

    // ✅ Devices from allDevices array (all machines from devices page)
    { value: "GTPL-30-gT-180E-S7-1200", label: "GTPL-30-gT-180E-S7-1200" },
    { value: "GTPL-061-gT-450T-S7-1200", label: "GTPL-061-gT-450T-S7-1200" },
    { value: "GTPL-081-gT-650T-S7-1200", label: "GTPL-081-gT-650T-S7-1200" },
    { value: "GTPL-105-gT-650T-S7-1200", label: "GTPL-105-gT-650T-S7-1200" },
    { value: "GTPL-108-gT-40E-P-S7-200", label: "GTPL-108-gT-40E-P-S7-200" },
    { value: "GTPL-109-gT-40E-P-S7-200", label: "GTPL-109-gT-40E-P-S7-200" },
    { value: "GTPL-110-gT-40E-P-S7-200", label: "GTPL-110-gT-40E-P-S7-200" },
    { value: "GTPL-111-gT-80E-P-S7-200", label: "GTPL-111-gT-80E-P-S7-200" },
    { value: "GTPL-112-gT-80E-P-S7-200", label: "GTPL-112-gT-80E-P-S7-200" },
    { value: "GTPL-113-gT-80E-P-S7-200", label: "GTPL-113-gT-80E-P-S7-200" },
    { value: "GTPL-115-gT-180E-S7-1200", label: "GTPL-115-gT-180E-S7-1200" },
    { value: "GTPL-116-gT-240E-S7-1200", label: "GTPL-116-gT-240E-S7-1200" },
    { value: "GTPL-117-gT-320E-S7-1200", label: "GTPL-117-gT-320E-S7-1200" },
    { value: "GTPL-118-gT-60T-S7-200", label: "GTPL-118-gT-60T-S7-200" },
    { value: "GTPL-119-gT-180E-S7-1200", label: "GTPL-119-gT-180E-S7-1200" },
    { value: "GTPL-120-gT-180E-S7-1200", label: "GTPL-120-gT-180E-S7-1200" },
    { value: "GTPL-121-gT-1000T-S7-1200", label: "GTPL-121-gT-1000T-S7-1200" },
    { value: "GTPL-122-gT-1000T-S7-1200", label: "GTPL-122-gT-1000T-S7-1200" },
    { value: "GTPL-123-gT-450AP", label: "GTPL-123-gT-450AP" },
    { value: "GTPL-124-gT-450T-S7-1200", label: "GTPL-124-gT-450T-S7-1200" },
    { value: "GTPL-131-gT-650T-S7-1200", label: "GTPL-131-gT-650T-S7-1200" },
    { value: "GTPL-132-300-AP-S7-1200", label: "GTPL-132-300-AP-S7-1200" },
    { value: "GTPL-133-gT-650T-S7-1200", label: "GTPL-133-gT-650T-S7-1200" },
    { value: "GTPL-154-gT-650T-S7-1200", label: "GTPL-154-gT-650T-S7-1200" },
    { value: "GTPL-155-gT-650T-S7-1200", label: "GTPL-155-gT-650T-S7-1200" },
    { value: "GTPL-134-gT-450T-S7-1200", label: "GTPL-134-gT-450T-S7-1200" },
    { value: "GTPL-135-gT-450T-S7-1200", label: "GTPL-135-gT-450T-S7-1200" },
    { value: "GTPL-136-gT-450AP", label: "GTPL-136-gT-450AP" },
    { value: "GTPL-137-gT-450T-S7-1200", label: "GTPL-137-gT-450T-S7-1200" },
    { value: "GTPL-138-gT-450T-S7-1200", label: "GTPL-138-gT-450T-S7-1200" },
    { value: "GTPL-139-gT-300AP-S7-1200", label: "GTPL-139-gT-300AP-S7-1200" },
    { value: "GTPL-142-gT-450AP-S7-1200", label: "GTPL-142-gT-450AP-S7-1200" },
    { value: "GTPL-143-gT-450AP-S7-1200", label: "GTPL-143-gT-450AP-S7-1200" },
    { value: "GTPL-144-gT-300AP-S7-1200", label: "GTPL-144-gT-300AP-S7-1200" },
    { value: "GTPL-145-gT-450T-S7-1200", label: "GTPL-145-gT-450T-S7-1200" },
    { value: "GTPL-148-gT-450T-S7-1200", label: "GTPL-148-gT-450T-S7-1200" },
    { value: "GTPL-149-gT-60T-S7-1200", label: "GTPL-149-gT-60T-S7-1200" },
    { value: "GTPL-068-gT-650T-S7-1200", label: "GTPL-068-gT-650T-S7-1200" },
    { value: "GTPL-104-gT-650T-S7-1200", label: "GTPL-104-gT-650T-S7-1200" },
    
  ];

  // Dynamic company and location options
  const [companyOptions, setCompanyOptions] = useState([
    { value: t("Grain Technik"), label: t("Grain Technik") },
  ]);

  // Locations come from the machine list on the devices page, so both stay in sync.
  const [locationOptions, setLocationOptions] = useState(
    getDeviceLocations().map((loc) => ({ value: t(loc), label: t(loc) }))
  );

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
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64"
          style={{
            background:
              "radial-gradient(38rem 16rem at 18% 0%, color-mix(in oklch, var(--primary) 13%, transparent), transparent 70%), radial-gradient(30rem 14rem at 85% 6%, color-mix(in oklch, var(--chart-3) 10%, transparent), transparent 70%)",
          }}
        />
        <div className="relative mx-auto w-full max-w-2xl pt-4 pb-12">
          <div className="surface animate-fade-in-up space-y-6 p-6 sm:p-8">
            <div className="text-center">
              <p className="text-primary flex items-center justify-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
                <UserPlus className="h-3.5 w-3.5" />
                {formatText(t("create_account"))}
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                {formatText(t("fill_details_to_register"))}
              </h1>
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
                            autoComplete="given-name"
                            {...field}
                           
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
                            autoComplete="family-name"
                            {...field}
                           
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
                          autoComplete="username"
                          {...field}
                         
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
                          autoComplete="email"
                          {...field}
                         
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
                          autoComplete="tel"
                          {...field}
                         
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
                          autoComplete="new-password"
                          minLength={12}
                          placeholder="At least 12 characters"
                          {...field}
                         
                        />
                      </FormControl>
                      <FormDescription>
                        At least 12 characters, with one letter and one number.
                        It must not contain your username or be a common
                        password.
                      </FormDescription>
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
                          autoComplete="new-password"
                          minLength={12}
                          placeholder="Re-enter password"
                          {...field}
                         
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="mt-2 w-full"
                  disabled={isLoading || data?.user?.firstName === "Prosafe"}
                >
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
