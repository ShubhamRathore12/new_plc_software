"use client";

import { useState, FormEvent } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, subject, message, phone, smsMessage }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponseMsg("Notification sent successfully!");
      } else {
        setResponseMsg("Error: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setResponseMsg("Error: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Send Notification
        </h2>
        <div className="mb-4">
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="border p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="recipient@example.com"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Subject</label>
          <input
            type="text"
            className="border p-2 w-full rounded"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Message</label>
          <textarea
            className="border p-2 w-full rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Your email message"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block mb-1">Phone</label>
          <input
            type="tel"
            className="border p-2 w-full rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1234567890"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">SMS Message</label>
          <textarea
            className="border p-2 w-full rounded"
            value={smsMessage}
            onChange={(e) => setSmsMessage(e.target.value)}
            placeholder="Your SMS message"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded w-full"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>
        {responseMsg && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {responseMsg}
          </p>
        )}
      </form>
    </div>
  );
}
