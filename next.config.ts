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
    ],
  },
};

export default nextConfig;
