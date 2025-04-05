"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Select from "react-select";

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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"; // ✅ Shadcn Tabs

// Zod Schema
const formSchema = z
  .object({
    accountType: z.enum(["manufactura", "customer"], {
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
    email: z.string().email().optional(),
    phoneNumber: z.string().min(10, {
      message: "Phone number must be at least 10 digits.",
    }),
    company: z.string().min(1, {
      message: "Please select a company.",
    }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
    monitorAccess: z.string().array().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.accountType === "manufactura") return !!data.email;
      return true;
    },
    {
      message: "Email is required for manufactura accounts",
      path: ["email"],
    }
  )
  .refine(
    (data) => {
      if (data.accountType === "manufactura") {
        return data.monitorAccess && data.monitorAccess.length > 0;
      }
      return true;
    },
    {
      message: "Select at least one monitor access option for manufactura",
      path: ["monitorAccess"],
    }
  );

type FormSchemaType = z.infer<typeof formSchema>;

export default function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountType: "manufactura",
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      phoneNumber: "",
      company: "",
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
        email: values.accountType === "manufactura" ? values.email : undefined,
        monitorAccess: values.monitorAccess || [],
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      toast.success("Registration successful", {
        description: "Account created successfully. Check your email.",
      });

      form.reset();
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
    { value: "overview", label: "Overview" },
    { value: "monitoring-locations", label: "Monitoring Locations" },
    { value: "dashboards", label: "Dashboards" },
    { value: "devices", label: "Devices" },
    { value: "notifications", label: "Notifications" },
    { value: "contacts", label: "Contacts" },
    { value: "clusters", label: "Clusters" },
    { value: "reports", label: "Reports" },
    { value: "triggers", label: "Triggers" },
    { value: "auto", label: "Auto" },
    { value: "aeration", label: "Aeration" },
    { value: "fault", label: "Fault" },
    { value: "settings", label: "Settings" },
    { value: "inputs", label: "Inputs" },
    { value: "outputs", label: "Outputs" },
    { value: "test", label: "Test" },
    { value: "screen-brightness", label: "Screen Brightness" },
  ];

  return (
    <DashboardLayout>
      <div className="flex h-[52rem] bg-gray-50 dark:bg-black -mt-10">
        <div className="flex-1 p-6 h-screen mb-10">
          <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black dark:text-white">
                Create Account
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Fill in your details to register
              </p>
            </div>

            {/* Account Type Tabs */}
            <Tabs
              value={accountType}
              onValueChange={(value) =>
                form.setValue(
                  "accountType",
                  value as "manufactura" | "customer",
                  {
                    shouldValidate: true,
                  }
                )
              }
              className="w-full mb-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manufactura">Manufactura</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
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
                        <FormLabel>First Name</FormLabel>
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
                        <FormLabel>Last Name</FormLabel>
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
                      <FormLabel>Username</FormLabel>
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

                {/* Email (Only for manufactura) */}
                {accountType === "manufactura" && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
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
                )}

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
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
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 rounded"
                        >
                          <option value="">Select Company</option>
                          <option value="companyA">Company A</option>
                          <option value="companyB">Company B</option>
                          <option value="companyC">Company C</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Monitor Access (Only for manufactura) */}
                {accountType === "manufactura" && (
                  <FormField
                    control={form.control}
                    name="monitorAccess"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monitor Access</FormLabel>
                        <FormControl>
                          <Select
                            isMulti
                            options={monitorOptions}
                            value={monitorOptions.filter((opt) =>
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
                )}

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
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
                      <FormLabel>Confirm Password</FormLabel>
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
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registering..." : "Register"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
