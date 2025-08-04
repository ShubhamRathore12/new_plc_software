import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
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
