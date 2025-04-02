"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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

// Extend your form schema to include "monitorAccess" (array of strings).
// We'll require monitorAccess only if accountType is "manufactura".
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
    // Email is required only for manufactura account type
    email: z
      .string()
      .email({ message: "Please enter a valid email address." })
      .optional(),
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
    // "monitorAccess" will be an array of strings (card identifiers)
    monitorAccess: z.string().array().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  // Custom refinement: if accountType is manufactura, email is required
  .refine(
    (data) => {
      if (data.accountType === "manufactura") {
        return !!data.email;
      }
      return true;
    },
    { message: "Email is required for manufactura accounts", path: ["email"] }
  )
  // If user is "manufactura," require at least one monitorAccess selection
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

  // Watch accountType for conditional rendering
  const accountType = form.watch("accountType");

  async function onSubmit(values: FormSchemaType) {
    setIsLoading(true);

    try {
      // Build the payload
      const payload: any = {
        accountType: values.accountType,
        firstName: values.firstName,
        lastName: values.lastName,
        username: values.username,
        phoneNumber: values.phoneNumber,
        company: values.company,
        password: values.password,
        monitorAccess: values.monitorAccess || [],
      };

      // Include email only if manufactura
      if (values.accountType === "manufactura") {
        payload.email = values.email;
      }

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful", {
        description:
          "Account created successfully. Check your email for details.",
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

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50 dark:bg-black">
        {/* Main Content: Registration Form */}
        <div className="flex-1 p-6">
          <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black dark:text-white">
                Create Account
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Fill in your details to register
              </p>
            </div>

            {/* Toggle for Account Type */}
            <div className="flex justify-center space-x-4 mb-4">
              <button
                type="button"
                onClick={() =>
                  form.setValue("accountType", "manufactura", {
                    shouldValidate: true,
                  })
                }
                className={`px-4 py-2 rounded ${
                  accountType === "manufactura"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                Manufactura
              </button>
              <button
                type="button"
                onClick={() =>
                  form.setValue("accountType", "customer", {
                    shouldValidate: true,
                  })
                }
                className={`px-4 py-2 rounded ${
                  accountType === "customer"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                Customer
              </button>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* First/Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="John"
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
                            placeholder="Doe"
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
                          placeholder="johndoe"
                          {...field}
                          className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditionally render Email field only for Manufactura */}
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
                            placeholder="john.doe@example.com"
                            {...field}
                            className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {/* Phone Number */}
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="(123) 456-7890"
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

                {/* Monitor Access as a Multi-select Dropdown for Manufactura */}
                {accountType === "manufactura" && (
                  <FormField
                    control={form.control}
                    name="monitorAccess"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monitor Access (Select Cards)</FormLabel>
                        <FormControl>
                          <select
                            multiple
                            value={field.value}
                            onChange={(e) => {
                              // Get all selected options as an array of values
                              const selected = Array.from(
                                e.target.selectedOptions,
                                (option) => option.value
                              );
                              field.onChange(selected);
                            }}
                            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-black dark:text-white border border-gray-300 rounded"
                          >
                            <option value="pressure">Pressure</option>
                            <option value="temperature">Temperature</option>
                            <option value="heat">Heat</option>
                            <option value="boiler">Boiler</option>
                          </select>
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
                          placeholder="********"
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
                          placeholder="********"
                          {...field}
                          className="bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
