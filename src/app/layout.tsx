import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Grain Technik",
  description: "Next.js 15 dashboard with modern technologies",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased industrial-bg min-h-screen`}
      >
        <div className="relative min-h-screen">
          {/* Animated grid overlay */}
          <div className="fixed inset-0 z-0 opacity-10">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDUwIDUwIj48cGF0aCBkPSJNMjUgMGMtMTMuODA3IDAtMjUgMTEuMTkzLTI1IDI1czExLjE5MyAyNSAyNSAyNSAyNS0xMS4xOTMgMjUtMjVTMzguODA3IDAgMjUgMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzQ0NCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')]" />
          </div>
          
          {/* Main content */}
          <div className="relative z-10">
            <Providers children={children} />
          </div>
          
          {/* Animated corner decorations */}
          <div className="fixed top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-blue-500/30 pointer-events-none" />
          <div className="fixed top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-blue-500/30 pointer-events-none" />
          <div className="fixed bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-blue-500/30 pointer-events-none" />
          <div className="fixed bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-blue-500/30 pointer-events-none" />
        </div>
      </body>
    </html>
  );
}
