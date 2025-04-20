import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // อนุญาตให้การ build สำเร็จแม้จะมี ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
