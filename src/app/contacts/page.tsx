"use client";

import { useMediaQuery } from "../hooks/use-media-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import dynamic from "next/dynamic";
import { useState } from "react";
import emailjs from "emailjs-com";

const Contact3D = dynamic(() => import("@/components/Contact3D"), {
  ssr: false,
});

export default function ContactPage() {
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

    try {
      await emailjs.send(
        "service_1wiy0cf", // Replace with your EmailJS Service ID
        "template_ddett7w", // Replace with your EmailJS Template ID
        formData,
        "6v7DsclIUJSPDIIyp" // Replace with your EmailJS Public Key
      );
      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      setStatus("Failed to send message. Try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-screen bg-gray-50 dark:bg-black">
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-8 text-black dark:text-white">
            Contact Us
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <form
              className="contact-form bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
              onSubmit={sendEmail}
            >
              <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">
                Get in Touch
              </h2>

              {["name", "email", "message"].map((field, index) => (
                <div className="mb-4" key={index}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  {field === "message" ? (
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                      rows={4}
                      required
                    />
                  ) : (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                      required
                    />
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={isSending}
                className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
              >
                {isSending ? "Sending..." : "Send Message"}
              </button>

              {status && (
                <p className="mt-4 text-sm text-center text-green-500 dark:text-green-400">
                  {status}
                </p>
              )}
            </form>

            <div className="h-80 flex items-center justify-center">
              <Contact3D />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}