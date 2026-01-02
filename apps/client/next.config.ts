import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "../..", // Point to monorepo root
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Remove the deprecated images.domains if you have it
};

export default nextConfig;