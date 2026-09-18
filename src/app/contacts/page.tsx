"use client";

import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useLanguage } from "@/providers/language-provider";
import { apiRequest } from "@/lib/api";
import {
  Building2,
  Clock,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";

const Contact3D = dynamic(() => import("@/components/Contact3D"), {
  ssr: false,
});

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
      // Email sending is temporarily disabled due to missing API key configuration
      setStatus("Email service is temporarily unavailable. Please try again later.");
      setIsSending(false);
      return;
      
      const data = await apiRequest("/api/send-email", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (data && data.success) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message. Try again later.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setStatus("Failed to send message. Try again later.");
    } finally {
      setIsSending(false);
    }
  };

  const fields: {
    name: "name" | "email" | "message";
    label: string;
    type: string;
  }[] = [
    { name: "name", label: t("Name"), type: "text" },
    { name: "email", label: t("Email"), type: "email" },
    { name: "message", label: t("Message"), type: "textarea" },
  ];

  const isSuccess = status.toLowerCase().includes("success");

  return (
    <DashboardLayout>
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64"
          style={{
            background:
              "radial-gradient(40rem 18rem at 15% 0%, color-mix(in oklch, var(--primary) 13%, transparent), transparent 70%), radial-gradient(34rem 16rem at 88% 6%, color-mix(in oklch, var(--chart-5) 10%, transparent), transparent 70%)",
          }}
        />

        <div className="relative mx-auto max-w-6xl pt-4 pb-10">
          <header className="animate-fade-in-up mb-6">
            <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
              <MessageSquare className="h-3.5 w-3.5" />
              {t("Contact Us")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("Get in Touch")}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-sm">
              Questions about a machine, a report or an account? Send a note and
              the Grain Technik team will pick it up.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
            {/* Form */}
            <form onSubmit={sendEmail} className="surface animate-fade-in-up p-6">
              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-1.5">
                    <label
                      htmlFor={field.name}
                      className="text-foreground block text-sm font-medium"
                    >
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name}
                        name={field.name}
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        required
                        placeholder="How can we help?"
                        className="border-border bg-background/70 focus-visible:border-ring focus-visible:ring-ring/25 w-full resize-y rounded-lg border px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus-visible:ring-[3px]"
                      />
                    ) : (
                      <input
                        id={field.name}
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required
                        autoComplete={field.name === "email" ? "email" : "name"}
                        placeholder={
                          field.name === "email" ? "you@company.com" : "Your name"
                        }
                        className="border-border bg-background/70 focus-visible:border-ring focus-visible:ring-ring/25 h-10 w-full rounded-lg border px-3 text-sm outline-none transition-[border-color,box-shadow] duration-[var(--motion-fast)] focus-visible:ring-[3px]"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 mt-5 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-[var(--shadow-sm)] transition-[background-color,box-shadow,transform] duration-[var(--motion-fast)] outline-none hover:shadow-[var(--shadow-md)] focus-visible:ring-2 active:scale-[0.99] disabled:opacity-60"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isSending ? t("Sending...") : t("Send Message")}
              </button>

              {status && (
                <p
                  className={`animate-fade-in mt-4 rounded-lg border px-3 py-2 text-center text-sm ${
                    isSuccess
                      ? "border-success/30 bg-success/10 text-success"
                      : "border-warning/30 bg-warning/10 text-warning"
                  }`}
                >
                  {t(status)}
                </p>
              )}
            </form>

            {/* Side panel */}
            <div className="flex flex-col gap-5">
              <div className="surface animate-fade-in-up overflow-hidden p-0">
                <div className="flex h-64 items-center justify-center">
                  <Contact3D />
                </div>
              </div>

              <div className="surface animate-fade-in-up space-y-3 p-5">
                {[
                  { icon: Building2, label: "Application", value: "Grain Technik" },
                  {
                    icon: Phone,
                    label: "Phone",
                    value: "+91-9217845040",
                  },
                  {
                    icon: Mail,
                    label: "Mail",
                    value: "service@graintechnik.com",
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="bg-accent text-accent-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-[11px] font-medium">
                        {label}
                      </p>
                      <p className="truncate text-sm font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
