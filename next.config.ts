import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Tree-shake barrel imports: without this a single `import { X } from "lucide-react"`
  // pulls the whole icon set into the client bundle.
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "date-fns",
      "recharts",
      "antd",
      "@radix-ui/react-icons",
    ],
  },
  compiler: {
    // Strip console.* from production builds (the polling paths log a lot)
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rotechfans.in",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "tse4.mm.bing.net",
        pathname: "/th/id/**",
      },
    ],
  },
};

export default nextConfig;
