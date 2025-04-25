import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            pathname: '**',
        },
        {
            protocol: 'https',
            hostname: 'raw.githubusercontent.com',
            pathname: '**',
        },
    ],
  },
  /* config options here */
  eslint: {
    // อนุญาตให้การ build สำเร็จแม้จะมี ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
