"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTheme } from "next-themes";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".contact-form", {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      className={`flex h-screen ${
        theme === "dark" ? "bg-black" : "bg-gray-50"
      }`}
    >
      <div ref={containerRef} className="flex-1 p-6">
        <h1
          className={`text-3xl font-bold mb-8 ${
            theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form className="contact-form bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2
              className={`text-2xl font-semibold mb-4 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Get in Touch
            </h2>
            <div className="mb-4">
              <label
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Name
              </label>
              <input
                type="text"
                className={`mt-1 block w-full p-2 border rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-black"
                }`}
              />
            </div>
            <div className="mb-4">
              <label
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email
              </label>
              <input
                type="email"
                className={`mt-1 block w-full p-2 border rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-black"
                }`}
              />
            </div>
            <div className="mb-4">
              <label
                className={`block text-sm font-medium ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Message
              </label>
              <textarea
                className={`mt-1 block w-full p-2 border rounded-md ${
                  theme === "dark"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-black"
                }`}
                rows={4}
              ></textarea>
            </div>
            <button
              type="submit"
              className={`w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition`}
            >
              Send Message
            </button>
          </form>

          <div className="h-80">
            <Canvas>
              <ambientLight />
              <pointLight position={[10, 10, 10]} />
              <OrbitControls />
              <Box args={[1, 1, 1]} position={[0, 0, 0]}>
                <meshStandardMaterial attach="material" color="orange" />
              </Box>
            </Canvas>
          </div>
        </div>
      </div>
    </div>
  );
}
